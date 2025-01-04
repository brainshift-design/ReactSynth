import { NodeTypes } from 'reactflow';
import OscillatorNode from './OscillatorNode';
import GainNode from './GainNode';
import { createElement } from 'react';
import DelayNode from './DelayNode';
import FilterNode from './FilterNode';
import OutputNode from './OutputNode';
import Wire from '../components/Wire';
import CompressorNode from './CompressorNode';
import ReverbNode from './ReverbNode';
import DistortionNode from './DistortionNode';
import NoiseNode from './NoiseNode';
import TriggerNode from './TriggerNode';



export const nodeTypes = 
{
    oscillator: OscillatorNode,
    noise:      NoiseNode,
    gain:       GainNode,
   _output:     OutputNode, // 'output' is reserved by ReactFlow
    delay:      DelayNode,
    distortion: DistortionNode,
    reverb:     ReverbNode,
    filter:     FilterNode,
    compressor: CompressorNode,
    trigger:    TriggerNode
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