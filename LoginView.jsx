import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app, auth } from './firebase'; 
import { InfinityLogo } from './UIComponents';
import { Mail, Lock, User, Sparkles, Wand2 } from 'lucide-react';

export function LoginView({ onLoginSuccess, onGuestAccess, showToast }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (isRegister) {
        if (!name.trim()) throw new Error("A patente precisa de um nome.");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        showToast("Nova aura detectada! Patente registrada.", "success");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        showToast("Bem-vindo de volta, Entidade.", "success");
      }
      onLoginSuccess();
    } catch (error) { showToast(error.message, "error"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#020408] font-sans flex flex-col items-center justify-center relative overflow-hidden px-4">
      <style>{`body, html { background-color: #020408 !important; }`}</style>
      
      {/* AURAS DE FUNDO ROTATIVAS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] bg-gradient-to-r from-cyan-600/10 to-emerald-600/10 blur-[150px] rounded-full animate-[spin_10s_linear_infinite]"></div>

      <div className="w-full max-w-sm relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="flex flex-col items-center justify-center mb-10 text-center">
            <InfinityLogo className="w-20 h-10 mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"/>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">MANGA <span className="text-cyan-400">INFINITY</span></h1>
            <p className="text-gray-500 text-xs mt-2 uppercase tracking-[0.3em] font-bold">Acesso à Patente</p>
        </div>

        {/* CARD DE LOGIN (Vidro Fosco Radical) */}
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/5 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegister && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"/>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome da Patente" className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-medium outline-none focus:border-cyan-500 transition-all focus:ring-1 focus:ring-cyan-500 shadow-inner" required />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"/>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Endereço de Energia" className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-medium outline-none focus:border-cyan-500 transition-all focus:ring-1 focus:ring-cyan-500 shadow-inner" required />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sincronização" className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-medium outline-none focus:border-cyan-500 transition-all focus:ring-1 focus:ring-cyan-500 shadow-inner" required />
              </div>

              <button type="submit" disabled={loading} className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black rounded-full font-black py-4 transition-all hover:scale-[1.02] uppercase tracking-widest text-xs flex justify-center items-center gap-2 shadow-[0_5px_20px_rgba(34,211,238,0.4)] disabled:opacity-60">
                 {loading ? <div className="w-5 h-5 border-2 border-black/50 border-t-black rounded-full animate-spin"></div> : isRegister ? <><Wand2 className="w-4 h-4"/> Forjar Acesso</> : <><Sparkles className="w-4 h-4"/> Sincronizar</>}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-5 text-center">
                <button onClick={() => setIsRegister(!isRegister)} className="text-[10px] text-cyan-500 hover:text-white uppercase tracking-widest font-bold transition-colors">
                    {isRegister ? "Já possui uma entidade? Sincronize." : "Nova aura detecada? Forje sua Patente."}
                </button>
                <button onClick={onGuestAccess} className="text-gray-500 hover:text-gray-300 text-[10px] uppercase font-bold tracking-[0.2em] transition-colors">Entrar como Eco (Visitante)</button>
            </div>
        </div>
      </div>
    </div>
  );
}
