import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';
import { getFirestore, collection, addDoc, query, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { 
  Wand2, Image as ImageIcon, Mic, Video, LogOut, Play, Download, 
  Layers, Loader2, Lock, FileText, Zap, LayoutTemplate, Film
} from 'lucide-react';

// --- CONFIGURACIÓN ---
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_DOMINIO.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_BUCKET.appspot.com",
  messagingSenderId: "123456789",
  appId: "APP_ID"
};

// Inicialización segura para evitar crashes en el editor
let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.log("Esperando configuración real de Firebase...");
}

export default function App() {
  const [user, setUser] = useState(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_api_key') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si auth existe, intentamos login anónimo
    if (auth) {
        signInAnonymously(auth)
          .then(() => console.log("Usuario anónimo conectado"))
          .catch((err) => console.log("Error auth:", err));
          
        return onAuthStateChanged(auth, u => { 
            setUser(u); 
            setLoading(false); 
        });
    }
    setLoading(false);
  }, []);

  const saveKey = (key) => {
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
  };

  if (loading) return <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-white">Cargando Creator OS...</div>;

  return (
    <div className="flex h-screen bg-[#0B0F19] text-slate-300 font-sans overflow-hidden">
      <Sidebar user={user} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {!apiKey ? <ApiKeyModal onSave={saveKey} /> : <Dashboard user={user} apiKey={apiKey} />}
      </main>
    </div>
  );
}

function Sidebar({ user }) {
  return (
    <aside className="w-64 bg-[#111827] border-r border-slate-800 flex flex-col flex-shrink-0 z-20">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div><h1 className="font-bold text-white text-sm">CREATOR OS</h1></div>
      </div>
      <div className="p-4 space-y-1">
        <SidebarItem icon={<FileText />} label="Desde Guion" active />
        <SidebarItem icon={<LayoutTemplate />} label="Por Lote" />
        <SidebarItem icon={<Film />} label="Video AI" />
      </div>
      <div className="mt-auto p-4 border-t border-slate-800">
        <div className="text-xs text-slate-500">v2.0.0 (Pro)</div>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, active }) {
    return (
        <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${active ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            {React.cloneElement(icon, { className: "w-4 h-4" })} {label}
        </button>
    );
}

function Dashboard({ user, apiKey }) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState([]);
  
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
        const imgRes = await fetch('[https://api.openai.com/v1/images/generations](https://api.openai.com/v1/images/generations)', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({ model: "dall-e-3", prompt: prompt, n: 1, size: "1024x1024" })
        });
        const imgData = await imgRes.json();
        if (imgData.error) throw new Error(imgData.error.message);
        
        const newItem = { id: Date.now(), prompt, imageUrl: imgData.data[0].url };
        setHistory([newItem, ...history]);
    } catch (e) { alert("Error: " + e.message); } 
    finally { setIsGenerating(false); }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 border-b border-slate-800 bg-[#0B0F19] flex items-center justify-between px-6">
            <h2 className="text-lg font-bold text-white">Espacio de Trabajo</h2>
        </header>
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
            <div className="col-span-4 border-r border-slate-800 bg-[#0B0F19] p-5 flex flex-col gap-6">
                <div>
                    <label className="text-sm font-semibold text-slate-200 block mb-2">Guion / Prompt</label>
                    <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full h-48 bg-[#111827] border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none" placeholder="Describe la escena..." />
                </div>
                <button onClick={handleGenerate} disabled={isGenerating || !prompt} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                    {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 />} {isGenerating ? 'Generando...' : 'Generar'}
                </button>
            </div>
            <div className="col-span-8 bg-[#0f1523] p-6 overflow-y-auto space-y-4">
                {history.map((item) => (
                    <div key={item.id} className="bg-[#18212f] border border-slate-700 rounded-xl overflow-hidden flex shadow-lg">
                        <img src={item.imageUrl} className="w-48 h-32 object-cover bg-black" />
                        <div className="p-4 flex-1">
                            <p className="text-xs text-slate-300 line-clamp-3">"{item.prompt}"</p>
                            <div className="mt-2 flex gap-2"><a href={item.imageUrl} target="_blank" className="text-purple-400 text-xs hover:underline">Descargar</a></div>
                        </div>
                    </div>
                ))}
                {history.length === 0 && <div className="text-center text-slate-500 mt-20">Sin generaciones aún</div>}
            </div>
        </div>
    </div>
  );
}

function ApiKeyModal({ onSave }) {
    const [k, setK] = useState('');
    return (
        <div className="flex items-center justify-center h-full">
            <div className="bg-[#111827] p-8 rounded-2xl border border-slate-700 text-center max-w-md">
                <Lock className="w-8 h-8 text-purple-500 mx-auto mb-4" />
                <h2 className="text-white font-bold text-xl mb-2">Conectar API</h2>
                <p className="text-slate-400 text-sm mb-4">Ingresa tu API Key de OpenAI para empezar.</p>
                <form onSubmit={(e)=>{e.preventDefault(); onSave(k)}}>
                    <input type="password" value={k} onChange={e=>setK(e.target.value)} className="w-full bg-[#0B0F19] border border-slate-700 rounded p-2 text-white mb-4" placeholder="sk-..." required />
                    <button className="w-full bg-purple-600 text-white py-2 rounded font-bold">Guardar</button>
                </form>
            </div>
        </div>
    );
}
