import { TimelineEditor } from 'slatejs';
import './App.css';

function App() {
  return (
    <div className="w-screen h-screen">
      <div className="w-1/2 h-40">
        <TimelineEditor scene={undefined} />
      </div>
    </div>
  );
}

export default App;
