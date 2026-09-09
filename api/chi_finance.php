<?php
require_once __DIR__ . '/helpers.php';
send_cors_headers();

$chiId = isset($_GET['chi_id']) ? (int)$_GET['chi_id'] : 0;
$year = isset($_GET['year']) ? (int)$_GET['year'] : 0;

if ($chiId <= 0 || $year < 1900 || $year > 2100) {
  json_error('Tham số chi_id hoặc year không hợp lệ.', 400);
}

$pdo = get_db();
$tenantId = get_current_tenant_id($pdo);
$dataKey = "chi_finance_{$chiId}_{$year}";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  require_family_access();

  try {
    $stmt = $pdo->prepare('SELECT data_json FROM app_data WHERE tenant_id = ? AND data_key = ?');
    $stmt->execute([$tenantId, $dataKey]);
    $row = $stmt->fetch();
  } catch (PDOException $e) {
    $stmt = $pdo->prepare('SELECT data_json FROM app_data WHERE data_key = ?');
    $stmt->execute([$dataKey]);
    $row = $stmt->fetch();
  }

  $json = $row ? $row['data_json'] : 'null';
  header('Content-Type: application/json; charset=utf-8');
  echo $json;
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $user = require_auth();
  require_chi_year_access($user, $chiId, $year);

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
    $stmt->execute([$tenantId, $dataKey, $raw]);
  } catch (PDOException $e) {
    $stmt = $pdo->prepare(
      'INSERT INTO app_data (data_key, data_json) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE data_json = VALUES(data_json)'
    );
    $stmt->execute([$dataKey, $raw]);
  }

  json_response(['success' => true]);
}

json_error('Method not allowed', 405);
