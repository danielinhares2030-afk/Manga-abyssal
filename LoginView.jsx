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
      
      {/* O fundo borrado e sujo foi removido, deixei apenas o grid sutil do sistema */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)]" style={{ backgroundSize: '30px 30px' }}></div>

      {/* Margem superior removida (não abaixa mais a tela) */}
      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">
        
        <div className="flex flex-col items-center justify-center mb-6 text-center">
            
            {/* ÍCONE KAGE: Chama o contorno animado através do showContour={true} */}
            <KageLogo className="w-64 h-64 md:w-72 md:h-72 mb-2 p-4" showContour={true} />

            <p className="text-red-200/50 text-[10px] mt-2 uppercase tracking-[0.4em] font-bold flex items-center gap-2 relative z-10">
                <Swords className="w-3 h-3 text-red-500/40" /> Oculto nas Sombras <Swords className="w-3 h-3 text-red-500/40" />
            </p>
        </div>

        <div className="bg-[#0a0a0c]/90 border border-white/5 p-8 sm:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegister && (
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500/40 group-focus-within:text-red-500 transition-colors"/>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome Sombrio" className="w-full pl-11 pr-4 py-3.5 bg-[#030305]/50 border border-white/10 rounded-xl text-white text-sm font-medium outline-none focus:border-red-600/50 focus:bg-[#030305]/80 transition-all shadow-inner placeholder:text-gray-600" required />
                </div>
              )}
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500/40 group-focus-within:text-red-500 transition-colors"/>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail Astral" className="w-full pl-11 pr-4 py-3.5 bg-[#030305]/50 border border-white/10 rounded-xl text-white text-sm font-medium outline-none focus:border-red-600/50 focus:bg-[#030305]/80 transition-all shadow-inner placeholder:text-gray-600" required />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500/40 group-focus-within:text-red-500 transition-colors"/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha de Selamento" className="w-full pl-11 pr-4 py-3.5 bg-[#030305]/50 border border-white/10 rounded-xl text-white text-sm font-medium outline-none focus:border-red-600/50 focus:bg-[#030305]/80 transition-all shadow-inner placeholder:text-gray-600" required />
              </div>

              <button type="submit" disabled={loading} className="w-full mt-8 bg-red-600 text-white rounded-xl font-black py-4 transition-all hover:bg-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] tracking-widest text-xs flex justify-center items-center gap-2 disabled:opacity-60">
                 {loading ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : isRegister ? <><Flame className="w-4 h-4"/> Forjar Aliança</> : <><Moon className="w-4 h-4"/> Adentrar as Sombras</>}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4 text-center">
                <button onClick={() => setIsRegister(!isRegister)} className="text-[11px] text-gray-500 hover:text-red-400 tracking-wider font-bold transition-colors">
                    {isRegister ? "Já possui um selo? Faça login." : "Ainda não é um ninja? Alistar-se."}
                </button>
                <button onClick={onGuestAccess} className="text-gray-600 hover:text-white text-[10px] uppercase font-black tracking-[0.2em] transition-colors mt-2">
                    Acesso de Espectador
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
