// apps/web/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import process from 'process';
console.log('main.tsx is executing');
window.process = process; // Make process available globally
// Make sure the root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
  const body = document.body;
  const div = document.createElement('div');
  div.id = 'root';
  body.appendChild(div);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
if (typeof global === 'undefined') {
  var global = window as any;
}
