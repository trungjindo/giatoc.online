<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

function send_cors_headers(): void {
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  $allowed = false;

  if ($origin !== '') {
    $parsed = parse_url($origin);
    $host = strtolower($parsed['host'] ?? '');

    if ($host === 'localhost' || $host === '127.0.0.1' || $host === 'giatoc.online' || str_ends_with($host, '.giatoc.online') || in_array($origin, ALLOWED_ORIGINS, true)) {
      $allowed = true;
    } else {
      // Cho phép nếu là custom domain đã đăng ký trong bảng tenants
      try {
        $pdo = get_db();
        $stmt = $pdo->prepare('SELECT id FROM tenants WHERE custom_domain = ?');
        $stmt->execute([$host]);
        if ($stmt->fetch()) {
          $allowed = true;
        }
      } catch (Exception $e) {}
    }
  }

  if ($allowed && $origin !== '') {
    header('Access-Control-Allow-Origin: ' . $origin);
  }
  header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Viewer-Token, X-Tenant-Slug, X-Tenant-Id');
  header('Vary: Origin');

  if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
  }
}

function json_response($data, int $status = 200): void {
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}

function json_error(string $message, int $status = 400): void {
  json_response(['error' => $message], $status);
}

function read_json_body(): array {
  $raw = file_get_contents('php://input');
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}

function get_authorization_header(): string {
  if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
    return $_SERVER['HTTP_AUTHORIZATION'];
  }
  if (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    return $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
  }
  if (function_exists('getallheaders')) {
    $headers = getallheaders();
    foreach ($headers as $name => $value) {
      if (strcasecmp($name, 'Authorization') === 0) {
        return $value;
      }
    }
  }
  return '';
}

// ---------------------------------------------------------------------------
// Phân giải Tenant (Multi-Tenancy Resolution)
// ---------------------------------------------------------------------------

function get_current_tenant(?PDO $pdo = null): array {
  static $cachedTenant = null;
  if ($cachedTenant !== null) {
    return $cachedTenant;
  }
  if ($pdo === null) {
    $pdo = get_db();
  }

  // 1. Kiểm tra Explicit Headers hoặc Query Params (dành cho API / Dev / Proxy)
  $headerSlug = $_SERVER['HTTP_X_TENANT_SLUG'] ?? '';
  $headerId = isset($_SERVER['HTTP_X_TENANT_ID']) ? (int)$_SERVER['HTTP_X_TENANT_ID'] : 0;
  $querySlug = $_GET['tenant'] ?? '';

  if ($headerId > 0) {
    try {
      $stmt = $pdo->prepare('SELECT * FROM tenants WHERE id = ?');
      $stmt->execute([$headerId]);
      $row = $stmt->fetch();
      if ($row) {
        $cachedTenant = $row;
        return $cachedTenant;
      }
    } catch (PDOException $e) {}
  }

  $slugToFind = $headerSlug ?: $querySlug;
  if ($slugToFind !== '') {
    try {
      $stmt = $pdo->prepare('SELECT * FROM tenants WHERE slug = ?');
      $stmt->execute([$slugToFind]);
      $row = $stmt->fetch();
      if ($row) {
        $cachedTenant = $row;
        return $cachedTenant;
      }
    } catch (PDOException $e) {}
  }

  // 2. Phân tích HTTP_HOST từ Domain/Subdomain
  $host = strtolower(trim($_SERVER['HTTP_HOST'] ?? ''));
  $hostNoPort = preg_replace('/:\d+$/', '', $host);

  if ($hostNoPort !== '' && !in_array($hostNoPort, ['localhost', '127.0.0.1', 'giatoc.online', 'www.giatoc.online'], true)) {
    // Subdomain dạng [slug].giatoc.online
    if (preg_match('/^([a-z0-9\-]+)\.giatoc\.online$/i', $hostNoPort, $m)) {
      $subdomain = $m[1];
      if ($subdomain !== 'www') {
        try {
          $stmt = $pdo->prepare('SELECT * FROM tenants WHERE slug = ?');
          $stmt->execute([$subdomain]);
          $row = $stmt->fetch();
          if ($row) {
            $cachedTenant = $row;
            return $cachedTenant;
          }
        } catch (PDOException $e) {}
      }
    } else {
      // Tên miền riêng (Custom Domain, ví dụ hotrandinh.com)
      try {
        $stmt = $pdo->prepare('SELECT * FROM tenants WHERE custom_domain = ? OR custom_domain = ?');
        $stmt->execute([$hostNoPort, 'www.' . $hostNoPort]);
        $row = $stmt->fetch();
        if ($row) {
          $cachedTenant = $row;
          return $cachedTenant;
        }
      } catch (PDOException $e) {}
    }
  }

  // 3. Fallback mặc định: tenant ID = 1 (Trần Đình)
  try {
    $stmt = $pdo->query('SELECT * FROM tenants WHERE id = 1');
    $row = $stmt->fetch();
    if ($row) {
      $cachedTenant = $row;
      return $cachedTenant;
    }
  } catch (PDOException $e) {}

  $cachedTenant = [
    'id' => 1,
    'slug' => 'hotrandinh',
    'custom_domain' => 'hotrandinh.com',
    'name' => 'Dòng Họ Trần Đình',
    'plan' => 'premium',
    'member_limit' => 5000,
    'storage_limit_mb' => 30720,
    'admin_limit' => 15,
    'status' => 'active',
    'zns_balance' => 0,
    'logo' => null,
  ];
  return $cachedTenant;
}

function get_current_tenant_id(?PDO $pdo = null): int {
  $t = get_current_tenant($pdo);
  return (int)($t['id'] ?? 1);
}

// ---------------------------------------------------------------------------
// Quản lý Phiên Người dùng (Authentication)
// ---------------------------------------------------------------------------

function get_authenticated_user(?PDO $pdo = null): ?array {
  $header = get_authorization_header();
  if (!preg_match('/Bearer\s+(\S+)/i', $header, $m)) {
    return null;
  }
  $token = $m[1];

  if ($pdo === null) $pdo = get_db();
  $tenantId = get_current_tenant_id($pdo);

  try {
    $stmt = $pdo->prepare(
      'SELECT u.id, u.tenant_id, u.username, u.full_name, u.role, u.chi_id, u.year_assigned
       FROM user_sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.tenant_id = ? AND s.expires_at > NOW()'
    );
    $stmt->execute([$token, $tenantId]);
    $row = $stmt->fetch();
    return $row ?: null;
  } catch (PDOException $e) {
    try {
      $stmt = $pdo->prepare(
        'SELECT u.id, u.username, u.full_name, u.role, u.chi_id, u.year_assigned
         FROM user_sessions s
         JOIN users u ON u.id = s.user_id
         WHERE s.token = ? AND s.expires_at > NOW()'
      );
      $stmt->execute([$token]);
      $row = $stmt->fetch();
      return $row ?: null;
    } catch (PDOException $e2) {
      return null;
    }
  }
}

function require_auth(): array {
  $user = get_authenticated_user();
  if ($user === null) {
    json_error('Chưa đăng nhập hoặc phiên đã hết hạn.', 401);
  }
  return $user;
}

// ---------------------------------------------------------------------------
// Xác thực Con cháu (Viewer Sessions)
// ---------------------------------------------------------------------------

function get_client_ip(): string {
  return substr((string)($_SERVER['REMOTE_ADDR'] ?? 'unknown'), 0, 45);
}

function normalize_vn_name(string $name): string {
  $name = trim($name);
  if ($name === '') return '';
  if (class_exists('Transliterator')) {
    $tr = Transliterator::create('Any-Latin; Latin-ASCII; Lower');
    if ($tr) $name = $tr->transliterate($name);
  } else {
    $map = [
      'a' => 'áàảãạăắằẳẵặâấầẩẫậ', 'e' => 'éèẻẽẹêếềểễệ', 'i' => 'íìỉĩị',
      'o' => 'óòỏõọôốồổỗộơớờởỡợ', 'u' => 'úùủũụưứừửữự', 'y' => 'ýỳỷỹỵ', 'd' => 'đ',
    ];
    $name = mb_strtolower($name, 'UTF-8');
    foreach ($map as $plain => $accented) {
      $chars = preg_split('//u', $accented, -1, PREG_SPLIT_NO_EMPTY);
      $name = str_replace($chars, $plain, $name);
    }
  }
  $name = mb_strtolower($name, 'UTF-8');
  $name = preg_replace('/[^a-z0-9\s]/u', ' ', $name);
  return trim(preg_replace('/\s+/u', ' ', $name));
}

function get_setting(string $key, string $default = '', ?PDO $pdo = null): string {
  if ($pdo === null) $pdo = get_db();
  $tenantId = get_current_tenant_id($pdo);
  try {
    $stmt = $pdo->prepare('SELECT setting_value FROM site_settings WHERE tenant_id = ? AND setting_key = ?');
    $stmt->execute([$tenantId, $key]);
    $row = $stmt->fetch();
    return $row ? (string)$row['setting_value'] : $default;
  } catch (PDOException $e) {
    try {
      $stmt = $pdo->prepare('SELECT setting_value FROM site_settings WHERE setting_key = ?');
      $stmt->execute([$key]);
      $row = $stmt->fetch();
      return $row ? (string)$row['setting_value'] : $default;
    } catch (PDOException $e2) {
      return $default;
    }
  }
}

function log_auth_attempt(string $kind, ?string $identifier, bool $success, ?PDO $pdo = null): void {
  try {
    if ($pdo === null) $pdo = get_db();
    $tenantId = get_current_tenant_id($pdo);
    $stmt = $pdo->prepare(
      'INSERT INTO auth_attempt_log (tenant_id, kind, ip, identifier, success) VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->execute([$tenantId, $kind, get_client_ip(), $identifier !== null ? mb_substr($identifier, 0, 150) : null, $success ? 1 : 0]);
  } catch (PDOException $e) {
    try {
      $stmt = $pdo->prepare(
        'INSERT INTO auth_attempt_log (kind, ip, identifier, success) VALUES (?, ?, ?, ?)'
      );
      $stmt->execute([$kind, get_client_ip(), $identifier !== null ? mb_substr($identifier, 0, 150) : null, $success ? 1 : 0]);
    } catch (PDOException $e2) {}
  }
}

function count_recent_auth_failures(string $kind, ?string $identifier, int $minutes, ?PDO $pdo = null): int {
  if ($pdo === null) $pdo = get_db();
  $tenantId = get_current_tenant_id($pdo);
  $minutes = max(1, (int)$minutes);
  try {
    if ($identifier === null) {
      $stmt = $pdo->prepare(
        "SELECT COUNT(*) AS c FROM auth_attempt_log
         WHERE tenant_id = ? AND kind = ? AND ip = ? AND success = 0 AND attempted_at > (NOW() - INTERVAL $minutes MINUTE)"
      );
      $stmt->execute([$tenantId, $kind, get_client_ip()]);
    } else {
      $stmt = $pdo->prepare(
        "SELECT COUNT(*) AS c FROM auth_attempt_log
         WHERE tenant_id = ? AND kind = ? AND identifier = ? AND success = 0 AND attempted_at > (NOW() - INTERVAL $minutes MINUTE)"
      );
      $stmt->execute([$tenantId, $kind, mb_substr($identifier, 0, 150)]);
    }
    return (int)$stmt->fetch()['c'];
  } catch (PDOException $e) {
    try {
      if ($identifier === null) {
        $stmt = $pdo->prepare(
          "SELECT COUNT(*) AS c FROM auth_attempt_log
           WHERE kind = ? AND ip = ? AND success = 0 AND attempted_at > (NOW() - INTERVAL $minutes MINUTE)"
        );
        $stmt->execute([$kind, get_client_ip()]);
      } else {
        $stmt = $pdo->prepare(
          "SELECT COUNT(*) AS c FROM auth_attempt_log
           WHERE kind = ? AND identifier = ? AND success = 0 AND attempted_at > (NOW() - INTERVAL $minutes MINUTE)"
        );
        $stmt->execute([$kind, mb_substr($identifier, 0, 150)]);
      }
      return (int)$stmt->fetch()['c'];
    } catch (PDOException $e2) {
      return 0;
    }
  }
}

function get_viewer_session(?PDO $pdo = null): ?array {
  $token = '';
  if (!empty($_SERVER['HTTP_X_VIEWER_TOKEN'])) {
    $token = $_SERVER['HTTP_X_VIEWER_TOKEN'];
  } elseif (function_exists('getallheaders')) {
    foreach (getallheaders() as $name => $value) {
      if (strcasecmp($name, 'X-Viewer-Token') === 0) { $token = $value; break; }
    }
  }
  if ($token === '') return null;

  if ($pdo === null) $pdo = get_db();
  $tenantId = get_current_tenant_id($pdo);

  try {
    $stmt = $pdo->prepare(
      'SELECT member_id, member_name FROM viewer_sessions WHERE token = ? AND tenant_id = ? AND expires_at > NOW()'
    );
    $stmt->execute([$token, $tenantId]);
    $row = $stmt->fetch();
    return $row ?: null;
  } catch (PDOException $e) {
    try {
      $stmt = $pdo->prepare('SELECT member_id, member_name FROM viewer_sessions WHERE token = ? AND expires_at > NOW()');
      $stmt->execute([$token]);
      $row = $stmt->fetch();
      return $row ?: null;
    } catch (PDOException $e2) {
      return null;
    }
  }
}

function require_family_access(): array {
  $user = get_authenticated_user();
  if ($user !== null) {
    return ['kind' => 'user', 'user' => $user];
  }
  $viewer = get_viewer_session();
  if ($viewer !== null) {
    return ['kind' => 'viewer', 'viewer' => $viewer];
  }
  json_error('Nội dung này chỉ dành cho con cháu trong dòng họ. Vui lòng xác thực để xem.', 401);
}

function require_role(array $allowedRoles): array {
  $user = require_auth();
  if (!in_array($user['role'], $allowedRoles, true)) {
    json_error('Bạn không có quyền thực hiện thao tác này.', 403);
  }
  return $user;
}

function require_chi_access(array $user, ?int $chiId): void {
  if ($user['role'] === 'admin') {
    return;
  }
  if ($chiId === null || (int)$user['chi_id'] !== (int)$chiId) {
    json_error('Bạn không có quyền truy cập dữ liệu của chi này.', 403);
  }
}

function require_chi_year_access(array $user, ?int $chiId, int $year): void {
  require_chi_access($user, $chiId);

  if ($user['role'] !== 'bai_bien') {
    return;
  }

  $pdo = get_db();
  $tenantId = get_current_tenant_id($pdo);
  try {
    $stmt = $pdo->prepare(
      "SELECT id FROM bai_bien_assignments
       WHERE tenant_id = ? AND user_id = ? AND chi_id <=> ? AND year = ? AND status = 'active'"
    );
    $stmt->execute([$tenantId, $user['id'], $chiId, $year]);
    if (!$stmt->fetch()) {
      json_error('Bạn chỉ được ghi dữ liệu của năm mình đang được phân công phụ trách (bãi biện).', 403);
    }
  } catch (PDOException $e) {
    $stmt = $pdo->prepare(
      "SELECT id FROM bai_bien_assignments
       WHERE user_id = ? AND chi_id <=> ? AND year = ? AND status = 'active'"
    );
    $stmt->execute([$user['id'], $chiId, $year]);
    if (!$stmt->fetch()) {
      json_error('Bạn chỉ được ghi dữ liệu của năm mình đang được phân công phụ trách (bãi biện).', 403);
    }
  }
}

function find_family_node($node, string $id) {
  if (!is_array($node)) return null;
  if (($node['id'] ?? null) === $id) return $node;
  foreach ($node['children'] ?? [] as $child) {
    $found = find_family_node($child, $id);
    if ($found !== null) return $found;
  }
  return null;
}

function get_family_tree(PDO $pdo) {
  $tenantId = get_current_tenant_id($pdo);
  try {
    $stmt = $pdo->prepare('SELECT data_json FROM app_data WHERE tenant_id = ? AND data_key = ?');
    $stmt->execute([$tenantId, 'familyData']);
    $row = $stmt->fetch();
    return $row ? json_decode($row['data_json'], true) : null;
  } catch (PDOException $e) {
    $stmt = $pdo->prepare('SELECT data_json FROM app_data WHERE data_key = ?');
    $stmt->execute(['familyData']);
    $row = $stmt->fetch();
    return $row ? json_decode($row['data_json'], true) : null;
  }
}

function mask_phone(string $phone): string {
  $phone = trim($phone);
  $len = mb_strlen($phone);
  if ($len === 0) return $phone;

  $isIntl = str_starts_with($phone, '+');
  $prefixLen = $isIntl ? 3 : 2;
  $suffixLen = $isIntl ? 2 : 3;

  if ($len <= $prefixLen + $suffixLen) return $phone;

  $prefix = mb_substr($phone, 0, $prefixLen);
  $suffix = mb_substr($phone, -$suffixLen);
  $maskLen = $len - $prefixLen - $suffixLen;
  return $prefix . str_repeat('•', $maskLen) . $suffix;
}

function mask_family_contacts(array &$node): void {
  if (!empty($node['phone']) && is_string($node['phone'])) {
    $node['phone'] = mask_phone($node['phone']);
  }
  if (!empty($node['zalo']) && is_string($node['zalo'])) {
    $node['zalo'] = mask_phone($node['zalo']);
  }
  if (!empty($node['children']) && is_array($node['children'])) {
    foreach ($node['children'] as &$child) {
      if (is_array($child)) mask_family_contacts($child);
    }
    unset($child);
  }
}
