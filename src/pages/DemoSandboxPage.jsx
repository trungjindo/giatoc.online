import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TreePine, DollarSign, MapPin, Flame, Users, Shield, ShieldCheck, ShieldAlert,
  UserCheck, UserCog, Eye, Lock, Unlock, Plus, RefreshCw, Sparkles, ExternalLink,
  Phone, ArrowRight, CheckCircle, Navigation, FileText, Image, AlertCircle, X
} from 'lucide-react';
import RegistrationModal from '../components/RegistrationModal';

/**
 * Hàm chuẩn hóa và tự động che số điện thoại bảo vệ riêng tư (PII Gatekeeper)
 * Định dạng chuẩn theo yêu cầu: 09•••••123 (giữ 2 số đầu và 3 số cuối)
 */
export function maskPhoneNumber(phone, role = 'guest') {
  if (!phone) return '';
  if (role !== 'guest') {
    return phone; // Con cháu và Quản trị viên được xem số đầy đủ
  }
  const clean = phone.replace(/\D/g, '');
  if (clean.length < 6) return phone;
  const first2 = clean.slice(0, 2);
  const last3 = clean.slice(-3);
  return `${first2}•••••${last3}`;
}

// Dữ liệu ban đầu của Dòng Họ Mẫu Demo (Sandbox State)
const INITIAL_SANDBOX_MEMBERS = [
  {
    id: 'm1', name: 'Cụ Thủy Tổ: Nguyễn Duy Hoan', gen: 1, gender: 'male',
    years: '1830 - 1902', role: '👑 Cụ Thủy Tổ Khai Sáng', branch: 'Toàn Tộc',
    lunarDeath: '15/08 Âm Lịch', tomb: 'Khu Lăng Mộ Núi Rồng (GPS: 20.4382, 105.9123)',
    phone: '0912345678', address: 'Xã Tiên Điền, Huyện Nghi Xuân, Hà Tĩnh',
    bio: 'Khởi thủy lập ấp, đỗ Tú tài triều Nguyễn, khai sáng nền móng từ đường đại tộc.'
  },
  {
    id: 'm2', name: 'Nguyễn Duy Trác', gen: 2, gender: 'male', parentId: 'm1',
    years: '1862 - 1935', role: 'Trưởng Chi Nhất', branch: 'Chi 1 (Chi Trưởng)',
    lunarDeath: '03/03 Âm Lịch', tomb: 'Nghĩa Trang Khu A (Mộ số 12)',
    phone: '0983555123', address: 'Số 42 Phố Hàng Thiếc, Hoàn Kiếm, Hà Nội',
    bio: 'Tiếp quản từ đường chi trưởng, gìn giữ 3 tập gia phả chữ Hán Nôm.'
  },
  {
    id: 'm3', name: 'Nguyễn Duy Thành', gen: 2, gender: 'male', parentId: 'm1',
    years: '1868 - 1941', role: 'Trưởng Chi Nhị', branch: 'Chi 2 (Chi Thứ)',
    lunarDeath: '19/11 Âm Lịch', tomb: 'Khu Lăng Mộ Cánh Đồng Mới',
    phone: '0904333789', address: 'Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    bio: 'Phát triển nghề truyền thống, lập quỹ khuyến học đầu tiên của dòng tộc.'
  },
  {
    id: 'm4', name: 'Nguyễn Duy Huỳnh', gen: 3, gender: 'male', parentId: 'm2',
    years: '1895 - 1970', role: 'Cụ Đời 3 (Chi 1)', branch: 'Chi 1',
    lunarDeath: '10/06 Âm Lịch', tomb: 'Nghĩa trang liệt sĩ địa phương',
    phone: '0918111222', address: 'TP. Vinh, Tỉnh Nghệ An',
    bio: 'Tham gia kháng chiến cứu quốc, để lại nhiều thư tịch quý báu.'
  },
  {
    id: 'm5', name: 'Nguyễn Duy Tuấn', gen: 4, gender: 'male', parentId: 'm4',
    years: 'Sinh năm 1960', role: 'Trưởng Ban Liên Lạc', branch: 'Chi 1',
    lunarDeath: 'Đang sinh sống', tomb: 'Hà Nội',
    phone: '0912888678', address: 'Quận Cầu Giấy, Hà Nội',
    bio: 'Chủ trì đại tu Từ đường năm 2024, phụ trách số hóa gia phả lên giatoc.online.'
  }
];

const INITIAL_FINANCE = [
  { id: 1, date: '2026-03-01', type: 'income', category: 'Quỹ Công Đức Giỗ Tổ', actor: 'Nguyễn Duy Tuấn (Chi 1)', amount: 5000000, note: 'Công đức tu sửa cổng từ đường' },
  { id: 2, date: '2026-03-05', type: 'income', category: 'Đóng Quỹ Họ Hàng Năm', actor: 'Nguyễn Duy Bình (Chi 2)', amount: 1500000, note: 'Nộp quỹ 3 suất đinh năm 2026' },
  { id: 3, date: '2026-03-10', type: 'expense', category: 'Mua Lễ Vật & Hương Hoa', actor: 'Ban Bãi Biện', amount: 2300000, note: 'Chi mua hoa quả cúng rằm tháng Giêng' },
];

export default function DemoSandboxPage() {
  // Trạng thái quyền: 'guest' (Khách) | 'member' (Con cháu) | 'admin' (Quản trị viên)
  const [activeRole, setActiveRole] = useState('guest');
  const [activeTab, setActiveTab] = useState('tree'); // 'tree' | 'finance' | 'tombs' | 'altar'

  // Dữ liệu Mutable trong Sandbox
  const [members, setMembers] = useState(INITIAL_SANDBOX_MEMBERS);
  const [finances, setFinances] = useState(INITIAL_FINANCE);
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Trạng thái thắp nhang bàn thờ số
  const [incenseLit, setIncenseLit] = useState(false);
  const [prayerText, setPrayerText] = useState('');
  const [prayers, setPrayers] = useState([
    { name: 'Nguyễn Duy Tuấn (Hà Nội)', text: 'Con kính cẩn thắp nén tâm nhang kính cẩn tạ ơn Tiên Tổ đã phù hộ độ trì cho con cháu bình an, hiếu thảo.' }
  ]);

  // Modal thêm con cháu trong chế độ Admin
  const [showAddModal, setShowAddModal] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildGender, setNewChildGender] = useState('male');
  const [newChildParentId, setNewChildParentId] = useState('m5');

  // Reset Sandbox
  const handleResetSandbox = () => {
    setMembers(INITIAL_SANDBOX_MEMBERS);
    setFinances(INITIAL_FINANCE);
    setIncenseLit(false);
    setSelectedMember(null);
  };

  // Thêm thành viên ảo (Chỉ hoạt động ở quyền Admin)
  const handleAddVirtualChild = (e) => {
    e.preventDefault();
    if (!newChildName.trim()) return;

    const parent = members.find(m => m.id === newChildParentId) || members[0];
    const newMember = {
      id: `m_sandbox_${Date.now()}`,
      name: newChildName.trim(),
      gen: (parent.gen || 1) + 1,
      gender: newChildGender,
      parentId: parent.id,
      years: 'Sinh năm 2026',
      role: `Hậu Duệ Đời ${parent.gen + 1}`,
      branch: parent.branch || 'Toàn Tộc',
      lunarDeath: 'Đang sinh sống',
      phone: '0977888999',
      address: 'Việt Nam',
      bio: 'Thành viên mới được tạo trong phiên trải nghiệm Live Sandbox.'
    };

    setMembers([...members, newMember]);
    setNewChildName('');
    setShowAddModal(false);
  };

  // Thắp nhang ảo
  const handleLightIncense = () => {
    if (activeRole === 'guest') return;
    setIncenseLit(true);
    if (prayerText.trim()) {
      setPrayers([{ name: activeRole === 'admin' ? 'Trưởng Tộc (Sandbox Admin)' : 'Con Cháu Dòng Họ', text: prayerText.trim() }, ...prayers]);
      setPrayerText('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#0F172A] font-sans">
      
      {/* ── 1. STICKY TOP CONTROL BAR (BẢNG ĐIỀU KHIỂN QUYỀN TRUY CẬP) ──── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0F172A] text-white border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          
          {/* Brand & Sandbox Label */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs font-serif">
                GT
              </div>
              <div className="hidden sm:block leading-tight">
                <span className="font-serif font-black text-sm text-white">Gia Tộc Online</span>
                <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Live Sandbox</div>
              </div>
            </Link>
            <span className="hidden md:inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs border border-slate-700">
              demo.giatoc.online
            </span>
          </div>

          {/* Role Switcher Controls (Trọng tâm trải nghiệm) */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700 shadow-inner">
            <span className="hidden lg:inline-block text-[11px] font-bold text-slate-400 px-2">
              Chọn vai trò thử nghiệm:
            </span>

            {/* Quyền 1: Khách */}
            <button
              onClick={() => setActiveRole('guest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeRole === 'guest'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Khách</span>
            </button>

            {/* Quyền 2: Con cháu */}
            <button
              onClick={() => setActiveRole('member')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeRole === 'member'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Con Cháu</span>
            </button>

            {/* Quyền 3: Quản trị */}
            <button
              onClick={() => setActiveRole('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeRole === 'admin'
                  ? 'bg-rose-700 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UserCog className="w-3.5 h-3.5" />
              <span>Quản Trị</span>
            </button>
          </div>

          {/* Nút Kêu Gọi Hành Động (CTA Mua Gói Thật) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetSandbox}
              title="Khôi phục dữ liệu ban đầu"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Reset</span>
            </button>

            <button
              onClick={() => setModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span className="hidden sm:inline">Tạo Web Cho Dòng Họ Tôi</span>
              <span className="sm:hidden">Tạo Web</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── 2. ROLE STATUS BANNER & PRIVACY EXPLAINER ─────────────────── */}
      <div className="pt-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2">
            {activeRole === 'guest' && (
              <>
                <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  <ShieldAlert className="w-3.5 h-3.5" /> Chế Độ: Khách Vãng Lai
                </span>
                <span className="text-slate-500">
                  • Số điện thoại bị che mờ tự động (<strong className="font-mono text-amber-800">09•••••123</strong>) để bảo vệ con cháu. Sổ quỹ chi tiết bị khóa.
                </span>
              </>
            )}

            {activeRole === 'member' && (
              <>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> Chế Độ: Con Cháu Đã Xác Thực
                </span>
                <span className="text-slate-500">
                  • Xem đầy đủ SĐT, danh bạ Zalo, minh bạch sổ quỹ thu chi, thắp hương bàn thờ số.
                </span>
              </>
            )}

            {activeRole === 'admin' && (
              <>
                <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  <UserCog className="w-3.5 h-3.5" /> Chế Độ: Trưởng Tộc / Quản Trị Viên
                </span>
                <span className="text-slate-500">
                  • Toàn quyền thêm con cháu, chỉnh sửa quan hệ phả hệ ảo, ghi chép thu chi (Dữ liệu thử nghiệm an toàn).
                </span>
              </>
            )}
          </div>

          {/* Sandbox Indicator */}
          <div className="text-slate-400 font-medium text-[11px] hidden sm:block">
            Môi trường Sandbox an toàn • Không ảnh hưởng dữ liệu thật
          </div>
        </div>
      </div>

      {/* ── 3. WORKSPACE TABS NAVIGATION ──────────────────────────────── */}
      <div className="bg-slate-100/80 border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex gap-2 py-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('tree')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'tree' ? 'bg-white text-[#0F172A] shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TreePine className="w-4 h-4 text-amber-600" />
              <span>Cây Phả Hệ Tương Tác ({members.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('finance')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'finance' ? 'bg-white text-[#0F172A] shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-4 h-4 text-amber-600" />
              <span>Sổ Quỹ Thu Chi</span>
              {activeRole === 'guest' && <Lock className="w-3 h-3 text-amber-700" />}
            </button>

            <button
              onClick={() => setActiveTab('tombs')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'tombs' ? 'bg-white text-[#0F172A] shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Bản Đồ Lăng Mộ GPS</span>
            </button>

            <button
              onClick={() => setActiveTab('altar')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'altar' ? 'bg-white text-[#0F172A] shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-600" />
              <span>Bàn Thờ Số</span>
            </button>
          </div>

          {/* Nút hành động nhanh của Admin */}
          {activeRole === 'admin' && activeTab === 'tree' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Thành Viên</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 4. SANDBOX CONTENT CANVAS ─────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: CÂY PHẢ HỆ TƯƠNG TÁC */}
        {activeTab === 'tree' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="text-xs font-semibold text-slate-500 mb-6">
                Nhấp vào bất kỳ thành viên nào để xem thông tin cá nhân. Quan sát sự khác biệt của số điện thoại giữa 3 quyền: <strong>Khách (09•••••123)</strong> vs <strong>Con Cháu / Quản Trị (0912 345 678)</strong>.
              </div>

              {/* Node Thủy Tổ */}
              <div className="flex justify-center">
                <div
                  onClick={() => setSelectedMember(members[0])}
                  className="cursor-pointer p-4 bg-amber-50 hover:bg-amber-100/70 rounded-2xl border-2 border-amber-600 shadow-sm max-w-sm text-center transition-all hover:scale-105"
                >
                  <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full">
                    {members[0].role}
                  </span>
                  <div className="font-serif font-black text-lg text-[#0F172A] mt-1.5">{members[0].name}</div>
                  <div className="text-xs text-slate-500">{members[0].years} • Giỗ: {members[0].lunarDeath}</div>
                  <div className="text-[11px] font-mono text-amber-800 font-bold mt-2">
                    SĐT: {maskPhoneNumber(members[0].phone, activeRole)}
                  </div>
                </div>
              </div>

              {/* Đường nối thế hệ */}
              <div className="w-0.5 h-6 bg-slate-300 mx-auto" />

              {/* Hàng Chi Đời 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {members.filter(m => m.gen === 2).map(m => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMember(m)}
                    className="cursor-pointer p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-300 hover:border-amber-500 shadow-sm text-center transition-all"
                  >
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{m.role}</span>
                    <div className="font-serif font-bold text-base text-[#0F172A] mt-1">{m.name}</div>
                    <div className="text-xs text-slate-500">{m.years}</div>
                    <div className="text-[11px] font-mono text-slate-600 font-bold mt-1.5">
                      SĐT: {maskPhoneNumber(m.phone, activeRole)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Đường nối */}
              <div className="w-0.5 h-6 bg-slate-300 mx-auto" />

              {/* Đời 3 & 4 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
                {members.filter(m => m.gen > 2).map(m => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMember(m)}
                    className="cursor-pointer p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 hover:border-amber-500 shadow-sm text-center transition-all"
                  >
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Đời {m.gen}</span>
                    <div className="font-bold text-sm text-[#0F172A] mt-0.5">{m.name}</div>
                    <div className="text-[11px] font-mono text-slate-600 font-bold mt-1">
                      SĐT: {maskPhoneNumber(m.phone, activeRole)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SỔ QUỸ THU CHI (MINH HỌA BROKEN ACCESS CONTROL & DATA MASKING) */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4 mb-6">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#0F172A]">Sổ Quỹ Thu Chi Dòng Họ Năm 2026</h3>
                  <p className="text-xs text-slate-500">Tồn dư hiện tại: <strong className="text-emerald-700">4.200.000 đ</strong></p>
                </div>

                {activeRole === 'admin' && (
                  <button
                    onClick={() => {
                      const amount = prompt('Nhập số tiền (VNĐ):', '1000000');
                      if (amount) {
                        setFinances([...finances, {
                          id: Date.now(),
                          date: new Date().toISOString().slice(0, 10),
                          type: 'income',
                          category: 'Công Đức Trực Tuyến (Sandbox)',
                          actor: 'Người Dùng Thử Nghiệm',
                          amount: Number(amount),
                          note: 'Ghi nhận khoản thu trong Sandbox'
                        }]);
                      }
                    }}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ghi Chép Thu Chi Mới
                  </button>
                )}
              </div>

              {/* Nếu là Khách -> Khóa chi tiết giao dịch */}
              {activeRole === 'guest' ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#0F172A]">Dữ Liệu Sổ Quỹ Đang Bị Khóa Với Khách Vãng Lai</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Theo quy chế dòng họ, toàn bộ lịch sử thu chi chi tiết và bảng vàng công đức chỉ mở cho <strong>Con Cháu Đã Xác Thực</strong> hoặc <strong>Ban Quản Trị</strong>.
                  </p>
                  <button
                    onClick={() => setActiveRole('member')}
                    className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold rounded-lg"
                  >
                    Chuyển Sang Quyền "Con Cháu" Để Mở Khóa
                  </button>
                </div>
              ) : (
                /* Con cháu và Quản trị -> Xem chi tiết */
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                      <tr>
                        <th className="p-3">Ngày</th>
                        <th className="p-3">Loại Giao Dịch</th>
                        <th className="p-3">Danh Mục</th>
                        <th className="p-3">Người Nộp / Chi</th>
                        <th className="p-3 text-right">Số Tiền</th>
                        <th className="p-3">Ghi Chú</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {finances.map(f => (
                        <tr key={f.id} className="hover:bg-slate-50/70">
                          <td className="p-3 font-mono">{f.date}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${f.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                              {f.type === 'income' ? '+ Thu Vào' : '- Chi Ra'}
                            </span>
                          </td>
                          <td className="p-3 font-medium">{f.category}</td>
                          <td className="p-3 font-bold">{f.actor}</td>
                          <td className={`p-3 text-right font-mono font-bold ${f.type === 'income' ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {f.amount.toLocaleString('vi-VN')} đ
                          </td>
                          <td className="p-3 text-slate-500">{f.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: BẢN ĐỒ LĂNG MỘ GPS */}
        {activeTab === 'tombs' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#0F172A]">Hệ Thống Định Vị Vệ Tinh Lăng Mộ & Từ Đường</h3>
              <p className="text-xs text-slate-600">
                Tích hợp vệ tinh GPS dẫn đường cho con cháu ở xa về viếng mộ tổ tiên chính xác từng mét.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-amber-600 font-bold text-xs flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> Mộ Tổ Núi Rồng
                  </div>
                  <div className="font-bold text-sm text-[#0F172A]">Cụ Thủy Tổ Nguyễn Duy Hoan</div>
                  <div className="text-xs text-slate-500 font-mono">20°26'17.5"N 105°54'44.3"E</div>
                  <div className="pt-2">
                    <a
                      href="https://maps.google.com/?q=20.4382,105.9123"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-[#0F172A] text-white text-xs font-bold rounded-lg inline-flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Chỉ Đường
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-amber-600 font-bold text-xs flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> Từ Đường Đại Tộc
                  </div>
                  <div className="font-bold text-sm text-[#0F172A]">Nơi Tế Tự & Lưu Giữ Gia Phả</div>
                  <div className="text-xs text-slate-500 font-mono">20°26'10.4"N 105°54'35.2"E</div>
                  <div className="pt-2">
                    <a
                      href="https://maps.google.com/?q=20.4362,105.9098"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-[#0F172A] text-white text-xs font-bold rounded-lg inline-flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Chỉ Đường
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-amber-600 font-bold text-xs flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> Khu Lăng Mộ Chi 1
                  </div>
                  <div className="font-bold text-sm text-[#0F172A]">Mộ Tiền Nhân Chi Trưởng</div>
                  <div className="text-xs text-slate-500 font-mono">20°26'22.1"N 105°54'50.8"E</div>
                  <div className="pt-2">
                    <a
                      href="https://maps.google.com/?q=20.4395,105.9141"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-[#0F172A] text-white text-xs font-bold rounded-lg inline-flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Chỉ Đường
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BÀN THỜ SỐ (DIGITAL ALTAR) */}
        {activeTab === 'altar' && (
          <div className="space-y-6">
            <div className="bg-[#0F172A] text-white p-8 rounded-2xl shadow-xl text-center space-y-6 relative overflow-hidden border border-slate-800">
              
              <div className="space-y-2">
                <span className="text-amber-400 font-serif text-xs font-bold uppercase tracking-widest">
                  Không Gian Tâm Linh Trang Nghiêm
                </span>
                <h3 className="font-serif font-black text-2xl sm:text-3xl text-amber-200">
                  Bàn Thờ Số & Tưởng Niệm Tổ Tiên
                </h3>
                <p className="text-xs text-slate-300 max-w-lg mx-auto">
                  Dành cho con cháu đang ở xa Tổ quốc, công tác phương xa thắp nén tâm nhang tri ân cội nguồn.
                </p>
              </div>

              {/* Lư hương mô phỏng */}
              <div className="py-6 flex flex-col items-center justify-center">
                <div className="relative">
                  {incenseLit && (
                    <div className="animate-pulse flex flex-col items-center mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                      <div className="w-0.5 h-8 bg-gradient-to-t from-amber-700 to-amber-300" />
                    </div>
                  )}
                  <div className="w-24 h-16 rounded-b-3xl bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 border-2 border-amber-400 flex items-center justify-center text-amber-100 font-serif font-bold text-xs shadow-lg">
                    LƯ HƯƠNG
                  </div>
                </div>

                <div className="mt-4">
                  {activeRole === 'guest' ? (
                    <div className="text-xs text-amber-300 bg-slate-800/80 px-4 py-2 rounded-lg inline-block border border-slate-700">
                      🔒 Chỉ thành viên con cháu đã xác thực mới được thắp nhang và lưu lời khấn.
                    </div>
                  ) : (
                    <button
                      onClick={handleLightIncense}
                      className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 mx-auto"
                    >
                      <Flame className="w-4 h-4 text-amber-200" />
                      <span>{incenseLit ? 'Thắp Thêm Nén Nhang Mới' : 'Thắp Nén Nhang Số Kính Bái'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Khấn nguyện & Sổ tang tưởng niệm */}
              {activeRole !== 'guest' && (
                <div className="max-w-md mx-auto pt-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Nhập lời nguyện cầu, tri ân tiền nhân..."
                    value={prayerText}
                    onChange={(e) => setPrayerText(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {/* Danh sách lời tưởng niệm đã lưu */}
              <div className="max-w-lg mx-auto pt-4 text-left space-y-2 border-t border-slate-800">
                <div className="text-[11px] font-bold text-amber-400 uppercase">Sổ Tri Ân Của Con Cháu:</div>
                {prayers.map((p, idx) => (
                  <div key={idx} className="p-3 bg-slate-800/60 rounded-lg text-xs space-y-1 border border-slate-700/50">
                    <div className="font-bold text-white text-[11px]">{p.name}:</div>
                    <div className="text-slate-300 italic">"{p.text}"</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

      </main>

      {/* ── 5. MODAL XEM CHI TIẾT THÀNH VIÊN VÀ SO SÁNH QUYỀN ────────── */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl relative animate-scale-up text-left">
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xl font-bold w-8 h-8 flex items-center justify-center"
            >
              &times;
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm border border-amber-300">
                Đ{selectedMember.gen}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded">{selectedMember.role}</span>
                <h3 className="font-serif font-bold text-lg text-[#0F172A]">{selectedMember.name}</h3>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700 border-y border-slate-200 py-3 my-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Năm sinh - năm mất:</span>
                <span className="font-bold">{selectedMember.years}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ngày giỗ (Âm lịch):</span>
                <span className="font-bold text-amber-700">{selectedMember.lunarDeath}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chi họ:</span>
                <span className="font-bold">{selectedMember.branch}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Số điện thoại liên lạc:</span>
                <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  {maskPhoneNumber(selectedMember.phone, activeRole)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Địa chỉ cư trú:</span>
                <span className="font-medium text-slate-800">
                  {activeRole === 'guest' ? 'Việt Nam (Đã che chi tiết)' : selectedMember.address}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic mb-4">"{selectedMember.bio}"</p>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMember(null)}
                className="w-full py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
              >
                Đóng Cửa Sổ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. MODAL THÊM CON CHÁU (CHỈ DÀNH CHO ADMIN) ────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddVirtualChild} className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h3 className="font-serif font-bold text-base text-[#0F172A]">Thêm Thành Viên Mới (Sandbox Virtual Node)</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Họ và tên con cháu *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Duy Khang..."
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Giới tính</label>
                  <select
                    value={newChildGender}
                    onChange={(e) => setNewChildGender(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Cha / Mẹ trực hệ</label>
                  <select
                    value={newChildParentId}
                    onChange={(e) => setNewChildParentId(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name} (Đời {m.gen})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl"
              >
                Tạo Thử Node Này Ngay
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Registration Modal cho khách muốn mua ngay sau khi trải nghiệm */}
      <RegistrationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        preselectedPlan="standard"
        preselectedSlug=""
      />

    </div>
  );
}
