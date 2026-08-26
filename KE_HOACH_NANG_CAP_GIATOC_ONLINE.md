# KẾ HOẠCH TỔNG THỂ NÂNG CẤP HỆ THỐNG
## NỀN TẢNG QUẢN TRỊ GIA TỘC ĐA DÒNG HỌ — GIATOC.ONLINE
*Mô hình SaaS Đa Dòng họ • Tích hợp Node.js & PHP trên Hostinger Business • Tự động hóa VietQR & Zalo ZNS*

---

### THÔNG TIN DỰ ÁN & HẠ TẦNG THỰC TẾ
- **Tên miền chính**: giatoc.online
- **Địa chỉ IP máy chủ Web**: 46.202.186.72 (Hostinger Server 1865, vị trí Châu Á / Sao lưu Singapore)
- **Gói dịch vụ**: **Hostinger Hosting Business**
- **Tài nguyên phần cứng**:
  - Dung lượng đĩa: **50 GB NVMe Storage** (Inode: 600.000)
  - Bộ nhớ RAM: **3.072 MB (3 GB)**
  - Nhân CPU: **2 Cores**
  - Số lượng website hỗ trợ: **50 Websites / Addon Domains**
  - Băng thông: **Không giới hạn**
  - Tác vụ xử lý: **120 quy trình tối đa / 60 tác vụ PHP đồng thời**
- **Môi trường Runtime**:
  - **Node.js**: Hỗ trợ phiên bản **18.x, 20.x, 22.x, 24.x** (Frameworks: Express, Fastify, Hono, NestJS, Next.js, Nitro, Nuxt, Vite...)
  - **PHP / MySQL**: PHP 8.x + MySQL 8.x PDO

---

## CHƯƠNG 1: TỔNG QUAN CHIẾN LƯỢC & MỤC TIÊU DỰ ÁN

Dự án **Gia Tộc Online (giatoc.online)** là bước chuyển đổi mang tính chiến lược: từ một website quản lý gia phả đơn lẻ thành một **NỀN TẢNG SAAS CHUYỂN ĐỔI SỐ GIA TỘC TOÀN DIỆN** tại Việt Nam.

1. **Mô hình Đa Dòng họ (Multi-Tenancy)**: Cho phép hàng trăm dòng họ, chi họ trên cả nước dễ dàng tạo và sở hữu một website gia phả chuyên nghiệp dưới dạng subdomain [slug].giatoc.online hoặc gắn tên miền riêng độc lập (Custom Domain).
2. **Kế thừa Ma trận Phân quyền Chuyên sâu (RBAC Matrix)**: Đầy đủ 5 cấp độ tác nhân (Khách ngoài họ, Con cháu xác thực, Bãi biện theo năm/nhiệm kỳ, Quản trị chi, Quản trị dòng họ lớn).
3. **Môi trường Trải nghiệm Trực quan (Interactive Live Sandbox)**: Màn hình demo sống động với dữ liệu dòng họ mẫu được bảo vệ an toàn, tự động che số điện thoại và thông tin cá nhân.
4. **Tự động hóa Đơn hàng & Thanh toán VietQR**: Tích hợp quét mã VietQR ngân hàng, tự động kích hoạt website trong 30 giây qua Webhook.
5. **Hệ thống Ví tiền & Chiến dịch Tin nhắn Zalo ZNS / SMS Brandname**: Gửi thông báo tự động ngày giỗ tổ, nhắc đóng quỹ họ, vận động công đức, báo tin buồn đến hàng nghìn con cháu qua Zalo với chi phí siêu tiết kiệm.

---

## CHƯƠNG 2: KIẾN TRÚC KỸ THUẬT TỐI ƯU TRÊN HOSTINGER BUSINESS (HYBRID NODE.JS + PHP)

Với tài nguyên **3GB RAM, 2 Cores CPU, 50GB NVMe và hỗ trợ cả Node.js lẫn PHP**, kiến trúc tối ưu nhất là **Mô hình Lai Hiệu năng Cao (Hybrid High-Performance Architecture)**:

- **Frontend**: React 18 SPA build tĩnh (cực nhanh, tải qua CDN/Apache, không tốn RAM máy chủ).
- **Backend API Core**: PHP 8.x PDO truy vấn MySQL, tận dụng 100% logic đã kiểm thử.
- **Node.js Background Service**: Chạy Express/Hono ngầm làm nhiệm vụ:
  - Lắng nghe Webhook VietQR (Casso / SeAPay) tự động tạo web dòng họ khi có tiền vào tài khoản.
  - Hàng đợi (Queue Worker) gửi tin nhắn Zalo ZNS / SMS Brandname.
  - Cron Job tự động tính toán lịch âm, nhắc ngày giỗ tổ và nhắc gia hạn dịch vụ.
  - AI Assistant Service (kết nối Gemini API để giải đáp xưng hô gia tộc và OCR phả ký).

---

## CHƯƠNG 3: BẢNG GIÁ DỊCH VỤ & GÓI THU HÀNG NĂM (SAAS PRICING)

| Tiêu chí | Gói Cơ Bản (Chi nhỏ/Gia đình) | Gói Tiêu Chuẩn (Dòng họ vừa) | Gói Cao Cấp (Dòng họ lớn) | Gói Đại Tộc (Toàn quốc) |
| :--- | :---: | :---: | :---: | :---: |
| **Giá thuê bao hàng năm** | **590.000 đ / năm** | **1.290.000 đ / năm** | **2.490.000 đ / năm** | **4.990.000 đ / năm** |
| **Tên miền sử dụng** | Subdomain riêng [họ].giatoc.online | Subdomain riêng [họ].giatoc.online | **Gắn Tên Miền Riêng** (VD: hotrandinh.com) | **Gắn Tên Miền Riêng** (Hỗ trợ nhiều chi) |
| **Số lượng thành viên** | Dưới **300 người** | Dưới **1.500 người** | Dưới **5.000 người** | **Không giới hạn** |
| **Dung lượng lưu trữ** | **2 GB NVMe** | **10 GB NVMe** | **30 GB NVMe** | **50 GB NVMe** |
| **Tài khoản quản trị** | 2 Tài khoản Admin | 5 Tài khoản Admin | 15 Tài khoản Admin | Không giới hạn |
| **Phân quyền Chi & Bãi biện**| Cơ bản | Đầy đủ theo Chi | Đầy đủ theo Chi & Năm | Đầy đủ đa tầng |
| **Bản đồ lăng mộ & Tài sản** | Có | Có | Có | Có |
| **Tặng tin nhắn Zalo ZNS** | **50 tin ZNS** | **200 tin ZNS** | **500 tin ZNS** | **1.500 tin ZNS** |

---

## CHƯƠNG 4: GIỎ HÀNG, THANH TOÁN TỰ ĐỘNG VIETQR & TỰ ĐỘNG KHỞI TẠO WEB

1. **Bước 1 — Chọn gói & Kiểm tra Subdomain**:
   - Khách hàng nhập tên subdomain mong muốn (VD: 
guyenduy).
   - Hệ thống tự động kiểm tra xem 
guyenduy.giatoc.online đã có ai đăng ký chưa.
   - Nhập thông tin người đại diện (Họ tên, SĐT, Email).
2. **Bước 2 — Quét mã VietQR Động**:
   - Hệ thống tạo Đơn hàng và sinh mã VietQR chuẩn NAPAS 24/7 chứa chính xác số tiền và cú pháp chuyển khoản (VD: GT10892).
3. **Bước 3 — Tự động Kích hoạt (Auto-provisioning trong 30 giây)**:
   - Node.js Webhook nhận tín hiệu thanh toán từ cổng ngân hàng (Casso / SeAPay).
   - Tự động tạo bản ghi 	enant mới, cấp hạn ngạch thành viên, dung lượng lưu trữ và hạn sử dụng 1 năm.
   - Tạo tài khoản Super Admin dòng họ.
4. **Bước 4 — Bàn giao Tức thì**:
   - Hệ thống tự động gửi tin nhắn Zalo ZNS / SMS chứa đường link đăng nhập và mật khẩu khởi tạo cho người đại diện.

---

## CHƯƠNG 5: HỆ THỐNG VÍ TIỀN & CHIẾN DỊCH TIN NHẮN ZALO ZNS

- **Ví tiền Dòng họ**: Nạp tiền tự động qua QR Pay (tối thiểu 100.000 đ/lần). Cước siêu tiết kiệm **350 đ – 500 đ / tin ZNS**.
- **5 Mẫu tin nhắn Zalo ZNS chuẩn duyệt sẵn**:
  - *Mẫu 1*: Thông báo Lễ Giỗ Tổ & Họp Mặt Hàng Năm (kèm lịch âm/dương, địa điểm nhà thờ họ và link bản đồ).
  - *Mẫu 2*: Thông báo Thu Quỹ Họ & Đăng Ký Suất Đinh (kèm số tiền, số tài khoản thủ quỹ và cú pháp chuyển khoản).
  - *Mẫu 3*: Kêu gọi Công Đức Tôn Tạo Từ Đường / Lăng Mộ (kèm link bảng vàng công đức công khai).
  - *Mẫu 4*: Thông báo Tin Buồn (Tang Lễ) (kèm thời gian viếng và vị trí an nghỉ trên bản đồ lăng mộ).
  - *Mẫu 5*: Báo Cáo Tài Chính Thu Chi Minh Bạch (kèm kết quả niên khóa sau kỳ tế họ).
- **Trình tạo Chiến dịch Gửi tin (Campaign Builder)**: Lọc người nhận theo Toàn họ, Theo Chi, Chưa đóng quỹ họ, Theo độ tuổi. Hẹn giờ gửi tự động.

---

## CHƯƠNG 6: BẢNG ĐIỀU KHIỂN SUPER ADMIN NỀN TẢNG & KẾ TOÁN

- **Quản lý Dòng họ (Tenant Management)**: Quản lý danh sách 50+ website dòng họ, trạng thái hoạt động (Active / Expired / Suspended), mức sử dụng tài nguyên (thành viên, dung lượng đĩa).
- **Kế toán Doanh thu**: Thống kê doanh thu thuê bao SaaS, doanh thu nạp ví ZNS, xuất hóa đơn VAT điện tử.
- **Hệ thống Nhắc Gia hạn Tự động**: Tự động gửi tin nhắn Zalo / Email nhắc gia hạn trước 30 ngày, 15 ngày, 7 ngày và 1 ngày cho Trưởng ban dòng họ.
- **Chính sách Ân hạn (Grace Period)**: Cho phép dùng tiếp 15 ngày sau khi hết hạn ở chế độ Read-only trước khi tạm ngưng.

---

## CHƯƠNG 7: CÁC TÍNH NĂNG ĐỘT PHÁ BỔ SUNG

1. **Trợ lý Trí tuệ Nhân tạo (Gia Tộc AI)**:
   - Hỏi đáp quan hệ xưng hô: *'Tôi là Nguyễn Văn A thì gọi cụ Nguyễn Văn B là gì?'* ➡️ AI phân tích cây gia phả và giải thích tường tận vai vế họ hàng.
   - AI OCR Phục chế & Dịch Hán Nôm: Quét ảnh chụp gia phả cổ viết tay/chữ Nho dịch sang Quốc ngữ.
2. **Xuất Sách Kỷ Yếu Gia Phả Đóng Tập**:
   - Tự động xuất file PDF khổ A4/A3 dàn trang sẵn chuẩn in ấn (Lời tựa, Phả ký, Sơ đồ phả hệ dạng quạt/trục, Danh sách thành viên, Bản đồ lăng mộ) để in sách kỷ yếu tặng các chi họ.
3. **Bàn Thờ Số & Không Gian Tưởng Niệm**:
   - Thắp nén nhang số, gửi lời chúc nguyện ngày lễ giỗ dành cho con cháu ở xa quê hương hoặc ở nước ngoài.

---

## CHƯƠNG 8: KẾ HOẠCH BẢO MẬT & VÁ CÁC LỖ HỔNG ĐÃ PHÁT HIỆN

1. **Khóa chặt quyền ghi pi/data.php**: Chỉ cho phép 
ole === 'admin' ghi dữ liệu cây phả hệ chung toàn họ.
2. **Khóa Whitelist đuôi file tải lên (pi/upload.php)**: Chỉ nhận .jpg, .jpeg, .png, .webp, chặn đứng nguy cơ Stored XSS qua file .svg.
3. **Kiểm tra Chu trình Cây (DAG Validation) khi Import Excel**: Chặn đứng nguy cơ treo website vĩnh viễn do vòng lặp cha-con trong file Excel.
4. **Cấu hình đầy đủ HTTP Security Headers**: X-Frame-Options: SAMEORIGIN, X-Content-Type-Options: nosniff, Strict-Transport-Security.

---

## CHƯƠNG 9: LỘ TRÌNH TRIỂN KHAI DỰ ÁN

| Giai đoạn | Hạng mục công việc trọng tâm | Thời gian | Kết quả bàn giao |
| :--- | :--- | :---: | :--- |
| **GIAI ĐOẠN 1** *(Chuẩn hóa Lõi & Multi-Tenancy)* | • Vá 4 lỗi bảo mật.<br>• Nâng cấp DB Engine hỗ trợ 	enant_id.<br>• Cấu hình Wildcard Subdomain trên Hostinger. | Tuần 1 – 2 | Hoàn thành Lõi Multi-Tenant & Bảo mật |
| **GIAI ĐOẠN 2** *(Portal giatoc.online & Thanh toán)* | • Xây dựng Trang chủ Portal giatoc.online & Bảng giá.<br>• Xây dựng Môi trường Demo trực quan.<br>• Tích hợp VietQR Webhook tự động tạo web. | Tuần 3 – 4 | Ra mắt Cổng Bán Hàng & Mua Gói Tự Động |
| **GIAI ĐOẠN 3** *(Ví tiền & Zalo ZNS)* | • Tích hợp API Zalo Cloud ZNS.<br>• Xây dựng Trình tạo Chiến dịch Gửi tin ZNS.<br>• Quản trị Ví tiền dòng họ & Lịch sử cước. | Tuần 5 – 6 | Hoàn thiện Phân hệ Nhắn tin Dòng tộc |
| **GIAI ĐOẠN 4** *(Super Admin & AI Nâng cao)* | • Bảng điều khiển Super Admin & Kế toán.<br>• Hệ thống tự động gửi tin nhắc gia hạn.<br>• Thử nghiệm AI Trợ lý xưng hô dòng tộc. | Tuần 7 – 8 | Chính thức Go-Live Toàn diện Hệ sinh thái |
