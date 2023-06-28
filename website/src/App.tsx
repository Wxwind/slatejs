import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { add } from 'slate';

function App() {
  const [count, setCount] = useState(0);

  return <>{add(1, 2)}</>;
}

export default App;
