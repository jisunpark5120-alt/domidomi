import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Home, RefreshCw } from 'lucide-react';
import { getSession } from '../utils/storage';
import { METRIC_LABELS } from '../utils/aiCoach';
import ScoreRing from '../components/ScoreRing';
import ProgressBar from '../components/ProgressBar';
import { motion } from 'framer-motion';

export default function ResultsPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    const data = await getSession(sessionId);
    if (!data) navigate('/');
    setSession(data);
  };

  if (!session) return null;

  return (
    <div className="flex flex-col h-full bg-ivory-bright relative">
      <header className="p-4 flex items-center justify-between mt-2 sticky top-0 bg-ivory-bright/90 backdrop-blur z-20">
        <h2 className="text-lg font-title font-bold text-walnut-dark">분석 결과</h2>
        <button onClick={() => navigate('/')} className="p-2 text-walnut-dark">
          <Home size={24} />
        </button>
      </header>

      <div className="px-6 pb-24 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center my-8"
        >
          <ScoreRing score={session.overallScore} size={140} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-walnut-mid/10 mb-8 relative"
        >
          {/* Decorative quote mark */}
          <span className="absolute -top-4 -left-2 text-6xl text-amber-glow/20 font-serif leading-none">"</span>
          <p className="text-walnut-dark font-medium leading-relaxed relative z-10 text-[15px]">
            {session.comment}
          </p>
        </motion.div>

        <div className="mb-6">
          <h3 className="text-xl font-title font-bold text-walnut-dark mb-4">상세 분석</h3>
          
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-walnut-mid/5 space-y-2">
            {Object.entries(session.metrics).map(([key, value], idx) => (
              <ProgressBar 
                key={key} 
                label={METRIC_LABELS[key]} 
                value={value} 
                delay={0.5 + (idx * 0.1)} 
              />
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full max-w-md mx-auto p-4 bg-gradient-to-t from-ivory-bright via-ivory-bright to-transparent z-10 pb-safe">
        <button 
          onClick={() => navigate(-1)}
          className="w-full bg-walnut-dark text-white font-bold py-4 rounded-xl shadow-soft flex justify-center items-center gap-2 hover:bg-walnut-mid transition-all"
        >
          <RefreshCw size={20} />
          다시 연습하기
        </button>
      </div>
    </div>
  );
}
