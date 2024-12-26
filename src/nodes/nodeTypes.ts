import { NodeTypes } from 'reactflow';
import OscillatorNode from './OscillatorNode';
import GainNode from './GainNode';
import OutputNode from './OutputNode'



export const nodeTypes: NodeTypes = 
{
    oscillator:  OscillatorNode,
    gain:        GainNode,
   _output:      OutputNode // 'output' is reserved by ReactFlow
};