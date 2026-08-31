# TÀI LIỆU THIẾT KẾ & ĐẶC TẢ KỸ THUẬT: PORTAL QUẢN TRỊ GIATOC.ONLINE
> **Dự án**: Admin Portal Quản Trị Gia Tộc Đa Dòng Họ (`https://giatoc.online/portal` & `/admin`)  
> **Hạ tầng mục tiêu**: Nền tảng Container / Hosting Antigravity  
> **Nguyên tắc cốt lõi**: Mobile-First • Tiết kiệm không gian • WCAG AA • Mọi nút thao tác gọi API thực tế kèm Toast/Loading state.

---

## 1. HỆ THỐNG THIẾT KẾ UI/UX (DESIGN SYSTEM)

### 1.1. Grid, Spacing & Breakpoints
- **Baseline Grid**: 8px (`8px`, `16px`, `24px`, `32px`, `40px`).
- **Responsive Breakpoints**:
  - `Mobile`: $\le 640\text{px}$ (Padding container: $16\text{px}$, drawer menu).
  - `Tablet`: $641\text{px} - 1024\text{px}$ (Padding container: $24\text{px}$).
  - `Desktop`: $\ge 1025\text{px}$ (Padding container: $32\text{px}$, 2-column forms, fixed sidebar).
- **Row Heights Tiết Kiệm Không Gian**:
  - Metric Cards: $96\text{px} - 120\text{px}$.
  - Compact Table Rows: $48\text{px} - 56\text{px}$.
  - Header: $64\text{px}$ cố định.

### 1.2. Bảng Màu & Typography
| Tên Màu | Hex Code | Ứng Dụng |
| :--- | :--- | :--- |
| **Primary Deep Teal** | `#0F3B4A` | Header, Sidebar active item, Tiêu đề chính, Primary CTA |
| **Accent Gold / Bronze** | `#C79A2E` | Huy hiệu, viền danh giá, Icon điểm nhấn, Nút nổi bật |
| **Surface Light** | `#FFFFFF` | Nền thẻ Card, Modal, Bảng dữ liệu |
| **Neutral Background** | `#F6F7F9` | Nền toàn trang, Nền hàng bảng hover |
| **Border Neutral** | `#E6E9EE` | Đường viền các khối phân cách |
| **Dark Charcoal** | `#2B2F33` | Màu chữ chính, độ tương phản cao đạt chuẩn WCAG AA |

- **Typography**:
  - `Headline Serif`: *Playfair Display* / *Merriweather* ($28 - 32\text{px}$ cho H1, $20 - 24\text{px}$ cho H2).
  - `Body Sans`: *Inter* / *Be Vietnam Pro* ($14 - 16\text{px}$ cho body, $11 - 12\text{px}$ cho chú thích).

---

## 2. KIẾN TRÚC CÁC PHÂN HỆ TRONG PORTAL

```text
+-----------------------------------------------------------------------------------------+
| [GT] Dòng Họ Trần Đình (Admin)   [🔍 Tìm nhanh thành viên...]   (Web Mẫu) (🔔) [Avatar AD] |
+-----------------------------------------------------------------------------------------+
| [SIDEBAR]         | [MAIN WORKSPACE]                                                    |
| • Dashboard       | HERO BANNER: Chào mừng Trưởng ban! [ + Thêm Thành Viên ] [ Đổi Theme ]|
| • Danh Sách Con   | 4 METRIC CARDS: 8 Thành viên | 3 Bài viết | 3 Album | Gói Pro          |
| • Cây Phả Hệ      | +-----------------------------------------------------------------+ |
| • Album Kỷ Yếu    | | SƠ ĐỒ PHẢ HỆ TƯƠNG TÁC (Canvas 440px)                           | |
| • Bài Viết / Tin  | | [Zoom In] [Zoom Out] [Fit Screen]                               | |
| • Dòng Thời Gian  | |           [ Đời 1: Cụ Thủy Tổ Trần Đình Văn ]                   | |
| • Nhập / Xuất     | |                     /               \                           | |
| • Templates (Mới) | |      [ Đời 2: Chi 1 ]               [ Đời 2: Chi 2 ]            | |
| • Bản Quyền SaaS  | +-----------------------------------------------------------------+ |
| • Cài Đặt         | BẢNG NHẬT KÝ HOẠT ĐỘNG (2/3)      | THAO TÁC NHANH (1/3)            |
|                   | - Thêm mới thành viên: Anh Trung  | [ Import Excel (DAG Guard) -> ] |
|                   | - Cập nhật thu chi: +15.000.000đ  | [ Xuất GEDCOM 5.5.1 -> ]        |
|                   | - Backup snapshot lúc 02:00       | [ Sao Lưu Dữ Liệu Ngay -> ]     |
+-----------------------------------------------------------------------------------------+
```

### Chi Tiết Từng Module:
1. **Dashboard**: Bảng điều khiển tổng quan, chỉ số hạn mức, mini interactive tree canvas, quick actions.
2. **Members (Danh Sách Con Cháu)**: Bảng dữ liệu compact $52\text{px}$, tìm kiếm tức thì, lọc theo Chi, Modal thêm/sửa có validation, xóa có xác nhận.
3. **Family Tree Interactive**: Canvas thu phóng mượt mà, click xem tiểu sử, double click mở modal sửa thành viên, export đồ thị.
4. **Album / Media**: Lưới Masonry 3 cột desktop / 2 cột mobile, kéo thả tải lên hàng loạt, thanh tiến trình.
5. **Timeline**: Dòng thời gian niên đại lịch sử gia tộc.
6. **Posts / Phả Ký**: Quản lý tin tức sự kiện, đại tu từ đường, khuyến học.
7. **Import / Export**: Bộ đọc Excel có thuật toán DAG Cycle Guard phát hiện lỗi đệ quy, nút xuất chuẩn GEDCOM 5.5.1 và snapshot 30 ngày.
8. **Templates Demo**: 3 mẫu giao diện (*Classic Imperial*, *Modern Heritage*, *Minimalist Zen*) kèm nút tải JSON Seed Template.
9. **License Management**: Trạng thái gói, hạn mức thành viên/dung lượng NVMe, thanh toán tự động qua VietQR / Stripe / VNPay.
10. **Settings**: Đổi tên dòng họ, câu đối, màu sắc chủ đạo `#0F3B4A`, logo huy hiệu và tên miền riêng.

---

## 3. ĐẶC TẢ API CONTRACT (OPENAPI STANDARD)

### 3.1. Thêm Mới Thành Viên (Add Member)
- **Endpoint**: `POST /api/v1/families/{familyId}/members`
- **Request Body**:
```json
{
  "fullName": "Trần Đình Trung",
  "nickname": "Anh Trung",
  "gender": "male",
  "generation": 4,
  "birthDate": "1985",
  "deathDate": null,
  "role": "Trưởng Ban Công Nghệ",
  "branch": "Chi 1",
  "phone": "0912345678",
  "tomb": "",
  "parentIds": [4]
}
```
- **Response `201 Created`**:
```json
{
  "status": "success",
  "message": "Member created successfully",
  "data": {
    "id": 7,
    "fullName": "Trần Đình Trung",
    "createdAt": "2026-08-31T13:30:00Z"
  }
}
```

### 3.2. Cập Nhật & Xóa Thành Viên
- **Edit Member**: `PUT /api/v1/members/{memberId}` $\rightarrow$ `200 OK`
- **Delete Member**: `DELETE /api/v1/members/{memberId}` $\rightarrow$ `204 No Content`

### 3.3. Import CSV / Excel (DAG Validation Engine)
- **Endpoint**: `POST /api/v1/families/{familyId}/imports/csv` (Multipart Form)
- **Response `202 Accepted`**:
```json
{
  "jobId": "job_import_9f82a1b",
  "status": "processing",
  "pollUrl": "/api/v1/imports/job_import_9f82a1b"
}
```
- **Polling Check**: `GET /api/v1/imports/{jobId}` $\rightarrow$ Trả về progress %, tổng số dòng, xác thực DAG không chu trình lặp.

### 3.4. Xuất Chuẩn GEDCOM 5.5.1
- **Endpoint**: `POST /api/v1/families/{familyId}/exports?format=gedcom`
- **Response `200 OK`**:
```json
{
  "downloadUrl": "https://giatoc.online/storage/exports/giapha_hotrandinh_5.5.1.ged",
  "expiresAt": "2026-08-31T15:00:00Z"
}
```

### 3.5. Cấp Phát Bản Quyền (License Issuance)
- **Endpoint**: `POST /api/v1/licenses/issue`
- **Request Body**:
```json
{
  "familyId": "hotrandinh",
  "plan": "pro",
  "paymentId": "pay_stripe_98a7bc12"
}
```
- **Response `200 OK`**:
```json
{
  "licenseKey": "GT-PRO-2026-9FA8-23CB",
  "plan": "pro",
  "maxMembers": 1500,
  "maxStorageMb": 10240,
  "expiresAt": "2027-08-31T23:59:59Z"
}
```

---

## 4. CHIẾN LƯỢC MULTI-TENANT VS SINGLE-TENANT

| Tiêu Chí | Phương Án 1: Single-Tenant Clone (MVP) | Phương Án 2: Multi-Tenant Single-App (Scale) |
| :--- | :--- | :--- |
| **Cách Thức** | Mỗi dòng họ 1 Container/Site clone độc lập | 1 Ứng dụng duy nhất phân vùng theo `tenant_id` |
| **Ưu Điểm** | Cách ly dữ liệu 100%, dễ tùy biến CSS/Code riêng, không sợ lỗi dây chuyền | Tiết kiệm tài nguyên máy chủ, bảo trì nâng cấp đồng loạt cực nhanh |
| **Nhược Điểm** | Tốn dung lượng RAM máy chủ khi số lượng > 200 site | Cần lập chỉ mục DB và RLS chặt chẽ chống rò rỉ dữ liệu |
| **Khuyến Nghị** | **Áp dụng cho các dòng họ VIP mua gói Đại Tộc / Tên miền riêng** | **Áp dụng cho các dòng họ gói Cơ bản / Tiêu chuẩn** |

---

## 5. HƯỚNG DẪN TRIỂN KHAI & VẬN HÀNH TRÊN ANTIGRAVITY

1. **Khởi chạy Cụm Container**:
   ```bash
   docker compose up -d --build
   ```
2. **Kích hoạt Script Tự Động Clone Site**:
   ```bash
   node scripts/clone_site.js --slug=nguyenduy --clan="Dòng Họ Nguyễn Duy" --plan="pro"
   ```
3. **Cấu hình Sao Lưu Snapshot 30 Ngày**:
   - Database Dump hàng ngày lúc 02:00 AM.
   - Media Uploads Rsync sang Object Storage.
4. **Giám Sát & Error Tracking**:
   - Tích hợp Sentry SDK theo dõi lỗi JS / API.
   - Prometheus Metric Gateway theo dõi CPU, RAM, Uptime máy chủ.
