<?php
require_once __DIR__ . '/helpers.php';
send_cors_headers();

$pdo = get_db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  try {
    $stmt = $pdo->query('SELECT setting_key, setting_value FROM platform_settings');
    $rows = $stmt->fetchAll();
    $settings = [];
    foreach ($rows as $r) {
      $settings[$r['setting_key']] = $r['setting_value'];
    }
    json_response($settings);
  } catch (PDOException $e) {
    // Default fallback
    json_response([
      'bank_code' => 'MB',
      'bank_name' => 'Ngân Hàng Quân Đội (MBBank)',
      'account_number' => '99997379999',
      'account_name' => 'TRẦN ĐÌNH TRUNG',
      'hotline' => '0912345678',
      'zalo_support' => '0912345678',
      'email_support' => 'hotro@giatoc.online'
    ]);
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  require_role(['admin']);
  $body = read_json_body();

  $allowedKeys = ['bank_code', 'bank_name', 'account_number', 'account_name', 'hotline', 'zalo_support', 'email_support'];

  try {
    $stmt = $pdo->prepare(
      'INSERT INTO platform_settings (setting_key, setting_value) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)'
    );
    foreach ($body as $k => $v) {
      if (in_array($k, $allowedKeys, true)) {
        $stmt->execute([$k, trim((string)$v)]);
      }
    }
    json_response(['success' => true]);
  } catch (PDOException $e) {
    json_error('Lỗi khi lưu cấu hình: ' . $e->getMessage(), 500);
  }
}

json_error('Method not allowed', 405);
