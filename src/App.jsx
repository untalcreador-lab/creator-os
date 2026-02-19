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
  getDoc, 
  setDoc, 
  collection, 
  query, 
  onSnapshot, 
  updateDoc,
  addDoc
} from 'firebase/firestore';
import { 
  Zap, Lock, Wand2, Loader2, Layers, Download, Trash2, 
  Mail, Settings, LogOut, Sparkles, Cpu, ShieldCheck, Clock,
  ChevronRight, Play, UserCheck, Users, AlertCircle, Eye,
  BarChart3, Plus
} from 'lucide-react';

// --- CONFIGURACIÓN DE FIREBASE (Edwin, estas son tus llaves) ---
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

// DATOS DE PRUEBA (Para que veas la app funcionando sin APIs)
const MOCK_DATA = [
  { id: '1', prompt: "Escena de apertura: Paisaje futurista en Marte con domos de cristal.", url: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=1000", createdAt: Date.now() - 100000 },
  { id: '2', prompt: "Primer plano de un androide reparando un motor de luz.", url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000", createdAt: Date.now() - 500000 }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('generator');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const userRef = doc(db, 'artifacts', appId, 'users', u.uid);
        const unsubUser = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            // Auto-autorizamos al primer usuario para que puedas probarlo sin ir a Firebase
            const newData = { 
              email: u.email, 
              isAuthorized: true, // Edwin, lo pongo en TRUE para que entres directo
              role: 'admin', 
              createdAt: Date.now() 
            };
            setDoc(userRef, newData);
            setUserData(newData);
          }
          setUser(u);
          setLoading(false);
        });
        return () => unsubUser();
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
        <p className="text-slate-400 text-xs font-bold tracking-[0.2em] uppercase">Iniciando Creator OS...</p>
      </div>
    </div>
  );

  if (!user) return <AuthScreen />;

  return (
    <div className="flex h-screen bg-[#0B0F19] text-slate-300 font-sans overflow-hidden">
      {/* SIDEBAR PROFESIONAL */}
      <aside className="w-64 bg-[#111827] border-r border-slate-800 flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-purple-900/40">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <h1 className="font-bold text-white text-xs tracking-[0.2em]">CREATOR OS</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem 
            icon={<BarChart3 />} 
            label="Dashboard" 
            active={currentView === 'generator'} 
            onClick={() => setCurrentView('generator')}
          />
          <SidebarItem icon={<Layers />} label="Proyectos" />
          <SidebarItem icon={<Users />} label="Comunidad" />
          
          <div className="pt-4 mt-4 border-t border-slate-800/50">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-4 mb-2">Ajustes</p>
            <SidebarItem icon={<ShieldCheck />} label="Privacidad" />
            <SidebarItem icon={<Settings />} label="Configuración" />
          </div>
        </nav>

        <div className="p-4 bg-[#0f1523] border-t border-slate-800">
           <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                {user.email ? user.email[0].toUpperCase() : 'U'}
              </div>
              <div className="min-w-0 text-left">
                <p className="text-xs font-bold text-white truncate">{user.email}</p>
                <p className="text-[9px] text-purple-400 font-bold uppercase tracking-tighter">Administrador</p>
              </div>
           </div>
           <button onClick={() => signOut(auth)} className="w-full flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 hover:text-red-400 transition-colors py-3 bg-slate-900/50 rounded-xl border border-slate-800">
             <LogOut className="w-3 h-3" /> SALIR DEL SISTEMA
           </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-[#0B0F19] to-[#0B0F19]">
        <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-8 bg-[#0B0F19]/60 backdrop-blur-md">
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold tracking-widest uppercase">
             <span>Explorar</span> <ChevronRight className="w-3 h-3" /> <span className="text-white">Producción en Vivo</span>
          </div>
          <button className="bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
            <Plus className="w-3 h-3" /> NUEVO PROYECTO
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Estadísticas Rápidas */}
            <div className="grid grid-cols-4 gap-6">
              <StatCard label="Proyectos Totales" value="24" icon={<Layers className="text-blue-400"/>} />
              <StatCard label="Escenas Generadas" value="142" icon={<Wand2 className="text-purple-400"/>} />
              <StatCard label="Tiempo de Render" value="1.2s" icon={<Clock className="text-green-400"/>} />
              <StatCard label="Usuarios Activos" value="1" icon={<Users className="text-amber-400"/>} />
            </div>

            {/* Generador Simulado */}
            <div className="bg-[#111827] border border-slate-800 rounded-[2rem] p-8 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              <div className="flex gap-8">
                <div className="flex-1 space-y-6">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" /> Creador Dinámico
                  </h3>
                  <textarea 
                    className="w-full h-32 bg-[#0B0F19] border border-slate-700 rounded-2xl p-5 text-sm text-slate-300 focus:border-purple-500 outline-none resize-none transition-all"
                    placeholder="Prueba a escribir algo aquí para ver cómo funciona el editor..."
                  />
                  <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-purple-900/20 transition-all active:scale-[0.98]">
                    <Wand2 className="w-4 h-4" /> SIMULAR PRODUCCIÓN IA
                  </button>
                </div>
                <div className="w-1/3 bg-[#0B0F19] rounded-2xl border border-slate-800 border-dashed flex items-center justify-center text-center p-6">
                  <div className="text-slate-600">
                    <Eye className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-[10px] uppercase font-bold tracking-widest">Vista Previa</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid de Contenido */}
            <div className="space-y-6 text-left">
              <h3 className="text-white font-bold text-lg px-2">Producciones Recientes</h3>
              <div className="grid grid-cols-2 gap-8">
                {MOCK_DATA.map(item => (
                  <div key={item.id} className="bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden group hover:border-slate-500 transition-all shadow-xl">
                    <div className="aspect-video relative overflow-hidden">
                      <img src={item.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Preview" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                        <p className="text-white text-sm font-medium leading-relaxed italic line-clamp-2">"{item.prompt}"</p>
                      </div>
                    </div>
                    <div className="p-4 flex justify-between items-center bg-[#111827]">
                      <div className="flex gap-4">
                        <button className="text-slate-500 hover:text-white transition-colors"><Download size={18}/></button>
                        <button className="text-slate-500 hover:text-white transition-colors"><Play size={18}/></button>
                      </div>
                      <span className="text-[10px] text-slate-600 font-bold">ACTIVO</span>
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

// --- COMPONENTES AUXILIARES ---

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-lg">
      <div className="text-left">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-white">{value}</p>
      </div>
      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
        {icon}
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold tracking-wider transition-all ${active ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
    >
      {React.cloneElement(icon, { size: 16 })}
      <span className="uppercase">{label}</span>
    </button>
  );
}

function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) await signInWithEmailAndPassword(auth, email, password);
      else await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) { setError("Error: Revisa tus credenciales."); }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0B0F19] to-[#0B0F19]">
      <div className="max-w-md w-full bg-[#111827] border border-slate-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <div className="text-center mb-10">
          <Zap className="w-12 h-12 text-purple-600 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(147,51,234,0.5)]" />
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Creator OS</h1>
          <p className="text-slate-500 text-[10px] mt-2 uppercase font-bold tracking-[0.3em]">Ambiente de Producción Pro</p>
        </div>
        <form onSubmit={handleAuth} className="space-y-5 text-left">
          <input 
            type="email" 
            className="w-full bg-[#0B0F19] border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-purple-500 transition-all placeholder-slate-700" 
            placeholder="Correo del Creador" 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            className="w-full bg-[#0B0F19] border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-purple-500 transition-all placeholder-slate-700" 
            placeholder="Clave Privada" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            required 
          />
          {error && <p className="text-red-400 text-[10px] text-center font-bold bg-red-400/5 py-3 rounded-xl border border-red-400/10 uppercase tracking-widest">{error}</p>}
          <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-purple-900/30 transition-all active:scale-[0.98]">
            {isLogin ? 'ACCEDER AL SISTEMA' : 'REGISTRAR MI CUENTA'}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-8 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] hover:text-white transition-colors">
          {isLogin ? '¿No tienes acceso? Crea tu cuenta ›' : '¿Ya eres miembro? Inicia sesión ›'}
        </button>
      </div>
    </div>
  );
}