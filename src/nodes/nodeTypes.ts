import { NodeTypes } from 'reactflow';
import OscillatorUiNode from './OscillatorUiNode';
import GainUiNode from './GainUiNode';
import DelayUiNode from './DelayUiNode';
import OutputUiNode from './OutputUiNode'
import FilterUiNode from './FilterUiNode'



export const nodeTypes: NodeTypes = 
{
    oscillator: OscillatorUiNode,
    gain:       GainUiNode,
   _output:     OutputUiNode, // 'output' is reserved by ReactFlow
    delay:      DelayUiNode,
    filter:     FilterUiNode
};