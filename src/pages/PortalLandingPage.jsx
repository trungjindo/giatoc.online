import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Shield, TreePine, MapPin, DollarSign, Users, CheckCircle,
  ArrowRight, ExternalLink, Phone, Check, Bot, Send, Star, ShieldCheck, HeartHandshake,
  Minus, Zap, Globe, Database, UserCog, Image, MessageSquare
} from 'lucide-react';
import RegistrationModal from '../components/RegistrationModal';

export default function PortalLandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [quickSlug, setQuickSlug] = useState('');

  const pricingPlans = [
    {
      id: 'basic', name: 'Cơ Bản', sub: 'Chi nhỏ / Gia đình', price: '590.000đ', period: '/ năm',
      badge: 'Tiết Kiệm', badgeColor: 'bg-slate-500',
      members: '≤ 300', admins: '2', storage: '2 GB', domain: 'Subdomain', zns: '50',
      features: { tree: true, map: true, finance: true, auth: true, excel: false, ai: false, assets: false, altar: false, privacy: false, yearbook: false, support: false }
    },
    {
      id: 'standard', name: 'Tiêu Chuẩn', sub: 'Dòng họ quy mô vừa', price: '1.290.000đ', period: '/ năm',
      badge: 'Phổ Biến Nhất', badgeColor: 'bg-primary', isPopular: true,
      members: '≤ 1.500', admins: '5', storage: '10 GB', domain: 'Subdomain', zns: '200',
      features: { tree: true, map: true, finance: true, auth: true, excel: true, ai: true, assets: true, altar: false, privacy: false, yearbook: false, support: false }
    },
    {
      id: 'premium', name: 'Cao Cấp', sub: 'Dòng họ lớn', price: '2.490.000đ', period: '/ năm',
      badge: 'Đầy Đủ', badgeColor: 'bg-amber-600',
      members: '≤ 5.000', admins: '15', storage: '30 GB', domain: 'Custom domain', zns: '500',
      features: { tree: true, map: true, finance: true, auth: true, excel: true, ai: true, assets: true, altar: true, privacy: true, yearbook: false, support: false }
    },
    {
      id: 'unlimited', name: 'Đại Tộc', sub: 'Đại tộc toàn quốc', price: '4.990.000đ', period: '/ năm',
      badge: 'Vương Giả', badgeColor: 'bg-amber-700',
      members: 'Không giới hạn', admins: 'Không giới hạn', storage: '100 GB', domain: 'Custom + SSL', zns: '1.500',
      features: { tree: true, map: true, finance: true, auth: true, excel: true, ai: true, assets: true, altar: true, privacy: true, yearbook: true, support: true }
    }
  ];

  const comparisonRows = [
    { key: 'members', label: 'Số thành viên gia phả', icon: Users, type: 'value' },
    { key: 'admins', label: 'Tài khoản quản trị', icon: UserCog, type: 'value' },
    { key: 'storage', label: 'Lưu trữ dữ liệu', icon: Database, type: 'value' },
    { key: 'domain', label: 'Tên miền', icon: Globe, type: 'value' },
    { key: 'zns', label: 'Tin nhắn Zalo ZNS', icon: MessageSquare, type: 'value' },
    { divider: true, label: 'Tính Năng' },
    { key: 'tree', label: 'Sơ đồ phả hệ tương tác', icon: TreePine, type: 'feature' },
    { key: 'map', label: 'Bản đồ lăng mộ GPS', icon: MapPin, type: 'feature' },
    { key: 'finance', label: 'Sổ quỹ & thu chi', icon: DollarSign, type: 'feature' },
    { key: 'auth', label: 'Xác thực con cháu 3 lớp', icon: ShieldCheck, type: 'feature' },
    { key: 'excel', label: 'Import / Export Excel', icon: Zap, type: 'feature' },
    { key: 'ai', label: 'Trợ lý AI xưng hô', icon: Bot, type: 'feature' },
    { key: 'assets', label: 'Quản lý tài sản dòng họ', icon: Shield, type: 'feature' },
    { key: 'altar', label: 'Bàn thờ số & tưởng niệm', icon: Star, type: 'feature' },
    { key: 'privacy', label: 'Bảo mật số ĐT thông minh', icon: Shield, type: 'feature' },
    { key: 'yearbook', label: 'Xuất in sách kỷ yếu A4/A3', icon: Image, type: 'feature' },
    { key: 'support', label: 'Chuyên gia hỗ trợ 24/7', icon: HeartHandshake, type: 'feature' },
  ];

  const features = [
    { icon: TreePine, title: 'Sơ Đồ Phả Hệ', desc: 'Cây gia phả đa thế hệ, zoom & pan mượt mà trên mọi thiết bị.' },
    { icon: MapPin, title: 'Bản Đồ Lăng Mộ GPS', desc: 'Định vị tọa độ vệ tinh, ảnh thực tế, dẫn đường Google Maps.' },
    { icon: DollarSign, title: 'Sổ Quỹ Thu Chi', desc: 'Minh bạch tài chính, đính kèm ảnh hóa đơn chứng từ.' },
    { icon: Send, title: 'Tin Nhắn Zalo ZNS', desc: 'Nhắc giỗ, kêu gọi công đức tự động chỉ 1 chạm.' },
    { icon: Bot, title: 'Trợ Lý AI Xưng Hô', desc: 'Tra cứu danh xưng, vai vế chính xác theo phong tục.' },
    { icon: ShieldCheck, title: 'Phân Quyền RBAC 5 Cấp', desc: 'Bảo mật 3 lớp, che số điện thoại, phân quyền rõ ràng.' },
  ];

  const openRegister = (planId = 'standard') => {
    setSelectedPlan(planId);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-sand-light font-sans text-navy-900">

      {/* ── NAVBAR ───────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-secondary font-black text-sm border-2 border-secondary/40 shadow">GT</div>
            <div className="leading-tight">
              <div className="text-xl font-bold text-primary-dark font-serif">Gia Tộc Online</div>
              <div className="text-[11px] font-medium text-gray-500 tracking-wider uppercase">Nền tảng số hóa dòng họ</div>
            </div>
          </a>

          {/* Nav links */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-navy-900">
            <a href="#features" className="hover:text-primary transition-colors">Tính Năng</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Bảng Giá</a>
            <Link to="/huong-dan-thiet-lap" className="hover:text-primary transition-colors">Hướng Dẫn</Link>
            <a href="https://hotrandinh.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sand text-primary-dark border border-secondary/40 hover:bg-secondary/30 transition-colors text-sm font-bold">
              Xem Demo <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* CTA */}
          <button onClick={() => openRegister('standard')} className="px-5 py-2.5 rounded-full bg-primary-dark hover:bg-primary text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2">
            Tạo Website <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="pt-[120px] pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white rounded-full border border-gray-200 shadow-sm text-sm font-semibold text-primary-dark">
            <Sparkles className="w-4 h-4 text-secondary" />
            Phần Mềm Quản Lý Gia Tộc Hàng Đầu Việt Nam
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-serif text-primary-dark leading-[1.15]">
            Số Hóa Gia Phả<br />
            <span className="text-secondary-dark">Kết Nối Muôn Đời</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Trang bị cho dòng họ một website chuyên nghiệp với tên miền riêng biệt, tích hợp sơ đồ phả hệ, bản đồ lăng mộ GPS, sổ quỹ thu chi minh bạch và tin nhắn Zalo ZNS tự động.
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto">
            <div className="flex items-center bg-white rounded-full border-2 border-gray-200 shadow-lg p-1.5 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
              <input
                type="text"
                placeholder="Nhập tên dòng họ..."
                value={quickSlug}
                onChange={(e) => setQuickSlug(e.target.value.toLowerCase().replace(/[^a-z0-9\-]/g, ''))}
                className="flex-1 pl-5 py-3.5 bg-transparent text-navy-900 text-lg font-semibold outline-none placeholder:text-gray-400 placeholder:font-normal min-w-0"
              />
              <span className="hidden sm:block text-sm font-bold text-primary mr-2 whitespace-nowrap">.giatoc.online</span>
              <button onClick={() => openRegister('standard')} className="px-6 py-3.5 bg-secondary hover:bg-secondary-light text-primary-dark font-black text-sm rounded-full transition-all shadow-sm whitespace-nowrap flex items-center gap-1.5 shrink-0">
                Khởi Tạo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-gray-500 font-medium pt-2">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Dữ liệu an toàn tuyệt đối</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Tự động khởi tạo trong 5 giây</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Không phát sinh phụ phí</span>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section className="bg-primary-dark">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: '50+', label: 'Dòng họ tin dùng' },
            { num: '10.000+', label: 'Thành viên gia phả' },
            { num: '99.9%', label: 'Uptime máy chủ' },
            { num: '24/7', label: 'Hỗ trợ kỹ thuật' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl sm:text-4xl font-black text-secondary font-serif">{s.num}</div>
              <div className="text-sm text-white/70 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section id="features" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-dark font-serif">
              Hệ Sinh Thái Toàn Diện
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              6 công cụ cốt lõi được thiết kế chuyên biệt cho phong tục gia tộc Việt Nam
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 rounded-3xl overflow-hidden border border-gray-200 shadow-lg">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="bg-white p-8 sm:p-10 hover:bg-sand-light/50 transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-sand flex items-center justify-center text-primary mb-5">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-primary-dark font-serif mb-2">{f.title}</h3>
                  <p className="text-base text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-14">
            <a href="https://hotrandinh.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary-dark text-primary-dark rounded-full font-bold text-base hover:bg-primary-dark hover:text-white transition-all shadow-sm">
              Trải Nghiệm Demo Thực Tế <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────── */}
      <section id="pricing" className="py-20 sm:py-28 bg-sand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-dark font-serif">
              Bảng Giá Minh Bạch
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Không phụ phí ẩn · Miễn phí nâng cấp · Bảo lưu dữ liệu trọn đời
            </p>
          </div>

          {/* Pricing Table */}
          <div className="overflow-x-auto pb-4">
            <table className="w-full min-w-[900px] bg-white rounded-2xl border border-gray-200 shadow-lg border-separate" style={{ borderSpacing: 0 }}>
              {/* Header */}
              <thead>
                <tr>
                  <th className="p-6 text-left text-sm font-bold text-gray-400 uppercase tracking-wider border-b-2 border-gray-200 rounded-tl-2xl bg-white">So sánh</th>
                  {pricingPlans.map((plan) => (
                    <th key={plan.id} className={`p-6 text-center border-b-2 border-gray-200 ${plan.isPopular ? 'bg-primary-dark text-white' : 'bg-white'} ${plan.id === 'unlimited' ? 'rounded-tr-2xl' : ''}`}>
                      <span className={`inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full mb-3 ${plan.isPopular ? 'bg-secondary text-primary-dark' : plan.badgeColor + ' text-white'}`}>{plan.badge}</span>
                      <div className={`text-2xl font-bold font-serif ${plan.isPopular ? 'text-white' : 'text-primary-dark'}`}>{plan.name}</div>
                      <div className={`text-xs mt-1 ${plan.isPopular ? 'text-white/70' : 'text-gray-400'}`}>{plan.sub}</div>
                      <div className="mt-4 mb-4">
                        <span className={`text-3xl font-black ${plan.isPopular ? 'text-secondary' : 'text-primary-dark'}`}>{plan.price}</span>
                        <span className={`text-sm ml-1 ${plan.isPopular ? 'text-white/60' : 'text-gray-400'}`}>{plan.period}</span>
                      </div>
                      <button onClick={() => openRegister(plan.id)} className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${plan.isPopular ? 'bg-secondary hover:bg-secondary-light text-primary-dark shadow-md' : 'bg-sand hover:bg-secondary/30 text-primary-dark'}`}>
                        Đăng Ký Ngay
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
                        <td colSpan={5} className="px-6 py-3 bg-sand text-xs font-extrabold text-amber-700 uppercase tracking-widest border-t border-gray-200">{row.label}</td>
                      </tr>
                    );
                  }
                  const Icon = row.icon;
                  return (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-primary shrink-0" />
                          <span className="text-sm font-semibold text-navy-900">{row.label}</span>
                        </div>
                      </td>
                      {pricingPlans.map((plan) => (
                        <td key={plan.id} className={`px-6 py-4 text-center border-t border-gray-100 ${plan.isPopular ? 'bg-primary/[0.02]' : ''}`}>
                          {row.type === 'value' ? (
                            <span className={`text-sm font-bold ${plan.isPopular ? 'text-primary font-extrabold' : 'text-navy-900'}`}>{plan[row.key]}</span>
                          ) : (
                            plan.features[row.key]
                              ? <Check className="w-5 h-5 text-emerald-500 mx-auto" />
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

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="bg-primary-dark py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white leading-tight">
            Cần Hỗ Trợ<br /><span className="text-secondary">Số Hóa Trọn Gói?</span>
          </h2>
          <p className="text-lg text-white/70 leading-relaxed">
            Đội ngũ chuyên gia nhận dịch phả ký chữ Hán Nôm cổ, phục chế ảnh thờ tiền nhân và nhập liệu cây gia phả trọn gói theo yêu cầu.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <a href="tel:0912345678" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary hover:bg-secondary-light text-primary-dark font-black text-lg rounded-xl shadow-lg transition-all">
              <Phone className="w-5 h-5" /> 0912.345.678
            </a>
            <a href="https://zalo.me" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-lg rounded-xl border border-white/20 transition-all">
              <MessageSquare className="w-5 h-5" /> Tư Vấn Qua Zalo
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-navy-900 text-white/50 py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="font-serif font-bold text-lg text-secondary">Gia Tộc Online</div>
          <div>&copy; {new Date().getFullYear()} giatoc.online — Nền tảng Quản trị Gia tộc Đa Dòng họ.</div>
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
