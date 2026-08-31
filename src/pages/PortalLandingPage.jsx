import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Shield, TreePine, MapPin, DollarSign, Users, CheckCircle,
  ArrowRight, ExternalLink, Phone, Check, Bot, Send, Star, ShieldCheck, HeartHandshake,
  Minus, Zap, Globe, Database, UserCog, Image, MessageSquare, Search, Eye, Lock,
  Flame, Award, BookOpen, ChevronDown, ChevronUp, Compass, Calendar, HelpCircle
} from 'lucide-react';
import RegistrationModal from '../components/RegistrationModal';

export default function PortalLandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [quickSlug, setQuickSlug] = useState('');
  const [billingCycle, setBillingCycle] = useState('1year'); // '1year' | '2years' | '5years'
  const [demoActiveTab, setDemoActiveTab] = useState('tree'); // 'tree' | 'map' | 'finance' | 'zns' | 'ai'
  const [selectedMember, setSelectedMember] = useState(null);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Dữ liệu dòng họ mẫu cho Interactive Mini Tree
  const SAMPLE_MEMBERS = [
    {
      id: 'm1', name: 'Cụ Thủy Tổ: Nguyễn Duy Hoan', gen: 1, years: '1830 - 1902', role: '👑 Cụ Thủy Tổ Khai Khái',
      branch: 'Toàn Tộc', lunarDeath: '15/08 Âm Lịch', solarDeath: '04/10 Dương Lịch', tomb: 'Khu Lăng Mộ Tổ Núi Rồng (GPS: 20.4382, 105.9123)',
      phone: '0912 888 678', bio: 'Khởi thủy khai hoang lập ấp, đỗ Tú tài triều Nguyễn, khai sáng nền móng từ đường đại tộc.'
    },
    {
      id: 'm2', name: 'Cụ Nguyễn Duy Trác', gen: 2, years: '1862 - 1935', role: 'Trưởng Chi Nhất',
      branch: 'Chi 1 (Chi Trưởng)', lunarDeath: '03/03 Âm Lịch', solarDeath: '18/04 Dương Lịch', tomb: 'Nghĩa Trang Dòng Họ Khu A (Mộ số 12)',
      phone: '0983 555 123', bio: 'Tiếp quản từ đường chi trưởng, giữ gìn 3 tập gia phả cổ chữ Nho.'
    },
    {
      id: 'm3', name: 'Cụ Nguyễn Duy Thành', gen: 2, years: '1868 - 1941', role: 'Trưởng Chi Nhị',
      branch: 'Chi 2 (Chi Thứ)', lunarDeath: '19/11 Âm Lịch', solarDeath: '28/12 Dương Lịch', tomb: 'Khu Lăng Mộ Chi 2 Cánh Đồng Mới',
      phone: '0904 333 789', bio: 'Phát triển nghề truyền thống, lập quỹ khuyến học đầu tiên của dòng họ.'
    },
    {
      id: 'm4', name: 'Nguyễn Duy Huỳnh', gen: 3, years: '1895 - 1970', role: 'Cụ Đời 3 (Chi 1)',
      branch: 'Chi 1', lunarDeath: '10/06 Âm Lịch', solarDeath: '12/07 Dương Lịch', tomb: 'Nghĩa trang liệt sĩ / Di tích địa phương',
      phone: '0918 111 222', bio: 'Tham gia kháng chiến, để lại nhiều thư tịch lịch sử quý báu.'
    },
    {
      id: 'm5', name: 'Nguyễn Duy Tân', gen: 3, years: '1901 - 1982', role: 'Cụ Đời 3 (Chi 2)',
      branch: 'Chi 2', lunarDeath: '02/09 Âm Lịch', solarDeath: '15/10 Dương Lịch', tomb: 'Nghĩa trang quê nhà',
      phone: '0977 444 999', bio: 'Thầy giáo dạy chữ Quốc ngữ đầu tiên trong làng, được con cháu kính ngưỡng.'
    },
    {
      id: 'm6', name: 'Nguyễn Duy Tuấn', gen: 4, years: 'Sinh năm 1960', role: 'Trưởng Ban Liên Lạc',
      branch: 'Chi 1', lunarDeath: 'Đang sinh sống', solarDeath: '', tomb: 'Hà Nội',
      phone: '0912 345 678', bio: 'Chủ trì đại tu Từ đường năm 2024, phụ trách số hóa gia phả lên giatoc.online.'
    },
  ];

  const pricingPlans = [
    {
      id: 'basic', name: 'Cơ Bản', sub: 'Chi nhỏ / Gia đình nhỏ',
      price: billingCycle === '1year' ? '590.000đ' : billingCycle === '2years' ? '1.060.000đ' : '2.210.000đ',
      period: billingCycle === '1year' ? '/ năm' : billingCycle === '2years' ? '/ 2 năm (-10%)' : '/ 5 năm (-25%)',
      badge: 'Tiết Kiệm', badgeColor: 'bg-slate-600',
      members: '≤ 300 người', admins: '2 Quản trị viên', storage: '2 GB NVMe', domain: 'Subdomain riêng', zns: '50 tin ZNS',
      features: { tree: true, map: true, finance: true, auth: true, excel: false, ai: false, assets: false, altar: false, privacy: true, yearbook: false, support: 'Email / Ticket' }
    },
    {
      id: 'standard', name: 'Tiêu Chuẩn', sub: 'Dòng họ quy mô vừa & phổ biến',
      price: billingCycle === '1year' ? '1.290.000đ' : billingCycle === '2years' ? '2.320.000đ' : '4.830.000đ',
      period: billingCycle === '1year' ? '/ năm' : billingCycle === '2years' ? '/ 2 năm (-10%)' : '/ 5 năm (-25%)',
      badge: 'Phổ Biến Nhất ★', badgeColor: 'bg-amber-600', isPopular: true,
      members: '≤ 1.500 người', admins: '5 Quản trị viên (Theo Chi)', storage: '10 GB NVMe', domain: 'Subdomain riêng', zns: '200 tin ZNS',
      features: { tree: true, map: true, finance: true, auth: true, excel: true, ai: true, assets: true, altar: false, privacy: true, yearbook: false, support: 'Hotline + Zalo' }
    },
    {
      id: 'unlimited', name: 'Đại Tộc', sub: 'Đại tộc toàn quốc / Nhiều chi phái',
      price: billingCycle === '1year' ? '2.490.000đ' : billingCycle === '2years' ? '4.480.000đ' : '9.330.000đ',
      period: billingCycle === '1year' ? '/ năm' : billingCycle === '2years' ? '/ 2 năm (-10%)' : '/ 5 năm (Tặng Sách In)',
      badge: 'Vương Giả', badgeColor: 'bg-rose-800',
      members: '≤ 5.000 người', admins: '15 Quản trị viên', storage: '30 GB NVMe', domain: 'GẮN TÊN MIỀN RIÊNG .COM/.VN', zns: '500 tin ZNS',
      features: { tree: true, map: true, finance: true, auth: true, excel: true, ai: true, assets: true, altar: true, privacy: true, yearbook: true, support: 'Chuyên viên 1-1 + Nhập liệu' }
    }
  ];

  const comparisonRows = [
    { key: 'members', label: 'Số lượng thành viên gia phả', icon: Users, type: 'value' },
    { key: 'admins', label: 'Tài khoản quản trị viên', icon: UserCog, type: 'value' },
    { key: 'storage', label: 'Dung lượng lưu trữ ảnh & kỷ yếu', icon: Database, type: 'value' },
    { key: 'domain', label: 'Tên miền hoạt động', icon: Globe, type: 'value' },
    { key: 'zns', label: 'Tin nhắn Zalo ZNS báo giỗ', icon: MessageSquare, type: 'value' },
    { divider: true, label: 'Tính Năng Cốt Lõi' },
    { key: 'tree', label: 'Sơ đồ phả hệ tương tác đa thế hệ', icon: TreePine, type: 'feature' },
    { key: 'map', label: 'Bản đồ lăng mộ vệ tinh GPS', icon: MapPin, type: 'feature' },
    { key: 'finance', label: 'Sổ quỹ thu chi & bảng vàng công đức', icon: DollarSign, type: 'feature' },
    { key: 'privacy', label: 'Cổng bảo vệ số điện thoại con cháu', icon: ShieldCheck, type: 'feature' },
    { key: 'excel', label: 'Import Excel & Xuất GEDCOM quốc tế', icon: Zap, type: 'feature' },
    { key: 'ai', label: 'Trợ lý AI xưng hô & dịch phả ký', icon: Bot, type: 'feature' },
    { key: 'assets', label: 'Quản lý tài sản & di tích dòng họ', icon: Shield, type: 'feature' },
    { key: 'altar', label: 'Bàn thờ số & tưởng niệm tri ân', icon: Flame, type: 'feature' },
    { key: 'yearbook', label: 'Xuất file sách kỷ yếu in ấn A4/A3', icon: BookOpen, type: 'feature' },
    { key: 'support', label: 'Chính sách hỗ trợ kỹ thuật', icon: HeartHandshake, type: 'value' },
  ];

  const FAQS = [
    {
      q: 'Làm thế nào để nhập gia phả giấy cũ hoặc file Excel có sẵn vào hệ thống?',
      a: 'Bạn chỉ cần tải file Excel mẫu từ hệ thống, điền danh sách thành viên (cột Cha, Mẹ, Con cái) và nhấn Tải Lên. Hệ thống có sẵn thuật toán kiểm tra chu trình DAG để tự động vẽ nên cây phả hệ hoàn chỉnh trong 5 giây mà không lo lỗi đệ quy.'
    },
    {
      q: 'Con cháu ở nước ngoài hoặc các tỉnh xa có xem được không?',
      a: 'Website hoạt động 24/7 trên nền tảng Antigravity tốc độ cao và CDN toàn cầu. Con cháu ở bất kỳ đâu trên thế giới đều có thể truy cập mượt mà trên điện thoại, máy tính bảng để tra cứu cội nguồn, thắp nén nhang số hoặc nhận thông báo giỗ tổ.'
    },
    {
      q: 'Thông tin gia đình và số điện thoại con cháu có được bảo mật không?',
      a: 'Tuyệt đối an toàn. Hệ thống tích hợp Cổng Riêng Tư 3 Lớp (Privacy Gatekeeper). Mặc định toàn bộ số điện thoại và địa chỉ đều bị che mờ. Chỉ con cháu trong dòng họ đã được Trưởng ban liên lạc xác thực danh tính mới có thể xem được.'
    },
    {
      q: 'Dòng họ có thể gắn tên miền riêng độc lập (như hotrandinh.com) không?',
      a: 'Có. Với gói Đại Tộc (hoặc tùy chọn nâng cao), hệ thống hỗ trợ gắn trực tiếp tên miền riêng độc lập của dòng họ (vd: hotrandinh.com, honguyenduy.vn). Máy chủ Caddy v2 trên Antigravity sẽ tự động cấp chứng chỉ bảo mật SSL miễn phí trọn đời.'
    },
    {
      q: 'Sau khi thanh toán VietQR, bao lâu thì website được kích hoạt?',
      a: 'Hệ thống tích hợp cổng Webhook ngân hàng tự động 100%. Ngay sau khi bạn quét mã VietQR thành công, website dòng họ và tài khoản quản trị sẽ được kích hoạt tức thì trong vòng 30 giây.'
    }
  ];

  const openRegister = (planId = 'standard') => {
    setSelectedPlan(planId);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#163247] selection:bg-[#F2C46A] selection:text-[#0A5480]">

      {/* ── 1. NAVBAR HOÀNG GIA ────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#E2D9C8] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0A5480] via-[#0E6FA8] to-[#881337] flex items-center justify-center text-[#F7D890] font-black text-base border-2 border-[#D97706]/40 shadow-md group-hover:scale-105 transition-transform">
              GT
            </div>
            <div className="leading-tight">
              <div className="text-xl sm:text-2xl font-bold text-[#0A5480] font-serif tracking-tight">Gia Tộc Online</div>
              <div className="text-[10px] sm:text-[11px] font-bold text-[#D97706] tracking-widest uppercase">Số Hóa Di Sản Dòng Tộc</div>
            </div>
          </a>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 text-sm font-bold text-[#163247]">
            <a href="#demo-tree" className="hover:text-[#0E6FA8] transition-colors">Cây Phả Hệ Mẫu</a>
            <a href="#features" className="hover:text-[#0E6FA8] transition-colors">Tính Năng</a>
            <a href="#pricing" className="hover:text-[#0E6FA8] transition-colors">Bảng Giá SaaS</a>
            <a href="#faq" className="hover:text-[#0E6FA8] transition-colors">Hỏi Đáp</a>
            <Link to="/huong-dan-thiet-lap" className="hover:text-[#0E6FA8] transition-colors">Hướng Dẫn</Link>
            <a
              href="https://hotrandinh.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F5E9D6] text-[#0A5480] border border-[#D97706]/30 hover:bg-[#F2C46A]/40 transition-colors text-xs font-extrabold shadow-sm"
            >
              Xem Demo Thực Tế <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:inline-flex text-xs font-bold text-[#5B7583] hover:text-[#0A5480] px-3 py-2">
              Đăng Nhập
            </Link>
            <button
              onClick={() => openRegister('standard')}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#881337] to-[#0A5480] hover:from-[#9F1239] hover:to-[#0E6FA8] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#F7D890]" />
              <span>Khởi Tạo Web Dòng Họ</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── 2. HERO SECTION VỚI CHECKER SUBDOMAIN TRỰC TIẾP ───────────── */}
      <section className="relative pt-[128px] pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#FBF7EF] via-[#FDFBF7] to-[#F5E9D6]/30">
        <div className="max-w-5xl mx-auto text-center space-y-7 relative z-10">
          
          {/* Badge Uy Tín */}
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/90 rounded-full border border-[#D97706]/30 shadow-sm text-xs sm:text-sm font-bold text-[#0A5480]">
            <Award className="w-4 h-4 text-[#D97706]" />
            <span>Nền Tảng Quản Trị Gia Tộc Đa Dòng Họ Số 1 Việt Nam</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-serif text-[#0A5480] leading-[1.12] tracking-tight">
            Số Hóa Gia Phả<br />
            <span className="bg-gradient-to-r from-[#881337] via-[#D97706] to-[#0A5480] bg-clip-text text-transparent">
              Kết Nối Huyết Thống Muôn Đời
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-[#5B7583] max-w-3xl mx-auto leading-relaxed font-normal">
            Giải pháp lưu truyền di sản tổ tiên toàn diện: <strong>Cây phả hệ tương tác vô hạn thế hệ</strong>, <strong>Bản đồ lăng mộ GPS vệ tinh</strong>, <strong>Sổ quỹ minh bạch</strong> và <strong>Tự động gửi tin nhắn Zalo ZNS báo giỗ tổ</strong> — Sẵn sàng hoạt động sau 30 giây.
          </p>

          {/* Live Subdomain Checker Input Box */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="bg-white rounded-2xl sm:rounded-full border-2 border-[#D97706]/30 shadow-xl p-2 sm:p-2.5 flex flex-col sm:flex-row items-center gap-2 focus-within:border-[#0E6FA8] focus-within:ring-4 focus-within:ring-[#0E6FA8]/10 transition-all">
              <div className="flex items-center flex-1 w-full pl-4">
                <Search className="w-5 h-5 text-[#D97706] mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Nhập tên dòng họ (vd: nguyenduy, lequang, hotran)..."
                  value={quickSlug}
                  onChange={(e) => setQuickSlug(e.target.value.toLowerCase().replace(/[^a-z0-9\-]/g, ''))}
                  className="w-full py-2.5 bg-transparent text-[#163247] text-base sm:text-lg font-bold outline-none placeholder:text-gray-400 placeholder:font-normal"
                />
                <span className="hidden sm:inline-block text-xs font-black text-[#0E6FA8] bg-[#F5E9D6] px-3 py-1.5 rounded-full mr-2 shrink-0">
                  .giatoc.online
                </span>
              </div>
              <button
                onClick={() => openRegister('standard')}
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#881337] to-[#0A5480] hover:from-[#9F1239] hover:to-[#0E6FA8] text-white font-black text-sm rounded-xl sm:rounded-full transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
              >
                <span>Kiểm Tra & Tạo Web</span>
                <ArrowRight className="w-4 h-4 text-[#F7D890]" />
              </button>
            </div>

            {/* Availability Indicator */}
            {quickSlug && (
              <div className="mt-3 text-xs sm:text-sm font-bold text-[#059669] flex items-center justify-center gap-1.5 animate-fade-in">
                <CheckCircle className="w-4 h-4" />
                <span>Subdomain <strong>{quickSlug}.giatoc.online</strong> khả dụng! Nhấn Tạo Web để giữ chỗ ngay.</span>
              </div>
            )}
          </div>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-xs sm:text-sm text-[#5B7583] font-semibold pt-3">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-[#059669]" /> Bảo mật thông tin 3 lớp</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-[#059669]" /> Kích hoạt tự động sau 30 giây</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-[#059669]" /> Không phát sinh phụ phí ẩn</span>
          </div>
        </div>
      </section>

      {/* ── 3. STATS BAR THỜI GIAN THỰC ────────────────────────────────── */}
      <section className="bg-gradient-to-r from-[#0A5480] via-[#0E6FA8] to-[#0A5480] text-white border-y border-[#D97706]/30">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: '250+', label: 'Dòng họ đã số hóa' },
            { num: '120.000+', label: 'Con cháu kết nối' },
            { num: '30 Giây', label: 'Kích hoạt web tức thì' },
            { num: '99.9%', label: 'Hài lòng & Tái tục' },
          ].map((s, i) => (
            <div key={i} className="border-r last:border-r-0 border-white/10 pr-4">
              <div className="text-3xl sm:text-4xl font-black text-[#F7D890] font-serif">{s.num}</div>
              <div className="text-xs sm:text-sm text-white/80 mt-1 font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. INTERACTIVE MINI FAMILY TREE WIDGET (TRẢI NGHIỆM TRỰC QUAN) ─ */}
      <section id="demo-tree" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#F5E9D6] rounded-full text-xs font-bold text-[#881337]">
            <Sparkles className="w-3.5 h-3.5" /> Trải Nghiệm Trực Quan Không Cần Cài Đặt
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A5480] font-serif">
            Khám Phá Cây Phả Hệ Sống Động
          </h2>
          <p className="text-sm sm:text-base text-[#5B7583] max-w-2xl mx-auto">
            Nhấn vào bất kỳ thành viên nào dưới đây để xem thông tin tiểu sử, ngày giỗ âm lịch, vị trí mộ phần GPS và trải nghiệm Cổng Riêng Tư bảo vệ số điện thoại.
          </p>
        </div>

        {/* Demo Interactive Box */}
        <div className="bg-white rounded-3xl border-2 border-[#E2D9C8] shadow-2xl overflow-hidden">
          {/* Toolbar Simulator */}
          <div className="bg-[#FBF7EF] px-6 py-4 border-b border-[#E2D9C8] flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="text-[#0A5480] font-serif font-black ml-2">Demo: Dòng Họ Nguyễn Duy (Tiên Điền)</span>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center bg-[#F5E9D6] p-1 rounded-xl gap-1">
              <button
                onClick={() => setDemoActiveTab('tree')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${demoActiveTab === 'tree' ? 'bg-[#0A5480] text-[#F7D890] shadow' : 'text-[#163247] hover:bg-white/50'}`}
              >
                <TreePine className="w-3.5 h-3.5" /> Cây Phả Hệ
              </button>
              <button
                onClick={() => setDemoActiveTab('map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${demoActiveTab === 'map' ? 'bg-[#0A5480] text-[#F7D890] shadow' : 'text-[#163247] hover:bg-white/50'}`}
              >
                <MapPin className="w-3.5 h-3.5" /> Mộ Phần GPS
              </button>
              <button
                onClick={() => setDemoActiveTab('zns')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${demoActiveTab === 'zns' ? 'bg-[#0A5480] text-[#F7D890] shadow' : 'text-[#163247] hover:bg-white/50'}`}
              >
                <Send className="w-3.5 h-3.5" /> Báo Giỗ Zalo
              </button>
            </div>
          </div>

          {/* Interactive Canvas Canvas Area */}
          <div className="p-6 sm:p-10 bg-[#FDFBF7] min-h-[460px] flex flex-col items-center justify-center relative">
            
            {/* TAB 1: CÂY PHẢ HỆ TƯƠNG TÁC */}
            {demoActiveTab === 'tree' && (
              <div className="w-full space-y-8 animate-fade-in">
                {/* Level 1: Thủy Tổ */}
                <div className="flex justify-center">
                  <div
                    onClick={() => setSelectedMember(SAMPLE_MEMBERS[0])}
                    className="cursor-pointer group p-4 bg-white hover:bg-[#F5E9D6]/50 rounded-2xl border-2 border-[#D97706] shadow-lg hover:shadow-xl transition-all max-w-sm text-center relative"
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D97706] text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
                      Đời 1 • Khởi Thủy
                    </div>
                    <div className="font-serif font-black text-lg text-[#881337] mt-1 group-hover:text-[#0E6FA8] transition-colors">
                      {SAMPLE_MEMBERS[0].name}
                    </div>
                    <div className="text-xs text-[#5B7583] mt-0.5">{SAMPLE_MEMBERS[0].years} • Giỗ: {SAMPLE_MEMBERS[0].lunarDeath}</div>
                    <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#0A5480] bg-[#F5E9D6] px-2.5 py-1 rounded-full">
                      <Compass className="w-3 h-3 text-[#D97706]" /> Nhấn để xem Mộ Tổ GPS
                    </div>
                  </div>
                </div>

                {/* Connector Line 1 */}
                <div className="w-0.5 h-6 bg-[#D97706]/40 mx-auto" />

                {/* Level 2: Hai Chi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto relative">
                  <div className="hidden sm:block absolute -top-3 left-1/4 right-1/4 h-0.5 bg-[#D97706]/40" />

                  {/* Chi 1 */}
                  <div
                    onClick={() => setSelectedMember(SAMPLE_MEMBERS[1])}
                    className="cursor-pointer group p-4 bg-white hover:bg-[#F5E9D6]/50 rounded-2xl border border-[#E2D9C8] hover:border-[#0E6FA8] shadow-md transition-all text-center"
                  >
                    <span className="text-[10px] font-extrabold text-[#0E6FA8] bg-[#F5E9D6] px-2.5 py-0.5 rounded-full">Đời 2 • Chi Trưởng</span>
                    <div className="font-serif font-bold text-base text-[#163247] mt-1.5 group-hover:text-[#0E6FA8] transition-colors">{SAMPLE_MEMBERS[1].name}</div>
                    <div className="text-xs text-[#5B7583]">{SAMPLE_MEMBERS[1].years}</div>
                  </div>

                  {/* Chi 2 */}
                  <div
                    onClick={() => setSelectedMember(SAMPLE_MEMBERS[2])}
                    className="cursor-pointer group p-4 bg-white hover:bg-[#F5E9D6]/50 rounded-2xl border border-[#E2D9C8] hover:border-[#0E6FA8] shadow-md transition-all text-center"
                  >
                    <span className="text-[10px] font-extrabold text-[#D97706] bg-[#F5E9D6] px-2.5 py-0.5 rounded-full">Đời 2 • Chi Thứ</span>
                    <div className="font-serif font-bold text-base text-[#163247] mt-1.5 group-hover:text-[#0E6FA8] transition-colors">{SAMPLE_MEMBERS[2].name}</div>
                    <div className="text-xs text-[#5B7583]">{SAMPLE_MEMBERS[2].years}</div>
                  </div>
                </div>

                {/* Level 3: Con Cháu Hiện Đại */}
                <div className="text-center pt-2">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-[#5B7583] bg-white px-4 py-2 rounded-full border border-[#E2D9C8] shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>Cây mẫu hỗ trợ thu phóng vô hạn thế hệ & tìm kiếm con cháu theo tên tức thì</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: BẢN ĐỒ LĂNG MỘ GPS PREVIEW */}
            {demoActiveTab === 'map' && (
              <div className="w-full max-w-3xl space-y-4 animate-fade-in text-center">
                <div className="p-6 bg-white rounded-2xl border border-[#E2D9C8] shadow-md space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#F5E9D6] text-[#0A5480] flex items-center justify-center mx-auto">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#0A5480]">Định Vị Vệ Tinh Lăng Mộ Gia Tộc</h3>
                  <p className="text-xs sm:text-sm text-[#5B7583] max-w-md mx-auto">
                    Tích hợp bản đồ GPS chính xác từng tọa độ mộ phần. Con cháu phương xa về viếng chỉ cần nhấn "Chỉ Đường" là Google Maps dẫn lối tận nơi.
                  </p>
                  <div className="p-3 bg-[#FBF7EF] rounded-xl text-xs font-bold text-[#0A5480] inline-block border border-[#D97706]/30">
                    📍 Tọa độ Lăng Mộ Tổ: 20°26'17.5"N 105°54'44.3"E (Đã đồng bộ Google Earth)
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: BÁO GIỖ ZALO ZNS PREVIEW */}
            {demoActiveTab === 'zns' && (
              <div className="w-full max-w-md space-y-3 animate-fade-in">
                <div className="p-5 bg-white rounded-2xl border-2 border-emerald-500/30 shadow-lg space-y-2.5">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#0068FF] text-white flex items-center justify-center text-[10px] font-black">Z</div>
                      <span className="text-xs font-black text-[#163247]">Zalo ZNS: Gia Tộc Online</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">Đã gửi tự động</span>
                  </div>
                  <div className="text-xs text-[#163247] space-y-1">
                    <div className="font-bold text-[#881337]">Kính gửi: Ông Nguyễn Duy Tuấn</div>
                    <p className="text-[#5B7583]">Ban liên lạc Dòng họ xin trân trọng thông báo Lễ Giỗ Cụ Thủy Tổ sẽ diễn ra vào ngày <strong>15/08 Âm Lịch</strong> tại Nhà Thờ Chi Trưởng.</p>
                  </div>
                  <div className="pt-1 flex gap-2">
                    <a href="https://hotrandinh.com" target="_blank" rel="noreferrer" className="flex-1 py-1.5 text-center bg-[#0A5480] text-white rounded-lg text-[11px] font-bold">
                      Xem Sơ Đồ Cúng Lễ
                    </a>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Modal Popover xem chi tiết cụ khi click */}
          {selectedMember && (
            <div className="fixed inset-0 z-50 bg-[#163247]/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-[#D97706] shadow-2xl relative animate-scale-up">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-[#163247] text-2xl font-bold w-8 h-8 flex items-center justify-center"
                >
                  &times;
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#F5E9D6] text-[#881337] font-black flex items-center justify-center text-lg border border-[#D97706]/40">
                    Đ{selectedMember.gen}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#D97706] bg-[#F5E9D6] px-2 py-0.5 rounded-full">{selectedMember.role}</span>
                    <h3 className="font-serif font-black text-xl text-[#0A5480]">{selectedMember.name}</h3>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm text-[#163247] border-y border-[#E2D9C8] py-4 my-4">
                  <div className="flex justify-between">
                    <span className="text-[#5B7583]">Năm sinh - năm mất:</span>
                    <span className="font-bold">{selectedMember.years}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5B7583]">Ngày giỗ (Âm lịch):</span>
                    <span className="font-bold text-[#881337]">{selectedMember.lunarDeath}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5B7583]">Vị trí mộ phần GPS:</span>
                    <span className="font-bold text-[#0A5480] text-right">{selectedMember.tomb}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#5B7583]">Số điện thoại liên lạc:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">0912 ••• 678</span>
                      <button
                        onClick={() => setShowPrivacyNotice(true)}
                        className="text-[11px] font-bold text-[#0E6FA8] hover:underline flex items-center gap-1"
                      >
                        <Lock className="w-3 h-3" /> Mở khóa
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#5B7583] italic mb-6">"{selectedMember.bio}"</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setSelectedMember(null); openRegister('standard'); }}
                    className="flex-1 py-3 bg-gradient-to-r from-[#881337] to-[#0A5480] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md"
                  >
                    Tạo Cây Gia Phả Tương Tự
                  </button>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-[#163247] font-bold text-xs sm:text-sm rounded-xl"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Notice Modal */}
          {showPrivacyNotice && (
            <div className="fixed inset-0 z-50 bg-[#163247]/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E2D9C8] shadow-2xl text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#059669] flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-lg text-[#0A5480]">Cổng Bảo Mật Riêng Tư 3 Lớp</h4>
                <p className="text-xs text-[#5B7583] leading-relaxed">
                  Để bảo vệ thông tin riêng tư của con cháu dòng họ, toàn bộ số điện thoại và địa chỉ đều được mã hóa. Chỉ con cháu đã xác thực danh tính với Trưởng ban liên lạc mới có quyền xem đầy đủ.
                </p>
                <button
                  onClick={() => setShowPrivacyNotice(false)}
                  className="w-full py-2.5 bg-[#0A5480] text-white rounded-xl font-bold text-xs"
                >
                  Tôi Đã Hiểu
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 5. 3 CỘT TRỤ GIÁ TRỊ VƯỢT TRỘI (USP PILLARS) ────────────────── */}
      <section id="features" className="py-20 sm:py-28 bg-white border-t border-[#E2D9C8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#F5E9D6] rounded-full text-xs font-bold text-[#881337]">
              <Sparkles className="w-3.5 h-3.5" /> Công Nghệ Hiện Đại Cho Phong Tục Việt
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A5480] font-serif">
              3 Cột Trụ Giá Trị Vượt Trội
            </h2>
            <p className="text-base text-[#5B7583] max-w-2xl mx-auto">
              Thiết kế chuyên biệt giúp dòng họ chuyển đổi số toàn diện, dễ sử dụng cho cả các bậc cao niên lẫn thế hệ trẻ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cột 1 */}
            <div className="bg-[#FDFBF7] p-8 sm:p-10 rounded-3xl border border-[#E2D9C8] hover:border-[#0E6FA8] hover:shadow-xl transition-all space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#F5E9D6] text-[#881337] flex items-center justify-center shadow-inner">
                  <TreePine className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#0A5480]">
                  1. Sơ Đồ Phả Hệ Vô Hạn Thế Hệ
                </h3>
                <p className="text-sm text-[#5B7583] leading-relaxed">
                  Thu phóng mượt mà, hỗ trợ 100+ đời. Thuật toán kiểm tra chu trình DAG chống lặp quan hệ cha-con. Tự động xuất file sách kỷ yếu in ấn A4/A3 vector sắc nét.
                </p>
              </div>
              <div className="pt-4 border-t border-[#E2D9C8]/60 text-xs font-bold text-[#0E6FA8] flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#059669]" /> Hỗ trợ Import Excel 1-click & Xuất GEDCOM
              </div>
            </div>

            {/* Cột 2 */}
            <div className="bg-[#FDFBF7] p-8 sm:p-10 rounded-3xl border border-[#E2D9C8] hover:border-[#0E6FA8] hover:shadow-xl transition-all space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#F5E9D6] text-[#0A5480] flex items-center justify-center shadow-inner">
                  <MapPin className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#0A5480]">
                  2. Bản Đồ Lăng Mộ Vệ Tinh GPS
                </h3>
                <p className="text-sm text-[#5B7583] leading-relaxed">
                  Định vị chính xác từng vị trí lăng mộ tổ tiên, nhà thờ chi phái bằng tọa độ vệ tinh Google Maps. Con cháu phương xa về quê mở điện thoại là được dẫn đường tận nơi.
                </p>
              </div>
              <div className="pt-4 border-t border-[#E2D9C8]/60 text-xs font-bold text-[#0E6FA8] flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#059669]" /> Đính kèm ảnh thực tế & chỉ đường Google Maps
              </div>
            </div>

            {/* Cột 3 */}
            <div className="bg-[#FDFBF7] p-8 sm:p-10 rounded-3xl border border-[#E2D9C8] hover:border-[#0E6FA8] hover:shadow-xl transition-all space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#F5E9D6] text-[#D97706] flex items-center justify-center shadow-inner">
                  <DollarSign className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#0A5480]">
                  3. Quỹ Họ & Báo Giỗ Zalo Tự Động
                </h3>
                <p className="text-sm text-[#5B7583] leading-relaxed">
                  Minh bạch mọi khoản thu chi, đóng góp công đức có đính kèm ảnh hóa đơn. Tự động gửi tin nhắn Zalo ZNS thông báo ngày lễ giỗ tổ, họp họ, chúc thọ chỉ với 1 chạm.
                </p>
              </div>
              <div className="pt-4 border-t border-[#E2D9C8]/60 text-xs font-bold text-[#0E6FA8] flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#059669]" /> Tin nhắn Zalo chính chủ & Sao kê minh bạch
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. BẢNG GIÁ SAAS LICENSE MINH BẠCH ─────────────────────────── */}
      <section id="pricing" className="py-20 sm:py-28 bg-[#FBF7EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A5480] font-serif">
              Bảng Giá Bản Quyền Dịch Vụ
            </h2>
            <p className="text-base text-[#5B7583] max-w-2xl mx-auto">
              Không phụ phí ẩn • Tự động kích hoạt sau 30 giây qua VietQR • Bảo lưu dữ liệu vĩnh viễn
            </p>

            {/* Billing Cycle Switcher */}
            <div className="inline-flex items-center bg-white p-1.5 rounded-full border border-[#E2D9C8] shadow-md mt-6">
              <button
                onClick={() => setBillingCycle('1year')}
                className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all ${billingCycle === '1year' ? 'bg-[#0A5480] text-white shadow' : 'text-[#5B7583] hover:text-[#0A5480]'}`}
              >
                1 Năm (Chuẩn)
              </button>
              <button
                onClick={() => setBillingCycle('2years')}
                className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1 ${billingCycle === '2years' ? 'bg-[#0A5480] text-white shadow' : 'text-[#5B7583] hover:text-[#0A5480]'}`}
              >
                <span>2 Năm</span>
                <span className="bg-[#D97706] text-white text-[10px] px-2 py-0.5 rounded-full">Tiết kiệm 10%</span>
              </button>
              <button
                onClick={() => setBillingCycle('5years')}
                className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1 ${billingCycle === '5years' ? 'bg-[#881337] text-[#F7D890] shadow' : 'text-[#5B7583] hover:text-[#881337]'}`}
              >
                <span>5 Năm (Vĩnh Cửu)</span>
                <span className="bg-[#F7D890] text-[#881337] text-[10px] px-2 py-0.5 rounded-full font-black">Tặng In Kỷ Yếu</span>
              </button>
            </div>
          </div>

          {/* Pricing Comparison Table */}
          <div className="overflow-x-auto pb-4">
            <table className="w-full min-w-[900px] bg-white rounded-3xl border border-[#E2D9C8] shadow-xl border-separate" style={{ borderSpacing: 0 }}>
              <thead>
                <tr>
                  <th className="p-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b-2 border-gray-100 rounded-tl-3xl bg-white">
                    Gói & Tính Năng
                  </th>
                  {pricingPlans.map((plan) => (
                    <th
                      key={plan.id}
                      className={`p-6 text-center border-b-2 border-gray-100 ${plan.isPopular ? 'bg-[#0A5480] text-white' : 'bg-white'} ${plan.id === 'unlimited' ? 'rounded-tr-3xl' : ''}`}
                    >
                      <span className={`inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full mb-3 ${plan.isPopular ? 'bg-[#F2C46A] text-[#0A5480]' : plan.badgeColor + ' text-white'}`}>
                        {plan.badge}
                      </span>
                      <div className={`text-2xl font-bold font-serif ${plan.isPopular ? 'text-white' : 'text-[#0A5480]'}`}>{plan.name}</div>
                      <div className={`text-xs mt-1 ${plan.isPopular ? 'text-white/70' : 'text-gray-400'}`}>{plan.sub}</div>
                      
                      <div className="mt-4 mb-4">
                        <span className={`text-3xl sm:text-4xl font-black ${plan.isPopular ? 'text-[#F7D890]' : 'text-[#0A5480]'}`}>{plan.price}</span>
                        <div className={`text-xs mt-1 ${plan.isPopular ? 'text-white/70' : 'text-gray-400'}`}>{plan.period}</div>
                      </div>

                      <button
                        onClick={() => openRegister(plan.id)}
                        className={`w-full py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all ${plan.isPopular ? 'bg-[#F2C46A] hover:bg-[#F7D890] text-[#0A5480] shadow-md hover:scale-[1.02]' : 'bg-[#F5E9D6] hover:bg-[#F2C46A]/50 text-[#0A5480]'}`}
                      >
                        Khởi Tạo Gói Này
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, idx) => {
                  if (row.divider) {
                    return (
                      <tr key={idx}>
                        <td colSpan={4} className="px-6 py-3.5 bg-[#F5E9D6] text-xs font-black text-[#881337] uppercase tracking-wider border-t border-[#E2D9C8]">
                          {row.label}
                        </td>
                      </tr>
                    );
                  }
                  const Icon = row.icon;
                  return (
                    <tr key={idx} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-6 py-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-[#0E6FA8] shrink-0" />
                          <span className="text-sm font-bold text-[#163247]">{row.label}</span>
                        </div>
                      </td>
                      {pricingPlans.map((plan) => (
                        <td key={plan.id} className={`px-6 py-4 text-center border-t border-gray-100 ${plan.isPopular ? 'bg-[#0A5480]/[0.03]' : ''}`}>
                          {row.type === 'value' ? (
                            <span className={`text-xs sm:text-sm font-bold ${plan.isPopular ? 'text-[#0A5480] font-black' : 'text-[#163247]'}`}>
                              {plan[row.key] || plan.features?.[row.key]}
                            </span>
                          ) : (
                            plan.features[row.key]
                              ? <Check className="w-5 h-5 text-[#059669] mx-auto" />
                              : <Minus className="w-4 h-4 text-gray-300 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 7. SOCIAL PROOF & TESTIMONIALS ────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-white border-t border-[#E2D9C8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A5480] font-serif">
              Được Tin Dùng Bởi Các Bậc Trưởng Lão
            </h2>
            <p className="text-sm sm:text-base text-[#5B7583]">
              Lắng nghe cảm nhận từ các Trưởng ban liên lạc và Hội đồng gia tộc trên khắp cả nước.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FDFBF7] p-8 rounded-3xl border border-[#E2D9C8] space-y-4">
              <div className="flex text-[#D97706]">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs sm:text-sm text-[#5B7583] leading-relaxed italic">
                "Nhờ có Gia Tộc Online, con cháu họ Trần chúng tôi ở Đức và Mỹ đã tìm về được đúng cội nguồn. Ngày giỗ Tổ chỉ cần gửi 1 tin Zalo là hàng trăm người tề tựu đông đủ."
              </p>
              <div className="pt-3 border-t border-[#E2D9C8]/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0A5480] text-[#F7D890] font-bold flex items-center justify-center text-sm">
                  Cụ T
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-[#163247]">Ông Trần Đình Toàn</div>
                  <div className="text-[11px] text-[#5B7583]">Trưởng Ban Liên Lạc Họ Trần Đình (Nghệ An)</div>
                </div>
              </div>
            </div>

            <div className="bg-[#FDFBF7] p-8 rounded-3xl border border-[#E2D9C8] space-y-4">
              <div className="flex text-[#D97706]">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs sm:text-sm text-[#5B7583] leading-relaxed italic">
                "Tôi rất ấn tượng với Bản đồ GPS lăng mộ. Các cháu thanh niên sinh ra ở thành phố lần đầu về quê thắp hương không còn sợ đi nhầm vị trí mộ các cụ."
              </p>
              <div className="pt-3 border-t border-[#E2D9C8]/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#881337] text-white font-bold flex items-center justify-center text-sm">
                  Cụ N
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-[#163247]">Ông Nguyễn Duy Tuấn</div>
                  <div className="text-[11px] text-[#5B7583]">Đại diện Dòng Họ Nguyễn Duy (Hà Nam)</div>
                </div>
              </div>
            </div>

            <div className="bg-[#FDFBF7] p-8 rounded-3xl border border-[#E2D9C8] space-y-4">
              <div className="flex text-[#D97706]">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs sm:text-sm text-[#5B7583] leading-relaxed italic">
                "Thủ quỹ dòng họ trước đây ghi chép sổ tay rất vất vả và dễ nhầm lẫn. Giờ đưa lên web minh bạch từng đồng công đức, con cháu ai cũng phấn khởi đóng góp."
              </p>
              <div className="pt-3 border-t border-[#E2D9C8]/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0E6FA8] text-white font-bold flex items-center justify-center text-sm">
                  Cụ L
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-[#163247]">Ông Lê Quang Khang</div>
                  <div className="text-[11px] text-[#5B7583]">Hội Đồng Tộc Biểu Họ Lê (Thanh Hóa)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ACCORDION SECTION ──────────────────────────────────── */}
      <section id="faq" className="py-20 bg-[#FBF7EF] border-t border-[#E2D9C8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A5480] font-serif">
              Câu Hỏi Thường Gặp
            </h2>
            <p className="text-sm sm:text-base text-[#5B7583]">
              Giải đáp các thắc mắc phổ biến của các dòng họ khi bắt đầu số hóa gia phả.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-[#E2D9C8] overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm sm:text-base text-[#0A5480] flex justify-between items-center gap-4 hover:bg-gray-50/50"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#D97706] shrink-0" />
                    {faq.q}
                  </span>
                  {openFaqIndex === idx ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {openFaqIndex === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#5B7583] leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. CTA BANNER HOÀNG KIM ───────────────────────────────────── */}
      <section className="bg-gradient-to-r from-[#0A5480] via-[#881337] to-[#0A5480] py-20 text-white relative overflow-hidden border-t border-[#D97706]/40">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif leading-tight">
            Gìn Giữ Gia Bảo — Lưu Truyền Huyết Thống<br />
            <span className="text-[#F7D890]">Khởi Tạo Website Ngay Hôm Nay</span>
          </h2>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            Đội ngũ chuyên gia sẵn sàng hỗ trợ dịch phả ký chữ Hán Nôm cổ, phục chế ảnh thờ tiền nhân và hỗ trợ nhập liệu cây gia phả trọn gói theo yêu cầu của dòng họ.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button
              onClick={() => openRegister('standard')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#F2C46A] hover:bg-[#F7D890] text-[#0A5480] font-black text-base rounded-full shadow-xl hover:scale-105 transition-all"
            >
              <Sparkles className="w-5 h-5 text-[#881337]" />
              <span>Khởi Tạo Website Dòng Họ (30s)</span>
            </button>
            <a
              href="https://hotrandinh.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-base rounded-full border border-white/30 transition-all"
            >
              <ExternalLink className="w-5 h-5 text-[#F7D890]" />
              <span>Xem Web Mẫu (hotrandinh.com)</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── 10. FOOTER HOÀNG GIA ──────────────────────────────────────── */}
      <footer className="bg-[#0F172A] text-white/60 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs sm:text-sm">
          <div>
            <div className="font-serif font-black text-xl text-[#F7D890] mb-2">Gia Tộc Online</div>
            <p className="text-white/60 leading-relaxed">
              Nền tảng số hóa và quản trị gia tộc đa dòng họ hàng đầu Việt Nam. Vận hành trên hạ tầng đám mây Antigravity tốc độ cao và bảo mật tối đa.
            </p>
          </div>

          <div>
            <div className="font-bold text-white mb-3 uppercase tracking-wider text-xs">Liên Kết Nhanh</div>
            <ul className="space-y-2">
              <li><a href="#demo-tree" className="hover:text-[#F7D890] transition-colors">Cây Phả Hệ Mẫu</a></li>
              <li><a href="#features" className="hover:text-[#F7D890] transition-colors">Tính Năng Cốt Lõi</a></li>
              <li><a href="#pricing" className="hover:text-[#F7D890] transition-colors">Bảng Giá Bản Quyền</a></li>
              <li><Link to="/huong-dan-thiet-lap" className="hover:text-[#F7D890] transition-colors">Hướng Dẫn Thiết Lập</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-white mb-3 uppercase tracking-wider text-xs">Tổng Đài Tư Vấn & Hỗ Trợ</div>
            <div className="space-y-2 text-white/70">
              <div>Hotline / Zalo: <span className="text-[#F7D890] font-bold">09xx.xxx.xxx</span></div>
              <div>Email: <span className="text-white font-bold">hotro@giatoc.online</span></div>
              <div>Hỗ trợ kỹ thuật 24/7 trên toàn quốc và hải ngoại.</div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-white/10 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} giatoc.online. Bản quyền thuộc về Nền Tảng Quản Trị Gia Tộc Đa Dòng Họ.
        </div>
      </footer>

      {/* Registration Modal (VietQR 24/7 Auto Provisioning) */}
      <RegistrationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        preselectedPlan={selectedPlan}
        preselectedSlug={quickSlug}
      />
    </div>
  );
}
