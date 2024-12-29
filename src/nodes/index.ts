import { NodeTypes } from 'reactflow';
import WaveShaperNode from './WaveShaperNode';
import OscillatorNode from './OscillatorNode';
import GainNode from './GainNode';
import { createElement } from 'react';
import DelayNode from './DelayNode';
import FilterNode from './FilterNode';
import OutputNode from './OutputNode';



export const nodeTypes = 
{
    oscillator: OscillatorNode,
    gain:       GainNode,
   _output:     OutputNode, // 'output' is reserved by ReactFlow
    delay:      DelayNode,
    waveShaper: WaveShaperNode,
    filter:     FilterNode
};



export const reactNodeTypes: NodeTypes = Object.fromEntries(
    Object.entries(nodeTypes).map(([type, NodeClass]) =>
    [
        type,
        (props) =>
        {
            const node = NodeClass.createReactFlowNode();
            return createElement(NodeClass as any, {...props, node });
        }
    ])
);