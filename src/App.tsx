import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, MousePointer2, Keyboard, Search, BookOpen, Quote } from 'lucide-react';
import { explainText } from './lib/gemini';

interface SelectionInfo {
  text: string;
  x: number;
  y: number;
}

export default function App() {
  const [selection, setSelection] = useState<SelectionInfo | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 0) {
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setSelection({
        text: sel.toString().trim(),
        x: rect.left + rect.width / 2,
        y: rect.top + window.scrollY,
      });
    } else {
      if (!isPopupVisible) {
        setSelection(null);
      }
    }
  }, [isPopupVisible]);

  const triggerExplanation = useCallback(async () => {
    if (selection && !isPopupVisible) {
      setIsPopupVisible(true);
      setIsLoading(true);
      setExplanation(null);
      
      const result = await explainText(selection.text);
      setExplanation(result);
      setIsLoading(false);
    }
  }, [selection, isPopupVisible]);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Trigger on Alt + E (Selection inside app)
      if (e.altKey && e.key.toLowerCase() === 'e') {
        if (selection) {
          e.preventDefault();
          triggerExplanation();
        }
      }

      // Trigger on Alt + V (Clipboard from outside)
      if (e.altKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        try {
          const text = await navigator.clipboard.readText();
          if (text.trim().length > 0) {
            setSelection({
              text: text.trim(),
              x: window.innerWidth / 2,
              y: window.innerHeight / 4, // Center it more
            });
            setIsPopupVisible(true);
            setIsLoading(true);
            setExplanation(null);
            
            const result = await explainText(text.trim());
            setExplanation(result);
            setIsLoading(false);
          }
        } catch (err) {
          console.error("Failed to read clipboard:", err);
        }
      }
      
      // Close on Escape
      if (e.key === 'Escape') {
        setIsPopupVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selection, triggerExplanation]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setIsPopupVisible(false);
      }
    };

    if (isPopupVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPopupVisible]);

  return (
    <div 
      className="min-h-screen bg-slate-950 text-slate-900 font-sans selection:bg-blue-500/30 selection:text-slate-900 flex items-center justify-center p-4 md:p-8"
      onMouseUp={handleMouseUp}
    >
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
      </div>

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-5xl h-[calc(100vh-4rem)] bg-white/95 rounded-[2rem] shadow-2xl overflow-hidden border border-white/40 flex flex-col z-10"
      >
        {/* Header (OS Style) */}
        <header className="h-14 border-b border-slate-100 flex items-center px-6 bg-white/50 backdrop-blur-sm shrink-0">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="ml-8 text-[11px] font-bold text-slate-400 tracking-widest uppercase">Lumina_Research_Env.ai</div>
          
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 hidden sm:flex">
              <Keyboard size={12} className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Alt + E to Explain</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-12 md:p-20 relative">
          <article className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-10 leading-tight italic font-serif">
                Quantum Computing Paradigms: <br/>An Empirical Review
              </h1>
              
              <div className="space-y-8 text-lg leading-relaxed text-slate-700">
                <p>
                  The transition from classical bits to quantum bits, or qubits, represents a fundamental shift in information processing. Unlike a classical bit, which can be either 0 or 1, a qubit can exist in a superposition of both states simultaneously.
                </p>
                
                <p>
                  One of the most profound aspects of this technology is 
                  <span className="relative inline-block">
                    <span className="bg-blue-500/10 px-1 rounded transition-colors hover:bg-blue-500/20">
                      quantum entanglement
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                  </span>, a physical phenomenon where pairs of particles are generated, defined, or interact in such a way that the quantum state of each particle cannot be described independently of the state of the others.
                </p>

                <div className="my-14 p-10 bg-slate-50/50 border-l-4 border-slate-900 rounded-r-3xl italic text-slate-700 relative overflow-hidden backdrop-blur-sm">
                  <Quote className="absolute -top-4 -left-2 text-slate-200/50 w-24 h-24 -z-0" />
                  <p className="relative z-10 text-xl leading-relaxed font-serif">
                    "This interdependence allows quantum computers to perform complex calculations at speeds unattainable by the world's most powerful supercomputers."
                  </p>
                </div>

                <p>
                  By utilizing tools that can summarize complex jargon or explain obscure metaphors instantaneously, readers can maintain their flow without the disruptive cognitive load of context-switching between a text and a search engine. 
                </p>
                
                <p className="border-l-2 border-slate-100 pl-6 text-slate-500 text-base italic">
                  Epistemological Humility suggests that our individual understanding is always a work in progress. When we encounter selection-based AI agents, we aren't just getting answers; we are participating in a collaborative dialogue.
                </p>
              </div>
            </motion.div>
          </article>
        </main>

        {/* Footer */}
        <footer className="h-10 border-t border-slate-100 flex items-center px-6 justify-between bg-white/50 text-[9px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
          <div>DOCUMENT PAGE 01 / 12</div>
          <div className="flex items-center space-x-6">
            <span>MODEL: GEMINI-3-FLASH</span>
            <span>ZOOM: 100%</span>
          </div>
        </footer>
      </motion.div>

      {/* Floating Insight Popup */}
      <AnimatePresence>
        {isPopupVisible && selection && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            style={{
              position: 'absolute',
              left: Math.max(20, Math.min(window.innerWidth - 380, selection.x - 180)),
              top: selection.y + 20,
              zIndex: 50,
            }}
            className="w-[360px] bg-white/60 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/60 overflow-hidden"
          >
            <div className="h-10 bg-white/40 border-b border-white/20 flex items-center px-4 justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">AI Assistant</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Alt + E</div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest opacity-80">Context</span>
                <p className="text-sm font-medium text-slate-800 mt-1 line-clamp-2 italic border-l-2 border-slate-200 pl-3 py-0.5">
                  "{selection.text}"
                </p>
              </div>

              <div className="relative min-h-[60px]">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-6 gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="text-blue-500"
                    >
                      <Sparkles size={20} />
                    </motion.div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Processing...</p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-slate-800 text-[14px] leading-relaxed whitespace-pre-wrap"
                  >
                    {explanation}
                  </motion.div>
                )}
              </div>
              
              {!isLoading && (
                <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
                  <div className="flex space-x-2">
                    <button className="px-2.5 py-1 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-wider rounded hover:bg-slate-800 transition-colors">Copy</button>
                    <button 
                      onClick={() => setIsPopupVisible(false)}
                      className="px-2.5 py-1 bg-white/50 border border-slate-200 text-slate-600 text-[9px] font-bold uppercase tracking-wider rounded hover:bg-white/80 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                  <span className="text-[9px] text-slate-400 italic">Escape to dismiss</span>
                </div>
              )}
            </div>
            
            {/* Gradient Accent Bar */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini Helper Button */}
      <AnimatePresence>
        {selection && !isPopupVisible && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={triggerExplanation}
            style={{
              position: 'absolute',
              left: selection.x,
              top: selection.y - 45,
              zIndex: 40,
            }}
            className="bg-slate-900 text-white rounded-full px-4 py-2 flex items-center gap-2 shadow-xl hover:bg-slate-800 transition-all -translate-x-1/2 border border-slate-700/50 backdrop-blur-sm"
          >
            <Sparkles size={14} className="text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Explain</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Persistent Hint */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50"
        >
          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full shadow-2xl pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
            <p className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Select text or copy & press Alt+V</p>
          </div>
          <p className="text-[9px] text-slate-500 font-medium uppercase tracking-widest">Local background mode active</p>
        </motion.div>
    </div>
  );
}

