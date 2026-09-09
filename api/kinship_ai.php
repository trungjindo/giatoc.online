<?php
require_once __DIR__ . '/helpers.php';
send_cors_headers();

$action = $_GET['action'] ?? 'calculate';
$pdo = get_db();
$tenant = get_current_tenant($pdo);

// ---------------------------------------------------------------------------
// 1. Thuật Toán Tính Toán Ngôi Thứ & Xưng Hô Gia Tộc Chuẩn Việt Nam
// ---------------------------------------------------------------------------
if ($action === 'calculate' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $body = read_json_body();
  $m1Id = trim($body['member1Id'] ?? '');
  $m2Id = trim($body['member2Id'] ?? '');

  if ($m1Id === '' || $m2Id === '') {
    json_error('Vui lòng chọn 2 người cần tra cứu xưng hô.', 400);
  }

  $tree = get_family_tree($pdo);
  if (!$tree) json_error('Chưa có dữ liệu cây gia phả.', 400);

  // Tìm đường dẫn phả hệ từ gốc đến node
  $findPath = function($node, $targetId, $path = []) use (&$findPath) {
    if (!is_array($node)) return null;
    $currentPath = array_merge($path, [$node]);
    if (($node['id'] ?? '') === $targetId) {
      return $currentPath;
    }
    foreach ($node['children'] ?? [] as $idx => $child) {
      $childWithBranch = array_merge($child, ['_birthOrder' => $idx + 1]);
      $res = $findPath($childWithBranch, $targetId, $currentPath);
      if ($res !== null) return $res;
    }
    return null;
  };

  $path1 = $findPath($tree, $m1Id);
  $path2 = $findPath($tree, $m2Id);

  if (!$path1 || !$path2) {
    json_error('Không tìm thấy một trong hai thành viên trên cây gia phả.', 404);
  }

  $m1 = end($path1);
  $m2 = end($path2);

  $gen1 = (int)($m1['generation'] ?? count($path1));
  $gen2 = (int)($m2['generation'] ?? count($path2));
  $genDelta = $gen1 - $gen2; // > 0: m1 là đời sau (nhỏ hơn m2), < 0: m1 là đời trước (lớn hơn m2)

  // Tìm tổ tiên chung gần nhất (Lowest Common Ancestor - LCA)
  $lcaIndex = 0;
  $minLen = min(count($path1), count($path2));
  for ($i = 0; $i < $minLen; $i++) {
    if ($path1[$i]['id'] === $path2[$i]['id']) {
      $lcaIndex = $i;
    } else {
      break;
    }
  }

  $lca = $path1[$lcaIndex];
  $distanceToLca1 = count($path1) - 1 - $lcaIndex;
  $distanceToLca2 = count($path2) - 1 - $lcaIndex;

  $m1Name = $m1['name'];
  $m2Name = $m2['name'];
  $m1Gender = $m1['gender'] ?? 'Nam';
  $m2Gender = $m2['gender'] ?? 'Nam';

  // Xác định vai vế Chi trưởng / Chi thứ tại điểm phân nhánh
  $isM1SeniorBranch = false;
  $isM2SeniorBranch = false;
  if ($lcaIndex + 1 < count($path1) && $lcaIndex + 1 < count($path2)) {
    $branch1Order = $path1[$lcaIndex + 1]['_birthOrder'] ?? 1;
    $branch2Order = $path2[$lcaIndex + 1]['_birthOrder'] ?? 1;
    if ($branch1Order < $branch2Order) $isM1SeniorBranch = true;
    if ($branch2Order < $branch1Order) $isM2SeniorBranch = true;
  }

  $m1CallsM2 = '';
  $m2CallsM1 = '';
  $explanation = '';

  // 1. Trùng chính người đó
  if ($m1Id === $m2Id) {
    json_response([
      'm1Name' => $m1Name,
      'm2Name' => $m2Name,
      'm1CallsM2' => 'Chính mình',
      'm2CallsM1' => 'Chính mình',
      'explanation' => 'Đây là cùng một người trên cây gia phả.'
    ]);
  }

  // 2. Quan hệ trực hệ trực tiếp (Cha - Con, Ông - Cháu, Cụ - Chắt)
  if ($distanceToLca1 === 0 || $distanceToLca2 === 0) {
    $absDelta = abs($genDelta);
    if ($genDelta > 0) { // m1 là con/cháu của m2
      if ($absDelta === 1) {
        $m1CallsM2 = ($m2Gender === 'Nam') ? 'Cha / Bố / Thân sinh' : 'Mẹ / Mẫu thân';
        $m2CallsM1 = ($m1Gender === 'Nam') ? 'Con trai' : 'Con gái';
      } elseif ($absDelta === 2) {
        $m1CallsM2 = ($m2Gender === 'Nam') ? 'Ông nội' : 'Bà nội';
        $m2CallsM1 = 'Cháu nội';
      } elseif ($absDelta === 3) {
        $m1CallsM2 = ($m2Gender === 'Nam') ? 'Cụ ông (Cụ Cố)' : 'Cụ bà (Cụ Cố)';
        $m2CallsM1 = 'Chắt';
      } elseif ($absDelta === 4) {
        $m1CallsM2 = 'Cụ Kỵ';
        $m2CallsM1 = 'Chút';
      } else {
        $m1CallsM2 = 'Cụ Tổ / Tiền nhân đời thứ ' . $gen2;
        $m2CallsM1 = 'Hậu duệ đời thứ ' . $gen1;
      }
      $explanation = "Quan hệ trực hệ phụ tử / tổ tôn trực tiếp ($absDelta đời).";
    } else { // m1 là cha/ông của m2
      if ($absDelta === 1) {
        $m1CallsM2 = ($m2Gender === 'Nam') ? 'Con trai' : 'Con gái';
        $m2CallsM1 = ($m1Gender === 'Nam') ? 'Cha / Bố' : 'Mẹ';
      } elseif ($absDelta === 2) {
        $m1CallsM2 = 'Cháu nội';
        $m2CallsM1 = ($m1Gender === 'Nam') ? 'Ông nội' : 'Bà nội';
      } elseif ($absDelta === 3) {
        $m1CallsM2 = 'Chắt';
        $m2CallsM1 = ($m1Gender === 'Nam') ? 'Cụ ông' : 'Cụ bà';
      } else {
        $m1CallsM2 = 'Hậu duệ đời thứ ' . $gen2;
        $m2CallsM1 = 'Cụ Tổ đời thứ ' . $gen1;
      }
      $explanation = "Quan hệ trực hệ phụ tử / tổ tôn trực tiếp ($absDelta đời).";
    }
  }
  // 3. Quan hệ cùng thế hệ (Cùng đời: genDelta = 0)
  elseif ($genDelta === 0) {
    if ($distanceToLca1 === 1 && $distanceToLca2 === 1) {
      // Anh em ruột
      $explanation = "Quan hệ anh chị em ruột (cùng cha mẹ).";
      if ($isM1SeniorBranch) {
        $m1CallsM2 = ($m2Gender === 'Nam') ? 'Em trai' : 'Em gái';
        $m2CallsM1 = ($m1Gender === 'Nam') ? 'Anh trai' : 'Chị gái';
      } else {
        $m1CallsM2 = ($m2Gender === 'Nam') ? 'Anh trai' : 'Chị gái';
        $m2CallsM1 = ($m1Gender === 'Nam') ? 'Em trai' : 'Em gái';
      }
    } else {
      // Anh em họ (Cùng đời trong tộc)
      // Theo tục Việt Nam: 'Bé bằng củ khoai, cứ vai mà gọi' -> Chi trên/con anh xưng Anh/Chị, Chi dưới xưng Em.
      if ($isM2SeniorBranch) {
        $m1CallsM2 = ($m2Gender === 'Nam') ? 'Anh họ (thuộc Chi trên)' : 'Chị họ (thuộc Chi trên)';
        $m2CallsM1 = ($m1Gender === 'Nam') ? 'Em họ' : 'Em họ';
        $explanation = "Cùng đời thứ $gen1. Người thứ 2 thuộc cành trên (Chi trưởng/con bác) nên dù ít tuổi hơn vẫn là Anh/Chị bề trên.";
      } else {
        $m1CallsM2 = ($m2Gender === 'Nam') ? 'Em họ' : 'Em họ';
        $m2CallsM1 = ($m1Gender === 'Nam') ? 'Anh họ' : 'Chị họ';
        $explanation = "Cùng đời thứ $gen1. Người thứ 1 thuộc cành trên (Chi trưởng/con bác).";
      }
    }
  }
  // 4. Quan hệ chênh lệch 1 thế hệ (Bác, Chú, Cô, Cậu, Dì - Cháu)
  elseif ($genDelta === 1) { // m1 nhỏ hơn 1 đời (m2 là vai Bác/Chú/Cô)
    if ($isM2SeniorBranch || $distanceToLca2 === 1) {
      $m1CallsM2 = ($m2Gender === 'Nam') ? 'Bác (Bác họ trong tộc)' : 'Bác gái / Cô';
    } else {
      $m1CallsM2 = ($m2Gender === 'Nam') ? 'Chú / Cậu' : 'Cô / Dì';
    }
    $m2CallsM1 = 'Cháu (xưng Bác/Chú)';
    $explanation = "m1 ở đời thứ $gen1, m2 ở đời thứ $gen2 (hơn 1 thế hệ). m1 gọi m2 là Bác/Chú/Cô theo vai vế chi phái.";
  }
  elseif ($genDelta === -1) { // m1 lớn hơn 1 đời
    $m1CallsM2 = 'Cháu (xưng Bác/Chú)';
    $m2CallsM1 = ($m1Gender === 'Nam') ? 'Bác / Chú' : 'Bác gái / Cô';
    $explanation = "m1 ở đời thứ $gen1, m2 ở đời thứ $gen2 (kém 1 thế hệ).";
  }
  // 5. Chênh lệch 2 thế hệ trở lên trong tộc (Ông/Bà họ - Cháu họ, Cụ họ - Chắt)
  elseif ($genDelta === 2) {
    $m1CallsM2 = ($m2Gender === 'Nam') ? 'Ông họ (Ông chú / Ông bác)' : 'Bà họ (Bà cô / Bà dì)';
    $m2CallsM1 = 'Cháu họ';
    $explanation = "Cách nhau 2 thế hệ trong dòng tộc. m1 gọi m2 là Ông họ / Bà họ theo thứ bậc phả hệ.";
  }
  elseif ($genDelta === -2) {
    $m1CallsM2 = 'Cháu họ';
    $m2CallsM1 = ($m1Gender === 'Nam') ? 'Ông họ' : 'Bà họ';
    $explanation = "Cách nhau 2 thế hệ trong dòng tộc.";
  }
  elseif ($genDelta >= 3) {
    $m1CallsM2 = ($m2Gender === 'Nam') ? 'Cụ họ (Cụ Cố trong tộc)' : 'Cụ bà';
    $m2CallsM1 = 'Chắt trong tộc';
    $explanation = "Cách nhau $genDelta thế hệ trong gia tộc.";
  } else {
    $m1CallsM2 = 'Chắt / Hậu duệ trong tộc';
    $m2CallsM1 = ($m1Gender === 'Nam') ? 'Cụ họ' : 'Cụ bà';
    $explanation = "Cách nhau " . abs($genDelta) . " thế hệ trong gia tộc.";
  }

  json_response([
    'm1' => ['id' => $m1Id, 'name' => $m1Name, 'generation' => $gen1, 'gender' => $m1Gender],
    'm2' => ['id' => $m2Id, 'name' => $m2Name, 'generation' => $gen2, 'gender' => $m2Gender],
    'genDelta' => $genDelta,
    'lcaName' => $lca['name'] ?? '',
    'm1CallsM2' => $m1CallsM2,
    'm2CallsM1' => $m2CallsM1,
    'explanation' => $explanation,
    'etiquetteTip' => 'Khi xưng hô trong nhà thờ họ ngày giỗ, con cháu luôn xưng "Con/Cháu" với bậc cao niên và chào hỏi theo đúng vai cành trưởng/thứ.'
  ]);
}

// ---------------------------------------------------------------------------
// 2. Hỏi Đáp Phong Tục & Lễ Nghi Dòng Tộc (AI Etiquette Q&A)
// ---------------------------------------------------------------------------
if ($action === 'ask_custom' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $body = read_json_body();
  $question = trim($body['question'] ?? '');

  if ($question === '') json_error('Vui lòng nhập câu hỏi.', 400);

  $qLower = mb_strtolower($question, 'UTF-8');

  // Tri thức chuyên sâu văn hóa gia tộc Việt Nam
  $answer = '';
  if (strpos($qLower, 'giỗ') !== false || strpos($qLower, 'tế họ') !== false) {
    $answer = "Trong lễ tế họ truyền thống, nghi thức gồm 3 tuần lễ chính: Sơ hiến lễ (dâng rượu lần 1), Á hiến lễ (dâng rượu lần 2), Chung hiến lễ (dâng rượu lần 3). Trưởng tộc hoặc Đích tôn sẽ là chủ tế. Con cháu dự lễ mặc trang phục trang nghiêm (áo dài truyền thống hoặc âu phục), khi vào gian tiền đường hành lễ lạy 4 lạy và vái 3 vái.";
  } elseif (strpos($qLower, 'bãi biện') !== false) {
    $answer = "Bãi biện là chức danh phân công luân phiên cho các gia đình con cháu trong dòng họ để chuẩn bị lễ vật, dọn dẹp từ đường, chuẩn bị hương hoa trà quả và phụ trách việc bếp núc phục vụ ngày lễ tế tổ. Sau khi kết thúc niên khóa bãi biện, người đảm nhiệm sẽ bàn giao sổ sách thu chi cho người kế nhiệm trước sự chứng kiến của trưởng tộc.";
  } elseif (strpos($qLower, 'chi trưởng') !== false || strpos($qLower, 'đích tôn') !== false) {
    $answer = "Trong phong tục Việt Nam, 'Bé bằng củ khoai, cứ vai mà gọi'. Con cháu thuộc Chi trưởng (người anh cả trong nhánh) luôn giữ vai vế anh/bác đối với các con cháu thuộc Chi thứ, dù tuổi đời có thể nhỏ hơn. Đây là nét đẹp tôn trọng trật tự cội nguồn tổ tông.";
  } elseif (strpos($qLower, 'lăng mộ') !== false || strpos($qLower, 'thanh minh') !== false) {
    $answer = "Lễ tảo mộ thường diễn ra vào dịp Tết Thanh Minh hoặc tháng Chạp cuối năm. Khi viếng mộ tổ tiên, con cháu thắp hương theo thứ tự từ mộ Cụ khởi tổ đến các mộ tiền nhân đời sau, dọn cỏ sạch sẽ và cắm hoa tươi thể hiện đạo lý 'Uống nước nhớ nguồn'.";
  } else {
    $answer = "Theo gia lễ cổ truyền: Xưng hô dòng tộc lấy 'Thế thứ - Tông phái' làm trọng. Gặp bậc trên (hơn đời) chào bằng 'Bác/Chú/Ông', xưng 'Cháu'. Gặp người cùng đời thuộc chi trên chào bằng 'Anh/Chị họ'. Giữ thái độ khiêm cung, hòa ái để thắt chặt tình đoàn kết anh em họ hàng muôn đời.";
  }

  json_response([
    'question' => $question,
    'answer' => $answer
  ]);
}

json_error('Action not allowed', 405);
