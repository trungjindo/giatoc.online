import React, { useState, useContext, useEffect } from 'react';
import { Bot, Sparkles, Users, ArrowRightLeft, HelpCircle, BookOpen, Send, CheckCircle, Search, MessageSquare, AlertCircle, Compass } from 'lucide-react';
import { AppContext } from '../store';
import { API_URL } from '../api';

export default function KinshipAssistantModal({ isOpen, onClose }) {
  const { familyData } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('calculate');
  const [m1Id, setM1Id] = useState('');
  const [m2Id, setM2Id] = useState('');
  const [m1Search, setM1Search] = useState('');
  const [m2Search, setM2Search] = useState('');

  const [calcResult, setCalcResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const [question, setQuestion] = useState('');
  const [qaLoading, setQaLoading] = useState(false);
  const [qaHistory, setQaHistory] = useState([
    {
      q: 'Trong ngày giỗ họ, con cháu vào nhà thờ họ cần chào hỏi và xưng hô như thế nào?',
      a: 'Khi bước vào từ đường ngày tế họ, con cháu chào hỏi theo vai vế thứ bậc tông phái: Gặp bậc trên (hơn đời) chắp tay cúi chào "Cháu chào Bác/Chú/Ông". Gặp người cùng đời thuộc Chi trưởng chào "Em chào Anh họ/Chị họ". Lễ bái gia tiên thực hiện 4 lạy và 3 vái trước bàn thờ tổ.'
    }
  ]);

  const membersList = React.useMemo(() => {
    const list = [];
    const traverse = (node) => {
      if (!node) return;
      list.push({
        id: node.id,
        name: node.name,
        generation: node.generation || 1,
        gender: node.gender || 'Nam',
        chiName: node.chiName || ''
      });
      (node.children || []).forEach(traverse);
    };
    traverse(familyData);
    return list;
  }, [familyData]);

  useEffect(() => {
    if (membersList.length >= 2 && !m1Id && !m2Id) {
      setM1Id(membersList[membersList.length - 1]?.id || '');
      setM2Id(membersList[0]?.id || '');
    }
  }, [membersList]);

  if (!isOpen) return null;

  const handleCalculate = async () => {
    if (!m1Id || !m2Id) {
      alert('Vui lòng chọn đủ 2 người để tra cứu!');
      return;
    }

    setCalculating(true);
    setCalcResult(null);
    try {
      const res = await fetch(`${API_URL}/kinship_ai.php?action=calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member1Id: m1Id, member2Id: m2Id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lỗi tra cứu xưng hô.');
      setCalcResult(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setCalculating(false);
    }
  };

  const handleAskQa = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const currentQ = question.trim();
    setQuestion('');
    setQaLoading(true);
    try {
      const res = await fetch(`${API_URL}/kinship_ai.php?action=ask_custom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentQ })
      });
      const data = await res.json();
      if (res.ok && data.answer) {
        setQaHistory(prev => [{ q: currentQ, a: data.answer }, ...prev]);
      }
    } catch (err) {
      alert('Lỗi tra cứu: ' + err.message);
    } finally {
      setQaLoading(false);
    }
  };

  const filteredM1 = membersList.filter(m => m.name.toLowerCase().includes(m1Search.toLowerCase()));
  const filteredM2 = membersList.filter(m => m.name.toLowerCase().includes(m2Search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#163247]/70 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl my-8 bg-white rounded-2xl shadow-2xl border border-[#E1E8EC] overflow-hidden text-[#163247]">
        
        {/* Header Modal */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0A5480] via-[#0E6FA8] to-[#0A5480] text-white flex items-center justify-between border-b border-[#F2C46A]/40">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/10 rounded-xl text-[#F7D890] border border-[#F2C46A]/30 shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold font-serif text-[#F7D890]">Trợ Lý AI Xưng Hô Gia Tộc</h3>
                <span className="px-2 py-0.5 bg-[#F2C46A] text-[#0A5480] rounded-full text-[10px] font-black">AI Thông Minh</span>
              </div>
              <p className="text-xs text-slate-200">Tra cứu chuẩn xác ngôi thứ, vai vế cành trưởng/thứ & lễ nghi dòng họ</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
            &times;
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 py-2.5 bg-[#FBF7EF] border-b border-[#E1E8EC] flex items-center space-x-2 text-xs font-bold text-[#5B7583]">
          <button
            onClick={() => setActiveTab('calculate')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeTab === 'calculate' ? 'bg-[#0E6FA8] text-white shadow-xs' : 'hover:bg-slate-200 text-[#163247]'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Tra Cứu Quan Hệ 2 Người</span>
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeTab === 'qa' ? 'bg-[#0E6FA8] text-white shadow-xs' : 'hover:bg-slate-200 text-[#163247]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Cẩm Nang Phong Tục & Lễ Nghi</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === 'calculate' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-[#FBF7EF] rounded-xl border border-[#E1E8EC] space-y-2">
                  <div className="text-xs font-bold text-[#0A5480] flex items-center space-x-1">
                    <span className="w-4 h-4 rounded-full bg-[#0E6FA8] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                    <span>Người 1 (Bạn / Người gọi):</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Lọc tên..."
                    value={m1Search}
                    onChange={(e) => setM1Search(e.target.value)}
                    className="w-full px-2.5 py-1 text-xs border border-[#E1E8EC] rounded-lg bg-white"
                  />
                  <select
                    value={m1Id}
                    onChange={(e) => setM1Id(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-[#E1E8EC] rounded-lg bg-white font-medium"
                  >
                    {filteredM1.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} (Đời {m.generation} • {m.gender})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3.5 bg-[#FBF7EF] rounded-xl border border-[#E1E8EC] space-y-2">
                  <div className="text-xs font-bold text-[#B45309] flex items-center space-x-1">
                    <span className="w-4 h-4 rounded-full bg-[#B45309] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                    <span>Người 2 (Người được gọi):</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Lọc tên..."
                    value={m2Search}
                    onChange={(e) => setM2Search(e.target.value)}
                    className="w-full px-2.5 py-1 text-xs border border-[#E1E8EC] rounded-lg bg-white"
                  />
                  <select
                    value={m2Id}
                    onChange={(e) => setM2Id(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-[#E1E8EC] rounded-lg bg-white font-medium"
                  >
                    {filteredM2.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} (Đời {m.generation} • {m.gender})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleCalculate}
                  disabled={calculating}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#0E6FA8] to-[#0A5480] hover:from-[#1C8FD6] hover:to-[#0E6FA8] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 mx-auto transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#F7D890]" />
                  <span>{calculating ? 'AI đang phân tích phả hệ...' : 'Tra Cứu Ngôi Thứ Chuẩn'}</span>
                </button>
              </div>

              {calcResult && (
                <div className="p-5 bg-gradient-to-b from-[#F5E9D6]/60 to-white rounded-2xl border border-[#F2C46A] shadow-xs space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-[#F2C46A]/60 text-center shadow-xs">
                      <div className="text-[11px] text-[#5B7583] font-semibold">{calcResult.m1?.name} gọi là:</div>
                      <div className="text-base font-black text-[#0A5480] font-serif mt-0.5">{calcResult.m1CallsM2}</div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-[#F2C46A]/60 text-center shadow-xs">
                      <div className="text-[11px] text-[#5B7583] font-semibold">{calcResult.m2?.name} gọi là:</div>
                      <div className="text-base font-black text-[#B45309] font-serif mt-0.5">{calcResult.m2CallsM1}</div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FBF7EF] rounded-xl border border-[#E1E8EC] text-xs text-[#163247] space-y-1.5">
                    <div className="font-bold text-[#0A5480] flex items-center space-x-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#0E6FA8]" />
                      <span>Cơ sở phân tích phả hệ:</span>
                    </div>
                    <p>{calcResult.explanation}</p>
                    {calcResult.lcaName && (
                      <p className="text-[11px] text-[#5B7583]">Tổ tiên chung gần nhất: <strong>{calcResult.lcaName}</strong></p>
                    )}
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span><strong>Mẹo xưng hô:</strong> {calcResult.etiquetteTip}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'qa' && (
            <div className="space-y-4">
              <form onSubmit={handleAskQa} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Hỏi AI về nghi thức tế họ, bãi biện, văn khấn..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 text-xs bg-[#FBF7EF] border border-[#E1E8EC] rounded-xl focus:ring-2 focus:ring-[#0E6FA8] focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={qaLoading}
                  className="px-4 py-2.5 bg-[#0A5480] hover:bg-[#0E6FA8] text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5 text-[#F7D890]" />
                  <span>{qaLoading ? 'Đang hỏi...' : 'Hỏi'}</span>
                </button>
              </form>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {qaHistory.map((item, idx) => (
                  <div key={idx} className="p-4 bg-[#FBF7EF] rounded-2xl border border-[#E1E8EC] space-y-2 text-xs">
                    <div className="font-bold text-[#0A5480] flex items-start space-x-2">
                      <span className="w-4 h-4 rounded-full bg-[#0E6FA8] text-white text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">H</span>
                      <span>{item.q}</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-[#E1E8EC] text-[#163247] leading-relaxed font-sans">
                      {item.a}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
