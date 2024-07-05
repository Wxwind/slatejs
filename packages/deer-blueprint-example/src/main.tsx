import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'allotment/dist/style.css';

document.body.setAttribute('arco-theme', 'dark');

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
