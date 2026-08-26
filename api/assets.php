<?php
require_once __DIR__ . '/helpers.php';
send_cors_headers();

$pdo = get_db();
$tenantId = get_current_tenant_id($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  require_family_access();
  $chiId = isset($_GET['chi_id']) ? (int)$_GET['chi_id'] : null;

  $sql = 'SELECT a.*, c.name AS chi_name, u1.full_name AS created_by_name, u2.full_name AS updated_by_name
          FROM assets a
          LEFT JOIN chi c ON c.id = a.chi_id AND c.tenant_id = a.tenant_id
          LEFT JOIN users u1 ON u1.id = a.created_by AND u1.tenant_id = a.tenant_id
          LEFT JOIN users u2 ON u2.id = a.updated_by AND u2.tenant_id = a.tenant_id
          WHERE a.tenant_id = ?';
  $params = [$tenantId];

  if ($chiId !== null) {
    $sql .= ' AND a.chi_id = ?';
    $params[] = $chiId;
  }
  $sql .= ' ORDER BY a.id DESC';

  try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
  } catch (PDOException $e) {
    $stmt = $pdo->query('SELECT a.*, c.name AS chi_name, u1.full_name AS created_by_name, u2.full_name AS updated_by_name FROM assets a LEFT JOIN chi c ON c.id = a.chi_id LEFT JOIN users u1 ON u1.id = a.created_by LEFT JOIN users u2 ON u2.id = a.updated_by ORDER BY a.id DESC');
    $rows = $stmt->fetchAll();
  }

  $assets = array_map(function ($r) {
    return [
      'id' => (int)$r['id'],
      'chiId' => $r['chi_id'] !== null ? (int)$r['chi_id'] : null,
      'chiName' => $r['chi_name'] ?? null,
      'name' => $r['name'],
      'category' => $r['category'],
      'description' => $r['description'],
      'status' => $r['status'],
      'address' => $r['address'],
      'latitude' => $r['latitude'] !== null ? (float)$r['latitude'] : null,
      'longitude' => $r['longitude'] !== null ? (float)$r['longitude'] : null,
      'custodian' => $r['custodian'],
      'acquiredDate' => $r['acquired_date'],
      'financeTxId' => $r['finance_tx_id'],
      'estimatedValue' => $r['estimated_value'] !== null ? (float)$r['estimated_value'] : null,
      'usefulLifeYears' => $r['useful_life_years'] !== null ? (int)$r['useful_life_years'] : null,
      'expectedReplaceYear' => $r['expected_replace_year'] !== null ? (int)$r['expected_replace_year'] : null,
      'expectedReplaceCost' => $r['expected_replace_cost'] !== null ? (float)$r['expected_replace_cost'] : null,
      'images' => $r['images'] ? json_decode($r['images'], true) : [],
      'createdByName' => $r['created_by_name'] ?? null,
      'updatedByName' => $r['updated_by_name'] ?? null,
      'createdAt' => $r['created_at'],
      'updatedAt' => $r['updated_at'],
    ];
  }, $rows);

  json_response($assets);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $user = require_auth();
  $body = read_json_body();
  $name = trim($body['name'] ?? '');
  $chiId = !empty($body['chiId']) ? (int)$body['chiId'] : null;
  if ($name === '') json_error('Vui lòng nhập tên tài sản.', 400);

  require_chi_access($user, $chiId);

  $imagesJson = !empty($body['images']) ? json_encode($body['images'], JSON_UNESCAPED_UNICODE) : null;

  try {
    $stmt = $pdo->prepare(
      'INSERT INTO assets (tenant_id, chi_id, name, category, description, status, address, latitude, longitude,
                           custodian, acquired_date, finance_tx_id, estimated_value, useful_life_years,
                           expected_replace_year, expected_replace_cost, images, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
      $tenantId, $chiId, $name, $body['category'] ?? 'vat_dung', $body['description'] ?? null,
      $body['status'] ?? 'dang_dung', $body['address'] ?? null,
      !empty($body['latitude']) ? (float)$body['latitude'] : null,
      !empty($body['longitude']) ? (float)$body['longitude'] : null,
      $body['custodian'] ?? null, $body['acquiredDate'] ?? null, $body['financeTxId'] ?? null,
      !empty($body['estimatedValue']) ? (float)$body['estimatedValue'] : null,
      !empty($body['usefulLifeYears']) ? (int)$body['usefulLifeYears'] : null,
      !empty($body['expectedReplaceYear']) ? (int)$body['expectedReplaceYear'] : null,
      !empty($body['expectedReplaceCost']) ? (float)$body['expectedReplaceCost'] : null,
      $imagesJson, $user['id'], $user['id']
    ]);
    $newId = (int)$pdo->lastInsertId();
  } catch (PDOException $e) {
    json_error('Lỗi khi thêm tài sản: ' . $e->getMessage(), 500);
  }

  json_response(['success' => true, 'id' => $newId], 201);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $user = require_auth();
  $id = (int)($_GET['id'] ?? 0);
  if ($id <= 0) json_error('Thiếu id tài sản.', 400);

  try {
    $stmt = $pdo->prepare('SELECT * FROM assets WHERE tenant_id = ? AND id = ?');
    $stmt->execute([$tenantId, $id]);
    $curr = $stmt->fetch();
  } catch (PDOException $e) {
    $stmt = $pdo->prepare('SELECT * FROM assets WHERE id = ?');
    $stmt->execute([$id]);
    $curr = $stmt->fetch();
  }
  if (!$curr) json_error('Không tìm thấy tài sản.', 404);

  $body = read_json_body();
  $chiId = array_key_exists('chiId', $body) ? (!empty($body['chiId']) ? (int)$body['chiId'] : null) : ($curr['chi_id'] !== null ? (int)$curr['chi_id'] : null);
  require_chi_access($user, $chiId);

  $imagesJson = array_key_exists('images', $body) ? json_encode($body['images'], JSON_UNESCAPED_UNICODE) : $curr['images'];

  try {
    $stmt = $pdo->prepare(
      'UPDATE assets SET chi_id = ?, name = ?, category = ?, description = ?, status = ?, address = ?,
                         latitude = ?, longitude = ?, custodian = ?, acquired_date = ?, finance_tx_id = ?,
                         estimated_value = ?, useful_life_years = ?, expected_replace_year = ?,
                         expected_replace_cost = ?, images = ?, updated_by = ?
       WHERE tenant_id = ? AND id = ?'
    );
    $stmt->execute([
      $chiId, $body['name'] ?? $curr['name'], $body['category'] ?? $curr['category'],
      $body['description'] ?? $curr['description'], $body['status'] ?? $curr['status'],
      $body['address'] ?? $curr['address'],
      !empty($body['latitude']) ? (float)$body['latitude'] : null,
      !empty($body['longitude']) ? (float)$body['longitude'] : null,
      $body['custodian'] ?? $curr['custodian'], $body['acquiredDate'] ?? $curr['acquired_date'],
      $body['financeTxId'] ?? $curr['finance_tx_id'],
      !empty($body['estimatedValue']) ? (float)$body['estimatedValue'] : null,
      !empty($body['usefulLifeYears']) ? (int)$body['usefulLifeYears'] : null,
      !empty($body['expectedReplaceYear']) ? (int)$body['expectedReplaceYear'] : null,
      !empty($body['expectedReplaceCost']) ? (float)$body['expectedReplaceCost'] : null,
      $imagesJson, $user['id'], $tenantId, $id
    ]);
  } catch (PDOException $e) {
    json_error('Lỗi khi cập nhật tài sản: ' . $e->getMessage(), 500);
  }

  json_response(['success' => true]);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  $user = require_auth();
  $id = (int)($_GET['id'] ?? 0);
  if ($id <= 0) json_error('Thiếu id tài sản.', 400);

  try {
    $stmt = $pdo->prepare('SELECT * FROM assets WHERE tenant_id = ? AND id = ?');
    $stmt->execute([$tenantId, $id]);
    $curr = $stmt->fetch();
  } catch (PDOException $e) {
    $stmt = $pdo->prepare('SELECT * FROM assets WHERE id = ?');
    $stmt->execute([$id]);
    $curr = $stmt->fetch();
  }
  if (!$curr) json_error('Không tìm thấy tài sản.', 404);

  require_chi_access($user, $curr['chi_id'] !== null ? (int)$curr['chi_id'] : null);

  try {
    $stmt = $pdo->prepare('DELETE FROM assets WHERE tenant_id = ? AND id = ?');
    $stmt->execute([$tenantId, $id]);
  } catch (PDOException $e) {
    $stmt = $pdo->prepare('DELETE FROM assets WHERE id = ?');
    $stmt->execute([$id]);
  }

  json_response(['success' => true]);
}

json_error('Method not allowed', 405);
