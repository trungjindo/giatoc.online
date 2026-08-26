<?php
require_once __DIR__ . '/helpers.php';
send_cors_headers();

$pdo = get_db();
$tenantId = get_current_tenant_id($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  require_family_access();
  $chiId = isset($_GET['chi_id']) ? (int)$_GET['chi_id'] : null;
  $year = isset($_GET['year']) ? (int)$_GET['year'] : null;

  $sql = 'SELECT a.id, a.chi_id, a.year, a.title, a.description, a.created_at, u.full_name AS created_by_name, c.name AS chi_name
          FROM activities a
          LEFT JOIN users u ON u.id = a.created_by AND u.tenant_id = a.tenant_id
          LEFT JOIN chi c ON c.id = a.chi_id AND c.tenant_id = a.tenant_id
          WHERE a.tenant_id = ?';
  $params = [$tenantId];

  if ($chiId !== null) {
    $sql .= ' AND a.chi_id = ?';
    $params[] = $chiId;
  }
  if ($year !== null) {
    $sql .= ' AND a.year = ?';
    $params[] = $year;
  }
  $sql .= ' ORDER BY a.year DESC, a.created_at DESC';

  try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
  } catch (PDOException $e) {
    $stmt = $pdo->query('SELECT a.id, a.chi_id, a.year, a.title, a.description, a.created_at, u.full_name AS created_by_name, c.name AS chi_name FROM activities a LEFT JOIN users u ON u.id = a.created_by LEFT JOIN chi c ON c.id = a.chi_id ORDER BY a.year DESC');
    $rows = $stmt->fetchAll();
  }

  $list = array_map(function ($r) {
    return [
      'id' => (int)$r['id'],
      'chiId' => $r['chi_id'] !== null ? (int)$r['chi_id'] : null,
      'chiName' => $r['chi_name'] ?? null,
      'year' => (int)$r['year'],
      'title' => $r['title'],
      'description' => $r['description'],
      'createdByName' => $r['created_by_name'] ?? null,
      'createdAt' => $r['created_at'],
    ];
  }, $rows);

  json_response($list);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $user = require_auth();
  $body = read_json_body();
  $chiId = !empty($body['chiId']) ? (int)$body['chiId'] : null;
  $year = (int)($body['year'] ?? 0);
  $title = trim($body['title'] ?? '');
  $description = trim($body['description'] ?? '');

  if ($year < 1900 || $year > 2100 || $title === '') {
    json_error('Vui lòng nhập năm và tiêu đề hoạt động.', 400);
  }

  require_chi_year_access($user, $chiId, $year);

  try {
    $stmt = $pdo->prepare(
      'INSERT INTO activities (tenant_id, chi_id, year, title, description, created_by)
       VALUES (?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([$tenantId, $chiId, $year, $title, $description, $user['id']]);
    $newId = (int)$pdo->lastInsertId();
  } catch (PDOException $e) {
    $stmt = $pdo->prepare(
      'INSERT INTO activities (chi_id, year, title, description, created_by) VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->execute([$chiId, $year, $title, $description, $user['id']]);
    $newId = (int)$pdo->lastInsertId();
  }

  json_response(['success' => true, 'id' => $newId], 201);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  $user = require_auth();
  $id = (int)($_GET['id'] ?? 0);
  if ($id <= 0) json_error('Thiếu id hoạt động.', 400);

  try {
    $stmt = $pdo->prepare('SELECT * FROM activities WHERE tenant_id = ? AND id = ?');
    $stmt->execute([$tenantId, $id]);
    $activity = $stmt->fetch();
  } catch (PDOException $e) {
    $stmt = $pdo->prepare('SELECT * FROM activities WHERE id = ?');
    $stmt->execute([$id]);
    $activity = $stmt->fetch();
  }

  if (!$activity) json_error('Không tìm thấy hoạt động.', 404);

  require_chi_year_access($user, $activity['chi_id'] !== null ? (int)$activity['chi_id'] : null, (int)$activity['year']);

  try {
    $stmt = $pdo->prepare('DELETE FROM activities WHERE tenant_id = ? AND id = ?');
    $stmt->execute([$tenantId, $id]);
  } catch (PDOException $e) {
    $stmt = $pdo->prepare('DELETE FROM activities WHERE id = ?');
    $stmt->execute([$id]);
  }

  json_response(['success' => true]);
}

json_error('Method not allowed', 405);
