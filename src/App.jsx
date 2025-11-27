import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  Zap,
  CloudRain,
  Sun,
  Flame,
  Moon,
  X,
  ExternalLink,
  Sparkles,
  Loader2,
  Brain,
  Lightbulb,
  CassetteTape,
  CloudFog,
  Activity
} from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// --- CONFIGURAZIONE ---

const apiKey = ""; // API Key will be injected by the environment

// --- DATI ---

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
  { id: 'happy', label: 'EUPHORIA', icon: Sun, gradId: 'grad-yellow', color: 'text-yellow-400', glow: 'shadow-[0_0_20px_rgba(250,204,21,0.3)]' },
  { id: 'sad', label: 'MELANCHOLY', icon: CloudRain, gradId: 'grad-white', color: 'text-slate-200', glow: 'shadow-[0_0_20px_rgba(255,255,255,0.2)]' },
  { id: 'energetic', label: 'KINETIC', icon: Zap, gradId: 'grad-lime', color: 'text-lime-400', glow: 'shadow-[0_0_20px_rgba(163,230,53,0.3)]' },
  { id: 'angry', label: 'FORCE', icon: Flame, gradId: 'grad-orange', color: 'text-orange-500', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]' },
  { id: 'chill', label: 'STASIS', icon: Moon, gradId: 'grad-cyan', color: 'text-cyan-300', glow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]' },
  { id: 'focused', label: 'FOCUS', icon: Brain, gradId: 'grad-emerald', color: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(52,211,153,0.3)]' },
  { id: 'creative', label: 'CREATE', icon: Lightbulb, gradId: 'grad-yellow', color: 'text-yellow-300', glow: 'shadow-[0_0_20px_rgba(253,224,71,0.3)]' },
  { id: 'nostalgic', label: 'NOSTALGIA', icon: CassetteTape, gradId: 'grad-rose', color: 'text-rose-400', glow: 'shadow-[0_0_20px_rgba(251,113,133,0.3)]' },
  { id: 'dreamy', label: 'DREAM', icon: CloudFog, gradId: 'grad-violet', color: 'text-violet-300', glow: 'shadow-[0_0_20px_rgba(167,139,250,0.3)]' },
];

const MOOD_PLAYLISTS = {
  happy: [
    { title: "Sunny Vibes", desc: "Radiant energy for your best days.", analysis: "High serotonin levels detected.", spotify_id: "37i9dQZF1DX3rxVfibe1L0", image_keyword: "sunshine" },
    { title: "Good Vibes Only", desc: "Positive frequencies aligned.", analysis: "Optimism parameters maximized.", spotify_id: "37i9dQZF1DXcBWIGoYBM5M", image_keyword: "happy" },
    { title: "Mood Booster", desc: "Elevating your mental state.", analysis: "Dopamine release imminent.", spotify_id: "37i9dQZF1DX3rxVfibe1L0", image_keyword: "smile" }
  ],
  sad: [
    { title: "Melancholy Mix", desc: "Embracing the quiet moments.", analysis: "Low energy state acknowledged.", spotify_id: "37i9dQZF1DX7qK8ma5wgG1", image_keyword: "rain" },
    { title: "Sad Songs", desc: "For when you need to feel it all.", analysis: "Emotional resonance detected.", spotify_id: "37i9dQZF1DX7qK8ma5wgG1", image_keyword: "sad" },
    { title: "Life Sucks", desc: "It's okay to not be okay.", analysis: "Catharsis protocol initiated.", spotify_id: "37i9dQZF1DX3YSRoSdA634", image_keyword: "lonely" }
  ],
  energetic: [
    { title: "Beast Mode", desc: "Unleash your inner power.", analysis: "Adrenaline levels spiking.", spotify_id: "37i9dQZF1DX76Wlfdnj7AP", image_keyword: "energy" },
    { title: "Workout Hype", desc: "Pushing past the limits.", analysis: "Physical output maximized.", spotify_id: "37i9dQZF1DX70RN3TfWWJh", image_keyword: "gym" },
    { title: "Pumped Up", desc: "Ready for anything.", analysis: "Kinetic energy overflow.", spotify_id: "37i9dQZF1DX0HRj9P7NxeE", image_keyword: "running" }
  ],
  angry: [
    { title: "Rage Mode", desc: "Channeling the fire within.", analysis: "Aggression levels elevated.", spotify_id: "37i9dQZF1DX3YSRoSdA634", image_keyword: "fire" },
    { title: "Heavy Metal", desc: "Distorted reality.", analysis: "Sonic intensity critical.", spotify_id: "37i9dQZF1DX9qNs32fujYe", image_keyword: "metal" },
    { title: "Punk Essentials", desc: "Rebellion frequency.", analysis: "Non-compliance detected.", spotify_id: "37i9dQZF1DX3LDIBRoaCDQ", image_keyword: "punk" }
  ],
  chill: [
    { title: "Chill Hits", desc: "Relax and unwind.", analysis: "Stress levels minimizing.", spotify_id: "37i9dQZF1DX4WYpdgoIcn6", image_keyword: "relax" },
    { title: "Lo-Fi Beats", desc: "Background noise for peace.", analysis: "Brainwaves synchronizing.", spotify_id: "37i9dQZF1DX8Uebhn9wzrS", image_keyword: "lofi" },
    { title: "Acoustic Chill", desc: "Stripped back and simple.", analysis: "Harmonic resonance stable.", spotify_id: "37i9dQZF1DX6z20IXmBjWI", image_keyword: "acoustic" }
  ],
  focused: [
    { title: "Deep Focus", desc: "Locked in and productive.", analysis: "Concentration absolute.", spotify_id: "37i9dQZF1DX5trt9i14X7j", image_keyword: "focus" },
    { title: "Brain Food", desc: "Nourishment for the mind.", analysis: "Cognitive function optimized.", spotify_id: "37i9dQZF1DX83I5je4W4rP", image_keyword: "brain" },
    { title: "Instrumental Study", desc: "Words are distractions.", analysis: "Verbal processing suspended.", spotify_id: "37i9dQZF1DX9sIqqvKsjG8", image_keyword: "study" }
  ],
  creative: [
    { title: "Creative Flow", desc: "Unlocking the imagination.", analysis: "Lateral thinking engaged.", spotify_id: "37i9dQZF1DX9sIqqvKsjG8", image_keyword: "art" },
    { title: "Indie Inspiration", desc: "New sounds, new ideas.", analysis: "Novelty seeking active.", spotify_id: "37i9dQZF1DX2Nc3B70tvx0", image_keyword: "paint" },
    { title: "Art Pop", desc: "Breaking the mold.", analysis: "Convention disregarded.", spotify_id: "37i9dQZF1DXbYM3nMM0oPk", image_keyword: "colors" }
  ],
  nostalgic: [
    { title: "All Out 80s", desc: "Back to the future.", analysis: "Temporal displacement detected.", spotify_id: "37i9dQZF1DX4UtSsGT1Sbe", image_keyword: "retro" },
    { title: "90s Smash Hits", desc: "The golden era.", analysis: "Memory banks accessing.", spotify_id: "37i9dQZF1DXbTxeAdrVG2l", image_keyword: "90s" },
    { title: "Throwback Thursday", desc: "Reliving the classics.", analysis: "Nostalgia circuits firing.", spotify_id: "37i9dQZF1DX0s5kDXi1kD5", image_keyword: "tape" }
  ],
  dreamy: [
    { title: "Dreamy Vibes", desc: "Floating in the ether.", analysis: "Reality distortion field active.", spotify_id: "37i9dQZF1DX6z20IXmBjWI", image_keyword: "clouds" },
    { title: "Shoegaze Classics", desc: "Wall of sound.", analysis: "Auditory immersion complete.", spotify_id: "37i9dQZF1DX68H8ZujdnN7", image_keyword: "dream" },
    { title: "Ethereal", desc: "Otherworldly sounds.", analysis: "Ascension imminent.", spotify_id: "37i9dQZF1DX82pCGH5USnM", image_keyword: "sky" }
  ]
};

const FALLBACK_PLAYLISTS = [
  {
    title: "OFFLINE PROTOCOL A",
    desc: "Neural link severed. Defaulting to local archives.",
    analysis: "Unable to parse bio-data.",
    cover: "https://images.unsplash.com/photo-1515462277126-2dd0c162007a?w=500&auto=format&fit=crop&q=60",
    url: "https://open.spotify.com/playlist/37i9dQZF1E37jO8SiMT0yN"
  }
];

async function callGemini(prompt) {
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
    return null;
  }
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
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

// --- Componenti ---

const DraggableMood = ({ mood, index, total, onDrop, containerRef }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);
  const animationRef = useRef();
  const radiusRef = useRef(170); // Default desktop radius

  // Gestione dinamica del raggio per mobile
  useEffect(() => {
    const handleResize = () => {
      // Raggio più piccolo su schermi stretti per evitare overflow
      radiusRef.current = window.innerWidth < 768 ? 150 : 170;
    };

    handleResize(); // Set initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // JS-based Orbit Animation with Direct DOM Manipulation
  useEffect(() => {
    const updateOrbit = () => {
      if (!isDragging && elementRef.current) {
        const time = Date.now() * 0.0001;
        const angle = time + (index * (2 * Math.PI / total));
        const x = Math.cos(angle) * radiusRef.current;
        const y = Math.sin(angle) * radiusRef.current;

        elementRef.current.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      }
      animationRef.current = requestAnimationFrame(updateOrbit);
    };
    animationRef.current = requestAnimationFrame(updateOrbit);
    return () => cancelAnimationFrame(animationRef.current);
  }, [index, total, isDragging]);

  const handlePointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Calculate current position from the element's transform or calculate it manually
    // Ideally we want to start dragging from where the orbit currently is
    const time = Date.now() * 0.0001;
    const angle = time + (index * (2 * Math.PI / total));
    const startX = Math.cos(angle) * radiusRef.current;
    const startY = Math.sin(angle) * radiusRef.current;

    setDragPosition({ x: startX, y: startY });
    setIsDragging(true);
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    if (containerRef.current) {
      const parentRect = containerRef.current.getBoundingClientRect();
      const centerX = parentRect.left + parentRect.width / 2;
      const centerY = parentRect.top + parentRect.height / 2;

      // Calcolo sicuro della posizione
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      if (clientX && clientY) {
        const newX = clientX - centerX;
        const newY = clientY - centerY;
        setDragPosition({ x: newX, y: newY });

        // Direct update during drag for responsiveness
        if (elementRef.current) {
          elementRef.current.style.transform = `translate(-50%, -50%) translate(${newX}px, ${newY}px)`;
        }
      }
    }
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);

    // Distanza dal centro per il drop (Heart)
    if (Math.sqrt(dragPosition.x ** 2 + dragPosition.y ** 2) < 120) {
      onDrop(mood);
    }
  };

  return (
    <div
      ref={elementRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      // Aggiunti listener touch espliciti per sicurezza su alcuni browser mobile
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      className={`absolute flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full backdrop-blur-sm bg-white/5 border border-white/10 cursor-grab active:cursor-grabbing shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ${isDragging ? 'z-50 scale-125 ' + mood.glow + ' bg-white/10' : 'z-20 hover:scale-110 hover:border-white/30 hover:bg-white/10'}`}
      style={{
        touchAction: 'none', // Critico per evitare lo scroll durante il drag
        left: '50%',
        top: '50%',
        // Initial transform will be set by the effect immediately
      }}
    >
      <div className="flex flex-col items-center justify-center w-full h-full pointer-events-none">
        <mood.icon className={`w-6 h-6 md:w-8 md:h-8 ${mood.color} filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]`} strokeWidth={1.5} fill={`url(#${mood.gradId})`} fillOpacity="0.4" />
        <span className={`absolute -bottom-8 text-[9px] font-mono tracking-widest text-white/80 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDragging ? 'opacity-100' : ''}`}>{mood.label}</span>
      </div>
    </div>
  );
};

const ResultCard = ({ results, onReset }) => {
  if (!results) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-700 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#101010] border border-white/10 p-1 shadow-2xl rounded-2xl my-auto">
        <div className="relative border border-white/5 rounded-xl h-full p-4 md:p-6 flex flex-col gap-6 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase tracking-widest relative z-10 border-b border-white/5 pb-4">
            <span className="flex items-center gap-2"><Sparkles size={12} className="text-lime-500" /> Generated Output</span>
            <button onClick={onReset} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"><X size={18} /></button>
          </div>
          <div className="space-y-4 relative z-10 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {results.map((playlist, idx) => (
              <div key={idx} className="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-lime-500/30 transition-all duration-300">
                <div className="relative w-full sm:w-20 h-20 shrink-0 overflow-hidden bg-zinc-900 rounded-lg shadow-lg">
                  <img src={playlist.cover} alt={playlist.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div><h3 className="text-lg font-semibold text-white leading-tight group-hover:text-lime-400 transition-colors">{playlist.title}</h3><p className="text-xs text-zinc-400 font-light mt-1 line-clamp-2">{playlist.desc}</p></div>
                  <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-end">
                    <span className="text-[9px] text-zinc-500 font-mono">{playlist.analysis.substring(0, 30)}...</span>
                    <a href={playlist.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white text-black rounded-full hover:bg-lime-400 transition-colors shadow-lg transform hover:scale-105"><ExternalLink size={14} /></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-2 text-center relative z-10"><span className="text-[9px] text-zinc-600 font-mono uppercase">Select a stream to initiate</span></div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [availableMoods, setAvailableMoods] = useState(MOOD_TYPES);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const rightPanelRef = useRef(null);

  // Contatore locale persistente con base history
  const BASE_COUNT = 15420; // Base "history" count
  const [globalCount, setGlobalCount] = useState(() => {
    // Inizializza leggendo dal localStorage o usa un default di 0
    try {
      const saved = localStorage.getItem('mood_mixer_count');
      const localCount = saved ? parseInt(saved, 10) : 0;
      return BASE_COUNT + localCount;
    } catch {
      return BASE_COUNT;
    }
  });

  const handleDrop = (mood) => {
    setAvailableMoods(prev => prev.filter(m => m.id !== mood.id));
    setSelectedMoods(prev => [...prev, mood]);
  };

  const removeMood = (moodId) => {
    const mood = MOOD_TYPES.find(m => m.id === moodId);
    setSelectedMoods(prev => prev.filter(m => m.id !== moodId));
    setAvailableMoods(prev => [...prev, mood]);
  };

  const generateLocalPlaylists = (moods) => {
    // Collect all possible playlists from selected moods
    let pool = [];
    moods.forEach(m => {
      if (MOOD_PLAYLISTS[m.id]) {
        pool = [...pool, ...MOOD_PLAYLISTS[m.id]];
      }
    });

    // If no specific playlists found or pool is empty, use fallback/random logic
    if (pool.length === 0) {
      // Fallback to 'chill' if nothing else
      pool = MOOD_PLAYLISTS['chill'];
    }

    // Shuffle and pick 3 unique
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    return selected.map(p => ({
      ...p,
      cover: `https://source.unsplash.com/500x500/?${encodeURIComponent(p.image_keyword)},abstract,minimal`,
      url: `https://open.spotify.com/playlist/${p.spotify_id}`
    }));
  };

  const generatePlaylistWithAI = async () => {
    setLoading(true);

    // Aggiorna contatore locale
    const newCount = globalCount + 1;
    setGlobalCount(newCount);
    localStorage.setItem('mood_mixer_count', newCount.toString());

    // Try AI first if key exists
    if (apiKey && apiKey !== "YOUR_GEMINI_API_KEY_HERE") {
      const moodLabels = selectedMoods.map(m => m.label).join(', ');
      const prompt = `You are a high-tech minimalist music curator. User Input: [${moodLabels}]. Output a JSON object with a "playlists" array containing exactly 3 DISTINCT playlist recommendations. Structure: { "playlists": [ { "title": "...", "desc": "...", "analysis": "...", "spotify_query": "...", "image_keyword": "..." }, ... ] }`;
      const jsonString = await callGemini(prompt);
      if (jsonString) {
        try {
          const cleanedJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
          const data = JSON.parse(cleanedJson);
          setResults(data.playlists.map(p => ({ ...p, cover: `https://source.unsplash.com/500x500/?${encodeURIComponent(p.image_keyword)},abstract,minimal`, url: `https://open.spotify.com/search/${encodeURIComponent(p.spotify_query)}` })));
          setLoading(false);
          return;
        } catch (e) {
          console.error("AI Parse Error, falling back to local", e);
        }
      }
    }

    // Fallback to local generation
    await new Promise(r => setTimeout(r, 1500)); // Fake delay for "processing" feel
    const localResults = generateLocalPlaylists(selectedMoods);
    setResults(localResults);
    setLoading(false);
  };

  const resetAll = () => {
    setResults(null);
    setSelectedMoods([]);
    setAvailableMoods(MOOD_TYPES);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden font-sans text-white selection:bg-lime-500/30 selection:text-lime-200 flex flex-col">
      <SpeedInsights />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        html, body, #root { width: 100%; min-height: 100vh; margin: 0; padding: 0; max-width: none !important; overflow-x: hidden; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(163, 230, 53, 0.5); border-radius: 4px; }
      `}</style>
      <svg width="0" height="0" className="absolute"><defs>{Object.values(GRADIENTS).map(g => (<linearGradient key={g.id} id={g.id} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={g.start} stopOpacity="1" /><stop offset="100%" stopColor={g.end} stopOpacity="1" /></linearGradient>))}</defs></svg>
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-purple-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-lime-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[30%] w-[600px] h-[600px] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
      </div>
      <div className="relative z-10 flex-1 flex flex-col lg:grid lg:grid-cols-2 min-h-screen w-full">
        <div className="relative flex flex-col justify-center px-6 py-12 lg:px-20 lg:py-12 z-10 min-h-[40vh] lg:min-h-screen text-center lg:text-left">
          <div className="absolute top-6 left-6 lg:top-12 lg:left-12 flex flex-col gap-1 text-left">
          </div>
          <div className="space-y-4 lg:space-y-6 animate-in slide-in-from-left duration-700 z-10 mt-16 lg:mt-0 flex flex-col items-center lg:items-start">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mix-blend-difference leading-tight">Mood Mixer</h1>
            <div className="h-px w-16 md:w-24 bg-lime-500"></div>
            <p className="text-zinc-400 max-w-sm text-sm leading-relaxed">Find the right music for your mood. Discover new playlists based on how you're feeling right now!</p>
          </div>
          <div className="hidden lg:flex absolute bottom-12 left-12 flex-col gap-2">
            <div className="flex items-center gap-2 text-lime-500/50 uppercase tracking-widest text-[10px] font-mono"><Activity size={12} className="animate-pulse" /> Global Moods Mixed</div>
            <div className="text-6xl font-light text-zinc-800 select-none tabular-nums animate-in fade-in slide-in-from-bottom-4 duration-1000">
              {globalCount.toLocaleString()}
            </div>
          </div>
        </div>
        <div ref={rightPanelRef} className="relative flex items-center justify-center z-20 flex-grow lg:flex-1 lg:min-h-screen pb-12 lg:pb-0">
          <div className="absolute top-6 right-6 lg:top-12 lg:right-12 flex flex-col gap-1 text-right z-30 pointer-events-none">
          </div>
          <div className="relative z-10 animate-in zoom-in duration-1000 scale-100 flex items-center justify-center">
            <div className={`absolute inset-[-40px] rounded-full border border-dashed border-white/5 animate-[spin_120s_linear_infinite] ${selectedMoods.length > 0 ? 'border-lime-500/10' : ''}`}></div>
            <div className={`absolute inset-[-20px] rounded-full border border-white/10 animate-[spin_80s_linear_reverse_infinite] ${selectedMoods.length > 0 ? 'border-lime-500/20' : ''}`}></div>
            <div className={`absolute inset-0 rounded-full border border-dashed border-white/10 animate-[spin_60s_linear_infinite] ${selectedMoods.length > 0 ? 'border-lime-500/30' : ''}`}></div>
            <div className={`absolute inset-[10px] rounded-full border border-white/5 ${selectedMoods.length > 0 ? 'border-lime-500/10 bg-lime-500/[0.02]' : 'bg-white/[0.02]'}`}></div>
            <div className="relative w-64 h-64 lg:w-48 lg:h-48 flex items-center justify-center">
              <div className="relative z-10">
                {selectedMoods.length === 0 ? (<Heart strokeWidth={1} size={48} className="text-zinc-700 transition-colors duration-500" />) : (<div className="grid grid-cols-2 gap-2">{selectedMoods.map(m => (<button key={m.id} onClick={() => removeMood(m.id)} className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lime-400 hover:border-red-500 hover:text-red-500 transition-all shadow-lg"><m.icon size={16} /></button>))}</div>)}
              </div>
            </div>
            {availableMoods.map((mood, index) => (<DraggableMood key={mood.id} index={index} total={availableMoods.length} mood={mood} onDrop={handleDrop} containerRef={rightPanelRef} />))}
            <div className="absolute -bottom-32 left-0 right-0 text-center w-[200%] -ml-[50%]">
              {selectedMoods.length > 0 ? (<button onClick={generatePlaylistWithAI} disabled={loading} className="group inline-flex items-center justify-center gap-3 py-3 px-6 text-sm font-mono uppercase tracking-[0.2em] text-lime-400 border border-lime-500/30 rounded-full bg-lime-500/5 backdrop-blur-md hover:bg-lime-500 hover:text-black transition-all duration-300">{loading ? (<Loader2 size={16} className="animate-spin" />) : (<><span>Set up your mood!</span><Sparkles size={14} className="group-hover:animate-pulse" /></>)}</button>) : (<span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Awaiting Input</span>)}
            </div>
          </div>
        </div>
      </div>
      <ResultCard results={results} onReset={resetAll} />
    </div>
  );
}
