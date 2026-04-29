import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app, auth } from './firebase'; 
import { KageLogo } from './UIComponents';
import { Mail, Lock, User, Flame, Swords, Moon } from 'lucide-react';

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
        if (!name.trim()) throw new Error("O nome nas sombras é obrigatório.");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        showToast("Seu pacto de sangue começou!", "success");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        showToast("Bem-vindo de volta às sombras.", "success");
      }
      onLoginSuccess();
    } catch (error) { showToast(error.message, "error"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#030305] font-sans flex flex-col items-center justify-center relative overflow-hidden px-4">
      <style>{`body, html { background-color: #030305 !important; }`}</style>
      
      {/* Fundo Cósmico Geral */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-red-900/20 blur-[120px] rounded-full animate-[pulse_8s_ease-in-out_infinite_alternate]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-rose-900/15 blur-[100px] rounded-full animate-[pulse_10s_ease-in-out_infinite_alternate-reverse]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)]" style={{ backgroundSize: '30px 30px' }}></div>

      {/* Conteúdo Principal (Descido com mt-12) */}
      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700 mt-12">
        
        <div className="flex flex-col items-center justify-center mb-8 text-center">
            <div className="relative w-full flex justify-center items-center">
                
                {/* NOVA AURA: Vórtice Sombrio Giratório */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none scale-[1.2]">
                    <div className="absolute w-[280px] h-[280px] md:w-[350px] md:h-[350px] border-2 border-red-600/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute w-[260px] h-[260px] md:w-[330px] md:h-[330px] border border-red-500/20 rounded-full animate-[spin_7s_linear_infinite_reverse] border-dashed"></div>
                    <div className="absolute w-[240px] h-[240px] md:w-[300px] md:h-[300px] bg-gradient-to-tr from-red-900/30 via-transparent to-red-600/10 rounded-full animate-[spin_5s_linear_infinite] blur-xl"></div>
                    <div className="absolute w-[180px] h-[180px] md:w-[220px] md:h-[220px] bg-red-600/40 blur-[50px] rounded-full animate-pulse"></div>
                </div>
                
                {/* ÍCONE KAGE (Aumentado) */}
                <KageLogo className="w-72 h-72 md:w-80 md:h-80 mb-2 drop-shadow-[0_0_25px_rgba(220,38,38,0.6)] relative z-10"/>
            </div>

            <p className="text-red-200/50 text-[10px] mt-4 uppercase tracking-[0.4em] font-bold flex items-center gap-2 relative z-10">
                <Swords className="w-3 h-3 text-red-500/40" /> Oculto nas Sombras <Swords className="w-3 h-3 text-red-500/40" />
            </p>
        </div>

        {/* CARD PRINCIPAL DE LOGIN */}
        <div className="bg-[#0a0a0c]/80 backdrop-blur-2xl border border-red-600/20 p-8 sm:p-10 rounded-[2rem] shadow-[0_0_50px_rgba(220,38,38,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegister && (
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500/40 group-focus-within:text-red-500 transition-colors"/>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome Sombrio" className="w-full pl-11 pr-4 py-3.5 bg-[#030305]/50 border border-red-900/30 rounded-xl text-white text-sm font-medium outline-none focus:border-red-600/50 focus:bg-[#030305]/80 transition-all shadow-inner placeholder:text-gray-600" required />
                </div>
              )}
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500/40 group-focus-within:text-red-500 transition-colors"/>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail Astral" className="w-full pl-11 pr-4 py-3.5 bg-[#030305]/50 border border-red-900/30 rounded-xl text-white text-sm font-medium outline-none focus:border-red-600/50 focus:bg-[#030305]/80 transition-all shadow-inner placeholder:text-gray-600" required />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500/40 group-focus-within:text-red-500 transition-colors"/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha de Selamento" className="w-full pl-11 pr-4 py-3.5 bg-[#030305]/50 border border-red-900/30 rounded-xl text-white text-sm font-medium outline-none focus:border-red-600/50 focus:bg-[#030305]/80 transition-all shadow-inner placeholder:text-gray-600" required />
              </div>

              <button type="submit" disabled={loading} className="w-full mt-8 bg-gradient-to-r from-red-700 to-red-500 border border-red-500/30 text-white rounded-xl font-bold py-4 transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] tracking-widest text-xs flex justify-center items-center gap-2 disabled:opacity-60 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
                 {loading ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : isRegister ? <><Flame className="w-4 h-4"/> Forjar Aliança</> : <><Moon className="w-4 h-4"/> Adentrar as Sombras</>}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-red-900/30 flex flex-col items-center gap-4 text-center">
                <button onClick={() => setIsRegister(!isRegister)} className="text-[11px] text-gray-400 hover:text-red-400 tracking-wider font-medium transition-colors drop-shadow-sm">
                    {isRegister ? "Já possui um selo? Faça login." : "Ainda não é um ninja? Alistar-se."}
                </button>
                <button onClick={onGuestAccess} className="text-gray-600 hover:text-white text-[10px] uppercase font-bold tracking-[0.2em] transition-colors mt-2">
                    Acesso de Espectador
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
