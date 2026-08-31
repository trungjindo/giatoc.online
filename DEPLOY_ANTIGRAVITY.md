# HƯỚNG DẪN TRIỂN KHAI NỀN TẢNG SAAS GIATOC.ONLINE TRÊN HẠ TẦNG ANTIGRAVITY
> **Mục tiêu**: Vận hành hệ thống Đa Dòng họ (Multi-Tenancy) với Wildcard Subdomain (`*.giatoc.online`) và tự động cấp phát SSL miễn phí cho mọi Tên Miền Riêng (On-Demand TLS).

---

## 1. TỔNG QUAN KIẾN TRÚC ANTIGRAVITY

```
Internet (Khách hàng & Trưởng họ)
           │
           ▼
[ Cloudflare DNS & DDoS Protection ] ── (*.giatoc.online + Custom Domains)
           │
           ▼ (Port 80/443)
[ Caddy Server v2 Reverse Proxy ] ── (Tự động cấp SSL Let's Encrypt On-Demand)
     │                     │
     ▼ (Port 3000)         ▼ (Port 80 / FastCGI)
[ Frontend Web App ]   [ PHP 8.2-FPM & API Gateway ]
(React / Static Build) (Xử lý Data, VietQR Webhook, RBAC, ZNS)
           │                       │
           └───────────┬───────────┘
                       ▼
               [ MySQL 8.0 CSDL ]
            (Lưu trữ dữ liệu 50+ Dòng họ)
```

---

## 2. CẤU HÌNH DOCKER COMPOSE (`docker-compose.yml`)

Tạo tệp `docker-compose.yml` tại thư mục triển khai `/opt/giatoc-online/`:

```yaml
version: '3.8'

services:
  caddy:
    image: caddy:2-alpine
    container_name: giatoc_caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
      - ./dist:/var/www/html:ro
      - ./api:/var/www/html/api:ro
      - ./storage:/var/www/html/storage
    depends_on:
      - php-fpm
      - mysql

  php-fpm:
    image: php:8.2-fpm-alpine
    container_name: giatoc_php
    restart: unless-stopped
    environment:
      - DB_HOST=mysql
      - DB_NAME=giatoc_saas
      - DB_USER=giatoc_user
      - DB_PASS=${DB_PASSWORD}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    volumes:
      - ./dist:/var/www/html
      - ./api:/var/www/html/api
      - ./storage:/var/www/html/storage
    depends_on:
      - mysql

  mysql:
    image: mysql:8.0
    container_name: giatoc_mysql
    restart: unless-stopped
    command: --default-authentication-plugin=mysql_native_password --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: giatoc_saas
      MYSQL_USER: giatoc_user
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./api/schema.sql:/docker-entrypoint-initdb.d/01_schema.sql:ro
      - ./api/migration_multi_tenant.sql:/docker-entrypoint-initdb.d/02_migration.sql:ro

volumes:
  caddy_data:
  caddy_config:
  mysql_data:
```

---

## 3. CẤU HÌNH CADDYFILE HOÀNG GIA (`Caddyfile`)

```caddy
{
    email admin@giatoc.online
    on_demand_tls {
        ask http://php-fpm:9000/api/platform_tenants.php?action=verify_domain
        interval 2m
        burst 5
    }
}

# 1. Cổng Portal chính & Wildcard Subdomain cho từng dòng họ
giatoc.online, www.giatoc.online, *.giatoc.online {
    root * /var/www/html
    encode zstd gzip

    # Xử lý PHP API
    @php {
        path /api/*
    }
    reverse_proxy @php php-fpm:9000 {
        transport fastcgi {
            split .php
        }
    }

    # Static assets & SPA React Router Fallback
    try_files {path} /index.html
    file_server

    # Security Headers
    header {
        X-Content-Type-Options nosniff
        X-Frame-Options SAMEORIGIN
        Referrer-Policy strict-origin-when-cross-origin
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    }
}

# 2. Custom Domain của khách hàng mua gói Đại Tộc (hotrandinh.com, ...)
:443 {
    tls {
        on_demand
    }

    root * /var/www/html
    encode zstd gzip

    @php {
        path /api/*
    }
    reverse_proxy @php php-fpm:9000 {
        transport fastcgi {
            split .php
        }
    }

    try_files {path} /index.html
    file_server
}
```

---

## 4. BỘ BIẾN MÔI TRƯỜNG SẢN XUẤT (`.env.production`)

```bash
# App Configuration
NODE_ENV=production
APP_URL=https://giatoc.online
API_URL=https://giatoc.online/api

# Database Credentials
DB_HOST=mysql
DB_NAME=giatoc_saas
DB_USER=giatoc_user
DB_PASSWORD=SuperSecurePass2026!Antigravity
MYSQL_ROOT_PASSWORD=RootSecurePass2026!Antigravity

# Bank & VietQR Webhook Secret
VIETQR_CLIENT_ID=vqr_live_9a8b7c6d5e
VIETQR_API_KEY=key_secret_123456789
CASSO_WEBHOOK_SECURE_TOKEN=casso_token_live_89123891023

# Zalo Cloud ZNS Service
ZALO_APP_ID=48910293812039
ZALO_SECRET_KEY=zalo_secret_live_998
ZALO_OA_ID=1920381029381023

# Google Gemini Flash API Key (Kinship & OCR)
GEMINI_API_KEY=AIzaSyB_LiveTokenForKinshipAndOCR2026
```

---

## 5. QUY TRÌNH DEPLOY & TỰ ĐỘNG HÓA

### Bước 1: Build mã nguồn Frontend
```bash
npm run build
```

### Bước 2: Khởi chạy các dịch vụ Container trên Antigravity
```bash
docker compose -f docker-compose.yml up -d --build
```

### Bước 3: Cấu hình DNS trên Cloudflare / Domain Registrar
- Thêm bản ghi **A**: `@` $\rightarrow$ IP máy chủ Antigravity (Proxy On / Bật đám mây cam).
- Thêm bản ghi **A**: `*` (Wildcard) $\rightarrow$ IP máy chủ Antigravity.
- Khách hàng có tên miền riêng chỉ cần trỏ bản ghi **CNAME** hoặc **A** về `giatoc.online` là Caddy tự động cấp phát SSL trong vòng 15 giây.

### Bước 4: Tự động Sao Lưu CSDL Hàng Ngày (Crontab)
Chạy `crontab -e` trên máy chủ và thêm dòng sau:
```cron
0 2 * * * docker exec giatoc_mysql mysqldump -u giatoc_user -pSuperSecurePass2026!Antigravity giatoc_saas | gzip > /opt/backups/giatoc_backup_$(date +\%F).sql.gz
```
