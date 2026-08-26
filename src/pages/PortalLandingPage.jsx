import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, TreePine, MapPin, DollarSign, Users, CheckCircle, ArrowRight, ExternalLink, HelpCircle, Phone, BookOpen, Lock, Landmark, Check, Bot, Send, Search, Star, Award, ShieldCheck, HeartHandshake } from 'lucide-react';
import OceanScene from '../components/OceanScene';
import RegistrationModal from '../components/RegistrationModal';

export default function PortalLandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [quickSlug, setQuickSlug] = useState('');

  const pricingPlans = [
    {
      id: 'basic',
      name: 'Gói Cơ Bản',
      sub: 'Dành cho Chi nhỏ / Gia đình',
      price: '590.000',
      period: 'đ / năm',
      badge: 'Tiết Kiệm',
      features: [
        'Dưới 300 thành viên gia phả',
        'Subdomain riêng ([họ].giatoc.online)',
        '2 GB lưu trữ hình ảnh tư liệu',
        '2 Tài khoản quản trị viên',
        'Bản đồ lăng mộ tổ tiên GPS',
        'Sổ thu chi & Quỹ dòng họ',
        'Cổng xác thực con cháu 3 lớp',
        'Tặng 50 tin nhắn thông báo ZNS'
      ]
    },
    {
      id: 'standard',
      name: 'Gói Tiêu Chuẩn',
      sub: 'Dành cho Dòng họ quy mô vừa',
      price: '1.290.000',
      period: 'đ / năm',
      badge: 'Khuyên Dùng ★',
      isPopular: true,
      features: [
        'Dưới 1.500 thành viên gia phả',
        'Subdomain riêng ([họ].giatoc.online)',
        '10 GB lưu trữ hình ảnh tư liệu',
        '5 Tài khoản quản trị & Phân quyền Chi',
        'Phân công Bãi biện quản lý theo năm',
        'Bản đồ lăng mộ & Quản lý tài sản họ',
        'Import / Export Excel 1 giây',
        'Trợ lý AI tra cứu xưng hô gia tộc',
        'Tặng 200 tin nhắn thông báo ZNS'
      ]
    },
    {
      id: 'premium',
      name: 'Gói Cao Cấp',
      sub: 'Dành cho Dòng họ lớn / Nhiều chi phái',
      price: '2.490.000',
      period: 'đ / năm',
      badge: 'Đầy Đủ Tính Năng',
      features: [
        'Dưới 5.000 thành viên gia phả',
        'Hỗ trợ gắn Tên Miền Riêng (custom domain)',
        '30 GB lưu trữ hình ảnh tư liệu',
        '15 Tài khoản Quản trị Chi & Đích Tôn',
        'Quản lý khấu hao tài sản & đất đai họ',
        'Bàn thờ số & Tưởng niệm ngày giỗ',
        'Bảo mật che số điện thoại thông minh',
        'Trợ lý AI xưng hô & phong tục tế tự',
        'Tặng 500 tin nhắn thông báo ZNS'
      ]
    },
    {
      id: 'unlimited',
      name: 'Gói Đại Tộc',
      sub: 'Dành cho Đại tộc toàn quốc',
      price: '4.990.000',
      period: 'đ / năm',
      badge: 'Vương Giả',
      features: [
        'Không giới hạn thành viên gia phả',
        'Gắn Tên Miền Riêng + SSL miễn phí',
        '100 GB lưu trữ dữ liệu NVMe',
        'Vô hạn tài khoản Quản trị chi phái',
        'Hỗ trợ xuất file in sách kỷ yếu A4/A3',
        'Chuyên gia số hóa & hỗ trợ riêng 24/7',
        'Tặng 1.500 tin nhắn thông báo ZNS'
      ]
    }
  ];

  const rbacRoles = [
    {
      step: '01',
      role: 'Khách Ngoài Họ',
      tag: 'Public Viewer',
      color: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: Users,
      desc: 'Xem giới thiệu lịch sử, tin tức hoạt động, nhà thờ họ và cây phả hệ tổng quan (tự động che số điện thoại để bảo vệ quyền riêng tư con cháu).'
    },
    {
      step: '02',
      role: 'Con Cháu Trong Họ',
      tag: 'Family Viewer',
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: ShieldCheck,
      desc: 'Xác thực 3 lớp bí mật (Họ tên + Tên thân sinh + Ngày tế họ âm lịch) để mở khóa xem toàn bộ số điện thoại, vị trí lăng mộ GPS và báo cáo thu chi.'
    },
    {
      step: '03',
      role: 'Người Làm Bãi Biện',
      tag: 'Nhập Liệu Niên Khóa',
      color: 'bg-amber-50 text-amber-900 border-amber-200',
      icon: DollarSign,
      desc: 'Ghi chép sổ thu chi quỹ họ, đính kèm ảnh chụp hóa đơn chứng từ theo đúng năm tế họ phụ trách. Tự động đóng quyền khi hết nhiệm kỳ niên khóa.'
    },
    {
      step: '04',
      role: 'Quản Trị Chi / Đích Tôn',
      tag: 'Branch Admin',
      color: 'bg-teal-50 text-teal-900 border-teal-200',
      icon: TreePine,
      desc: 'Quản lý cây phả hệ độc lập trong Chi phái của mình, quản lý tài sản Chi và phân công tài khoản bãi biện luân phiên hàng năm.'
    },
    {
      step: '05',
      role: 'Super Admin Dòng Họ',
      tag: 'Clan Administrator',
      color: 'bg-amber-100 text-amber-950 border-amber-300',
      icon: Award,
      desc: 'Toàn quyền điều hành cây gia phả chung, quản lý đất đai từ đường, khấu hao tài sản, quản lý tài khoản thành viên và phát động tin nhắn Zalo ZNS.'
    }
  ];

  const coreFeatures = [
    {
      icon: TreePine,
      title: 'Sơ Đồ Phả Hệ Tương Tác',
      desc: 'Hiển thị cây gia phả đa thế hệ trực quan, hỗ trợ phóng to thu nhỏ (zoom & pan), tìm kiếm con cháu theo cành nhánh và xuất file Excel chỉ trong 1 giây.'
    },
    {
      icon: MapPin,
      title: 'Bản Đồ Lăng Mộ GPS Vệ Tinh',
      desc: 'Gắn tọa độ vị trí khu lăng mộ tổ tiên lên bản đồ vệ tinh kèm hình ảnh thực tế, giúp con cháu ở xa dễ dàng tìm đường về viếng thăm chính xác qua Google Maps.'
    },
    {
      icon: DollarSign,
      title: 'Sổ Quỹ & Thu Chi Bãi Biện',
      desc: 'Quản lý minh bạch từng khoản đóng góp, suất đinh, công đức và các khoản chi tế tự. Cho phép chụp ảnh hóa đơn chứng từ lưu trữ công khai.'
    },
    {
      icon: Send,
      title: 'Ví Gửi Tin Nhắn Zalo ZNS',
      desc: 'Hệ thống gửi tin nhắn thông báo tự động tới điện thoại/Zalo con cháu: nhắc ngày giỗ họ, kêu gọi công đức, thu quỹ niên khóa và kính báo tin buồn.'
    },
    {
      icon: Bot,
      title: 'Trợ Lý AI Xưng Hô Dòng Tộc',
      desc: 'Ứng dụng thuật toán AI phân tích thế hệ, chi trưởng/thứ để chỉ dẫn danh xưng chính xác (Bác, Chú, Cô, Cậu, Anh, Em họ) và giải đáp phong tục tế lễ.'
    },
    {
      icon: ShieldCheck,
      title: 'Cổng Xác Thực 3 Lớp Bí Mật',
      desc: 'Bảo vệ quyền riêng tư số điện thoại con cháu tuyệt đối. Chỉ con cháu trả lời đúng ngày tế họ âm lịch và tên thân sinh mới được xem thông tin liên lạc.'
    }
  ];

  const openRegister = (planId = 'standard') => {
    setSelectedPlan(planId);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FBF7EF] text-[#163247] font-sans selection:bg-[#F2C46A] selection:text-[#0A5480]">
      
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E1E8EC] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0E6FA8] to-[#0A5480] flex items-center justify-center text-[#F7D890] font-black shadow-md border border-[#F2C46A]/40 text-sm">
            GT
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-[#0A5480] font-serif block leading-tight">
              Gia Tộc Online
            </span>
            <span className="text-[11px] font-semibold text-[#5B7583] tracking-wide">
              Nền tảng số hóa gia tộc • giatoc.online
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-xs font-bold text-[#163247]">
          <a href="#features" className="hover:text-[#0E6FA8] transition-colors">Tính Năng</a>
          <a href="#rbac" className="hover:text-[#0E6FA8] transition-colors">Phân Quyền RBAC</a>
          <a href="#pricing" className="hover:text-[#0E6FA8] transition-colors">Bảng Giá</a>
          <Link to="/huong-dan-thiet-lap" className="hover:text-[#0E6FA8] transition-colors">Hướng Dẫn Vận Hành</Link>
          <a
            href="?tenant=demo"
            className="px-3 py-1 bg-[#F5E9D6] text-[#0A5480] rounded-full border border-[#F2C46A]/50 hover:bg-[#F2C46A]/30 transition-all flex items-center space-x-1"
          >
            <span>Dòng Họ Mẫu Demo</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => openRegister('standard')}
            className="px-4 py-2 bg-gradient-to-r from-[#0E6FA8] to-[#0A5480] hover:from-[#1C8FD6] hover:to-[#0E6FA8] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 border border-[#F2C46A]/30"
          >
            <span>Tạo Website Dòng Họ</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F7D890]" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-8 text-center overflow-hidden bg-gradient-to-b from-[#F5E9D6]/60 via-[#FBF7EF] to-[#FBF7EF]">
        <div className="max-w-5xl mx-auto space-y-6">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-white border border-[#F2C46A] rounded-full text-xs font-bold text-[#0A5480] shadow-xs">
            <Sparkles className="w-4 h-4 text-[#D99B26]" />
            <span>Nền Tảng Chuyển Đổi Số Gia Tộc & Dòng Họ Hàng Đầu Việt Nam</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0A5480] font-serif leading-tight">
            Mộc Bản Thủy Nguyên <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#0E6FA8] via-[#0A5480] to-[#B45309] bg-clip-text text-transparent">
              Gìn Giữ Cội Nguồn — Kết Nối Muôn Đời
            </span>
          </h1>

          <p className="text-[#5B7583] text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            Trang bị cho dòng tộc của bạn một không gian số hóa trang trọng với tên miền riêng biệt <strong className="text-[#0E6FA8]">[họ].giatoc.online</strong>. Tích hợp trọn bộ: Sơ đồ phả hệ tương tác, Bản đồ lăng mộ GPS, Quản lý thu chi bãi biện niên khóa và Gửi tin nhắn Zalo tự động.
          </p>

          {/* Quick Subdomain Availability Checker */}
          <div className="max-w-2xl mx-auto p-3 bg-white border-2 border-[#F2C46A] rounded-2xl shadow-lg flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full flex-1 flex items-center">
              <input
                type="text"
                placeholder="Nhập tên dòng họ (ví dụ: nguyenduy, hotrandinh...)"
                value={quickSlug}
                onChange={(e) => setQuickSlug(e.target.value.toLowerCase().replace(/[^a-z0-9\-]/g, ''))}
                className="w-full pl-4 pr-32 py-3 bg-[#FBF7EF] border border-[#E1E8EC] rounded-xl text-[#163247] text-sm font-semibold focus:ring-2 focus:ring-[#0E6FA8] focus:bg-white transition-all"
              />
              <span className="absolute right-3 text-xs font-extrabold text-[#0E6FA8] select-none bg-[#F5E9D6] px-2.5 py-1 rounded-lg">
                .giatoc.online
              </span>
            </div>
            <button
              onClick={() => openRegister('standard')}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#0E6FA8] to-[#0A5480] hover:from-[#1C8FD6] hover:to-[#0E6FA8] text-white font-bold text-xs rounded-xl transition-all whitespace-nowrap shadow-md flex items-center justify-center space-x-1.5"
            >
              <span>Kiểm Tra & Khởi Tạo Ngay</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F7D890]" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-[#5B7583] pt-2">
            <span className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-600 mr-1.5" /> Thanh toán VietQR MBBank chính chủ</span>
            <span className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-600 mr-1.5" /> Tự động khởi tạo sau khi xác nhận</span>
            <span className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-600 mr-1.5" /> Máy chủ 50 GB NVMe tốc độ cao</span>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-[#B45309] uppercase tracking-widest bg-[#F5E9D6] px-3 py-1 rounded-full border border-[#F2C46A]/50">
            Hệ Sinh Thái Toàn Diện
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0A5480] font-serif">
            Đầy Đủ Nghiệp Vụ Chuẩn Mực Cho Dòng Tộc
          </h2>
          <p className="text-xs sm:text-sm text-[#5B7583] max-w-2xl mx-auto">
            Được nghiên cứu và thiết kế chuyên sâu dựa trên đúng thuần phong mỹ tục và nếp sống gia tộc truyền thống của người Việt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-[#E1E8EC] shadow-xs hover:shadow-md hover:border-[#0E6FA8]/40 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F5E9D6] to-[#F2C46A]/40 text-[#0A5480] flex items-center justify-center shadow-xs border border-[#F2C46A]/30">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#0A5480] font-serif">{feat.title}</h3>
                  <p className="text-xs text-[#5B7583] leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* RBAC 5-Level Security Section */}
      <section id="rbac" className="py-16 px-4 sm:px-8 bg-[#F5E9D6]/40 border-y border-[#E1E8EC]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold text-[#0A5480] uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-[#0E6FA8]/30">
              Ma Trận Phân Quyền 5 Cấp (RBAC)
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0A5480] font-serif">
              Bảo Mật Quyền Riêng Tư & Phân Quyền Rõ Ràng
            </h2>
            <p className="text-xs sm:text-sm text-[#5B7583] max-w-2xl mx-auto">
              Phân tách minh bạch giữa người xem thông thường, con cháu đã xác thực, người làm bãi biện và ban quản trị dòng tộc.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {rbacRoles.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-[#E1E8EC] shadow-xs hover:border-[#0E6FA8] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#B45309] font-mono">{item.step}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.color}`}>
                        {item.tag}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-[#FBF7EF] text-[#0A5480] flex items-center justify-center border border-[#E1E8EC]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-[#0A5480] font-serif">{item.role}</h3>
                    <p className="text-xs text-[#5B7583] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Matrix Section */}
      <section id="pricing" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-[#B45309] uppercase tracking-widest bg-[#F5E9D6] px-3 py-1 rounded-full border border-[#F2C46A]/50">
            Bảng Giá Dịch Vụ Minh Bạch
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0A5480] font-serif">
            Lựa Chọn Gói Dịch Vụ Phù Hợp Cho Dòng Họ
          </h2>
          <p className="text-xs sm:text-sm text-[#5B7583] max-w-2xl mx-auto">
            Không phát sinh phụ phí ẩn. Miễn phí nâng cấp tính năng mới và bảo lưu dữ liệu an toàn trên hệ thống máy chủ 50 GB NVMe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all bg-white ${
                plan.isPopular
                  ? 'border-2 border-[#0E6FA8] shadow-xl ring-4 ring-[#0E6FA8]/10'
                  : 'border border-[#E1E8EC] shadow-xs hover:border-[#0E6FA8]/40 hover:shadow-md'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#0E6FA8] text-[#F7D890] text-[10px] font-black uppercase rounded-full tracking-wider shadow-md border border-[#F2C46A]/50">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#0A5480] font-serif">{plan.name}</h3>
                  <p className="text-xs text-[#5B7583] mt-0.5">{plan.sub}</p>
                </div>

                <div className="flex items-baseline space-x-1 border-b border-[#E1E8EC] pb-4">
                  <span className="text-2xl sm:text-3xl font-black text-[#0A5480]">{plan.price}</span>
                  <span className="text-xs font-semibold text-[#5B7583]">{plan.period}</span>
                </div>

                <ul className="space-y-2.5 text-xs text-[#163247]">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-[#0E6FA8] flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => openRegister(plan.id)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-[#0E6FA8] to-[#0A5480] hover:from-[#1C8FD6] hover:to-[#0E6FA8] text-white shadow-md'
                      : 'bg-[#F5E9D6] hover:bg-[#F2C46A]/40 text-[#0A5480] border border-[#F2C46A]/50'
                  }`}
                >
                  Đăng Ký Gói Này
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Expert Digitization & Consultation Banner */}
      <section className="py-12 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-[#0A5480] via-[#0E6FA8] to-[#0A5480] rounded-2xl p-8 text-white shadow-xl border border-[#F2C46A]/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/10 rounded-full text-[11px] font-bold text-[#F7D890] uppercase border border-white/20">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Dịch Vụ Hỗ Trợ Chuyên Sâu</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#F7D890]">
              Bạn Cần Hỗ Trợ Số Hóa Gia Phả Trọn Gói?
            </h2>
            <p className="text-xs text-slate-200 max-w-xl leading-relaxed">
              Đội ngũ chuyên gia của chúng tôi nhận dịch phả ký chữ Hán Nôm cổ, phục chế ảnh thờ tiền nhân và hỗ trợ nhập liệu cây gia phả trọn gói theo yêu cầu của dòng họ.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a
              href="tel:0912345678"
              className="px-5 py-3 bg-[#F2C46A] hover:bg-[#F7D890] text-[#0A5480] font-black text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              <span>Hotline: 0912.345.678</span>
            </a>
            <a
              href="https://zalo.me"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center justify-center space-x-2 transition-all whitespace-nowrap"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Tư Vấn Qua Zalo</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-white border-t border-[#E1E8EC]">
        <OceanScene variant="pattern" className="footer-pattern" />
        <div className="footer-inner max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#0A5480] flex items-center justify-center text-[#F7D890] font-bold text-sm">
              GT
            </div>
            <div>
              <p className="font-bold text-[#0A5480] font-serif text-base">Gia Tộc Online (giatoc.online)</p>
              <p className="text-xs text-[#5B7583]">Nền tảng chuyển đổi số dòng họ • "Mộc bản thủy nguyên"</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs font-semibold text-[#5B7583]">
            <Link to="/huong-dan-thiet-lap" className="hover:text-[#0E6FA8]">Hướng Dẫn Vận Hành</Link>
            <Link to="/super-admin" className="hover:text-[#0E6FA8]">Platform Admin</Link>
            <a href="tel:0912345678" className="hover:text-[#0E6FA8]">Hotline: 0912.345.678</a>
          </div>
        </div>

        <div className="footer-bottom border-t border-[#E1E8EC] py-4 text-center text-xs text-[#5B7583]">
          <p>&copy; 2026 giatoc.online. Bản quyền thuộc về Nền tảng Quản trị Gia tộc Đa Dòng họ.</p>
        </div>
      </footer>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        preselectedPlan={selectedPlan}
        preselectedSlug={quickSlug}
      />
    </div>
  );
}
