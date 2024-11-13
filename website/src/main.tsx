import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// !!!IMPORTANT register editor
import '@/components/editor';
import './index.css';
import '@arco-design/web-react/dist/css/arco.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <DndProvider backend={HTML5Backend}>
    <App />
  </DndProvider>
);
