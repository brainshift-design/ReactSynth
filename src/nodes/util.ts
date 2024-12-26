import { Node } from 'reactflow';
import { createId } from '../util';



export function createNode(type: string)
{
    const node: Node =
    {
        id:       createId(),
        type,
        position: { x: 0, y: 0 },
        data:     {}
    };


    switch (type)
    {
        case 'oscillator':  node.data      = { frequency: 440, type: 'sine' }; break;
        case 'gain':        node.data      = { gain: 1 };                      break;
        case 'outputNode': node.deletable = false;                            break;
    }

    
    return node;
}
