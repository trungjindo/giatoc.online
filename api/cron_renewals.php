<?php
require_once __DIR__ . '/helpers.php';

$isCli = (php_sapi_name() === 'cli');
if (!$isCli) {
  send_cors_headers();
}

$pdo = get_db();
$now = new DateTime();

// 1. Quét các tenant đã quá hạn và chuyển status sang 'expired'
try {
  $stmt = $pdo->query("UPDATE tenants SET status = 'expired' WHERE expires_at < NOW() AND status = 'active'");
  $expiredCount = $stmt->rowCount();
} catch (PDOException $e) {
  $expiredCount = 0;
}

// 2. Thống kê các tenant sắp hết hạn trong 30, 15, 7 ngày
$warnings = [];
try {
  $stmt = $pdo->query(
    "SELECT id, slug, name, plan, expires_at, DATEDIFF(expires_at, NOW()) AS days_left
     FROM tenants
     WHERE status != 'suspended' AND expires_at IS NOT NULL AND DATEDIFF(expires_at, NOW()) <= 30
     ORDER BY days_left ASC"
  );
  $warnings = $stmt->fetchAll();
} catch (PDOException $e) {}

$result = [
  'success' => true,
  'timestamp' => $now->format('Y-m-d H:i:s'),
  'expiredUpdated' => $expiredCount,
  'expiringSoonCount' => count($warnings),
  'expiringSoonList' => $warnings
];

if ($isCli) {
  echo "[" . $result['timestamp'] . "] CRON RENEWALS RUNNER - giatoc.online\n";
  echo "- Dòng họ hết hạn vừa cập nhật: " . $expiredCount . "\n";
  echo "- Dòng họ sắp hết hạn trong 30 ngày: " . count($warnings) . "\n";
  foreach ($warnings as $w) {
    echo "  * ID " . $w['id'] . " (" . $w['name'] . " - " . $w['slug'] . ".giatoc.online): Còn " . $w['days_left'] . " ngày (Hết hạn: " . $w['expires_at'] . ")\n";
  }
  echo "CRON COMPLETED SUCCESSFULLY.\n";
  exit(0);
} else {
  json_response($result);
}
