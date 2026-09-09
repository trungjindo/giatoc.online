<?php
// Cấu hình Database & Môi trường cho nền tảng Đa Dòng Họ (giatoc.online).
// Hỗ trợ nạp cấu hình bảo mật từ tệp secrets ngoài public_html hoặc biến môi trường.

$secretsFile = dirname(__DIR__, 2) . '/giatoc_db_secrets.php';
if (is_file($secretsFile)) {
  require $secretsFile;
}

// Fallback nạp từ biến môi trường hoặc giá trị mặc định
function env_value(string $key, string $default): string {
  $v = getenv($key);
  return ($v === false || $v === '') ? $default : $v;
}

if (!defined('DB_HOST')) define('DB_HOST', env_value('DB_HOST', 'localhost'));
if (!defined('DB_NAME')) define('DB_NAME', env_value('DB_NAME', 'hotrandinh_local'));
if (!defined('DB_USER')) define('DB_USER', env_value('DB_USER', 'root'));
if (!defined('DB_PASS')) define('DB_PASS', env_value('DB_PASS', ''));

define('ALLOWED_ORIGINS', [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://giatoc.online',
  'https://www.giatoc.online',
  'https://hotrandinh.com',
  'https://www.hotrandinh.com',
]);

if (!defined('STORAGE_DIR')) define('STORAGE_DIR', __DIR__ . '/storage');
