import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Music, Star } from 'lucide-react';
import { getSongs } from '../utils/storage';
import SheetMusicIcon from '../components/SheetMusicIcon';

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
      <header className="mb-8 relative z-10 w-full overflow-hidden pb-4">
        <div className="relative z-10">
          <h1 className="text-4xl font-title font-bold text-walnut-dark tracking-tight">도미도미</h1>
          <p className="text-walnut-mid mt-2">오늘의 피아노 연습을 기록하세요</p>
        </div>
        {/* Decorative large icon on the top right */}
        <div className="absolute -top-4 right-0 -mr-4 opacity-10 pointer-events-none -z-10 text-walnut-dark">
          <SheetMusicIcon size={140} />
        </div>
      </header>

      <div className="flex bg-walnut-mid/10 rounded-full p-1.5 mb-6 relative z-10 shadow-inner">
        <button 
          onClick={() => setFilter('ALL')}
          className={`flex-1 py-3 rounded-full text-sm font-bold touch-manipulation active:scale-[0.98] ${filter === 'ALL' ? 'bg-white text-walnut-dark shadow-sm' : 'text-walnut-mid hover:text-walnut-dark'}`}
        >
          전체 곡
        </button>
        <button 
          onClick={() => setFilter('FAVORITES')}
          className={`flex-1 py-3 rounded-full text-sm font-bold touch-manipulation active:scale-[0.98] ${filter === 'FAVORITES' ? 'bg-white text-walnut-dark shadow-sm' : 'text-walnut-mid hover:text-walnut-dark'}`}
        >
          즐겨찾기
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredSongs.map((song) => (
          <Link to={`/song/${song.id}`} key={song.id} className="block group">
            <div 
              className="rounded-xl border border-walnut-mid/20 group-hover:border-amber-glow/50 transition-all h-36 relative overflow-hidden flex flex-col justify-end shadow-sm group-hover:shadow-soft"
              style={{ backgroundColor: `${song.color}15` }}
            >
              {/* Left binding strip */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: song.color }} />

              {/* 5 Staff Lines Background */}
              <div className="absolute inset-0 flex flex-col justify-evenly py-6 opacity-[0.15] pointer-events-none mix-blend-multiply px-2">
                <div className="h-[1px] w-full bg-walnut-dark" />
                <div className="h-[1px] w-full bg-walnut-dark" />
                <div className="h-[1px] w-full bg-walnut-dark" />
                <div className="h-[1px] w-full bg-walnut-dark" />
                <div className="h-[1px] w-full bg-walnut-dark" />
              </div>

              {/* Watermark Icon */}
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-[0.08] pointer-events-none text-walnut-dark">
                <SheetMusicIcon size={120} />
              </div>

              {/* Favorite Star */}
              {song.isFavorite && (
                <div className="absolute top-3 right-3 z-10">
                  <Star className="text-amber-glow fill-amber-glow drop-shadow-sm" size={18} />
                </div>
              )}

              {/* Content Label */}
              <div className="relative z-10 p-3 pt-0">
                <div className="bg-ivory-bright/95 backdrop-blur px-3 py-2.5 rounded-lg shadow-sm border border-walnut-mid/10">
                  <h3 className="font-bold text-walnut-dark text-lg line-clamp-2 leading-snug">{song.title}</h3>
                  <p className="text-[10px] text-walnut-mid mt-1 font-medium truncate">
                    {song.startDate || ''}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredSongs.length === 0 && (
        <div className="text-center py-20 opacity-50 flex flex-col items-center">
          <SheetMusicIcon size={48} className="text-walnut-mid mb-4 opacity-50" />
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
