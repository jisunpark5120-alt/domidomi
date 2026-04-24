import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Music } from 'lucide-react';
import { saveSong } from '../utils/storage';

const COLORS = ['#C87941', '#6B3F1F', '#3D1F0A', '#8c5936', '#a16d47', '#b9511f'];
const DIFFICULTIES = ['초급', '중급', '고급'];

export default function AddSongPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [color, setColor] = useState(COLORS[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await saveSong({
      title,
      startDate,
      color,
      isFavorite: false
    });
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-full bg-ivory-bright">
      <header className="p-4 flex items-center border-b border-walnut-mid/10">
        <button type="button" onClick={() => navigate(-1)} className="p-2 -ml-2 text-walnut-dark">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-title font-bold ml-2">새 곡 추가</h2>
      </header>

      <form onSubmit={handleSubmit} className="p-6 flex-1 flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-walnut-mid mb-2">곡 제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white border border-walnut-mid/20 rounded-xl px-4 py-3 text-walnut-dark focus:outline-none focus:border-amber-glow focus:ring-1 focus:ring-amber-glow transition-all"
            placeholder="예: 월광 소나타 1악장"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-walnut-mid mb-2">연습 시작일</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-white border border-walnut-mid/20 rounded-xl px-4 py-3 text-walnut-dark focus:outline-none focus:border-amber-glow focus:ring-1 focus:ring-amber-glow transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-walnut-mid mb-2">커버 컬러</label>
          <div className="flex gap-3 flex-wrap">
            {COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                style={{ backgroundColor: c }}
              >
                {color === c && <Check size={16} color="white" />}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6">
          <button
            type="submit"
            className="w-full bg-amber-glow text-white font-bold py-4 rounded-xl shadow-soft hover:bg-amber-glow/90 transition-all flex justify-center items-center gap-2"
          >
            <Music size={20} />
            등록하기
          </button>
        </div>
      </form>
    </div>
  );
}
