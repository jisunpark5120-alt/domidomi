import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SongListPage from './pages/SongListPage';
import AddSongPage from './pages/AddSongPage';
import SongDetailPage from './pages/SongDetailPage';
import PracticePage from './pages/PracticePage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen max-w-md mx-auto bg-ivory-deep shadow-2xl relative overflow-hidden flex flex-col">
        {/* Header decoration */}
        <div className="h-2 w-full bg-gradient-to-r from-walnut-dark via-amber-glow to-walnut-dark" />
        
        <div className="flex-1 overflow-y-auto pb-safe">
          <Routes>
            <Route path="/" element={<SongListPage />} />
            <Route path="/add" element={<AddSongPage />} />
            <Route path="/song/:id" element={<SongDetailPage />} />
            <Route path="/song/:id/practice" element={<PracticePage />} />
            <Route path="/session/:sessionId" element={<ResultsPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
