<?php
require_once __DIR__ . '/helpers.php';
send_cors_headers();

$pdo = get_db();
$tenantId = get_current_tenant_id($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $onlyActive = !isset($_GET['all']) || $_GET['all'] !== '1';

  $sql = 'SELECT * FROM promo_banners WHERE tenant_id = ?';
  $params = [$tenantId];

  if ($onlyActive) {
    $sql .= ' AND is_active = 1';
  }
  $sql .= ' ORDER BY sort_order ASC, id DESC';

  try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
  } catch (PDOException $e) {
    $stmt = $pdo->query('SELECT * FROM promo_banners ORDER BY sort_order ASC, id DESC');
    $rows = $stmt->fetchAll();
  }

  $banners = array_map(function ($r) {
    return [
      'id' => (int)$r['id'],
      'businessName' => $r['business_name'],
      'description' => $r['description'],
      'image' => $r['image'],
      'linkUrl' => $r['link_url'],
      'contactName' => $r['contact_name'],
      'isActive' => (bool)$r['is_active'],
      'sortOrder' => (int)$r['sort_order'],
      'createdAt' => $r['created_at'],
    ];
  }, $rows);

  json_response($banners);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $user = require_role(['admin']);
  $body = read_json_body();
  $businessName = trim($body['businessName'] ?? '');
  $image = trim($body['image'] ?? '');

  if ($businessName === '' || $image === '') {
    json_error('Vui lòng nhập tên doanh nghiệp và tải ảnh banner.', 400);
  }

  try {
    $stmt = $pdo->prepare(
      'INSERT INTO promo_banners (tenant_id, business_name, description, image, link_url, contact_name, is_active, sort_order, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
      $tenantId, $businessName, $body['description'] ?? null, $image, $body['linkUrl'] ?? null,
      $body['contactName'] ?? null, isset($body['isActive']) ? ($body['isActive'] ? 1 : 0) : 1,
      (int)($body['sortOrder'] ?? 0), $user['id']
    ]);
    $newId = (int)$pdo->lastInsertId();
  } catch (PDOException $e) {
    json_error('Lỗi khi lưu banner: ' . $e->getMessage(), 500);
  }

  json_response(['success' => true, 'id' => $newId], 201);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  require_role(['admin']);
  $id = (int)($_GET['id'] ?? 0);
  if ($id <= 0) json_error('Thiếu id banner.', 400);

  $body = read_json_body();
  $businessName = trim($body['businessName'] ?? '');
  $image = trim($body['image'] ?? '');

  if ($businessName === '' || $image === '') {
    json_error('Vui lòng nhập tên doanh nghiệp và hình ảnh.', 400);
  }

  try {
    $stmt = $pdo->prepare(
      'UPDATE promo_banners SET business_name = ?, description = ?, image = ?, link_url = ?, contact_name = ?,
                                is_active = ?, sort_order = ?
       WHERE tenant_id = ? AND id = ?'
    );
    $stmt->execute([
      $businessName, $body['description'] ?? null, $image, $body['linkUrl'] ?? null,
      $body['contactName'] ?? null, isset($body['isActive']) ? ($body['isActive'] ? 1 : 0) : 1,
      (int)($body['sortOrder'] ?? 0), $tenantId, $id
    ]);
  } catch (PDOException $e) {
    json_error('Lỗi khi cập nhật banner: ' . $e->getMessage(), 500);
  }

  json_response(['success' => true]);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  require_role(['admin']);
  $id = (int)($_GET['id'] ?? 0);
  if ($id <= 0) json_error('Thiếu id banner.', 400);

  try {
    $stmt = $pdo->prepare('DELETE FROM promo_banners WHERE tenant_id = ? AND id = ?');
    $stmt->execute([$tenantId, $id]);
  } catch (PDOException $e) {
    $stmt = $pdo->prepare('DELETE FROM promo_banners WHERE id = ?');
    $stmt->execute([$id]);
  }

  json_response(['success' => true]);
}

json_error('Method not allowed', 405);
