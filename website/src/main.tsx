import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// !!!IMPORTANT register editor
import {} from '@/components/editor';
import './index.css';
import '@arco-design/web-react/dist/css/arco.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
