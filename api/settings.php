<?php
require_once __DIR__ . '/helpers.php';
send_cors_headers();

$pdo = get_db();
$tenantId = get_current_tenant_id($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $keysParam = $_GET['keys'] ?? '';
  $keys = array_filter(array_map('trim', explode(',', $keysParam)));

  if (empty($keys)) {
    $keys = ['te_ho_day', 'te_ho_month'];
  }

  $placeholders = implode(',', array_fill(0, count($keys), '?'));
  $params = array_merge([$tenantId], $keys);

  try {
    $stmt = $pdo->prepare("SELECT setting_key, setting_value FROM site_settings WHERE tenant_id = ? AND setting_key IN ($placeholders)");
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
  } catch (PDOException $e) {
    $stmt = $pdo->prepare("SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ($placeholders)");
    $stmt->execute($keys);
    $rows = $stmt->fetchAll();
  }

  $result = [];
  foreach ($rows as $r) {
    $result[$r['setting_key']] = $r['setting_value'];
  }

  json_response($result);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  require_role(['admin']);
  $body = read_json_body();

  $allowed = ['te_ho_day', 'te_ho_month'];
  $stmt = $pdo->prepare(
    'INSERT INTO site_settings (tenant_id, setting_key, setting_value) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)'
  );

  foreach ($body as $k => $v) {
    if (in_array($k, $allowed, true)) {
      try {
        $stmt->execute([$tenantId, $k, (string)$v]);
      } catch (PDOException $e) {
        $stmtFallback = $pdo->prepare(
          'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?)
           ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)'
        );
        $stmtFallback->execute([$k, (string)$v]);
      }
    }
  }

  json_response(['success' => true]);
}

json_error('Method not allowed', 405);
