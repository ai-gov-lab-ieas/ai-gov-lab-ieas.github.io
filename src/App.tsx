import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Mission } from './components/Mission';
import { Team } from './components/Team';
import { Activities } from './components/Activities';
import { Lang, CONTENT } from './data/content';
import { Brain } from 'lucide-react';

function App() {
  const [lang, setLang] = useState<Lang>('zh');
  const t = CONTENT[lang].footer;

  return (
    <div className="bg-[#FAFAFA] min-h-screen selection:bg-blue-500 selection:text-white font-sans antialiased">
      <Navigation lang={lang} setLang={setLang} />
      
      <main>
        <Hero lang={lang} />
        <Mission lang={lang} />
        <Team lang={lang} />
        <Activities lang={lang} />
      </main>

      <footer className="bg-slate-900 text-white py-20 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Brain className="text-blue-500" />
              <span className="text-xl font-bold">AI Governance Concepts Lab</span>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed text-sm">
              Academia Sinica, Taipei.
            </p>
          </div>
          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} IEAS. {t.rights}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;