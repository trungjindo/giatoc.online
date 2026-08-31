<?php
require_once __DIR__ . '/helpers.php';
send_cors_headers();

$action = $_GET['action'] ?? '';
$pdo = get_db();

// ---------------------------------------------------------------------------
// 1. Kiểm tra tính khả dụng của Subdomain / Slug
// ---------------------------------------------------------------------------
if ($action === 'check_slug') {
  $slug = strtolower(trim($_GET['slug'] ?? ''));

  if ($slug === '') {
    json_error('Vui lòng nhập tên subdomain.', 400);
  }

  if (!preg_match('/^[a-z0-9][a-z0-9\-]{1,28}[a-z0-9]$/', $slug)) {
    json_response([
      'available' => false,
      'message' => 'Subdomain phải từ 3-30 ký tự, chỉ chứa chữ thường (a-z), số (0-9) và dấu gạch ngang (-).'
    ]);
  }

  $reserved = ['www', 'api', 'admin', 'super-admin', 'superadmin', 'demo', 'portal', 'mail', 'app', 'giatoc', 'system', 'root', 'support', 'help'];
  if (in_array($slug, $reserved, true)) {
    json_response([
      'available' => false,
      'message' => "Tên '$slug' là từ khóa hệ thống, vui lòng chọn tên khác."
    ]);
  }

  try {
    $stmt = $pdo->prepare('SELECT id FROM tenants WHERE slug = ?');
    $stmt->execute([$slug]);
    if ($stmt->fetch()) {
      json_response([
        'available' => false,
        'message' => "Subdomain '$slug.giatoc.online' đã được dòng họ khác đăng ký!"
      ]);
    }

    $stmt = $pdo->prepare("SELECT id FROM orders WHERE slug = ? AND payment_status = 'pending' AND created_at > (NOW() - INTERVAL 24 HOUR)");
    $stmt->execute([$slug]);
    if ($stmt->fetch()) {
      json_response([
        'available' => false,
        'message' => "Subdomain '$slug' đang có đơn hàng chờ thanh toán. Vui lòng thử lại sau hoặc chọn tên khác."
      ]);
    }
  } catch (PDOException $e) {}

  json_response([
    'available' => true,
    'slug' => $slug,
    'fullDomain' => $slug . '.giatoc.online',
    'message' => "Tuyệt vời! Subdomain '$slug.giatoc.online' hoàn toàn khả dụng."
  ]);
}

// ---------------------------------------------------------------------------
// 2. Tạo đơn hàng mới & Sinh mã VietQR MBBank
// ---------------------------------------------------------------------------
if ($action === 'create' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $body = read_json_body();

  $plan = $body['plan'] ?? 'standard';
  $domainType = $body['domainType'] ?? 'subdomain';
  $slug = strtolower(trim($body['slug'] ?? ''));
  $customDomain = trim($body['customDomain'] ?? '') ?: null;
  $clanName = trim($body['clanName'] ?? '');
  $adminName = trim($body['adminName'] ?? '');
  $adminPhone = trim($body['adminPhone'] ?? '');
  $adminEmail = trim($body['adminEmail'] ?? '');
  $adminUsername = trim($body['adminUsername'] ?? '');
  $adminPassword = $body['adminPassword'] ?? '';
  $billingCycleYears = max(1, (int)($body['billingCycleYears'] ?? 1));

  if ($clanName === '' || $adminName === '' || $adminPhone === '' || $adminEmail === '' || $adminUsername === '' || $adminPassword === '') {
    json_error('Vui lòng điền đầy đủ tất cả thông tin đăng ký.', 400);
  }

  if ($slug === '' || !preg_match('/^[a-z0-9][a-z0-9\-]{1,28}[a-z0-9]$/', $slug)) {
    json_error('Tên Subdomain không hợp lệ (3-30 ký tự chữ và số).', 400);
  }

  // Bảng giá dịch vụ theo năm (VNĐ)
  $planPrices = [
    'basic' => 590000,
    'standard' => 1290000,
    'premium' => 2490000,
    'unlimited' => 4990000,
  ];

  $basePrice = $planPrices[$plan] ?? $planPrices['standard'];
  $amount = $basePrice * $billingCycleYears;

  // Giảm giá theo chu kỳ năm
  if ($billingCycleYears === 2) {
    $amount = (int)($amount * 0.9); // Giảm 10%
  } elseif ($billingCycleYears >= 3) {
    $amount = (int)($amount * 0.8); // Giảm 20%
  }

  // Sinh mã đơn hàng duy nhất: GT + 5 số ngẫu nhiên (ví dụ GT10839)
  $orderCode = 'GT' . rand(10000, 99999);
  $passwordHash = password_hash($adminPassword, PASSWORD_BCRYPT, ['cost' => 10]);

  try {
    $stmt = $pdo->prepare(
      'INSERT INTO orders (order_code, plan, domain_type, slug, custom_domain, clan_name, admin_name,
                           admin_phone, admin_email, admin_username, admin_password_hash, billing_cycle_years,
                           amount, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
      $orderCode, $plan, $domainType, $slug, $customDomain, $clanName, $adminName,
      $adminPhone, $adminEmail, $adminUsername, $passwordHash, $billingCycleYears,
      $amount, 'pending'
    ]);
    $orderId = (int)$pdo->lastInsertId();
  } catch (PDOException $e) {
    json_error('Lỗi khi tạo đơn hàng: ' . $e->getMessage(), 500);
  }

  // Đọc thông tin ngân hàng nhận tiền từ cấu hình
  $bankCode = 'MB';
  $accountNumber = '99997379999';
  $accountName = 'TRẦN ĐÌNH TRUNG';
  try {
    $stmt = $pdo->query('SELECT setting_key, setting_value FROM platform_settings');
    $rows = $stmt->fetchAll();
    foreach ($rows as $r) {
      if ($r['setting_key'] === 'bank_code') $bankCode = $r['setting_value'];
      if ($r['setting_key'] === 'account_number') $accountNumber = $r['setting_value'];
      if ($r['setting_key'] === 'account_name') $accountName = $r['setting_value'];
    }
  } catch (PDOException $e) {}

  // Link ảnh VietQR động
  $accountNameEnc = rawurlencode($accountName);
  $qrUrl = "https://img.vietqr.io/image/{$bankCode}-{$accountNumber}-compact2.png?amount={$amount}&addInfo={$orderCode}&accountName={$accountNameEnc}";

  json_response([
    'success' => true,
    'orderId' => $orderId,
    'orderCode' => $orderCode,
    'amount' => $amount,
    'plan' => $plan,
    'slug' => $slug,
    'fullDomain' => $slug . '.giatoc.online',
    'bankInfo' => [
      'bankCode' => $bankCode,
      'bankName' => 'Ngân Hàng Quân Đội (MBBank)',
      'accountNumber' => $accountNumber,
      'accountName' => $accountName,
      'transferContent' => $orderCode,
      'qrUrl' => $qrUrl,
    ]
  ], 201);
}

// ---------------------------------------------------------------------------
// 3. Lấy chi tiết đơn hàng (Dành cho khách xem trạng thái thanh toán)
// ---------------------------------------------------------------------------
if ($action === 'get_order') {
  $orderCode = trim($_GET['order_code'] ?? '');
  if ($orderCode === '') json_error('Thiếu mã đơn hàng.', 400);

  try {
    $stmt = $pdo->prepare(
      'SELECT id, order_code, plan, domain_type, slug, custom_domain, clan_name, admin_name,
              admin_phone, admin_email, admin_username, billing_cycle_years, amount,
              payment_status, tenant_id, created_at, paid_at
       FROM orders WHERE order_code = ?'
    );
    $stmt->execute([$orderCode]);
    $order = $stmt->fetch();
  } catch (PDOException $e) {
    json_error('Lỗi khi truy vấn đơn hàng.', 500);
  }

  if (!$order) json_error('Không tìm thấy đơn hàng.', 404);

  // Sinh lại mã QR
  $bankCode = 'MB';
  $accountNumber = '99997379999';
  $accountName = 'TRẦN ĐÌNH TRUNG';
  try {
    $stmt = $pdo->query('SELECT setting_key, setting_value FROM platform_settings');
    foreach ($stmt->fetchAll() as $r) {
      if ($r['setting_key'] === 'bank_code') $bankCode = $r['setting_value'];
      if ($r['setting_key'] === 'account_number') $accountNumber = $r['setting_value'];
      if ($r['setting_key'] === 'account_name') $accountName = $r['setting_value'];
    }
  } catch (PDOException $e) {}

  $accountNameEnc = rawurlencode($accountName);
  $qrUrl = "https://img.vietqr.io/image/{$bankCode}-{$accountNumber}-compact2.png?amount={$order['amount']}&addInfo={$order['order_code']}&accountName={$accountNameEnc}";

  json_response([
    'order' => [
      'id' => (int)$order['id'],
      'orderCode' => $order['order_code'],
      'plan' => $order['plan'],
      'slug' => $order['slug'],
      'fullDomain' => $order['slug'] . '.giatoc.online',
      'clanName' => $order['clan_name'],
      'adminName' => $order['admin_name'],
      'adminPhone' => $order['admin_phone'],
      'adminEmail' => $order['admin_email'],
      'adminUsername' => $order['admin_username'],
      'billingCycleYears' => (int)$order['billing_cycle_years'],
      'amount' => (float)$order['amount'],
      'paymentStatus' => $order['payment_status'],
      'tenantId' => $order['tenant_id'] !== null ? (int)$order['tenant_id'] : null,
      'createdAt' => $order['created_at'],
      'paidAt' => $order['paid_at'],
    ],
    'bankInfo' => [
      'bankCode' => $bankCode,
      'bankName' => 'Ngân Hàng Quân Đội (MBBank)',
      'accountNumber' => $accountNumber,
      'accountName' => $accountName,
      'transferContent' => $order['order_code'],
      'qrUrl' => $qrUrl,
    ]
  ]);
}

// ---------------------------------------------------------------------------
// 4. Danh sách đơn hàng (Dành cho Platform Super Admin)
// ---------------------------------------------------------------------------
if ($action === 'list_admin') {
  require_role(['admin']);

  try {
    $stmt = $pdo->query(
      'SELECT o.*, t.name AS tenant_name, t.status AS tenant_status
       FROM orders o
       LEFT JOIN tenants t ON t.id = o.tenant_id
       ORDER BY o.id DESC'
    );
    $rows = $stmt->fetchAll();
  } catch (PDOException $e) {
    json_error('Lỗi khi lấy danh sách đơn hàng: ' . $e->getMessage(), 500);
  }

  $orders = array_map(function ($r) {
    return [
      'id' => (int)$r['id'],
      'orderCode' => $r['order_code'],
      'plan' => $r['plan'],
      'domainType' => $r['domain_type'],
      'slug' => $r['slug'],
      'fullDomain' => $r['slug'] . '.giatoc.online',
      'customDomain' => $r['custom_domain'],
      'clanName' => $r['clan_name'],
      'adminName' => $r['admin_name'],
      'adminPhone' => $r['admin_phone'],
      'adminEmail' => $r['admin_email'],
      'adminUsername' => $r['admin_username'],
      'billingCycleYears' => (int)$r['billing_cycle_years'],
      'amount' => (float)$r['amount'],
      'paymentStatus' => $r['payment_status'],
      'tenantId' => $r['tenant_id'] !== null ? (int)$r['tenant_id'] : null,
      'tenantName' => $r['tenant_name'] ?? null,
      'tenantStatus' => $r['tenant_status'] ?? null,
      'createdAt' => $r['created_at'],
      'paidAt' => $r['paid_at'],
    ];
  }, $rows);

  json_response($orders);
}

// ---------------------------------------------------------------------------
// 5. Xác nhận thanh toán & Tự động Khởi tạo Website Dòng Họ (Auto-Provisioning)
// ---------------------------------------------------------------------------
if ($action === 'confirm_payment' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $superUser = require_role(['admin']);
  $body = read_json_body();
  $orderId = (int)($body['orderId'] ?? 0);
  $orderCode = trim($body['orderCode'] ?? '');

  if ($orderId <= 0 && $orderCode === '') {
    json_error('Thiếu mã đơn hàng cần xác nhận.', 400);
  }

  try {
    if ($orderId > 0) {
      $stmt = $pdo->prepare('SELECT * FROM orders WHERE id = ?');
      $stmt->execute([$orderId]);
    } else {
      $stmt = $pdo->prepare('SELECT * FROM orders WHERE order_code = ?');
      $stmt->execute([$orderCode]);
    }
    $order = $stmt->fetch();
  } catch (PDOException $e) {
    json_error('Lỗi truy vấn đơn hàng.', 500);
  }

  if (!$order) json_error('Không tìm thấy đơn hàng.', 404);
  if ($order['payment_status'] === 'paid') {
    json_error('Đơn hàng này đã được xác nhận thanh toán trước đó.', 400);
  }

  // Bắt đầu Transaction tạo Tenant và khởi tạo dữ liệu
  $pdo->beginTransaction();
  try {
    // 1. Xác định hạn mức theo gói
    $planLimits = [
      'basic' => ['member_limit' => 300, 'storage_limit_mb' => 2048, 'admin_limit' => 2, 'zns' => 50],
      'standard' => ['member_limit' => 1500, 'storage_limit_mb' => 10240, 'admin_limit' => 5, 'zns' => 200],
      'premium' => ['member_limit' => 5000, 'storage_limit_mb' => 30720, 'admin_limit' => 15, 'zns' => 500],
      'unlimited' => ['member_limit' => 100000, 'storage_limit_mb' => 102400, 'admin_limit' => 999, 'zns' => 1500],
    ];
    $limits = $planLimits[$order['plan']] ?? $planLimits['standard'];
    $years = (int)$order['billing_cycle_years'];

    // 2. Tạo Tenant mới
    $stmt = $pdo->prepare(
      "INSERT INTO tenants (slug, custom_domain, name, plan, member_limit, storage_limit_mb, admin_limit,
                            expires_at, status, zns_balance)
       VALUES (?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL $years YEAR), 'active', ?)"
    );
    $stmt->execute([
      $order['slug'],
      $order['custom_domain'] ?: null,
      $order['clan_name'],
      $order['plan'],
      $limits['member_limit'],
      $limits['storage_limit_mb'],
      $limits['admin_limit'],
      $limits['zns'] * 400 // Giá trị ví ZNS ban đầu (ví dụ 400đ/tin)
    ]);
    $newTenantId = (int)$pdo->lastInsertId();

    // 3. Tạo tài khoản Super Admin dòng họ
    $stmt = $pdo->prepare(
      'INSERT INTO users (tenant_id, username, password_hash, full_name, role, chi_id)
       VALUES (?, ?, ?, ?, ?, NULL)'
    );
    $stmt->execute([
      $newTenantId,
      $order['admin_username'],
      $order['admin_password_hash'],
      $order['admin_name'],
      'admin'
    ]);

    // 4. Khởi tạo cấu hình mặc định (site_settings)
    $stmt = $pdo->prepare('INSERT INTO site_settings (tenant_id, setting_key, setting_value) VALUES (?, ?, ?)');
    $stmt->execute([$newTenantId, 'te_ho_day', '0']);
    $stmt->execute([$newTenantId, 'te_ho_month', '0']);
    $stmt->execute([$newTenantId, 'contact_phone', $order['admin_phone']]);
    $stmt->execute([$newTenantId, 'contact_email', $order['admin_email']]);

    // 5. Khởi tạo dữ liệu mẫu mặc định (app_data)
    $initialTree = [
      'id' => 'root_1',
      'name' => 'Cụ Tổ Khởi Tổ (' . $order['clan_name'] . ')',
      'generation' => 1,
      'gender' => 'Nam',
      'isAlive' => false,
      'isMainLineage' => true,
      'isRegistered' => true,
      'spouses' => [['name' => 'Cụ Bà Chính Thất', 'order' => 1]],
      'description' => 'Cụ khởi lập gia tộc ' . $order['clan_name'],
      'children' => []
    ];

    $initialAbout = [
      'image' => '',
      'content' => 'Chào mừng quý vị và toàn thể các thế hệ con cháu đến với trang gia phả điện tử của ' . $order['clan_name'] . '. Nơi lưu giữ cội nguồn và kết nối muôn đời.',
      'highlights' => [
        'Truyền thống hiếu học và khoa bảng',
        'Đoàn kết tương thân tương ái',
        'Gìn giữ gia phong dòng tộc'
      ]
    ];

    $initialFinance = [
      'openingBalance' => 0,
      'transactions' => []
    ];

    $initialContact = [
      'name' => $order['admin_name'],
      'phone' => $order['admin_phone'],
      'email' => $order['admin_email'],
      'address' => ''
    ];

    $stmtApp = $pdo->prepare('INSERT INTO app_data (tenant_id, data_key, data_json) VALUES (?, ?, ?)');
    $stmtApp->execute([$newTenantId, 'familyData', json_encode($initialTree, JSON_UNESCAPED_UNICODE)]);
    $stmtApp->execute([$newTenantId, 'aboutData', json_encode($initialAbout, JSON_UNESCAPED_UNICODE)]);
    $stmtApp->execute([$newTenantId, 'financeData', json_encode($initialFinance, JSON_UNESCAPED_UNICODE)]);
    $stmtApp->execute([$newTenantId, 'contactAdminData', json_encode($initialContact, JSON_UNESCAPED_UNICODE)]);
    $stmtApp->execute([$newTenantId, 'newsData', json_encode([], JSON_UNESCAPED_UNICODE)]);
    $stmtApp->execute([$newTenantId, 'bannerData', json_encode([], JSON_UNESCAPED_UNICODE)]);
    $stmtApp->execute([$newTenantId, 'galleryData', json_encode([], JSON_UNESCAPED_UNICODE)]);

    // 6. Cập nhật trạng thái đơn hàng thành Paid
    $stmt = $pdo->prepare(
      "UPDATE orders SET payment_status = 'paid', paid_at = NOW(), tenant_id = ?, confirmed_by = ?
       WHERE id = ?"
    );
    $stmt->execute([$newTenantId, $superUser['id'], $order['id']]);

    $pdo->commit();

    json_response([
      'success' => true,
      'message' => "Đã kích hoạt thành công website cho '" . $order['clan_name'] . "'!",
      'tenant' => [
        'id' => $newTenantId,
        'slug' => $order['slug'],
        'clanName' => $order['clan_name'],
        'adminUsername' => $order['admin_username'],
        'accessUrl' => "https://" . $order['slug'] . ".giatoc.online",
        'localDevUrl' => "http://localhost:5173/?tenant=" . $order['slug']
      ]
    ]);
  } catch (Exception $e) {
    $pdo->rollBack();
    json_error('Lỗi kích hoạt website: ' . $e->getMessage(), 500);
  }
}

json_error('Action not allowed', 405);
