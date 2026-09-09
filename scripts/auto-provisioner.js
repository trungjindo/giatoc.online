/**
 * ===========================================================================
 * AUTO-PROVISIONING & VIETQR WEBHOOK ENGINE (NODE.JS DAEMON)
 * Nền tảng: giatoc.online | Tự động hóa 100% quy trình cấp phát website dòng họ
 * Thời gian xử lý: < 30 Giây | Hỗ trợ Idempotency & Zalo ZNS Thông Báo
 * ===========================================================================
 */

const http = require('http');
const https = require('https');
const url = require('url');

// Cấu hình môi trường (Hỗ trợ load từ process.env)
const PORT = process.env.PORT || 3002;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'GT_SECURE_WEBHOOK_KEY_2026';
const PHP_API_BASE = process.env.PHP_API_BASE || 'http://127.0.0.1:80/api';
const ZALO_ZNS_TOKEN = process.env.ZALO_ZNS_TOKEN || 'MOCK_ZNS_ACCESS_TOKEN';

// Bộ nhớ đệm Idempotency trong RAM (tránh race-condition trước khi DB kịp lưu)
const processedTransactionIds = new Set();

/**
 * 1. Hàm sinh URL VietQR Động chuẩn Napas247
 * @param {string} bankCode Mã ngân hàng (MB, VCB, TCB, ACB...)
 * @param {string} accountNumber Số tài khoản nhận
 * @param {string} accountName Tên chủ tài khoản
 * @param {number} amount Số tiền chính xác
 * @param {string} orderCode Mã đơn hàng (Cú pháp chuyển khoản: GT10839)
 * @returns {string} URL ảnh QR chuẩn VietQR
 */
function generateVietQR(bankCode, accountNumber, accountName, amount, orderCode) {
  const encName = encodeURIComponent(accountName.trim());
  return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${orderCode}&accountName=${encName}`;
}

/**
 * 2. Hàm gửi tin nhắn Zalo ZNS thông báo kích hoạt website dòng họ
 * @param {string} phone Số điện thoại Trưởng ban liên lạc
 * @param {object} clanInfo Thông tin dòng họ & tài khoản
 */
async function sendZaloZNSTemplate(phone, clanInfo) {
  console.log(`[ZNS Service] 📤 Đang gửi Zalo ZNS thông báo kích hoạt tới SĐT: ${phone}...`);

  const payload = {
    phone: phone.replace(/^0/, '84'),
    template_id: '329182', // Mã Template ZNS đã được Zalo duyệt
    template_data: {
      ten_dong_ho: clanInfo.clanName,
      ten_mien: clanInfo.domain,
      tai_khoan: clanInfo.adminUsername,
      mat_khau: 'Mật khẩu quý vị đã thiết lập khi đăng ký',
      thoi_gian_kich_hoat: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
      hotline_ho_tro: '0912.345.678'
    },
    tracking_id: `gt_prov_${Date.now()}`
  };

  // Trong môi trường Production: Gửi HTTP POST tới Zalo OpenAPI
  // Trong môi trường Dev / Test: Mô phỏng thành công
  if (process.env.NODE_ENV === 'production' && ZALO_ZNS_TOKEN !== 'MOCK_ZNS_ACCESS_TOKEN') {
    try {
      const res = await fetch('https://business.openapi.zalo.me/message/template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': ZALO_ZNS_TOKEN
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      console.log(`[ZNS Service] ✅ Đã gửi Zalo ZNS thành công:`, data);
      return data;
    } catch (err) {
      console.error(`[ZNS Service] ❌ Lỗi khi gọi Zalo ZNS API:`, err.message);
      return { error: err.message };
    }
  } else {
    console.log(`[ZNS Service Mock] ✅ Đã phát tin ZNS mô phỏng thành công tới ${phone} (Template: THONG_BAO_KICH_HOAT_WEB)`);
    return { error: 0, message: 'Mock Success' };
  }
}

/**
 * 3. Hàm gọi API nội bộ kích hoạt Tenant và nạp dữ liệu mẫu
 */
async function executeAutoProvisioning(orderCode, transactionId, amount) {
  const startTime = Date.now();
  console.log(`[Auto-Provisioner] 🚀 Bắt đầu quy trình cấp phát website cho đơn hàng: ${orderCode}...`);

  // Gọi trực tiếp endpoint confirm_payment nội bộ trong PHP Core Backend
  const confirmUrl = `${PHP_API_BASE}/orders.php?action=confirm_payment`;

  const response = await fetch(confirmUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Internal-Secret': WEBHOOK_SECRET,
      'Authorization': 'Bearer SYSTEM_INTERNAL_PROVISIONER_TOKEN'
    },
    body: JSON.stringify({
      orderCode: orderCode,
      transactionId: transactionId,
      paidAmount: amount,
      autoProvisioned: true
    })
  });

  const result = await response.json();
  const elapsedMs = Date.now() - startTime;

  if (!response.ok || !result.success) {
    throw new Error(result.error || `Lỗi HTTP ${response.status} khi tạo Tenant`);
  }

  console.log(`[Auto-Provisioner] ✨ Website dòng họ "${result.tenant.clanName}" đã khởi tạo thành công trong ${elapsedMs}ms!`);
  console.log(`[Auto-Provisioner] 🌐 Đường dẫn truy cập: ${result.tenant.accessUrl}`);

  // Gửi thông báo Zalo ZNS cho Trưởng họ
  if (result.tenant && result.order) {
    await sendZaloZNSTemplate(result.order.admin_phone, {
      clanName: result.tenant.clanName,
      domain: result.tenant.accessUrl,
      adminUsername: result.tenant.adminUsername
    });
  }

  return {
    success: true,
    elapsedMs,
    tenant: result.tenant
  };
}

/**
 * 4. Khởi tạo HTTP Webhook Server
 */
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Secure-Token, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check endpoint
  if (req.method === 'GET' && pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'UP', service: 'giatoc-auto-provisioner', uptime: process.uptime() }));
    return;
  }

  // Helper sinh VietQR nhanh qua API
  if (req.method === 'GET' && pathname === '/api/vietqr/generate') {
    const { bankCode = 'MB', accountNumber = '99997379999', accountName = 'TRAN DINH TRUNG', amount = 1290000, orderCode = 'GT10839' } = parsedUrl.query;
    const qrUrl = generateVietQR(bankCode, accountNumber, accountName, Number(amount), orderCode);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, qrUrl, orderCode, amount }));
    return;
  }

  // -------------------------------------------------------------------------
  // ENDPOINT WEBHOOK NHẬN BIẾN ĐỘNG SỐ DƯ TỪ NGÂN HÀNG (VIETQR / CASSO)
  // -------------------------------------------------------------------------
  if (req.method === 'POST' && (pathname === '/webhook/vietqr' || pathname === '/webhook/casso')) {
    // 1. Kiểm tra Secret Token bảo mật
    const incomingToken = req.headers['secure-token'] || req.headers['x-api-key'] || parsedUrl.query.token;
    if (incomingToken && incomingToken !== WEBHOOK_SECRET) {
      console.warn(`[Security Alert] ❌ Từ chối Webhook: Sai Secure Token từ IP ${req.socket.remoteAddress}`);
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: Invalid Secure-Token' }));
      return;
    }

    // Đọc Body JSON
    let bodyRaw = '';
    req.on('data', chunk => { bodyRaw += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(bodyRaw || '{}');
        console.log(`[Webhook Received] 📥 Nhận thông báo tiền về:`, JSON.stringify(payload));

        // Chuẩn hóa danh sách giao dịch (Hỗ trợ định dạng Casso và Webhook Ngân hàng thông thường)
        const records = Array.isArray(payload.data) ? payload.data : [payload];

        const results = [];

        for (const record of records) {
          const transId = String(record.id || record.transaction_id || record.tid || `mock_${Date.now()}`);
          const amount = Number(record.amount || record.creditAmount || 0);
          const description = String(record.description || record.content || record.memo || '');

          // 2. Chặn Idempotency (Không xử lý trùng lặp)
          if (processedTransactionIds.has(transId)) {
            console.log(`[Idempotency Guard] ⚠️ Giao dịch ${transId} đã được xử lý trước đó. Bỏ qua.`);
            results.push({ transId, status: 'already_processed' });
            continue;
          }

          // 3. Regex trích xuất mã đơn hàng: GT + 5 chữ số (vd: GT89230)
          const match = description.match(/(GT\d{4,6})/i);
          if (!match) {
            console.log(`[Parser] ℹ️ Giao dịch ${transId} không chứa mã đơn hàng hợp lệ (GTxxxxx). Nội dung: "${description}"`);
            results.push({ transId, status: 'no_order_code' });
            continue;
          }

          const orderCode = match[1].toUpperCase();

          // Đánh dấu đã xử lý giao dịch vào RAM Cache ngay lập tức
          processedTransactionIds.add(transId);

          // 4. Kích hoạt quy trình Auto-Provisioning
          try {
            const provisionResult = await executeAutoProvisioning(orderCode, transId, amount);
            results.push({ transId, orderCode, status: 'provisioned', elapsedMs: provisionResult.elapsedMs });
          } catch (provErr) {
            console.error(`[Provision Error] ❌ Thất bại khi kích hoạt đơn ${orderCode}:`, provErr.message);
            results.push({ transId, orderCode, status: 'failed', error: provErr.message });
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, processed: results }));
      } catch (parseErr) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Malformed JSON Body' }));
      }
    });
    return;
  }

  // -------------------------------------------------------------------------
  // ENDPOINT MÔ PHỎNG THANH TOÁN (Dành cho Demo Sandbox & Kiểm thử)
  // -------------------------------------------------------------------------
  if (req.method === 'POST' && pathname === '/api/test/simulate-bank-payment') {
    let bodyRaw = '';
    req.on('data', chunk => { bodyRaw += chunk; });
    req.on('end', async () => {
      try {
        const { orderCode, amount = 1290000 } = JSON.parse(bodyRaw || '{}');
        if (!orderCode) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing orderCode' }));
          return;
        }

        const transId = `SIMULATED_${Date.now()}`;
        console.log(`[Simulator] 🧪 Đang mô phỏng giao dịch ngân hàng ${transId} cho đơn ${orderCode}...`);

        const result = await executeAutoProvisioning(orderCode, transId, amount);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Simulated payment provisioned successfully', result }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 404 Fallback
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint Not Found' }));
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`⚡ GIATOC.ONLINE AUTO-PROVISIONING DAEMON ACTIVE ON PORT: ${PORT}`);
  console.log(`👉 Webhook URL: http://127.0.0.1:${PORT}/webhook/vietqr`);
  console.log(`👉 VietQR Generator: http://127.0.0.1:${PORT}/api/vietqr/generate`);
  console.log(`👉 Target SLA: Kích hoạt website & gửi ZNS < 30 Giây`);
  console.log(`=======================================================`);
});
