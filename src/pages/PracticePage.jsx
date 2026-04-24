import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Upload, Square, Loader2 } from 'lucide-react';
import { useRecorder } from '../hooks/useRecorder';
import { getSong, addSession } from '../utils/storage';
import { generateAudioMetadata } from '../utils/aiCoach';
import { motion, AnimatePresence } from 'framer-motion';

export default function PracticePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isRecording, startRecording, stopRecording, audioBlob } = useRecorder();
  
  const [song, setSong] = useState(null);
  const [mode, setMode] = useState('record'); // 'record' | 'upload'
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadSong();
  }, [id]);

  useEffect(() => {
    if (!isRecording && audioBlob) {
      handleAnalyze(audioBlob);
    }
  }, [isRecording, audioBlob]);

  const loadSong = async () => {
    const data = await getSong(id);
    if (!data) navigate('/');
    setSong(data);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAnalyze(file);
    }
  };

  const handleAnalyze = async (blob) => {
    setAnalyzing(true);
    try {
      const metadata = await generateAudioMetadata(blob);
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metadata })
      });
      
      const result = await res.json();
      if (!res.ok) {
        const err = new Error(result.error || '서버 통신에 실패했습니다.');
        err.code = result.code || res.status;
        throw err;
      }

      // calc overall score
      const metrics = ['rhythm', 'pitch', 'dynamics', 'pedal', 'evenness', 'leftHand', 'rightHand', 'expression'];
      let total = 0;
      metrics.forEach(m => total += (result[m] || 0));
      const overallScore = Math.round((total / (metrics.length * 10)) * 100);

      const savedSession = await addSession({
        songId: id,
        overallScore,
        metrics: {
          rhythm: result.rhythm,
          pitch: result.pitch,
          dynamics: result.dynamics,
          pedal: result.pedal,
          evenness: result.evenness,
          leftHand: result.leftHand,
          rightHand: result.rightHand,
          expression: result.expression
        },
        comment: result.comment,
        // In a real app we'd save blob to IndexedDB here, but keeping it simple for now
      });

      navigate(`/session/${savedSession.id}`, { replace: true });

    } catch (err) {
      console.error(err);
      setAnalyzing(false); // Stop loading indicator immediately
      
      // setTimeout gives React one tick to unmount the 'analyzing' screen before blocking with alert
      setTimeout(() => {
        alert(`분석 중 문제가 발생했습니다.\n\n에러 코드: ${err.code || '클라이언트 오류'}\n상세 사유: ${err.message}`);
      }, 50);
    }
  };

  if (!song) return null;

  return (
    <div className="flex flex-col h-full bg-ivory-dark relative">
      <header className="p-4 flex items-center relative z-10">
        {!analyzing && (
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-walnut-dark">
            <ArrowLeft size={24} />
          </button>
        )}
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        
        <AnimatePresence mode="wait">
          {analyzing ? (
            <motion.div 
              key="analyzing"
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-24 h-24 bg-amber-glow/10 rounded-full flex items-center justify-center mb-6">
                <Loader2 className="text-amber-glow animate-spin" size={40} />
              </div>
              <h2 className="text-2xl font-title font-bold text-walnut-dark mb-2">선생님이 듣고 있어요...</h2>
              <p className="text-walnut-mid text-center max-w-xs leading-relaxed">
                 조금만 기다려주세요.<br/>연주를 꼼꼼하게 분석하고 있습니다.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="recording"
              className="w-full flex justify-center py-20" // added wrapper to prevent flex stretch
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-full max-w-sm flex flex-col items-center">
                <h2 className="text-2xl font-title font-bold text-walnut-dark mb-1 text-center">{song.title}</h2>
                {mode === 'record' ? (
                  <p className="text-walnut-mid mb-12 text-center">연주를 직접 녹음해주세요</p>
                ) : (
                  <div className="text-center mb-10 text-walnut-mid">
                    <p>오디오 또는 비디오를 업로드해 주세요</p>
                    <p className="text-xs mt-1.5 opacity-70">
                      지원 형식: mp3, m4a, mp4, mov 등
                    </p>
                  </div>
                )}

                <div className="flex bg-walnut-mid/5 rounded-full p-1 mb-12 self-stretch mx-auto w-48">
                  <button 
                    onClick={() => setMode('record')}
                    className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${mode === 'record' ? 'bg-white shadow-sm text-walnut-dark' : 'text-walnut-mid'}`}
                  >
                    직접 녹음
                  </button>
                  <button 
                    onClick={() => setMode('upload')}
                    className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${mode === 'upload' ? 'bg-white shadow-sm text-walnut-dark' : 'text-walnut-mid'}`}
                  >
                    파일 선택
                  </button>
                </div>

                {mode === 'record' ? (
                  <div className="relative">
                    {/* Visualizer Ping */}
                    {isRecording && (
                      <>
                        <span className="animate-ping absolute -inset-4 bg-amber-glow/30 rounded-full"></span>
                        <span className="animate-ping absolute -inset-8 bg-amber-glow/20 rounded-full" style={{ animationDelay: '0.5s'}}></span>
                      </>
                    )}
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-soft
                        ${isRecording ? 'bg-white text-rose-500 scale-110' : 'bg-amber-glow text-white hover:scale-105'}`}
                    >
                      {isRecording ? <Square fill="currentColor" size={32} /> : <Mic size={40} />}
                    </button>
                    {isRecording && <p className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-rose-500 font-bold whitespace-nowrap">녹음 중...</p>}
                  </div>
                ) : (
                  <div className="flex flex-col flex-1 items-center justify-center">
                    <input 
                      type="file" 
                      accept="audio/*,video/*" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 bg-white border-2 border-dashed border-walnut-mid/30 rounded-full flex items-center justify-center text-amber-glow hover:border-amber-glow hover:bg-amber-glow/5 transition-all"
                    >
                      <Upload size={32} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
