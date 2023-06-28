import { useState } from 'react';
import './App.css';
import { add } from 'slate';

function App() {
  return <>{add(1, 2)}</>;
}

export default App;
