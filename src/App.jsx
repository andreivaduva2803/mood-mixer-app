import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  Zap,
  CloudRain,
  Sun,
  Flame,
  Moon,
  Headphones,
  X,
  ExternalLink,
  Disc,
  Sparkles,
  Loader2,
  Brain,
  Lightbulb,
  CassetteTape,
  CloudFog,
} from 'lucide-react';

// --- Configuration & Data ---

const apiKey = ''; // API Key will be injected by the environment

// Define gradients map for referencing in SVG fills
const GRADIENTS = {
  lime: { id: 'grad-lime', start: '#a3e635', end: '#4d7c0f' },
  white: { id: 'grad-white', start: '#ffffff', end: '#94a3b8' },
  cyan: { id: 'grad-cyan', start: '#22d3ee', end: '#0e7490' },
  orange: { id: 'grad-orange', start: '#fb923c', end: '#c2410c' },
  emerald: { id: 'grad-emerald', start: '#34d399', end: '#047857' },
  yellow: { id: 'grad-yellow', start: '#facc15', end: '#a16207' },
  rose: { id: 'grad-rose', start: '#fb7185', end: '#be123c' },
  violet: { id: 'grad-violet', start: '#a78bfa', end: '#6d28d9' },
};

const MOOD_TYPES = [
  {
    id: 'happy',
    label: 'EUPHORIA',
    icon: Sun,
    gradId: 'grad-yellow',
    color: 'text-yellow-400',
    glow: 'shadow-[0_0_20px_rgba(250,204,21,0.3)]',
  },
  {
    id: 'sad',
    label: 'MELANCHOLY',
    icon: CloudRain,
    gradId: 'grad-white',
    color: 'text-slate-200',
    glow: 'shadow-[0_0_20px_rgba(255,255,255,0.2)]',
  },
  {
    id: 'energetic',
    label: 'KINETIC',
    icon: Zap,
    gradId: 'grad-lime',
    color: 'text-lime-400',
    glow: 'shadow-[0_0_20px_rgba(163,230,53,0.3)]',
  },
  {
    id: 'angry',
    label: 'FORCE',
    icon: Flame,
    gradId: 'grad-orange',
    color: 'text-orange-500',
    glow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]',
  },
  {
    id: 'chill',
    label: 'STASIS',
    icon: Moon,
    gradId: 'grad-cyan',
    color: 'text-cyan-300',
    glow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]',
  },
  {
    id: 'focused',
    label: 'FOCUS',
    icon: Brain,
    gradId: 'grad-emerald',
    color: 'text-emerald-400',
    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.3)]',
  },
  {
    id: 'creative',
    label: 'CREATE',
    icon: Lightbulb,
    gradId: 'grad-yellow',
    color: 'text-yellow-300',
    glow: 'shadow-[0_0_20px_rgba(253,224,71,0.3)]',
  },
  {
    id: 'nostalgic',
    label: 'NOSTALGIA',
    icon: CassetteTape,
    gradId: 'grad-rose',
    color: 'text-rose-400',
    glow: 'shadow-[0_0_20px_rgba(251,113,133,0.3)]',
  },
  {
    id: 'dreamy',
    label: 'DREAM',
    icon: CloudFog,
    gradId: 'grad-violet',
    color: 'text-violet-300',
    glow: 'shadow-[0_0_20px_rgba(167,139,250,0.3)]',
  },
];

const FALLBACK_PLAYLIST = {
  title: 'OFFLINE PROTOCOL',
  desc: 'Neural link severed. Defaulting to local archives.',
  analysis: 'Unable to parse bio-data. Connection required.',
  cover:
    'https://images.unsplash.com/photo-1515462277126-2dd0c162007a?w=500&auto=format&fit=crop&q=60',
  url: 'https://open.spotify.com/playlist/37i9dQZF1E37jO8SiMT0yN',
};

// --- API Logic ---

async function callGemini(prompt) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    return null;
  }
}

// --- Components ---

const DraggableMood = ({ mood, index, total, onDrop, containerRef }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [orbitPosition, setOrbitPosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef();
  const elementRef = useRef(null);

  // JS-based Orbit Animation
  useEffect(() => {
    const updateOrbit = () => {
      if (!isDragging) {
        // Radius logic
        const radius = window.innerWidth < 768 ? 110 : 170;
        const time = Date.now() * 0.0001;
        const angle = time + index * ((2 * Math.PI) / total);

        setOrbitPosition({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
        });
      }
      animationRef.current = requestAnimationFrame(updateOrbit);
    };

    animationRef.current = requestAnimationFrame(updateOrbit);
    return () => cancelAnimationFrame(animationRef.current);
  }, [index, total, isDragging]);

  const handlePointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragPosition({ x: orbitPosition.x, y: orbitPosition.y });
    setIsDragging(true);
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    if (containerRef.current) {
      const parentRect = containerRef.current.getBoundingClientRect();
      const centerX = parentRect.left + parentRect.width / 2;
      const centerY = parentRect.top + parentRect.height / 2;
      setDragPosition({ x: e.clientX - centerX, y: e.clientY - centerY });
    }
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);

    const distance = Math.sqrt(dragPosition.x ** 2 + dragPosition.y ** 2);
    if (distance < 120) {
      onDrop(mood);
    }
  };

  const activePosition = isDragging ? dragPosition : orbitPosition;

  return (
    <div
      ref={elementRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`
        absolute flex flex-col items-center justify-center 
        w-12 h-12 md:w-16 md:h-16 rounded-full
        backdrop-blur-sm bg-white/5 border border-white/10
        cursor-grab active:cursor-grabbing
        shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]
        ${
          isDragging
            ? 'z-50 scale-125 ' + mood.glow + ' bg-white/10'
            : 'z-20 hover:scale-110 hover:border-white/30 hover:bg-white/10 transition-transform duration-200'
        }
      `}
      style={{
        touchAction: 'none',
        left: '50%',
        top: '50%',
        marginLeft: '-32px',
        marginTop: '-32px',
        transform: `translate(${activePosition.x}px, ${activePosition.y}px)`,
      }}
    >
      <div className="flex flex-col items-center justify-center w-full h-full pointer-events-none">
        {/* Skeuomorphic Icon:
                - Fill with gradient (opacity controlled via gradient definition)
                - Drop Shadow for depth on the stroke
            */}
        <mood.icon
          className={`w-6 h-6 md:w-8 md:h-8 ${mood.color} filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]`}
          strokeWidth={1.5}
          fill={`url(#${mood.gradId})`}
          fillOpacity="0.4"
        />

        <span
          className={`
                absolute -bottom-8 text-[9px] font-mono tracking-widest text-white/80 
                bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-md
                opacity-0 group-hover:opacity-100 transition-opacity duration-300
                ${isDragging ? 'opacity-100' : ''}
            `}
        >
          {mood.label}
        </span>
      </div>
    </div>
  );
};

const ResultCard = ({ result, onReset }) => {
  if (!result) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-700">
      <div className="relative w-full max-w-md bg-[#101010] border border-white/10 p-1 shadow-2xl rounded-2xl">
        <div className="relative border border-white/5 rounded-xl h-full p-6 flex flex-col gap-6 overflow-hidden">
          {/* Ambient Card Background */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex justify-between items-start text-[9px] font-mono text-zinc-500 uppercase tracking-widest relative z-10">
            <span>Output Gen. 01</span>
            <span>{new Date().getFullYear()}</span>
          </div>

          <div className="flex gap-6 items-start relative z-10">
            <div className="relative w-24 h-24 shrink-0 overflow-hidden bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg group">
              <img
                src={result.cover}
                alt={result.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-lg"></div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-lime-400">
                <Sparkles size={12} />
                <span className="text-[9px] font-mono uppercase tracking-widest">
                  Generated Match
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-white leading-tight">
                {result.title}
              </h2>
              <p className="text-xs text-zinc-400 font-light leading-relaxed line-clamp-2">
                {result.desc}
              </p>
            </div>
          </div>

          <div className="border-t border-dashed border-zinc-800 pt-6 relative z-10">
            <p className="text-xs text-zinc-500 font-mono leading-relaxed">
              <span className="text-lime-500 mr-2">{'>>>'} ANALYSIS:</span>
              {result.analysis}
            </p>
          </div>

          <div className="pt-2 grid grid-cols-[1fr_auto] gap-4 relative z-10">
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                        flex items-center justify-center gap-3
                        bg-white text-black h-12 px-6 rounded-lg
                        font-medium text-sm tracking-wide
                        hover:bg-lime-400 transition-colors duration-300 shadow-lg
                    "
            >
              <span>INITIATE STREAM</span>
              <ExternalLink size={14} />
            </a>
            <button
              onClick={onReset}
              className="
                        flex items-center justify-center w-12 h-12
                        border border-zinc-800 text-zinc-400 rounded-lg
                        hover:text-white hover:border-white transition-colors bg-white/5
                    "
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [availableMoods, setAvailableMoods] = useState(MOOD_TYPES);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const rightPanelRef = useRef(null);

  const handleDrop = (mood) => {
    setAvailableMoods((prev) => prev.filter((m) => m.id !== mood.id));
    setSelectedMoods((prev) => [...prev, mood]);
  };

  const removeMood = (moodId) => {
    const mood = MOOD_TYPES.find((m) => m.id === moodId);
    setSelectedMoods((prev) => prev.filter((m) => m.id !== moodId));
    setAvailableMoods((prev) => [...prev, mood]);
  };

  const generatePlaylistWithAI = async () => {
    setLoading(true);
    const moodLabels = selectedMoods.map((m) => m.label).join(', ');
    const prompt = `
      You are a high-tech minimalist music curator.
      User Input: [${moodLabels}].
      Output JSON only:
      {
        "title": "Minimal Title (Max 3 words)",
        "desc": "Direct, technical description.",
        "analysis": "Abstract, sci-fi observation of data.",
        "spotify_query": "Search query",
        "image_keyword": "Abstract minimal dark tech"
      }
    `;

    const jsonString = await callGemini(prompt);

    if (jsonString) {
      try {
        const cleanedJson = jsonString
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();
        const data = JSON.parse(cleanedJson);
        setResult({
          title: data.title,
          desc: data.desc,
          analysis: data.analysis,
          cover: `https://source.unsplash.com/500x500/?${encodeURIComponent(
            data.image_keyword
          )},abstract,minimal`,
          url: `https://open.spotify.com/search/${encodeURIComponent(
            data.spotify_query
          )}`,
        });
      } catch (e) {
        console.error('Failed to parse AI response', e);
        setResult(FALLBACK_PLAYLIST);
      }
    } else {
      setResult(FALLBACK_PLAYLIST);
    }
    setLoading(false);
  };

  const resetAll = () => {
    setResult(null);
    setSelectedMoods([]);
    setAvailableMoods(MOOD_TYPES);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden font-sans text-white selection:bg-lime-500/30 selection:text-lime-200 flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      {/* --- SVG DEFS for Gradients --- */}
      <svg width="0" height="0" className="absolute">
        <defs>
          {Object.values(GRADIENTS).map((g) => (
            <linearGradient
              key={g.id}
              id={g.id}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={g.start} stopOpacity="1" />
              <stop offset="100%" stopColor={g.end} stopOpacity="1" />
            </linearGradient>
          ))}
        </defs>
      </svg>

      {/* --- Ambient Living Background --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Using CSS-animated blobs instead of static glows */}
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-purple-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-lime-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[30%] w-[600px] h-[600px] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      {/* --- Main Layout Grid --- */}
      <div className="relative z-10 flex-1 grid grid-cols-2 h-screen w-full">
        {/* --- LEFT SECTION: Title & Context --- */}
        <div className="relative flex flex-col justify-center px-6 md:px-12 lg:px-20 py-12 z-10">
          <div className="absolute top-12 left-6 md:left-12 flex flex-col gap-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Category:
            </span>
            <span className="text-xs font-medium text-white tracking-wide">
              Audio Identity
            </span>
          </div>

          <div className="space-y-6 animate-in slide-in-from-left duration-700 z-10">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-medium tracking-tight text-white mix-blend-difference leading-[0.9]">
              Mood
              <br />
              Mixer
            </h1>
            <div className="h-px w-16 md:w-24 bg-lime-500"></div>
            <p className="text-zinc-400 max-w-sm text-xs md:text-sm leading-relaxed">
              Sonic fabrication based on emotional input vectors. Drag
              components to the synthesis core on the right.
            </p>
          </div>

          <div className="absolute bottom-12 left-6 md:left-12">
            <div className="text-4xl md:text-6xl font-light text-zinc-800 select-none">
              +2K
            </div>
          </div>
        </div>

        {/* --- RIGHT SECTION: The Mixer & Orbit --- */}
        <div
          ref={rightPanelRef}
          className="relative flex items-center justify-center z-20"
        >
          {/* Meta Top Right */}
          <div className="absolute top-12 right-6 md:right-12 flex flex-col gap-1 text-right z-30 pointer-events-none">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              System
            </span>
            <span className="text-xs font-medium text-lime-500 tracking-wide flex items-center justify-end gap-2">
              Online{' '}
              <span className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-pulse"></span>
            </span>
          </div>

          {/* The Core Container */}
          <div className="relative z-10 animate-in zoom-in duration-1000 scale-75 md:scale-100">
            {/* --- CONCENTRIC RINGS (Tighter) --- */}
            <div
              className={`absolute inset-[-40px] rounded-full border border-dashed border-white/5 animate-[spin_120s_linear_infinite] ${
                selectedMoods.length > 0 ? 'border-lime-500/10' : ''
              }`}
            ></div>
            <div
              className={`absolute inset-[-20px] rounded-full border border-white/10 animate-[spin_80s_linear_reverse_infinite] ${
                selectedMoods.length > 0 ? 'border-lime-500/20' : ''
              }`}
            ></div>
            <div
              className={`absolute inset-0 rounded-full border border-dashed border-white/10 animate-[spin_60s_linear_infinite] ${
                selectedMoods.length > 0 ? 'border-lime-500/30' : ''
              }`}
            ></div>
            <div
              className={`absolute inset-[10px] rounded-full border border-white/5 ${
                selectedMoods.length > 0
                  ? 'border-lime-500/10 bg-lime-500/[0.02]'
                  : 'bg-white/[0.02]'
              }`}
            ></div>

            {/* Heart / Drop Zone */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div className="relative z-10">
                {selectedMoods.length === 0 ? (
                  <Heart
                    strokeWidth={1}
                    size={48}
                    className="text-zinc-700 transition-colors duration-500"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedMoods.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => removeMood(m.id)}
                        className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lime-400 hover:border-red-500 hover:text-red-500 transition-all shadow-lg"
                      >
                        <m.icon size={16} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="absolute -bottom-24 left-0 right-0 text-center">
              {selectedMoods.length > 0 ? (
                <button
                  onClick={generatePlaylistWithAI}
                  disabled={loading}
                  className="
                                group inline-flex items-center justify-center gap-3 py-3
                                text-xs font-mono uppercase tracking-[0.2em] text-lime-400
                                hover:text-white transition-colors
                            "
                >
                  {loading ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <>
                      <span>[ Process ]</span>
                      <div className="h-px w-8 bg-current group-hover:w-12 transition-all"></div>
                    </>
                  )}
                </button>
              ) : (
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                  Awaiting Input
                </span>
              )}
            </div>
          </div>

          {/* Orbiting Moods Layer */}
          {availableMoods.map((mood, index) => (
            <DraggableMood
              key={mood.id}
              index={index}
              total={availableMoods.length}
              mood={mood}
              onDrop={handleDrop}
              containerRef={rightPanelRef}
            />
          ))}
        </div>
      </div>

      {/* Result Overlay */}
      <ResultCard result={result} onReset={resetAll} />
    </div>
  );
}
