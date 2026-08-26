import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Copy, Check, Sparkles, ArrowRight, ShieldCheck, QrCode, ExternalLink, RefreshCw, Landmark } from 'lucide-react';
import { API_URL } from '../api';

const PLAN_DETAILS = {
  basic: { name: 'Gói Cơ Bản', price: 590000, members: 'Dưới 300 thành viên', storage: '2 GB NVMe', admins: '2 Quản trị viên' },
  standard: { name: 'Gói Tiêu Chuẩn', price: 1290000, members: 'Dưới 1.500 thành viên', storage: '10 GB NVMe', admins: '5 Quản trị viên' },
  premium: { name: 'Gói Cao Cấp', price: 2490000, members: 'Dưới 5.000 thành viên', storage: '30 GB NVMe', admins: '15 Quản trị viên' },
  unlimited: { name: 'Gói Đại Tộc', price: 4990000, members: 'Không giới hạn thành viên', storage: '100 GB NVMe', admins: 'Không giới hạn' },
};

export default function RegistrationModal({ isOpen, onClose, preselectedPlan = 'standard', preselectedSlug = '' }) {
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState(preselectedPlan);
  const [slug, setSlug] = useState(preselectedSlug);
  const [domainType, setDomainType] = useState('subdomain');
  const [customDomain, setCustomDomain] = useState('');
  const [clanName, setClanName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [billingYears, setBillingYears] = useState(1);

  const [slugChecking, setSlugChecking] = useState(false);
  const [slugStatus, setSlugStatus] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [copiedField, setCopiedField] = useState('');

  if (!isOpen) return null;

  const checkSlugAvailability = async (slugToCheck) => {
    const s = (slugToCheck || slug).trim().toLowerCase();
    if (!s) return;
    setSlugChecking(true);
    setSlugStatus(null);
    try {
      const res = await fetch(`${API_URL}/orders.php?action=check_slug&slug=${encodeURIComponent(s)}`);
      const data = await res.json();
      setSlugStatus(data);
    } catch (err) {
      setSlugStatus({ available: false, message: 'Lỗi kiểm tra tên miền, vui lòng thử lại.' });
    } finally {
      setSlugChecking(false);
    }
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const calculateAmount = () => {
    const base = PLAN_DETAILS[plan]?.price || 1290000;
    let total = base * billingYears;
    if (billingYears === 2) total = Math.round(total * 0.9);
    if (billingYears >= 3) total = Math.round(total * 0.8);
    return total;
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!clanName || !adminName || !adminPhone || !adminEmail || !adminUsername || !adminPassword) {
      alert('Vui lòng điền đầy đủ tất cả các trường thông tin!');
      return;
    }
    if (!slug) {
      alert('Vui lòng nhập tên Subdomain mong muốn!');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/orders.php?action=create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          domainType,
          slug: slug.trim().toLowerCase(),
          customDomain: domainType === 'custom_domain' ? customDomain.trim() : null,
          clanName: clanName.trim(),
          adminName: adminName.trim(),
          adminPhone: adminPhone.trim(),
          adminEmail: adminEmail.trim(),
          adminUsername: adminUsername.trim(),
          adminPassword,
          billingCycleYears: billingYears
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Có lỗi khi tạo đơn hàng.');
      }
      setOrderResult(data);
      setStep(3);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#163247]/70 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl my-8 bg-white rounded-2xl shadow-2xl border border-[#E1E8EC] overflow-hidden text-[#163247]">
        
        {/* Header Modal */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0A5480] via-[#0E6FA8] to-[#0A5480] text-white flex items-center justify-between border-b border-[#F2C46A]/40">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/10 rounded-xl text-[#F7D890] border border-[#F2C46A]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-[#F7D890]">Đăng Ký Website Dòng Họ — giatoc.online</h3>
              <p className="text-xs text-slate-200">Khởi tạo không gian số hóa lưu truyền cội nguồn gia tộc</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
            &times;
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="px-6 py-3 bg-[#FBF7EF] border-b border-[#E1E8EC] flex items-center justify-between text-xs font-bold text-[#5B7583]">
          <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-[#0A5480]' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-[#0E6FA8] text-white' : 'bg-slate-300'}`}>1</span>
            <span>Chọn Gói & Tên Miền</span>
          </div>
          <div className="h-0.5 w-10 bg-[#E1E8EC]" />
          <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-[#0A5480]' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#0E6FA8] text-white' : 'bg-slate-300'}`}>2</span>
            <span>Thông Tin Quản Trị</span>
          </div>
          <div className="h-0.5 w-10 bg-[#E1E8EC]" />
          <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-[#0A5480]' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#0E6FA8] text-white' : 'bg-slate-300'}`}>3</span>
            <span>Quét Mã MBBank</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#0A5480] uppercase tracking-wider mb-2">1. Chọn Gói Dịch Vụ:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {Object.entries(PLAN_DETAILS).map(([key, info]) => (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setPlan(key)}
                      className={`p-3 text-left rounded-xl border-2 transition-all ${
                        plan === key
                          ? 'border-[#0E6FA8] bg-[#F5E9D6]/60 shadow-xs'
                          : 'border-[#E1E8EC] hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-xs text-[#0A5480] font-serif">{info.name}</div>
                      <div className="text-[#B45309] font-extrabold text-sm my-0.5">
                        {(info.price).toLocaleString('vi-VN')} đ
                      </div>
                      <div className="text-[11px] text-[#5B7583] leading-tight">{info.members}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A5480] uppercase tracking-wider mb-2">2. Đặt Tên Subdomain Dòng Họ:</label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1 flex items-center">
                    <input
                      type="text"
                      placeholder="ví dụ: nguyenduy, hotrandinh"
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9\-]/g, ''));
                        setSlugStatus(null);
                      }}
                      className="w-full pl-3 pr-36 py-2.5 bg-[#FBF7EF] border border-[#E1E8EC] rounded-xl focus:ring-2 focus:ring-[#0E6FA8] focus:bg-white text-sm font-semibold"
                    />
                    <span className="absolute right-3 text-xs font-bold text-[#0E6FA8] select-none bg-[#F5E9D6] px-2 py-0.5 rounded">
                      .giatoc.online
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => checkSlugAvailability(slug)}
                    disabled={slugChecking || !slug}
                    className="px-4 py-2.5 bg-[#0A5480] hover:bg-[#0E6FA8] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap shadow-xs"
                  >
                    {slugChecking ? 'Đang kiểm tra...' : 'Kiểm tra'}
                  </button>
                </div>

                {slugStatus && (
                  <div className={`mt-2 p-2.5 rounded-lg text-xs flex items-center space-x-2 ${
                    slugStatus.available ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {slugStatus.available ? <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
                    <span>{slugStatus.message}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A5480] uppercase tracking-wider mb-2">3. Thời Hạn Đăng Ký:</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { years: 1, label: '1 Năm', desc: 'Giá chuẩn' },
                    { years: 2, label: '2 Năm', desc: 'Tiết kiệm 10%' },
                    { years: 5, label: '5 Năm', desc: 'Tiết kiệm 20%' },
                  ].map((cycle) => (
                    <button
                      type="button"
                      key={cycle.years}
                      onClick={() => setBillingYears(cycle.years)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        billingYears === cycle.years
                          ? 'border-[#0E6FA8] bg-[#F5E9D6] text-[#0A5480] font-bold'
                          : 'border-[#E1E8EC] text-[#5B7583] hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-sm font-bold">{cycle.label}</div>
                      <div className="text-[10px] text-[#B45309]">{cycle.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#F5E9D6]/70 rounded-xl border border-[#F2C46A]/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#5B7583]">Tổng thanh toán ({billingYears} năm):</span>
                  <div className="text-lg font-black text-[#0A5480]">{calculateAmount().toLocaleString('vi-VN')} đ</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!slug) {
                      alert('Vui lòng nhập tên subdomain!');
                      return;
                    }
                    setStep(2);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#0E6FA8] to-[#0A5480] hover:from-[#1C8FD6] hover:to-[#0E6FA8] text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-all"
                >
                  <span>Tiếp tục</span>
                  <ArrowRight className="w-4 h-4 text-[#F7D890]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0A5480] mb-1">Tên Dòng Họ / Chi Tộc (*):</label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: Đại Tộc Nguyễn Duy (Hà Tĩnh)"
                  value={clanName}
                  onChange={(e) => setClanName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E1E8EC] rounded-xl text-sm focus:ring-2 focus:ring-[#0E6FA8] bg-[#FBF7EF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0A5480] mb-1">Họ Tên Người Đại Diện (*):</label>
                  <input
                    type="text"
                    required
                    placeholder="ví dụ: Nguyễn Duy Long"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E1E8EC] rounded-xl text-sm focus:ring-2 focus:ring-[#0E6FA8] bg-[#FBF7EF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0A5480] mb-1">Số Điện Thoại / Zalo (*):</label>
                  <input
                    type="tel"
                    required
                    placeholder="ví dụ: 0912345678"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E1E8EC] rounded-xl text-sm focus:ring-2 focus:ring-[#0E6FA8] bg-[#FBF7EF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A5480] mb-1">Email Xác Thực & Nhận Bàn Giao (*):</label>
                <input
                  type="email"
                  required
                  placeholder="ví dụ: nguyenduylong@gmail.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E1E8EC] rounded-xl text-sm focus:ring-2 focus:ring-[#0E6FA8] bg-[#FBF7EF]"
                />
              </div>

              <div className="p-3.5 bg-[#F5E9D6]/50 rounded-xl border border-[#F2C46A]/50 space-y-3">
                <div className="text-xs font-bold text-[#0A5480] flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#B45309]" />
                  <span>Khởi Tạo Tài Khoản Quản Trị Website Dòng Họ:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5B7583] mb-1">Tên Đăng Nhập (*):</label>
                    <input
                      type="text"
                      required
                      placeholder="ví dụ: admin_duylong"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      className="w-full px-3 py-1.5 border border-[#E1E8EC] rounded-lg text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5B7583] mb-1">Mật Khẩu Khởi Tạo (*):</label>
                    <input
                      type="password"
                      required
                      placeholder="Mật khẩu ít nhất 6 ký tự"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full px-3 py-1.5 border border-[#E1E8EC] rounded-lg text-sm bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-[#5B7583] hover:text-[#163247] text-xs font-bold"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#0E6FA8] to-[#0A5480] hover:from-[#1C8FD6] hover:to-[#0E6FA8] text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-2"
                >
                  <span>{submitting ? 'Đang tạo đơn...' : 'Tạo Đơn Hàng & Thanh Toán'}</span>
                  <ArrowRight className="w-4 h-4 text-[#F7D890]" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: QUÉT MÃ VIETQR */}
          {step === 3 && orderResult && (
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center justify-center p-2 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold px-4 border border-emerald-200">
                <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-600" />
                Đơn hàng #{orderResult.orderCode} đã tạo thành công!
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="flex flex-col items-center justify-center p-4 bg-[#FBF7EF] border border-[#F2C46A]/50 rounded-2xl">
                  <img
                    src={orderResult.bankInfo?.qrUrl}
                    alt="VietQR MBBank"
                    className="w-48 h-48 object-contain rounded-xl shadow-xs border border-[#E1E8EC] bg-white p-2"
                  />
                  <div className="mt-2 text-[11px] text-[#5B7583] font-medium text-center">
                    Mở ứng dụng ngân hàng quét mã để tự động điền đúng STK & Nội dung
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#163247] flex flex-col justify-center">
                  <div className="p-2.5 bg-white rounded-xl border border-[#E1E8EC]">
                    <div className="text-[10px] text-[#5B7583] uppercase font-bold">Ngân Hàng Nhận:</div>
                    <div className="font-bold text-[#0A5480] text-sm flex items-center">
                      <Landmark className="w-4 h-4 mr-1 text-[#0E6FA8]" />
                      {orderResult.bankInfo?.bankName}
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-[#E1E8EC] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[#5B7583] uppercase font-bold">Số Tài Khoản:</div>
                      <div className="font-extrabold text-[#0A5480] text-base tracking-wider font-mono">
                        {orderResult.bankInfo?.accountNumber}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(orderResult.bankInfo?.accountNumber, 'stk')}
                      className="p-1.5 bg-[#FBF7EF] hover:bg-[#F5E9D6] text-[#0A5480] rounded-lg border border-[#E1E8EC] text-xs flex items-center space-x-1"
                    >
                      {copiedField === 'stk' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-[#E1E8EC]">
                    <div className="text-[10px] text-[#5B7583] uppercase font-bold">Chủ Tài Khoản:</div>
                    <div className="font-bold text-[#163247]">{orderResult.bankInfo?.accountName}</div>
                  </div>

                  <div className="p-2.5 bg-[#F5E9D6] rounded-xl border border-[#F2C46A] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[#B45309] uppercase font-bold">Nội Dung Chuyển Khoản:</div>
                      <div className="font-extrabold text-[#0A5480] text-base tracking-wider font-mono">
                        {orderResult.bankInfo?.transferContent}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(orderResult.bankInfo?.transferContent, 'memo')}
                      className="p-1.5 bg-white hover:bg-amber-100 text-[#0A5480] rounded-lg border border-[#F2C46A] text-xs flex items-center space-x-1"
                    >
                      {copiedField === 'memo' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-900">Số Tiền:</span>
                    <span className="font-black text-emerald-700 text-base">{orderResult.amount?.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-left text-xs text-blue-900 space-y-1">
                <p>
                  ⚡ Sau khi nhận được chuyển khoản, Quản trị hệ thống sẽ duyệt và website <strong className="text-[#0A5480]">{orderResult.fullDomain}</strong> sẽ được kích hoạt tự động.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#0A5480] hover:bg-[#0E6FA8] text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  Tôi Đã Chuyển Khoản Thành Công
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
