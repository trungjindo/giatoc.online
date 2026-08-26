<?php
require_once __DIR__ . '/helpers.php';
send_cors_headers();

$pdo = get_db();
$tenantId = get_current_tenant_id($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  require_family_access();
  try {
    $stmt = $pdo->prepare('SELECT id, member_id, latitude, longitude, photo, description, interred_date FROM tombs WHERE tenant_id = ?');
    $stmt->execute([$tenantId]);
    $rows = $stmt->fetchAll();
  } catch (PDOException $e) {
    $stmt = $pdo->query('SELECT id, member_id, latitude, longitude, photo, description, interred_date FROM tombs');
    $rows = $stmt->fetchAll();
  }

  $tree = get_family_tree($pdo);

  $tombs = array_map(function ($r) use ($tree) {
    $node = find_family_node($tree, $r['member_id']);
    return [
      'id' => (int)$r['id'],
      'memberId' => $r['member_id'],
      'memberName' => $node ? ($node['name'] ?? 'Không rõ') : 'Không rõ',
      'generation' => $node ? ($node['generation'] ?? null) : null,
      'latitude' => (float)$r['latitude'],
      'longitude' => (float)$r['longitude'],
      'photo' => $r['photo'],
      'description' => $r['description'],
      'interredDate' => $r['interred_date'],
    ];
  }, $rows);

  json_response($tombs);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $user = require_role(['admin']);
  $body = read_json_body();
  $memberId = trim($body['memberId'] ?? '');
  $lat = isset($body['latitude']) ? (float)$body['latitude'] : null;
  $lng = isset($body['longitude']) ? (float)$body['longitude'] : null;
  $photo = trim($body['photo'] ?? '') ?: null;
  $desc = trim($body['description'] ?? '') ?: null;
  $interredDate = trim($body['interredDate'] ?? '') ?: null;

  if ($memberId === '' || $lat === null || $lng === null) {
    json_error('Vui lòng chọn thành viên và tọa độ lăng mộ.', 400);
  }

  try {
    $stmt = $pdo->prepare(
      'INSERT INTO tombs (tenant_id, member_id, latitude, longitude, photo, description, interred_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE latitude = VALUES(latitude), longitude = VALUES(longitude),
                               photo = VALUES(photo), description = VALUES(description),
                               interred_date = VALUES(interred_date)'
    );
    $stmt->execute([$tenantId, $memberId, $lat, $lng, $photo, $desc, $interredDate, $user['id']]);
  } catch (PDOException $e) {
    $stmt = $pdo->prepare(
      'INSERT INTO tombs (member_id, latitude, longitude, photo, description, interred_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE latitude = VALUES(latitude), longitude = VALUES(longitude),
                               photo = VALUES(photo), description = VALUES(description),
                               interred_date = VALUES(interred_date)'
    );
    $stmt->execute([$memberId, $lat, $lng, $photo, $desc, $interredDate, $user['id']]);
  }

  json_response(['success' => true]);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  require_role(['admin']);
  $memberId = trim($_GET['member_id'] ?? '');
  if ($memberId === '') json_error('Thiếu mã thành viên.', 400);

  try {
    $stmt = $pdo->prepare('DELETE FROM tombs WHERE tenant_id = ? AND member_id = ?');
    $stmt->execute([$tenantId, $memberId]);
  } catch (PDOException $e) {
    $stmt = $pdo->prepare('DELETE FROM tombs WHERE member_id = ?');
    $stmt->execute([$memberId]);
  }

  json_response(['success' => true]);
}

json_error('Method not allowed', 405);
