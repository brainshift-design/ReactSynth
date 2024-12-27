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

            <Button onClick={() => createNode('oscillator')}>Osc</Button>
            <Button onClick={() => createNode('gain'      )}>Gain</Button>
            <Button onClick={() => createNode('delay'     )}>Del</Button>
            <Button onClick={() => createNode('filter'    )}>Flt</Button>
            <Button onClick={() => createNode('waveShaper')}>Shp</Button>
            <Button onClick={() => createNode('_output'   )}>Out</Button>
        </>
    );
}