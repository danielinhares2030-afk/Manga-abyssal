import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app, auth } from './firebase'; 
import { KageLogo } from './UIComponents';
import { Mail, Lock, User, Flame, Swords, Moon, AlertCircle } from 'lucide-react';

export function LoginView({ onLoginSuccess, onGuestAccess, showToast }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setLocalError(null);
    try {
      if (isRegister) {
        if (!name.trim()) throw new Error("missing-name");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        showToast("Seu pacto de sangue começou!", "success");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        showToast("Bem-vindo de volta às sombras.", "success");
      }
      onLoginSuccess();
    } catch (error) { 
        let msg = "Erro nas sombras: " + (error.message || "Desconhecido");
        const code = error.code;
        
        // CAPTURA EXATA DOS ERROS DO FIREBASE
        if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
            msg = "Este e-mail não está cadastrado ou a senha está incorreta.";
        } else if (code === 'auth/email-already-in-use') {
            msg = "Esta conta já existe. Tente fazer login.";
        } else if (code === 'auth/weak-password') {
            msg = "A senha deve ter pelo menos 6 caracteres.";
        } else if (code === 'auth/invalid-email') {
            msg = "O formato do e-mail é inválido.";
        } else if (error.message === 'missing-name') {
            msg = "O nome de usuário é obrigatório para criar a conta.";
        }
        
        showToast(msg, "error"); 
        setLocalError(msg);
    } finally { 
        setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans flex flex-col items-center justify-center relative px-4 overflow-hidden">
      <style>{`body, html { background-color: #050505 !important; }`}</style>
      
      {/* NOVO FUNDO: Alto Contraste Branco e Preto */}
      <div className="absolute inset-0 z-0 flex flex-col md:flex-row pointer-events-none">
          <div className="w-full md:w-1/2 h-1/2 md:h-full bg-white flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_0%,transparent_100%)]"></div>
          </div>
          <div className="w-full md:w-1/2 h-1/2 md:h-full bg-[#050505] relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505]"></div>
      </div>

      <div className="w-full max-w-[440px] relative z-10 animate-in slide-in-from-bottom-4 fade-in duration-700 mt-4">
        
        <div className="flex flex-col items-center justify-center mb-6 text-center">
            <KageLogo className="w-48 h-48 md:w-52 md:h-52 mb-1 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" showContour={false} />
            <p className="text-white/80 text-[10px] uppercase tracking-[0.6em] font-black flex items-center gap-2 mt-3 drop-shadow-md mix-blend-difference">
                <Swords className="w-4 h-4 text-black" /> Domínio das Sombras <Swords className="w-4 h-4 text-black" />
            </p>
        </div>

        {/* CARD OUSADO: Vidro negro com bordas brancas sutis */}
        <div className="bg-black/90 backdrop-blur-2xl border border-white/20 border-t-white/40 p-8 sm:p-12 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.8)] relative overflow-hidden">
            
            {localError && (
                <div className="mb-6 bg-red-950/80 border border-red-500/50 text-red-200 text-[10px] uppercase tracking-widest font-black p-4 rounded-2xl text-center flex items-center justify-center gap-2 animate-in fade-in zoom-in-95">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="leading-snug">{localError}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegister && (
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors"/>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Como será chamado? (Ex: Kage)" className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-bold outline-none focus:border-white/50 focus:bg-white/10 transition-all shadow-inner placeholder:text-gray-500" required />
                </div>
              )}
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors"/>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Digite seu E-mail (ninja@sombras.com)" className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-bold outline-none focus:border-white/50 focus:bg-white/10 transition-all shadow-inner placeholder:text-gray-500" required />
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors"/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha secreta (Mín. 6 dígitos)" className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-bold outline-none focus:border-white/50 focus:bg-white/10 transition-all shadow-inner placeholder:text-gray-500" required />
              </div>

              <button type="submit" disabled={loading} className="w-full mt-10 bg-white text-black rounded-2xl font-black py-4.5 transition-all hover:bg-gray-200 hover:scale-[1.02] tracking-[0.3em] text-[11px] uppercase flex justify-center items-center gap-3 disabled:opacity-60 shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
                 {loading ? <div className="w-5 h-5 border-2 border-black/50 border-t-black rounded-full animate-spin"></div> : isRegister ? <><Flame className="w-4 h-4"/> Forjar Aliança</> : <><Moon className="w-4 h-4"/> Adentrar as Sombras</>}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col items-center gap-5 text-center">
                <button onClick={() => { setIsRegister(!isRegister); setLocalError(null); }} className="text-[10px] text-gray-400 hover:text-white tracking-[0.2em] uppercase font-black transition-colors">
                    {isRegister ? "Já possui uma conta? Faça login." : "Ainda não é um ninja? Alistar-se."}
                </button>
                <button onClick={onGuestAccess} className="text-gray-500 hover:text-black hover:bg-white text-[9px] uppercase font-black tracking-[0.3em] transition-all bg-white/5 px-6 py-2.5 rounded-full border border-white/10">
                    Acesso de Espectador
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
