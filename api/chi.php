<?php
require_once __DIR__ . '/helpers.php';
send_cors_headers();

$pdo = get_db();
$tenantId = get_current_tenant_id($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  require_family_access();
  try {
    $stmt = $pdo->prepare('SELECT id, name, root_member_id, description, created_at FROM chi WHERE tenant_id = ? ORDER BY id ASC');
    $stmt->execute([$tenantId]);
    $rows = $stmt->fetchAll();
  } catch (PDOException $e) {
    $stmt = $pdo->query('SELECT id, name, root_member_id, description, created_at FROM chi ORDER BY id ASC');
    $rows = $stmt->fetchAll();
  }

  $chiList = array_map(function ($r) {
    return [
      'id' => (int)$r['id'],
      'name' => $r['name'],
      'rootMemberId' => $r['root_member_id'],
      'description' => $r['description'],
      'createdAt' => $r['created_at'],
    ];
  }, $rows);

  json_response($chiList);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  require_role(['admin']);
  $body = read_json_body();
  $name = trim($body['name'] ?? '');
  $rootMemberId = trim($body['rootMemberId'] ?? '');
  $description = trim($body['description'] ?? '');

  if ($name === '' || $rootMemberId === '') {
    json_error('Vui lòng nhập tên chi và chọn người đứng đầu chi.', 400);
  }

  $tree = get_family_tree($pdo);
  if ($tree === null || find_family_node($tree, $rootMemberId) === null) {
    json_error('Không tìm thấy thành viên đứng đầu chi trong cây gia phả.', 400);
  }

  try {
    $stmt = $pdo->prepare('INSERT INTO chi (tenant_id, name, root_member_id, description) VALUES (?, ?, ?, ?)');
    $stmt->execute([$tenantId, $name, $rootMemberId, $description]);
    $newId = (int)$pdo->lastInsertId();
  } catch (PDOException $e) {
    $stmt = $pdo->prepare('INSERT INTO chi (name, root_member_id, description) VALUES (?, ?, ?)');
    $stmt->execute([$name, $rootMemberId, $description]);
    $newId = (int)$pdo->lastInsertId();
  }

  json_response(['success' => true, 'id' => $newId], 201);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  require_role(['admin']);
  $id = (int)($_GET['id'] ?? 0);
  if ($id <= 0) json_error('Thiếu id chi.', 400);

  $body = read_json_body();
  $name = trim($body['name'] ?? '');
  $rootMemberId = trim($body['rootMemberId'] ?? '');
  $description = trim($body['description'] ?? '');

  if ($name === '' || $rootMemberId === '') {
    json_error('Vui lòng nhập tên chi và chọn người đứng đầu chi.', 400);
  }

  $tree = get_family_tree($pdo);
  if ($tree === null || find_family_node($tree, $rootMemberId) === null) {
    json_error('Không tìm thấy thành viên đứng đầu chi trong cây gia phả.', 400);
  }

  try {
    $stmt = $pdo->prepare('UPDATE chi SET name = ?, root_member_id = ?, description = ? WHERE tenant_id = ? AND id = ?');
    $stmt->execute([$name, $rootMemberId, $description, $tenantId, $id]);
  } catch (PDOException $e) {
    $stmt = $pdo->prepare('UPDATE chi SET name = ?, root_member_id = ?, description = ? WHERE id = ?');
    $stmt->execute([$name, $rootMemberId, $description, $id]);
  }

  json_response(['success' => true]);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  require_role(['admin']);
  $id = (int)($_GET['id'] ?? 0);
  if ($id <= 0) json_error('Thiếu id chi.', 400);

  try {
    $stmt = $pdo->prepare('DELETE FROM chi WHERE tenant_id = ? AND id = ?');
    $stmt->execute([$tenantId, $id]);
  } catch (PDOException $e) {
    $stmt = $pdo->prepare('DELETE FROM chi WHERE id = ?');
    $stmt->execute([$id]);
  }

  json_response(['success' => true]);
}

json_error('Method not allowed', 405);
