import React from 'react';
import { BookOpen, CheckCircle, ShieldCheck, Users, MapPin, DollarSign, ArrowRight, HelpCircle, Phone, Mail, Sparkles, FileSpreadsheet, KeyRound, HeartHandshake, ExternalLink } from 'lucide-react';
import OceanScene from '../components/OceanScene';

export default function ClanSetupGuidePage() {
  const steps = [
    {
      num: 1,
      title: 'Đăng Nhập & Thiết Lập Thông Tin Dòng Họ',
      icon: KeyRound,
      desc: 'Truy cập vào trang quản trị qua nút "Đăng Nhập Quản Trị" ở góc dưới website. Đổi mật khẩu ban đầu và thiết lập ngày tế họ âm lịch để kích hoạt Cổng xác thực con cháu 3 lớp.',
      tips: 'Ngày tế họ âm lịch chính là mật mã bí mật để con cháu trong họ xác thực mở khóa số điện thoại và báo cáo thu chi.'
    },
    {
      num: 2,
      title: 'Khởi Tạo Danh Sách Các Chi Phái',
      icon: Users,
      desc: 'Vào tab "Quản lý Chi", thêm các Chi phái trong dòng tộc bằng cách chọn cụ khởi Chi trên cây phả hệ. Tạo tài khoản phân quyền riêng cho Trưởng Chi và Đích Tôn.',
      tips: 'Mỗi Chi có thể quản lý quỹ thu chi và hoạt động độc lập mà không ảnh hưởng tới các Chi khác.'
    },
    {
      num: 3,
      title: 'Xây Dựng Cây Gia Phả (Nhập Form hoặc Excel)',
      icon: FileSpreadsheet,
      desc: 'Bạn có thể thêm từng thành viên trực tiếp trên sơ đồ cây trực quan, hoặc tải file Excel mẫu chuẩn, điền danh sách hàng trăm người và bấm "Import Excel" chỉ trong 1 giây.',
      tips: 'Hệ thống tự động kiểm tra quan hệ phụ tử, ngăn chặn lỗi vòng lặp logic và tự động tính toán đời thứ.'
    },
    {
      num: 4,
      title: 'Định Vị Khu Lăng Mộ Tổ Tiên Trên Bản Đồ GPS',
      icon: MapPin,
      desc: 'Gắn tọa độ vị trí phần mộ của từng cụ lên bản đồ vệ tinh GPS kèm hình ảnh thực tế, giúp con cháu ở xa có thể tìm đường về viếng thăm chính xác qua Google Maps.',
      tips: 'Hỗ trợ tính năng chỉ đường trực tiếp trên điện thoại thông minh.'
    },
    {
      num: 5,
      title: 'Quản Lý Tài Sản, Quỹ Họ & Phân Công Bãi Biện',
      icon: DollarSign,
      desc: 'Khai báo tài sản chung của dòng họ (đất đai từ đường, đồ thờ cúng, lư hương, kiệu rước). Phân công tài khoản Bãi biện ghi chép sổ thu chi theo từng niên khóa tế họ.',
      tips: 'Mọi phiếu thu chi đều cho phép chụp ảnh hóa đơn chứng từ đính kèm để công khai minh bạch.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBF7EF] text-[#163247] pb-16 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#0A5480] to-[#0E6FA8] text-white py-14 px-4 text-center border-b border-[#F2C46A]/30">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 text-[#F7D890] border border-[#F2C46A]/40 rounded-full text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Tài Liệu Hướng Dẫn Vận Hành</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F7D890] font-serif">
            5 Bước Tự Thiết Lập Website Dòng Họ
          </h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Cẩm nang chi tiết dành cho Trưởng ban liên lạc và Quản trị viên sau khi website dòng họ được khởi tạo trên nền tảng <strong className="text-[#F7D890]">giatoc.online</strong>.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        {/* Steps Container */}
        <div className="space-y-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="bg-white rounded-2xl p-6 shadow-xs border border-[#E1E8EC] hover:border-[#0E6FA8]/50 hover:shadow-md transition-all">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0E6FA8] to-[#0A5480] text-[#F7D890] flex items-center justify-center font-black text-lg shadow-sm flex-shrink-0 border border-[#F2C46A]/40 font-serif">
                    {step.num}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5 text-[#0E6FA8]" />
                      <h3 className="text-lg font-bold text-[#0A5480] font-serif">{step.title}</h3>
                    </div>
                    <p className="text-[#5B7583] text-sm leading-relaxed">{step.desc}</p>
                    <div className="p-3 bg-[#F5E9D6]/60 rounded-xl border border-[#F2C46A]/50 text-xs text-[#0A5480] flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-[#B45309] flex-shrink-0" />
                      <span><strong>Mẹo thực hiện:</strong> {step.tips}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Khối Hỗ trợ Chuyên gia */}
        <div className="mt-12 bg-gradient-to-r from-[#0A5480] via-[#0E6FA8] to-[#0A5480] rounded-2xl p-8 text-white shadow-lg border border-[#F2C46A]/40 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#F7D890] uppercase">
              <HeartHandshake className="w-4 h-4" />
              <span>Dịch Vụ Hỗ Trợ Chuyên Sâu</span>
            </div>
            <h2 className="text-xl font-bold font-serif text-[#F7D890]">Bạn Cần Chuyên Gia Hỗ Trợ Số Hóa Gia Phả?</h2>
            <p className="text-xs text-slate-200 max-w-lg leading-relaxed">
              Đội ngũ chuyên gia của chúng tôi cung cấp dịch vụ dịch phả ký chữ Hán Nôm cổ, phục chế ảnh thờ tiền nhân và hỗ trợ nhập liệu trọn gói theo yêu cầu của dòng họ.
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
      </div>
    </div>
  );
}
