<?php
require_once __DIR__ . '/helpers.php';
send_cors_headers();

$pdo = get_db();
$tenantId = get_current_tenant_id($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  require_family_access();
  $assetId = isset($_GET['asset_id']) ? (int)$_GET['asset_id'] : null;

  try {
    if ($assetId !== null) {
      $stmt = $pdo->prepare('SELECT * FROM asset_history WHERE tenant_id = ? AND asset_id = ? ORDER BY id DESC');
      $stmt->execute([$tenantId, $assetId]);
    } else {
      $stmt = $pdo->prepare('SELECT * FROM asset_history WHERE tenant_id = ? ORDER BY id DESC LIMIT 200');
      $stmt->execute([$tenantId]);
    }
    $rows = $stmt->fetchAll();
  } catch (PDOException $e) {
    $stmt = $pdo->query('SELECT * FROM asset_history ORDER BY id DESC LIMIT 200');
    $rows = $stmt->fetchAll();
  }

  json_response($rows);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $user = require_auth();
  $body = read_json_body();
  $assetId = !empty($body['assetId']) ? (int)$body['assetId'] : null;
  $assetName = trim($body['assetName'] ?? '');
  $action = $body['action'] ?? 'updated';
  $summary = trim($body['summary'] ?? '');

  if ($assetName === '') json_error('Thiếu tên tài sản.', 400);

  try {
    $stmt = $pdo->prepare(
      'INSERT INTO asset_history (tenant_id, asset_id, asset_name, user_id, user_name, action, summary)
       VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([$tenantId, $assetId, $assetName, $user['id'], $user['full_name'] ?: $user['username'], $action, $summary]);
  } catch (PDOException $e) {}

  json_response(['success' => true]);
}

json_error('Method not allowed', 405);
