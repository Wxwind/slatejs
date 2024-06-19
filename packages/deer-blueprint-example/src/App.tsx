import { FlowEditor } from 'deer-blueprint';
import { Allotment } from 'allotment';

function App() {
  return (
    <div className="w-screen h-screen">
      <Allotment>
        <Allotment.Pane preferredSize="20%" minSize={250}>
          <div className="bg-gray-700 h-full"></div>
        </Allotment.Pane>

        <Allotment vertical>
          <Allotment.Pane>
            <FlowEditor />
          </Allotment.Pane>
          <Allotment.Pane preferredSize="20%">
            <div>aaa</div>
          </Allotment.Pane>
        </Allotment>
      </Allotment>
    </div>
  );
}

export default App;
