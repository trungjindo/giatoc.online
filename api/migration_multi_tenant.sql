-- ===========================================================================
-- BẢN NÂNG CẤP CƠ SỞ DỮ LIỆU ĐA DÒNG HỌ (MULTI-TENANT SAAS)
-- Dành cho hệ thống giatoc.online
-- Chạy file này trên phpMyAdmin của database hiện có để nâng cấp lên hỗ trợ nhiều dòng họ.
-- ===========================================================================

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

-- Tạo tenant mặc định số 1 cho Dòng họ Trần Đình
INSERT IGNORE INTO tenants (id, slug, custom_domain, name, plan, member_limit, storage_limit_mb, admin_limit, expires_at, status) VALUES
  (1, 'hotrandinh', 'hotrandinh.com', 'Dòng Họ Trần Đình', 'premium', 5000, 30720, 15, DATE_ADD(NOW(), INTERVAL 5 YEAR), 'active');

-- Tạo tenant mẫu số 2 cho chức năng Demo
INSERT IGNORE INTO tenants (id, slug, custom_domain, name, plan, member_limit, storage_limit_mb, admin_limit, expires_at, status) VALUES
  (2, 'demo', 'demo.giatoc.online', 'Dòng Họ Mẫu Demo', 'standard', 1500, 10240, 5, DATE_ADD(NOW(), INTERVAL 10 YEAR), 'active');

-- 2. Thêm cột tenant_id cho bảng app_data và sửa Primary Key thành (tenant_id, data_key)
-- Kiểm tra nếu chưa có cột tenant_id thì thêm
SET @exist_tenant_app_data = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'app_data' AND COLUMN_NAME = 'tenant_id');
SET @sql_app_data_add = IF(@exist_tenant_app_data = 0, 'ALTER TABLE app_data ADD COLUMN tenant_id INT NOT NULL DEFAULT 1 FIRST, DROP PRIMARY KEY, ADD PRIMARY KEY (tenant_id, data_key), ADD CONSTRAINT fk_app_data_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE', 'SELECT 1');
PREPARE stmt FROM @sql_app_data_add;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3. Thêm cột tenant_id vào các bảng còn lại (nếu chưa có)
-- Bảng chi
SET @exist_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'chi' AND COLUMN_NAME = 'tenant_id');
SET @sql_run = IF(@exist_col = 0, 'ALTER TABLE chi ADD COLUMN tenant_id INT NOT NULL DEFAULT 1 AFTER id, ADD CONSTRAINT fk_chi_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE, ADD INDEX idx_chi_tenant (tenant_id)', 'SELECT 1');
PREPARE stmt FROM @sql_run; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Bảng users
SET @exist_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'tenant_id');
SET @sql_run = IF(@exist_col = 0, 'ALTER TABLE users ADD COLUMN tenant_id INT NOT NULL DEFAULT 1 AFTER id, ADD CONSTRAINT fk_users_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE, DROP INDEX username, ADD UNIQUE KEY uq_tenant_username (tenant_id, username), ADD INDEX idx_users_tenant (tenant_id)', 'SELECT 1');
PREPARE stmt FROM @sql_run; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Bảng user_sessions
SET @exist_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user_sessions' AND COLUMN_NAME = 'tenant_id');
SET @sql_run = IF(@exist_col = 0, 'ALTER TABLE user_sessions ADD COLUMN tenant_id INT NOT NULL DEFAULT 1 AFTER token, ADD CONSTRAINT fk_sessions_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE, ADD INDEX idx_sessions_tenant (tenant_id)', 'SELECT 1');
PREPARE stmt FROM @sql_run; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Bảng bai_bien_assignments
SET @exist_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bai_bien_assignments' AND COLUMN_NAME = 'tenant_id');
SET @sql_run = IF(@exist_col = 0, 'ALTER TABLE bai_bien_assignments ADD COLUMN tenant_id INT NOT NULL DEFAULT 1 AFTER id, ADD CONSTRAINT fk_baibien_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE, ADD INDEX idx_baibien_tenant (tenant_id)', 'SELECT 1');
PREPARE stmt FROM @sql_run; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Bảng activities
SET @exist_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'activities' AND COLUMN_NAME = 'tenant_id');
SET @sql_run = IF(@exist_col = 0, 'ALTER TABLE activities ADD COLUMN tenant_id INT NOT NULL DEFAULT 1 AFTER id, ADD CONSTRAINT fk_activities_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE, ADD INDEX idx_activities_tenant (tenant_id)', 'SELECT 1');
PREPARE stmt FROM @sql_run; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Bảng phone_reveal_log
SET @exist_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'phone_reveal_log' AND COLUMN_NAME = 'tenant_id');
SET @sql_run = IF(@exist_col = 0, 'ALTER TABLE phone_reveal_log ADD COLUMN tenant_id INT NOT NULL DEFAULT 1 AFTER id, ADD CONSTRAINT fk_reveal_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE, ADD INDEX idx_reveal_tenant (tenant_id)', 'SELECT 1');
PREPARE stmt FROM @sql_run; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Bảng tombs
SET @exist_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tombs' AND COLUMN_NAME = 'tenant_id');
SET @sql_run = IF(@exist_col = 0, 'ALTER TABLE tombs ADD COLUMN tenant_id INT NOT NULL DEFAULT 1 AFTER id, ADD CONSTRAINT fk_tombs_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE, DROP INDEX member_id, ADD UNIQUE KEY uq_tenant_member_tomb (tenant_id, member_id), ADD INDEX idx_tombs_tenant (tenant_id)', 'SELECT 1');
PREPARE stmt FROM @sql_run; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Bảng assets
SET @exist_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'assets' AND COLUMN_NAME = 'tenant_id');
SET @sql_run = IF(@exist_col = 0, 'ALTER TABLE assets ADD COLUMN tenant_id INT NOT NULL DEFAULT 1 AFTER id, ADD CONSTRAINT fk_assets_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE, ADD INDEX idx_assets_tenant (tenant_id)', 'SELECT 1');
PREPARE stmt FROM @sql_run; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Bảng asset_history
SET @exist_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'asset_history' AND COLUMN_NAME = 'tenant_id');
SET @sql_run = IF(@exist_col = 0, 'ALTER TABLE asset_history ADD COLUMN tenant_id INT NOT NULL DEFAULT 1 AFTER id, ADD CONSTRAINT fk_assethist_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE, ADD INDEX idx_assethist_tenant (tenant_id)', 'SELECT 1');
PREPARE stmt FROM @sql_run; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Bảng promo_banners
SET @exist_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'promo_banners' AND COLUMN_NAME = 'tenant_id');
SET @sql_run = IF(@exist_col = 0, 'ALTER TABLE promo_banners ADD COLUMN tenant_id INT NOT NULL DEFAULT 1 AFTER id, ADD CONSTRAINT fk_promobanners_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE, ADD INDEX idx_promobanners_tenant (tenant_id)', 'SELECT 1');
PREPARE stmt FROM @sql_run; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Bảng viewer_sessions
SET @exist_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'viewer_sessions' AND COLUMN_NAME = 'tenant_id');
SET @sql_run = IF(@exist_col = 0, 'ALTER TABLE viewer_sessions ADD COLUMN tenant_id INT NOT NULL DEFAULT 1 AFTER token, ADD CONSTRAINT fk_viewersess_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE, ADD INDEX idx_viewersess_tenant (tenant_id)', 'SELECT 1');
PREPARE stmt FROM @sql_run; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Bảng auth_attempt_log
SET @exist_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'auth_attempt_log' AND COLUMN_NAME = 'tenant_id');
SET @sql_run = IF(@exist_col = 0, 'ALTER TABLE auth_attempt_log ADD COLUMN tenant_id INT NOT NULL DEFAULT 1 AFTER id, ADD CONSTRAINT fk_authlog_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE, ADD INDEX idx_authlog_tenant (tenant_id)', 'SELECT 1');
PREPARE stmt FROM @sql_run; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Bảng site_settings
SET @exist_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'site_settings' AND COLUMN_NAME = 'tenant_id');
SET @sql_run = IF(@exist_col = 0, 'ALTER TABLE site_settings ADD COLUMN tenant_id INT NOT NULL DEFAULT 1 FIRST, DROP PRIMARY KEY, ADD PRIMARY KEY (tenant_id, setting_key), ADD CONSTRAINT fk_settings_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE', 'SELECT 1');
PREPARE stmt FROM @sql_run; EXECUTE stmt; DEALLOCATE PREPARE stmt;
