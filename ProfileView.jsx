import React from 'react';
import { UserCircle, Trophy, Settings, LogOut, Hexagon, Star, Coins } from 'lucide-react';

export function ProfileView({ user, userProfileData, onLogout }) {
  // Lógica matemática simples para a barra de XP
  const currentLevel = userProfileData?.level || 1;
  const currentXp = userProfileData?.xp || 0;
  const xpNeededForNextLevel = currentLevel * 100; // Altere se o seu cálculo for diferente
  const xpPercentage = Math.min(100, Math.max(0, (currentXp / xpNeededForNextLevel) * 100));

  return (
    <div className="pt-20 pb-24 px-4 max-w-4xl mx-auto min-h-screen animate-in fade-in duration-500">
      
      {/* Header do Perfil */}
      <div className="bg-[#05030a] border border-cyan-900/30 rounded-[2rem] p-6 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-900/20 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Holográfico */}
          <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-cyan-500 to-fuchsia-500 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
             <img src={user?.photoURL || `https://placehold.co/200x200/0f111a/3b82f6?text=U`} alt="Avatar" className="w-full h-full rounded-full object-cover border-4 border-[#05030a]" />
          </div>
          
          <div className="flex-1 text-center md:text-left mt-2">
            <h1 className="text-3xl font-black text-white tracking-wide">{user?.displayName || "Leitor Infinito"}</h1>
            <p className="text-sm text-cyan-400/80 font-bold mt-1 uppercase tracking-widest">{user?.email}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <span className="bg-[#0a0515] border border-fuchsia-500/30 px-4 py-1.5 rounded-full text-xs font-black text-fuchsia-400 flex items-center gap-2 shadow-[0_0_15px_rgba(217,70,239,0.1)]">
                <Trophy className="w-3 h-3" /> Nível {currentLevel}
              </span>
              <span className="bg-[#0a0515] border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-black text-amber-400 flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <Coins className="w-3 h-3" /> {userProfileData?.coins || 0} Moedas
              </span>
            </div>
          </div>
          
          <button onClick={onLogout} className="md:self-start bg-red-950/40 border border-red-900/50 text-red-400 p-3 rounded-xl hover:bg-red-900/60 hover:text-white transition-colors" title="Desconectar">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* NOVA BARRA DE XP: REATOR DE ENERGIA */}
        <div className="mt-8 bg-[#0a0515] p-5 rounded-2xl border border-white/5 relative">
          <div className="flex justify-between items-end mb-3">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Zap className="w-4 h-4 text-cyan-500"/> Energia Cósmica</span>
            <span className="text-[10px] font-black text-cyan-400 bg-cyan-950/50 px-2 py-1 rounded border border-cyan-500/20">{currentXp} / {xpNeededForNextLevel} XP</span>
          </div>
          
          {/* A Barra em si */}
          <div className="w-full h-5 bg-[#020105] rounded-full overflow-hidden border border-white/5 relative shadow-inner">
            {/* Linhas de Grade de fundo para dar visual sci-fi */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwIDBMMCAxME0xMCAxMEwwIDAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')]"></div>
            
            {/* O Preenchimento animado e brilhante */}
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-fuchsia-500 relative transition-all duration-1000 ease-out"
              style={{ width: `${xpPercentage}%` }}
            >
              {/* Brilho na ponta da barra */}
              <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/50 blur-[4px] animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
