import React, { useState, useEffect } from 'react';
import { Send, Wallet, PlusCircle, CheckCircle, Clock, AlertCircle, RefreshCw, Landmark, Copy, Check, Users, Sparkles, MessageSquare, ArrowRight, History, ShieldAlert, CheckSquare } from 'lucide-react';
import { API_URL } from '../api';

export default function MessagingWalletTab({ token }) {
  const [activeSubTab, setActiveSubTab] = useState('campaign_wizard'); // 'campaign_wizard', 'campaigns', 'transactions'
  const [walletInfo, setWalletInfo] = useState({ balance: 0, equivalentMessages: 0, unitPrice: 400, transactions: [] });
  const [templates, setTemplates] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  // Top-up Modal state
  const [topupModalOpen, setTopupModalOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState(200000);
  const [topupResult, setTopupResult] = useState(null);
  const [copiedField, setCopiedField] = useState('');

  // Campaign Wizard state
  const [wizardStep, setWizardStep] = useState(1); // 1: Chọn mẫu & Nội dung, 2: Chọn người nhận, 3: Xác nhận & Gửi
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('gio_to');
  const [campaignName, setCampaignName] = useState('');
  const [templateParams, setTemplateParams] = useState({});
  const [targetFilter, setTargetFilter] = useState({ filterType: 'all', chiId: '' });
  const [recipientPreview, setRecipientPreview] = useState({ count: 0, recipients: [], estimatedCost: 0 });
  const [previewLoading, setPreviewLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const fetchWalletInfo = async () => {
    try {
      const res = await fetch(`${API_URL}/zns_wallet.php?action=info`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data) {
        setWalletInfo(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${API_URL}/zns_campaigns.php?action=templates`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setTemplates(data);
        if (data.length > 0) {
          const first = data[0];
          setSelectedTemplateKey(first.key);
          setCampaignName(first.name);
          const initialParams = {};
          first.fields.forEach(f => { initialParams[f.name] = f.default || ''; });
          setTemplateParams(initialParams);
        }
      }
    } catch (err) {}
  };

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(`${API_URL}/zns_campaigns.php?action=list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setCampaigns(data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchWalletInfo();
    fetchTemplates();
    fetchCampaigns();
  }, [token]);

  const handleSelectTemplate = (tpl) => {
    setSelectedTemplateKey(tpl.key);
    setCampaignName(tpl.name);
    const initialParams = {};
    tpl.fields.forEach(f => { initialParams[f.name] = f.default || ''; });
    setTemplateParams(initialParams);
  };

  const handlePreviewRecipients = async (filter) => {
    setPreviewLoading(true);
    try {
      const res = await fetch(`${API_URL}/zns_campaigns.php?action=preview_recipients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(filter || targetFilter)
      });
      const data = await res.json();
      if (res.ok) {
        setRecipientPreview(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleCreateTopup = async () => {
    try {
      const res = await fetch(`${API_URL}/zns_wallet.php?action=create_topup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: topupAmount })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTopupResult(data);
      }
    } catch (err) {
      alert('Lỗi tạo lệnh nạp ví: ' + err.message);
    }
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleSendCampaign = async () => {
    if (walletInfo.balance < recipientPreview.estimatedCost) {
      alert(`Số dư Ví gửi tin nhắn thông báo (${walletInfo.balance.toLocaleString('vi-VN')} đ) không đủ. Vui lòng nạp thêm cước trước khi gửi!`);
      return;
    }

    if (!window.confirm(`Xác nhận gửi tin nhắn tới ${recipientPreview.count} thành viên? Chi phí dự tính: ${recipientPreview.estimatedCost.toLocaleString('vi-VN')} đ.`)) {
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`${API_URL}/zns_campaigns.php?action=create_and_send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          templateKey: selectedTemplateKey,
          campaignName,
          templateParams,
          targetFilter
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Có lỗi khi gửi tin nhắn.');
      }
      alert(`Thành công! ${data.message}`);
      setWizardStep(1);
      fetchWalletInfo();
      fetchCampaigns();
      setActiveSubTab('campaigns');
    } catch (err) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  };

  const currentTpl = templates.find(t => t.key === selectedTemplateKey) || templates[0];

  // Render live preview message
  const renderMessagePreview = () => {
    if (!currentTpl) return '';
    let text = currentTpl.preview;
    text = text.replace('{ten_nguoi_nhan}', 'Nguyễn Văn A');
    text = text.replace('{ten_dong_ho}', 'Dòng Họ');
    Object.entries(templateParams).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v || `[${k}]`);
    });
    return text;
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP CARD: VÍ GỬI TIN NHẮN THÔNG BÁO */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-inner flex-shrink-0">
            <Wallet className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-300">Tài Khoản Dịch Vụ</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-bold">Hoạt động 24/7</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">Ví Gửi Tin Nhắn Thông Báo</h2>
            <p className="text-xs text-slate-300">Cước gửi tin Zalo ZNS / SMS tự động thông báo giỗ họ, thu quỹ, tin buồn</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="text-center sm:text-right bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
            <div className="text-[11px] text-slate-400 font-semibold">Số Dư Khả Dụng Trong Ví:</div>
            <div className="text-2xl font-black text-amber-300 tracking-tight">
              {Number(walletInfo.balance).toLocaleString('vi-VN')} đ
            </div>
            <div className="text-[10px] text-emerald-400 font-bold mt-0.5">
              ≈ {walletInfo.equivalentMessages} tin nhắn ZNS (400 đ/tin)
            </div>
          </div>

          <button
            onClick={() => {
              setTopupResult(null);
              setTopupModalOpen(true);
            }}
            className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-1.5 transition-all whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nạp Thêm Tiền Vào Ví</span>
          </button>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 text-xs font-bold">
        <button
          onClick={() => {
            setActiveSubTab('campaign_wizard');
            handlePreviewRecipients();
          }}
          className={`px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-all ${
            activeSubTab === 'campaign_wizard'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Tạo Chiến Dịch Gửi Tin Mới</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('campaigns');
            fetchCampaigns();
          }}
          className={`px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-all ${
            activeSubTab === 'campaigns'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Lịch Sử Gửi Tin ({campaigns.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('transactions');
            fetchWalletInfo();
          }}
          className={`px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-all ${
            activeSubTab === 'transactions'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Lịch Sử Biến Động Ví</span>
        </button>
      </div>

      {/* 3. TAB: TRÌNH TẠO CHIẾN DỊCH (CAMPAIGN WIZARD) */}
      {activeSubTab === 'campaign_wizard' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
          
          {/* Tracker 3 bước */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 pb-4">
            <div className={`flex items-center space-x-2 ${wizardStep >= 1 ? 'text-amber-700' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${wizardStep >= 1 ? 'bg-amber-600 text-white' : 'bg-slate-300'}`}>1</span>
              <span>1. Chọn Mẫu & Nội Dung Tin</span>
            </div>
            <div className="h-0.5 w-12 bg-slate-200" />
            <div className={`flex items-center space-x-2 ${wizardStep >= 2 ? 'text-amber-700' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${wizardStep >= 2 ? 'bg-amber-600 text-white' : 'bg-slate-300'}`}>2</span>
              <span>2. Chọn Nhóm Người Nhận</span>
            </div>
            <div className="h-0.5 w-12 bg-slate-200" />
            <div className={`flex items-center space-x-2 ${wizardStep >= 3 ? 'text-amber-700' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${wizardStep >= 3 ? 'bg-amber-600 text-white' : 'bg-slate-300'}`}>3</span>
              <span>3. Xác Nhận & Gửi Tin</span>
            </div>
          </div>

          {/* BƯỚC 1: CHỌN MẪU & ĐIỀN THAM SỐ */}
          {wizardStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Chọn 1 trong 5 Mẫu Tin Nhắn Zalo ZNS Duyệt Sẵn:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {templates.map(tpl => (
                    <button
                      type="button"
                      key={tpl.key}
                      onClick={() => handleSelectTemplate(tpl)}
                      className={`p-3 text-left rounded-xl border-2 transition-all flex flex-col justify-between ${
                        selectedTemplateKey === tpl.key
                          ? 'border-amber-600 bg-amber-50/80 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="text-[10px] font-bold text-amber-800 uppercase">{tpl.category}</div>
                        <div className="font-bold text-xs text-slate-900 mt-1">{tpl.name}</div>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-2 line-clamp-2">{tpl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form điền tham số & Xem trước */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Điền Thông Tin Cần Thông Báo:</h4>
                  
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tên Chiến Dịch (*):</label>
                    <input
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                    />
                  </div>

                  {currentTpl?.fields?.map(f => (
                    <div key={f.name}>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">{f.label}:</label>
                      <input
                        type="text"
                        placeholder={f.placeholder}
                        value={templateParams[f.name] || ''}
                        onChange={(e) => setTemplateParams({ ...templateParams, [f.name]: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                  ))}
                </div>

                {/* Khối Live Preview Tin Nhắn Zalo */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Xem Trước Nội Dung Tin Nhắn Gửi Tới Zalo:</h4>
                  <div className="p-5 bg-gradient-to-b from-blue-50 to-slate-100 rounded-2xl border border-blue-200 shadow-inner space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-bold text-blue-900 border-b border-blue-200 pb-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">OA</div>
                      <span>Gia Tộc Online — Thông Báo Dòng Tộc</span>
                    </div>
                    <div className="whitespace-pre-line text-xs text-slate-800 font-sans leading-relaxed bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                      {renderMessagePreview()}
                    </div>
                    <div className="text-[10px] text-slate-500 italic">
                      * Tên người nhận `{'{ten_nguoi_nhan}'}` sẽ được hệ thống tự động cá nhân hóa theo từng thành viên trong gia phả.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handlePreviewRecipients();
                    setWizardStep(2);
                  }}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5"
                >
                  <span>Tiếp tục: Chọn người nhận</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* BƯỚC 2: CHỌN NHÓM NGƯỜI NHẬN */}
          {wizardStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Chọn Nhóm Đối Tượng Nhận Tin Nhắn:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { type: 'all', title: 'Toàn Bộ Dòng Họ', desc: 'Gửi cho tất cả thành viên có lưu số điện thoại' },
                    { type: 'unregistered', title: 'Chưa Đăng Ký Suất Đinh', desc: 'Nhắc nhở con cháu chưa hoàn thành đăng ký quỹ họ' },
                    { type: 'registered', title: 'Đã Đăng Ký Suất Đinh', desc: 'Gửi riêng cho các suất đinh chính thức' },
                  ].map(item => (
                    <button
                      type="button"
                      key={item.type}
                      onClick={() => {
                        const newFilter = { ...targetFilter, filterType: item.type };
                        setTargetFilter(newFilter);
                        handlePreviewRecipients(newFilter);
                      }}
                      className={`p-3.5 text-left rounded-xl border-2 transition-all ${
                        targetFilter.filterType === item.type
                          ? 'border-amber-600 bg-amber-50/80 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500 mt-1">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Danh sách người nhận trích xuất */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-amber-700" />
                    <span>Danh Sách Người Nhận Hợp Lệ ({recipientPreview.count} người)</span>
                  </h4>
                  <span className="text-xs text-slate-600">
                    Cước phí dự tính: <strong className="text-amber-800">{Number(recipientPreview.estimatedCost).toLocaleString('vi-VN')} đ</strong> (400đ/tin)
                  </span>
                </div>

                <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl bg-slate-50">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-200/70 text-slate-700 text-[10px] uppercase font-bold sticky top-0">
                      <tr>
                        <th className="px-4 py-2">STT</th>
                        <th className="px-4 py-2">Họ Tên</th>
                        <th className="px-4 py-2">Đời Thứ</th>
                        <th className="px-4 py-2">Số Điện Thoại</th>
                        <th className="px-4 py-2">Trạng Thái Suất Đinh</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 bg-white">
                      {recipientPreview.recipients.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-4 py-6 text-center text-slate-400">
                            Không tìm thấy thành viên nào có số điện thoại theo bộ lọc này.
                          </td>
                        </tr>
                      ) : (
                        recipientPreview.recipients.map((rec, i) => (
                          <tr key={rec.id || i} className="hover:bg-slate-50">
                            <td className="px-4 py-2 text-slate-400">{i + 1}</td>
                            <td className="px-4 py-2 font-bold text-slate-800">{rec.name}</td>
                            <td className="px-4 py-2 text-slate-600">Đời {rec.generation}</td>
                            <td className="px-4 py-2 font-mono text-blue-700 font-semibold">{rec.phone}</td>
                            <td className="px-4 py-2">
                              {rec.isRegistered ? (
                                <span className="text-[10px] text-emerald-700 font-bold">Đã đăng ký</span>
                              ) : (
                                <span className="text-[10px] text-amber-700 font-semibold">Chưa đăng ký</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  disabled={recipientPreview.count === 0}
                  onClick={() => setWizardStep(3)}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5"
                >
                  <span>Tiếp tục: Xác nhận gửi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* BƯỚC 3: XÁC NHẬN & GỬI TIN */}
          {wizardStep === 3 && (
            <div className="space-y-6 max-w-xl mx-auto text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-sm">
                <Send className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Xác Nhận Phát Động Chiến Dịch Tin Nhắn</h3>
                <p className="text-xs text-slate-500">Vui lòng kiểm tra kỹ chi phí và nội dung trước khi bấm gửi</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tên chiến dịch:</span>
                  <strong className="text-slate-900">{campaignName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mẫu tin ZNS:</span>
                  <strong className="text-amber-900">{currentTpl?.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tổng số người nhận:</span>
                  <strong className="text-blue-900">{recipientPreview.count} người</strong>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-700 font-bold">Tổng chi phí cước (400đ/tin):</span>
                  <strong className="text-amber-800 font-extrabold text-sm">{Number(recipientPreview.estimatedCost).toLocaleString('vi-VN')} đ</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số dư hiện tại trong ví:</span>
                  <strong className={walletInfo.balance >= recipientPreview.estimatedCost ? 'text-emerald-700' : 'text-rose-700'}>
                    {Number(walletInfo.balance).toLocaleString('vi-VN')} đ
                  </strong>
                </div>
              </div>

              {walletInfo.balance < recipientPreview.estimatedCost && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2 text-left">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  <span>Số dư Ví gửi tin nhắn thông báo không đủ để gửi chiến dịch này. Vui lòng nạp thêm tiền!</span>
                </div>
              )}

              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold"
                >
                  Quay lại
                </button>

                {walletInfo.balance < recipientPreview.estimatedCost ? (
                  <button
                    type="button"
                    onClick={() => {
                      setTopupResult(null);
                      setTopupModalOpen(true);
                    }}
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Nạp Thêm Tiền Vào Ví</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={sending}
                    onClick={handleSendCampaign}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{sending ? 'Đang phát tin nhắn...' : 'Gửi Tin Nhắn Ngay'}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. TAB: LỊCH SỬ GỬI TIN */}
      {activeSubTab === 'campaigns' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase">Danh Sách Chiến Dịch Đã Gửi</h3>
            <button onClick={fetchCampaigns} className="text-xs text-amber-700 font-semibold flex items-center space-x-1">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Cập nhật</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Mã Chiến Dịch</th>
                  <th className="px-4 py-3">Tên Chiến Dịch</th>
                  <th className="px-4 py-3">Số Người Nhận</th>
                  <th className="px-4 py-3">Tổng Chi Phí</th>
                  <th className="px-4 py-3">Trạng Thái</th>
                  <th className="px-4 py-3">Thời Gian Gửi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-slate-400">
                      Chưa có chiến dịch gửi tin nào được tạo.
                    </td>
                  </tr>
                ) : (
                  campaigns.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-amber-900">#{c.campaignCode}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{c.name}</td>
                      <td className="px-4 py-3 font-semibold text-blue-900">{c.totalRecipients} người</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{Number(c.totalCost).toLocaleString('vi-VN')} đ</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                          Đã gửi thành công
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{c.createdAt?.slice(0, 16)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TAB: LỊCH SỬ BIẾN ĐỘNG VÍ */}
      {activeSubTab === 'transactions' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase">Lịch Sử Nạp Tiền & Trừ Cước Ví</h3>
            <button onClick={fetchWalletInfo} className="text-xs text-amber-700 font-semibold flex items-center space-x-1">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Cập nhật</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Mã GD</th>
                  <th className="px-4 py-3">Loại Giao Dịch</th>
                  <th className="px-4 py-3">Nội Dung</th>
                  <th className="px-4 py-3">Số Tiền</th>
                  <th className="px-4 py-3">Trạng Thái</th>
                  <th className="px-4 py-3">Thời Gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {walletInfo.transactions?.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-slate-400">
                      Chưa có giao dịch biến động ví nào.
                    </td>
                  </tr>
                ) : (
                  walletInfo.transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">#{tx.txCode}</td>
                      <td className="px-4 py-3">
                        {tx.type === 'topup' ? (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[10px]">Nạp tiền</span>
                        ) : tx.type === 'usage' ? (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">Trừ cước</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Hoàn tiền</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{tx.description}</td>
                      <td className={`px-4 py-3 font-extrabold ${tx.type === 'topup' ? 'text-emerald-700' : 'text-slate-900'}`}>
                        {tx.type === 'topup' ? '+' : '-'}{Number(tx.amount).toLocaleString('vi-VN')} đ
                      </td>
                      <td className="px-4 py-3">
                        {tx.status === 'completed' ? (
                          <span className="text-[10px] text-emerald-700 font-bold">Thành công</span>
                        ) : (
                          <span className="text-[10px] text-amber-700 font-bold">Chờ duyệt tiền</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{tx.createdAt?.slice(0, 16)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. MODAL NẠP TIỀN VIETQR MBBANK VÀO VÍ */}
      {topupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
            <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-amber-950 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wallet className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-amber-300">Nạp Tiền Vào Ví Gửi Tin Nhắn Thông Báo</h3>
              </div>
              <button onClick={() => setTopupModalOpen(false)} className="text-slate-400 hover:text-white text-xl font-bold">
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4">
              {!topupResult ? (
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-700">Chọn Số Tiền Cần Nạp:</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[100000, 200000, 500000, 1000000].map(amt => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setTopupAmount(amt)}
                        className={`p-3 text-center rounded-xl border-2 transition-all ${
                          topupAmount === amt
                            ? 'border-amber-600 bg-amber-50 font-bold text-amber-900'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="text-sm font-black">{amt.toLocaleString('vi-VN')} đ</div>
                        <div className="text-[10px] text-slate-500">≈ {Math.floor(amt / 400)} tin ZNS</div>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateTopup}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    Tạo Mã VietQR Nạp {topupAmount.toLocaleString('vi-VN')} đ
                  </button>
                </div>
              ) : (
                <div className="space-y-3 text-center text-xs">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 inline-block">
                    <img
                      src={topupResult.bankInfo?.qrUrl}
                      alt="VietQR Topup"
                      className="w-48 h-48 object-contain mx-auto bg-white p-1 rounded-lg"
                    />
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-left space-y-1.5 font-sans">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">STK MBBank:</span>
                      <strong className="font-mono text-amber-900">{topupResult.bankInfo?.accountNumber}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Chủ TK:</span>
                      <strong>{topupResult.bankInfo?.accountName}</strong>
                    </div>
                    <div className="flex justify-between items-center border-t border-amber-200 pt-1.5">
                      <span className="text-amber-900 font-bold">Nội dung CK:</span>
                      <div className="flex items-center space-x-1">
                        <strong className="font-mono text-amber-950 font-black">{topupResult.memo}</strong>
                        <button
                          onClick={() => handleCopy(topupResult.memo, 'topup_memo')}
                          className="p-1 bg-white hover:bg-amber-100 rounded border border-amber-300 text-[10px]"
                        >
                          {copiedField === 'topup_memo' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500">
                    Sau khi nhận được chuyển khoản, hệ thống sẽ cộng {topupResult.amount?.toLocaleString('vi-VN')} đ vào Ví gửi tin nhắn thông báo của dòng họ.
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setTopupModalOpen(false);
                      fetchWalletInfo();
                    }}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                  >
                    Đóng Hộp Thoại
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
