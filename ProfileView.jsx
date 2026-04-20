import React, { useState, useEffect, useRef } from 'react';
import { Compass, History, Library, Smartphone, Camera, Edit3, LogOut, Loader2, BookOpen, AlertTriangle, Trophy, Zap, Trash2, RefreshCw, LayoutTemplate, Settings } from 'lucide-react';
import { updateProfile } from "firebase/auth";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from './firebase';
import { APP_ID } from './constants';
import { compressImage, getLevelRequirement, getLevelTitle, cleanCosmeticUrl } from './helpers';

const HexStat = ({ icon: Icon, value, label, color }) => (
  <div className="relative flex flex-col items-center justify-center w-24 h-24 flex-shrink-0 group">
    <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full opacity-10 group-hover:opacity-20 transition-opacity z-0 ${color}`}>
      <path d="M50 5 L95 27.5 L95 72.5 L50 95 L5 72.5 L5 27.5 Z" fill="currentColor" />
    </svg>
    <div className="relative z-10 flex flex-col items-center justify-center px-1 text-center w-full">
      <Icon className={`w-5 h-5 mb-1 ${color}`} />
      <span className="text-base font-black text-white tracking-tighter truncate w-full px-2">{value}</span>
      <span className="text-[8px] text-gray-400 uppercase font-black tracking-widest mt-0.5 truncate w-full px-1">{label}</span>
    </div>
  </div>
);

export function ProfileView(props) {
  const { user, userProfileData, historyData, libraryData, dataLoaded, userSettings, updateSettings, onLogout, onUpdateData, showToast, mangas, onNavigate } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Estatísticas"); 
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarBase64, setAvatarBase64] = useState('');
  const [coverBase64, setCoverBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); 

  useEffect(() => {
    setName(user.displayName || '');
    setBio(userProfileData.bio || '');
    setAvatarBase64(userProfileData.avatarUrl || user.photoURL || '');
    setCoverBase64(userProfileData.coverUrl || '');
  }, [user, userProfileData]);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressedBase64 = await compressImage(file, type === 'cover' ? 400 : 150, 0.4);
      type === 'avatar' ? setAvatarBase64(compressedBase64) : setCoverBase64(compressedBase64);
    } catch {
      showToast("Erro na imagem.", "error");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName: name });
      const docData = { coverUrl: coverBase64, avatarUrl: avatarBase64, bio };
      await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'profile', 'main'), docData, { merge: true });
      onUpdateData(docData);
      showToast('Perfil atualizado!', 'success');
      setIsEditing(false);
    } catch {
      showToast("Erro ao salvar.", "error");
    } finally {
      setLoading(false);
    }
  };

  const executeConfirmAction = async () => {
    if (confirmAction === 'history') {
      try {
        for (const h of historyData) {
          await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'history', h.id));
        }
        showToast("Memórias apagadas.", "success");
      } catch {
        showToast("Erro ao limpar.", "error");
      }
    } else if (confirmAction === 'cache') {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload(true);
    }
    setConfirmAction(null);
  };

  const level = userProfileData.level || 1;
  const currentXp = userProfileData.xp || 0;
  const xpNeeded = getLevelRequirement(level);
  const progressPercent = Math.min(100, (currentXp / xpNeeded) * 100);

  const eq = userProfileData.equipped_items || {};

  const activeAvatarSrc =
    (eq.avatar?.preview ? cleanCosmeticUrl(eq.avatar.preview) : null) ||
    avatarBase64 ||
    `https://placehold.co/150x150/0A0E17/22d3ee?text=U`;

  return (
    <div className="animate-in fade-in duration-500 w-full pb-24 font-sans min-h-screen text-gray-200 bg-[#0A0E17]">

      {confirmAction && (
        <div className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] p-8 rounded-2xl max-w-sm w-full text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-black text-white mb-2">Confirmar?</h3>
            <div className="flex gap-4">
              <button onClick={() => setConfirmAction(null)}>Cancelar</button>
              <button onClick={executeConfirmAction}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* CAPA */}
      <div className="w-full h-[200px] bg-[#0f172a] relative overflow-hidden">
        {coverBase64
          ? <img src={coverBase64} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-cyan-900/30 to-indigo-900/30" />
        }
      </div>

      {/* PERFIL */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-black/50 backdrop-blur-xl p-6 rounded-xl text-center">

          <div className="w-24 h-24 mx-auto mb-3">
            <img src={activeAvatarSrc} className="w-full h-full rounded-xl object-cover" />
          </div>

          <h1 className="text-xl font-bold">{name || 'Usuário'}</h1>
          <p className="text-xs text-gray-400">{user.email}</p>

          {bio && <p className="text-xs mt-2">{bio}</p>}

          <div className="mt-4">
            <div className="text-xs">LVL {level}</div>
            <div className="w-full h-1 bg-gray-700 mt-1">
              <div className="h-full bg-cyan-400" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button onClick={() => setIsEditing(!isEditing)}>Editar</button>
            <button onClick={onLogout}>Sair</button>
          </div>

        </div>
      </div>
    </div>
  );
}
