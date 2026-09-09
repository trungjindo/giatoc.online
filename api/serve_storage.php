<?php
require_once __DIR__ . '/config.php';

$path = $_GET['path'] ?? '';
$path = str_replace('\\', '/', $path);

if ($path === '' || strpos($path, '..') !== false || $path[0] === '/') {
  http_response_code(400);
  exit;
}

$realStorage = realpath(STORAGE_DIR);
$realFile = realpath(STORAGE_DIR . '/' . $path);

if ($realStorage === false || $realFile === false || strpos($realFile, $realStorage) !== 0 || !is_file($realFile)) {
  http_response_code(404);
  exit;
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $realFile);
finfo_close($finfo);

$allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/x-icon'];
if (!in_array($mime, $allowedMimes, true)) {
  http_response_code(403);
  exit;
}

header('Content-Type: ' . $mime);
header('Content-Length: ' . filesize($realFile));
header('Cache-Control: public, max-age=31536000, immutable');
header('X-Content-Type-Options: nosniff');
header("Content-Security-Policy: default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'");
header('X-Frame-Options: SAMEORIGIN');
readfile($realFile);
