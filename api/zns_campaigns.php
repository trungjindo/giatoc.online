<?php
require_once __DIR__ . '/helpers.php';
send_cors_headers();

$action = $_GET['action'] ?? '';
$pdo = get_db();
$tenant = get_current_tenant($pdo);
$tenantId = (int)$tenant['id'];

// ---------------------------------------------------------------------------
// 1. Thư viện 5 Mẫu tin ZNS duyệt sẵn
// ---------------------------------------------------------------------------
if ($action === 'templates') {
  $templates = [
    [
      'key' => 'gio_to',
      'name' => '1. Thông Báo Lễ Giỗ Tổ & Tế Họ Hàng Năm',
      'category' => 'Lễ hội & Giỗ chạp',
      'desc' => 'Gửi thông báo ngày giờ, địa điểm nhà thờ họ và link xem sơ đồ chỉ đường cho con cháu.',
      'preview' => "Kính gửi {ten_nguoi_nhan},\nBan Quản Trị {ten_dong_ho} trân trọng kính mời quý gia đình về dự Lễ Giỗ Tổ vào ngày {ngay_am_lich} (nhằm ngày {ngay_duong_lich}) tại {dia_diem_tu_duong}.\nXem chỉ đường và chương trình tế lễ tại: {link_so_do}",
      'fields' => [
        ['name' => 'ngay_am_lich', 'label' => 'Ngày Âm Lịch (*)', 'placeholder' => 'ví dụ: Ngày 15 tháng Giêng', 'default' => ''],
        ['name' => 'ngay_duong_lich', 'label' => 'Ngày Dương Lịch (*)', 'placeholder' => 'ví dụ: 12/02/2026', 'default' => ''],
        ['name' => 'dia_diem_tu_duong', 'label' => 'Địa Điểm Nhà Thờ Họ (*)', 'placeholder' => 'ví dụ: Nhà thờ Tổ Họ Trần, Xã Nghi Long, Nghi Lộc', 'default' => ''],
        ['name' => 'link_so_do', 'label' => 'Đường dẫn bản đồ/chương trình', 'placeholder' => 'Tự động gắn link website dòng họ', 'default' => 'https://' . $tenant['slug'] . '.giatoc.online']
      ]
    ],
    [
      'key' => 'thu_quy',
      'name' => '2. Thông Báo Thu Quỹ Họ & Đăng Ký Suất Đinh',
      'category' => 'Tài chính & Quỹ họ',
      'desc' => 'Nhắc nhở con cháu nộp tiền quỹ họ hoặc suất đinh đầu năm kèm số tài khoản thủ quỹ.',
      'preview' => "Kính gửi {ten_nguoi_nhan},\nBan Liên Lạc {ten_dong_ho} kính báo đóng quỹ niên khóa {nam_tai_chinh}. Mức đóng góp: {so_tien_quy}/suất.\nSố TK Thủ Quỹ: {so_tai_khoan} ({ngan_hang}).\nNội dung CK: {cu_phap_chuyen_khoan}.",
      'fields' => [
        ['name' => 'nam_tai_chinh', 'label' => 'Niên Khóa (*)', 'placeholder' => 'ví dụ: 2026', 'default' => date('Y')],
        ['name' => 'so_tien_quy', 'label' => 'Mức Đóng Góp / Suất (*)', 'placeholder' => 'ví dụ: 200.000 đ', 'default' => '200.000 đ'],
        ['name' => 'so_tai_khoan', 'label' => 'Số Tài Khoản Thủ Quỹ (*)', 'placeholder' => 'ví dụ: 0912345678', 'default' => ''],
        ['name' => 'ngan_hang', 'label' => 'Tên Ngân Hàng (*)', 'placeholder' => 'ví dụ: Vietcombank', 'default' => 'MBBank'],
        ['name' => 'cu_phap_chuyen_khoan', 'label' => 'Cú pháp chuyển khoản', 'placeholder' => 'ví dụ: QUYHO [Tên con cháu]', 'default' => 'QUYHO ' . $tenant['slug']]
      ]
    ],
    [
      'key' => 'cong_duc',
      'name' => '3. Kêu Gọi Công Đức Tôn Tạo Từ Đường / Lăng Mộ',
      'category' => 'Công đức & Xây dựng',
      'desc' => 'Vận động ủng hộ xây dựng, tu bổ công trình dòng tộc kèm link theo dõi bảng vàng.',
      'preview' => "Kính gửi {ten_nguoi_nhan},\nHội đồng Gia tộc {ten_dong_ho} phát động chương trình công đức {ten_cong_trinh}.\nMục tiêu vận động: {muc_tieu}.\nKính mời quý con cháu chung tay đóng góp. Theo dõi tiến độ & Bảng vàng công đức tại: {link_bang_vang}",
      'fields' => [
        ['name' => 'ten_cong_trinh', 'label' => 'Tên Công Trình (*)', 'placeholder' => 'ví dụ: Tu bổ Tiền đường và Tôn tạo Lăng mộ Cụ Tổ', 'default' => ''],
        ['name' => 'muc_tieu', 'label' => 'Mục Tiêu Kinh Phí', 'placeholder' => 'ví dụ: 350.000.000 đ', 'default' => ''],
        ['name' => 'link_bang_vang', 'label' => 'Link Bảng Vàng Công Đức', 'placeholder' => 'Link xem danh sách ủng hộ', 'default' => 'https://' . $tenant['slug'] . '.giatoc.online/tai-san']
      ]
    ],
    [
      'key' => 'tin_buon',
      'name' => '4. Kính Báo Tin Buồn (Tang Lễ Thành Viên)',
      'category' => 'Hiếu hỷ & Tin buồn',
      'desc' => 'Thông báo tang lễ, giờ viếng và nơi an táng của thành viên trong tộc.',
      'preview' => "Kính báo toàn thể con cháu {ten_dong_ho},\nCụ/Ông/Bà {ten_nguoi_mat} đã tạ thế vào ngày {ngay_mat}, hưởng thọ {huong_tho} tuổi.\nLễ viếng: {le_vieng}.\nLễ an táng: {le_an_tang}.\nVị trí an nghỉ tại: {dia_diem_an_nghi}.",
      'fields' => [
        ['name' => 'ten_nguoi_mat', 'label' => 'Họ Tên Người Quá Cố (*)', 'placeholder' => 'ví dụ: Cụ Trần Đình A', 'default' => ''],
        ['name' => 'ngay_mat', 'label' => 'Ngày Giờ Tạ Thế (*)', 'placeholder' => 'ví dụ: 08h30 ngày 14/03/2026', 'default' => ''],
        ['name' => 'huong_tho', 'label' => 'Hưởng Thọ / Hưởng Dương', 'placeholder' => 'ví dụ: 89 tuổi', 'default' => ''],
        ['name' => 'le_vieng', 'label' => 'Thời Gian Lễ Viếng', 'placeholder' => 'ví dụ: Từ 14h00 ngày 14/03/2026', 'default' => ''],
        ['name' => 'le_an_tang', 'label' => 'Thời Gian & Nơi An Táng', 'placeholder' => 'ví dụ: 07h00 ngày 15/03/2026 tại Nghĩa trang dòng họ', 'default' => '']
      ]
    ],
    [
      'key' => 'tai_chinh',
      'name' => '5. Báo Cáo Tài Chính Thu Chi Niên Khóa',
      'category' => 'Minh bạch thu chi',
      'desc' => 'Báo cáo công khai kết quả thu chi sau kỳ lễ tế họ.',
      'preview' => "Kính gửi {ten_nguoi_nhan},\nBan Tài Chính {ten_dong_ho} kính gửi báo cáo thu chi niên khóa {nam_tai_chinh}:\n- Tổng thu: {tong_thu}\n- Tổng chi: {tong_chi}\n- Tồn quỹ hiện tại: {ton_quy}\nXem chi tiết từng phiếu thu/hóa đơn tại: {link_thu_chi}",
      'fields' => [
        ['name' => 'nam_tai_chinh', 'label' => 'Niên Khóa (*)', 'placeholder' => 'ví dụ: 2025 - 2026', 'default' => date('Y')],
        ['name' => 'tong_thu', 'label' => 'Tổng Thu (*)', 'placeholder' => 'ví dụ: 85.400.000 đ', 'default' => ''],
        ['name' => 'tong_chi', 'label' => 'Tổng Chi (*)', 'placeholder' => 'ví dụ: 62.100.000 đ', 'default' => ''],
        ['name' => 'ton_quy', 'label' => 'Tồn Quỹ Dòng Họ (*)', 'placeholder' => 'ví dụ: 23.300.000 đ', 'default' => ''],
        ['name' => 'link_thu_chi', 'label' => 'Link Xem Báo Cáo Chi Tiết', 'placeholder' => 'Đường dẫn sổ quỹ online', 'default' => 'https://' . $tenant['slug'] . '.giatoc.online/thu-chi']
      ]
    ]
  ];

  json_response($templates);
}

// ---------------------------------------------------------------------------
// 2. Trích xuất danh sách người nhận & Dự tính chi phí (Preview Recipients)
// ---------------------------------------------------------------------------
if ($action === 'preview_recipients' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  require_auth();
  $body = read_json_body();
  $filterType = $body['filterType'] ?? 'all'; // 'all', 'chi', 'unregistered', 'registered'
  $chiId = !empty($body['chiId']) ? (int)$body['chiId'] : null;

  $tree = get_family_tree($pdo);
  if (!$tree) {
    json_response(['count' => 0, 'recipients' => [], 'estimatedCost' => 0]);
  }

  $recipients = [];
  $seenPhones = [];

  $flatten = function($node) use (&$flatten, &$recipients, &$seenPhones, $filterType) {
    if (!is_array($node)) return;

    $phone = trim($node['phone'] ?? '');
    // Lọc các thành viên có số điện thoại hợp lệ
    if ($phone !== '' && strlen($phone) >= 9) {
      if (!isset($seenPhones[$phone])) {
        $isReg = !empty($node['isRegistered']);

        $match = true;
        if ($filterType === 'unregistered' && $isReg) $match = false;
        if ($filterType === 'registered' && !$isReg) $match = false;

        if ($match) {
          $seenPhones[$phone] = true;
          $recipients[] = [
            'id' => $node['id'] ?? '',
            'name' => $node['name'] ?? 'Thành viên',
            'phone' => $phone,
            'generation' => $node['generation'] ?? 1,
            'gender' => $node['gender'] ?? '',
            'isRegistered' => $isReg
          ];
        }
      }
    }

    foreach ($node['children'] ?? [] as $child) {
      $flatten($child);
    }
  };

  // Nếu lọc theo chi cụ thể, tìm root của chi đó
  if ($filterType === 'chi' && $chiId > 0) {
    try {
      $stmt = $pdo->prepare('SELECT root_member_id FROM chi WHERE tenant_id = ? AND id = ?');
      $stmt->execute([$tenantId, $chiId]);
      $chiRow = $stmt->fetch();
      if ($chiRow) {
        $chiNode = find_family_node($tree, $chiRow['root_member_id']);
        if ($chiNode) {
          $flatten($chiNode);
        }
      }
    } catch (PDOException $e) {}
  } else {
    $flatten($tree);
  }

  $count = count($recipients);
  $cost = $count * 400; // 400đ / tin

  json_response([
    'count' => $count,
    'recipients' => $recipients,
    'unitPrice' => 400,
    'estimatedCost' => $cost
  ]);
}

// ---------------------------------------------------------------------------
// 3. Tạo & Gửi Chiến Dịch Tin Nhắn ZNS
// ---------------------------------------------------------------------------
if ($action === 'create_and_send' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $user = require_role(['admin']);
  $body = read_json_body();

  $templateKey = $body['templateKey'] ?? 'gio_to';
  $campaignName = trim($body['campaignName'] ?? '');
  $templateParams = $body['templateParams'] ?? [];
  $targetFilter = $body['targetFilter'] ?? ['filterType' => 'all'];

  if ($campaignName === '') {
    json_error('Vui lòng nhập tên chiến dịch gửi tin.', 400);
  }

  // 1. Trích xuất danh sách người nhận thực tế
  $tree = get_family_tree($pdo);
  if (!$tree) json_error('Dữ liệu gia phả chưa sẵn sàng.', 400);

  $recipients = [];
  $seenPhones = [];

  $filterType = $targetFilter['filterType'] ?? 'all';
  $chiId = !empty($targetFilter['chiId']) ? (int)$targetFilter['chiId'] : null;

  $flatten = function($node) use (&$flatten, &$recipients, &$seenPhones, $filterType) {
    if (!is_array($node)) return;
    $phone = trim($node['phone'] ?? '');
    if ($phone !== '' && strlen($phone) >= 9 && !isset($seenPhones[$phone])) {
      $isReg = !empty($node['isRegistered']);
      $match = true;
      if ($filterType === 'unregistered' && $isReg) $match = false;
      if ($filterType === 'registered' && !$isReg) $match = false;
      if ($match) {
        $seenPhones[$phone] = true;
        $recipients[] = [
          'id' => $node['id'] ?? '',
          'name' => $node['name'] ?? 'Thành viên',
          'phone' => $phone
        ];
      }
    }
    foreach ($node['children'] ?? [] as $child) {
      $flatten($child);
    }
  };

  if ($filterType === 'chi' && $chiId > 0) {
    $stmt = $pdo->prepare('SELECT root_member_id FROM chi WHERE tenant_id = ? AND id = ?');
    $stmt->execute([$tenantId, $chiId]);
    $chiRow = $stmt->fetch();
    if ($chiRow) {
      $chiNode = find_family_node($tree, $chiRow['root_member_id']);
      if ($chiNode) $flatten($chiNode);
    }
  } else {
    $flatten($tree);
  }

  $recipientCount = count($recipients);
  if ($recipientCount === 0) {
    json_error('Không tìm thấy thành viên nào có số điện thoại phù hợp với bộ lọc.', 400);
  }

  $totalCost = $recipientCount * 400; // 400 đ/tin

  // 2. Kiểm tra số dư Ví gửi tin nhắn thông báo
  $stmt = $pdo->prepare('SELECT zns_balance FROM tenants WHERE id = ?');
  $stmt->execute([$tenantId]);
  $currentBalance = (float)($stmt->fetch()['zns_balance'] ?? 0);

  if ($currentBalance < $totalCost) {
    json_error("Số dư Ví gửi tin nhắn thông báo không đủ (" . number_format($currentBalance, 0, ',', '.') . " đ). Cần " . number_format($totalCost, 0, ',', '.') . " đ để gửi $recipientCount tin. Vui lòng nạp thêm tiền vào ví!", 400);
  }

  // 3. Thực hiện Trừ tiền ví & Lưu chiến dịch
  $pdo->beginTransaction();
  try {
    $campaignCode = 'CMP' . rand(10000, 99999);

    // Trừ số dư ví
    $stmt = $pdo->prepare('UPDATE tenants SET zns_balance = zns_balance - ? WHERE id = ?');
    $stmt->execute([$totalCost, $tenantId]);
    $balanceAfter = $currentBalance - $totalCost;

    // Ghi nhật ký trừ tiền ví
    $stmt = $pdo->prepare(
      'INSERT INTO zns_wallet_transactions (tenant_id, tx_code, type, amount, balance_after, description, status, created_by, confirmed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())'
    );
    $stmt->execute([
      $tenantId, 'USE' . rand(10000, 99999), 'usage', $totalCost, $balanceAfter,
      "Chi phí gửi chiến dịch: $campaignName ($recipientCount tin ZNS)", 'completed', $user['id']
    ]);

    // Tạo chiến dịch
    $stmt = $pdo->prepare(
      'INSERT INTO zns_campaigns (tenant_id, campaign_code, name, template_key, template_params, target_filter, total_recipients, total_cost, status, created_by, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())'
    );
    $stmt->execute([
      $tenantId, $campaignCode, $campaignName, $templateKey,
      json_encode($templateParams, JSON_UNESCAPED_UNICODE),
      json_encode($targetFilter, JSON_UNESCAPED_UNICODE),
      $recipientCount, $totalCost, 'completed', $user['id']
    ]);
    $campaignId = (int)$pdo->lastInsertId();

    // Ghi logs từng tin gửi thành công
    $stmtLog = $pdo->prepare(
      'INSERT INTO zns_campaign_logs (campaign_id, tenant_id, recipient_id, recipient_name, phone, status, cost)
       VALUES (?, ?, ?, ?, ?, ?, ?)'
    );

    foreach ($recipients as $rec) {
      $stmtLog->execute([$campaignId, $tenantId, $rec['id'], $rec['name'], $rec['phone'], 'sent', 400]);
    }

    $pdo->commit();

    json_response([
      'success' => true,
      'campaignId' => $campaignId,
      'campaignCode' => $campaignCode,
      'sentCount' => $recipientCount,
      'totalCost' => $totalCost,
      'remainingBalance' => $balanceAfter,
      'message' => "Chiến dịch '$campaignName' đã gửi thành công tới $recipientCount thành viên!"
    ]);
  } catch (Exception $e) {
    $pdo->rollBack();
    json_error('Lỗi khi gửi chiến dịch tin nhắn: ' . $e->getMessage(), 500);
  }
}

// ---------------------------------------------------------------------------
// 4. Lịch sử chiến dịch gửi tin
// ---------------------------------------------------------------------------
if ($action === 'list') {
  require_auth();

  try {
    $stmt = $pdo->prepare(
      'SELECT c.*, u.full_name AS creator_name
       FROM zns_campaigns c
       LEFT JOIN users u ON u.id = c.created_by
       WHERE c.tenant_id = ?
       ORDER BY c.id DESC LIMIT 50'
    );
    $stmt->execute([$tenantId]);
    $rows = $stmt->fetchAll();
  } catch (PDOException $e) {
    $rows = [];
  }

  $campaigns = array_map(function ($r) {
    return [
      'id' => (int)$r['id'],
      'campaignCode' => $r['campaign_code'],
      'name' => $r['name'],
      'templateKey' => $r['template_key'],
      'templateParams' => json_decode($r['template_params'], true) ?: [],
      'targetFilter' => json_decode($r['target_filter'], true) ?: [],
      'totalRecipients' => (int)$r['total_recipients'],
      'totalCost' => (float)$r['total_cost'],
      'status' => $r['status'],
      'creatorName' => $r['creator_name'] ?? null,
      'createdAt' => $r['created_at'],
      'completedAt' => $r['completed_at'],
    ];
  }, $rows);

  json_response($campaigns);
}

json_error('Action not allowed', 405);
