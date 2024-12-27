import { NodeTypes } from 'reactflow';
import OscillatorUiNode from './OscillatorUiNode';
import GainUiNode from './GainUiNode';
import OutputUiNode from './OutputUiNode'



export const nodeTypes: NodeTypes = 
{
    oscillator: OscillatorUiNode,
    gain:       GainUiNode,
   _output:     OutputUiNode // 'output' is reserved by ReactFlow
};