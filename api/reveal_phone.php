<?php
require_once __DIR__ . '/helpers.php';
send_cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  json_error('Method not allowed', 405);
}

require_family_access();

$body = read_json_body();
$memberId = trim($body['memberId'] ?? '');
if ($memberId === '') {
  json_error('Thiếu mã thành viên cần xem.', 400);
}

$pdo = get_db();
$tenantId = get_current_tenant_id($pdo);
$ip = get_client_ip();

try {
  $stmt = $pdo->prepare(
    "SELECT COUNT(*) AS c FROM phone_reveal_log
     WHERE tenant_id = ? AND ip = ? AND revealed_at > (NOW() - INTERVAL 1 HOUR)"
  );
  $stmt->execute([$tenantId, $ip]);
  if ((int)$stmt->fetch()['c'] >= 30) {
    json_error('Bạn đã xem quá nhiều số điện thoại trong 1 giờ. Vui lòng thử lại sau.', 429);
  }
} catch (PDOException $e) {}

$tree = get_family_tree($pdo);
$node = find_family_node($tree, $memberId);
if ($node === null) {
  json_error('Không tìm thấy thành viên trong cây gia phả.', 404);
}

try {
  $stmt = $pdo->prepare(
    'INSERT INTO phone_reveal_log (tenant_id, ip, member_id) VALUES (?, ?, ?)'
  );
  $stmt->execute([$tenantId, $ip, $memberId]);
} catch (PDOException $e) {
  try {
    $stmt = $pdo->prepare('INSERT INTO phone_reveal_log (ip, member_id) VALUES (?, ?)');
    $stmt->execute([$ip, $memberId]);
  } catch (PDOException $e2) {}
}

json_response([
  'memberId' => $memberId,
  'phone' => (string)($node['phone'] ?? ''),
  'zalo' => (string)($node['zalo'] ?? ''),
]);
