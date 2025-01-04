import { ReactElement } from 'react';
import Button from './Button';
import Separator from './Separator';
import { useFlowState } from '../hooks/useFlowState';



export default function ToolbarButtons(): ReactElement
{
    const { createNode } = useFlowState();

    return (
        <>
            <Button>
                <i className='material-icons'>menu</i>
            </Button>

            <Separator />            

            <Button onClick={() => createNode('envelope'  )}>Env</Button>
            <Button onClick={() => createNode('oscillator')}>Osc</Button>
            <Button onClick={() => createNode('noise'     )}>Nois</Button>
            <Button onClick={() => createNode('gain'      )}>Gain</Button>
            <Button onClick={() => createNode('delay'     )}>Del</Button>
            <Button onClick={() => createNode('reverb'    )}>Rev</Button>
            <Button onClick={() => createNode('filter'    )}>Flt</Button>
            <Button onClick={() => createNode('compressor')}>Cmp</Button>
            <Button onClick={() => createNode('distortion')}>Dst</Button>
            <Button onClick={() => createNode('trigger'   )}>Trg</Button>
            <Button onClick={() => createNode('_output'   )}>Out</Button>
        </>
    );
}