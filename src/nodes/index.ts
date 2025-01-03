import { NodeTypes } from 'reactflow';
import WaveShaperNode from './WaveShaperNode';
import ConvolverNode from './ConvolverNode';
import OscillatorNode from './OscillatorNode';
import GainNode from './GainNode';
import { createElement } from 'react';
import DelayNode from './DelayNode';
import FilterNode from './FilterNode';
import OutputNode from './OutputNode';
import Wire from '../components/Wire';
import CompressorNode from './CompressorNode';



export const nodeTypes = 
{
    oscillator: OscillatorNode,
    gain:       GainNode,
   _output:     OutputNode, // 'output' is reserved by ReactFlow
    delay:      DelayNode,
    waveShaper: WaveShaperNode,
    convolver:  ConvolverNode,
    filter:     FilterNode,
    compressor: CompressorNode
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



export const reactEdgeTypes = { wire: Wire }