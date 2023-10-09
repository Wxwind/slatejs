import { CutScene, TimelineEditor } from 'slatejs';
import './App.css';
import { useState } from 'react';

function App() {
  const [scene, setScene] = useState(new CutScene());
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-1/2 h-40 relative">
        <TimelineEditor cutScene={scene} />
      </div>
    </div>
  );
}

export default App;
