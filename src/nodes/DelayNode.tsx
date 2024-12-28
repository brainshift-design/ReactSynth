import { audioContext } from "../audio/audio";
import { createId } from "../util";
import AudioBaseNode from "./AudioBaseNode";
import NumberParameter from "./parameters/NumberParameter";
import Input from "./sockets/Input";
import Output from "./sockets/Output";



type DelayAudioNode = globalThis.DelayNode;



export default class DelayNode extends AudioBaseNode
{
    constructor(id: string)
    {
        super(id, 'delay');

        this.setAudioNode(audioContext?.createDelay()!);

        this.addInput(new Input('in', 'audio'));
        this.addOutput(new Output('out', 'audio'));
        this.addParameter(new NumberParameter('delayTime', 1, 0, 10, ''));
    }



    static override create()
    {
        return new DelayNode(createId());
    }



    eval(): void
    {
        const audioNode = this.audioNode as DelayAudioNode;

        audioNode.delayTime.value = this.parameters.delayTime.value;
    }
}



// export default function DelayNode({ id, data, selected }: DelayNodeProps)
// {
//     const { updateNode } = useFlowState();
//     const { delayTime: delayTime } = data;


//     useEffect(() =>
//     {
//         // constructor
//         createAudioContext();
  
//         const audioNode = audioContext?.createDelay();

//         if (audioNode)
//         {
//             audioNode.delayTime.value = delayTime;

//             audioNodes.set(id, audioNode);
//         }


//         // destructor
//         return () =>
//         {
//             const audioNode = audioNodes.get(id) as DelayAudioNode;
            
//             if (audioNode)
//             {
//                 audioNode.disconnect();

//                 audioNodes.delete(id);
//             }
//         };
//     },
//     []);


//     return (
//         <div 
//             className = {styles.node}
//             style     = {{ outline: selected ? 'var(--node-outline-style)' : 'none' }}
//             >

//             <Handle type='target' position={Position.Left} />

//             <h1>Delay</h1>

//             <div className={styles.nodeContent}>

//                 <Range 
//                     label    = 'Time'
//                     min      = {0}
//                     max      = {1000}
//                     value    = {delayTime * 1000} 
//                     suffix   = 'ms'
//                     onChange = {(e) => updateNode(id, { delayTime: Number(e.target.value) / 1000 })}
//                     />

//             </div>

//             <Handle type='source' position={Position.Right} />

//         </div>
//     );
// }



// DelayUiNode.create = function()
// {
//     const node: Node =
//     {
//         id:    createId(),
//         type: 'delay',
//         data:     
//         { 
//             delayTime: 1 
//         },
//         position: { x: 0, y: 0 }
//     };
   
//     return node;
// };