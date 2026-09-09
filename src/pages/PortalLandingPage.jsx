import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Shield, TreePine, MapPin, DollarSign, Users, CheckCircle,
  ArrowRight, ExternalLink, Phone, Check, Bot, Send, Star, ShieldCheck, HeartHandshake,
  Minus, Zap, Globe, Database, UserCog, MessageSquare, Search, Lock,
  Flame, Award, BookOpen, ChevronDown, ChevronUp, Compass, HelpCircle,
  Navigation, Smartphone, FileText, CheckCheck, Landmark, ShieldAlert, Cpu
} from 'lucide-react';
import RegistrationModal from '../components/RegistrationModal';

export default function PortalLandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [quickSlug, setQuickSlug] = useState('');
  const [billingCycle, setBillingCycle] = useState('1year'); // '1year' | '2years' | '5years'
  const [demoActiveTab, setDemoActiveTab] = useState('tree'); // 'tree' | 'map' | 'zns'
  const [selectedMember, setSelectedMember] = useState(null);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Dữ liệu dòng họ mẫu cho Interactive Mini Tree
  const SAMPLE_MEMBERS = [
    {
      id: 'm1', name: 'Cụ Thủy Tổ: Nguyễn Duy Hoan', gen: 1, years: '1830 - 1902', role: '👑 Cụ Thủy Tổ Khai Sáng',
      branch: 'Toàn Tộc', lunarDeath: '15/08 Âm Lịch', solarDeath: '04/10 Dương Lịch', tomb: 'Khu Lăng Mộ Tổ Núi Rồng (GPS: 20.4382, 105.9123)',
      phone: '0912 888 678', bio: 'Khởi thủy khai hoang lập ấp, đỗ Tú tài triều Nguyễn, khai sáng nền móng từ đường đại tộc.'
    },
    {
      id: 'm2', name: 'Cụ Nguyễn Duy Trác', gen: 2, years: '1862 - 1935', role: 'Trưởng Chi Nhất',
      branch: 'Chi 1 (Chi Trưởng)', lunarDeath: '03/03 Âm Lịch', solarDeath: '18/04 Dương Lịch', tomb: 'Nghĩa Trang Dòng Họ Khu A (Mộ số 12)',
      phone: '0983 555 123', bio: 'Tiếp quản từ đường chi trưởng, gìn giữ 3 tập gia phả cổ chữ Hán Nôm.'
    },
    {
      id: 'm3', name: 'Cụ Nguyễn Duy Thành', gen: 2, years: '1868 - 1941', role: 'Trưởng Chi Nhị',
      branch: 'Chi 2 (Chi Thứ)', lunarDeath: '19/11 Âm Lịch', solarDeath: '28/12 Dương Lịch', tomb: 'Khu Lăng Mộ Chi 2 Cánh Đồng Mới',
      phone: '0904 333 789', bio: 'Phát triển nghề truyền thống, lập quỹ khuyến học đầu tiên của dòng tộc.'
    },
    {
      id: 'm4', name: 'Nguyễn Duy Huỳnh', gen: 3, years: '1895 - 1970', role: 'Cụ Đời 3 (Chi 1)',
      branch: 'Chi 1', lunarDeath: '10/06 Âm Lịch', solarDeath: '12/07 Dương Lịch', tomb: 'Nghĩa trang liệt sĩ địa phương',
      phone: '0918 111 222', bio: 'Tham gia kháng chiến cứu quốc, để lại nhiều thư tịch lịch sử quý báu.'
    },
    {
      id: 'm5', name: 'Nguyễn Duy Tuấn', gen: 4, years: 'Sinh năm 1960', role: 'Trưởng Ban Liên Lạc',
      branch: 'Chi 1', lunarDeath: 'Đang sinh sống', solarDeath: '', tomb: 'Từ Đường Chi Trưởng (Hà Nam)',
      phone: '0912 345 678', bio: 'Chủ trì đại tu Từ đường năm 2024, phụ trách số hóa gia phả lên giatoc.online.'
    },
  ];

  // Danh sách các mộ phần cho Tab Bản Đồ GPS
  const SAMPLE_TOMBS = [
    { id: 1, title: 'Lăng Mộ Cụ Thủy Tổ (Núi Rồng)', lat: '20°26\'17.5"N', lng: '105°54\'44.3"E', dist: '1.2 km', desc: 'Mộ đá xanh nguyên khối thời Nguyễn, có nhà bia ghi công trạng.' },
    { id: 2, title: 'Khu Lăng Mộ Chi Trưởng (Khu A)', lat: '20°26\'22.1"N', lng: '105°54\'50.8"E', dist: '1.8 km', desc: 'Quy tập 18 ngôi mộ tiền nhân, khuôn viên 450m² có tường bao.' },
    { id: 3, title: 'Từ Đường Đại Tộc & Bàn Thờ Số', lat: '20°26\'10.4"N', lng: '105°54\'35.2"E', dist: 'Cách trung tâm 500m', desc: 'Nhà gỗ 5 gian lim cổ kính, nơi tế tự chính của dòng họ.' },
  ];

  // 3 Gói Dịch Vụ SaaS cốt lõi (theo đúng yêu cầu kinh doanh)
  const pricingPlans = [
    {
      id: 'basic',
      name: 'GÓI CƠ BẢN',
      target: 'Chi họ nhỏ / Nhánh gia đình',
      price: billingCycle === '1year' ? '590.000đ' : billingCycle === '2years' ? '1.060.000đ' : '2.210.000đ',
      period: billingCycle === '1year' ? '/ năm' : billingCycle === '2years' ? '/ 2 năm (-10%)' : '/ 5 năm (-25%)',
      badge: 'Tiết Kiệm',
      badgeColor: 'bg-slate-700 text-white',
      members: '≤ 300 thành viên',
      admins: '2 Quản trị viên',
      storage: '2 GB NVMe High-Speed',
      domain: 'Tên miền con [slug].giatoc.online',
      zns: '50 tin Zalo ZNS báo giỗ',
      features: {
        tree: true,
        map: true,
        finance: true,
        privacy: true,
        excel: false,
        ai: false,
        altar: false,
        domainCustom: false,
        support: 'Hỗ trợ Ticket / Email 24/7'
      }
    },
    {
      id: 'standard',
      name: 'GÓI TIÊU CHUẨN',
      target: 'Dòng họ quy mô vừa & phổ biến',
      price: billingCycle === '1year' ? '1.290.000đ' : billingCycle === '2years' ? '2.320.000đ' : '4.830.000đ',
      period: billingCycle === '1year' ? '/ năm' : billingCycle === '2years' ? '/ 2 năm (-10%)' : '/ 5 năm (-25%)',
      badge: 'Phổ Biến Nhất ★',
      badgeColor: 'bg-amber-600 text-white',
      isPopular: true,
      members: '≤ 1.500 thành viên',
      admins: '5 Quản trị viên (Phân theo Chi)',
      storage: '10 GB NVMe High-Speed',
      domain: 'Tên miền con [slug].giatoc.online',
      zns: '200 tin Zalo ZNS báo giỗ',
      features: {
        tree: true,
        map: true,
        finance: true,
        privacy: true,
        excel: true,
        ai: true,
        altar: false,
        domainCustom: false,
        support: 'Hotline & Zalo ưu tiên'
      }
    },
    {
      id: 'unlimited',
      name: 'ĐẠI TỘC / VƯƠNG GIẢ',
      target: 'Đại tộc toàn quốc / Đa chi phái',
      price: billingCycle === '1year' ? '2.490.000đ' : billingCycle === '2years' ? '4.480.000đ' : '9.330.000đ',
      period: billingCycle === '1year' ? '/ năm' : billingCycle === '2years' ? '/ 2 năm (-10%)' : '/ 5 năm (Tặng Sách In)',
      badge: 'Vương Giả',
      badgeColor: 'bg-[#881337] text-white',
      members: '≤ 5.000 thành viên',
      admins: '15 Quản trị viên (Chi + Kế toán)',
      storage: '30 GB NVMe High-Speed',
      domain: 'TẶNG GẮN TÊN MIỀN RIÊNG .COM/.VN',
      zns: '500 tin Zalo ZNS báo giỗ',
      features: {
        tree: true,
        map: true,
        finance: true,
        privacy: true,
        excel: true,
        ai: true,
        altar: true,
        domainCustom: true,
        support: 'Chuyên viên 1-1 + Nhập liệu trọn gói'
      }
    }
  ];

  const comparisonRows = [
    { key: 'members', label: 'Quy mô số lượng con cháu', icon: Users, type: 'value' },
    { key: 'admins', label: 'Tài khoản Ban Quản Trị (RBAC)', icon: UserCog, type: 'value' },
    { key: 'storage', label: 'Dung lượng lưu trữ ảnh & kỷ yếu', icon: Database, type: 'value' },
    { key: 'domain', label: 'Tên miền hoạt động', icon: Globe, type: 'value' },
    { key: 'zns', label: 'Tin nhắn Zalo ZNS báo giỗ tự động', icon: MessageSquare, type: 'value' },
    { divider: true, label: 'Ma Trận Tính Năng Chuyên Sâu' },
    { key: 'tree', label: 'Sơ đồ phả hệ tương tác (Chống lặp DAG)', icon: TreePine, type: 'feature' },
    { key: 'map', label: 'Bản đồ lăng mộ vệ tinh GPS & chỉ đường', icon: MapPin, type: 'feature' },
    { key: 'finance', label: 'Sổ quỹ minh bạch & Bảng vàng công đức', icon: DollarSign, type: 'feature' },
    { key: 'privacy', label: 'Cổng bảo vệ số điện thoại con cháu (3 lớp)', icon: ShieldCheck, type: 'feature' },
    { key: 'excel', label: 'Import Excel 1-click & Xuất GEDCOM quốc tế', icon: Zap, type: 'feature' },
    { key: 'ai', label: 'Trợ lý AI xưng hô & Dịch phả ký Hán Nôm', icon: Bot, type: 'feature' },
    { key: 'altar', label: 'Bàn thờ số & Tưởng niệm cho con cháu xa xứ', icon: Flame, type: 'feature' },
    { key: 'domainCustom', label: 'Hỗ trợ Gắn Tên Miền Riêng độc lập', icon: Landmark, type: 'feature' },
    { key: 'support', label: 'Tiêu chuẩn hỗ trợ kỹ thuật', icon: HeartHandshake, type: 'value' },
  ];

  // 5 Câu hỏi thường gặp chuẩn SEO
  const FAQS = [
    {
      q: 'Dữ liệu gia phả của dòng họ có sợ bị mất hoặc rò rỉ ra bên ngoài không?',
      a: 'Tuyệt đối an toàn. Hệ thống sử dụng kiến trúc Multi-Tenant với cơ chế cô lập dữ liệu theo từng dòng họ (Row-Level Security và Database Isolation). Dữ liệu được sao lưu định kỳ hàng ngày (Automated Backup) lên hạ tầng NVMe an toàn. Thông tin cá nhân như SĐT, địa chỉ được bảo vệ bởi Cổng Riêng Tư 3 Lớp, chỉ con cháu đã được xác thực mới có quyền xem.'
    },
    {
      q: 'Dòng họ đã có sẵn file Excel hoặc gia phả giấy cũ thì nhập liệu thế nào?',
      a: 'Hệ thống cung cấp sẵn file mẫu Excel chuẩn hóa. Bạn chỉ cần điền danh sách thành viên và nhấn Tải Lên. Thuật toán kiểm tra chu trình đồ thị (DAG Cycle Detector) sẽ tự động kiểm tra tính hợp lệ và vẽ nên cây phả hệ hoàn chỉnh trong 30 giây. Ngoài ra, với gói Đại Tộc, đội ngũ kỹ thuật viên của Gia Tộc Online sẽ hỗ trợ nhập liệu và số hóa phả ký trọn gói.'
    },
    {
      q: 'Dòng họ có thể gắn tên miền riêng độc lập (như hotrandinh.com) không?',
      a: 'Hoàn toàn có thể. Với gói Đại Tộc (hoặc tùy chọn nâng cao), hệ thống hỗ trợ cấu hình tên miền riêng độc lập (vd: hotrandinh.com, honguyenduy.vn). Máy chủ định tuyến Caddy v2 tích hợp On-Demand TLS sẽ tự động cấp phát chứng chỉ bảo mật SSL miễn phí trọn đời chỉ sau vài phút trỏ CNAME.'
    },
    {
      q: 'Sau khi thanh toán qua VietQR, bao lâu thì nhận được website dòng họ?',
      a: 'Hệ thống tích hợp cổng Webhook ngân hàng tự động 100%. Ngay sau khi bạn quét mã VietQR thành công trên ứng dụng Mobile Banking, hệ thống sẽ cấp phát cơ sở dữ liệu, kích hoạt tên miền con [slug].giatoc.online và gửi tài khoản Quản trị viên tối cao tới bạn trong vòng 30 giây.'
    },
    {
      q: 'Con cháu đang sinh sống và làm việc ở nước ngoài có truy cập được không?',
      a: 'Hoàn toàn mượt mà. giatoc.online được tối ưu hóa tải trang qua mạng lưới CDN toàn cầu. Con cháu ở Mỹ, Châu Âu, Nhật Bản hay bất kỳ nơi nào trên thế giới đều có thể truy cập nhanh chóng trên điện thoại để tra cứu phả hệ, thắp nén nhang số tri ân tổ tiên hoặc nhận thông báo ngày giỗ tổ qua Zalo.'
    }
  ];

  // JSON-LD Schema Markup chuẩn SEO (Organization & FAQPage)
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://giatoc.online/#organization",
        "name": "Gia Tộc Online",
        "url": "https://giatoc.online",
        "logo": "https://giatoc.online/media/brand/logo-icon.png",
        "description": "Nền tảng SaaS quản trị gia tộc và số hóa gia phả trực tuyến đa dòng họ số 1 Việt Nam.",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+84-912-345-678",
          "contactType": "customer service",
          "areaServed": "VN",
          "availableLanguage": "Vietnamese"
        }
      },
      {
        "@type": "SoftwareApplication",
        "name": "Phần Mềm Quản Lý Gia Tộc & Số Hóa Gia Phả giatoc.online",
        "operatingSystem": "Web, Mobile, Desktop",
        "applicationCategory": "BusinessApplication, GenealogySoftware",
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "VND",
          "lowPrice": "590000",
          "highPrice": "2490000",
          "offerCount": "3"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://giatoc.online/#faq",
        "mainEntity": FAQS.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      }
    ]
  };

  const openRegister = (planId = 'standard') => {
    setSelectedPlan(planId);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* ── JSON-LD SCHEMA MARKUP CHUẨN SEO ──────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      {/* ── 1. HEADER (NAVIGATION BAR) ───────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[74px] flex items-center justify-between">
          
          {/* Logo Gia Tộc cách điệu */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-[#0F172A] text-amber-400 flex items-center justify-center font-serif font-black text-lg border border-amber-500/40 shadow-sm group-hover:border-amber-400 transition-colors">
              GT
            </div>
            <div className="leading-tight">
              <div className="text-xl font-extrabold text-[#0F172A] tracking-tight font-serif flex items-center gap-1">
                Gia Tộc Online
                <span className="text-[10px] uppercase font-sans font-black bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded ml-1">SaaS</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-500 tracking-wider">Số Hóa Gia Phả Đa Dòng Họ</div>
            </div>
          </a>

          {/* Menu Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <a href="#demo-tree" className="hover:text-amber-600 transition-colors">Cây Phả Hệ Mẫu</a>
            <a href="#core-features" className="hover:text-amber-600 transition-colors">Tính Năng Cốt Lõi</a>
            <a href="#demo-tree" onClick={() => setDemoActiveTab('map')} className="hover:text-amber-600 transition-colors">Bản Đồ GPS</a>
            <a href="#pricing" className="hover:text-amber-600 transition-colors">Bảng Giá</a>
            <a href="#faq" className="hover:text-amber-600 transition-colors">Hỏi Đáp</a>
            <Link
              to="/demo"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-300/60 hover:bg-amber-100 transition-colors text-xs font-bold shadow-sm"
            >
              <span>Xem Live Demo (Sandbox)</span> <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            </Link>
          </nav>

          {/* Action CTA Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="text-xs sm:text-sm font-bold text-slate-700 hover:text-[#0F172A] px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Đăng Nhập
            </Link>
            <button
              onClick={() => openRegister('standard')}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 border border-slate-700"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Khởi Tạo Web Dòng Họ (30s)</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-[74px]">

        {/* ── 2. HERO SECTION (TỐI ƯU SEO & CHUYỂN ĐỔI) ────────────────── */}
        <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-slate-100/60 via-[#F8FAFC] to-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto text-center space-y-7 relative z-10">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm text-xs sm:text-sm font-semibold text-slate-700">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Nền Tảng Quản Trị Gia Tộc Đa Dòng Họ Số 1 Việt Nam</span>
            </div>

            {/* H1 Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0F172A] font-serif leading-[1.15] tracking-tight">
              Số Hóa Gia Phả —<br />
              <span className="text-amber-600 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 bg-clip-text text-transparent">
                Kết Nối Huyết Thống Muôn Đời
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Giải pháp lưu truyền di sản tổ tiên toàn diện: <strong>Sơ đồ phả hệ tương tác vô hạn</strong>, <strong>Bản đồ lăng mộ GPS vệ tinh</strong>, <strong>Sổ quỹ minh bạch</strong> và <strong>Tin nhắn Zalo ZNS báo giỗ tự động</strong>.
            </p>

            {/* Form kích hoạt nhanh Subdomain */}
            <div className="max-w-2xl mx-auto pt-2">
              <div className="bg-white rounded-2xl border border-slate-300 shadow-md p-2 flex flex-col sm:flex-row items-center gap-2 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
                <div className="flex items-center flex-1 w-full pl-3">
                  <Search className="w-5 h-5 text-amber-600 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Nhập tên dòng họ (vd: nguyenduy, lequang, hotran)..."
                    value={quickSlug}
                    onChange={(e) => setQuickSlug(e.target.value.toLowerCase().replace(/[^a-z0-9\-]/g, ''))}
                    className="w-full py-2.5 bg-transparent text-[#0F172A] text-sm sm:text-base font-bold outline-none placeholder:text-slate-400 placeholder:font-normal"
                  />
                  <span className="hidden sm:inline-block text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg mr-2 shrink-0">
                    .giatoc.online
                  </span>
                </div>
                <button
                  onClick={() => openRegister('standard')}
                  className="w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Kiểm Tra & Tạo Web</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {quickSlug && (
                <div className="mt-3 text-xs sm:text-sm font-semibold text-emerald-600 flex items-center justify-center gap-1.5 animate-fade-in">
                  <CheckCircle className="w-4 h-4" />
                  <span>Tên miền con <strong>{quickSlug}.giatoc.online</strong> khả dụng! Nhấn Tạo Web để kích hoạt.</span>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-xs sm:text-sm text-slate-600 font-semibold pt-4">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-600" /> 250+ Dòng họ đã số hóa</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-600" /> 120.000+ Con cháu kết nối</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-600" /> Bảo mật 3 lớp & Chống lặp DAG</span>
            </div>

            {/* Visual Mockup: Sơ đồ gia phả đa thiết bị (Desktop & Mobile) */}
            <div className="pt-8 max-w-4xl mx-auto">
              <div className="relative mx-auto rounded-2xl p-2 bg-slate-200/80 border border-slate-300 shadow-xl">
                <div className="bg-[#0F172A] rounded-xl p-4 sm:p-6 text-white text-left overflow-hidden relative">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                      <span className="text-slate-300 font-mono text-xs ml-2 hidden sm:inline">https://hotrandinh.giatoc.online</span>
                    </div>
                    <span className="text-amber-400 font-bold flex items-center gap-1 text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5" /> Bản Quyền Đã Xác Thực
                    </span>
                  </div>

                  <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-amber-500/30 max-w-sm w-full">
                      <div className="text-[10px] uppercase tracking-wider text-amber-400 font-black">Cụ Khởi Thủy Đời 1</div>
                      <div className="font-serif font-black text-lg text-white mt-0.5">CỤ TRẦN ĐÌNH VĂN</div>
                      <div className="text-xs text-slate-400">1820 - 1895 • Giỗ 15/08 Âm Lịch</div>
                    </div>
                    <div className="w-0.5 h-6 bg-amber-500/40" />
                    <div className="grid grid-cols-2 gap-3 max-w-md w-full">
                      <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700 text-xs">
                        <div className="text-[10px] text-slate-400">Chi Trưởng (Đời 2)</div>
                        <div className="font-bold text-white">Trần Đình Toàn</div>
                      </div>
                      <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700 text-xs">
                        <div className="text-[10px] text-slate-400">Chi Thứ (Đời 2)</div>
                        <div className="font-bold text-white">Trần Đình Đức</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── 3. INTERACTIVE DEMO SHOWCASE (TAB UI - KHÔNG LOAD TRANG) ────── */}
        <section id="demo-tree" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold border border-amber-200">
              <Sparkles className="w-3.5 h-3.5" /> Trải Nghiệm Trực Quan Không Cần Đăng Nhập
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] font-serif">
              Trải Nghiệm Trực Tiếp Tính Năng Lõi
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Chuyển đổi giữa 3 tab để khám phá cách con cháu tra cứu cây phả hệ, định vị lăng mộ vệ tinh và nhận thông báo giỗ tổ Zalo tự động.
            </p>
          </div>

          {/* Interactive Demo Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
            
            {/* Toolbar Tab Switcher */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-amber-600" />
                <span className="text-[#0F172A] font-bold">Dòng Họ Mẫu: Nguyễn Duy (Chi Trưởng & Chi Thứ)</span>
              </div>

              {/* 3 Tabs */}
              <div className="flex items-center bg-slate-200/70 p-1 rounded-xl gap-1">
                <button
                  onClick={() => setDemoActiveTab('tree')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${demoActiveTab === 'tree' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-700 hover:bg-white/60'}`}
                >
                  <TreePine className="w-3.5 h-3.5 text-amber-400" /> Tab 1: Cây Phả Hệ
                </button>
                <button
                  onClick={() => setDemoActiveTab('map')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${demoActiveTab === 'map' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-700 hover:bg-white/60'}`}
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" /> Tab 2: Bản Đồ Mộ GPS
                </button>
                <button
                  onClick={() => setDemoActiveTab('zns')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${demoActiveTab === 'zns' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-700 hover:bg-white/60'}`}
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" /> Tab 3: Báo Giỗ Zalo ZNS
                </button>
              </div>
            </div>

            {/* Tab Contents Area */}
            <div className="p-6 sm:p-10 bg-slate-50/40 min-h-[440px] flex flex-col items-center justify-center relative">
              
              {/* TAB 1: CÂY PHẢ HỆ TƯƠNG TÁC */}
              {demoActiveTab === 'tree' && (
                <div className="w-full space-y-6 animate-fade-in">
                  <div className="text-center text-xs text-slate-500 font-medium">
                    (Nhấp chuột vào bất kỳ thành viên nào dưới đây để xem chi tiết tiểu sử và trải nghiệm Cổng che số điện thoại)
                  </div>

                  {/* Level 1: Cụ Thủy Tổ */}
                  <div className="flex justify-center">
                    <div
                      onClick={() => setSelectedMember(SAMPLE_MEMBERS[0])}
                      className="cursor-pointer group p-4 bg-white hover:bg-amber-50/60 rounded-xl border-2 border-amber-500 shadow-sm hover:shadow-md transition-all max-w-sm text-center relative"
                    >
                      <span className="bg-amber-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                        Đời 1 • Cụ Khai Khái
                      </span>
                      <div className="font-serif font-black text-lg text-[#0F172A] mt-1.5 group-hover:text-amber-700 transition-colors">
                        {SAMPLE_MEMBERS[0].name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{SAMPLE_MEMBERS[0].years} • Giỗ: {SAMPLE_MEMBERS[0].lunarDeath}</div>
                      <div className="mt-2 text-[11px] font-bold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-md inline-block">
                        📍 Nhấn xem Mộ Tổ GPS & Tiểu Sử
                      </div>
                    </div>
                  </div>

                  {/* Dây nối phả hệ */}
                  <div className="w-0.5 h-5 bg-slate-300 mx-auto" />

                  {/* Level 2: Chi Trưởng & Chi Thứ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <div
                      onClick={() => setSelectedMember(SAMPLE_MEMBERS[1])}
                      className="cursor-pointer group p-4 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 hover:border-amber-500 shadow-sm transition-all text-center"
                    >
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Đời 2 • Chi 1 (Trưởng)</span>
                      <div className="font-serif font-bold text-base text-[#0F172A] mt-1 group-hover:text-amber-700 transition-colors">{SAMPLE_MEMBERS[1].name}</div>
                      <div className="text-xs text-slate-500">{SAMPLE_MEMBERS[1].years}</div>
                    </div>

                    <div
                      onClick={() => setSelectedMember(SAMPLE_MEMBERS[2])}
                      className="cursor-pointer group p-4 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 hover:border-amber-500 shadow-sm transition-all text-center"
                    >
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Đời 2 • Chi 2 (Thứ)</span>
                      <div className="font-serif font-bold text-base text-[#0F172A] mt-1 group-hover:text-amber-700 transition-colors">{SAMPLE_MEMBERS[2].name}</div>
                      <div className="text-xs text-slate-500">{SAMPLE_MEMBERS[2].years}</div>
                    </div>
                  </div>

                  {/* Level 3: Con cháu kế tiếp */}
                  <div className="flex justify-center pt-2">
                    <div
                      onClick={() => setSelectedMember(SAMPLE_MEMBERS[4])}
                      className="cursor-pointer p-3 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 text-center max-w-xs shadow-sm hover:border-amber-500 transition-all"
                    >
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Đời 4 • Trưởng Ban Liên Lạc</span>
                      <div className="font-bold text-sm text-[#0F172A] mt-0.5">{SAMPLE_MEMBERS[4].name}</div>
                      <div className="text-[11px] text-slate-500">Đang sinh sống • SĐT được bảo vệ 3 lớp</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BẢN ĐỒ MỘ PHẦN GPS */}
              {demoActiveTab === 'map' && (
                <div className="w-full max-w-3xl space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {SAMPLE_TOMBS.map(tomb => (
                      <div key={tomb.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2 text-left">
                        <div className="flex items-center gap-2 text-amber-600 font-bold text-xs">
                          <MapPin className="w-4 h-4" />
                          <span>{tomb.dist}</span>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-[#0F172A]">{tomb.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{tomb.desc}</p>
                        <div className="pt-2 text-[11px] font-mono text-slate-700 bg-slate-100 p-1.5 rounded flex items-center justify-between">
                          <span>{tomb.lat}</span>
                          <span className="text-emerald-700 font-bold">GPS Khớp</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-left space-y-1">
                      <div className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-amber-600" /> Tích Hợp Chỉ Đường Google Maps Cho Từng Mộ Phần
                      </div>
                      <p className="text-xs text-slate-500">
                        Con cháu chỉ cần quét mã QR trên điện thoại hoặc mở app web là được dẫn đường bằng GPS vệ tinh tới tận chân lăng mộ.
                      </p>
                    </div>
                    <a
                      href="https://hotrandinh.com"
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shrink-0 flex items-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Xem Bản Đồ Thực Tế
                    </a>
                  </div>
                </div>
              )}

              {/* TAB 3: BÁO GIỖ ZALO ZNS */}
              {demoActiveTab === 'zns' && (
                <div className="w-full max-w-md space-y-3 animate-fade-in">
                  <div className="p-5 bg-white rounded-2xl border border-slate-300 shadow-lg text-left space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#0068FF] text-white flex items-center justify-center text-xs font-black">Z</div>
                        <div>
                          <div className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                            Gia Tộc Online <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                          </div>
                          <div className="text-[10px] text-slate-400">Zalo Official Account Đã Xác Thực</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">Gửi tự động 100%</span>
                    </div>

                    <div className="text-xs text-slate-700 space-y-1.5">
                      <div className="font-bold text-[#0F172A]">Kính gửi: Ông Nguyễn Duy Tuấn (Chi 1)</div>
                      <p className="text-slate-600 leading-relaxed">
                        Ban liên lạc Dòng họ xin trân trọng kính báo: <strong>Lễ Giỗ Tổ Cụ Thủy Tổ Nguyễn Duy Hoan</strong> sẽ diễn ra vào ngày <strong>15/08 Âm Lịch (Chủ Nhật, 04/10 Dương Lịch)</strong> tại Từ Đường Đại Tộc.
                      </p>
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] space-y-1">
                        <div>⏰ Thời gian tế lễ: <strong>08h30 Sáng</strong></div>
                        <div>📍 Địa điểm: <strong>Từ Đường Đại Tộc, Tiên Điền</strong></div>
                        <div>👥 Dự kiến tề tựu: <strong>150+ con cháu</strong></div>
                      </div>
                    </div>

                    <div className="pt-2 grid grid-cols-2 gap-2">
                      <button className="py-2 bg-[#0F172A] text-white rounded-lg text-xs font-bold text-center hover:bg-slate-800">
                        Xác Nhận Tham Dự
                      </button>
                      <button className="py-2 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold text-center hover:bg-amber-200">
                        Xem Sơ Đồ Cúng Lễ
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Chi Tiết Thành Viên & Che Số Điện Thoại */}
            {selectedMember && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl relative animate-scale-up text-left">
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-2xl font-bold w-8 h-8 flex items-center justify-center"
                  >
                    &times;
                  </button>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-base border border-amber-300">
                      Đ{selectedMember.gen}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded">{selectedMember.role}</span>
                      <h3 className="font-serif font-bold text-xl text-[#0F172A]">{selectedMember.name}</h3>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm text-slate-700 border-y border-slate-200 py-3 my-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Năm sinh - năm mất:</span>
                      <span className="font-bold">{selectedMember.years}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ngày giỗ (Âm lịch):</span>
                      <span className="font-bold text-amber-700">{selectedMember.lunarDeath}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mộ phần GPS:</span>
                      <span className="font-bold text-slate-800 text-right">{selectedMember.tomb}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Số điện thoại liên lạc:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">0912 ••• 678</span>
                        <button
                          onClick={() => setShowPrivacyNotice(true)}
                          className="text-[11px] font-bold text-amber-700 hover:underline flex items-center gap-1"
                        >
                          <Lock className="w-3 h-3" /> Mở khóa
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 italic mb-5">"{selectedMember.bio}"</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelectedMember(null); openRegister('standard'); }}
                      className="flex-1 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl"
                    >
                      Tạo Web Dòng Họ Của Bạn
                    </button>
                    <button
                      onClick={() => setSelectedMember(null)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Modal Notice */}
            {showPrivacyNotice && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-[#0F172A]">Cổng Bảo Mật Riêng Tư 3 Lớp</h4>
                  <p className="text-xs text-slate-600 leading-relaxed text-left">
                    Nhằm bảo vệ số điện thoại và địa chỉ của con cháu khỏi bị đánh cắp, toàn bộ thông tin liên lạc mặc định sẽ được che mờ. Chỉ có thành viên con cháu đã được Trưởng họ xác thực danh tính mới xem được số đầy đủ.
                  </p>
                  <button
                    onClick={() => setShowPrivacyNotice(false)}
                    className="w-full py-2.5 bg-[#0F172A] text-white rounded-xl font-bold text-xs hover:bg-slate-800"
                  >
                    Tôi Đã Hiểu
                  </button>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* ── 4. CORE FEATURES (6 CHỨC NĂNG CỐT LÕI - GRID 2x3) ──────────── */}
        <section id="core-features" className="py-20 sm:py-24 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center mb-16 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold border border-amber-200">
                <Award className="w-3.5 h-3.5" /> Nền Tảng Chuyên Sâu Cho Phong Tục Dòng Họ Việt
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] font-serif">
                6 Chức Năng Cốt Lõi Vượt Trội
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
                Tất cả công cụ cần thiết để quản trị dòng họ hiện đại, minh bạch và gắn kết huyết thống muôn đời.
              </p>
            </div>

            {/* Grid 2x3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              
              {/* Feature 1 */}
              <article className="p-6 sm:p-8 bg-[#F8FAFC] rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-amber-600 flex items-center justify-center shadow-sm">
                  <TreePine className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-serif text-[#0F172A]">
                  1. Sơ Đồ Phả Hệ Vô Hạn Thế Hệ
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Cây phả hệ đa tầng, hỗ trợ hàng trăm thế hệ. Tích hợp thuật toán DAG chống lỗi lặp quan hệ cha-con, xuất kỷ yếu in ấn vector A4/A3 sắc nét, hỗ trợ Import Excel & GEDCOM chuẩn quốc tế.
                </p>
              </article>

              {/* Feature 2 */}
              <article className="p-6 sm:p-8 bg-[#F8FAFC] rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-amber-600 flex items-center justify-center shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-serif text-[#0F172A]">
                  2. Bản Đồ Lăng Mộ Vệ Tinh GPS
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Định vị chính xác từng vị trí lăng mộ tổ tiên, nhà thờ các chi họ bằng tọa độ GPS vệ tinh. Con cháu ở xa mở điện thoại là được dẫn đường tận nơi qua Google Maps.
                </p>
              </article>

              {/* Feature 3 */}
              <article className="p-6 sm:p-8 bg-[#F8FAFC] rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-amber-600 flex items-center justify-center shadow-sm">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-serif text-[#0F172A]">
                  3. Quỹ Họ & Báo Giỗ Zalo ZNS
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Minh bạch toàn bộ thu chi, quỹ khuyến học, đóng góp xây từ đường kèm ảnh hóa đơn thực tế. Tự động gửi tin nhắn Zalo thông báo ngày giỗ tổ và họp họ chỉ với 1 click.
                </p>
              </article>

              {/* Feature 4 */}
              <article className="p-6 sm:p-8 bg-[#F8FAFC] rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-amber-600 flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-serif text-[#0F172A]">
                  4. Bảo Mật & Cổng Riêng Tư
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Ma trận phân quyền RBAC 5 cấp (Super Admin, Trưởng Họ, Trưởng Chi, Bãi Biện/Kế toán, Con Cháu). Mặc định ẩn số điện thoại người còn sống, bảo vệ dữ liệu gia tộc 3 lớp.
                </p>
              </article>

              {/* Feature 5 */}
              <article className="p-6 sm:p-8 bg-[#F8FAFC] rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-amber-600 flex items-center justify-center shadow-sm">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-serif text-[#0F172A]">
                  5. Trợ Lý AI & Dịch Phả Ký
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Trợ lý AI thông minh giúp con cháu tra cứu xưng hô đúng vai vế họ hàng, giải nghĩa văn khấn cổ truyền và hỗ trợ chuyển ngữ phả ký chữ Hán Nôm sang Quốc ngữ chuẩn xác.
                </p>
              </article>

              {/* Feature 6 */}
              <article className="p-6 sm:p-8 bg-[#F8FAFC] rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-amber-600 flex items-center justify-center shadow-sm">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-serif text-[#0F172A]">
                  6. Bàn Thờ Số & Tưởng Niệm
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Không gian tâm linh trang trọng cho con cháu xa quê thắp nén nhang số, dâng hoa tưởng niệm tiền nhân, lưu lại lời nguyện cầu tri ân và đọc văn khấn âm lịch mọi lúc mọi nơi.
                </p>
              </article>

            </div>

            {/* ── VALUE DELIVERABLES (KHUNG CHECKLIST TRỰC QUAN) ─────────── */}
            <div className="mt-14 p-6 sm:p-8 bg-slate-900 text-white rounded-2xl shadow-lg border border-slate-800">
              <div className="text-center mb-6">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Cam Kết Dịch Vụ SaaS</span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif mt-1 text-white">
                  Giá Trị Bàn Giao Vượt Trội Cho Mọi Dòng Họ
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs sm:text-sm">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Sẵn sàng trong 30s:</strong> Tự động cấp web sau thanh toán VietQR</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Tên miền riêng độc lập:</strong> Hỗ trợ .com, .vn có chứng chỉ SSL</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Hỗ trợ nhập liệu trọn gói:</strong> Nhập Excel & dịch phả ký cổ</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Sao lưu 24/7 vĩnh viễn:</strong> Đám mây tốc độ cao, không lo mất dữ liệu</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Xuất kỷ yếu vector:</strong> Dàn trang sách in ấn A4/A3 chuyên nghiệp</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── 5. PRICING TABLE (BẢNG GIÁ SAAS 3 TẦNG) ────────────────────── */}
        <section id="pricing" className="py-20 sm:py-28 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center mb-12 space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] font-serif">
                Bảng Giá Bản Quyền Dịch Vụ
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
                Minh bạch • Kích hoạt tự động tức thì qua VietQR 24/7 • Bảo lưu dữ liệu vĩnh viễn
              </p>

              {/* Billing Cycle Toggle */}
              <div className="inline-flex items-center bg-white p-1 rounded-xl border border-slate-300 shadow-sm mt-4">
                <button
                  onClick={() => setBillingCycle('1year')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${billingCycle === '1year' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  1 Năm (Chuẩn)
                </button>
                <button
                  onClick={() => setBillingCycle('2years')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${billingCycle === '2years' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <span>2 Năm</span>
                  <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.5 rounded">Giảm 10%</span>
                </button>
                <button
                  onClick={() => setBillingCycle('5years')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${billingCycle === '5years' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-amber-700'}`}
                >
                  <span>5 Năm</span>
                  <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.5 rounded font-black">Tặng Kỷ Yếu</span>
                </button>
              </div>
            </div>

            {/* 3 Pricing Cards for Mobile/Tablet & Table for Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-2xl border p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                    plan.isPopular
                      ? 'bg-white border-amber-500 shadow-lg ring-2 ring-amber-500/20'
                      : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[11px] font-black px-3 py-0.5 rounded-full uppercase shadow-sm">
                      Phổ Biến Nhất ★
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-serif font-black text-xl text-[#0F172A]">{plan.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${plan.badgeColor}`}>
                        {plan.badge}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mb-4">{plan.target}</div>

                    <div className="mb-6">
                      <div className="text-3xl sm:text-4xl font-black text-[#0F172A] font-serif">{plan.price}</div>
                      <div className="text-xs text-slate-500 mt-1">{plan.period}</div>
                    </div>

                    <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 border-t border-slate-100 pt-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Quy mô: <strong>{plan.members}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserCog className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Ban Quản Trị: <strong>{plan.admins}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Lưu trữ: <strong>{plan.storage}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Tên miền: <strong>{plan.domain}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Báo giỗ ZNS: <strong>{plan.zns}</strong></span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => openRegister(plan.id)}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${
                      plan.isPopular
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-[#0F172A] hover:bg-slate-800 text-white'
                    }`}
                  >
                    Khởi Tạo Gói Này
                  </button>
                </div>
              ))}
            </div>

            {/* Chi Tiết So Sánh Đầy Đủ */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] bg-white rounded-2xl border border-slate-200 shadow-sm border-separate text-xs sm:text-sm" style={{ borderSpacing: 0 }}>
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-left font-bold border-b border-slate-200">
                    <th className="p-4 border-b border-slate-200">Bảng So Sánh Tính Năng Chi Tiết</th>
                    <th className="p-4 border-b border-slate-200 text-center">Gói Cơ Bản</th>
                    <th className="p-4 border-b border-slate-200 text-center bg-amber-50/50 text-amber-900">Gói Tiêu Chuẩn</th>
                    <th className="p-4 border-b border-slate-200 text-center">Gói Đại Tộc</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, idx) => {
                    if (row.divider) {
                      return (
                        <tr key={idx} className="bg-slate-100/70">
                          <td colSpan={4} className="px-4 py-2.5 font-bold text-[#0F172A] uppercase text-xs tracking-wider border-t border-slate-200">
                            {row.label}
                          </td>
                        </tr>
                      );
                    }
                    const Icon = row.icon;
                    return (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3 border-t border-slate-100 flex items-center gap-2 text-slate-800 font-medium">
                          <Icon className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{row.label}</span>
                        </td>
                        {pricingPlans.map((plan) => (
                          <td key={plan.id} className={`px-4 py-3 text-center border-t border-slate-100 ${plan.isPopular ? 'bg-amber-50/20' : ''}`}>
                            {row.type === 'value' ? (
                              <span className="font-semibold text-slate-700">
                                {plan[row.key] || plan.features?.[row.key]}
                              </span>
                            ) : (
                              plan.features[row.key]
                                ? <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                                : <Minus className="w-4 h-4 text-slate-300 mx-auto" />
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

        {/* ── 6. TESTIMONIALS & SOCIAL PROOF ────────────────────────────── */}
        <section className="py-20 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center mb-14 space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] font-serif">
                Được Tin Dùng Bởi Các Bậc Trưởng Lão
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Lắng nghe chia sẻ thực tế từ các Trưởng ban liên lạc và Hội đồng dòng họ trên toàn quốc.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              
              <div className="p-6 sm:p-8 bg-[#F8FAFC] rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "Nhờ có Gia Tộc Online, con cháu họ Trần chúng tôi ở Đức và Mỹ đã tìm về được đúng cội nguồn. Ngày giỗ Tổ chỉ cần gửi 1 tin Zalo là hàng trăm người tề tựu đông đủ."
                </p>
                <div className="pt-3 border-t border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0F172A] text-amber-400 font-bold flex items-center justify-center text-sm">
                    T
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-[#0F172A]">Ông Trần Đình Toàn</div>
                    <div className="text-[11px] text-slate-500">Trưởng Ban Liên Lạc Họ Trần Đình (Nghệ An)</div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 bg-[#F8FAFC] rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "Tôi rất ấn tượng với Bản đồ GPS lăng mộ. Các cháu thanh niên sinh ra ở thành phố lần đầu về quê thắp hương không còn sợ đi nhầm vị trí mộ các cụ."
                </p>
                <div className="pt-3 border-t border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-sm">
                    N
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-[#0F172A]">Ông Nguyễn Duy Tuấn</div>
                    <div className="text-[11px] text-slate-500">Đại diện Dòng Họ Nguyễn Duy (Hà Nam)</div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 bg-[#F8FAFC] rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "Thủ quỹ dòng họ trước đây ghi chép sổ tay rất vất vả và dễ nhầm lẫn. Giờ đưa lên web minh bạch từng đồng công đức, con cháu ai cũng phấn khởi đóng góp."
                </p>
                <div className="pt-3 border-t border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-sm">
                    L
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-[#0F172A]">Ông Lê Quang Khang</div>
                    <div className="text-[11px] text-slate-500">Hội Đồng Tộc Biểu Họ Lê (Thanh Hóa)</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 7. SEO FAQ ACCORDION (5 CÂU HỎI THƯỜNG GẶP) ────────────────── */}
        <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center mb-12 space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] font-serif">
                Câu Hỏi Thường Gặp
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Giải đáp các thắc mắc phổ biến của các dòng họ khi bắt đầu chuyển đổi số gia phả.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-[#0F172A] flex justify-between items-center gap-4 hover:bg-slate-50"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      {faq.q}
                    </span>
                    {openFaqIndex === idx ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── 8. BANNER KÊU GỌI HÀNH ĐỘNG (CTA BOTTOM) ───────────────────── */}
        <section className="bg-[#0F172A] py-16 text-white border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif leading-tight">
              Gìn Giữ Gia Bảo — Lưu Truyền Huyết Thống<br />
              <span className="text-amber-400">Khởi Tạo Website Dòng Họ Ngay Hôm Nay</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Hệ thống tự động kích hoạt sau 30 giây thanh toán VietQR. Đội ngũ chuyên gia sẵn sàng hỗ trợ nhập liệu phả ký và dịch văn bia Hán Nôm trọn gói.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3">
              <button
                onClick={() => openRegister('standard')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Khởi Tạo Website Dòng Họ (30s)</span>
              </button>
              <a
                href="https://hotrandinh.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl border border-slate-700 transition-all"
              >
                <ExternalLink className="w-4 h-4 text-amber-400" />
                <span>Xem Website Mẫu (hotrandinh.com)</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* ── 9. FOOTER HOÀNG GIA CHUẨN SEMANTIC ─────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div>
            <div className="font-serif font-black text-lg text-white mb-2 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-serif font-bold">GT</div>
              Gia Tộc Online
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Nền tảng SaaS quản trị và số hóa gia phả trực tuyến đa dòng họ số 1 Việt Nam. Vận hành ổn định trên hạ tầng đám mây NVMe tốc độ cao và bảo mật 3 lớp.
            </p>
          </div>

          <div>
            <div className="font-bold text-white mb-3 uppercase tracking-wider text-xs">Liên Kết Nhanh</div>
            <ul className="space-y-2 text-xs">
              <li><a href="#demo-tree" className="hover:text-amber-400 transition-colors">Cây Phả Hệ Mẫu</a></li>
              <li><a href="#core-features" className="hover:text-amber-400 transition-colors">Tính Năng Cốt Lõi</a></li>
              <li><a href="#pricing" className="hover:text-amber-400 transition-colors">Bảng Giá Bản Quyền</a></li>
              <li><a href="#faq" className="hover:text-amber-400 transition-colors">Câu Hỏi Thường Gặp</a></li>
              <li><Link to="/huong-dan-thiet-lap" className="hover:text-amber-400 transition-colors">Hướng Dẫn Thiết Lập</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-white mb-3 uppercase tracking-wider text-xs">Tổng Đài Tư Vấn & Kỹ Thuật</div>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div>Hotline / Zalo: <span className="text-amber-400 font-bold">0912.345.678</span></div>
              <div>Email: <span className="text-white font-semibold">hotro@giatoc.online</span></div>
              <div className="pt-2 text-slate-500">
                Cam kết bảo mật thông tin phả hệ & an toàn dữ liệu 100% theo tiêu chuẩn an ninh mạng.
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-800/80 text-center text-xs text-slate-500">
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
