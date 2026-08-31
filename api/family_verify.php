<?php
require_once __DIR__ . '/helpers.php';
send_cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  json_error('Method not allowed', 405);
}

$body = read_json_body();
$name = trim($body['name'] ?? '');
$fatherName = trim($body['fatherName'] ?? '');
$teHoDay = isset($body['teHoDay']) ? (int)$body['teHoDay'] : null;
$teHoMonth = isset($body['teHoMonth']) ? (int)$body['teHoMonth'] : null;

if ($name === '' || $fatherName === '' || $teHoDay === null || $teHoMonth === null) {
  json_error('Vui lòng điền đầy đủ tất cả các trường thông tin xác thực.', 400);
}

$pdo = get_db();
$tenantId = get_current_tenant_id($pdo);

$ip = get_client_ip();
if (count_recent_auth_failures('verify', null, 15, $pdo) >= 10) {
  log_auth_attempt('verify', $name, false, $pdo);
  json_error('Thử xác thực sai quá nhiều lần. Vui lòng thử lại sau 15 phút.', 429);
}

$cfgDay = (int)get_setting('te_ho_day', '0', $pdo);
$cfgMonth = (int)get_setting('te_ho_month', '0', $pdo);

if ($cfgDay <= 0 || $cfgMonth <= 0) {
  json_error('Dòng họ chưa thiết lập ngày tế họ âm lịch trên hệ thống.', 500);
}

if ($teHoDay !== $cfgDay || $teHoMonth !== $cfgMonth) {
  log_auth_attempt('verify', $name, false, $pdo);
  json_error('Thông tin xác thực không chính xác. Vui lòng kiểm tra lại!', 401);
}

$tree = get_family_tree($pdo);
if (!is_array($tree)) {
  json_error('Dữ liệu gia phả chưa sẵn sàng.', 500);
}

$targetNorm = normalize_vn_name($name);
$fatherNorm = normalize_vn_name($fatherName);

$matchedMember = null;

$walk = function($node, $parentNode) use (&$walk, &$matchedMember, $targetNorm, $fatherNorm) {
  if ($matchedMember !== null || !is_array($node)) return;

  $nodeNorm = normalize_vn_name($node['name'] ?? '');
  if ($nodeNorm !== '' && $nodeNorm === $targetNorm) {
    if ($parentNode !== null) {
      $parentNorm = normalize_vn_name($parentNode['name'] ?? '');
      if ($parentNorm !== '' && $parentNorm === $fatherNorm) {
        $matchedMember = $node;
        return;
      }
    }
  }

  foreach ($node['children'] ?? [] as $child) {
    $walk($child, $node);
  }
};

$walk($tree, null);

if ($matchedMember === null) {
  log_auth_attempt('verify', $name, false, $pdo);
  json_error('Không tìm thấy thông tin phù hợp trong gia phả. Vui lòng kiểm tra lại họ tên bạn và thân sinh!', 401);
}

log_auth_attempt('verify', $name, true, $pdo);

$token = bin2hex(random_bytes(32));
$expiresAt = date('Y-m-d H:i:s', time() + 30 * 86400); // 30 ngày

try {
  $stmt = $pdo->prepare(
    'INSERT INTO viewer_sessions (token, tenant_id, member_id, member_name, ip, expires_at)
     VALUES (?, ?, ?, ?, ?, ?)'
  );
  $stmt->execute([$token, $tenantId, (string)$matchedMember['id'], (string)$matchedMember['name'], $ip, $expiresAt]);
} catch (PDOException $e) {
  $stmt = $pdo->prepare(
    'INSERT INTO viewer_sessions (token, member_id, member_name, ip, expires_at)
     VALUES (?, ?, ?, ?, ?)'
  );
  $stmt->execute([$token, (string)$matchedMember['id'], (string)$matchedMember['name'], $ip, $expiresAt]);
}

json_response([
  'success' => true,
  'token' => $token,
  'member' => [
    'id' => $matchedMember['id'],
    'name' => $matchedMember['name'],
  ],
]);
