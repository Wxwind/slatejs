import { NODE_PIN_STANDARD_EXEC_INPUT } from '@/constants';
import { BPNode } from '@/interface';
import { GraphInfo } from '@/store/graph';
import { isNil } from '@/util';
import { CompilerContext } from './interface';

export class Compiler {
  static compile = (graph: GraphInfo) => {
    const { nodes, connections } = graph;
    const startNode = graph.nodes.find((a) => a.type === 'begin');
    if (isNil(startNode)) {
      console.error("Couldn't find start node on graph");
      return;
    }

    const nodeMap = nodes.reduce((acc, now) => {
      acc.set(now.id, now);
      return acc;
    }, new Map<string, BPNode>());

    const getVarName = (pinName: string, nodeId: string) => `__${nodeId}_${pinName}__`;

    const getInputValue = (pinName: string, nodeId: string) => {
      const conns = connections.filter((conn) => conn.toNodeId === nodeId && conn.toPinName === pinName);

      if (conns.length > 1) {
        console.warn('input pin has multible connections.');
      }
      const node = nodeMap.get(nodeId);
      if (isNil(node)) {
        throw new Error('<node not exist>');
      }
      const inputs = node.inputs;
      const pin = inputs.find((p) => p.name === pinName);
      if (isNil(pin)) throw new Error('<pin not exist>');

      if (pin.type === 'data') {
        if (conns.length === 0) return pin.value?.toString() || pin.defaultValue.toString();
        else {
          const otherPin = nodeMap.get(conns[0].fromNodeId)?.outputs.find((a) => a.name === conns[0].fromPinName);
          if (!otherPin) throw new Error('<connected pin not exist>');
          return getVarName(otherPin.name, nodeId);
        }
      }

      throw new Error('<need data pin>');
    };

    const getOutputExec = (pinName: string, nodeId: string, context: CompilerContext) => {
      const conns = connections.filter((conn) => conn.fromNodeId === nodeId && conn.fromPinName === pinName);

      const node = nodeMap.get(nodeId);
      if (isNil(node)) {
        throw new Error('<node not exist>');
      }
      const outputs = node.outputs;
      const pin = outputs.find((p) => p.name === pinName);
      if (isNil(pin)) throw new Error('<pin not exist>');

      if (pin.type === 'exec') {
        if (conns.length === 0) return '';
        else {
          const otherNode = nodeMap.get(conns[0].fromNodeId);
          if (!otherNode) throw new Error('<connected node not exist>');
          const otherPin = otherNode?.inputs.find((a) => a.name === conns[0].fromPinName);
          if (!otherPin) throw new Error('<connected pin not exist>');
          if (otherPin.name === NODE_PIN_STANDARD_EXEC_INPUT) {
            context.currentNode = otherNode;
            return otherNode.output(context);
          } else {
            //
          }
        }
      }

      throw new Error('<need ecex pin>');
    };

    const context: CompilerContext = {
      currentNode: startNode,
      getInputValue: (name) => getInputValue(name, context.currentNode.id),
      getOutputExec: (name) => getOutputExec(name, context.currentNode.id, context),
      getOutputVarName: (name) => getVarName(name, context.currentNode.id),
    };

    const text = startNode.output(context);

    return text;
  };
}
