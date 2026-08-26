<?php
require_once __DIR__ . '/helpers.php';
send_cors_headers();

$pdo = get_db();
$tenantId = get_current_tenant_id($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $user = require_auth();
  $chiId = isset($_GET['chi_id']) ? (int)$_GET['chi_id'] : null;

  if ($user['role'] !== 'admin') {
    $chiId = (int)$user['chi_id'];
  }

  try {
    if ($chiId !== null) {
      $stmt = $pdo->prepare(
        'SELECT a.id, a.chi_id, a.year, a.user_id, a.status, a.assigned_at, a.handed_over_at,
                u.full_name AS user_name, u.username, c.name AS chi_name
         FROM bai_bien_assignments a
         JOIN users u ON u.id = a.user_id AND u.tenant_id = a.tenant_id
         LEFT JOIN chi c ON c.id = a.chi_id AND c.tenant_id = a.tenant_id
         WHERE a.tenant_id = ? AND a.chi_id = ?
         ORDER BY a.year DESC, a.id DESC'
      );
      $stmt->execute([$tenantId, $chiId]);
    } else {
      $stmt = $pdo->prepare(
        'SELECT a.id, a.chi_id, a.year, a.user_id, a.status, a.assigned_at, a.handed_over_at,
                u.full_name AS user_name, u.username, c.name AS chi_name
         FROM bai_bien_assignments a
         JOIN users u ON u.id = a.user_id AND u.tenant_id = a.tenant_id
         LEFT JOIN chi c ON c.id = a.chi_id AND c.tenant_id = a.tenant_id
         WHERE a.tenant_id = ?
         ORDER BY a.year DESC, a.id DESC'
      );
      $stmt->execute([$tenantId]);
    }
    $rows = $stmt->fetchAll();
  } catch (PDOException $e) {
    $stmt = $pdo->query('SELECT a.id, a.chi_id, a.year, a.user_id, a.status, a.assigned_at, a.handed_over_at, u.full_name AS user_name, u.username, c.name AS chi_name FROM bai_bien_assignments a JOIN users u ON u.id = a.user_id LEFT JOIN chi c ON c.id = a.chi_id ORDER BY a.year DESC');
    $rows = $stmt->fetchAll();
  }

  $list = array_map(function ($r) {
    return [
      'id' => (int)$r['id'],
      'chiId' => $r['chi_id'] !== null ? (int)$r['chi_id'] : null,
      'chiName' => $r['chi_name'] ?? null,
      'year' => (int)$r['year'],
      'userId' => (int)$r['user_id'],
      'userName' => $r['user_name'],
      'username' => $r['username'],
      'status' => $r['status'],
      'assignedAt' => $r['assigned_at'],
      'handedOverAt' => $r['handed_over_at'],
    ];
  }, $rows);

  json_response($list);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $user = require_auth();
  $body = read_json_body();
  $action = $body['action'] ?? 'assign';

  if ($action === 'assign') {
    if ($user['role'] !== 'admin' && $user['role'] !== 'chi_admin' && $user['role'] !== 'dich_ton') {
      json_error('Bạn không có quyền phân công bãi biện.', 403);
    }

    $chiId = !empty($body['chiId']) ? (int)$body['chiId'] : null;
    $year = (int)($body['year'] ?? 0);
    $userId = (int)($body['userId'] ?? 0);

    if ($year < 1900 || $year > 2100 || $userId <= 0) {
      json_error('Thông tin phân công không hợp lệ.', 400);
    }

    require_chi_access($user, $chiId);

    try {
      $stmt = $pdo->prepare(
        "UPDATE bai_bien_assignments SET status = 'handed_over', handed_over_at = NOW()
         WHERE tenant_id = ? AND chi_id <=> ? AND year = ? AND status = 'active'"
      );
      $stmt->execute([$tenantId, $chiId, $year]);

      $stmt = $pdo->prepare(
        'INSERT INTO bai_bien_assignments (tenant_id, chi_id, year, user_id, status) VALUES (?, ?, ?, ?, ?)'
      );
      $stmt->execute([$tenantId, $chiId, $year, $userId, 'active']);
      $newId = (int)$pdo->lastInsertId();

      $stmt = $pdo->prepare('UPDATE users SET role = ?, chi_id = ?, year_assigned = ? WHERE tenant_id = ? AND id = ?');
      $stmt->execute(['bai_bien', $chiId, $year, $tenantId, $userId]);
    } catch (PDOException $e) {
      json_error('Lỗi khi phân công bãi biện: ' . $e->getMessage(), 500);
    }

    json_response(['success' => true, 'id' => $newId], 201);
  }

  if ($action === 'handover') {
    $assignmentId = (int)($body['assignmentId'] ?? 0);
    if ($assignmentId <= 0) json_error('Thiếu id phân công.', 400);

    try {
      $stmt = $pdo->prepare('SELECT * FROM bai_bien_assignments WHERE tenant_id = ? AND id = ?');
      $stmt->execute([$tenantId, $assignmentId]);
      $assignment = $stmt->fetch();
    } catch (PDOException $e) {
      $stmt = $pdo->prepare('SELECT * FROM bai_bien_assignments WHERE id = ?');
      $stmt->execute([$assignmentId]);
      $assignment = $stmt->fetch();
    }

    if (!$assignment) json_error('Không tìm thấy lượt phân công.', 404);

    if ($user['role'] !== 'admin' && (int)$user['id'] !== (int)$assignment['user_id']) {
      require_chi_access($user, $assignment['chi_id'] !== null ? (int)$assignment['chi_id'] : null);
    }

    try {
      $stmt = $pdo->prepare(
        "UPDATE bai_bien_assignments SET status = 'handed_over', handed_over_at = NOW() WHERE tenant_id = ? AND id = ?"
      );
      $stmt->execute([$tenantId, $assignmentId]);
    } catch (PDOException $e) {
      $stmt = $pdo->prepare("UPDATE bai_bien_assignments SET status = 'handed_over', handed_over_at = NOW() WHERE id = ?");
      $stmt->execute([$assignmentId]);
    }

    json_response(['success' => true]);
  }

  json_error('Action không hợp lệ.', 400);
}

json_error('Method not allowed', 405);
