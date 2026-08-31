<?php
require_once __DIR__ . '/helpers.php';
send_cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  json_error('Method not allowed', 405);
}

$body = read_json_body();
$username = trim($body['username'] ?? '');
$password = $body['password'] ?? '';

if ($username === '' || $password === '') {
  json_error('Vui lòng nhập tên đăng nhập và mật khẩu.', 400);
}

$pdo = get_db();
$tenantId = get_current_tenant_id($pdo);

// 1. Chống dò mật khẩu (Brute-force protection)
$recentIpFailures = count_recent_auth_failures('login', null, 15, $pdo);
$recentAccountFailures = count_recent_auth_failures('login', $username, 15, $pdo);

if ($recentIpFailures >= 10 || $recentAccountFailures >= 5) {
  log_auth_attempt('login', $username, false, $pdo);
  json_error('Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.', 429);
}

try {
  $stmt = $pdo->prepare(
    'SELECT u.id, u.tenant_id, u.username, u.password_hash, u.full_name, u.role, u.chi_id, u.year_assigned, c.name AS chi_name
     FROM users u
     LEFT JOIN chi c ON c.id = u.chi_id AND c.tenant_id = u.tenant_id
     WHERE u.tenant_id = ? AND u.username = ?'
  );
  $stmt->execute([$tenantId, $username]);
  $user = $stmt->fetch();
} catch (PDOException $e) {
  $stmt = $pdo->prepare(
    'SELECT u.id, u.username, u.password_hash, u.full_name, u.role, u.chi_id, u.year_assigned, c.name AS chi_name
     FROM users u
     LEFT JOIN chi c ON c.id = u.chi_id
     WHERE u.username = ?'
  );
  $stmt->execute([$username]);
  $user = $stmt->fetch();
}

if (!$user || !password_verify($password, $user['password_hash'])) {
  log_auth_attempt('login', $username, false, $pdo);
  json_error('Tên đăng nhập hoặc mật khẩu không chính xác.', 401);
}

log_auth_attempt('login', $username, true, $pdo);

$token = bin2hex(random_bytes(32));
$expiresAt = date('Y-m-d H:i:s', time() + 7 * 86400); // 7 ngày

try {
  $stmt = $pdo->prepare(
    'INSERT INTO user_sessions (token, tenant_id, user_id, expires_at) VALUES (?, ?, ?, ?)'
  );
  $stmt->execute([$token, $tenantId, $user['id']]);
} catch (PDOException $e) {
  $stmt = $pdo->prepare(
    'INSERT INTO user_sessions (token, user_id, expires_at) VALUES (?, ?, ?)'
  );
  $stmt->execute([$token, $user['id'], $expiresAt]);
}

$tenant = get_current_tenant($pdo);

json_response([
  'token' => $token,
  'user' => [
    'id' => (int)$user['id'],
    'tenantId' => $tenantId,
    'username' => $user['username'],
    'fullName' => $user['full_name'],
    'role' => $user['role'],
    'chiId' => $user['chi_id'] !== null ? (int)$user['chi_id'] : null,
    'chiName' => $user['chi_name'] ?? null,
    'yearAssigned' => $user['year_assigned'] !== null ? (int)$user['year_assigned'] : null,
  ],
  'tenant' => [
    'id' => (int)$tenant['id'],
    'slug' => $tenant['slug'],
    'name' => $tenant['name'],
    'plan' => $tenant['plan'] ?? 'standard',
    'logo' => $tenant['logo'] ?? null,
  ]
]);
