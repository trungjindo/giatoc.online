import React, { useState, useContext, useEffect, useRef } from 'react';
import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import { AppContext } from './store';
import OceanScene from './components/OceanScene';
import ContactAdminBox from './components/ContactAdminBox';
import PromoBannerRail from './components/PromoBannerRail';
import KinshipAssistantModal from './components/KinshipAssistantModal';
import { Bot, AlertCircle } from 'lucide-react';

const LOGO_SRC = '/media/brand/logo-icon.png';
const LogoMark = ({ size = 44, className = '' }) => (
  <img src={LOGO_SRC} alt="Biểu tượng dòng họ" width={size} height={size} className={className} style={{ display: 'block', borderRadius: '50%' }} />
);

import Home from './pages/Home';
import About from './pages/About';
import FamilyTreePage from './pages/FamilyTreePage';
import DescendantList from './pages/DescendantList';
import Finance from './pages/Finance';
import NewsGallery from './pages/NewsGallery';
import Gallery from './pages/Gallery';
import ChiPublic from './pages/ChiPublic';
import TombMapPage from './pages/TombMapPage';
import AssetsPublicPage from './pages/AssetsPublicPage';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import FamilyVerifyGate from './components/FamilyVerifyGate';

// Các trang nền tảng SaaS giatoc.online
import PortalLandingPage from './pages/PortalLandingPage';
import PlatformSuperAdminPage from './pages/PlatformSuperAdminPage';
import ClanSetupGuidePage from './pages/ClanSetupGuidePage';

function FamilyOnly({ pageName, children }) {
  const { isFamilyVerified } = useContext(AppContext);
  if (!isFamilyVerified) return <FamilyVerifyGate pageName={pageName} />;
  return children;
}

const NAV_ITEMS = [
  { to: '/', label: 'Trang Chủ', end: true },
  { to: '/gioi-thieu', label: 'Giới Thiệu' },
  { to: '/gia-pha', label: 'Gia Phả' },
  { to: '/danh-sach', label: 'Danh Sách Con Cháu' },
  { to: '/ban-do-lang-mo', label: 'Bản Đồ Lăng Mộ' },
  { to: '/tai-san', label: 'Tài Sản Dòng Họ' },
  { to: '/thu-chi', label: 'Quản Lý Thu Chi' },
  { to: '/cac-chi', label: 'Các Chi' },
  { to: '/tin-tuc', label: 'Tin Tức & Hoạt Động' },
  { to: '/thu-vien', label: 'Thư Viện Ảnh' },
];

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [kinshipModalOpen, setKinshipModalOpen] = useState(false);
  const { isLoading, loadError, isFamilyVerified, tenant } = useContext(AppContext);
  const menuButtonRef = useRef(null);
  const footerRef = useRef(null);
  const location = useLocation();

  // Nhận diện xem đang truy cập Cổng SaaS giatoc.online hay Website dòng họ cụ thể
  const host = window.location.hostname.toLowerCase();
  const searchParams = new URLSearchParams(location.search);
  const isPortalDomain = host === 'giatoc.online' || host === 'www.giatoc.online' || host === 'localhost' || host === '127.0.0.1';
  const hasTenantExplicit = !!searchParams.get('tenant') || (host.includes('.giatoc.online') && !isPortalDomain) || host === 'hotrandinh.com' || host === 'www.hotrandinh.com';

  const isPortalMode = location.pathname === '/portal' || (isPortalDomain && !hasTenantExplicit && location.pathname === '/');
  const isTreePopup = location.pathname === '/gia-pha' && isFamilyVerified;

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  // Nếu đang ở cổng SaaS giatoc.online -> hiển thị Portal Landing Page
  if (isPortalMode) {
    return <PortalLandingPage />;
  }

  // Các trang độc lập của nền tảng SaaS
  if (location.pathname === '/super-admin') {
    return <PlatformSuperAdminPage />;
  }
  if (location.pathname === '/huong-dan-thiet-lap') {
    return <ClanSetupGuidePage />;
  }

  if (loadError) {
    return (
      <div className="app-status-screen">
        <LogoMark size={56} />
        <div className="app-status-error">
          <h2>Không thể kết nối máy chủ</h2>
          <p style={{ marginTop: '8px' }}>{loadError}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="app-status-screen">
        <LogoMark size={56} className="app-status-logo" />
        <p>Đang tải dữ liệu dòng họ...</p>
      </div>
    );
  }

  const closeMenu = () => setIsMenuOpen(false);
  const clanDisplayName = tenant?.name || 'Dòng Họ Trần Đình';

  return (
    <div className="app-container">
      {!isTreePopup && <PromoBannerRail footerRef={footerRef} />}

      {/* Cảnh báo nếu website hết hạn gói cước */}
      {tenant?.status === 'expired' && (
        <div style={{ background: '#b91c1c', color: '#fff', padding: '10px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 'bold' }}>
          ⚠️ Website dòng họ đang trong kỳ gia hạn thường niên. Ban liên lạc vui lòng liên hệ quản trị nền tảng giatoc.online để gia hạn duy trì dịch vụ.
        </div>
      )}

      {/* Navbar */}
      {!isTreePopup && (
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="brand" onClick={closeMenu}>
              <LogoMark size={44} />
              <span className="brand-text-group">
                <span className="brand-text">{clanDisplayName}</span>
                <span className="brand-tagline">Gia Phả Dòng Họ</span>
              </span>
            </Link>

            <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`} id="primary-navigation">
              {NAV_ITEMS.map(item => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={closeMenu}
                    className={({ isActive }) => (isActive ? 'active' : undefined)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <button
              ref={menuButtonRef}
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(o => !o)}
              aria-expanded={isMenuOpen}
              aria-controls="primary-navigation"
              aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                {isMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={isTreePopup ? undefined : 'main-content'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gioi-thieu" element={<About />} />
          <Route path="/gia-pha" element={<FamilyOnly pageName="Sơ đồ gia phả"><FamilyTreePage /></FamilyOnly>} />
          <Route path="/danh-sach" element={<FamilyOnly pageName="Danh sách con cháu"><DescendantList /></FamilyOnly>} />
          <Route path="/ban-do-lang-mo" element={<FamilyOnly pageName="Bản đồ lăng mộ"><TombMapPage /></FamilyOnly>} />
          <Route path="/tai-san" element={<FamilyOnly pageName="Tài sản dòng họ"><AssetsPublicPage /></FamilyOnly>} />
          <Route path="/thu-chi" element={<FamilyOnly pageName="Quản lý thu chi"><Finance /></FamilyOnly>} />
          <Route path="/cac-chi" element={<FamilyOnly pageName="Các chi trong dòng họ"><ChiPublic /></FamilyOnly>} />
          <Route path="/tin-tuc" element={<NewsGallery />} />
          <Route path="/thu-vien" element={<Gallery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/portal" element={<PortalLandingPage />} />
          <Route path="/super-admin" element={<PlatformSuperAdminPage />} />
          <Route path="/huong-dan-thiet-lap" element={<ClanSetupGuidePage />} />
        </Routes>
      </main>

      {/* Nút bấm nổi: Trợ Lý AI Xưng Hô Dòng Tộc */}
      {!isTreePopup && (
        <button
          onClick={() => setKinshipModalOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 18px',
            background: 'linear-gradient(135deg, #1e293b, #78350f)',
            color: '#fef08a',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '9999px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            transition: 'all 0.2s ease'
          }}
          title="Mở Trợ lý AI Tra Cứu Xưng Hô & Lễ Nghi"
        >
          <Bot size={18} color="#fbbf24" />
          <span>Trợ Lý Xưng Hô AI</span>
        </button>
      )}

      {/* Footer */}
      {!isTreePopup && (
        <footer className="footer" ref={footerRef}>
          <OceanScene variant="pattern" className="footer-pattern" />
          <div className="footer-inner">
            <div className="footer-brand">
              <LogoMark size={40} className="footer-logo" />
              <div>
                <p className="footer-brand-name">{clanDisplayName}</p>
                <p className="footer-tagline">"Mộc bản thủy nguyên" — Cây có cội, nước có nguồn</p>
              </div>
            </div>

            <nav className="footer-links" aria-label="Liên kết nhanh">
              {NAV_ITEMS.map(item => (
                <Link key={item.to} to={item.to}>{item.label}</Link>
              ))}
            </nav>

            <ContactAdminBox />
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} {clanDisplayName}. Lưu giữ cội nguồn.</p>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button
                onClick={() => setKinshipModalOpen(true)}
                style={{ background: 'transparent', border: 'none', color: '#fbbf24', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
              >
                🤖 Trợ Lý Xưng Hô AI
              </button>
              <Link to="/portal" className="footer-login-link">Cổng giatoc.online</Link>
              <Link to="/login" className="footer-login-link">Đăng Nhập Quản Trị</Link>
            </div>
          </div>
        </footer>
      )}

      {/* Modal Trợ Lý AI Xưng Hô */}
      <KinshipAssistantModal
        isOpen={kinshipModalOpen}
        onClose={() => setKinshipModalOpen(false)}
      />
    </div>
  );
}

export default App;
