import React, { useState } from 'react';
import { Zap, Lock, Wand2, Loader2, Layers, Download, Trash2, MoreVertical } from 'lucide-react';

// Estilos en línea para asegurar que se vea bien SIN Tailwind externo
const styles = {
  container: { backgroundColor: '#0B0F19', minHeight: '100vh', color: '#cbd5e1', display: 'flex', fontFamily: 'sans-serif' },
  sidebar: { width: '260px', backgroundColor: '#111827', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column' },
  header: { height: '64px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', padding: '0 24px' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  loginBox: { backgroundColor: '#111827', padding: '40px', borderRadius: '16px', border: '1px solid #334155', textAlign: 'center', maxWidth: '400px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' },
  button: { backgroundColor: '#9333ea', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%', marginTop: '16px' },
  input: { width: '100%', padding: '12px', backgroundColor: '#0B0F19', border: '1px solid #334155', borderRadius: '8px', color: 'white', marginBottom: '16px', boxSizing: 'border-box' }
};

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_api_key') || '');

  const saveKey = (key) => {
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
  };

  if (!apiKey) {
    return (
      <div style={{...styles.container, alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
        <div style={styles.loginBox}>
          <div style={{width: '64px', height: '64px', backgroundColor: '#1e293b', borderRadius: '50%', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Lock size={32} color="#a855f7" />
          </div>
          <h2 style={{color: 'white', marginBottom: '8px', fontSize: '24px'}}>Creator OS</h2>
          <p style={{fontSize: '14px', color: '#94a3b8', marginBottom: '24px'}}>Ingresa tu API Key de OpenAI para activar el motor de producción.</p>
          <form onSubmit={(e) => { e.preventDefault(); saveKey(e.target.elements.key.value); }}>
            <input name="key" type="password" style={styles.input} placeholder="sk-..." required />
            <button type="submit" style={styles.button}>Entrar al Estudio</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.header}>
          <Zap size={20} color="#a855f7" style={{marginRight: '12px'}} />
          <h1 style={{fontSize: '14px', fontWeight: 'bold', color: 'white', letterSpacing: '1px'}}>CREATOR OS</h1>
        </div>
        <div style={{padding: '24px'}}>
          <div style={{fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '16px'}}>Herramientas</div>
          <button style={{...styles.button, display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0'}}>
             <Wand2 size={16} /> Generador
          </button>
        </div>
        <div style={{marginTop: 'auto', padding: '16px', borderTop: '1px solid #1e293b', textAlign: 'center'}}>
           <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{background: 'none', border: 'none', color: '#64748b', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline'}}>Cerrar sesión</button>
        </div>
      </aside>

      <main style={styles.main}>
        <header style={{...styles.header, justifyContent: 'space-between', backgroundColor: '#0B0F19'}}>
          <h2 style={{fontSize: '18px', fontWeight: 'bold', color: 'white'}}>Panel de Control</h2>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <div style={{width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%'}}></div>
            <span style={{fontSize: '10px', color: '#64748b', fontWeight: 'bold'}}>ONLINE</span>
          </div>
        </header>

        <div style={{padding: '40px', flex: 1, overflowY: 'auto'}}>
          <div style={{maxWidth: '800px', margin: '0 auto'}}>
            <div style={{border: '2px dashed #1e293b', borderRadius: '24px', padding: '60px', textAlign: 'center', backgroundColor: 'rgba(17, 24, 39, 0.4)'}}>
               <Layers size={48} color="#1e293b" style={{marginBottom: '20px'}} />
               <h3 style={{color: 'white', fontSize: '24px', marginBottom: '8px'}}>¡Todo listo para crear!</h3>
               <p style={{color: '#64748b', maxWidth: '400px', margin: '0 auto 32px'}}>Tu estudio ha sido configurado con éxito. Empieza a generar escenas ahora.</p>
               <button style={{...styles.button, width: 'auto', padding: '12px 32px'}}>Nueva Escena</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}