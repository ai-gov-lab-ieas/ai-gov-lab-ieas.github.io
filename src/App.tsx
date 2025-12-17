import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { Lang, CONTENT } from './data/content';
import { Brain } from 'lucide-react';

// ScrollToTop component to handle scrolling on route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [lang, setLang] = useState<Lang>('zh');
  const t = CONTENT[lang].footer;

  // Update document title when language changes
  useEffect(() => {
    document.title = CONTENT[lang].site.title;
  }, [lang]);

  return (
    <Router>
      <div className="bg-[#FAFAFA] min-h-screen selection:bg-blue-500 selection:text-white font-sans antialiased">
        <Navigation lang={lang} setLang={setLang} />
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<HomePage lang={lang} />} />
          <Route path="/event" element={<EventsPage lang={lang} />} />
          <Route path="/event/:eventId" element={<EventDetailPage lang={lang} />} />
        </Routes>

        <footer className="bg-slate-900 text-white py-20 px-4 mt-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Brain className="text-blue-500" />
                <span className="text-xl font-bold">{t.name}</span>
              </div>
              <p className="text-slate-400 max-w-md leading-relaxed text-sm">
                {t.location}
              </p>
            </div>
            <div className="text-sm text-slate-500">
              © {new Date().getFullYear()} IEAS. {t.rights}
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
