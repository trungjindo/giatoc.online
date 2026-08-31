# BẢN THIẾT KẾ & HƯỚNG DẪN KỸ THUẬT NÂNG CẤP NỀN TẢNG SAAS GIATOC.ONLINE
> **Dự án**: Nền tảng SaaS Quản trị & Số hóa Gia tộc Đa Dòng họ (Multi-Tenant Clan Platform)  
> **Tác giả**: Chuyên gia UX/UI, Marketing SaaS & Full-Stack Web Architect  
> **Hạ tầng triển khai mục tiêu**: Nền tảng / Hosting Antigravity  
> **Template chuẩn tham chiếu**: hotrandinh.com (Nâng cấp trải nghiệm, hiệu năng, bảo mật & khả năng nhân bản tự động)

---

## MỤC LỤC
1. [Tổng quan chiến lược](#1-tổng-quan-chiến-lược)
2. [Wireframe & Sitemap chi tiết](#2-wireframe--sitemap-chi-tiết)
3. [Thiết kế UI & Design System chi tiết](#3-thiết-kế-ui--design-system-chi-tiết)
4. [Copywriting & Nội dung chuyển đổi](#4-copywriting--nội-dung-chuyển-đổi)
5. [Kiến trúc Chức năng Kỹ thuật & API/DB Schema](#5-kiến-trúc-chức-năng-kỹ-thuật--apidb-schema)
6. [Đề xuất Stack & Kiến trúc Triển khai trên Antigravity](#6-đề-xuất-stack--kiến-trúc-triển-khai-trên-antigravity)
7. [Checklist Tối ưu SEO & Performance](#7-checklist-tối-ưu-seo--performance)
8. [Checklist Bảo mật & Vận hành](#8-checklist-bảo-mật--vận-hành)
9. [Flow Bán hàng, Auto-Provisioning & Onboarding](#9-flow-bán-hàng-auto-provisioning--onboarding)
10. [Mẫu Trang Template Dòng họ Clone (Dựa trên hotrandinh.com)](#10-mẫu-trang-template-dòng-họ-clone)
11. [Prototype, Assets & Hướng dẫn Đồ họa](#11-prototype-assets--hướng-dẫn-đồ-họa)
12. [Hệ thống Chỉ số KPI & Kế hoạch A/B Testing](#12-hệ-thống-chỉ-số-kpi--kế-hoạch-ab-testing)
13. [Kế hoạch Chuyển giao Dev & QA Checklist](#13-kế-hoạch-chuyển-giao-dev--qa-checklist)

---

## 1. TỔNG QUAN CHIẾN LƯỢC

### 1.1. Mục tiêu chuyển đổi
Chuyển đổi `giatoc.online` từ một website quản lý đơn lẻ thành **Nền tảng SaaS số 1 Việt Nam về Quản trị & Số hóa Gia tộc**. Mục tiêu chuyển đổi là:
- Đạt tỷ lệ chuyển đổi từ khách xem sang trải nghiệm Demo tương tác $\ge 35\%$.
- Đạt tỷ lệ chuyển đổi từ Demo sang đăng ký mua License bản quyền $\ge 8.5\%$.
- Tự động hóa $100\%$ quy trình thanh toán VietQR và khởi tạo website dòng họ (Auto-provisioning) trong vòng dưới **30 giây**.

### 1.2. Chân dung khách hàng mục tiêu (ICP - Ideal Customer Profile)
1. **Trưởng họ / Ban liên lạc Dòng họ (50 - 75 tuổi)**: Người nắm giữ gia phả giấy, mong muốn bảo tồn di sản dòng tộc, kết nối con cháu trên cả nước và hải ngoại, minh bạch thu chi và quỹ họ.
2. **Con cháu tâm huyết / Chuyên gia công nghệ thế hệ 8x - 9x (30 - 45 tuổi)**: Đóng vai trò cố vấn công nghệ cho dòng họ, tài trợ chi phí mua license, muốn một nền tảng hiện đại, có app web mượt mà trên mobile, có bản đồ lăng mộ và AI trợ lý xưng hô.
3. **Các Hội đồng Dòng họ quy mô lớn / Ban Trị sự Đền thờ Danh nhân**: Cần hệ thống quản trị nhiều chi phái, hàng chục nghìn con cháu, xuất bản sách kỷ yếu chuẩn in ấn và truyền thông Zalo tự động.

### 1.3. Thông điệp cốt lõi & Định vị USP (Unique Selling Proposition)
> **"Gia Tộc Online — Số Hóa Gia Phả, Kết Nối Huyết Thống, Trường Tồn Muôn Đời"**  
> Nền tảng quản trị gia tộc đa năng duy nhất tại Việt Nam kết hợp hoàn hảo giữa **Sơ đồ phả hệ tương tác đa thế hệ**, **Bản đồ lăng mộ vệ tinh GPS**, **Sổ quỹ thu chi minh bạch**, **Trợ lý AI xưng hô dòng tộc** và **Hệ thống gửi tin Zalo ZNS nhắc ngày giỗ tự động** — Khởi tạo tức thì chỉ trong 30 giây.

---

## 2. WIREFRAME & SITEMAP CHI TIẾT

### 2.1. Kiến trúc Sitemap Toàn Hệ Thống

```mermaid
graph TD
    Root["giatoc.online (SaaS Platform)"]
    
    Root --> Home["Trang chủ (Landing Page)"]
    Root --> Demo["Demo Interactive Sandbox (/demo)"]
    Root --> Pricing["Bảng giá & So sánh Gói (/pricing)"]
    Root --> Checkout["Cổng Mua & Kích hoạt VietQR (/checkout)"]
    Root --> Guide["Trung tâm Hướng dẫn & Tài liệu (/huong-dan)"]
    Root --> SuperAdmin["Super Admin Platform (/super-admin)"]
    
    Home --> HeroSec["Hero & Live Stats Counter"]
    Home --> USPBlocks["3 Cột Trụ Giá Trị Cốt Lõi"]
    Home --> TreePreview["Interactive Family Tree Widget"]
    Home --> FeatureMatrix["Tính năng nổi bật (GPS, Sổ quỹ, ZNS, AI)"]
    Home --> SocialProof["Đánh giá Trưởng Ban & Dòng họ tiêu biểu"]
    Home --> PricingSec["Bảng giá 3 gói dịch vụ"]
    Home --> FAQSec["Câu hỏi thường gặp & Tư vấn"]
    
    Root --> TenantSites["Website Template Dòng Họ (Subdomain / Custom Domain)"]
    TenantSites --> ClanHome["Trang chủ Dòng họ"]
    TenantSites --> ClanTree["Cây Phả Hệ Tương Tác (/pha-he)"]
    TenantSites --> ClanDescendants["Danh sách Đinh / Con Cháu (/con-chau)"]
    TenantSites --> ClanTombs["Bản đồ Lăng mộ GPS (/lang-mo)"]
    TenantSites --> ClanFinance["Sổ Quỹ & Công Đức (/tai-chinh)"]
    TenantSites --> ClanGallery["Thư viện Kỷ yếu & Di tích (/hinh-anh)"]
    TenantSites --> ClanAltar["Bàn Thờ Số & Tưởng Niệm (/tuong-niem)"]
    TenantSites --> ClanNews["Bản Tin Gia Tộc (/tin-tuc)"]
    TenantSites --> ClanAdmin["Trang Quản Trị Dòng Họ (/admin)"]
```

### 2.2. Wireframe ASCII Cấu trúc Landing Page Chính (`giatoc.online`)

```text
+-----------------------------------------------------------------------------------+
| [LOGO] Gia Tộc Online        Tính Năng   Bảng Giá   Dùng Thử Demo   [Tạo Web Dòng Họ] |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [BADGE: Nền tảng số hóa gia tộc #1 Việt Nam]                                     |
|  GIỮ GÌN GIA BẢO - KẾT NỐI HUYẾT THỐNG MUÔN ĐỜI                                   |
|  Nền tảng quản trị gia phả tương tác, bản đồ lăng mộ GPS và sổ quỹ minh bạch     |
|  dành riêng cho các dòng họ Việt Nam thời đại số.                                 |
|                                                                                   |
|  [ Nhập tên dòng họ: Họ Nguyễn Duy... ]  [ Kiểm Tra & Tạo Ngay ]                  |
|  Hoặc [ Trải Nghiệm Demo Trực Quan -> ]                                           |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | [MINI DEMO INTERACTIVE FAMILY TREE WIDGET]                                  |  |
|  | - Thu nhỏ / Phóng to cây phả hệ 5 đời                                       |  |
|  | - Click vào cụ Tổ -> Xem nhánh chi họ, mộ phần GPS, chức vị cổ xưa          |  |
|  | - Chế độ che số điện thoại bảo vệ riêng tư (Privacy Gatekeeper)             |  |
|  +-----------------------------------------------------------------------------+  |
|  Thống kê: 250+ Dòng Họ Đã Dùng  |  120.000+ Thành Viên  |  99.9% Hài Lòng        |
+-----------------------------------------------------------------------------------+
| 3 CỘT TRỤ GIÁ TRỊ VƯỢT TRỘI (USP)                                                 |
| +-------------------------+ +-------------------------+ +-----------------------+ |
| | 1. PHẢ HỆ ĐA THẾ HỆ     | | 2. BẢN ĐỒ LĂNG MỘ GPS   | | 3. QUỸ HỌ & ZALO ZNS  | |
| | Cây gia phả trực quan,  | | Định vị vệ tinh chính   | | Tự động báo giỗ tổ,   | |
| | kéo thả mượt mà, hỗ trợ | | xác, gắn ảnh di tích,   | | kêu gọi công đức, thu | |
| | 100+ thế hệ, chống lặp. | | dẫn đường Google Maps.  | | chi minh bạch 1 chạm. | |
| +-------------------------+ +-------------------------+ +-----------------------+ |
+-----------------------------------------------------------------------------------+
| BẢNG GIÁ SAAS LICENSE (KÍCH HOẠT TỰ ĐỘNG SAU 30 GIÂY)                             |
| +--------------------+ +-------------------------+ +----------------------------+ |
| | GÓI CƠ BẢN         | | GÓI TIÊU CHUẨN (HOT)    | | GÓI ĐẠI TỘC / CAO CẤP      | |
| | 590.000 đ / năm    | | 1.290.000 đ / năm       | | 2.490.000 đ / năm          | |
| | - Dưới 300 người   | | - Dưới 1.500 người      | | - Dưới 5.000 người         | |
| | - Subdomain riêng  | | - Subdomain riêng       | | - GẮN TÊN MIỀN RIÊNG .COM  | |
| | - Cây phả hệ + GPS | | - Sổ quỹ + Excel + AI   | | - Full AI + Bàn thờ số     | |
| | - 50 tin Zalo ZNS  | | - 200 tin Zalo ZNS      | | - 500 tin ZNS + In sách PDF| |
| | [ Mua Gói Này ]    | | [ Chọn Gói Phổ Biến ]   | | [ Chọn Gói Cao Cấp ]       | |
| +--------------------+ +-------------------------+ +----------------------------+ |
+-----------------------------------------------------------------------------------+
| Ý KIẾN TRƯỞNG BAN LIÊN LẠC CÁC DÒNG HỌ & CHỨNG THỰC                               |
| [Avatar Cụ Trần] "Nhờ Gia Tộc Online, con cháu họ Trần ở Đức và Mỹ tìm về cội..."|
+-----------------------------------------------------------------------------------+
| FOOTER: Hotline/Zalo: 09xx.xxx.xxx | Email: hotro@giatoc.online | Bản quyền 2026  |
+-----------------------------------------------------------------------------------+
```

---

## 3. THIẾT KẾ UI & DESIGN SYSTEM CHI TIẾT

### 3.1. Bảng màu (Color Palette)
Phong cách thiết kế kết hợp giữa văn hóa Cung đình & Di sản Việt Nam và phong cách tối giản hiện đại của SaaS quốc tế:

| Vai trò | Tên màu | Hex Code | Ứng dụng thực tế |
| :--- | :--- | :--- | :--- |
| **Primary (Chủ đạo)** | Heritage Slate Navy | `#0F172A` / `#1E293B` | Thanh điều hướng, tiêu đề chính, nút nhấn chính |
| **Primary Burgundy** | Imperial Crimson | `#881337` / `#9F1239` | Nút kêu gọi hành động, huy hiệu gia tộc, điểm nhấn thiêng liêng |
| **Accent Gold** | Hoàng Kim Lạc Hồng | `#D97706` / `#F59E0B` | Viền thẻ danh giá, ngôi sao đánh giá, viền thẻ phả hệ cụ Thủy Tổ |
| **Background Light** | Giấy Điệp Cổ Truyền | `#FDFBF7` / `#F8F5EE` | Nền toàn trang, tạo cảm giác như trang sách gia phả bằng giấy cổ |
| **Surface White** | Pure White | `#FFFFFF` | Nền thẻ card, modal, bảng dữ liệu, biểu mẫu |
| **Success Emerald** | Ngọc Bích | `#059669` | Trạng thái Active, đã đóng quỹ, thành công |
| **Border Neutral** | Khung Gỗ Mộc | `#E2D9C8` / `#CBD5E1` | Đường viền các card, nhánh nối phả hệ |

### 3.2. Typography (Nghệ thuật chữ)
- **Tiêu đề & Thương hiệu (Display/Headings)**: Sử dụng font có chân hoàng gia `Playfair Display` hoặc `Cinzel` kết hợp `Merriweather` (cho tiếng Việt). Thể hiện sự tôn nghiêm, trường tồn và bề thế của dòng họ.
- **Nội dung văn bản (Body Text) & UI Controls**: Sử dụng `Plus Jakarta Sans` hoặc `Be Vietnam Pro` (400 Regular, 500 Medium, 600 SemiBold, 700 Bold). Font chữ tối ưu tuyệt đối cho tiếng Việt, hiển thị rõ ràng trên màn hình điện thoại kể cả với người lớn tuổi.

### 3.3. Spacing & Elevation (Khoảng cách & Chiều sâu)
- Hệ thống Spacing: Chuẩn 8-point Grid (`8px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`).
- Radius: Thẻ card bo góc `16px`, nút bo tròn mềm mại `9999px` (Pill style) hoặc `12px`.
- Shadows & Glassmorphism:
  - `shadow-subtle`: `0 4px 20px -2px rgba(15, 23, 42, 0.05)`
  - `shadow-royal`: `0 20px 40px -10px rgba(136, 19, 55, 0.15)`
  - `backdrop-blur-md`: Áp dụng cho navbar cố định và bảng điều khiển cây phả hệ.

### 3.4. Mô tả Component Family Tree Interactive (Trái tim của hệ thống)

```text
+------------------------------------------------------------------------------------+
| [🔍 Tìm tên con cháu...] [Thế hệ: Tất cả v] [Chi: Chi 2 v] [🔍- 100% 🔍+] [⛶ Full] |
+------------------------------------------------------------------------------------+
|                                                                                    |
|                               +------------------------+                           |
|                               | ĐỜI 1: CỤ THỦY TỔ       |                          |
|                               | TRẦN ĐÌNH VĂN (1820)   |                           |
|                               | [👑 Thủy Tổ] [📍 Mộ Tổ] |                          |
|                               +-----------+------------+                           |
|                                           |                                        |
|                     +---------------------+---------------------+                  |
|                     |                                           |                  |
|          +----------+-----------+                   +-----------+----------+       |
|          | ĐỜI 2: TRẦN ĐÌNH TOÀN |                   | ĐỜI 2: TRẦN ĐÌNH ĐỨC |       |
|          | (1852 - 1920)        |                   | (1856 - 1930)        |       |
|          | [Trưởng Chi 1]       |                   | [Trưởng Chi 2]       |       |
|          +----------+-----------+                   +-----------+----------+       |
|                     |                                           |                  |
|         +-----------+-----------+                               |                  |
|         |                       |                               |                  |
|  +------+------+         +------+------+                 +------+------+           |
|  | TRẦN ĐÌNH AN|         | TRẦN ĐÌNH BÌNH|               | TRẦN ĐÌNH CƯỜNG         |
|  | Đời 3 (1885)|         | Đời 3 (1890)|                 | Đời 3 (1895)|           |
|  +-------------+         +-------------+                 +-------------+           |
|                                                                                    |
+------------------------------------------------------------------------------------+
```

- **Tính năng tương tác**:
  - **Zoom & Pan mượt mà**: Hỗ trợ pinch-to-zoom trên màn hình cảm ứng điện thoại và cuộn chuột mượt mà trên desktop thông qua Canvas/SVG ảo hóa.
  - **Node Card Thông minh**: Hiển thị ảnh chân dung (hoặc icon thế hệ), họ tên, năm sinh - mất, chức vị dòng họ, huy hiệu chi phái, nút xem mộ phần GPS nhanh.
  - **Modal Chi Tiết Thành Viên**: Xem tiểu sử phả ký, danh sách vợ chồng, con cái, ngày giỗ âm lịch (tự động đổi sang dương lịch năm hiện tại), số điện thoại (được bảo vệ bằng cổng xác thực con cháu).
  - **Luồng thêm/sửa node (CRUD UX Flow)**: Admin chỉ cần nhấn biểu tượng `+` bên dưới bất kỳ node nào để thêm Con trai, Con gái, hoặc click bên cạnh để thêm Vợ/Chồng.
  - **Bộ lọc đa chiều**: Lọc cây theo Chi phái, theo khoảng Thế hệ (Đời 1 -> 5), tìm kiếm tức thì theo Họ tên có highlight đường dẫn phả hệ (Bloodline Ancestry Highlighter).
  - **Import / Export Engine**:
    - **Import Excel / CSV**: Hỗ trợ template chuẩn, tự động ánh xạ cột cha-con, kiểm tra chu trình đồ thị (DAG Cycle Validator) tránh lặp đệ quy gây treo web.
    - **Export GEDCOM 5.5.1**: Định dạng chuẩn quốc tế của phả hệ thế giới, giúp lưu trữ vĩnh viễn.
    - **Export PDF Kỷ yếu in ấn A4/A3**: Dàn trang tự động lời tựa, sơ đồ quạt, danh mục đinh chuẩn bị cho lễ mừng công đức.

---

## 4. COPYWRITING & NỘI DUNG CHUYỂN ĐỔI

### 4.1. 5 Biến thể Headline (Tiêu đề chính)
1. **Headline 1 (Tôn vinh cội nguồn - Chuyển đổi cao nhất)**:  
   *“Số Hóa Gia Phả – Kết Nối Huyết Thống – Lưu Truyền Muôn Đời Cho Con Cháu Mai Sau”*
2. **Headline 2 (Nhấn mạnh sự tiện lợi & hiện đại)**:  
   *“Nền Tảng Quản Trị Gia Tộc Số 1 Việt Nam: Sở Hữu Website Dòng Họ Chuyên Nghiệp Trong 30 Giây”*
3. **Headline 3 (Tập trung vào tính năng toàn diện)**:  
   *“Cây Phả Hệ Tương Tác, Bản Đồ Lăng Mộ GPS & Sổ Quỹ Minh Bạch – Đưa Dòng Họ Bước Vào Kỷ Nguyên Số”*
4. **Headline 4 (Chạm vào cảm xúc người xa quê)**:  
   *“Dù Con Cháu Ở Bốn Phương Trời, Chỉ 1 Lần Chạm Là Tìm Thấy Cội Nguồn Dòng Tộc”*
5. **Headline 5 (Tập trung vào tính trang trọng & bề thế)**:  
   *“Xây Dựng Từ Đường Số Cho Dòng Tộc: Trang Trọng, Bảo Mật, Vĩnh Cửu Cùng Thời Gian”*

### 4.2. 5 Biến thể Subheadline (Tiêu đề phụ)
1. *“Khởi tạo website riêng cho dòng họ với đầy đủ cây gia phả đa thế hệ, bản đồ GPS chỉ đường lăng mộ, thông báo Zalo ngày giỗ tự động và quản lý thu chi minh bạch.”*
2. *“Giải pháp toàn diện thay thế gia phả giấy cũ nát, tránh thất lạc thông tin, giúp hàng nghìn con cháu gắn kết và tự hào về truyền thống tổ tiên.”*
3. *“Không cần biết lập trình! Chỉ cần nhập danh sách Excel, hệ thống tự động vẽ nên cây phả hệ trực quan, sống động trên mọi thiết bị.”*
4. *“Bảo mật thông tin gia tộc 3 lớp nghiêm ngặt, phân quyền chi tộc rõ ràng, lưu trữ dữ liệu an toàn trên nền tảng Antigravity tốc độ cao.”*
5. *“Được tin dùng bởi hơn 250+ dòng họ lớn trên khắp cả nước. Tự động cấp bản quyền và kích hoạt web ngay sau khi quét mã VietQR.”*

### 4.3. 3 Đoạn mô tả ngắn cho các Trụ cột Giá trị (USP)
- **Trụ cột 1 — Sơ Đồ Phả Hệ Tương Tác Vô Hạn Thế Hệ**:  
  *Vẽ nên toàn bộ cây huyết thống từ cụ Thủy Tổ đến thế hệ con cháu mới sinh. Tự do phóng to, thu nhỏ, tra cứu quan hệ họ hàng bằng Trợ lý AI xưng hô thông minh. Không còn nỗi lo nhầm lẫn thứ bậc trong gia tộc.*
- **Trụ cột 2 — Bản Đồ Lăng Mộ GPS & Kỷ Yếu Di Tích Số**:  
  *Định vị chính xác từng vị trí lăng mộ tổ tiên, nhà thờ chi họ bằng tọa độ vệ tinh Google Maps. Con cháu ở xa hay thế hệ trẻ lần đầu về quê chỉ cần mở điện thoại là được chỉ đường tận nơi.*
- **Trụ cột 3 — Quỹ Họ Minh Bạch & Gửi Tin Zalo ZNS Tự Động**:  
  *Công khai mọi khoản thu chi, đóng góp công đức có đính kèm hóa đơn ảnh. Tự động gửi tin nhắn Zalo thông báo lễ giỗ tổ, chúc thọ các cụ và nhắc nộp quỹ họ chỉ bằng một nút bấm.*

### 4.4. 3 Mẫu Kêu gọi Hành động (CTA)
- **CTA 1 (Primary Button)**: `[ Khởi Tạo Website Dòng Họ Ngay — Kích Hoạt Trong 30s ]`
- **CTA 2 (Secondary Interactive)**: `[ Xem Thử Web Demo Thực Tế (Họ Trần Đinh) -> ]`
- **CTA 3 (Tư vấn trực tiếp)**: `[ Nhận Tư Vấn & Hỗ Trợ Nhập Liệu Miễn Phí Qua Zalo ]`

### 4.5. Nội dung Bảng giá Dịch vụ (Pricing Table Content)

| Tính năng / Gói dịch vụ | GÓI CƠ BẢN (Chi Nhỏ / Gia Đình) | GÓI TIÊU CHUẨN (Dòng Họ Vừa - Phổ biến) | GÓI ĐẠI TỘC (Dòng Họ Lớn / Toàn Quốc) |
| :--- | :--- | :--- | :--- |
| **Giá niêm yết** | **590.000 đ** / năm | **1.290.000 đ** / năm *(Best Choice)* | **2.490.000 đ** / năm |
| **Đối tượng phù hợp** | Chi họ nhỏ, dưới 3 đời, dưới 300 người | Dòng họ phổ biến, nhiều chi nhánh, dưới 1.500 người | Dòng họ lớn trên cả nước, nhiều đời, dưới 5.000 người |
| **Tên miền hoạt động** | `[tenho].giatoc.online` | `[tenho].giatoc.online` | **Hỗ trợ Gắn Tên Miền Riêng** (VD: `hotrandinh.com`) |
| **Quy mô thành viên** | Tối đa **300 thành viên** | Tối đa **1.500 thành viên** | Tối đa **5.000 thành viên** (Mở rộng linh hoạt) |
| **Dung lượng lưu trữ ảnh/kỷ yếu**| **2 GB NVMe High Speed** | **10 GB NVMe High Speed** | **30 GB NVMe High Speed** |
| **Tài khoản Ban Quản Trị** | 2 Admin | 5 Admin (Phân quyền theo Chi) | 15 Admin (Phân quyền Trưởng họ + Chi + Kế toán) |
| **Sơ đồ Cây Phả Hệ Tương Tác**| Có (Đầy đủ tính năng) | Có (Đầy đủ tính năng) | Có (Đầy đủ tính năng cao cấp) |
| **Bản đồ Lăng Mộ GPS Vệ Tinh** | Có | Có | Có |
| **Sổ Quỹ & Công Đức Minh Bạch** | Cơ bản | Nâng cao (Có đính kèm hóa đơn) | Đa tầng (Quản lý thu chi từng Chi họ riêng biệt) |
| **Import / Export Excel** | ❌ Chưa hỗ trợ | Có (Nhập liệu tự động 1-click) | Có (Hỗ trợ định dạng GEDCOM quốc tế) |
| **Trợ Lý AI Xưng Hô Dòng Tộc** | ❌ Không | Có (Tra cứu vai vế quan hệ) | Có (AI giải nghĩa văn cúng & xưng hô chuẩn mực) |
| **Bàn Thờ Số & Không Gian Tưởng Niệm**| ❌ Không | ❌ Không | Có (Thắp nén nhang số cho con cháu phương xa) |
| **Tặng Tin Nhắn Zalo ZNS Báo Giỗ**| Tặng **50 tin ZNS** | Tặng **200 tin ZNS** | Tặng **500 tin ZNS** |
| **Xuất File Sách Kỷ Yếu In Ấn**| ❌ Không | ❌ Không | Có (Xuất PDF A4/A3 dàn trang chuyên nghiệp) |
| **Hỗ trợ Kỹ thuật & Nhập liệu**| Hỗ trợ qua Ticket/Email | Hotline & Zalo hỗ trợ giờ hành chính | Chuyên viên phục vụ 1-1 & Hỗ trợ nhập liệu ban đầu |

---

## 5. KIẾN TRÚC CHỨC NĂNG KỸ THUẬT & API/DB SCHEMA

### 5.1. Mô hình Dữ liệu Cơ sở (Database Schema DDL - PostgreSQL / MySQL)

Hệ thống được thiết kế theo mô hình **Multi-Tenant with Shared Database & Isolated Tenant Key (`tenant_id`)**, hỗ trợ lập chỉ mục tối ưu, khóa ngoại toàn vẹn và trường JSON linh hoạt.

```sql
-- 1. BẢNG TENANTS (Quản lý các dòng họ mua license)
CREATE TABLE tenants (
    id VARCHAR(36) PRIMARY KEY,
    slug VARCHAR(64) UNIQUE NOT NULL, -- vd: trandinh, nguyenduy
    clan_name VARCHAR(255) NOT NULL, -- vd: Dòng Họ Trần Đình
    custom_domain VARCHAR(255) UNIQUE NULL, -- vd: hotrandinh.com
    plan_tier ENUM('basic', 'standard', 'premium', 'enterprise') DEFAULT 'standard',
    status ENUM('active', 'expired', 'suspended', 'trial') DEFAULT 'trial',
    max_members INT DEFAULT 1500,
    max_storage_mb INT DEFAULT 10240,
    used_storage_mb INT DEFAULT 0,
    zns_balance_cents INT DEFAULT 0, -- Số dư ví ZNS
    primary_contact_name VARCHAR(128) NOT NULL,
    primary_contact_phone VARCHAR(20) NOT NULL,
    primary_contact_email VARCHAR(128) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_custom_domain ON tenants(custom_domain);
CREATE INDEX idx_tenants_status_expires ON tenants(status, expires_at);

-- 2. BẢNG LICENSES (Quản lý khóa bản quyền mã hóa)
CREATE TABLE licenses (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    license_key VARCHAR(128) UNIQUE NOT NULL, -- Format: GT-XXXX-XXXX-XXXX-XXXX
    signed_jwt_token TEXT NOT NULL, -- Cryptographically signed token
    plan_code VARCHAR(32) NOT NULL,
    max_nodes INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    last_verified_at TIMESTAMP WITH TIME ZONE NULL
);

-- 3. BẢNG USERS (Tài khoản người dùng đa tầng RBAC)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    full_name VARCHAR(128) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(128) NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'clan_admin', 'branch_admin', 'verified_member', 'guest') DEFAULT 'guest',
    branch_id VARCHAR(36) NULL, -- Thuộc Chi họ nào
    linked_member_id VARCHAR(36) NULL, -- Liên kết với Node thành viên nào trên cây
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_tenant_phone UNIQUE(tenant_id, phone)
);

CREATE INDEX idx_users_tenant_role ON users(tenant_id, role);

-- 4. BẢNG MEMBERS (Cây phả hệ con cháu dòng họ)
CREATE TABLE members (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id VARCHAR(36) NULL, -- Chi họ
    full_name VARCHAR(128) NOT NULL,
    courtesy_name VARCHAR(128) NULL, -- Tên tự / Tên hiệu
    gender ENUM('male', 'female', 'other') DEFAULT 'male',
    generation_number INT NOT NULL, -- Đời thứ mấy (1, 2, 3...)
    birth_order INT DEFAULT 1, -- Con thứ mấy trong nhà
    
    father_id VARCHAR(36) NULL REFERENCES members(id) ON DELETE SET NULL,
    mother_id VARCHAR(36) NULL REFERENCES members(id) ON DELETE SET NULL,
    spouse_ids JSONB DEFAULT '[]'::jsonb, -- Mảng ID các người phối ngẫu
    
    is_alive BOOLEAN DEFAULT TRUE,
    birth_date_lunar VARCHAR(32) NULL, -- VD: 15/08 Giáp Thân
    birth_date_solar DATE NULL,
    death_date_lunar VARCHAR(32) NULL, -- Ngày giỗ âm lịch
    death_date_solar DATE NULL,
    
    avatar_url VARCHAR(512) NULL,
    phone VARCHAR(20) NULL,
    current_residence VARCHAR(255) NULL,
    bio_notes TEXT NULL, -- Phả ký, chức tước, công trạng
    tomb_id VARCHAR(36) NULL, -- Liên kết vị trí mộ phần
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_members_tenant_gen ON members(tenant_id, generation_number);
CREATE INDEX idx_members_father ON members(father_id);
CREATE INDEX idx_members_tenant_name ON members(tenant_id, full_name);

-- 5. BẢNG TOMBS (Bản đồ Lăng mộ & Từ đường GPS)
CREATE TABLE tombs (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address_description TEXT NOT NULL,
    tomb_type ENUM('ancestral_altar', 'tomb', 'monument', 'shrine') DEFAULT 'tomb',
    photos JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. BẢNG FINANCES (Sổ quỹ & Bảng vàng công đức)
CREATE TABLE finances (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id VARCHAR(36) NULL,
    type ENUM('income', 'expense') NOT NULL,
    category VARCHAR(64) NOT NULL, -- vd: Tiền Giỗ Tổ, Xây Mộ, Khuyến học
    amount DECIMAL(15, 2) NOT NULL,
    actor_name VARCHAR(128) NOT NULL, -- Người nộp / Người chi
    invoice_image_url VARCHAR(512) NULL,
    transaction_date DATE NOT NULL,
    note TEXT NULL,
    created_by_user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. BẢNG ALBUMS & POSTS (Tin tức, Kỷ yếu & Di tích)
CREATE TABLE posts (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    content_html TEXT NOT NULL,
    category ENUM('history', 'news', 'event', 'memorial') DEFAULT 'news',
    thumbnail_url VARCHAR(512) NULL,
    media_gallery JSONB DEFAULT '[]'::jsonb,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 5.2. Danh mục API Endpoints Cốt lõi

| Phương thức | Endpoint | Phân quyền | Mô tả chức năng |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Public | Đăng nhập (JWT trả về trong HttpOnly Cookie) |
| `POST` | `/api/v1/auth/verify-member` | Guest/Member | Xác thực con cháu để mở khóa xem SĐT & Sổ quỹ |
| `GET` | `/api/v1/tenant/public-info` | Public | Lấy cấu hình branding, tên dòng họ theo Subdomain/Host |
| `POST` | `/api/v1/orders/checkout` | Public | Tạo đơn hàng mua License & sinh mã VietQR động |
| `POST` | `/api/v1/orders/webhook/casso` | Webhook Auth | Nhận thông báo tiền vào bank -> Tự kích hoạt License & Site |
| `GET` | `/api/v1/tree/nodes` | Public/Member | Lấy toàn bộ cây gia phả (kèm cache Redis) |
| `POST` | `/api/v1/tree/nodes` | Clan Admin | Thêm mới thành viên vào cây gia phả |
| `PUT` | `/api/v1/tree/nodes/:id` | Clan Admin | Cập nhật thông tin/quan hệ thành viên |
| `POST` | `/api/v1/tree/import-excel` | Clan Admin | Upload file Excel phả hệ, kiểm tra vòng lặp DAG và nạp dữ liệu |
| `GET` | `/api/v1/tree/export-gedcom` | Clan Admin | Xuất file chuẩn phả hệ quốc tế GEDCOM |
| `GET` | `/api/v1/tombs` | Public | Lấy danh sách tọa độ lăng mộ cho bản đồ vệ tinh |
| `GET` | `/api/v1/finances` | Verified Member | Xem sổ quỹ thu chi và danh sách công đức |
| `POST` | `/api/v1/zns/send-campaign` | Clan Admin | Gửi tin nhắn Zalo thông báo giỗ tổ theo danh sách lọc |
| `POST` | `/api/v1/ai/kinship-query` | Public/Member | Hỏi trợ lý AI về quan hệ xưng hô họ hàng |

### 5.3. License Issuance & Verification Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Khách Hàng (Trưởng họ)
    participant Web as Portal giatoc.online
    participant Backend as Node.js Core Backend
    participant Bank as Cổng VietQR / Webhook
    participant DB as Database & Redis
    participant Mail as Service Email / Zalo

    User->>Web: Chọn Gói Tiêu Chuẩn (1.290.000đ) & Nhập Subdomain 'nguyenduy'
    Web->>Backend: POST /api/v1/orders/checkout
    Backend->>DB: Kiểm tra tính khả dụng của slug & tạo Order tạm (Pending)
    Backend-->>Web: Trả về Mã QR VietQR động (Chứa số tiền & Cú pháp: GT8923)
    User->>Bank: Quét mã VietQR trên App Ngân hàng & Chuyển tiền 24/7
    Bank->>Backend: POST /api/v1/orders/webhook (Số tiền: 1.290.000đ, Nội dung: GT8923)
    Backend->>Backend: Xác thực chữ ký Webhook & Kiểm tra số tiền
    Backend->>DB: Tạo Tenant 'nguyenduy', Tạo Super Admin Dòng Họ, Sinh License Key
    Backend->>Backend: Ký số Cryptographic JWT License Token
    Backend->>Mail: Gửi Email / Zalo ZNS chứa License Key & Thông tin Đăng nhập
    Backend-->>Bank: 200 OK
    Web->>Web: Webhook socket báo thành công -> Chuyển sang Màn hình Chúc mừng & Onboarding
```

### 5.4. Mẫu JSON Request & Response Cấp License

#### Request: Khởi tạo Đơn hàng Mua License
```json
{
  "plan_tier": "standard",
  "clan_slug": "nguyenduy",
  "clan_name": "Dòng Họ Nguyễn Duy (Hà Nam)",
  "contact_name": "Nguyễn Duy Tuấn",
  "contact_phone": "0912345678",
  "contact_email": "tuan.nguyenduy@gmail.com",
  "billing_cycle_years": 1
}
```

#### Response: Trả về Mã Thanh toán VietQR Động
```json
{
  "status": "success",
  "data": {
    "order_id": "ord_8f93a102bc4",
    "amount": 1290000,
    "currency": "VND",
    "order_code": "GT8923",
    "account_name": "CONG TY CONG NGHE GIA TOC ONLINE",
    "account_number": "19038291039012",
    "bank_name": "Techcombank",
    "qr_quicklink": "https://img.vietqr.io/image/TCB-19038291039012-compact2.png?amount=1290000&addInfo=GT8923&accountName=CONG%20TY%20GIA%20TOC%20ONLINE",
    "expires_at": "2026-08-31T13:30:00Z"
  }
}
```

#### Webhook Auto-Provisioning Output: Cấp License Thành công
```json
{
  "event": "tenant.provisioned",
  "tenant_id": "ten_7a8109f1e2",
  "clan_name": "Dòng Họ Nguyễn Duy (Hà Nam)",
  "subdomain_url": "https://nguyenduy.giatoc.online",
  "license": {
    "license_key": "GT-STD-2026-89AF-734B",
    "plan_tier": "standard",
    "max_members": 1500,
    "max_storage_mb": 10240,
    "issued_at": "2026-08-31T13:05:00Z",
    "expires_at": "2027-08-31T13:05:00Z",
    "token_signature": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "admin_account": {
    "username": "0912345678",
    "temporary_password": "GT#" + "8f3A!92d",
    "login_url": "https://nguyenduy.giatoc.online/admin"
  }
}
```

---

## 6. ĐỀ XUẤT STACK & KIẾN TRÚC TRIỂN KHAI TRÊN ANTIGRAVITY

### 6.1. Chi tiết Tech Stack Đề xuất

```text
+-----------------------------------------------------------------------------------+
| FRONTEND LAYER: Next.js 15 (App Router) / React 19 + Tailwind CSS v4 + Canvas SVG |
| - Tối ưu SSR/SSG cho SEO bài viết lịch sử dòng họ & Tải tĩnh cực nhanh             |
| - Virtualized Canvas Renderer cho cây phả hệ hàng chục nghìn thành viên           |
| - Zustand cho Client State & TanStack Query cho Real-time Cache                   |
+-----------------------------------------------------------------------------------+
                                         │  HTTPS / HTTP3 + Cloudflare CDN Edge
+-----------------------------------------------------------------------------------+
| API GATEWAY & REVERSE PROXY: Caddy Server v2 / Nginx Ingress                       |
| - Tự động cấp chứng chỉ SSL Let's Encrypt Wildcard (*.giatoc.online)              |
| - Dynamic Domain Routing: Bắt subdomain trỏ đúng Tenant Context                   |
| - WAF, DDoS Protection, Rate Limiting 100 req/min/IP                              |
+-----------------------------------------------------------------------------------+
                                         │  Fast Unix Socket / Internal Network
+-----------------------------------------------------------------------------------+
| BACKEND CORE LAYER: Node.js (TypeScript + Fastify / NestJS)                       |
| - Fastify High-throughput HTTP Engine (>30,000 req/sec)                           |
| - DAG Cycle Validation Engine (Kiểm tra đồ thị chống đệ quy lặp vô tận)          |
| - VietQR & Bank Webhook Processor (Idempotent Transaction Handling)               |
| - Gemini AI Client (Giải phẫu quan hệ xưng hô & Dịch Hán Nôm)                     |
+-----------------------------------------------------------------------------------+
                    │                                             │
+------------------------------------+       +------------------------------------+
| DATABASE: PostgreSQL 16 (Drizzle)  |       | CACHE & QUEUE: Redis 7 (BullMQ)    |
| - Shared DB Multi-Tenant Schema    |       | - Caching Cây Phả Hệ JSON          |
| - Row Level Security (RLS)         |       | - Hàng đợi gửi Zalo ZNS / Email    |
| - JSONB hỗ trợ linh hoạt quan hệ   |       | - Worker xuất PDF Kỷ yếu in ấn     |
+------------------------------------+       +------------------------------------+
                                         │
+-----------------------------------------------------------------------------------+
| OBJECT STORAGE: Cloudflare R2 / S3-Compatible + WebP Optimization Pipeline         |
+-----------------------------------------------------------------------------------+
```

### 6.2. Lý do lựa chọn & So sánh Ưu / Nhược điểm

| Công nghệ | Lý do chọn | Ưu điểm vượt trội | Nhược điểm & Giải pháp khắc phục |
| :--- | :--- | :--- | :--- |
| **Next.js 15 + React 19** | Trải nghiệm mượt như Native App, hỗ trợ SSR cực tốt cho SEO | Load trang dưới 0.8s, tối ưu di động tuyệt đối, linh hoạt nhân bản template | Cần build tối ưu -> Tách riêng Static Export cho trang Template vệ tinh |
| **Node.js (Fastify TS)** | Tốc độ xử lý I/O cực cao, tương thích hoàn hảo với JSON | Xử lý hàng nghìn Webhook đồng thời, dễ mở rộng micro-workers | Cần viết Types chặt chẽ để đảm bảo toàn vẹn dữ liệu |
| **PostgreSQL 16** | Hệ quản trị CSDL quan hệ mạnh nhất thế giới, hỗ trợ JSONB | Xử lý đệ quy cây gia phả với Recursive CTE siêu nhanh | Cần lập index chuyên sâu trên `tenant_id` và `generation_number` |
| **Caddy Server v2** | Quản lý chứng chỉ SSL tự động 100% cho mọi Custom Domain | Tự động phát hành SSL khi khách hàng gắn tên miền riêng | Cần cấu hình On-Demand TLS an toàn |

### 6.3. Hướng dẫn Triển khai Tối ưu trên Nền tảng Antigravity

Hạ tầng Antigravity cung cấp môi trường Container hóa hiện đại, hỗ trợ orchestration mượt mà và quản lý tài nguyên linh hoạt.

#### 1. Cấu trúc Thư mục Triển khai Chuẩn (Directory Structure)
```text
/opt/giatoc-online/
├── docker-compose.prod.yml
├── Caddyfile
├── .env.production
├── apps/
│   ├── portal-web/        # Landing page & Checkout (Next.js)
│   ├── tenant-template/   # Template Web Dòng họ (React/Next)
│   └── api-core/          # Backend API & Webhooks (Node.js TS)
├── services/
│   ├── redis/
│   └── postgres/
└── storage/
    └── uploads/
```

#### 2. Cấu hình Caddyfile Hỗ trợ Wildcard Subdomain & Custom Domains Tự động
```caddy
# Cấu hình On-Demand TLS cho mọi tên miền riêng của khách hàng (hotrandinh.com, ...)
{
    on_demand_tls {
        ask http://api-core:4000/api/v1/tenant/verify-custom-domain
        interval 2m
        burst 5
    }
}

# 1. Trang chủ Portal Bán hàng giatoc.online
giatoc.online, www.giatoc.online {
    encode zstd gzip
    reverse_proxy portal-web:3000
}

# 2. Wildcard Subdomain cho từng dòng họ (*.giatoc.online)
*.giatoc.online {
    encode zstd gzip
    reverse_proxy tenant-template:3001
}

# 3. Custom Domain độc lập của khách hàng mua gói Đại Tộc
:443 {
    tls {
        on_demand
    }
    encode zstd gzip
    reverse_proxy tenant-template:3001
}

# 4. API Backend Gateway
api.giatoc.online {
    encode zstd gzip
    reverse_proxy api-core:4000
}
```

#### 3. Bộ Biến Môi Trường Sản Xuất (`.env.production`)
```bash
NODE_ENV=production
PORT=4000
APP_SECRET=e7c89f1a23b45c678d90ef123456789a0bcdef123456789a

# Database Connection (PostgreSQL Pooling)
DATABASE_URL=postgresql://giatoc_user:SuperSecurePass2026@postgres:5432/giatoc_db?sslmode=disable&connection_limit=30

# Redis Cache & BullMQ
REDIS_URL=redis://:RedisAuthPass2026@redis:6379/0

# VietQR & Bank Webhook Secret
VIETQR_CLIENT_ID=vqr_live_9a8b7c6d5e
VIETQR_API_KEY=key_secret_123456789
CASSO_WEBHOOK_SECURE_TOKEN=casso_secure_hash_897120391283

# Zalo Cloud ZNS Gateway
ZALO_APP_ID=48910293812039
ZALO_SECRET_KEY=zalo_app_secret_live_998
ZALO_OA_ID=1920381029381023

# Google Gemini AI API Key
GEMINI_API_KEY=AIzaSyB_LiveTokenForKinshipAndOCR2026

# Storage / Cloudflare R2
R2_ACCOUNT_ID=d9a8c7b6e5f4a3b2c1
R2_ACCESS_KEY_ID=r2_access_key_live
R2_SECRET_ACCESS_KEY=r2_secret_key_live
R2_BUCKET_NAME=giatoc-production-assets
PUBLIC_ASSET_CDN_URL=https://assets.giatoc.online
```

#### 4. Cơ chế Clone & Khởi tạo Website Dòng Họ trong 30 giây (Zero-Downtime Provisioning)
1. **Routing theo Context**: Nhờ mô hình Multi-tenant Single Application, khi khách hàng truy cập `nguyenduy.giatoc.online` hoặc `hotrandinh.com`, Caddy chuyển request đến `tenant-template`.
2. **Dynamic Tenant Resolver Middleware**: Ứng dụng đọc header `Host`, truy vấn Redis Cache trong 1.5ms để lấy `tenant_id` và bảng màu/logo tùy biến của dòng họ đó.
3. **Không cần deploy lại mã nguồn**: Để nhân bản cho 1000 dòng họ mới, hệ thống chỉ cần thêm 1 bản ghi vào bảng `tenants` trong DB, toàn bộ UI, Cây phả hệ, Bản đồ và Sổ quỹ tự động hiển thị dữ liệu riêng của dòng họ đó ngay lập tức.

---

## 7. CHECKLIST TỐI ƯU SEO & PERFORMANCE

### 7.1. Tối ưu SEO Toàn Diện
- [x] **Dynamic Metadata & OpenGraph**: Tự động sinh thẻ `<title>`, `<meta name="description">` và ảnh đại diện Facebook/Zalo banner (OG Image) động chứa tên dòng họ và huy hiệu truyền thống.
- [x] **Structured Data (Schema.org JSON-LD)**:
  - Khai báo schema `SoftwareApplication` và `Product` trên trang chủ `giatoc.online` kèm bảng giá và đánh giá sao (AggregateRating).
  - Khai báo schema `Organization` và `FAQPage` cho các câu hỏi thường gặp.
- [x] **Sitemap Index XML**: Tự động sinh `sitemap.xml` và `robots.txt` cho portal chính và từng website dòng họ vệ tinh.
- [x] **Thân thiện SEO Ngữ Nghĩa (Semantic HTML5)**: Cấu trúc rõ ràng `<header>`, `<main>`, `<section>`, `<article>`, `<footer>` với thẻ `<h1>` duy nhất cho mỗi trang.

### 7.2. Tối ưu Hiệu Năng & Core Web Vitals (Mục tiêu LCP < 1.2s, INP < 100ms, CLS = 0)
- [x] **Next-Gen Image Pipeline**: Chuyển đổi toàn bộ ảnh tải lên thành định dạng `.webp` và `.avif`, tự động nén dung lượng và tạo các kích thước responsive (Thumbnail, Medium, Full-HD).
- [x] **Canvas Virtualization cho Cây Phả Hệ**: Chỉ render các node nằm trong khung nhìn (Viewport) của người dùng, giúp cây có 10.000 thành viên vẫn cuộn mượt mà ở tần số quét 60fps/120fps.
- [x] **Critical CSS & Font Subsetting**: Tải trước (Preload) các font chữ quan trọng (`Be Vietnam Pro`, `Playfair Display`), chỉ nạp tập ký tự tiếng Việt để giảm 70% dung lượng font.
- [x] **Edge Caching**: Thiết lập HTTP Caching Headers (`stale-while-revalidate`) trên Cloudflare CDN cho các tài nguyên tĩnh và dữ liệu phả hệ công khai.

---

## 8. CHECKLIST BẢO MẬT & VẬN HÀNH

### 8.1. Ma trận Bảo mật 5 Lớp

```text
[LỚP 1: CLOUDFLARE WAF & EDGE FIREWALL] ──> Chặn DDoS, Botnet, SQL Injection, XSS
   │
[LỚP 2: REVERSE PROXY CADDY & RATE LIMITING] ──> Giới hạn 100 req/phút, Khóa IP bất thường
   │
[LỚP 3: JWT AUTH & 5-TIER RBAC GATEWAY] ──> Xác thực danh tính, phân quyền Trưởng họ/Chi họ
   │
[LỚP 4: PRIVACY GATEKEEPER & DATA MASKING] ──> Ẩn số ĐT, địa chỉ cá nhân con cháu
   │
[LỚP 5: DATABASE ENCRYPTION & DAG CYCLE GUARD] ──> Mã hóa mật khẩu Argon2id, chống loop cây
```

### 8.2. Các Biện pháp Bảo vệ Thực thi Cụ thể
1. **Privacy Phone Reveal Gatekeeper**:
   - Mặc định ẩn số điện thoại con cháu (hiển thị dạng `0912***678`).
   - Khách muốn xem số đầy đủ phải nhấn "Xác thực con cháu trong họ" (Nhập đúng thông tin cha/mẹ hoặc được Admin phê duyệt). Mỗi lượt xem số điện thoại đều được ghi log kiểm toán (`audit_logs`).
2. **Whitelist File Upload Chặt Chẽ**:
   - Chỉ chấp nhận các định dạng ảnh `.jpg`, `.jpeg`, `.png`, `.webp`.
   - **Tuyệt đối cấm tải lên file `.svg`** hoặc file thực thi để ngăn chặn hoàn toàn nguy cơ Stored XSS và chèn mã độc.
3. **DAG (Directed Acyclic Graph) Cycle Validator**:
   - Khi Admin thêm thành viên hoặc nạp file Excel, thuật toán phát hiện chu trình đồ thị sẽ quét đệ quy. Nếu phát hiện ông cố nội lại là con của chắt đích tôn (vòng lặp vô tận), hệ thống sẽ từ chối nạp và cảnh báo ngay lập tức.
4. **Bảo vệ Token & License Key**:
   - Sử dụng thuật toán ký bất đối xứng **RSA-256 (RS256)** để sinh JWT License Token. Mã nguồn web con chỉ giữ Public Key để xác thực, không thể tự sinh license giả mạo.

### 8.3. Quy trình Sao lưu & Giám sát Hệ thống (Backup & Monitoring)
- **Tự động Backup CSDL hàng ngày**: Cron Job chạy lúc 02:00 AM mỗi ngày, xuất bản sao lưu dạng `pg_dump` nén mã hóa GPG và đồng bộ lên Cloudflare R2 Remote Storage (Lưu trữ 30 ngày gần nhất).
- **Giám sát & Cảnh báo Sentry / UptimeRobot**: Theo dõi 24/7 tình trạng phản hồi của máy chủ, tự động gửi thông báo Telegram cho đội ngũ kỹ thuật khi có lỗi ngoại lệ hoặc độ trễ phản hồi vượt quá 2000ms.

---

## 9. FLOW BÁN HÀNG, AUTO-PROVISIONING & ONBOARDING

### 9.1. Trải nghiệm Khách hàng 6 Bước Liền Mạch

```text
[BƯỚC 1: TRANG CHỦ GIATOC.ONLINE]
Khách xem bảng giá -> Bấm [ Dùng Thử Demo ] hoặc [ Mua Ngay ]
        │
[BƯỚC 2: KIỂM TRA SUBDOMAIN & NHẬP THÔNG TIN]
Nhập tên dòng họ: "Họ Nguyễn Duy" -> Gợi ý slug: nguyenduy.giatoc.online (Hệ thống check khả dụng)
        │
[BƯỚC 3: QUÉT MÃ VIETQR ĐỘNG 24/7]
Màn hình hiện mã VietQR chính xác số tiền & nội dung -> Khách mở app ngân hàng quét mã
        │
[BƯỚC 4: AUTO-PROVISIONING TRONG 30 GIÂY]
Hệ thống nhận tiền -> Tự sinh Tenant, Cấp License, Tạo tài khoản Admin -> Bắn pháo hoa màn hình
        │
[BƯỚC 5: ONBOARDING WIZARD 3 BƯỚC]
Bước 1: Chọn màu chủ đạo dòng họ -> Bước 2: Nhập cụ Thủy Tổ (Đời 1) -> Bước 3: Tải file Excel mẫu
        │
[BƯỚC 6: BÀN GIAO & GIA NHẬP ZALO VIP]
Nhận Email + Tin nhắn Zalo xác nhận -> Tham gia nhóm Zalo Hỗ trợ Trưởng họ độc quyền
```

### 9.2. Bộ Email Mẫu Chuyên Nghiệp (HTML Email Templates)

#### Template 1: Email Chào Mừng & Bàn Giao License Key
```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8f5ee; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2d9c8; overflow: hidden; }
  .header { background: #0f172a; padding: 30px; text-align: center; color: #ffffff; }
  .header h1 { margin: 0; font-size: 24px; color: #f59e0b; }
  .content { padding: 30px; color: #334155; line-height: 1.6; }
  .license-box { background: #fdfbf7; border: 2px dashed #d97706; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
  .license-key { font-family: monospace; font-size: 20px; font-weight: bold; color: #881337; letter-spacing: 2px; }
  .btn { display: inline-block; background: #881337; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 9999px; font-weight: bold; margin-top: 15px; }
  .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>GIA TỘC ONLINE</h1>
      <p style="margin: 5px 0 0; color: #cbd5e1;">Nền Tảng Số Hóa & Quản Trị Gia Tộc Toàn Diện</p>
    </div>
    <div class="content">
      <p>Kính gửi Quý Trưởng ban <strong>{{contact_name}}</strong>,</p>
      <p>Ban Quản Trị <strong>Gia Tộc Online</strong> xin chân thành cảm ơn Quý dòng họ <strong>{{clan_name}}</strong> đã tin tưởng lựa chọn nền tảng của chúng tôi để gìn giữ gia bảo và kết nối huyết thống tổ tiên.</p>
      <p>Website và bản quyền dịch vụ của dòng họ đã được khởi tạo thành công:</p>
      
      <div class="license-box">
        <div style="font-size: 13px; color: #64748b; text-transform: uppercase;">Mã Khóa Bản Quyền (License Key)</div>
        <div class="license-key">{{license_key}}</div>
        <div style="font-size: 12px; color: #059669; margin-top: 5px;">✓ Đã kích hoạt gói {{plan_name}} (Hạn dùng: {{expires_at}})</div>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Địa chỉ Website:</td>
          <td style="padding: 8px 0; font-weight: bold;"><a href="{{subdomain_url}}" style="color: #0284c7;">{{subdomain_url}}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Tài khoản Quản trị:</td>
          <td style="padding: 8px 0; font-weight: bold;">{{contact_phone}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Mật khẩu khởi tạo:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #881337;">{{temp_password}}</td>
        </tr>
      </table>
      
      <div style="text-align: center;">
        <a href="{{subdomain_url}}/admin" class="btn">Truy Cập Trang Quản Trị Ngay</a>
      </div>
    </div>
    <div class="footer">
      Tổng đài hỗ trợ kỹ thuật & Zalo: 09xx.xxx.xxx | Email: hotro@giatoc.online<br>
      © 2026 Gia Tộc Online. Trường tồn cùng thời gian.
    </div>
  </div>
</body>
</html>
```

---

## 10. MẪU TRANG TEMPLATE DÒNG HỌ CLONE (DỰA TRÊN HOTRANDINH.COM)

Website dòng họ mẫu được kế thừa toàn bộ cấu trúc hoàn thiện từ `hotrandinh.com` nhưng được tối ưu hóa giao diện phẳng, tải cực nhanh và dễ tùy biến thương hiệu:

### 10.1. Cấu trúc Component Mẫu
1. **Header & Thanh Điều Hướng Dòng Họ**: Logo huy hiệu dòng họ, Tên Chi Phái, Menu: Trang Chủ, Phả Hệ Tương Tác, Con Cháu, Lăng Mộ GPS, Sổ Quỹ, Kỷ Yếu & Hoạt Động, Nén Nhang Số, Nút "Đăng Nhập Con Cháu".
2. **Hero Section Trang Trọng**: Ảnh nền nhà thờ họ / từ đường trang nghiêm, Lời tựa tộc biểu (vd: *"Cây có cội mới trổ cành xanh lá - Nước có nguồn mới bủa khắp rạch sông"*), nút [ Khám Phá Cây Phả Hệ ].
3. **Phần Phả Ký & Lịch Sử Thế Hệ (Ancestry Timeline)**: Tóm tắt nguồn gốc cụ Thủy Tổ lập nghiệp, các mốc lịch sử di dời chi phái.
4. **Phần Cây Phả Hệ Tương Tác Trực Tuyến**: Widget phóng to thu nhỏ, tìm kiếm nhanh con cháu.
5. **Bản Đồ Lăng Mộ Vệ Tinh (GPS Satellite Map)**: Tích hợp OpenStreetMap/Leaflet hiển thị tọa độ lăng mộ cụ Tổ, nhà thờ các chi, có nút bấm mở Google Maps dẫn đường.
6. **Sổ Quỹ Thu Chi & Bảng Vàng Công Đức**: Liệt kê các khoản quyên góp xây dựng từ đường và chi tiêu ngày giỗ minh bạch.
7. **Bàn Thờ Số & Không Gian Tưởng Niệm**: Con cháu xa quê thắp nén nhang số, gửi lời chúc nguyện tưởng nhớ ngày giỗ.
8. **Chân Trang (Footer)**: Thông tin Ban Liên Lạc, Địa chỉ Từ Đường, Bản quyền website.

### 10.2. Cơ chế Import/Export Preset Dòng Họ Mẫu (1-Click Clan Cloner)
File cấu hình dòng họ mẫu được đóng gói dạng JSON chuẩn (`preset_template.json`):
```json
{
  "theme": {
    "primary_color": "#881337",
    "accent_color": "#d97706",
    "bg_style": "parchment",
    "crest_icon": "bronze_drum"
  },
  "clan_profile": {
    "clan_name": "Dòng Họ Trần Đình",
    "branch_title": "Chi Trưởng — Phái Nhất Tiên Điền",
    "ancestral_hall_address": "Xã Nghi Xuân, Tỉnh Hà Tĩnh",
    "motto": "Uống nước nhớ nguồn — Vạn đời hưng thịnh"
  },
  "default_modules": {
    "family_tree": true,
    "tomb_map": true,
    "finance_book": true,
    "digital_altar": true,
    "yearbook_news": true
  }
}
```

---

## 11. PROTOTYPE, ASSETS & HƯỚNG DẪN ĐỒ HỌA

### 11.1. Danh mục Assets Đồ Họa Cần Thiết
- **Họa tiết Truyền thống (Vector SVG)**:
  - Hoa văn Trống Đồng Đông Sơn cách điệu (Làm mờ nền Header).
  - Họa tiết Mây Cổ Lạc Long & Vân Mây Thời Lê (Dùng làm dải phân cách Section Divider).
  - Khung viền góc gia bảo chạm vàng (Card Corner Ornaments).
- **Bộ Icon Chuyên Dụng (Lucide Icons Customization)**:
  - `TreePine` / `GitBranch`: Biểu tượng Cây phả hệ.
  - `MapPin` / `Navigation`: Tọa độ Lăng mộ GPS.
  - `ShieldCheck` / `KeyRound`: Xác thực con cháu & RBAC.
  - `Flame` / `Sparkles`: Bàn thờ số & Nén nhang tri ân.
  - `BookOpen`: Sách phả ký & Kỷ yếu di tích.
- **Lottie Animations Tương tác**:
  - `incense-smoke.json`: Làn khói nhang bay nhẹ nhàng trang nghiêm ở mục Tưởng niệm.
  - `tree-grow.json`: Hiệu ứng cây phả hệ đâm chồi nảy lộc khi tải trang.
  - `payment-success.json`: Hiệu ứng pháo hoa mừng kích hoạt license thành công.

### 11.2. Hướng dẫn Phong cách Ảnh (Heritage Photography Style Guide)
- Tone màu ảnh: Ấm áp (Warm Color Temperature +10), Độ tương phản vừa phải, tôn vinh nét cổ kính của nhà thờ họ và sự gắn kết sum vầy của các thế hệ con cháu.
- Tránh ảnh quá chói hoặc lạm dụng đồ họa 3D hiện đại làm mất đi sự trang nghiêm, tôn kính của sản phẩm văn hóa gia tộc.

---

## 12. HỆ THỐNG CHỈ SỐ KPI & KẾ HOẠCH A/B TESTING

### 12.1. Các Chỉ số Hiệu quả Chính (Core SaaS KPIs)
1. **Landing Page Conversion Rate (CVR 1)**: Số lượt xem Landing Page $\rightarrow$ Click vào "Dùng Thử Demo" (Mục tiêu $\ge 35\%$).
2. **Demo to Checkout Conversion Rate (CVR 2)**: Khách trải nghiệm Demo $\rightarrow$ Bấm "Mua Gói / Tạo Web Dòng Họ" (Mục tiêu $\ge 8.5\%$).
3. **Checkout Success Rate**: Số người quét mã VietQR thành công trên tổng số đơn khởi tạo (Mục tiêu $\ge 78\%$).
4. **Time to First Tree Node (Onboarding Speed)**: Thời gian từ lúc nhận tài khoản đến khi tạo được node phả hệ đầu tiên (Mục tiêu $\le 3$ phút).
5. **Annual License Retention Rate (Gia hạn hàng năm)**: Tỷ lệ dòng họ tái tục license năm tiếp theo (Mục tiêu $\ge 92\%$).

### 12.2. Kế hoạch 3 Thử nghiệm A/B Testing Chuyển đổi Cao

| Vị trí thử nghiệm | Phiên bản A (Original) | Phiên bản B (Test Variant) | Giả thuyết cải thiện |
| :--- | :--- | :--- | :--- |
| **Hero Section** | Tiêu đề tập trung vào "Công nghệ phần mềm quản lý gia tộc 4.0" | Tiêu đề tập trung vào "Gìn giữ gia phả cho con cháu muôn đời & Tìm về cội nguồn" | Phiên bản B đánh vào lòng hiếu thảo và cảm xúc văn hóa sẽ tăng **25%** tỷ lệ click CTA |
| **Pricing Table** | Chỉ hiển thị giá thuê bao hàng năm (590k/năm, 1.290k/năm) | Bổ sung thêm tùy chọn gói "Trọn Đời / 5 Năm Gia Tộc Vĩnh Cửu" kèm quà tặng in sách kỷ yếu | Tăng giá trị trung bình trên một đơn hàng (AOV) lên **140%** đối với các họ lớn |
| **CTA Checkout** | Form nhập liệu 6 trường trước khi quét mã | Nhập nhanh duy nhất SĐT & Tên dòng họ -> Hiện ngay mã VietQR (Điền thông tin chi tiết sau) | Giảm tỷ lệ bỏ giỏ hàng (Cart Drop-off) xuống **40%** |

---

## 13. KẾ HOẠCH CHUYỂN GIAO DEV & QA CHECKLIST

### 13.1. Phân bổ Công việc theo 4 Sprints (Lộ trình 8 Tuần)

```mermaid
gantt
    title LỘ TRÌNH PHÁT TRIỂN & TRIỂN KHAI GIATOC.ONLINE (ANTIGRAVITY)
    dateFormat  YYYY-MM-DD
    section Sprint 1 (Tuần 1-2)
    Khởi tạo hạ tầng Antigravity & Docker Caddy     :a1, 2026-09-01, 7d
    Thiết kế Database Multi-Tenant & RBAC Matrix    :a2, after a1, 7d
    section Sprint 2 (Tuần 3-4)
    Xây dựng Component Cây Phả Hệ Tương Tác Canvas :b1, 2026-09-15, 8d
    Bản đồ Lăng mộ GPS, Sổ quỹ & Template Dòng họ  :b2, after b1, 6d
    section Sprint 3 (Tuần 5-6)
    Portal giatoc.online, Bảng giá & Demo Sandbox   :c1, 2026-09-29, 7d
    Tích hợp Cổng VietQR & Auto-Provisioning Engine :c2, after c1, 7d
    section Sprint 4 (Tuần 7-8)
    Cổng Tin nhắn Zalo ZNS & AI Kinship Assistant   :d1, 2026-10-13, 6d
    Super Admin Platform, QA Kiểm thử & Go-Live     :d2, after d1, 8d
```

### 13.2. Bảng Phân bổ Nhiệm vụ & Ước tính Thời gian Chi tiết

| Sprint | Hạng mục công việc trọng tâm | Nhân lực | Estimate (Ngày công) | Kết quả bàn giao (Deliverables) |
| :--- | :--- | :---: | :---: | :--- |
| **Sprint 1** | • Cấu hình cụm Antigravity, Caddy Dynamic SSL, Postgres 16, Redis.<br>• Viết Migration Schema & Seed data mẫu.<br>• Xây dựng Auth JWT, Middleware Tenant Resolver & RBAC 5 cấp. | Backend + DevOps | 10 ngày | Hạ tầng Multi-Tenant & API Core Authentication hoàn chỉnh |
| **Sprint 2** | • Lập trình Component Cây phả hệ Zoom/Pan Canvas SVG mượt mà.<br>• Tính năng Import Excel (DAG Cycle Validator) & Export GEDCOM/PDF.<br>• Hoàn thiện các trang: Bản đồ GPS, Sổ quỹ, Bàn thờ số, Tin tức. | Frontend Lead + UI Dev | 12 ngày | Mẫu template web dòng họ (`hotrandinh` standard) chạy độc lập |
| **Sprint 3** | • Xây dựng Landing page Portal `giatoc.online` chuẩn UI Hoàng kim.<br>• Trang Demo Sandbox tương tác không cần đăng nhập.<br>• Tích hợp Webhook VietQR (Casso) tự động sinh Tenant trong 30s. | Full-stack Dev | 10 ngày | Cổng bán hàng, thanh toán tự động & cấp License hoạt động 100% |
| **Sprint 4** | • Tích hợp Zalo Cloud ZNS gửi tin báo giỗ tự động theo chiến dịch.<br>• Tích hợp Gemini AI giải đáp xưng hô họ hàng.<br>• Bảng điều khiển Super Admin quản lý doanh thu, license và tenant.<br>• QA kiểm thử bảo mật, tối ưu SEO, tải trọng và chính thức Go-Live. | Toàn bộ Team | 10 ngày | **Chính thức phát hành Hệ sinh thái SaaS giatoc.online hoàn chỉnh** |

### 13.3. QA Testing Checklist trước khi Go-Live
- [ ] **Kiểm thử Luồng Thanh toán**: Quét thử 10 giao dịch VietQR thật với các ngân hàng khác nhau (Vietcombank, MBBank, Techcombank); đảm bảo Webhook bắt chính xác và kích hoạt site đúng 100%.
- [ ] **Kiểm thử Thuật toán Cây Phả Hệ**: Nạp thử file Excel chứa 2.000 thành viên; kiểm tra tốc độ zoom/pan trên iPhone Safari và Android Chrome; kiểm tra phát hiện lỗi khi cố tình tạo quan hệ vòng lặp cha-con.
- [ ] **Kiểm thử Cổng Riêng Tư (Privacy Gate)**: Đảm bảo số điện thoại con cháu không bao giờ bị lộ trong mã nguồn HTML tĩnh hoặc payload API công khai.
- [ ] **Kiểm thử Tự Động Cấp SSL (On-Demand TLS)**: Trỏ thử 1 Custom Domain thật về IP máy chủ Antigravity, kiểm tra Caddy tự phát hành chứng chỉ Let's Encrypt trong dưới 15 giây.
- [ ] **Kiểm thử Tải trọng (Load Testing)**: Sử dụng k6 hoặc Locust giả lập 500 người dùng đồng thời cuộn xem cây phả hệ; độ trễ phản hồi API luôn duy trì dưới 250ms.

---

> **TỔNG KẾT BÀN GIAO**:  
> Bản thiết kế trên cung cấp đầy đủ bức tranh chiến lược từ tầm nhìn kinh doanh SaaS, trải nghiệm người dùng đỉnh cao, nghệ thuật copywriting kích hoạt cảm xúc truyền thống cho đến kiến trúc kỹ thuật chuẩn mực, sẵn sàng để đội ngũ kỹ sư bắt tay vào phát triển ngay trên nền tảng Antigravity.
