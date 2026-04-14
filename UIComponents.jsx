import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';

/* ==========================================================================
   NOVO ÍCONE
   ========================================================================== */
export const MangaInfinityLogo = React.memo(({ className = "w-20 h-20" }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse"></div>

      <svg
        viewBox="0 0 100 100"
        className="relative z-10 w-full h-full drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]"
      >
        <defs>
          <linearGradient id="manga-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>

        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="url(#manga-grad)"
          strokeWidth="4"
        />

        <path
          d="M30 50 C30 35 45 35 50 50 C55 65 70 65 70 50
             C70 35 55 35 50 50 C45 65 30 65 30 50"
          fill="none"
          stroke="url(#manga-grad)"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
});

/* ==========================================================================
   SPLASH SCREEN
   ========================================================================== */
export const SplashScreen = React.memo(() => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 600);
    const t3 = setTimeout(() => setPhase(3), 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#030305] flex items-center justify-center transition-all duration-700 ${
        phase === 3
          ? 'opacity-0 scale-110 blur-sm pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950 via-[#030305] to-purple-950"></div>

      <div
        className={`absolute rounded-full border border-cyan-400/50 transition-all duration-1000 ${
          phase >= 1
            ? 'w-[260px] h-[260px] opacity-100 animate-spin'
            : 'w-0 h-0 opacity-0'
        }`}
        style={{ animationDuration: '4s' }}
      ></div>

      <div
        className={`relative z-10 flex flex-col items-center transition-all duration-700 ${
          phase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
      >
        <MangaInfinityLogo className="w-28 h-28 mb-4" />

        <h1 className="text-4xl font-black text-white tracking-tight">
          MANGA-INFINITY
        </h1>

        <p className="text-xs text-cyan-400 tracking-[0.3em] uppercase mt-2 animate-pulse">
          universo infinito
        </p>
      </div>
    </div>
  );
});

/* ==========================================================================
   ERROR BOUNDARY
   ========================================================================== */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030305] flex flex-col items-center justify-center">
          <ShieldAlert className="w-16 h-16 text-red-500 animate-pulse mb-4" />
          <h1 className="text-white text-2xl font-black">
            Erro no sistema
          </h1>
          <p className="text-gray-400 mt-2">
            {this.state.error?.message}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
