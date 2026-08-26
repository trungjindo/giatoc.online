<?php
require_once __DIR__ . '/helpers.php';
send_cors_headers();

$user = require_role(['admin']);
$pdo = get_db();
$tenantId = get_current_tenant_id($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  try {
    $stmt = $pdo->prepare(
      'SELECT u.id, u.username, u.full_name, u.role, u.chi_id, u.year_assigned, u.created_at, c.name AS chi_name
       FROM users u
       LEFT JOIN chi c ON c.id = u.chi_id AND c.tenant_id = u.tenant_id
       WHERE u.tenant_id = ?
       ORDER BY u.id ASC'
    );
    $stmt->execute([$tenantId]);
    $rows = $stmt->fetchAll();
  } catch (PDOException $e) {
    $stmt = $pdo->query(
      'SELECT u.id, u.username, u.full_name, u.role, u.chi_id, u.year_assigned, u.created_at, c.name AS chi_name
       FROM users u
       LEFT JOIN chi c ON c.id = u.chi_id
       ORDER BY u.id ASC'
    );
    $rows = $stmt->fetchAll();
  }

  $users = array_map(function ($r) {
    return [
      'id' => (int)$r['id'],
      'username' => $r['username'],
      'fullName' => $r['full_name'],
      'role' => $r['role'],
      'chiId' => $r['chi_id'] !== null ? (int)$r['chi_id'] : null,
      'chiName' => $r['chi_name'] ?? null,
      'yearAssigned' => $r['year_assigned'] !== null ? (int)$r['year_assigned'] : null,
      'createdAt' => $r['created_at'],
    ];
  }, $rows);

  json_response($users);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $body = read_json_body();
  $username = trim($body['username'] ?? '');
  $password = $body['password'] ?? '';
  $fullName = trim($body['fullName'] ?? '');
  $role = $body['role'] ?? 'chi_admin';
  $chiId = !empty($body['chiId']) ? (int)$body['chiId'] : null;
  $yearAssigned = !empty($body['yearAssigned']) ? (int)$body['yearAssigned'] : null;

  if ($username === '' || $password === '') {
    json_error('Vui lòng nhập tên đăng nhập và mật khẩu.', 400);
  }
  if (!in_array($role, ['admin', 'chi_admin', 'dich_ton', 'bai_bien'], true)) {
    json_error('Vai trò không hợp lệ.', 400);
  }
  if ($role !== 'admin' && $chiId === null) {
    json_error('Vui lòng chọn chi cho tài khoản này.', 400);
  }

  try {
    $stmt = $pdo->prepare('SELECT id FROM users WHERE tenant_id = ? AND username = ?');
    $stmt->execute([$tenantId, $username]);
    if ($stmt->fetch()) {
      json_error('Tên đăng nhập đã tồn tại trong dòng họ này.', 400);
    }
  } catch (PDOException $e) {}

  $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);

  try {
    $stmt = $pdo->prepare(
      'INSERT INTO users (tenant_id, username, password_hash, full_name, role, chi_id, year_assigned)
       VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([$tenantId, $username, $hash, $fullName, $role, $chiId, $yearAssigned]);
    $newId = (int)$pdo->lastInsertId();
  } catch (PDOException $e) {
    $stmt = $pdo->prepare(
      'INSERT INTO users (username, password_hash, full_name, role, chi_id, year_assigned)
       VALUES (?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([$username, $hash, $fullName, $role, $chiId, $yearAssigned]);
    $newId = (int)$pdo->lastInsertId();
  }

  json_response(['success' => true, 'id' => $newId], 201);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $id = (int)($_GET['id'] ?? 0);
  if ($id <= 0) json_error('Thiếu id người dùng.', 400);

  $body = read_json_body();
  $fullName = trim($body['fullName'] ?? '');
  $role = $body['role'] ?? 'chi_admin';
  $chiId = !empty($body['chiId']) ? (int)$body['chiId'] : null;
  $yearAssigned = !empty($body['yearAssigned']) ? (int)$body['yearAssigned'] : null;
  $password = $body['password'] ?? '';

  if (!in_array($role, ['admin', 'chi_admin', 'dich_ton', 'bai_bien'], true)) {
    json_error('Vai trò không hợp lệ.', 400);
  }
  if ($role !== 'admin' && $chiId === null) {
    json_error('Vui lòng chọn chi cho tài khoản này.', 400);
  }

  if ($password !== '') {
    $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
    try {
      $stmt = $pdo->prepare(
        'UPDATE users SET password_hash = ?, full_name = ?, role = ?, chi_id = ?, year_assigned = ?
         WHERE tenant_id = ? AND id = ?'
      );
      $stmt->execute([$hash, $fullName, $role, $chiId, $yearAssigned, $tenantId, $id]);
    } catch (PDOException $e) {
      $stmt = $pdo->prepare(
        'UPDATE users SET password_hash = ?, full_name = ?, role = ?, chi_id = ?, year_assigned = ? WHERE id = ?'
      );
      $stmt->execute([$hash, $fullName, $role, $chiId, $yearAssigned, $id]);
    }
  } else {
    try {
      $stmt = $pdo->prepare(
        'UPDATE users SET full_name = ?, role = ?, chi_id = ?, year_assigned = ? WHERE tenant_id = ? AND id = ?'
      );
      $stmt->execute([$fullName, $role, $chiId, $yearAssigned, $tenantId, $id]);
    } catch (PDOException $e) {
      $stmt = $pdo->prepare(
        'UPDATE users SET full_name = ?, role = ?, chi_id = ?, year_assigned = ? WHERE id = ?'
      );
      $stmt->execute([$fullName, $role, $chiId, $yearAssigned, $id]);
    }
  }

  json_response(['success' => true]);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  $id = (int)($_GET['id'] ?? 0);
  if ($id <= 0) json_error('Thiếu id người dùng.', 400);
  if ($id === (int)$user['id']) json_error('Không thể tự xóa tài khoản của chính mình.', 400);

  try {
    $stmt = $pdo->prepare('DELETE FROM users WHERE tenant_id = ? AND id = ?');
    $stmt->execute([$tenantId, $id]);
  } catch (PDOException $e) {
    $stmt = $pdo->prepare('DELETE FROM users WHERE id = ?');
    $stmt->execute([$id]);
  }

  json_response(['success' => true]);
}

json_error('Method not allowed', 405);
