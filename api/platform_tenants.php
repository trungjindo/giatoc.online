<?php
require_once __DIR__ . '/helpers.php';
send_cors_headers();

$action = $_GET['action'] ?? 'list';
$pdo = get_db();
$superUser = require_role(['admin']);

// ---------------------------------------------------------------------------
// 1. Danh sách toàn bộ 50+ Dòng Họ kèm chỉ số thời gian thực
// ---------------------------------------------------------------------------
if ($action === 'list') {
  try {
    $stmt = $pdo->query(
      'SELECT t.*,
              (SELECT username FROM users WHERE tenant_id = t.id AND role = "admin" ORDER BY id ASC LIMIT 1) AS admin_username,
              (SELECT full_name FROM users WHERE tenant_id = t.id AND role = "admin" ORDER BY id ASC LIMIT 1) AS admin_full_name
       FROM tenants t
       ORDER BY t.id ASC'
    );
    $rows = $stmt->fetchAll();
  } catch (PDOException $e) {
    json_error('Lỗi truy vấn danh sách dòng họ: ' . $e->getMessage(), 500);
  }

  $now = new DateTime();

  $tenants = array_map(function ($r) use ($now, $pdo) {
    $tId = (int)$r['id'];

    // Đếm số thành viên thực tế từ familyData
    $memberCount = 0;
    try {
      $stmtApp = $pdo->prepare("SELECT data_json FROM app_data WHERE tenant_id = ? AND data_key = 'familyData'");
      $stmtApp->execute([$tId]);
      $appRow = $stmtApp->fetch();
      if ($appRow && !empty($appRow['data_json'])) {
        $tree = json_decode($appRow['data_json'], true);
        $countMembers = function ($node) use (&$countMembers, &$memberCount) {
          if (!is_array($node)) return;
          $memberCount++;
          foreach ($node['children'] ?? [] as $c) $countMembers($c);
        };
        $countMembers($tree);
      }
    } catch (Exception $e) {}

    // Tính dung lượng lưu trữ thực tế đã dùng trong uploads/tenant_{id}
    $storageUsedMb = 0;
    $uploadDir = __DIR__ . '/../storage/uploads/tenant_' . $tId;
    if (is_dir($uploadDir)) {
      $totalBytes = 0;
      foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($uploadDir, FilesystemIterator::SKIP_DOTS)) as $file) {
        $totalBytes += $file->getSize();
      }
      $storageUsedMb = round($totalBytes / (1024 * 1024), 2);
    }

    // Tính số ngày còn lại đến khi hết hạn
    $expiresAt = !empty($r['expires_at']) ? new DateTime($r['expires_at']) : null;
    $daysLeft = $expiresAt ? (int)$now->diff($expiresAt)->format('%r%a') : 999;

    $expStatus = 'active';
    if ($r['status'] === 'suspended') {
      $expStatus = 'suspended';
    } elseif ($daysLeft <= 0) {
      $expStatus = 'expired';
    } elseif ($daysLeft <= 7) {
      $expStatus = 'warning_7';
    } elseif ($daysLeft <= 15) {
      $expStatus = 'warning_15';
    } elseif ($daysLeft <= 30) {
      $expStatus = 'warning_30';
    }

    return [
      'id' => $tId,
      'slug' => $r['slug'],
      'name' => $r['name'],
      'customDomain' => $r['custom_domain'],
      'fullDomain' => $r['slug'] . '.giatoc.online',
      'plan' => $r['plan'],
      'memberLimit' => (int)$r['member_limit'],
      'memberCount' => $memberCount,
      'storageLimitMb' => (int)$r['storage_limit_mb'],
      'storageUsedMb' => $storageUsedMb,
      'adminLimit' => (int)$r['admin_limit'],
      'znsBalance' => (float)$r['zns_balance'],
      'status' => $r['status'],
      'expirationStatus' => $expStatus,
      'daysLeft' => $daysLeft,
      'expiresAt' => $r['expires_at'],
      'createdAt' => $r['created_at'],
      'adminUsername' => $r['admin_username'] ?? 'admin',
      'adminFullName' => $r['admin_full_name'] ?? 'Quản trị viên',
    ];
  }, $rows);

  json_response($tenants);
}

// ---------------------------------------------------------------------------
// 2. Gia hạn gói dịch vụ (Renew Subscription)
// ---------------------------------------------------------------------------
if ($action === 'renew' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $body = read_json_body();
  $tenantId = (int)($body['tenantId'] ?? 0);
  $years = max(1, (int)($body['years'] ?? 1));

  if ($tenantId <= 0) json_error('Thiếu mã dòng họ.', 400);

  try {
    // Nếu đã hết hạn -> gia hạn tính từ thời điểm hiện tại, nếu còn hạn -> cộng nối tiếp
    $stmt = $pdo->prepare('SELECT expires_at FROM tenants WHERE id = ?');
    $stmt->execute([$tenantId]);
    $row = $stmt->fetch();
    if (!$row) json_error('Không tìm thấy dòng họ.', 404);

    $now = new DateTime();
    $exp = !empty($row['expires_at']) ? new DateTime($row['expires_at']) : $now;
    if ($exp < $now) {
      $stmt = $pdo->prepare("UPDATE tenants SET expires_at = DATE_ADD(NOW(), INTERVAL ? YEAR), status = 'active' WHERE id = ?");
    } else {
      $stmt = $pdo->prepare("UPDATE tenants SET expires_at = DATE_ADD(expires_at, INTERVAL ? YEAR), status = 'active' WHERE id = ?");
    }
    $stmt->execute([$years, $tenantId]);

    $stmt = $pdo->prepare('SELECT expires_at, status FROM tenants WHERE id = ?');
    $stmt->execute([$tenantId]);
    $updated = $stmt->fetch();

    json_response([
      'success' => true,
      'message' => "Đã gia hạn thành công thêm $years năm!",
      'newExpiresAt' => $updated['expires_at']
    ]);
  } catch (PDOException $e) {
    json_error('Lỗi khi gia hạn: ' . $e->getMessage(), 500);
  }
}

// ---------------------------------------------------------------------------
// 3. Nâng cấp / Chuyển đổi gói cước (Change Plan)
// ---------------------------------------------------------------------------
if ($action === 'change_plan' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $body = read_json_body();
  $tenantId = (int)($body['tenantId'] ?? 0);
  $newPlan = $body['plan'] ?? 'standard';

  $planLimits = [
    'basic' => ['member_limit' => 300, 'storage_limit_mb' => 2048, 'admin_limit' => 2],
    'standard' => ['member_limit' => 1500, 'storage_limit_mb' => 10240, 'admin_limit' => 5],
    'premium' => ['member_limit' => 5000, 'storage_limit_mb' => 30720, 'admin_limit' => 15],
    'unlimited' => ['member_limit' => 100000, 'storage_limit_mb' => 102400, 'admin_limit' => 999],
  ];

  $limits = $planLimits[$newPlan] ?? $planLimits['standard'];

  try {
    $stmt = $pdo->prepare(
      'UPDATE tenants SET plan = ?, member_limit = ?, storage_limit_mb = ?, admin_limit = ? WHERE id = ?'
    );
    $stmt->execute([$newPlan, $limits['member_limit'], $limits['storage_limit_mb'], $limits['admin_limit'], $tenantId]);

    json_response([
      'success' => true,
      'message' => "Đã chuyển dòng họ sang gói " . strtoupper($newPlan) . " thành công!"
    ]);
  } catch (PDOException $e) {
    json_error('Lỗi cập nhật gói cước: ' . $e->getMessage(), 500);
  }
}

// ---------------------------------------------------------------------------
// 4. Khóa / Mở khóa website dòng họ (Toggle Status)
// ---------------------------------------------------------------------------
if ($action === 'toggle_status' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $body = read_json_body();
  $tenantId = (int)($body['tenantId'] ?? 0);
  $newStatus = $body['status'] ?? 'active';

  if (!in_array($newStatus, ['active', 'suspended', 'expired'], true)) {
    json_error('Trạng thái không hợp lệ.', 400);
  }

  try {
    $stmt = $pdo->prepare('UPDATE tenants SET status = ? WHERE id = ?');
    $stmt->execute([$newStatus, $tenantId]);

    json_response([
      'success' => true,
      'message' => "Đã chuyển trạng thái website sang '$newStatus'!"
    ]);
  } catch (PDOException $e) {
    json_error('Lỗi khi đổi trạng thái: ' . $e->getMessage(), 500);
  }
}

// ---------------------------------------------------------------------------
// 5. Cấp lại mật khẩu Quản trị dòng họ (Reset Admin Password)
// ---------------------------------------------------------------------------
if ($action === 'reset_admin_password' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $body = read_json_body();
  $tenantId = (int)($body['tenantId'] ?? 0);
  $newPassword = $body['newPassword'] ?? '';

  if ($tenantId <= 0 || strlen($newPassword) < 6) {
    json_error('Mật khẩu mới phải có ít nhất 6 ký tự.', 400);
  }

  $hash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 10]);

  try {
    $stmt = $pdo->prepare('UPDATE users SET password_hash = ? WHERE tenant_id = ? AND role = "admin" LIMIT 1');
    $stmt->execute([$hash, $tenantId]);

    json_response([
      'success' => true,
      'message' => 'Đã đặt lại mật khẩu cho tài khoản Admin của dòng họ thành công!'
    ]);
  } catch (PDOException $e) {
    json_error('Lỗi đổi mật khẩu: ' . $e->getMessage(), 500);
  }
}

json_error('Action not allowed', 405);
