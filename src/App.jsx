import React, { useState } from 'react';
import { 
  Wand2, Image as ImageIcon, Video, Play, Download, 
  Layers, Loader2, Lock, FileText, Zap, LayoutTemplate, Film, 
  MoreVertical, Trash2
} from 'lucide-react';

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_api_key') || '');
  const [view, setView] = useState('dashboard'); // dashboard | settings

  const saveKey = (key) => {
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
  };

  if (!apiKey) return <ApiKeyModal onSave={saveKey} />;

  return (
    <div className="flex h-screen bg-[#0B0F19] text-slate-300 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Dashboard apiKey={apiKey} />
      </main>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="w-64 bg-[#111827] border-r border-slate-800 flex flex-col flex-shrink-0 z-20">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-purple-900/50">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
           <h1 className="font-bold text-white tracking-wide text-sm">CREATOR OS</h1>
           <span className="text-[10px] text-purple-400 font-medium">PRO EDITION</span>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">HERRAMIENTAS</div>
        <SidebarItem icon={<FileText />} label="Guion a Escena" active />
        <SidebarItem icon={<LayoutTemplate />} label="Generador Lote" />
        <SidebarItem icon={<Film />} label="Video Magic" />
      </div>

      <div className="mt-auto p-4 border-t border-slate-800 bg-[#0f1523]">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold border border-slate-700">
                A
            </div>
            <div>
                <p className="text-sm font-medium text-white">Admin</p>
                <p className="text-xs text-green-400 flex items-center gap-1">● En línea</p>
            </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, active }) {
    return (
        <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active ? 'bg-purple-600 text-white shadow-md shadow-purple-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            {React.cloneElement(icon, { className: "w-4 h-4" })} {label}
        </button>
    );
}

function Dashboard({ apiKey }) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState([]); // Historial local (temporal)
  
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
        const imgRes = await fetch('https://api.openai.com/v1/images/generations', {
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
        <header className="h-16 border-b border-slate-800 bg-[#0B0F19] flex items-center justify-between px-6 flex-shrink-0">
            <div>
                <h2 className="text-lg font-bold text-white">Centro de Comando</h2>
                <p className="text-xs text-slate-500">Proyecto: Sin título</p>
            </div>
            <button className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-2 px-3 py-1.5 rounded hover:bg-slate-800 transition-colors" onClick={() => setHistory([])}>
                <Trash2 className="w-3 h-3" /> Limpiar
            </button>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            {/* INPUT AREA */}
            <div className="lg:col-span-4 border-r border-slate-800 bg-[#0B0F19] p-6 flex flex-col gap-6 overflow-y-auto">
                <div>
                    <label className="text-sm font-semibold text-slate-200 block mb-2 flex items-center gap-2">
                        <Wand2 className="w-4 h-4 text-purple-500" /> Tu Idea (Prompt)
                    </label>
                    <textarea 
                        value={prompt} 
                        onChange={(e) => setPrompt(e.target.value)} 
                        className="w-full h-48 bg-[#111827] border border-slate-700 rounded-xl p-4 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none placeholder-slate-600 transition-all shadow-inner" 
                        placeholder="Ej: Un astronauta meditando en un jardín zen en Marte, estilo cinematográfico..." 
                    />
                </div>
                
                <div className="mt-auto">
                    <button 
                        onClick={handleGenerate} 
                        disabled={isGenerating || !prompt} 
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-white" />} 
                        {isGenerating ? 'Creando Magia...' : 'Generar Escena'}
                    </button>
                    <p className="text-[10px] text-center text-slate-500 mt-3">Usando DALL-E 3 • Costo aprox: $0.04</p>
                </div>
            </div>

            {/* RESULTS AREA */}
            <div className="lg:col-span-8 bg-[#0f1523] p-6 overflow-y-auto custom-scrollbar">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Línea de Tiempo ({history.length})</h3>
                
                <div className="space-y-4">
                    {history.map((item, idx) => (
                        <div key={item.id} className="bg-[#18212f] border border-slate-700 rounded-xl overflow-hidden flex flex-col sm:flex-row shadow-lg hover:border-slate-600 transition-colors group animate-in fade-in slide-in-from-bottom-4">
                            <div className="sm:w-64 h-48 sm:h-auto bg-black relative">
                                <img src={item.imageUrl} className="w-full h-full object-cover" alt="Generación" />
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-white font-mono border border-white/10">
                                    ESCENA #{history.length - idx}
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-bold bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">IMAGEN</span>
                                        <span className="text-[10px] text-slate-500">{new Date(item.id).toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-sm text-slate-300 line-clamp-3 italic">"{item.prompt}"</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                                    <a 
                                        href={item.imageUrl} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="text-xs flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700"
                                    >
                                        <Download className="w-3 h-3" /> Descargar HD
                                    </a>
                                    <button className="text-slate-500 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {history.length === 0 && (
                        <div className="h-96 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-800/20">
                            <Layers className="w-16 h-16 mb-4 opacity-20" />
                            <p className="font-medium">Tu espacio creativo está vacío</p>
                            <p className="text-sm mt-1">Escribe un prompt a la izquierda para empezar</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}

function ApiKeyModal({ onSave }) {
    const [k, setK] = useState('');
    return (
        <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
            <div className="bg-[#111827] p-8 rounded-2xl border border-slate-700 text-center max-w-md w-full shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto mb-6 flex items-center justify-center border border-slate-700 shadow-inner">
                    <Lock className="w-8 h-8 text-purple-500" />
                </div>
                <h2 className="text-white font-bold text-2xl mb-2">Creator OS</h2>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    Para activar el motor de Inteligencia Artificial, ingresa tu API Key de OpenAI.
                    <br/><span className="text-xs opacity-50">(Se guardará solo en este dispositivo)</span>
                </p>
                <form onSubmit={(e)=>{e.preventDefault(); onSave(k)}}>
                    <input 
                        type="password" 
                        value={k} 
                        onChange={e=>setK(e.target.value)} 
                        className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-4 py-3 text-white mb-4 focus:border-purple-500 focus:outline-none transition-colors placeholder-slate-600" 
                        placeholder="sk-..." 
                        required 
                    />
                    <button className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-purple-900/20">
                        Entrar al Estudio
                    </button>
                </form>
            </div>
        </div>
    );
}