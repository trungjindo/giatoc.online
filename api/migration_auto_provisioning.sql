-- ===========================================================================
-- BẢN MIGRATION HỖ TRỢ AUTO-PROVISIONING & WEBHOOK IDEMPOTENCY
-- Hệ thống: giatoc.online | Bảng webhook_logs & idempotency checks
-- ===========================================================================

CREATE TABLE IF NOT EXISTS webhook_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    webhook_source VARCHAR(64) NOT NULL DEFAULT 'vietqr_casso',
    transaction_id VARCHAR(128) NOT NULL,            -- Mã giao dịch duy nhất từ ngân hàng (FTxxxx, MBxxxx)
    order_code VARCHAR(32) NOT NULL,                 -- Mã đơn hàng (GT10839)
    amount DECIMAL(15, 2) NOT NULL,                  -- Số tiền nhận được thực tế
    transfer_content TEXT NOT NULL,                  -- Nội dung tin nhắn chuyển khoản
    raw_payload JSON NULL,                           -- Toàn bộ JSON webhook để kiểm tra đối soát
    status ENUM('processed', 'ignored', 'failed') NOT NULL DEFAULT 'processed',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_source_trans (webhook_source, transaction_id),
    INDEX idx_order_code (order_code),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bổ sung trường webhook_id vào bảng orders để theo dõi nguồn kích hoạt
SET @exist_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'webhook_id');
SET @sql_run = IF(@exist_col = 0, 'ALTER TABLE orders ADD COLUMN webhook_id INT NULL AFTER confirmed_by, ADD CONSTRAINT fk_orders_webhook FOREIGN KEY (webhook_id) REFERENCES webhook_logs(id) ON DELETE SET NULL', 'SELECT 1');
PREPARE stmt FROM @sql_run; EXECUTE stmt; DEALLOCATE PREPARE stmt;
