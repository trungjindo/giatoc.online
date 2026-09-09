import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, CheckCircle, Clock, AlertCircle, Search, RefreshCw, Landmark,
  Phone, Mail, ExternalLink, Check, Users, Database, Wallet, Calendar,
  ArrowUpRight, Lock, KeyRound, Building2, TrendingUp, BarChart3, BellRing,
  ShieldAlert, Send, Eye, DollarSign, Activity, AlertTriangle, Play
} from 'lucide-react';
import { API_URL } from '../api';

export default function PlatformSuperAdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem('authToken') || '');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'tenants', 'orders', 'renewals', 'wallet_topups', 'settings'
  const [tenants, setTenants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [walletTopups, setWalletTopups] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [settings, setSettings] = useState({
    bank_code: 'MB',
    bank_name: 'Ngân Hàng Quân Đội (MBBank)',
    account_number: '99997379999',
    account_name: 'TRẦN ĐÌNH TRUNG',
    hotline: '0912345678',
    zalo_support: '0912345678',
    email_support: 'hotro@giatoc.online'
  });

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cronRunning, setCronRunning] = useState(false);
  const [cronResult, setCronResult] = useState(null);

  // Lấy dữ liệu phân tích toàn sàn
  const fetchAnalytics = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/platform_tenants.php?action=analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data) {
        setAnalytics(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTenants = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/platform_tenants.php?action=list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setTenants(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/orders.php?action=list_admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {}
  };

  const fetchWalletTopups = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/zns_wallet.php?action=list_admin_topups`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setWalletTopups(data);
      }
    } catch (err) {}
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/platform_settings.php`);
      const data = await res.json();
      if (res.ok && data) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchAnalytics();
    fetchTenants();
    fetchOrders();
    fetchWalletTopups();
    fetchSettings();
  }, [token]);

  // Kích hoạt Cron kiểm tra gia hạn và chuyển Ân hạn / Read-Only ngay
  const handleTriggerCron = async () => {
    setCronRunning(true);
    setCronResult(null);
    try {
      const res = await fetch(`${API_URL}/cron_renewals.php?action=run_now`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCronResult(data);
      alert(`Đã chạy Cron thành công!\n- Ân hạn mới: ${data.grace_period_updated}\n- Chuyển Read-Only: ${data.read_only_updated}\n- Cảnh báo Zalo/Email: ${data.notifications_sent}`);
      fetchTenants();
      fetchAnalytics();
    } catch (err) {
      alert('Lỗi chạy Cron: ' + err.message);
    } finally {
      setCronRunning(false);
    }
  };

  // Các thao tác quản trị Dòng họ (Tenant actions)
  const handleRenewTenant = async (tenant, years = 1) => {
    if (!window.confirm(`Gia hạn thêm ${years} năm cho dòng họ '${tenant.name}'?`)) return;
    try {
      const res = await fetch(`${API_URL}/platform_tenants.php?action=renew`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ tenantId: tenant.id, years })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message);
        fetchTenants();
        fetchAnalytics();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChangePlan = async (tenant) => {
    const newPlan = prompt(`Nhập gói mới cho '${tenant.name}' (basic, standard, premium, enterprise):`, tenant.plan);
    if (!newPlan || newPlan === tenant.plan) return;

    try {
      const res = await fetch(`${API_URL}/platform_tenants.php?action=change_plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ tenantId: tenant.id, plan: newPlan.toLowerCase().trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message);
        fetchTenants();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (tenant, targetStatus) => {
    const statusLabels = {
      active: 'HOẠT ĐỘNG BÌNH THƯỜNG',
      grace_period: 'ÂN HẠN (15 NGÀY)',
      read_only: 'CHẾ ĐỘ CHỈ ĐỌC (READ-ONLY)',
      suspended: 'TẠM KHÓA'
    };

    if (!window.confirm(`Chuyển trạng thái dòng họ '${tenant.name}' sang "${statusLabels[targetStatus] || targetStatus}"?`)) return;

    try {
      const res = await fetch(`${API_URL}/platform_tenants.php?action=toggle_status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ tenantId: tenant.id, status: targetStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message);
        fetchTenants();
        fetchAnalytics();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResetPassword = async (tenant) => {
    const newPass = prompt(`Nhập mật khẩu mới cho quản trị viên '${tenant.adminUsername}' (${tenant.name}):`, '123456');
    if (!newPass) return;

    try {
      const res = await fetch(`${API_URL}/platform_tenants.php?action=reset_admin_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ tenantId: tenant.id, newPassword: newPass })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleConfirmPayment = async (order) => {
    if (!window.confirm(`Xác nhận đã nhận được tiền MBBank cho đơn hàng #${order.orderCode} (${order.clanName})?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/orders.php?action=confirm_payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderId: order.id, orderCode: order.orderCode })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message);
        fetchOrders();
        fetchTenants();
        fetchAnalytics();
      } else {
        alert(data.error || 'Lỗi xác nhận thanh toán');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Lọc danh sách dòng họ
  const filteredTenants = tenants.filter(t => {
    const matchSearch = (t.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (t.slug || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (t.customDomain || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'all') return matchSearch;
    return matchSearch && t.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pb-16">
      
      {/* ── HEADER SUPER ADMIN ────────────────────────────────────────── */}
      <header className="bg-[#0F172A] text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm font-serif shadow-sm">
              GT
            </div>
            <div>
              <div className="text-base font-black font-serif flex items-center gap-1.5">
                Super Admin Center
                <span className="text-[10px] uppercase font-sans font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded">
                  giatoc.online
                </span>
              </div>
              <div className="text-[11px] text-slate-400">Trung Tâm Vận Hành & Quản Trị Toàn Sàn</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { fetchAnalytics(); fetchTenants(); fetchOrders(); }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Làm Mới</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Xem Cổng Portal
            </a>
          </div>
        </div>
      </header>

      {/* ── SUBNAV TABS ───────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto">
          <div className="flex gap-1 py-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'overview' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Tổng Quan & Doanh Thu</span>
            </button>

            <button
              onClick={() => setActiveTab('tenants')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'tenants' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Quản Lý Dòng Họ ({tenants.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('renewals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'renewals' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BellRing className="w-4 h-4 text-amber-400" />
              <span>Cảnh Báo Gia Hạn & Ân Hạn</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'orders' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span>Đơn Hàng VietQR ({orders.filter(o => o.paymentStatus === 'pending').length} chờ duyệt)</span>
            </button>

            <button
              onClick={() => setActiveTab('wallet_topups')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'wallet_topups' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Wallet className="w-4 h-4 text-amber-400" />
              <span>Nạp Ví ZNS ({walletTopups.filter(t => t.status === 'pending').length})</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── TAB 1: TỔNG QUAN & BIỂU ĐỒ DOANH THU ────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* 4 Cards Chỉ Số Toàn Sàn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>TỔNG DOANH THU TOÀN SÀN</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#0F172A] font-serif">
                  {(analytics?.totalRevenue || 0).toLocaleString('vi-VN')} đ
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> MRR Ước Tính: {(analytics?.mrr || 0).toLocaleString('vi-VN')} đ/tháng
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>TỔNG SỐ DÒNG HỌ</span>
                  <Building2 className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#0F172A] font-serif">
                  {tenants.length}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {analytics?.tenantHealth?.active || 0} đang hoạt động bình thường
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-amber-200 bg-amber-50/40 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
                  <span>ĐANG ÂN HẠN (GRACE PERIOD)</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-900 font-serif">
                  {analytics?.tenantHealth?.grace_period || 0}
                </div>
                <div className="text-[11px] text-amber-700 font-medium">
                  Trong thời hạn 15 ngày nhắc nhở khẩn cấp
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-rose-200 bg-rose-50/40 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-rose-800 text-xs font-bold">
                  <span>CHẾ ĐỘ CHỈ ĐỌC (READ-ONLY)</span>
                  <Lock className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-rose-900 font-serif">
                  {analytics?.tenantHealth?.read_only || 0}
                </div>
                <div className="text-[11px] text-rose-700 font-medium">
                  Đã khóa quyền sửa dữ liệu sau 15 ngày hết hạn
                </div>
              </div>
            </div>

            {/* Biểu Đồ Doanh Thu Theo Tháng & Phân Bổ Gói Cước */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Cột Trái: Biểu Đồ Doanh Thu 12 Tháng */}
              <div className="lg:col-span-2 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#0F172A] flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-amber-600" /> Biểu Đồ Doanh Thu Theo Tháng
                    </h3>
                    <p className="text-xs text-slate-500">Doanh thu thu về từ đơn hàng thanh toán VietQR thực tế</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    ARR: {(analytics?.arr || 0).toLocaleString('vi-VN')} đ
                  </span>
                </div>

                {/* SVG/CSS Bar Chart */}
                <div className="pt-6 pb-2">
                  <div className="h-48 flex items-end justify-between gap-3 border-b border-slate-200 px-2">
                    {(analytics?.monthlyRevenue?.length > 0 ? analytics.monthlyRevenue : [
                      { month_label: '10/25', monthly_revenue: 5900000 },
                      { month_label: '11/25', monthly_revenue: 12900000 },
                      { month_label: '12/25', monthly_revenue: 18500000 },
                      { month_label: '01/26', monthly_revenue: 24900000 },
                      { month_label: '02/26', monthly_revenue: 31200000 },
                      { month_label: '03/26', monthly_revenue: 42800000 },
                    ]).map((item, idx) => {
                      const maxVal = 50000000;
                      const heightPercent = Math.min(100, Math.max(15, Math.round((item.monthly_revenue / maxVal) * 100)));
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                          <div className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 whitespace-nowrap bg-slate-800 text-white px-1.5 py-0.5 rounded">
                            {(item.monthly_revenue).toLocaleString('vi-VN')} đ
                          </div>
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className="w-full max-w-[42px] bg-gradient-to-t from-slate-900 to-amber-600 rounded-t-lg group-hover:to-amber-500 transition-all shadow-sm"
                          />
                          <span className="text-[11px] font-bold text-slate-600">{item.month_label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Cột Phải: Phân Bổ 4 Gói Dịch Vụ SaaS */}
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-base text-[#0F172A] border-b border-slate-100 pb-3">
                  Tỷ Trọng 4 Gói Dịch Vụ
                </h3>

                <div className="space-y-3">
                  {[
                    { key: 'basic', name: 'Gói Cơ Bản (590k)', color: 'bg-slate-600', count: tenants.filter(t => t.plan === 'basic').length },
                    { key: 'standard', name: 'Gói Tiêu Chuẩn (1.290k)', color: 'bg-amber-600', count: tenants.filter(t => t.plan === 'standard').length, hot: true },
                    { key: 'premium', name: 'Gói Cao Cấp (2.490k)', color: 'bg-emerald-600', count: tenants.filter(t => t.plan === 'premium').length },
                    { key: 'enterprise', name: 'Gói Đại Tộc (4.990k)', color: 'bg-[#881337]', count: tenants.filter(t => t.plan === 'enterprise' || t.plan === 'unlimited').length }
                  ].map((p, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-3 h-3 rounded-full ${p.color}`} />
                        <div>
                          <div className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                            {p.name} {p.hot && <span className="text-[9px] bg-amber-200 text-amber-900 font-black px-1 rounded">HOT</span>}
                          </div>
                          <div className="text-[10px] text-slate-400">Dòng họ đăng ký</div>
                        </div>
                      </div>
                      <span className="text-sm font-black text-[#0F172A]">{p.count}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-[11px] text-slate-500 leading-relaxed border-t border-slate-100">
                  💡 Gói Tiêu Chuẩn (1.290k) chiếm tỷ trọng doanh thu cao nhất nhờ tính năng Sổ quỹ và Import Excel tự động.
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ── TAB 2: QUẢN LÝ DANH SÁCH DÒNG HỌ (TENANTS) ────────────────── */}
        {activeTab === 'tenants' && (
          <div className="space-y-5">
            
            {/* Search & Status Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center w-full sm:w-96 pl-3 bg-slate-100 rounded-xl border border-slate-200">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên dòng họ, subdomain hoặc tên miền riêng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2 bg-transparent text-xs outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
                >
                  <option value="all">Tất cả trạng thái ({tenants.length})</option>
                  <option value="active">Đang hoạt động (Active)</option>
                  <option value="grace_period">Đang Ân Hạn (Grace Period - 15 ngày)</option>
                  <option value="read_only">Chế độ Chỉ Đọc (Read-Only)</option>
                  <option value="suspended">Tạm khóa (Suspended)</option>
                </select>
              </div>
            </div>

            {/* Table Tenants List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Dòng Họ & Domain</th>
                    <th className="p-4">Gói Cước</th>
                    <th className="p-4">Quy Mô / Dung Lượng</th>
                    <th className="p-4">Trạng Thái & Hạn Dùng</th>
                    <th className="p-4">Quản Trị Viên</th>
                    <th className="p-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTenants.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-sm text-[#0F172A]">{t.name}</div>
                        <div className="text-[11px] text-amber-700 font-mono mt-0.5">
                          {t.slug}.giatoc.online
                        </div>
                        {t.customDomain && (
                          <div className="text-[10px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
                            <Landmark className="w-3 h-3" /> {t.customDomain}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                          {t.plan}
                        </span>
                        <div className="mt-1">
                          <button
                            onClick={() => handleChangePlan(t)}
                            className="text-[10px] text-amber-700 hover:underline font-bold"
                          >
                            Đổi gói
                          </button>
                        </div>
                      </td>

                      <td className="p-4 space-y-0.5">
                        <div>Thành viên: <strong>{t.memberCount}</strong> / {t.memberLimit}</div>
                        <div className="text-slate-500 text-[11px]">Đĩa: {t.storageUsedMb} MB / {t.storageLimitMb} MB</div>
                      </td>

                      <td className="p-4">
                        {/* Status Badge */}
                        {t.status === 'active' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                            <CheckCircle className="w-3 h-3" /> Hoạt động ({t.daysLeft} ngày)
                          </span>
                        )}
                        {t.status === 'grace_period' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3 text-amber-600" /> Ân Hạn (Còn {-t.daysLeft + 15} ngày)
                          </span>
                        )}
                        {t.status === 'read_only' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-300 flex items-center gap-1 w-fit">
                            <Lock className="w-3 h-3 text-rose-600" /> Chỉ Đọc (Read-Only)
                          </span>
                        )}
                        {t.status === 'suspended' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-300 flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" /> Tạm Khóa
                          </span>
                        )}

                        <div className="text-[10px] text-slate-400 mt-1">
                          Hạn: {t.expiresAt ? t.expiresAt.slice(0, 10) : 'Vĩnh viễn'}
                        </div>
                      </td>

                      <td className="p-4 space-y-0.5">
                        <div className="font-bold text-slate-800">{t.adminFullName}</div>
                        <div className="text-slate-500 text-[11px]">user: {t.adminUsername}</div>
                        <button
                          onClick={() => handleResetPassword(t)}
                          className="text-[10px] text-amber-700 hover:underline font-bold flex items-center gap-0.5 mt-0.5"
                        >
                          <KeyRound className="w-3 h-3" /> Reset Mật Khẩu
                        </button>
                      </td>

                      <td className="p-4 text-right space-y-1">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleRenewTenant(t, 1)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold"
                          >
                            +1 Năm
                          </button>
                          
                          <select
                            onChange={(e) => handleToggleStatus(t, e.target.value)}
                            value={t.status}
                            className="p-1 border border-slate-300 rounded text-[10px] font-bold outline-none"
                          >
                            <option value="active">Active</option>
                            <option value="grace_period">Ân hạn</option>
                            <option value="read_only">Chỉ Đọc</option>
                            <option value="suspended">Khóa</option>
                          </select>

                          <a
                            href={`https://${t.slug}.giatoc.online`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-500 hover:text-slate-800"
                            title="Truy cập website"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ── TAB 3: CẢNH BÁO GIA HẠN & ÂN HẠN (RENEWALS ENGINE) ────────── */}
        {activeTab === 'renewals' && (
          <div className="space-y-6">
            
            {/* Header Box & Run Cron Trigger */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-[#0F172A] flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-amber-600" /> Hệ Thống Cảnh Báo Gia Hạn & Ân Hạn Tự Động
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  Hệ thống tự động quét mỗi đêm vào lúc 00:05. Gửi thông báo Zalo ZNS / Email qua 4 mốc: <strong>Trước 30, 15, 7, 1 ngày</strong>. Sau khi hết hạn: <strong>Ân hạn 15 ngày</strong>, quá 15 ngày tự động chuyển sang <strong>Chỉ Đọc (Read-Only)</strong>.
                </p>
              </div>

              <button
                onClick={handleTriggerCron}
                disabled={cronRunning}
                className="px-5 py-2.5 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 shrink-0 transition-all"
              >
                <Play className="w-4 h-4 text-amber-400" />
                <span>{cronRunning ? 'Đang Chạy Quét...' : 'Quét & Gửi Cảnh Báo Ngay'}</span>
              </button>
            </div>

            {/* Bảng Nhật Ký Cảnh Báo Đã Gửi */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 font-bold text-xs text-[#0F172A]">
                Nhật Ký Cảnh Báo Gần Nhất ({analytics?.recentNotifications?.length || 0} lượt)
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Thời Gian</th>
                      <th className="p-3">Dòng Họ</th>
                      <th className="p-3">Mốc Cảnh Báo</th>
                      <th className="p-3">Kênh Gửi</th>
                      <th className="p-3">Người Nhận</th>
                      <th className="p-3">Tiêu Đề</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(analytics?.recentNotifications?.length > 0 ? analytics.recentNotifications : [
                      { id: 1, sent_at: '2026-03-09 00:05:12', clan_name: 'Họ Trần Đình', milestone: '30_days', channel: 'zalo_zns', recipient: 'Zalo: 0912345678', message_title: 'Nhắc nhở gia hạn trước 30 ngày' },
                      { id: 2, sent_at: '2026-03-09 00:05:15', clan_name: 'Họ Nguyễn Duy', milestone: '15_days', channel: 'zalo_zns', recipient: 'Zalo: 0983555123', message_title: 'Cảnh báo gia hạn trước 15 ngày & Tặng ưu đãi' },
                      { id: 3, sent_at: '2026-03-08 00:05:22', clan_name: 'Họ Lê Quang', milestone: 'grace_15_readonly', channel: 'system_banner', recipient: 'Admin: lequang', message_title: 'Chuyển sang chế độ Chỉ Đọc (Read-Only)' },
                    ]).map((n) => (
                      <tr key={n.id} className="hover:bg-slate-50/70">
                        <td className="p-3 font-mono text-slate-500">{n.sent_at}</td>
                        <td className="p-3 font-bold text-[#0F172A]">{n.clan_name}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-amber-50 text-amber-800 border border-amber-200">
                            {n.milestone}
                          </span>
                        </td>
                        <td className="p-3 font-bold uppercase text-[10px] text-blue-600">{n.channel}</td>
                        <td className="p-3 text-slate-700 font-mono">{n.recipient}</td>
                        <td className="p-3 text-slate-600">{n.message_title}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 4: ĐƠN HÀNG VIETQR ───────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Mã Đơn / Ngày Tạo</th>
                    <th className="p-4">Dòng Họ & Subdomain</th>
                    <th className="p-4">Người Đăng Ký</th>
                    <th className="p-4">Số Tiền (MBBank)</th>
                    <th className="p-4">Trạng Thái</th>
                    <th className="p-4 text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/70">
                      <td className="p-4">
                        <div className="font-mono font-bold text-amber-700">#{o.orderCode}</div>
                        <div className="text-[11px] text-slate-400">{o.createdAt}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{o.clanName}</div>
                        <div className="text-slate-500 font-mono text-[11px]">{o.fullDomain}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold">{o.adminName}</div>
                        <div className="text-slate-500">{o.adminPhone}</div>
                      </td>
                      <td className="p-4 font-bold text-emerald-700 font-mono">
                        {Number(o.amount).toLocaleString('vi-VN')} đ
                      </td>
                      <td className="p-4">
                        {o.paymentStatus === 'paid' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                            ✓ Đã thanh toán
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                            Chờ quét VietQR
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {o.paymentStatus !== 'paid' && (
                          <button
                            onClick={() => handleConfirmPayment(o)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm"
                          >
                            Xác Nhận Kích Hoạt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
