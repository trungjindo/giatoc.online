import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle, Clock, AlertCircle, Search, RefreshCw, Landmark, Phone, Mail, ExternalLink, Check, Users, Database, Wallet, Calendar, ArrowUpRight, Lock, KeyRound, Building2 } from 'lucide-react';
import { API_URL } from '../api';

export default function PlatformSuperAdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem('authToken') || '');
  const [activeTab, setActiveTab] = useState('tenants'); // 'tenants', 'orders', 'wallet_topups', 'settings'
  const [tenants, setTenants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [walletTopups, setWalletTopups] = useState([]);
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
    fetchTenants();
    fetchOrders();
    fetchWalletTopups();
    fetchSettings();
  }, [token]);

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
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChangePlan = async (tenant) => {
    const newPlan = prompt(`Nhập gói mới cho '${tenant.name}' (basic, standard, premium, unlimited):`, tenant.plan);
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

  const handleToggleStatus = async (tenant) => {
    const nextStatus = tenant.status === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`Bạn có chắc muốn ${nextStatus === 'suspended' ? 'TẠM KHÓA' : 'MỞ LẠI'} website dòng họ '${tenant.name}'?`)) return;

    try {
      const res = await fetch(`${API_URL}/platform_tenants.php?action=toggle_status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ tenantId: tenant.id, status: nextStatus })
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
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Lỗi khi kích hoạt đơn hàng.');
      }
      alert(`Thành công! Website cho dòng họ '${order.clanName}' đã được khởi tạo tự động.\nSubdomain: ${order.slug}.giatoc.online\nTài khoản admin: ${order.adminUsername}`);
      fetchOrders();
      fetchTenants();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmTopup = async (tx) => {
    if (!window.confirm(`Xác nhận đã nhận tiền MBBank cho giao dịch nạp #${tx.tx_code} (${tx.clan_name} - ${Number(tx.amount).toLocaleString('vi-VN')} đ)?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/zns_wallet.php?action=confirm_topup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ txId: tx.id })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Lỗi khi duyệt nạp ví.');
      }
      alert(`Thành công! ${data.message}`);
      fetchWalletTopups();
      fetchTenants();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/platform_settings.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        alert('Đã cập nhật cấu hình tài khoản MBBank & Thông tin nền tảng thành công!');
      }
    } catch (err) {
      alert('Lỗi lưu cấu hình: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredTenants = tenants.filter(t =>
    t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.customDomain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-600 text-white rounded-xl shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Platform Super Admin — giatoc.online</h1>
              <p className="text-xs text-slate-500">Quản trị toàn diện 50+ Dòng họ, Hạn mức, Đơn hàng & Duyệt nạp ví ZNS</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('tenants')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'tenants' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Dòng Họ ({tenants.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'orders' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Đơn Hàng ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('wallet_topups')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'wallet_topups' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Duyệt Nạp Ví ({walletTopups.filter(t => t.status === 'pending').length})</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'settings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cấu Hình MBBank
            </button>
          </div>
        </div>

        {/* TAB: QUẢN TRỊ 50+ DÒNG HỌ */}
        {activeTab === 'tenants' && (
          <div className="space-y-4">
            {/* Metric Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Tổng Số Dòng Họ:</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{tenants.length}</div>
                <div className="text-[10px] text-slate-400">Quy mô máy chủ 50 web</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Đang Hoạt Động:</div>
                <div className="text-2xl font-black text-emerald-700 mt-1">
                  {tenants.filter(t => t.status === 'active' && t.daysLeft > 0).length}
                </div>
                <div className="text-[10px] text-emerald-600">Trạng thái ổn định</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Sắp Hết Hạn (≤30 Ngày):</div>
                <div className="text-2xl font-black text-amber-700 mt-1">
                  {tenants.filter(t => t.daysLeft <= 30 && t.daysLeft > 0).length}
                </div>
                <div className="text-[10px] text-amber-600">Cần nhắc phí gia hạn</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Đã Hết Hạn / Tạm Khóa:</div>
                <div className="text-2xl font-black text-rose-700 mt-1">
                  {tenants.filter(t => t.daysLeft <= 0 || t.status === 'suspended').length}
                </div>
                <div className="text-[10px] text-rose-600">Bảo toàn dữ liệu 100%</div>
              </div>
            </div>

            {/* Bảng danh sách dòng họ */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên dòng họ, subdomain, domain..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={fetchTenants}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Làm mới</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">ID & Dòng Họ</th>
                      <th className="px-4 py-3">Subdomain / Domain Riêng</th>
                      <th className="px-4 py-3">Gói Cước & Quy Mô</th>
                      <th className="px-4 py-3">Dung Lượng (MB)</th>
                      <th className="px-4 py-3">Ví Tin Nhắn</th>
                      <th className="px-4 py-3">Hạn Gói (Còn Lại)</th>
                      <th className="px-4 py-3 text-right">Tác Vụ Quản Trị</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTenants.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{t.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {t.id} • Admin: {t.adminUsername}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-mono text-blue-700 font-semibold">{t.fullDomain}</div>
                          {t.customDomain && (
                            <div className="text-[10px] text-emerald-700 font-bold font-mono">{t.customDomain}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold uppercase text-[10px]">
                            {t.plan}
                          </span>
                          <div className="text-[11px] text-slate-600 mt-0.5 font-medium">
                            {t.memberCount} / {t.memberLimit > 50000 ? '∞' : t.memberLimit} người
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-800">{t.storageUsedMb} MB</div>
                          <div className="text-[10px] text-slate-400">Hạn mức: {Math.round(t.storageLimitMb / 1024)} GB</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-emerald-700">{Number(t.znsBalance).toLocaleString('vi-VN')} đ</div>
                          <div className="text-[10px] text-slate-500">≈ {Math.floor(t.znsBalance / 400)} tin</div>
                        </td>
                        <td className="px-4 py-3">
                          {t.status === 'suspended' ? (
                            <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full font-bold text-[10px]">Tạm khóa</span>
                          ) : t.daysLeft <= 0 ? (
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full font-bold text-[10px]">Đã hết hạn</span>
                          ) : t.daysLeft <= 7 ? (
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full font-bold text-[10px]">Còn {t.daysLeft} ngày</span>
                          ) : t.daysLeft <= 30 ? (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px]">Còn {t.daysLeft} ngày</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">Còn {t.daysLeft} ngày</span>
                          )}
                          <div className="text-[10px] text-slate-400 mt-0.5">{t.expiresAt?.slice(0, 10)}</div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => handleRenewTenant(t, 1)}
                              title="Gia hạn thêm 1 năm"
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200 text-[11px] font-bold"
                            >
                              +1 Năm
                            </button>
                            <button
                              onClick={() => handleChangePlan(t)}
                              title="Chuyển gói cước"
                              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-200 text-[11px] font-bold"
                            >
                              Đổi Gói
                            </button>
                            <button
                              onClick={() => handleResetPassword(t)}
                              title="Cấp lại mật khẩu admin"
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px]"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(t)}
                              title={t.status === 'active' ? 'Tạm khóa' : 'Kích hoạt lại'}
                              className={`p-1.5 rounded-lg text-[11px] ${t.status === 'active' ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href={`http://localhost:5173/?tenant=${t.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[11px]"
                              title="Truy cập website"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: QUẢN LÝ ĐƠN HÀNG */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Tìm theo mã đơn, dòng họ, SĐT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                />
              </div>
              <button
                onClick={fetchOrders}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Làm mới</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Mã Đơn</th>
                    <th className="px-4 py-3">Dòng Họ & Subdomain</th>
                    <th className="px-4 py-3">Gói & Số Tiền</th>
                    <th className="px-4 py-3">Người Đăng Ký</th>
                    <th className="px-4 py-3">Trạng Thái</th>
                    <th className="px-4 py-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-amber-900">
                        #{order.orderCode}
                        <div className="text-[10px] text-slate-400 font-normal">{order.createdAt?.slice(0, 16)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{order.clanName}</div>
                        <div className="text-[11px] text-blue-600 font-mono">{order.fullDomain}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold uppercase text-[10px]">
                          {order.plan} ({order.billingCycleYears} năm)
                        </span>
                        <div className="font-extrabold text-slate-900 text-xs mt-0.5">
                          {Number(order.amount).toLocaleString('vi-VN')} đ
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{order.adminName}</div>
                        <div className="text-[11px] text-slate-500">{order.adminPhone} • {order.adminEmail}</div>
                      </td>
                      <td className="px-4 py-3">
                        {order.paymentStatus === 'paid' ? (
                          <span className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                            <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" />
                            Đã kích hoạt Web
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold">
                            <Clock className="w-3 h-3 mr-1 text-amber-600" />
                            Chờ tiền MBBank
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {order.paymentStatus === 'pending' ? (
                          <button
                            onClick={() => handleConfirmPayment(order)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center space-x-1 ml-auto"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Duyệt & Tạo Web</span>
                          </button>
                        ) : (
                          <a
                            href={`http://localhost:5173/?tenant=${order.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-[11px] inline-flex items-center space-x-1"
                          >
                            <span>Vào Web</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: DUYỆT NẠP VÍ GỬI TIN NHẮN */}
        {activeTab === 'wallet_topups' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase">Danh Sách Yêu Cầu Nạp Tiền Vào Ví Gửi Tin Nhắn</h3>
              <button onClick={fetchWalletTopups} className="text-xs text-amber-700 font-semibold flex items-center space-x-1">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Làm mới</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Mã GD</th>
                    <th className="px-4 py-3">Dòng Họ Yêu Cầu</th>
                    <th className="px-4 py-3">Số Tiền Nạp</th>
                    <th className="px-4 py-3">Số Tin Quy Đổi</th>
                    <th className="px-4 py-3">Người Yêu Cầu</th>
                    <th className="px-4 py-3">Trạng Thái</th>
                    <th className="px-4 py-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {walletTopups.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">#{tx.tx_code}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{tx.clan_name}</div>
                        <div className="text-[11px] text-blue-600 font-mono">{tx.clan_slug}.giatoc.online</div>
                      </td>
                      <td className="px-4 py-3 font-black text-emerald-700 text-xs">
                        +{Number(tx.amount).toLocaleString('vi-VN')} đ
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700">
                        ≈ {Math.floor(Number(tx.amount) / 400)} tin ZNS
                      </td>
                      <td className="px-4 py-3 text-slate-600">{tx.requester_name || 'Quản trị viên'}</td>
                      <td className="px-4 py-3">
                        {tx.status === 'completed' ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                            Đã nạp tiền
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold">
                            Chờ tiền MBBank
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {tx.status === 'pending' && (
                          <button
                            onClick={() => handleConfirmTopup(tx)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center space-x-1 ml-auto"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Duyệt Nạp Ví</span>
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

        {/* TAB: CẤU HÌNH MBBANK */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 max-w-2xl">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Landmark className="w-5 h-5 text-amber-700" />
              <span>Cấu Hình Tài Khoản Nhận Tiền & Hotline Nền Tảng</span>
            </h2>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mã Ngân Hàng (VietQR):</label>
                  <input
                    type="text"
                    value={settings.bank_code}
                    onChange={(e) => setSettings({ ...settings, bank_code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên Ngân Hàng Hiển Thị:</label>
                  <input
                    type="text"
                    value={settings.bank_name}
                    onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số Tài Khoản MBBank (*):</label>
                  <input
                    type="text"
                    value={settings.account_number}
                    onChange={(e) => setSettings({ ...settings, account_number: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-amber-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên Chủ Tài Khoản (*):</label>
                  <input
                    type="text"
                    value={settings.account_name}
                    onChange={(e) => setSettings({ ...settings, account_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hotline Chuyên Gia Hỗ Trợ:</label>
                  <input
                    type="text"
                    value={settings.hotline}
                    onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Hỗ Trợ Kỹ Thuật:</label>
                  <input
                    type="email"
                    value={settings.email_support}
                    onChange={(e) => setSettings({ ...settings, email_support: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                >
                  Lưu Cấu Hình
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
