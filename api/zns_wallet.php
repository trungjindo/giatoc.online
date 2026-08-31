<?php
require_once __DIR__ . '/helpers.php';
send_cors_headers();

$action = $_GET['action'] ?? '';
$pdo = get_db();
$tenant = get_current_tenant($pdo);
$tenantId = (int)$tenant['id'];

// ---------------------------------------------------------------------------
// 1. Lấy thông tin số dư Ví gửi tin nhắn thông báo & Lịch sử giao dịch
// ---------------------------------------------------------------------------
if ($action === 'info') {
  require_auth();

  try {
    $stmt = $pdo->prepare('SELECT zns_balance FROM tenants WHERE id = ?');
    $stmt->execute([$tenantId]);
    $row = $stmt->fetch();
    $balance = $row ? (float)$row['zns_balance'] : 0;
  } catch (PDOException $e) {
    $balance = 0;
  }

  try {
    $stmt = $pdo->prepare(
      'SELECT id, tx_code, type, amount, balance_after, description, status, created_at, confirmed_at
       FROM zns_wallet_transactions
       WHERE tenant_id = ?
       ORDER BY id DESC LIMIT 50'
    );
    $stmt->execute([$tenantId]);
    $txs = $stmt->fetchAll();
  } catch (PDOException $e) {
    $txs = [];
  }

  json_response([
    'balance' => $balance,
    'equivalentMessages' => (int)floor($balance / 400),
    'unitPrice' => 400,
    'transactions' => array_map(function ($r) {
      return [
        'id' => (int)$r['id'],
        'txCode' => $r['tx_code'],
        'type' => $r['type'],
        'amount' => (float)$r['amount'],
        'balanceAfter' => (float)$r['balance_after'],
        'description' => $r['description'],
        'status' => $r['status'],
        'createdAt' => $r['created_at'],
        'confirmedAt' => $r['confirmed_at'],
      ];
    }, $txs)
  ]);
}

// ---------------------------------------------------------------------------
// 2. Tạo lệnh nạp tiền vào Ví gửi tin nhắn thông báo (Sinh mã VietQR MBBank)
// ---------------------------------------------------------------------------
if ($action === 'create_topup' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $user = require_auth();
  $body = read_json_body();
  $amount = max(50000, (float)($body['amount'] ?? 200000));

  $txCode = 'NAP' . rand(10000, 99999);
  $memo = 'NAPZNS ' . $tenant['slug'] . ' ' . $txCode;

  try {
    $stmt = $pdo->prepare(
      'INSERT INTO zns_wallet_transactions (tenant_id, tx_code, type, amount, balance_after, description, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
      $tenantId, $txCode, 'topup', $amount, (float)($tenant['zns_balance'] ?? 0),
      "Nạp tiền vào Ví gửi tin nhắn thông báo ({$amount}đ)", 'pending', $user['id']
    ]);
    $txId = (int)$pdo->lastInsertId();
  } catch (PDOException $e) {
    json_error('Lỗi khi tạo yêu cầu nạp tiền: ' . $e->getMessage(), 500);
  }

  // Đọc thông tin MBBank
  $bankCode = 'MB';
  $accountNumber = '99997379999';
  $accountName = 'TRẦN ĐÌNH TRUNG';
  try {
    $stmt = $pdo->query('SELECT setting_key, setting_value FROM platform_settings');
    foreach ($stmt->fetchAll() as $r) {
      if ($r['setting_key'] === 'bank_code') $bankCode = $r['setting_value'];
      if ($r['setting_key'] === 'account_number') $accountNumber = $r['setting_value'];
      if ($r['setting_key'] === 'account_name') $accountName = $r['setting_value'];
    }
  } catch (PDOException $e) {}

  $accountNameEnc = rawurlencode($accountName);
  $memoEnc = rawurlencode($memo);
  $qrUrl = "https://img.vietqr.io/image/{$bankCode}-{$accountNumber}-compact2.png?amount={$amount}&addInfo={$memoEnc}&accountName={$accountNameEnc}";

  json_response([
    'success' => true,
    'txId' => $txId,
    'txCode' => $txCode,
    'amount' => $amount,
    'equivalentMessages' => (int)floor($amount / 400),
    'memo' => $memo,
    'bankInfo' => [
      'bankCode' => $bankCode,
      'bankName' => 'Ngân Hàng Quân Đội (MBBank)',
      'accountNumber' => $accountNumber,
      'accountName' => $accountName,
      'memo' => $memo,
      'qrUrl' => $qrUrl,
    ]
  ], 201);
}

// ---------------------------------------------------------------------------
// 3. Danh sách nạp tiền chờ duyệt (Dành cho Platform Super Admin)
// ---------------------------------------------------------------------------
if ($action === 'list_admin_topups') {
  require_role(['admin']);

  try {
    $stmt = $pdo->query(
      'SELECT tx.*, t.name AS clan_name, t.slug AS clan_slug, u.full_name AS requester_name
       FROM zns_wallet_transactions tx
       JOIN tenants t ON t.id = tx.tenant_id
       LEFT JOIN users u ON u.id = tx.created_by
       ORDER BY tx.id DESC LIMIT 100'
    );
    $rows = $stmt->fetchAll();
  } catch (PDOException $e) {
    json_error('Lỗi khi lấy danh sách nạp ví: ' . $e->getMessage(), 500);
  }

  json_response($rows);
}

// ---------------------------------------------------------------------------
// 4. Duyệt nạp tiền vào Ví gửi tin nhắn thông báo (Platform Super Admin)
// ---------------------------------------------------------------------------
if ($action === 'confirm_topup' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $superUser = require_role(['admin']);
  $body = read_json_body();
  $txId = (int)($body['txId'] ?? 0);

  if ($txId <= 0) json_error('Thiếu mã giao dịch.', 400);

  $pdo->beginTransaction();
  try {
    $stmt = $pdo->prepare('SELECT * FROM zns_wallet_transactions WHERE id = ? FOR UPDATE');
    $stmt->execute([$txId]);
    $tx = $stmt->fetch();

    if (!$tx) throw new Exception('Không tìm thấy giao dịch.');
    if ($tx['status'] === 'completed') throw new Exception('Giao dịch đã được duyệt trước đó.');

    $tId = (int)$tx['tenant_id'];
    $amt = (float)$tx['amount'];

    // Cập nhật số dư dòng họ
    $stmt = $pdo->prepare('UPDATE tenants SET zns_balance = zns_balance + ? WHERE id = ?');
    $stmt->execute([$amt, $tId]);

    // Lấy số dư mới
    $stmt = $pdo->prepare('SELECT zns_balance FROM tenants WHERE id = ?');
    $stmt->execute([$tId]);
    $newBalance = (float)$stmt->fetch()['zns_balance'];

    // Cập nhật giao dịch
    $stmt = $pdo->prepare(
      "UPDATE zns_wallet_transactions SET status = 'completed', balance_after = ?, confirmed_at = NOW(), confirmed_by = ?
       WHERE id = ?"
    );
    $stmt->execute([$newBalance, $superUser['id'], $txId]);

    $pdo->commit();

    json_response([
      'success' => true,
      'message' => "Đã duyệt nạp thành công " . number_format($amt, 0, ',', '.') . " đ vào Ví gửi tin nhắn thông báo!",
      'newBalance' => $newBalance
    ]);
  } catch (Exception $e) {
    $pdo->rollBack();
    json_error($e->getMessage(), 500);
  }
}

json_error('Action not allowed', 405);
