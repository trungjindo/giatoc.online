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
