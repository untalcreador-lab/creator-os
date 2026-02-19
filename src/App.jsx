import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  onSnapshot, 
  setDoc 
} from 'firebase/firestore';
import { 
  Zap, Lock, Wand2, Loader2, Layers, Mail, Settings, 
  LogOut, Sparkles, ShieldCheck, Clock, ChevronRight, 
  Plus, BarChart3, Users, Download, Play, Eye
} from 'lucide-react';

// --- CONFIGURACIÓN DE FIREBASE (Edwin, tus llaves están aquí) ---
const firebaseConfig = {
  apiKey: "AIzaSyCRDyd7jbpKvKr4Zf6-honZrddlHu8u12s",
  authDomain: "creator-os-pro.firebaseapp.com",
  projectId: "creator-os-pro",
  storageBucket: "creator-os-pro.firebasestorage.app",
  messagingSenderId: "1036859156827",
  appId: "1:1036859156827:web:da5a277ebff8e9ce9b127e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'creator-os-pro';

// DATOS MOCK PARA VISUALIZACIÓN
const MOCK_ITEMS = [
  { id: '1', title: 'Escena Espacial', prompt: 'Un astronauta flotando cerca de un agujero negro de neón.', date: 'Hoy' },
  { id: '2', title: 'Cyberpunk City', prompt: 'Calles de Tokio en el año 2099 con lluvia constante.', date: 'Ayer' }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const userRef = doc(db, 'artifacts', appId, 'users', u.uid);
        onSnapshot(userRef, (snap) => {
          if (!snap.exists()) {
            setDoc(userRef, { email: u.email, role: 'admin', isAuthorized: true, createdAt: Date.now() });
          }
          setUser(u);
          setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0B0F19]">
      <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
    </div>
  );

  if (!user) return <AuthScreen />;

  return (
    <div className="flex h-screen bg-[#0B0F19] text-slate-300 font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#111827] border-r border-slate-800 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
          <div className="p-2 bg-purple-600 rounded-lg shadow-lg shadow-purple-900/40">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-bold text-white text-sm tracking-widest">CREATOR OS</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<BarChart3 size={18}/>} label="DASHBOARD" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <NavItem icon={<Layers size={18}/>} label="PROYECTOS" />
          <NavItem icon={<Users size={18}/>} label="EQUIPO" />
          <div className="pt-6 mt-6 border-t border-slate-800/50">
            <p className="px-4 mb-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Sistema</p>
            <NavItem icon={<ShieldCheck size={18}/>} label="SEGURIDAD" />
            <NavItem icon={<Settings size={18}/>} label="CONFIGURACIÓN" />
          </div>
        </nav>

        <div className="p-4 bg-[#0d121d] border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 p-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
              {user.email[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.email}</p>
              <p className="text-[9px] text-purple-400 font-bold uppercase tracking-tighter">Owner Account</p>
            </div>
          </div>
          <button onClick={() => signOut(auth)} className="w-full flex items-center justify-center gap-2 py-3 text-[10px] font-bold text-slate-500 hover:text-red-400 bg-slate-900/50 rounded-xl border border-slate-800 transition-colors">
            <LogOut size={14} /> CERRAR SESIÓN
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-[#0B0F19] to-[#0B0F19]">
        <header className="h-16 flex items-center justify-between px-8 bg-[#0B0F19]/60 backdrop-blur-md border-b border-slate-800/50">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span>Inicio</span> <ChevronRight size={12} /> <span className="text-white">Panel de Producción</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold rounded-lg transition-all shadow-lg shadow-purple-900/20">
            <Plus size={14} /> NUEVA ESCENA
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-6 text-left">
              <StatBox label="Activos IA" value="1,240" color="text-blue-400" />
              <StatBox label="Renderizado" value="98%" color="text-green-400" />
              <StatBox label="Créditos" value="∞" color="text-purple-400" />
              <StatBox label="Usuarios" value="1" color="text-amber-400" />
            </div>

            {/* Simulación Generador */}
            <div className="relative p-8 bg-[#111827] border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden text-left">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              <div className="flex gap-8">
                <div className="flex-1 space-y-6">
                  <h3 className="text-white font-bold flex items-center gap-2"><Sparkles size={18} className="text-purple-400" /> Motor de Creación</h3>
                  <textarea className="w-full h-32 p-5 bg-[#0B0F19] border border-slate-700 rounded-2xl text-sm text-slate-300 outline-none focus:border-purple-500 transition-all resize-none shadow-inner" placeholder="Escribe el guion de tu próxima escena..." />
                  <button className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 flex items-center justify-center gap-3 transition-all active:scale-95">
                    <Wand2 size={18} /> PRODUCIR CON IA
                  </button>
                </div>
                <div className="w-1/3 bg-[#0B0F19] rounded-2xl border border-slate-800 border-dashed flex flex-col items-center justify-center text-slate-600">
                  <Eye size={32} className="mb-2 opacity-20" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Previsualización</p>
                </div>
              </div>
            </div>

            {/* Recientes */}
            <div className="space-y-6 text-left">
              <h3 className="text-white font-bold text-lg px-2">Historial de Producción</h3>
              <div className="grid grid-cols-2 gap-8 text-left">
                {MOCK_ITEMS.map(item => (
                  <div key={item.id} className="bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-500 transition-all shadow-xl group">
                    <div className="aspect-video bg-slate-900 relative overflow-hidden flex items-center justify-center">
                       <Layers size={48} className="text-slate-800 group-hover:scale-110 transition-transform" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-6">
                         <div className="w-full text-left">
                           <p className="text-[10px] font-bold text-purple-400 uppercase mb-1">{item.title}</p>
                           <p className="text-xs text-white italic line-clamp-2">"{item.prompt}"</p>
                         </div>
                       </div>
                    </div>
                    <div className="p-4 flex justify-between items-center bg-slate-900/50">
                      <div className="flex gap-4">
                        <Download size={16} className="text-slate-500 hover:text-white cursor-pointer" />
                        <Play size={16} className="text-slate-500 hover:text-white cursor-pointer" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// COMPONENTES PEQUEÑOS
function NavItem({ icon, label, active = false, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold tracking-widest transition-all ${active ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
      {icon} <span>{label}</span>
    </button>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div className="p-6 bg-[#111827] border border-slate-800 rounded-2xl shadow-lg text-left">
      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}

function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) await signInWithEmailAndPassword(auth, email, pass);
      else await createUserWithEmailAndPassword(auth, email, pass);
    } catch (e) { setError("Acceso denegado. Revisa tus datos."); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0B0F19] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0B0F19] to-[#0B0F19]">
      <div className="w-full max-w-md bg-[#111827] p-10 rounded-[3rem] shadow-2xl border border-slate-800 relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <div className="text-center mb-10">
          <Zap className="w-14 h-14 text-purple-600 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(147,51,234,0.3)]" />
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Creator OS</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Intelligence Studio Pro</p>
        </div>
        <form onSubmit={handleAuth} className="space-y-5 text-left">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Email del Creador</label>
            <input type="email" placeholder="nombre@estudio.com" className="w-full py-4 px-6 bg-[#0B0F19] border border-slate-700 rounded-2xl text-white outline-none focus:border-purple-500 transition-all shadow-inner" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Clave Maestra</label>
            <input type="password" placeholder="••••••••" className="w-full py-4 px-6 bg-[#0B0F19] border border-slate-700 rounded-2xl text-white outline-none focus:border-purple-500 transition-all shadow-inner" value={pass} onChange={e=>setPass(e.target.value)} required />
          </div>
          {error && <p className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold text-center rounded-xl uppercase tracking-widest">{error}</p>}
          <button className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-purple-900/30 transition-all active:scale-[0.98]">
            {isLogin ? 'ACCEDER AL ESTUDIO' : 'REGISTRAR MI CUENTA'}
          </button>
        </form>
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="w-full mt-8 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] hover:text-white transition-colors"
        >
          {isLogin ? '¿Eres nuevo? Crea tu cuenta ›' : '¿Ya tienes cuenta? Entra aquí ›'}
        </button>
      </div>
    </div>
  );
}