import { NodeTypes } from 'reactflow';
import OscillatorUiNode from './OscillatorUiNode';
import GainNode from './GainNode';
import DelayUiNode from './DelayUiNode';
import OutputUiNode from './OutputUiNode'
import FilterUiNode from './FilterUiNode'
import WaveShaperUiNode from './WaveShaperUiNode';



export const nodeTypes: NodeTypes = 
{
    oscillator: OscillatorUiNode,
    gain:       GainNode,
   _output:     OutputUiNode, // 'output' is reserved by ReactFlow
    delay:      DelayUiNode,
    waveShaper: WaveShaperUiNode,
    filter:     FilterUiNode
};