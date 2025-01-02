// import nodeStyles from './Node.module.css';
// import { Node as ReactFlowNode, Position } from 'reactflow';
// import { audioContext } from '../audio/audio';
// import { createImpulse as createConvolverImpulse } from './util';
// import { NodeProps } from './Node';
// import NumberKnob from '../components/NumberKnob';
// import AudioNode from './AudioNode';
// import InputHandle from '../components/InputHandle';
// import OutputHandle from '../components/OutputHandle';
// import BooleanToggle from '../components/BooleanToggle';



// interface ConvolverNodeProps extends NodeProps
// {
//     data: 
//     {
//         amount:    number;
//         normalize: boolean;
//     }
// }



// export default class ConvolverNode extends AudioNode<ConvolverNodeProps>
// {
//     protected createAudioNode()
//     {
//         return audioContext?.createConvolver() as globalThis.AudioNode;
//     }



//     protected override initAudioNode()
//     {
//         const { data: { normalize } } = this.props;

//         const audioNode = this.audioNode as globalThis.ConvolverNode;

//         if (audioNode)
//             audioNode.normalize = normalize;
//     }



//     static override createReactFlowNode(): ReactFlowNode
//     {
//         return { 
//             ...super.createReactFlowNode(),
//             data:     
//             { 
//                 amount:    1,
//                 normalize: false
//             },
//         };
//     }
    
    
    
//     renderContent()
//     {
//         const { data: { amount, normalize } } = this.props;


//         return (
//             <>
//                 <InputHandle 
//                     type     = 'target' 
//                     position = {Position.Left}
//                     id       = {'audio-in'} 
//                     nodeid   = {this.props.id} 
//                 />

//                 <h1>Convolver</h1>

//                 <div className = {nodeStyles.nodeContent}>

//                     <NumberKnob 
//                         label      = 'Amt'
//                         min        = {1}
//                         max        = {100}
//                         value      = {amount}
//                         ticks      = {11}
//                         onChange   = {(e) => this.update(
//                             { 
//                                 amount:    Number(e.target.value),
//                                 buffer:    createConvolverImpulse(Number(e.target.value))
//                             })}
//                         knobColor  = 'var(--color-node-highlight)'
//                         valueColor = 'var(--color-node-highlight-value)'
//                     />

//                     <BooleanToggle
//                         label    = 'Norm'
//                         value    = {normalize}
//                         onChange = {(e) => this.update(
//                             { 
//                                 normalize: e.target.value
//                             })}
//                     />

//                 </div>

//                 <OutputHandle 
//                     type     = 'source' 
//                     position = {Position.Right} 
//                     id       = {'audio-in'} 
//                     nodeid   = {this.props.id} 
//                 />
//             </>
//         );
//     }
// }