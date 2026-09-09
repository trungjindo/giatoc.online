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
