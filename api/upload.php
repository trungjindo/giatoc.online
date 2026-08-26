<?php
require_once __DIR__ . '/helpers.php';
send_cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  json_error('Method not allowed', 405);
}

require_auth(); // Chỉ người dùng đã đăng nhập mới được tải file lên

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const TYPE_FOLDERS = [
  'avatar'  => 'hinh_dai_dien',
  'news'    => 'tin_tuc',
  'receipt' => 'chung_tu',
  'banner'  => 'banner',
  'gallery' => 'thu_vien',
  'about'   => 'gioi_thieu',
  'tomb'    => 'mo_phan',
  'asset'   => 'tai_san',
  'promo'   => 'quang_cao',
];

if (empty($_FILES['image'])) {
  json_error('Không có file nào được tải lên.', 400);
}

$file = $_FILES['image'];

if ($file['error'] !== UPLOAD_ERR_OK) {
  if ($file['error'] === UPLOAD_ERR_INI_SIZE || $file['error'] === UPLOAD_ERR_FORM_SIZE) {
    json_error('File vượt quá dung lượng tối đa 10MB!', 413);
  }
  json_error('Có lỗi xảy ra khi tải file lên.', 400);
}

if ($file['size'] > MAX_UPLOAD_BYTES) {
  json_error('File vượt quá dung lượng tối đa 10MB!', 413);
}

// 1. Kiểm tra Extension nghiêm ngặt
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($ext, ALLOWED_EXTENSIONS, true)) {
  json_error('Định dạng tệp không được hỗ trợ. Chỉ chấp nhận JPG, PNG, WEBP, GIF!', 400);
}

// 2. Kiểm tra MIME type thực tế
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mimeType, ALLOWED_MIMES, true)) {
  json_error('Chỉ cho phép tải lên hình ảnh hợp lệ (JPG, PNG, WEBP, GIF)!', 400);
}

// 3. Kiểm tra tính toàn vẹn cấu trúc ảnh (Chặn file giả dạng ảnh)
$imgInfo = @getimagesize($file['tmp_name']);
if ($imgInfo === false) {
  json_error('Tệp tải lên bị lỗi hoặc không phải hình ảnh thực sự!', 400);
}

$tenantId = get_current_tenant_id();
$type = $_GET['type'] ?? '';
$folder = TYPE_FOLDERS[$type] ?? TYPE_FOLDERS['avatar'];
$targetDir = STORAGE_DIR . '/tenants/' . $tenantId . '/' . $folder;

if (!is_dir($targetDir)) {
  mkdir($targetDir, 0755, true);
}

$safeExt = preg_replace('/[^a-z0-9]/', '', $ext) ?: 'jpg';
$filename = time() . '-' . bin2hex(random_bytes(6)) . '.' . $safeExt;
$targetPath = $targetDir . '/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
  json_error('Không thể lưu file trên server.', 500);
}

$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];
$apiDir = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
$absoluteUrl = "$scheme://$host$apiDir/storage/tenants/$tenantId/$folder/$filename";

json_response([
  'success' => true,
  'url' => $absoluteUrl,
]);
