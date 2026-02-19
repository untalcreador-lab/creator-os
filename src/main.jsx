import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML = '<div style="color:red; padding:20px;">Error Crítico: No encuentro el div root</div>';
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  } catch (error) {
    document.body.innerHTML = '<div style="color:white; padding:20px;"><h1>Error de Inicio</h1><pre>' + error.message + '</pre></div>';
  }
}
