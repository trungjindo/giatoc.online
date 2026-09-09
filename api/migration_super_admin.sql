-- ===========================================================================
-- MIGRATION SUPER ADMIN: HỆ THỐNG ÂN HẠN (GRACE PERIOD), READ-ONLY & CẢNH BÁO GIA HẠN
-- Hệ thống: giatoc.online | Quản trị nền tảng SaaS tập trung
-- ===========================================================================

-- 1. Cập nhật ENUM trạng thái của Tenant hỗ trợ Ân Hạn (grace_period) và Chỉ Đọc (read_only)
ALTER TABLE tenants 
MODIFY COLUMN status ENUM('active', 'grace_period', 'read_only', 'expired', 'suspended', 'trial') 
NOT NULL DEFAULT 'active';

-- 2. Bảng theo dõi nhật ký cảnh báo gia hạn tự động qua Zalo ZNS / Email
CREATE TABLE IF NOT EXISTS tenant_renewal_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    milestone ENUM('30_days', '15_days', '7_days', '1_day', 'expired', 'grace_15_readonly') NOT NULL,
    channel ENUM('zalo_zns', 'email', 'system_banner') NOT NULL,
    recipient VARCHAR(150) NOT NULL,
    message_title VARCHAR(255) NOT NULL,
    status ENUM('sent', 'delivered', 'failed') NOT NULL DEFAULT 'sent',
    payload JSON NULL,
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_renewal_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_tenant_milestone (tenant_id, milestone, sent_at),
    INDEX idx_sent_at (sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tạo chỉ mục tối ưu cho biểu đồ doanh thu theo thời gian
CREATE INDEX IF NOT EXISTS idx_orders_paid_amount ON orders(payment_status, paid_at, amount);
