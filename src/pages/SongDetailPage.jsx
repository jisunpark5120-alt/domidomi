import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mic, Star, Calendar, ChevronRight, Trash2, Edit3 } from 'lucide-react';
import { getSong, saveSong, getSessionsForSong, deleteSong } from '../utils/storage';
// We use line-chart from react-chartjs-2 for sparkline
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

export default function SongDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    const songData = await getSong(id);
    if (!songData) {
      navigate('/');
      return;
    }
    setSong(songData);
    const sessionsData = await getSessionsForSong(id);
    setSessions(sessionsData);
  };

  const toggleFavorite = async () => {
    const updated = { ...song, isFavorite: !song.isFavorite };
    await saveSong(updated);
    setSong(updated);
  };

  const handleDelete = async () => {
    if (window.confirm('정말 소중한 연습 기록을 모두 삭제하시겠습니까?\n이 작업은 되돌릴 수 없어요! 😭')) {
      await deleteSong(id);
      navigate('/');
    }
  };

  if (!song) return null;

  // Sparkline data (last 7 sessions, reversed to be chronological)
  const recentSessions = [...sessions].slice(0, 7).reverse();
  const sparklineData = {
    labels: recentSessions.map((_, i) => i),
    datasets: [{
      data: recentSessions.map(s => s.overallScore || 0),
      borderColor: '#C87941',
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#3D1F0A',
    }]
  };
  const sparklineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { display: false }, y: { display: false, min: 0, max: 100 } },
    plugins: { legend: { display: false }, tooltip: { enabled: false } }
  };

  return (
    <div className="flex flex-col h-full bg-ivory-bright">
      <header className="p-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-walnut-dark">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-1">
          <button onClick={() => navigate(`/edit/${id}`)} className="p-2 text-walnut-mid hover:text-walnut-dark transition-colors">
            <Edit3 size={22} />
          </button>
          <button onClick={handleDelete} className="p-2 text-rose-500/70 hover:text-rose-500 transition-colors">
            <Trash2 size={22} />
          </button>
          <button onClick={toggleFavorite} className="p-2 text-amber-glow transition-colors">
            <Star size={24} className={song.isFavorite ? "fill-amber-glow" : ""} />
          </button>
        </div>
      </header>

      <div className="px-6 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center text-white shadow-soft"
            style={{ backgroundColor: song.color }}
          >
            <span className="font-title text-2xl font-bold">{song.title.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-2xl font-title font-bold text-walnut-dark leading-tight">{song.title}</h1>
            <p className="text-walnut-mid text-sm mt-1">
              {song.startDate ? `연습 시작일: ${song.startDate}` : ''}
            </p>
          </div>
        </div>

        {sessions.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-walnut-mid/5 mb-6">
            <h3 className="text-sm font-medium text-walnut-mid mb-4">최근 점수 변화</h3>
            <div className="h-24 outline-none">
              <Line data={sparklineData} options={sparklineOptions} />
            </div>
            <div className="mt-3 flex justify-between text-xs text-walnut-mid/60 font-medium">
              <span>과거</span>
              <span>최근</span>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-4 mt-8">
          <h2 className="text-lg font-bold text-walnut-dark">연습 기록</h2>
          <span className="text-sm text-walnut-mid font-medium">총 {sessions.length}회</span>
        </div>

        <div className="flex flex-col gap-3 pb-24">
          {sessions.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-walnut-mid text-sm">아직 연습 기록이 없습니다.</p>
            </div>
          ) : (
            sessions.map(session => (
              <Link 
                to={`/session/${session.id}`} 
                key={session.id}
                className="bg-white p-4 rounded-xl flex items-center justify-between border border-walnut-mid/5 shadow-sm active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-ivory-deep rounded-lg text-walnut-mid">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-walnut-dark">{session.overallScore}점</div>
                    <div className="text-xs text-walnut-mid mt-0.5">
                      {new Date(session.createdAt).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-walnut-mid/50" />
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="fixed bottom-0 w-full max-w-md mx-auto p-4 bg-gradient-to-t from-ivory-bright via-ivory-bright to-transparent z-10 pb-safe">
        <Link 
          to={`/song/${id}/practice`}
          className="w-full bg-walnut-dark text-white font-bold py-4 rounded-xl shadow-soft flex justify-center items-center gap-2 hover:bg-walnut-mid transition-all"
        >
          <Mic size={20} />
          새 연습 시작하기
        </Link>
      </div>
    </div>
  );
}
