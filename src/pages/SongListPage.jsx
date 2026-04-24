import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Music, Star } from 'lucide-react';
import { getSongs } from '../utils/storage';

export default function SongListPage() {
  const [songs, setSongs] = useState([]);
  const [filter, setFilter] = useState('ALL'); // 'ALL' or 'FAVORITES'

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    const data = await getSongs();
    setSongs(data || []);
  };

  const filteredSongs = filter === 'ALL' ? songs : songs.filter(s => s.isFavorite);

  return (
    <div className="p-6 relative min-h-full">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-title font-bold text-walnut-dark tracking-tight">도미도미</h1>
          <p className="text-walnut-mid mt-1">오늘의 피아노 연습을 기록하세요</p>
        </div>
        <Music className="text-amber-glow opacity-80" size={32} />
      </header>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-full text-sm transition-all ${filter === 'ALL' ? 'bg-walnut-dark text-ivory-bright shadow-soft' : 'bg-walnut-mid/10 text-walnut-mid hover:bg-walnut-mid/20'}`}
        >
          전체 곡
        </button>
        <button 
          onClick={() => setFilter('FAVORITES')}
          className={`px-4 py-2 rounded-full text-sm transition-all ${filter === 'FAVORITES' ? 'bg-amber-glow text-white shadow-soft' : 'bg-walnut-mid/10 text-walnut-mid hover:bg-walnut-mid/20'}`}
        >
          즐겨찾기
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredSongs.map((song) => (
          <Link to={`/song/${song.id}`} key={song.id} className="block group">
            <div className="bg-ivory-bright p-5 rounded-xl shadow-sm border border-walnut-mid/5 group-hover:shadow-soft transition-all h-full relative">
              {song.isFavorite && (
                <Star className="absolute top-3 right-3 text-amber-glow fill-amber-glow" size={16} />
              )}
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white"
                style={{ backgroundColor: song.color || '#C87941' }}
              >
                <Music size={20} />
              </div>
              <h3 className="font-bold text-walnut-dark line-clamp-2 leading-snug">{song.title}</h3>
              <p className="text-xs text-walnut-mid mt-1 truncate">
                {song.startDate ? `시작일: ${song.startDate}` : ''}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filteredSongs.length === 0 && (
        <div className="text-center py-20 opacity-50 flex flex-col items-center">
          <Music size={48} className="text-walnut-mid mb-4 opacity-50" />
          <p className="text-walnut-mid">등록된 곡이 없습니다.</p>
        </div>
      )}

      {/* Fixed FAB */}
      <Link 
        to="/add" 
        className="fixed bottom-8 right-1/2 translate-x-[clamp(100px,calc(50vw-40px),200px)] lg:translate-x-[180px] w-14 h-14 bg-amber-glow text-white rounded-full flex items-center justify-center shadow-soft hover:scale-105 transition-transform z-10"
      >
        <Plus size={28} />
      </Link>
    </div>
  );
}
