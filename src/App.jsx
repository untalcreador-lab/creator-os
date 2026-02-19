import React, { useState } from 'react';
import { Zap, Lock, Wand2, Loader2, Layers, Download, Trash2, MoreVertical } from 'lucide-react';

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_api_key') || '');

  const saveKey = (key) => {
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
  };

  // 1. Pantalla de Login (Si no hay API Key)
  if (!apiKey) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
        <div className="bg-[#111827] p-8 rounded-2xl border border-slate-700 text-center max-w-md w-full shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
          <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto mb-6 flex items-center justify-center border border-slate-700">
            <Lock className="w-8 h-8 text-purple-500" />
          </div>
          <h2 className="text-white font-bold text-2xl mb-2">Creator OS</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Ingresa tu API Key de OpenAI para activar el motor de IA.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); saveKey(e.target.elements.key.value); }}>
            <input 
              name="key"
              type="password" 
              className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-4 py-3 text-white mb-4 focus:border-purple-500 outline-none transition-all" 
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

  // 2. Pantalla Principal (Si ya hay API Key)
  return (
    <div className="flex h-screen bg-[#0B0F19] text-slate-300 font-sans overflow-hidden">
      {/* Sidebar Simple */}
      <aside className="w-64 bg-[#111827] border-r border-slate-800 flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Zap className="w-5 h-5 text-purple-500 mr-3" />
          <h1 className="font-bold text-white text-sm">CREATOR OS</h1>
        </div>
        <div className="p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-purple-600 text-white">
            <Wand2 className="w-4 h-4" /> Generador
          </button>
        </div>
        <div className="mt-auto p-4 border-t border-slate-800">
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="text-xs text-slate-500 hover:text-white underline"
          >
            Cerrar sesión / Cambiar Key
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 flex items-center px-8">
          <h2 className="text-lg font-bold text-white">Panel de Control</h2>
        </header>
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-[#111827] p-8 rounded-3xl border border-slate-800 border-dashed flex flex-col items-center justify-center text-center">
               <Layers className="w-16 h-16 text-slate-800 mb-4" />
               <h3 className="text-xl font-bold text-white mb-2">¡Sistema en Línea!</h3>
               <p className="text-slate-500 max-w-sm">
                 Has configurado correctamente el entorno. Ahora puedes empezar a generar escenas usando tu crédito de OpenAI.
               </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}