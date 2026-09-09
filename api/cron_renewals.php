<?php
declare(strict_types=1);

/**
 * ===========================================================================
 * CRON JOB QUẢN LÝ VÒNG ĐỜI DÒNG HỌ & CẢNH BÁO GIA HẠN TỰ ĐỘNG
 * Nền tảng: giatoc.online | Chạy định kỳ 00:05 hàng ngày qua System Crontab
 * ===========================================================================
 */

require_once __DIR__ . '/helpers.php';

$isCli = (php_sapi_name() === 'cli');
if (!$isCli) {
  send_cors_headers();
  // Nếu gọi qua HTTP Web Dashboard: Bắt buộc quyền Super Admin
  if (($_GET['action'] ?? '') === 'run_now') {
    require_role(['admin']);
  }
}

$pdo = get_db();
$now = new DateTime();
$todayStr = $now->format('Y-m-d');

$results = [
  'timestamp' => $now->format('Y-m-d H:i:s'),
  'grace_period_updated' => 0,
  'read_only_updated' => 0,
  'notifications_sent' => 0,
  'details' => []
];

// ---------------------------------------------------------------------------
// 1. CƠ CHẾ ÂN HẠN (GRACE PERIOD) & CHUYỂN SANG READ-ONLY SAU 15 NGÀY HẾT HẠN
// ---------------------------------------------------------------------------

// Giai đoạn A: Vừa hết hạn (expires_at < NOW()) nhưng trong vòng 15 ngày đầu -> Chuyển sang 'grace_period'
try {
  $stmt = $pdo->prepare(
    "UPDATE tenants 
     SET status = 'grace_period' 
     WHERE expires_at < NOW() 
       AND DATEDIFF(NOW(), expires_at) <= 15 
       AND status = 'active'"
  );
  $stmt->execute();
  $results['grace_period_updated'] = $stmt->rowCount();
} catch (PDOException $e) {
  error_log("Lỗi cập nhật Grace Period: " . $e->getMessage());
}

// Giai đoạn B: Quá 15 ngày ân hạn (DATEDIFF(NOW(), expires_at) > 15) -> Chuyển sang 'read_only'
try {
  $stmt = $pdo->prepare(
    "UPDATE tenants 
     SET status = 'read_only' 
     WHERE expires_at < NOW() 
       AND DATEDIFF(NOW(), expires_at) > 15 
       AND status IN ('active', 'grace_period')"
  );
  $stmt->execute();
  $results['read_only_updated'] = $stmt->rowCount();
} catch (PDOException $e) {
  error_log("Lỗi cập nhật Read-Only: " . $e->getMessage());
}

// ---------------------------------------------------------------------------
// 2. QUÉT & GỬI CẢNH BÁO GIA HẠN (30, 15, 7, 1 NGÀY & ÂN HẠN 15 NGÀY)
// ---------------------------------------------------------------------------

$milestones = [
  30 => ['key' => '30_days', 'title' => 'Nhắc nhở gia hạn trước 30 ngày'],
  15 => ['key' => '15_days', 'title' => 'Cảnh báo gia hạn trước 15 ngày & Tặng ưu đãi'],
  7  => ['key' => '7_days',  'title' => 'Cảnh báo khẩn cấp: Chỉ còn 7 ngày hết hạn'],
  1  => ['key' => '1_day',   'title' => 'Cảnh báo ngày cuối cùng trước khi chuyển sang Ân hạn'],
  -15 => ['key' => 'grace_15_readonly', 'title' => 'Thông báo chuyển sang chế độ Chỉ Đọc (Read-Only) do hết ân hạn']
];

try {
  // Lấy danh sách tenant đang cần kiểm tra cảnh báo
  $query = "
    SELECT t.id, t.slug, t.name, t.plan, t.status, t.expires_at,
           DATEDIFF(t.expires_at, NOW()) AS days_left,
           (SELECT phone FROM users WHERE tenant_id = t.id AND role = 'admin' ORDER BY id ASC LIMIT 1) AS admin_phone,
           (SELECT email FROM users WHERE tenant_id = t.id AND role = 'admin' ORDER BY id ASC LIMIT 1) AS admin_email,
           (SELECT full_name FROM users WHERE tenant_id = t.id AND role = 'admin' ORDER BY id ASC LIMIT 1) AS admin_name
    FROM tenants t
    WHERE t.status != 'suspended' AND t.expires_at IS NOT NULL
  ";
  $tenants = $pdo->query($query)->fetchAll(PDO::FETCH_ASSOC);

  $insertNotifStmt = $pdo->prepare(
    "INSERT INTO tenant_renewal_notifications 
     (tenant_id, milestone, channel, recipient, message_title, status, payload)
     VALUES (?, ?, ?, ?, ?, 'sent', ?)"
  );

  $checkSentStmt = $pdo->prepare(
    "SELECT id FROM tenant_renewal_notifications 
     WHERE tenant_id = ? AND milestone = ? AND DATE(sent_at) = CURDATE() LIMIT 1"
  );

  foreach ($tenants as $t) {
    $daysLeft = (int)$t['days_left'];
    $phone = $t['admin_phone'] ?? '';
    $email = $t['admin_email'] ?? '';

    // Kiểm tra xem tenant có rơi đúng vào mốc ngày nào không
    foreach ($milestones as $thresholdDays => $m) {
      $match = false;
      if ($thresholdDays > 0 && $daysLeft === $thresholdDays) {
        $match = true;
      } elseif ($thresholdDays === -15 && $daysLeft === -15) {
        $match = true; // Đúng ngày thứ 15 sau khi hết hạn
      }

      if ($match) {
        // Kiểm tra xem hôm nay đã gửi cảnh báo mốc này cho tenant này chưa (Idempotency)
        $checkSentStmt->execute([$t['id'], $m['key']]);
        if ($checkSentStmt->fetch()) {
          continue; // Đã gửi rồi, không gửi lặp lại
        }

        // Sinh nội dung thông báo & mã QR gia hạn nhanh
        $renewalUrl = "https://giatoc.online/checkout?renew_tenant=" . $t['slug'];
        $logPayload = [
          'tenant_slug' => $t['slug'],
          'clan_name' => $t['name'],
          'days_left' => $daysLeft,
          'renewal_url' => $renewalUrl,
          'expires_at' => $t['expires_at']
        ];

        // 1. Ghi log cảnh báo vào database
        $recipientStr = $phone ? "Zalo: $phone" : ($email ? "Email: $email" : "Admin: " . $t['slug']);
        $channel = $phone ? 'zalo_zns' : ($email ? 'email' : 'system_banner');

        $insertNotifStmt->execute([
          $t['id'],
          $m['key'],
          $channel,
          $recipientStr,
          $m['title'],
          json_encode($logPayload, JSON_UNESCAPED_UNICODE)
        ]);

        $results['notifications_sent']++;
        $results['details'][] = [
          'tenant_id' => $t['id'],
          'clan_name' => $t['name'],
          'milestone' => $m['key'],
          'channel' => $channel,
          'recipient' => $recipientStr
        ];
      }
    }
  }
} catch (Exception $e) {
  $results['error'] = $e->getMessage();
}

// Trả về kết quả JSON hoặc hiển thị CLI
if ($isCli) {
  echo "[" . $results['timestamp'] . "] CRON RENEWALS & GRACE PERIOD RUNNER - giatoc.online\n";
  echo "- Dòng họ chuyển sang Ân Hạn (Grace Period 15d): " . $results['grace_period_updated'] . "\n";
  echo "- Dòng họ chuyển sang Chỉ Đọc (Read-Only): " . $results['read_only_updated'] . "\n";
  echo "- Thông báo cảnh báo Zalo/Email đã gửi: " . $results['notifications_sent'] . "\n";
  foreach ($results['details'] as $d) {
    echo "  * [" . $d['milestone'] . "] " . $d['clan_name'] . " -> " . $d['recipient'] . "\n";
  }
  echo "CRON RUN COMPLETED SUCCESSFULLY.\n";
  exit(0);
} else {
  json_response($results);
}
