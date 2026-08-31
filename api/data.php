<?php
require_once __DIR__ . '/helpers.php';
send_cors_headers();

$ALLOWED_KEYS = ['familyData', 'financeData', 'newsData', 'aboutData', 'bannerData', 'galleryData', 'contactAdminData', 'coupletData'];
$PROTECTED_KEYS = ['familyData', 'financeData'];

$key = $_GET['key'] ?? '';
if (!in_array($key, $ALLOWED_KEYS, true)) {
  json_error('Tham số key không hợp lệ.', 400);
}

$pdo = get_db();
$tenantId = get_current_tenant_id($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  if (in_array($key, $PROTECTED_KEYS, true)) {
    require_family_access();
  }

  if ($key === 'familyData') {
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
  }

  try {
    $stmt = $pdo->prepare('SELECT data_json FROM app_data WHERE tenant_id = ? AND data_key = ?');
    $stmt->execute([$tenantId, $key]);
    $row = $stmt->fetch();
  } catch (PDOException $e) {
    $stmt = $pdo->prepare('SELECT data_json FROM app_data WHERE data_key = ?');
    $stmt->execute([$key]);
    $row = $stmt->fetch();
  }

  if ($key === 'familyData' && $row && get_authenticated_user() === null) {
    $tree = json_decode($row['data_json'], true);
    if (is_array($tree)) {
      mask_family_contacts($tree);
      json_response($tree);
    }
  }

  $json = $row ? $row['data_json'] : 'null';
  header('Content-Type: application/json; charset=utf-8');
  echo $json;
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Chỉ Super Admin của dòng họ mới có quyền ghi đè dữ liệu toàn họ (Bảo mật - Fix Broken Access Control)
  $user = require_role(['admin']);

  $raw = file_get_contents('php://input');
  json_decode($raw);
  if (json_last_error() !== JSON_ERROR_NONE) {
    json_error('Dữ liệu gửi lên không phải JSON hợp lệ.', 400);
  }

  try {
    $stmt = $pdo->prepare(
      'INSERT INTO app_data (tenant_id, data_key, data_json) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE data_json = VALUES(data_json)'
    );
    $stmt->execute([$tenantId, $key, $raw]);
  } catch (PDOException $e) {
    $stmt = $pdo->prepare(
      'INSERT INTO app_data (data_key, data_json) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE data_json = VALUES(data_json)'
    );
    $stmt->execute([$key, $raw]);
  }

  json_response(['success' => true]);
}

json_error('Method not allowed', 405);
