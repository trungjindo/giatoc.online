# CẨM NANG HƯỚNG DẪN THIẾT LẬP & TRIỂN KHAI PRODUCTION
## NỀN TẢNG GIA TỘC ONLINE (giatoc.online) TRÊN HOSTINGER BUSINESS

Tài liệu này hướng dẫn chi tiết từng bước đưa toàn bộ hệ thống nền tảng **Gia Tộc Online** lên môi trường chạy thật (Production) với tên miền chính thức **`giatoc.online`** trên gói **Hosting Business** của Hostinger.

---

## 🖥️ 1. THÔNG SỐ HẠ TẦNG HOSTINGER CỦA BẠN

Dựa trên thông tin gói Hosting Business bạn đã đăng ký:
- **Tên miền chính**: `giatoc.online`
- **Địa chỉ IP Máy chủ Web (Server IP)**: `46.202.186.72`
- **Tên máy chủ (Server Name)**: `server1865`
- **Vị trí máy chủ**: Châu Á - Indonesia (Backup: Singapore)
- **Dung lượng lưu trữ**: 50 GB NVMe (Giới hạn 600.000 Inodes)
- **Quy mô vận hành**: 50 Addon Websites / Custom Domains
- **Môi trường Runtime**: PHP 8.1 / 8.2 / 8.3 (MySQL PDO) + Hỗ trợ Node.js (18.x / 20.x / 22.x)

---

## 🌐 2. BƯỚC 1: CẤU HÌNH BẢN GHI DNS TRÊN HOSTINGER

Để tên miền chính `giatoc.online` và **toàn bộ các subdomain dòng họ `*.giatoc.online`** (ví dụ: `demo.giatoc.online`, `nguyenduy.giatoc.online`, `hotrandinh.giatoc.online`...) tự động trỏ về cùng một thư mục mã nguồn mà **không cần tạo subdomain thủ công**, bạn cấu hình bản ghi DNS như sau:

1. Đăng nhập vào [Hostinger.com](https://hostinger.com) ➡️ Vào mục **Domains (Tên miền)** ➡️ Chọn **`giatoc.online`** ➡️ Chọn **DNS / Nameservers**.
2. Thêm/Chỉnh sửa các bản ghi (DNS Records) sau:

| Loại (Type) | Tên (Name) | Giá trị (Value / Points to) | TTL | Mục đích |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` | `46.202.186.72` | 3600 | Trỏ tên miền gốc `giatoc.online` |
| **A** | `*` | `46.202.186.72` | 3600 | **Wildcard DNS**: Tự động nhận mọi subdomain `[slug].giatoc.online` |
| **CNAME** | `www` | `giatoc.online` | 3600 | Chuyển hướng `www.giatoc.online` |

3. **Kích hoạt Chứng chỉ SSL Miễn phí (Free SSL)**:
   - Vào **hPanel** ➡️ **Websites** ➡️ **`giatoc.online`** ➡️ **Security (Bảo mật)** ➡️ **SSL**.
   - Bấm **Install SSL** cho `giatoc.online` và bật **Force HTTPS (Bắt buộc HTTPS)**.

---

## 🗄️ 3. BƯỚC 2: TẠO CƠ SỞ DỮ LIỆU MYSQL TRÊN HPANEL

1. Trong **hPanel**, vào mục **Databases** ➡️ **MySQL Databases**.
2. Tạo Database mới:
   - **MySQL Database Name**: `u123456789_giatoc` *(ví dụ)*
   - **MySQL Username**: `u123456789_admin` *(ví dụ)*
   - **Password**: `MatKhauBaoMat123!@#` *(ghi nhớ mật khẩu này)*
3. Bấm **Create (Tạo)**.
4. Bấm nút **Enter phpMyAdmin** bên cạnh database vừa tạo.
5. Chọn tab **Import (Nhập)** ➡️ Nhập lần lượt các tệp SQL trong thư mục `api/` theo thứ tự:
   - `api/schema.sql` (Khởi tạo toàn bộ 17 bảng)
   - `api/migration_multi_tenant.sql` (Nếu database đã có dữ liệu trước)
   - `api/migration_orders.sql` (Bảng đơn hàng & cấu hình MBBank)
   - `api/migration_messaging.sql` (Bảng ví tin nhắn & chiến dịch ZNS)

---

## 🔐 4. BƯỚC 3: CẤU HÌNH TỆP BẢO MẬT CSDL (`giatoc_db_secrets.php`)

Để bảo mật tuyệt đối, bạn đặt tệp mật khẩu CSDL ở **ngoài thư mục `public_html`** (người ngoài không thể truy cập qua URL).

1. Vào **File Manager** trên Hostinger.
2. Tại thư mục gốc của tài khoản hosting (cùng cấp với thư mục `public_html/`), tạo một tệp có tên: **`giatoc_db_secrets.php`**.
3. Dán nội dung cấu hình sau (thay thông tin database thật bạn vừa tạo ở Bước 2):

```php
<?php
// Tệp cấu hình bảo mật Production CSDL giatoc.online
// Đặt tại thư mục root ngoài public_html

define('DB_HOST', 'localhost');
define('DB_NAME', 'u123456789_giatoc');    // Tên database Hostinger
define('DB_USER', 'u123456789_admin');     // Username database Hostinger
define('DB_PASS', 'MatKhauBaoMat123!@#');  // Mật khẩu database Hostinger
```

---

## 🚀 5. BƯỚC 4: TẢI BỘ MÃ NGUỒN LÊN `public_html`

Thư mục `public_html/` trên Hostinger sẽ chứa toàn bộ mã nguồn Frontend đã đóng gói và Backend PHP API.

### Cấu Trúc Thư Mục Chuẩn Trên Hostinger `public_html/`:
```text
public_html/
│
├── index.html                    (Từ thư mục dist/index.html)
├── assets/                       (Từ thư mục dist/assets/)
│   ├── index-DIg-UodH.js
│   └── index-CANRxxN4.css
├── media/                        (Từ thư mục public/media/ - chứa logo, ảnh banner)
│   └── brand/logo-icon.png
├── .htaccess                     (Từ thư mục public/.htaccess)
│
├── api/                          (Toàn bộ thư mục api/ trong dự án)
│   ├── config.php
│   ├── db.php
│   ├── helpers.php
│   ├── data.php
│   ├── orders.php
│   ├── platform_tenants.php
│   ├── platform_settings.php
│   ├── zns_wallet.php
│   ├── zns_campaigns.php
│   ├── kinship_ai.php
│   ├── cron_renewals.php
│   ├── login.php
│   ├── logout.php
│   ├── upload.php
│   ├── serve_storage.php
│   └── ...
│
└── storage/                      (Thư mục lưu trữ ảnh người dùng tải lên)
    └── uploads/
```

### Hướng Dẫn Tải Lên Bằng File Manager (hoặc FileZilla FTP):
1. Trên máy tính của bạn, mở thư mục dự án `c:\Users\trung\Projects\Gia Pha Ho Tran\`.
2. Nén các mục sau thành 1 file zip (ví dụ `giatoc_prod.zip`):
   - Toàn bộ nội dung bên trong thư mục `dist/` (tệp `index.html` và thư mục `assets/`)
   - Thư mục `media/` (từ `public/media/`)
   - Tệp `.htaccess` (từ `public/.htaccess`)
   - Toàn bộ thư mục `api/`
3. Mở **File Manager** trên Hostinger ➡️ Truy cập vào thư mục **`public_html/`**.
4. Upload tệp `giatoc_prod.zip` lên và bấm **Extract (Giải nén)**.
5. Tạo thư mục `storage/uploads` nếu chưa có và phân quyền (Permission) là **755** (hoặc 777).

---

## ⚙️ 6. BƯỚC 5: KIỂM TRA TỆP ĐIỀU HƯỚNG `.htaccess` TRÊN `public_html`

Đảm bảo tệp `public_html/.htaccess` có nội dung chuẩn sau để ứng dụng React Router và phân giải ảnh tải lên hoạt động mượt mà:

```apache
# Bật mod_rewrite cho React Router SPA
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Phân tuyến lưu trữ ảnh đa dòng họ qua serve_storage.php
  RewriteRule ^api/storage/(.+)$ api/serve_storage.php?path=$1 [L,QSA]

  # Điều hướng tất cả trang về index.html của React
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Cấu hình Bảo mật HTTP Security Headers
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(self)"
</IfModule>
```

---

## ⏰ 7. BƯỚC 6: THIẾT LẬP CRON JOB TỰ ĐỘNG GIA HẠN & CẢNH BÁO HẾT HẠN

Để hệ thống tự động quét và kiểm tra các dòng họ sắp hết hạn (30 - 15 - 7 - 1 ngày):
1. Trong **hPanel**, vào mục **Advanced** ➡️ **Cron Jobs**.
2. Chọn **Common Settings**: `Once a day (Mỗi ngày một lần vào 00:00)`.
3. Command to run:
   ```bash
   curl -s https://giatoc.online/api/cron_renewals.php > /dev/null 2>&1
   ```
4. Bấm **Save (Lưu)**.

---

## 🎯 8. BƯỚC 7: CHECKLIST KIỂM THỬ NGHIỆM THU PRODUCTION

Sau khi hoàn tất tải lên, bạn kiểm tra 5 kịch bản trực tiếp trên trình duyệt:

1. **Truy cập Cổng Thông tin SaaS**:
   - Mở `https://giatoc.online` ➡️ Hiển thị Trang chủ SaaS, Bảng giá 4 gói cước, RBAC Matrix và thanh tra cứu Subdomain.
2. **Truy cập Dòng họ Mẫu Demo**:
   - Mở `https://demo.giatoc.online` (hoặc `https://giatoc.online/?tenant=demo`) ➡️ Hiển thị Website Dòng họ Mẫu với đầy đủ Cây phả hệ, Lăng mộ GPS, Thu chi.
3. **Truy cập Dòng họ Trần Đình**:
   - Mở `https://hotrandinh.giatoc.online` hoặc `https://hotrandinh.com` ➡️ Hiển thị dữ liệu Dòng Họ Trần Đình.
4. **Truy cập Platform Super Admin**:
   - Mở `https://giatoc.online/super-admin` ➡️ Đăng nhập tài khoản Super Admin quản lý toàn diện đơn hàng, duyệt nạp ví và 50+ Dòng họ.
5. **Thử nghiệm Đăng ký Dòng họ Mới**:
   - Bấm "Đăng Ký Dòng Họ" ➡️ Nhập subdomain thử nghiệm ➡️ Xác nhận hiển thị đúng mã VietQR MBBank:
     - **Số tài khoản**: `99997379999`
     - **Chủ tài khoản**: `TRẦN ĐÌNH TRUNG`
     - **Ngân hàng**: `NGÂN HÀNG QUÂN ĐỘI MBBANK`
     - **Mã nội dung**: `GT...`
   - Vào `/super-admin` bấm **"Duyệt & Tạo Web"** ➡️ Website dòng họ mới được khởi tạo và kích hoạt tự động!

---
*Chúc mừng bạn đã sở hữu Nền tảng Quản trị Gia tộc Đa Dòng họ thương mại hoàn chỉnh trên `giatoc.online`!*
