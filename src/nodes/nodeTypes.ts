// import OscillatorUiNode from './OscillatorUiNode';
// import GainUiNode from './GainUiNode';
import DelayNode from './DelayNode';
import Node from './Node';
// import OutputUiNode from './OutputUiNode'
// import FilterUiNode from './FilterUiNode'
// import WaveShaperUiNode from './WaveShaperUiNode';



interface NodeType
{
    create(): Node;
}



export const nodeTypes: Record<string, NodeType> =
{
//     oscillator: OscillatorUiNode,
//     gain:       GainUiNode,
//    _output:     OutputUiNode, // 'output' is reserved by ReactFlow
    delay:      DelayNode,
    // waveShaper: WaveShaperUiNode,
    // filter:     FilterUiNode
};