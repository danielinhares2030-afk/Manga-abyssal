import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; 
import { User, Key, Lock, ArrowRight, Zap } from 'lucide-react';
import { InfinityLogo } from './UIComponents';

export function LoginView({ onLoginSuccess, onGuestAccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (isRegistering) { await createUserWithEmailAndPassword(auth, email, password); } 
      else { await signInWithEmailAndPassword(auth, email, password); }
      onLoginSuccess();
    } catch (err) { setError('Falha na sincronização. Entidade rejeitada.'); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#08080a] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* BACKGROUND CYBERPUNK RADICAL */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen animate-[pulse_3s_infinite_alternate]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-red-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-[pulse_4s_infinite_alternate-reverse]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none opacity-20"></div>

      <div className="w-full max-w-sm flex flex-col items-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
        
        <div className="mb-10 flex flex-col items-center text-center">
          <InfinityLogo className="w-28 h-14 mb-8 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]" />
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2 uppercase drop-shadow-2xl flex items-center gap-2">
             Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">System</span>
          </h1>
          <p className="text-[10px] text-red-500 font-black tracking-[0.5em] uppercase flex items-center gap-1">
            <Zap className="w-3 h-3" /> Acesso Restrito
          </p>
        </div>

        <div className="w-full bg-[#0b0e14]/90 backdrop-blur-3xl border-t border-b border-cyan-500/30 p-8 md:p-10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.9),inset_0_0_30px_rgba(34,211,238,0.05)] relative group">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee]"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group/input">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-900 group-focus-within/input:text-cyan-400 transition-colors" />
              <input type="email" placeholder="ID da Entidade" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-[#050508] border border-white/5 rounded-xl py-4 pl-14 pr-4 text-xs font-black tracking-widest text-white outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all uppercase placeholder:text-gray-700" />
            </div>
            
            <div className="relative group/input">
              <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-900 group-focus-within/input:text-red-400 transition-colors" />
              <input type="password" placeholder="Chave de Ignição" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-[#050508] border border-white/5 rounded-xl py-4 pl-14 pr-4 text-xs font-black tracking-widest text-white outline-none focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all uppercase placeholder:text-gray-700" />
            </div>

            {error && <p className="text-red-400 text-[10px] text-center font-black uppercase tracking-widest bg-red-950/40 py-3 rounded-lg border border-red-900/50">{error}</p>}

            <button type="submit" disabled={loading} className="w-full relative overflow-hidden bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black font-black text-xs uppercase tracking-[0.2em] py-4 rounded-xl mt-8 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] group/btn">
              {loading ? 'Conectando...' : (isRegistering ? 'Forjar Registro' : 'Inicializar')}
              {!loading && <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-5">
            <button onClick={() => setIsRegistering(!isRegistering)} className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] hover:text-cyan-400 transition-colors">{isRegistering ? 'Já possui acesso? Entrar' : 'Não registrado? Criar ID'}</button>
            <button onClick={onGuestAccess} className="text-[9px] text-red-500/80 font-black uppercase tracking-[0.3em] hover:text-red-400 transition-colors border-b border-red-900/50 hover:border-red-400 pb-1">Modo Fantasma</button>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-cyan-900/40">
          <Lock className="w-3 h-3" />
          <span className="text-[8px] font-black tracking-[0.4em] uppercase">Rede Neural Criptografada</span>
        </div>
      </div>
    </div>
  );
}
