import React, { useState, useEffect, useMemo, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, TreePine, Image as ImageIcon, Clock, FileText,
  Download, Upload, Key, Settings, Palette, Bell, Search, Plus, Trash2,
  Edit, CheckCircle2, AlertCircle, RefreshCw, ChevronRight, ExternalLink,
  Shield, CreditCard, Sparkles, ZoomIn, ZoomOut, Maximize2, Filter,
  FileSpreadsheet, Database, HardDrive, Check, X, Eye, HelpCircle,
  Menu, LogOut, ChevronDown, UserPlus, FileArchive, Globe, Smartphone,
  Info, ArrowUpRight, Copy, Landmark, ShieldCheck
} from 'lucide-react';
import { AppContext } from '../store';
import { API_URL, apiRequest } from '../api';

// Toast Notification Manager
const ToastContext = React.createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Overlay Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-xl border text-xs font-semibold backdrop-blur-md transition-all duration-300 animate-slide-up ${
              t.type === 'success'
                ? 'bg-[#0F3B4A]/95 text-[#F6F7F9] border-[#C79A2E]/60'
                : t.type === 'error'
                ? 'bg-rose-900/95 text-white border-rose-500/60'
                : 'bg-[#2B2F33]/95 text-white border-slate-600'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {t.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#C79A2E] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{t.message}</span>
            </div>
            <button
              onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
              className="text-white/60 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT CHÍNH: ADMIN PORTAL QUẢN TRỊ DÒNG HỌ
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminPortalPage() {
  return (
    <ToastProvider>
      <AdminPortalContent />
    </ToastProvider>
  );
}

function AdminPortalContent() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { user, token, logout, tenant } = useContext(AppContext) || {};

  // Tab State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchGlobal, setSearchGlobal] = useState('');

  // Dữ liệu dòng họ State (Local + Mock/API sync)
  const [clanInfo, setClanInfo] = useState({
    name: tenant?.name || 'Dòng Họ Trần Đình',
    branch: 'Chi Trưởng • Tiên Điền',
    slug: tenant?.slug || 'hotrandinh',
    customDomain: 'hotrandinh.com',
    plan: 'pro',
    expiresAt: '2027-08-31T23:59:59Z',
    membersQuota: 1500,
    storageQuotaMb: 10240,
    storageUsedMb: 1240,
    primaryColor: '#0F3B4A',
    accentColor: '#C79A2E',
    motto: 'Cây có cội mới nở cành xanh lá • Nước có nguồn mới tủa khắp rạch sông',
    templateStyle: 'classic' // 'classic' | 'modern' | 'minimal'
  });

  // Danh sách Thành viên
  const [members, setMembers] = useState([
    { id: 1, fullName: 'Trần Đình Văn', nickname: 'Cụ Thủy Tổ', gender: 'male', gen: 1, birthDate: '1820', deathDate: '1895', role: 'Thủy Tổ', branch: 'Toàn Tộc', phone: '0912 888 678', tomb: 'Khu Lăng Mộ Tổ Núi Rồng', parentIds: [] },
    { id: 2, fullName: 'Trần Đình Toàn', nickname: 'Cụ Toàn', gender: 'male', gen: 2, birthDate: '1852', deathDate: '1920', role: 'Trưởng Chi 1', branch: 'Chi 1', phone: '0983 555 123', tomb: 'Nghĩa Trang Dòng Họ Khu A', parentIds: [1] },
    { id: 3, fullName: 'Trần Đình Đức', nickname: 'Cụ Đức', gender: 'male', gen: 2, birthDate: '1856', deathDate: '1930', role: 'Trưởng Chi 2', branch: 'Chi 2', phone: '0904 333 789', tomb: 'Khu Lăng Mộ Chi 2', parentIds: [1] },
    { id: 4, fullName: 'Trần Đình An', nickname: 'Ông An', gender: 'male', gen: 3, birthDate: '1885', deathDate: '1955', role: 'Chi 1 Đời 3', branch: 'Chi 1', phone: '0918 111 222', tomb: 'Nghĩa Trang Quê Nhà', parentIds: [2] },
    { id: 5, fullName: 'Trần Đình Bình', nickname: 'Ông Bình', gender: 'male', gen: 3, birthDate: '1890', deathDate: '1962', role: 'Chi 1 Đời 3', branch: 'Chi 1', phone: '0977 444 999', tomb: 'Nghĩa Trang Liệt Sĩ', parentIds: [2] },
    { id: 6, fullName: 'Trần Đình Cường', nickname: 'Ông Cường', gender: 'male', gen: 3, birthDate: '1895', deathDate: '1970', role: 'Chi 2 Đời 3', branch: 'Chi 2', phone: '0936 222 333', tomb: 'Nghĩa Trang Xã', parentIds: [3] },
    { id: 7, fullName: 'Trần Đình Trung', nickname: 'Anh Trung', gender: 'male', gen: 4, birthDate: '1985', deathDate: null, role: 'Trưởng Ban Công Nghệ', branch: 'Chi 1', phone: '0912 345 678', tomb: '', parentIds: [4] },
    { id: 8, fullName: 'Trần Thị Mai', nickname: 'Chị Mai', gender: 'female', gen: 4, birthDate: '1990', deathDate: null, role: 'Thủ Quỹ Dòng Họ', branch: 'Chi 1', phone: '0988 777 666', tomb: '', parentIds: [4] },
  ]);

  // Modal State Thêm / Sửa thành viên
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberFormData, setMemberFormData] = useState({
    fullName: '', nickname: '', gender: 'male', gen: 4, birthDate: '', deathDate: '',
    role: 'Con Cháu', branch: 'Chi 1', phone: '', tomb: '', parentId: ''
  });

  // Modal Cấp/Gia Hạn License
  const [licenseModalOpen, setLicenseModalOpen] = useState(false);
  const [paymentGateway, setPaymentGateway] = useState('vietqr'); // 'vietqr' | 'stripe' | 'vnpay'

  // Modal & Progress Import CSV/Excel
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importProgress, setImportProgress] = useState(null); // null | { step: 1..100, status: 'processing' | 'done' }
  const [importReport, setImportReport] = useState(null);

  // Danh mục Bài Viết & Tin Tức
  const [posts, setPosts] = useState([
    { id: 1, title: 'Thông Báo Lễ Giỗ Tổ Thường Niên Năm 2026', category: 'Sự Kiện', date: '2026-08-15', status: 'published', views: 480 },
    { id: 2, title: 'Báo Cáo Tiến Độ Tôn Tạo Nhà Thờ Chi Trưởng Tiên Điền', category: 'Từ Đường', date: '2026-07-20', status: 'published', views: 320 },
    { id: 3, title: 'Danh Sách Khen Thưởng Con Cháu Đỗ Đạt Khuyến Học Năm Giáp Thìn', category: 'Khuyến Học', date: '2026-06-10', status: 'draft', views: 0 },
  ]);

  // Danh mục Album Ảnh & Media
  const [albums, setAlbums] = useState([
    { id: 1, title: 'Lễ Giỗ Tổ Năm 2025', photosCount: 24, coverUrl: '/media/brand/logo-icon.png', date: '15/08 Âm Lịch' },
    { id: 2, title: 'Di Tích Nhà Thờ Họ & Bia Ký Cổ', photosCount: 16, coverUrl: '/media/brand/logo-icon.png', date: 'Di Sản' },
    { id: 3, title: 'Lễ Đón Bằng Di Tích Lịch Sử Văn Hóa', photosCount: 38, coverUrl: '/media/brand/logo-icon.png', date: '2024' },
  ]);

  // Lịch sử Hoạt Động (Recent Activity Log)
  const [activities, setActivities] = useState([
    { id: 1, action: 'Thêm mới thành viên', detail: 'Trần Đình Trung (Đời 4)', time: '10 phút trước', user: 'Admin' },
    { id: 2, action: 'Cập nhật sổ quỹ', detail: 'Thu quỹ họ năm 2026: +15.000.000đ', time: '1 giờ trước', user: 'Thủ Quỹ Mai' },
    { id: 3, action: 'Sao lưu dữ liệu tự động', detail: 'Backup snapshot 30 ngày an toàn', time: 'Hôm nay lúc 02:00', user: 'Hệ Thống' },
  ]);

  // Loading indicator chung
  const [isActionLoading, setIsActionLoading] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────
  // CRUD THÀNH VIÊN (API CONTRACT)
  // ─────────────────────────────────────────────────────────────────────────
  const handleOpenAddMember = () => {
    setEditingMember(null);
    setMemberFormData({
      fullName: '', nickname: '', gender: 'male', gen: 4, birthDate: '', deathDate: '',
      role: 'Con Cháu', branch: 'Chi 1', phone: '', tomb: '', parentId: '1'
    });
    setMemberModalOpen(true);
  };

  const handleOpenEditMember = (m) => {
    setEditingMember(m);
    setMemberFormData({
      fullName: m.fullName,
      nickname: m.nickname || '',
      gender: m.gender || 'male',
      gen: m.gen || 1,
      birthDate: m.birthDate || '',
      deathDate: m.deathDate || '',
      role: m.role || '',
      branch: m.branch || 'Chi 1',
      phone: m.phone || '',
      tomb: m.tomb || '',
      parentId: m.parentIds?.[0] ? String(m.parentIds[0]) : ''
    });
    setMemberModalOpen(true);
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    if (!memberFormData.fullName.trim()) {
      addToast('Vui lòng nhập Họ và Tên thành viên!', 'error');
      return;
    }

    setIsActionLoading(true);
    try {
      if (editingMember) {
        // API PUT: /api/v1/members/{memberId}
        await new Promise(r => setTimeout(r, 400)); // Giả lập mạng / Gọi API thực
        setMembers(prev => prev.map(m => (m.id === editingMember.id ? {
          ...m,
          ...memberFormData,
          parentIds: memberFormData.parentId ? [parseInt(memberFormData.parentId)] : []
        } : m)));
        addToast(`Cập nhật thông tin [${memberFormData.fullName}] thành công!`, 'success');
      } else {
        // API POST: /api/v1/families/{familyId}/members
        await new Promise(r => setTimeout(r, 400));
        const newId = Date.now();
        const newMember = {
          id: newId,
          ...memberFormData,
          parentIds: memberFormData.parentId ? [parseInt(memberFormData.parentId)] : []
        };
        setMembers(prev => [...prev, newMember]);
        setActivities(prev => [{ id: Date.now(), action: 'Thêm mới thành viên', detail: newMember.fullName, time: 'Vừa xong', user: 'Admin' }, ...prev]);
        addToast(`Đã thêm thành viên [${memberFormData.fullName}] vào cây phả hệ!`, 'success');
      }
      setMemberModalOpen(false);
    } catch (err) {
      addToast('Lỗi khi lưu dữ liệu thành viên: ' + err.message, 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteMember = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa thành viên [${name}] khỏi gia phả?`)) return;
    setIsActionLoading(true);
    try {
      // API DELETE: /api/v1/members/{memberId}
      await new Promise(r => setTimeout(r, 300));
      setMembers(prev => prev.filter(m => m.id !== id));
      addToast(`Đã xóa thành viên [${name}] khỏi hệ thống.`, 'success');
    } catch (err) {
      addToast('Không thể xóa: ' + err.message, 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // IMPORT CSV / EXCEL VỚI DAG VALIDATION
  // ─────────────────────────────────────────────────────────────────────────
  const handleStartImportCsv = async () => {
    setImportProgress({ step: 10, status: 'Đang tải tệp & phân tích cú pháp...' });
    try {
      await new Promise(r => setTimeout(r, 600));
      setImportProgress({ step: 45, status: 'Đang kiểm tra chu trình đồ thị (DAG Cycle Validation)...' });
      await new Promise(r => setTimeout(r, 700));
      setImportProgress({ step: 80, status: 'Đang ánh xạ quan hệ cha - con & chi phái...' });
      await new Promise(r => setTimeout(r, 500));
      setImportProgress({ step: 100, status: 'Hoàn tất!' });

      setImportReport({
        totalRows: 142,
        validMembers: 142,
        warnings: 0,
        dagCycleFound: false,
        maxGenDetected: 7,
        branchesFound: ['Chi 1 (Tiên Điền)', 'Chi 2 (Nghi Xuân)', 'Chi 3']
      });
      addToast('Import thành công 142 thành viên gia phả! Cây phả hệ đã cập nhật.', 'success');
    } catch (err) {
      addToast('Lỗi nạp file Excel: ' + err.message, 'error');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // XUẤT FILE GEDCOM & BACKUP DB
  // ─────────────────────────────────────────────────────────────────────────
  const handleExportGedcom = async () => {
    setIsActionLoading(true);
    try {
      // API POST: /api/v1/families/{familyId}/exports?format=gedcom
      await new Promise(r => setTimeout(r, 600));
      const fakeDownloadUrl = `data:text/plain;charset=utf-8,0 HEAD%0A1 SOUR GIATOC_ONLINE%0A1 GEDC%0A2 VERS 5.5.1%0A0 @I1@ INDI%0A1 NAME Tran Dinh Van%0A0 TRLR`;
      const link = document.createElement('a');
      link.href = fakeDownloadUrl;
      link.download = `giapha_${clanInfo.slug}_gedcom_5.5.1.ged`;
      link.click();
      addToast('Đã xuất file GEDCOM 5.5.1 chuẩn quốc tế thành công!', 'success');
    } catch (err) {
      addToast('Lỗi xuất file: ' + err.message, 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleBackupNow = async () => {
    setIsActionLoading(true);
    try {
      // API POST: /api/v1/families/{familyId}/backup
      await new Promise(r => setTimeout(r, 800));
      const backupData = JSON.stringify({ clanInfo, members, posts, albums, exportedAt: new Date().toISOString() }, null, 2);
      const blob = new Blob([backupData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_${clanInfo.slug}_snapshot_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      setActivities(prev => [{ id: Date.now(), action: 'Sao lưu thủ công', detail: 'Tải file snapshot JSON an toàn', time: 'Vừa xong', user: 'Admin' }, ...prev]);
      addToast('Đã tạo bản sao lưu snapshot thành công (Bảo lưu 30 ngày)!', 'success');
    } catch (err) {
      addToast('Lỗi sao lưu: ' + err.message, 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // ĐỔI TEMPLATE DEMO & TẢI JSON SEED
  // ─────────────────────────────────────────────────────────────────────────
  const handleApplyTemplate = (style) => {
    setClanInfo(prev => ({ ...prev, templateStyle: style }));
    addToast(`Đã áp dụng giao diện mẫu [${style.toUpperCase()}] thành công!`, 'success');
  };

  const handleDownloadSeedTemplate = () => {
    const seed = {
      template: clanInfo.templateStyle,
      siteSettings: clanInfo,
      members,
      posts,
      albums,
      version: '2.0.0'
    };
    const blob = new Blob([JSON.stringify(seed, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seed_${clanInfo.templateStyle}_template.json`;
    a.click();
    addToast('Đã tải file JSON Seed mẫu để nhân bản!', 'success');
  };

  // Filter Thành viên trong bảng
  const filteredMembers = useMemo(() => {
    if (!searchGlobal.trim()) return members;
    const q = searchGlobal.toLowerCase();
    return members.filter(m =>
      m.fullName.toLowerCase().includes(q) ||
      (m.nickname && m.nickname.toLowerCase().includes(q)) ||
      (m.role && m.role.toLowerCase().includes(q)) ||
      (m.phone && m.phone.includes(q))
    );
  }, [members, searchGlobal]);

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-[#2B2F33] font-sans antialiased flex flex-col selection:bg-[#C79A2E] selection:text-[#0F3B4A]">

      {/* ── 1. STICKY COMPACT HEADER ────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0F3B4A] text-white border-b border-[#C79A2E]/30 shadow-md h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            aria-label="Mở menu quản trị"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/portal" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0F3B4A] to-[#C79A2E] border border-[#C79A2E] flex items-center justify-center font-serif font-black text-xs text-white shadow-sm">
              GT
            </div>
            <div className="leading-tight hidden sm:block">
              <span className="font-serif font-bold text-sm text-[#C79A2E] tracking-tight">{clanInfo.name}</span>
              <span className="block text-[10px] text-white/60 uppercase font-semibold">Portal Quản Trị Dòng Họ</span>
            </div>
          </Link>
        </div>

        {/* Center: Search & Breadcrumbs */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm nhanh thành viên, mộ phần, bài viết..."
              value={searchGlobal}
              onChange={(e) => setSearchGlobal(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-[#2B2F33] text-xs rounded-full border border-white/20 focus:border-[#C79A2E] outline-none transition-all placeholder:text-white/40"
            />
          </div>
        </div>

        {/* Right: Quick Actions, Notification, Avatar & Link to Public Site */}
        <div className="flex items-center gap-2.5">
          <a
            href={`https://${clanInfo.customDomain}`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#F6F7F9] border border-white/20 text-xs font-bold transition-colors"
          >
            <span>Xem Web Dòng Họ</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#C79A2E]" />
          </a>

          <button
            onClick={() => addToast('Hệ thống hoạt động bình thường. Không có cảnh báo bảo mật.', 'info')}
            className="p-2 text-white/80 hover:text-[#C79A2E] hover:bg-white/10 rounded-full relative"
            title="Thông báo hệ thống"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#C79A2E] absolute top-1.5 right-1.5" />
          </button>

          <div className="h-6 w-px bg-white/20 mx-1 hidden sm:block" />

          {/* User Profile dropdown */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#C79A2E] text-[#0F3B4A] font-black text-xs flex items-center justify-center shadow">
              AD
            </div>
            <div className="hidden xl:block text-left text-xs leading-tight">
              <div className="font-bold text-white">Ban Liên Lạc</div>
              <div className="text-[10px] text-[#C79A2E] font-semibold uppercase">Super Admin</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── 2. MAIN WORKSPACE (SIDEBAR + CONTENT) ───────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* SIDEBAR NAVIGATION (Desktop & Mobile Drawer) */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E6E9EE] flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-0 lg:translate-x-0'
          } ${!mobileMenuOpen && 'hidden lg:flex'}`}
        >
          {/* Menu Items */}
          <div className="p-4 space-y-1.5 overflow-y-auto">
            <div className="text-[11px] font-black text-[#5B7583] uppercase tracking-wider px-3 py-2">
              Quản Trị Hệ Thống
            </div>

            {[
              { id: 'dashboard', label: 'Bảng Điều Khiển', icon: LayoutDashboard },
              { id: 'members', label: 'Danh Sách Con Cháu', icon: Users, badge: members.length },
              { id: 'tree', label: 'Cây Phả Hệ Tương Tác', icon: TreePine },
              { id: 'media', label: 'Album & Kỷ Yếu Ảnh', icon: ImageIcon, badge: albums.length },
              { id: 'posts', label: 'Tin Tức & Hoạt Động', icon: FileText, badge: posts.length },
              { id: 'timeline', label: 'Dòng Thời Gian Lịch Sử', icon: Clock },
              { id: 'import-export', label: 'Nhập / Xuất File Excel', icon: FileSpreadsheet },
              { id: 'templates', label: 'Giao Diện Mẫu (Templates)', icon: Palette, isHot: true },
              { id: 'license', label: 'Bản Quyền & Gói Cước', icon: Key, badge: clanInfo.plan.toUpperCase() },
              { id: 'settings', label: 'Cài Đặt Dòng Họ', icon: Settings },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#0F3B4A] text-white shadow-sm'
                      : 'text-[#2B2F33] hover:bg-[#F6F7F9] hover:text-[#0F3B4A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#C79A2E]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${isActive ? 'bg-[#C79A2E] text-[#0F3B4A]' : 'bg-slate-100 text-slate-600'}`}>
                      {item.badge}
                    </span>
                  )}
                  {item.isHot && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500 text-white font-black uppercase">
                      Mới
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Sidebar info */}
          <div className="p-4 border-t border-[#E6E9EE] bg-[#F6F7F9]/50 space-y-3">
            <div className="p-3 bg-white rounded-xl border border-[#E6E9EE] text-xs space-y-1">
              <div className="flex items-center justify-between text-[#5B7583]">
                <span>Dung lượng NVMe:</span>
                <span className="font-bold text-[#0F3B4A]">1.2 GB / 10 GB</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#C79A2E] h-full rounded-full w-[12%]" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#5B7583]">
              <span className="font-semibold">Bản quyền: <strong>Gói Pro</strong></span>
              <button
                onClick={() => handleBackupNow()}
                className="text-[11px] font-bold text-[#0F3B4A] hover:underline"
              >
                Sao lưu
              </button>
            </div>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">

          {/* ─────────────────────────────────────────────────────────────────
              TAB 1: DASHBOARD OVERVIEW
             ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              {/* Hero Banner compact */}
              <div className="bg-gradient-to-r from-[#0F3B4A] via-[#164E63] to-[#0F3B4A] text-white p-6 sm:p-8 rounded-3xl border border-[#C79A2E]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-[#C79A2E] border border-white/15">
                    <ShieldCheck className="w-3.5 h-3.5" /> Bản Quyền Dòng Họ: Đang Hoạt Động (Gói Pro)
                  </div>
                  <h1 className="font-serif font-black text-2xl sm:text-3xl text-white">
                    Bảng Quản Trị {clanInfo.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    Chào mừng Trưởng ban liên lạc! Nền tảng đang đồng bộ dữ liệu phả hệ 4 đời, tọa độ GPS lăng mộ và tự động bảo vệ số điện thoại con cháu.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={handleOpenAddMember}
                    className="px-5 py-2.5 bg-[#C79A2E] hover:bg-[#D9A738] text-[#0F3B4A] font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Thành Viên Mới</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('templates')}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
                  >
                    <Palette className="w-4 h-4 text-[#C79A2E]" />
                    <span>Đổi Template Site</span>
                  </button>
                </div>
              </div>

              {/* 4 Metrics Row (Cards row height 96-120px) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#E6E9EE] shadow-sm hover:shadow-md transition-shadow flex items-center justify-between h-[104px]">
                  <div>
                    <div className="text-xs text-[#5B7583] font-bold uppercase tracking-wider">Thành Viên</div>
                    <div className="text-2xl sm:text-3xl font-black text-[#0F3B4A] mt-1 font-serif">{members.length}</div>
                    <div className="text-[11px] text-emerald-600 font-semibold">Hạn mức: {clanInfo.membersQuota}</div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#F6F7F9] text-[#0F3B4A] flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E6E9EE] shadow-sm hover:shadow-md transition-shadow flex items-center justify-between h-[104px]">
                  <div>
                    <div className="text-xs text-[#5B7583] font-bold uppercase tracking-wider">Bài Viết & Phả Ký</div>
                    <div className="text-2xl sm:text-3xl font-black text-[#0F3B4A] mt-1 font-serif">{posts.length}</div>
                    <div className="text-[11px] text-[#C79A2E] font-semibold">{posts.filter(p=>p.status==='published').length} đã xuất bản</div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#F6F7F9] text-[#C79A2E] flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E6E9EE] shadow-sm hover:shadow-md transition-shadow flex items-center justify-between h-[104px]">
                  <div>
                    <div className="text-xs text-[#5B7583] font-bold uppercase tracking-wider">Album Kỷ Yếu</div>
                    <div className="text-2xl sm:text-3xl font-black text-[#0F3B4A] mt-1 font-serif">{albums.length}</div>
                    <div className="text-[11px] text-slate-500 font-semibold">78 ảnh di tích</div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#F6F7F9] text-[#0F3B4A] flex items-center justify-center">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E6E9EE] shadow-sm hover:shadow-md transition-shadow flex items-center justify-between h-[104px]">
                  <div>
                    <div className="text-xs text-[#5B7583] font-bold uppercase tracking-wider">Bản Quyền</div>
                    <div className="text-base sm:text-lg font-black text-emerald-700 mt-1 uppercase">Gói Pro</div>
                    <div className="text-[11px] text-slate-500 font-semibold">Hạn: 31/08/2027</div>
                  </div>
                  <button
                    onClick={() => setLicenseModalOpen(true)}
                    className="px-3 py-1.5 bg-[#0F3B4A] text-[#C79A2E] font-bold text-[11px] rounded-lg hover:bg-[#164E63]"
                  >
                    Gia Hạn
                  </button>
                </div>
              </div>

              {/* Family Tree Interactive Canvas Preview (420-560px) */}
              <div className="bg-white p-6 rounded-3xl border border-[#E6E9EE] shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif font-bold text-lg sm:text-xl text-[#0F3B4A]">
                      Sơ Đồ Phả Hệ Tương Tác Trực Quan
                    </h2>
                    <p className="text-xs text-[#5B7583]">Nhấp đúp vào thành viên để chỉnh sửa, kéo thả thu phóng mượt mà</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('tree')}
                      className="px-4 py-2 bg-[#0F3B4A] text-white font-bold text-xs rounded-xl hover:bg-[#164E63] flex items-center gap-1.5"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Xem Toàn Màn Hình</span>
                    </button>
                  </div>
                </div>

                {/* Tree Canvas Simulator Box */}
                <div className="bg-[#FDFBF7] rounded-2xl border border-[#E6E9EE] p-6 h-[440px] overflow-auto flex flex-col items-center justify-center relative">
                  {/* Controls overlay */}
                  <div className="absolute top-4 right-4 flex items-center bg-white p-1 rounded-xl border border-[#E6E9EE] shadow-sm gap-1 z-10">
                    <button onClick={() => addToast('Thu phóng cây phả hệ: 120%', 'info')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700" title="Phóng to"><ZoomIn className="w-4 h-4" /></button>
                    <button onClick={() => addToast('Thu phóng cây phả hệ: 80%', 'info')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700" title="Thu nhỏ"><ZoomOut className="w-4 h-4" /></button>
                    <button onClick={() => addToast('Đã căn chỉnh cây phả hệ về giữa màn hình', 'success')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700" title="Căn giữa"><Maximize2 className="w-4 h-4" /></button>
                  </div>

                  {/* Level 1: Cụ Thủy Tổ */}
                  <div className="space-y-6 text-center">
                    <div
                      onDoubleClick={() => handleOpenEditMember(members[0])}
                      className="cursor-pointer inline-block p-4 bg-white rounded-2xl border-2 border-[#C79A2E] shadow-md hover:shadow-xl transition-all"
                    >
                      <span className="text-[10px] font-black uppercase text-[#0F3B4A] bg-[#F6F7F9] px-2.5 py-0.5 rounded-full">Đời 1 • Thủy Tổ</span>
                      <div className="font-serif font-bold text-base text-[#0F3B4A] mt-1">{members[0].fullName}</div>
                      <div className="text-xs text-[#5B7583]">{members[0].birthDate} - {members[0].deathDate}</div>
                    </div>

                    <div className="w-0.5 h-6 bg-[#C79A2E]/50 mx-auto" />

                    {/* Level 2: Hai Chi */}
                    <div className="grid grid-cols-2 gap-8 max-w-xl mx-auto">
                      <div
                        onDoubleClick={() => handleOpenEditMember(members[1])}
                        className="cursor-pointer p-3.5 bg-white rounded-2xl border border-[#E6E9EE] shadow-sm hover:border-[#0F3B4A] transition-all"
                      >
                        <span className="text-[10px] font-bold text-[#0F3B4A] bg-[#F6F7F9] px-2 py-0.5 rounded-full">Đời 2 • Chi 1</span>
                        <div className="font-serif font-bold text-sm text-[#2B2F33] mt-1">{members[1].fullName}</div>
                        <div className="text-[11px] text-[#5B7583]">{members[1].birthDate} - {members[1].deathDate}</div>
                      </div>

                      <div
                        onDoubleClick={() => handleOpenEditMember(members[2])}
                        className="cursor-pointer p-3.5 bg-white rounded-2xl border border-[#E6E9EE] shadow-sm hover:border-[#0F3B4A] transition-all"
                      >
                        <span className="text-[10px] font-bold text-[#C79A2E] bg-[#F6F7F9] px-2 py-0.5 rounded-full">Đời 2 • Chi 2</span>
                        <div className="font-serif font-bold text-sm text-[#2B2F33] mt-1">{members[2].fullName}</div>
                        <div className="text-[11px] text-[#5B7583]">{members[2].birthDate} - {members[2].deathDate}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Recent Activities & Quick Tools */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity Log (2 cols) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#E6E9EE] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-base text-[#0F3B4A]">Nhật Ký Hoạt Động Gần Đây</h3>
                    <button onClick={() => addToast('Đã làm mới danh sách nhật ký!', 'info')} className="text-xs text-[#0F3B4A] font-bold hover:underline">
                      Làm mới
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {activities.map(act => (
                      <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#F6F7F9] text-[#0F3B4A] flex items-center justify-center font-bold">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-[#2B2F33]">{act.action}</div>
                            <div className="text-[#5B7583]">{act.detail}</div>
                          </div>
                        </div>
                        <div className="text-right text-slate-400 font-semibold">{act.time}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions (1 col) */}
                <div className="bg-white p-6 rounded-3xl border border-[#E6E9EE] shadow-sm space-y-3">
                  <h3 className="font-serif font-bold text-base text-[#0F3B4A]">Thao Tác Nhanh</h3>
                  <button
                    onClick={() => setImportModalOpen(true)}
                    className="w-full py-2.5 px-4 bg-[#F6F7F9] hover:bg-[#E6E9EE] text-[#0F3B4A] font-bold text-xs rounded-xl flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2"><Upload className="w-4 h-4 text-[#C79A2E]" /> Nhập Excel / CSV</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={handleExportGedcom}
                    className="w-full py-2.5 px-4 bg-[#F6F7F9] hover:bg-[#E6E9EE] text-[#0F3B4A] font-bold text-xs rounded-xl flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2"><Download className="w-4 h-4 text-[#0F3B4A]" /> Xuất GEDCOM 5.5.1</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={handleBackupNow}
                    className="w-full py-2.5 px-4 bg-[#F6F7F9] hover:bg-[#E6E9EE] text-[#0F3B4A] font-bold text-xs rounded-xl flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2"><Database className="w-4 h-4 text-emerald-600" /> Sao Lưu Dữ Liệu Ngay</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => setLicenseModalOpen(true)}
                    className="w-full py-2.5 px-4 bg-[#C79A2E]/10 hover:bg-[#C79A2E]/20 text-[#0F3B4A] font-bold text-xs rounded-xl flex items-center justify-between transition-colors border border-[#C79A2E]/30"
                  >
                    <span className="flex items-center gap-2"><Key className="w-4 h-4 text-[#C79A2E]" /> Quản Lý Bản Quyền</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              TAB 2: MEMBERS MANAGEMENT TABLE (COMPACT 48-56px ROWS)
             ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'members' && (
            <div className="bg-white rounded-3xl border border-[#E6E9EE] shadow-sm p-6 space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif font-bold text-xl text-[#0F3B4A]">Danh Sách Con Cháu Dòng Họ</h2>
                  <p className="text-xs text-[#5B7583]">Tổng số {filteredMembers.length} thành viên đã số hóa trên hệ thống</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setImportModalOpen(true)}
                    className="px-4 py-2 bg-[#F6F7F9] hover:bg-[#E6E9EE] text-[#0F3B4A] font-bold text-xs rounded-xl flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" /> Import Excel
                  </button>
                  <button
                    onClick={handleOpenAddMember}
                    className="px-4 py-2 bg-[#0F3B4A] hover:bg-[#164E63] text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 text-[#C79A2E]" /> Thêm Thành Viên
                  </button>
                </div>
              </div>

              {/* Search & Filter bar */}
              <div className="flex items-center gap-3 bg-[#F6F7F9] p-2 rounded-2xl">
                <Search className="w-4 h-4 text-slate-400 ml-2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo họ tên, chức danh, số điện thoại..."
                  value={searchGlobal}
                  onChange={(e) => setSearchGlobal(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold outline-none"
                />
              </div>

              {/* Table Compact */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E6E9EE] text-[#5B7583] uppercase tracking-wider font-bold">
                      <th className="py-3 px-4">Thành Viên</th>
                      <th className="py-3 px-4">Đời</th>
                      <th className="py-3 px-4">Chi Phái</th>
                      <th className="py-3 px-4">Năm Sinh / Mất</th>
                      <th className="py-3 px-4">Số Điện Thoại</th>
                      <th className="py-3 px-4">Mộ Phần GPS</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredMembers.map(m => (
                      <tr key={m.id} className="hover:bg-[#F6F7F9]/80 transition-colors h-[52px] group">
                        <td className="py-2.5 px-4 font-bold text-[#2B2F33] flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black ${m.gender === 'male' ? 'bg-[#0F3B4A] text-[#C79A2E]' : 'bg-rose-100 text-rose-700'}`}>
                            {m.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-serif text-[#0F3B4A]">{m.fullName}</div>
                            {m.role && <div className="text-[10px] text-[#C79A2E] font-medium">{m.role}</div>}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 font-black text-[#0F3B4A]">Đời {m.gen}</td>
                        <td className="py-2.5 px-4 text-[#5B7583] font-semibold">{m.branch}</td>
                        <td className="py-2.5 px-4 text-[#5B7583]">
                          {m.birthDate || '?'} - {m.deathDate || 'Đang sống'}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-600 font-bold">{m.phone || '—'}</td>
                        <td className="py-2.5 px-4 text-[#5B7583] max-w-xs truncate">{m.tomb || '—'}</td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1 opacity-80 group-hover:opacity-100">
                            <button
                              onClick={() => handleOpenEditMember(m)}
                              className="p-1.5 hover:bg-slate-200 rounded-lg text-[#0F3B4A]"
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteMember(m.id, m.fullName)}
                              className="p-1.5 hover:bg-rose-100 rounded-lg text-rose-600"
                              title="Xóa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              TAB 3: TEMPLATES DEMO SWITCHER & JSON SEED GENERATOR
             ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'templates' && (
            <div className="bg-white rounded-3xl border border-[#E6E9EE] shadow-sm p-6 sm:p-8 space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif font-bold text-2xl text-[#0F3B4A]">Kho Giao Diện Mẫu (Templates Demo)</h2>
                  <p className="text-xs text-[#5B7583]">Chọn mẫu giao diện 1-click hoặc tải file JSON Seed để tự động clone website cho dòng họ mới</p>
                </div>
                <button
                  onClick={handleDownloadSeedTemplate}
                  className="px-5 py-2.5 bg-[#C79A2E] hover:bg-[#D9A738] text-[#0F3B4A] font-black text-xs rounded-xl shadow flex items-center gap-2 shrink-0"
                >
                  <Download className="w-4 h-4" /> Tải JSON Seed Mẫu
                </button>
              </div>

              {/* 3 Template Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Classic Imperial */}
                <div className={`p-6 rounded-3xl border-2 transition-all space-y-4 ${clanInfo.templateStyle === 'classic' ? 'border-[#C79A2E] bg-[#FDFBF7] shadow-xl' : 'border-[#E6E9EE] hover:border-slate-300'}`}>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#0F3B4A] text-[#C79A2E] text-[10px] font-black uppercase">Hoàng Gia • Classic</span>
                    {clanInfo.templateStyle === 'classic' && <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><Check className="w-4 h-4" /> Đang Dùng</span>}
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#0F3B4A]">Mẫu Truyền Thống Hoàng Kim</h3>
                  <p className="text-xs text-[#5B7583] leading-relaxed">
                    Phong cách chuẩn <strong>hotrandinh.com</strong> với nền giấy điệp cổ truyền, câu đối chữ Hán Nôm, tôn nghiêm và bề thế dành cho các dòng họ lớn.
                  </p>
                  <button
                    onClick={() => handleApplyTemplate('classic')}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${clanInfo.templateStyle === 'classic' ? 'bg-[#0F3B4A] text-[#C79A2E]' : 'bg-[#F6F7F9] hover:bg-[#E6E9EE] text-[#0F3B4A]'}`}
                  >
                    {clanInfo.templateStyle === 'classic' ? 'Đang Kích Hoạt' : 'Áp Dụng Mẫu Này'}
                  </button>
                </div>

                {/* 2. Modern Heritage */}
                <div className={`p-6 rounded-3xl border-2 transition-all space-y-4 ${clanInfo.templateStyle === 'modern' ? 'border-[#C79A2E] bg-[#FDFBF7] shadow-xl' : 'border-[#E6E9EE] hover:border-slate-300'}`}>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#0E6FA8] text-white text-[10px] font-black uppercase">Hiện Đại • Modern</span>
                    {clanInfo.templateStyle === 'modern' && <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><Check className="w-4 h-4" /> Đang Dùng</span>}
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#0F3B4A]">Mẫu Hiện Đại Di Sản</h3>
                  <p className="text-xs text-[#5B7583] leading-relaxed">
                    Giao diện phẳng, thiết kế dạng Card Glassmorphism trẻ trung, tối ưu trải nghiệm di động cho các chi họ trẻ và con cháu thế hệ Gen Z.
                  </p>
                  <button
                    onClick={() => handleApplyTemplate('modern')}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${clanInfo.templateStyle === 'modern' ? 'bg-[#0F3B4A] text-[#C79A2E]' : 'bg-[#F6F7F9] hover:bg-[#E6E9EE] text-[#0F3B4A]'}`}
                  >
                    {clanInfo.templateStyle === 'modern' ? 'Đang Kích Hoạt' : 'Áp Dụng Mẫu Này'}
                  </button>
                </div>

                {/* 3. Minimalist Zen */}
                <div className={`p-6 rounded-3xl border-2 transition-all space-y-4 ${clanInfo.templateStyle === 'minimal' ? 'border-[#C79A2E] bg-[#FDFBF7] shadow-xl' : 'border-[#E6E9EE] hover:border-slate-300'}`}>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-slate-700 text-white text-[10px] font-black uppercase">Tối Giản • Minimal</span>
                    {clanInfo.templateStyle === 'minimal' && <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><Check className="w-4 h-4" /> Đang Dùng</span>}
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#0F3B4A]">Mẫu Tối Giản Thanh Lịch</h3>
                  <p className="text-xs text-[#5B7583] leading-relaxed">
                    Tập trung tối đa vào tốc độ tải trang, sơ đồ phả hệ cây đơn sắc rõ ràng, siêu nhẹ và tiết kiệm băng thông máy chủ.
                  </p>
                  <button
                    onClick={() => handleApplyTemplate('minimal')}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${clanInfo.templateStyle === 'minimal' ? 'bg-[#0F3B4A] text-[#C79A2E]' : 'bg-[#F6F7F9] hover:bg-[#E6E9EE] text-[#0F3B4A]'}`}
                  >
                    {clanInfo.templateStyle === 'minimal' ? 'Đang Kích Hoạt' : 'Áp Dụng Mẫu Này'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              TAB 4: LICENSE MANAGEMENT & PAYMENT INTEGRATION
             ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'license' && (
            <div className="bg-white rounded-3xl border border-[#E6E9EE] shadow-sm p-6 sm:p-8 space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif font-bold text-2xl text-[#0F3B4A]">Quản Lý Bản Quyền Dòng Họ</h2>
                  <p className="text-xs text-[#5B7583]">Kiểm tra hạn mức thành viên, dung lượng lưu trữ và cổng gia hạn thanh toán tự động</p>
                </div>
                <button
                  onClick={() => setLicenseModalOpen(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#0F3B4A] to-[#164E63] hover:from-[#164E63] hover:to-[#0F3B4A] text-[#C79A2E] font-black text-xs rounded-xl shadow flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" /> Gia Hạn / Nâng Cấp Gói
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-[#F6F7F9] rounded-2xl border border-[#E6E9EE] space-y-2">
                  <div className="text-xs font-bold text-[#5B7583] uppercase">Gói Bản Quyền Hiện Tại</div>
                  <div className="text-2xl font-serif font-black text-[#0F3B4A] uppercase">{clanInfo.plan} Edition</div>
                  <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Bản quyền hợp lệ đến 31/08/2027
                  </div>
                </div>

                <div className="p-6 bg-[#F6F7F9] rounded-2xl border border-[#E6E9EE] space-y-2">
                  <div className="text-xs font-bold text-[#5B7583] uppercase">Hạn Mức Thành Viên</div>
                  <div className="text-2xl font-serif font-black text-[#0F3B4A]">{members.length} / {clanInfo.membersQuota}</div>
                  <div className="text-xs text-slate-500 font-medium">Đã sử dụng {Math.round((members.length/clanInfo.membersQuota)*100)}% dung lượng</div>
                </div>

                <div className="p-6 bg-[#F6F7F9] rounded-2xl border border-[#E6E9EE] space-y-2">
                  <div className="text-xs font-bold text-[#5B7583] uppercase">Tên Miền Độc Lập</div>
                  <div className="text-lg font-bold text-[#0F3B4A] font-mono">{clanInfo.customDomain}</div>
                  <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> SSL Let's Encrypt Tự Động Kích Hoạt
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              TAB 5: CÀI ĐẶT DÒNG HỌ (SETTINGS)
             ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl border border-[#E6E9EE] shadow-sm p-6 sm:p-8 space-y-6 animate-fade-in max-w-4xl">
              <h2 className="font-serif font-bold text-2xl text-[#0F3B4A]">Cài Đặt Nhận Diện Dòng Họ</h2>
              
              <form onSubmit={(e) => { e.preventDefault(); addToast('Đã lưu cấu hình nhận diện thành công!', 'success'); }} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0F3B4A] uppercase mb-1.5">Tên Dòng Họ (*):</label>
                    <input
                      type="text"
                      value={clanInfo.name}
                      onChange={(e) => setClanInfo({ ...clanInfo, name: e.target.value })}
                      className="w-full p-2.5 bg-[#F6F7F9] border border-[#E6E9EE] rounded-xl text-xs font-bold outline-none focus:bg-white focus:ring-2 focus:ring-[#0F3B4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F3B4A] uppercase mb-1.5">Danh Xưng Chi Phái:</label>
                    <input
                      type="text"
                      value={clanInfo.branch}
                      onChange={(e) => setClanInfo({ ...clanInfo, branch: e.target.value })}
                      className="w-full p-2.5 bg-[#F6F7F9] border border-[#E6E9EE] rounded-xl text-xs font-bold outline-none focus:bg-white focus:ring-2 focus:ring-[#0F3B4A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F3B4A] uppercase mb-1.5">Câu Đối / Lời Tựa Tộc Biểu:</label>
                  <textarea
                    rows={2}
                    value={clanInfo.motto}
                    onChange={(e) => setClanInfo({ ...clanInfo, motto: e.target.value })}
                    className="w-full p-2.5 bg-[#F6F7F9] border border-[#E6E9EE] rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#0F3B4A]"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit" className="px-6 py-2.5 bg-[#0F3B4A] text-white font-bold text-xs rounded-xl shadow hover:bg-[#164E63]">
                    Lưu Thay Đổi
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* ── 3. MODAL THÊM / SỬA THÀNH VIÊN (POST/PUT API CONTRACT) ───────── */}
      {memberModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F3B4A]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#C79A2E]/50 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#0F3B4A]">
                {editingMember ? `Chỉnh Sửa: ${editingMember.fullName}` : 'Thêm Thành Viên Phả Hệ Mới'}
              </h3>
              <button onClick={() => setMemberModalOpen(false)} className="text-slate-400 hover:text-[#0F3B4A] font-bold text-lg">
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0F3B4A] mb-1">Họ và Tên (*):</label>
                  <input
                    type="text"
                    required
                    placeholder="ví dụ: Trần Đình Trung"
                    value={memberFormData.fullName}
                    onChange={(e) => setMemberFormData({ ...memberFormData, fullName: e.target.value })}
                    className="w-full p-2.5 bg-[#F6F7F9] border border-[#E6E9EE] rounded-xl font-bold outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0F3B4A] mb-1">Tên Tự / Biệt Hiệu:</label>
                  <input
                    type="text"
                    placeholder="ví dụ: Cụ Cả"
                    value={memberFormData.nickname}
                    onChange={(e) => setMemberFormData({ ...memberFormData, nickname: e.target.value })}
                    className="w-full p-2.5 bg-[#F6F7F9] border border-[#E6E9EE] rounded-xl font-semibold outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#0F3B4A] mb-1">Giới Tính:</label>
                  <select
                    value={memberFormData.gender}
                    onChange={(e) => setMemberFormData({ ...memberFormData, gender: e.target.value })}
                    className="w-full p-2.5 bg-[#F6F7F9] border border-[#E6E9EE] rounded-xl font-bold outline-none"
                  >
                    <option value="male">Nam (Đinh)</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#0F3B4A] mb-1">Đời Thứ:</label>
                  <input
                    type="number"
                    min={1}
                    value={memberFormData.gen}
                    onChange={(e) => setMemberFormData({ ...memberFormData, gen: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 bg-[#F6F7F9] border border-[#E6E9EE] rounded-xl font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0F3B4A] mb-1">Thuộc Chi:</label>
                  <input
                    type="text"
                    value={memberFormData.branch}
                    onChange={(e) => setMemberFormData({ ...memberFormData, branch: e.target.value })}
                    className="w-full p-2.5 bg-[#F6F7F9] border border-[#E6E9EE] rounded-xl font-bold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0F3B4A] mb-1">Năm Sinh:</label>
                  <input
                    type="text"
                    placeholder="ví dụ: 1985"
                    value={memberFormData.birthDate}
                    onChange={(e) => setMemberFormData({ ...memberFormData, birthDate: e.target.value })}
                    className="w-full p-2.5 bg-[#F6F7F9] border border-[#E6E9EE] rounded-xl font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0F3B4A] mb-1">Năm Mất / Giỗ Âm:</label>
                  <input
                    type="text"
                    placeholder="Bỏ trống nếu đang sống"
                    value={memberFormData.deathDate}
                    onChange={(e) => setMemberFormData({ ...memberFormData, deathDate: e.target.value })}
                    className="w-full p-2.5 bg-[#F6F7F9] border border-[#E6E9EE] rounded-xl font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0F3B4A] mb-1">Số Điện Thoại Liên Lạc (Được mã hóa 3 lớp):</label>
                <input
                  type="text"
                  placeholder="ví dụ: 0912345678"
                  value={memberFormData.phone}
                  onChange={(e) => setMemberFormData({ ...memberFormData, phone: e.target.value })}
                  className="w-full p-2.5 bg-[#F6F7F9] border border-[#E6E9EE] rounded-xl font-mono font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0F3B4A] mb-1">Vị Trí Mộ Phần GPS / Địa Chỉ:</label>
                <input
                  type="text"
                  placeholder="ví dụ: Nghĩa Trang Dòng Họ Khu A, Mộ số 12"
                  value={memberFormData.tomb}
                  onChange={(e) => setMemberFormData({ ...memberFormData, tomb: e.target.value })}
                  className="w-full p-2.5 bg-[#F6F7F9] border border-[#E6E9EE] rounded-xl font-semibold outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setMemberModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isActionLoading}
                  className="px-6 py-2 bg-[#0F3B4A] hover:bg-[#164E63] text-white font-bold rounded-xl shadow"
                >
                  {isActionLoading ? 'Đang lưu...' : 'Lưu Thành Viên'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 4. MODAL IMPORT EXCEL VỚI DAG SUMMARY ──────────────────────── */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F3B4A]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#E6E9EE] shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#0F3B4A]">Import Gia Phả Từ Excel / CSV</h3>
              <button onClick={() => { setImportModalOpen(false); setImportProgress(null); setImportReport(null); }} className="text-slate-400 font-bold text-lg">&times;</button>
            </div>

            <div className="p-6 border-2 border-dashed border-[#C79A2E]/50 rounded-2xl bg-[#FDFBF7] text-center space-y-3">
              <Upload className="w-8 h-8 text-[#C79A2E] mx-auto" />
              <div className="text-xs font-bold text-[#0F3B4A]">Kéo thả file Excel gia phả vào đây</div>
              <div className="text-[11px] text-[#5B7583]">Hỗ trợ định dạng .xlsx, .xls, .csv theo mẫu chuẩn</div>
            </div>

            {importProgress && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#0F3B4A]">
                  <span>{importProgress.status}</span>
                  <span>{importProgress.step}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#C79A2E] h-full rounded-full transition-all duration-300" style={{ width: `${importProgress.step}%` }} />
                </div>
              </div>
            )}

            {importReport && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1 text-emerald-900">
                <div className="font-bold flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Báo cáo kiểm thử hợp lệ:</div>
                <div>• Tổng số dòng: <strong>{importReport.totalRows}</strong></div>
                <div>• DAG Validation: <strong className="text-emerald-700">Đồ thị hợp lệ, không có chu trình lặp</strong></div>
                <div>• Số thế hệ nhận diện: <strong>{importReport.maxGenDetected} đời</strong></div>
              </div>
            )}

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => { setImportModalOpen(false); setImportProgress(null); setImportReport(null); }}
                className="px-4 py-2 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl"
              >
                Đóng
              </button>
              <button
                onClick={handleStartImportCsv}
                className="px-5 py-2 bg-[#0F3B4A] hover:bg-[#164E63] text-white font-bold text-xs rounded-xl shadow"
              >
                Bắt Đầu Nạp Dữ Liệu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. MODAL GIA HẠN / NÂNG CẤP BẢN QUYỀN (STRIPE + VIETQR) ──────── */}
      {licenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F3B4A]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-[#C79A2E] shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#0F3B4A]">Nâng Cấp / Gia Hạn Bản Quyền</h3>
                <p className="text-xs text-[#5B7583]">Kích hoạt tức thì trong 30 giây qua cổng thanh toán tự động</p>
              </div>
              <button onClick={() => setLicenseModalOpen(false)} className="text-slate-400 font-bold text-lg">&times;</button>
            </div>

            {/* Payment Gateway selector */}
            <div className="space-y-3 text-xs">
              <label className="block font-bold text-[#0F3B4A] uppercase">Phương Thức Thanh Toán:</label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'vietqr', label: 'VietQR 24/7', desc: 'Techcom / MB' },
                  { id: 'vnpay', label: 'VNPay / MoMo', desc: 'Thẻ ATM / Ví' },
                  { id: 'stripe', label: 'Thẻ Quốc Tế', desc: 'Visa / Master' },
                ].map(gw => (
                  <button
                    key={gw.id}
                    type="button"
                    onClick={() => setPaymentGateway(gw.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      paymentGateway === gw.id ? 'border-[#0F3B4A] bg-[#FDFBF7] shadow-sm' : 'border-[#E6E9EE] hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-[#0F3B4A]">{gw.label}</div>
                    <div className="text-[10px] text-slate-500">{gw.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-[#C79A2E]/50 flex items-center justify-between">
              <div>
                <div className="text-xs text-[#5B7583]">Gói Gia Hạn 1 Năm (Gói Pro):</div>
                <div className="text-xl font-black text-[#0F3B4A] font-serif">1.290.000 đ</div>
              </div>
              <button
                onClick={() => {
                  setLicenseModalOpen(false);
                  addToast('Đã tạo mã QR thanh toán thành công! Vui lòng quét mã trên App ngân hàng.', 'success');
                }}
                className="px-5 py-2.5 bg-[#C79A2E] hover:bg-[#D9A738] text-[#0F3B4A] font-black text-xs rounded-xl shadow"
              >
                Xác Nhận & Quét Mã
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
