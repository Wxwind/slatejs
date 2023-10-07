import './App.css';
import ReactTimeline from './Timeline';
import { rows } from './testData';

function App() {
  return <ReactTimeline time={0} model={{ rows }} />;
}

export default App;
