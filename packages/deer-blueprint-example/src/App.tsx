import { GraphEditor } from 'deer-blueprint';
import { Allotment } from 'allotment';
import '@arco-design/web-react/dist/css/arco.css';
import { DetailPanel } from './components/DetailPanel';
import { MyBlueprintPanel } from './components';

function App() {
  return (
    <div className="w-screen h-screen">
      <Allotment>
        <Allotment.Pane preferredSize="20%" minSize={150}>
          <MyBlueprintPanel />
        </Allotment.Pane>

        <Allotment vertical>
          <Allotment.Pane>
            <GraphEditor />
          </Allotment.Pane>
          <Allotment.Pane preferredSize="20%">
            <div>aaa</div>
          </Allotment.Pane>
        </Allotment>

        <Allotment.Pane preferredSize="20%">
          <DetailPanel />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}

export default App;
