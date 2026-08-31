-- Schema cơ sở dữ liệu cho nền tảng giatoc.online (Multi-Tenant SaaS)
-- Chạy file này trên phpMyAdmin khi thiết lập database mới trên Hostinger / Localhost.

-- 1. Bảng quản lý các dòng họ / chi họ (Tenants)
CREATE TABLE IF NOT EXISTS tenants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(50) UNIQUE NOT NULL,
  custom_domain VARCHAR(100) UNIQUE NULL,
  name VARCHAR(200) NOT NULL,
  plan ENUM('basic', 'standard', 'premium', 'unlimited') NOT NULL DEFAULT 'standard',
  member_limit INT NOT NULL DEFAULT 1500,
  storage_limit_mb INT NOT NULL DEFAULT 10240,
  admin_limit INT NOT NULL DEFAULT 5,
  expires_at TIMESTAMP NULL,
  status ENUM('active', 'expired', 'suspended') NOT NULL DEFAULT 'active',
  zns_balance DECIMAL(15,0) NOT NULL DEFAULT 0,
  logo VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_custom_domain (custom_domain),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Khởi tạo tenant mặc định (Trần Đình) và Demo
INSERT IGNORE INTO tenants (id, slug, custom_domain, name, plan, member_limit, storage_limit_mb, admin_limit, expires_at, status) VALUES
  (1, 'hotrandinh', 'hotrandinh.com', 'Dòng Họ Trần Đình', 'premium', 5000, 30720, 15, DATE_ADD(NOW(), INTERVAL 5 YEAR), 'active'),
  (2, 'demo', 'demo.giatoc.online', 'Dòng Họ Mẫu Demo', 'standard', 1500, 10240, 5, DATE_ADD(NOW(), INTERVAL 10 YEAR), 'active');

-- 2. Bảng lưu trữ JSON dữ liệu giao diện theo từng dòng họ
CREATE TABLE IF NOT EXISTS app_data (
  tenant_id INT NOT NULL DEFAULT 1,
  data_key VARCHAR(50) NOT NULL,
  data_json LONGTEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (tenant_id, data_key),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bảng các Chi trong dòng họ
CREATE TABLE IF NOT EXISTS chi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL DEFAULT 1,
  name VARCHAR(100) NOT NULL,
  root_member_id VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  INDEX idx_chi_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tài khoản người dùng (phân quyền theo tenant và chi)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL DEFAULT 1,
  username VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL DEFAULT '',
  role ENUM('admin', 'chi_admin', 'dich_ton', 'bai_bien') NOT NULL DEFAULT 'chi_admin',
  chi_id INT NULL,
  year_assigned INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (chi_id) REFERENCES chi(id) ON DELETE SET NULL,
  UNIQUE KEY uq_tenant_username (tenant_id, username),
  INDEX idx_users_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Phiên đăng nhập dạng Token
CREATE TABLE IF NOT EXISTS user_sessions (
  token CHAR(64) PRIMARY KEY,
  tenant_id INT NOT NULL DEFAULT 1,
  user_id INT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sessions_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Phân công Bãi Biện theo năm
CREATE TABLE IF NOT EXISTS bai_bien_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL DEFAULT 1,
  chi_id INT NULL,
  year INT NOT NULL,
  user_id INT NOT NULL,
  status ENUM('active', 'handed_over') NOT NULL DEFAULT 'active',
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  handed_over_at TIMESTAMP NULL,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (chi_id) REFERENCES chi(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_baibien_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Hoạt động theo năm
CREATE TABLE IF NOT EXISTS activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL DEFAULT 1,
  chi_id INT NULL,
  year INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  created_by INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (chi_id) REFERENCES chi(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_activities_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Nhật ký xem số điện thoại (Rate Limit & Audit)
CREATE TABLE IF NOT EXISTS phone_reveal_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL DEFAULT 1,
  ip VARCHAR(45) NOT NULL,
  member_id VARCHAR(50) NOT NULL,
  revealed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  INDEX idx_ip_time (tenant_id, ip, revealed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Vị trí Lăng Mộ tổ tiên trên bản đồ GPS
CREATE TABLE IF NOT EXISTS tombs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL DEFAULT 1,
  member_id VARCHAR(50) NOT NULL,
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  photo VARCHAR(255) NULL,
  description TEXT NULL,
  interred_date DATE NULL,
  created_by INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY uq_tenant_member_tomb (tenant_id, member_id),
  INDEX idx_tombs_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Tài sản dòng họ (Đất đai, nhà thờ, đồ thờ, vật dụng)
CREATE TABLE IF NOT EXISTS assets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL DEFAULT 1,
  chi_id INT NULL,
  name VARCHAR(200) NOT NULL,
  category ENUM('dat_dai', 'nha_cua', 'do_tho', 'le_nghi', 'vat_dung', 'gia_tri', 'khac') NOT NULL DEFAULT 'vat_dung',
  description TEXT NULL,
  status ENUM('dang_dung', 'hu_hong', 'can_sua', 'luu_kho') NOT NULL DEFAULT 'dang_dung',
  address VARCHAR(255) NULL,
  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,
  custodian VARCHAR(150) NULL,
  acquired_date DATE NULL,
  finance_tx_id VARCHAR(50) NULL,
  estimated_value DECIMAL(15,0) NULL,
  useful_life_years INT NULL,
  expected_replace_year INT NULL,
  expected_replace_cost DECIMAL(15,0) NULL,
  images JSON NULL,
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (chi_id) REFERENCES chi(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_assets_tenant (tenant_id),
  INDEX idx_chi (chi_id),
  INDEX idx_category (category),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Lịch sử biến động tài sản
CREATE TABLE IF NOT EXISTS asset_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL DEFAULT 1,
  asset_id INT NULL,
  asset_name VARCHAR(200) NOT NULL,
  user_id INT NULL,
  user_name VARCHAR(100) NULL,
  action ENUM('created', 'updated', 'deleted') NOT NULL,
  summary TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_assethist_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Banner quảng cáo doanh nghiệp thành viên
CREATE TABLE IF NOT EXISTS promo_banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL DEFAULT 1,
  business_name VARCHAR(150) NOT NULL,
  description VARCHAR(300) NULL,
  image VARCHAR(500) NOT NULL,
  link_url VARCHAR(500) NULL,
  contact_name VARCHAR(150) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_by INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_promobanners_tenant (tenant_id),
  INDEX idx_active_order (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Phiên xác thực con cháu (Viewer sessions)
CREATE TABLE IF NOT EXISTS viewer_sessions (
  token CHAR(64) PRIMARY KEY,
  tenant_id INT NOT NULL DEFAULT 1,
  member_id VARCHAR(50) NOT NULL,
  member_name VARCHAR(150) NOT NULL,
  ip VARCHAR(45) NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  INDEX idx_viewersess_tenant (tenant_id),
  INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Nhật ký xác thực & chống dò mật khẩu
CREATE TABLE IF NOT EXISTS auth_attempt_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL DEFAULT 1,
  kind ENUM('login', 'verify') NOT NULL,
  ip VARCHAR(45) NOT NULL,
  identifier VARCHAR(150) NULL,
  success TINYINT(1) NOT NULL DEFAULT 0,
  attempted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  INDEX idx_auth_ip_time (tenant_id, kind, ip, attempted_at),
  INDEX idx_auth_ident_time (tenant_id, kind, identifier, attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Cấu hình ngày tế họ & thiết lập dòng họ
CREATE TABLE IF NOT EXISTS site_settings (
  tenant_id INT NOT NULL DEFAULT 1,
  setting_key VARCHAR(50) NOT NULL,
  setting_value VARCHAR(255) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (tenant_id, setting_key),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dữ liệu khởi tạo cho tenant 1 (Trần Đình)
INSERT IGNORE INTO app_data (tenant_id, data_key, data_json) VALUES
  (1, 'familyData', 'null'),
  (1, 'financeData', 'null'),
  (1, 'newsData', 'null'),
  (1, 'aboutData', 'null'),
  (1, 'bannerData', 'null'),
  (1, 'galleryData', 'null'),
  (1, 'contactAdminData', 'null');

INSERT IGNORE INTO users (tenant_id, username, password_hash, full_name, role, chi_id) VALUES
  (1, 'admin', '/XYVHeWZVvoU0UdsocxbG1uy', 'Quản trị dòng họ', 'admin', NULL);

INSERT IGNORE INTO site_settings (tenant_id, setting_key, setting_value) VALUES
  (1, 'te_ho_day', '0'),
  (1, 'te_ho_month', '0');


-- 16. Bảng Quản lý Đơn hàng & Cấu hình Nền tảng
-- ===========================================================================
-- BẢNG QUẢN LÝ ĐƠN HÀNG & CẤU HÌNH NỀN TẢNG (giatoc.online)
-- ===========================================================================

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_code VARCHAR(30) UNIQUE NOT NULL,
  plan ENUM('basic', 'standard', 'premium', 'unlimited') NOT NULL DEFAULT 'standard',
  domain_type ENUM('subdomain', 'custom_domain') NOT NULL DEFAULT 'subdomain',
  slug VARCHAR(50) NOT NULL,
  custom_domain VARCHAR(100) NULL,
  clan_name VARCHAR(200) NOT NULL,
  admin_name VARCHAR(150) NOT NULL,
  admin_phone VARCHAR(50) NOT NULL,
  admin_email VARCHAR(150) NOT NULL,
  admin_username VARCHAR(50) NOT NULL,
  admin_password_hash VARCHAR(255) NOT NULL,
  billing_cycle_years INT NOT NULL DEFAULT 1,
  amount DECIMAL(15,0) NOT NULL,
  payment_status ENUM('pending', 'paid', 'cancelled') NOT NULL DEFAULT 'pending',
  tenant_id INT NULL,
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP NULL,
  confirmed_by INT NULL,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL,
  INDEX idx_order_code (order_code),
  INDEX idx_payment_status (payment_status),
  INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS platform_settings (
  setting_key VARCHAR(50) PRIMARY KEY,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO platform_settings (setting_key, setting_value) VALUES
  ('bank_code', 'MB'),
  ('bank_name', 'Ngân Hàng Quân Đội (MBBank)'),
  ('account_number', '99997379999'),
  ('account_name', 'TRẦN ĐÌNH TRUNG'),
  ('hotline', '0912345678'),
  ('zalo_support', '0912345678'),
  ('email_support', 'hotro@giatoc.online');


-- 17. Bảng Ví Gửi Tin Nhắn Thông Báo & Chiến Dịch Zalo ZNS
-- ===========================================================================
-- BẢNG QUẢN LÝ VÍ GỬI TIN NHẮN THÔNG BÁO & CHIẾN DỊCH ZNS (giatoc.online)
-- ===========================================================================

-- 1. Bảng lịch sử giao dịch Ví gửi tin nhắn thông báo (Nạp tiền, trừ cước, hoàn tiền)
CREATE TABLE IF NOT EXISTS zns_wallet_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL,
  tx_code VARCHAR(30) UNIQUE NOT NULL,
  type ENUM('topup', 'usage', 'refund', 'bonus') NOT NULL DEFAULT 'topup',
  amount DECIMAL(15,0) NOT NULL,
  balance_after DECIMAL(15,0) NOT NULL,
  description VARCHAR(255) NOT NULL,
  status ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  created_by INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP NULL,
  confirmed_by INT NULL,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_tenant_tx (tenant_id, created_at),
  INDEX idx_tx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bảng quản lý chiến dịch gửi tin nhắn thông báo dòng họ
CREATE TABLE IF NOT EXISTS zns_campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL,
  campaign_code VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  template_key VARCHAR(50) NOT NULL,
  template_params JSON NOT NULL,
  target_filter JSON NOT NULL,
  total_recipients INT NOT NULL DEFAULT 0,
  total_cost DECIMAL(15,0) NOT NULL DEFAULT 0,
  status ENUM('draft', 'scheduled', 'sending', 'completed', 'failed') NOT NULL DEFAULT 'draft',
  scheduled_at TIMESTAMP NULL,
  created_by INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_tenant_campaign (tenant_id, created_at),
  INDEX idx_campaign_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bảng nhật ký gửi tin nhắn từng thành viên
CREATE TABLE IF NOT EXISTS zns_campaign_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campaign_id INT NOT NULL,
  tenant_id INT NOT NULL,
  recipient_id VARCHAR(50) NULL,
  recipient_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  status ENUM('sent', 'delivered', 'failed', 'refunded') NOT NULL DEFAULT 'sent',
  cost DECIMAL(10,0) NOT NULL DEFAULT 400,
  error_message VARCHAR(255) NULL,
  sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES zns_campaigns(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  INDEX idx_campaign_log (campaign_id),
  INDEX idx_tenant_phone (tenant_id, phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
