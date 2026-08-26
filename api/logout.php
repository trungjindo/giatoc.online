<?php
require_once __DIR__ . '/helpers.php';
send_cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  json_error('Method not allowed', 405);
}

$header = get_authorization_header();
if (preg_match('/Bearer\s+(\S+)/i', $header, $m)) {
  $token = $m[1];
  $pdo = get_db();
  $tenantId = get_current_tenant_id($pdo);
  try {
    $stmt = $pdo->prepare('DELETE FROM user_sessions WHERE token = ? AND tenant_id = ?');
    $stmt->execute([$token, $tenantId]);
  } catch (PDOException $e) {
    $stmt = $pdo->prepare('DELETE FROM user_sessions WHERE token = ?');
    $stmt->execute([$token]);
  }
}

json_response(['success' => true]);
