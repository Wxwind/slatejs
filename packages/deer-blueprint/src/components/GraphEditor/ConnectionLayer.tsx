import { TempConnection, useGraphStore } from '@/store';
import { Layer } from 'react-konva';
import { Connection } from './Connection';
import { calcInputPinPos, calcOutputPinPos } from '@/constants';
import { useGetPointerPos } from '@/hooks';
import { BPConnection, BPPinDirection } from '@/interface';

export function ConnectionLayer() {
  const connections = useGraphStore((state) => state.connections);
  const tempConnection = useGraphStore((state) => state.tempConnection);
  const nodeMap = useGraphStore((state) => state.nodeMap);

  const pointerPos = useGetPointerPos();

  const getTempConnectionFromPinPos = (tempConnection: TempConnection) => {
    const nodePos = nodeMap[tempConnection.fromNodeId]?.position || { x: 0, y: 0 };
    const pinPos =
      tempConnection.fromPinDirection === 'out'
        ? calcOutputPinPos(tempConnection.fromNodeId, tempConnection.fromPin.name)
        : calcInputPinPos(tempConnection.fromNodeId, tempConnection.fromPin.name);
    return { x: nodePos.x + pinPos.x, y: nodePos.y + pinPos.y };
  };

  const getConnectionPinPos = (conn: BPConnection, dir: BPPinDirection) => {
    const nodePos = nodeMap[conn.fromNodeId]?.position || { x: 0, y: 0 };
    const pinPos =
      dir === 'out'
        ? calcOutputPinPos(conn.fromNodeId, conn.fromPinName)
        : calcInputPinPos(conn.fromNodeId, conn.fromPinName);
    return { x: nodePos.x + pinPos.x, y: nodePos.y + pinPos.y };
  };

  return (
    <Layer>
      {connections.map((conn) => {
        return (
          <Connection
            key={conn.id}
            from={getConnectionPinPos(conn, 'out')}
            to={getConnectionPinPos(conn, 'in')}
            highlight={false}
            fromDirection="out"
          />
        );
      })}
      {tempConnection ? (
        <Connection
          from={getTempConnectionFromPinPos(tempConnection)}
          to={pointerPos}
          fromDirection={tempConnection.fromPinDirection}
        />
      ) : null}
    </Layer>
  );
}
