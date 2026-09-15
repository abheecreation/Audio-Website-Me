// Safeguard for window.fetch in iframe sandboxes
try {
  const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
  if (!desc || !desc.set) {
    let f = window.fetch ? window.fetch.bind(window) : undefined;
    Object.defineProperty(window, 'fetch', {
      get: () => f,
      set: (n) => {
        f = n;
      },
      configurable: true,
      enumerable: true,
    });
  }
} catch {
  // Ignore if restricted
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
