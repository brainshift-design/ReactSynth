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

            <Button onClick={() => createNode('oscillator')}>OSC</Button>
            <Button onClick={() => createNode('gain'      )}>GAIN</Button>
            <Button onClick={() => createNode('delay'     )}>DEL</Button>
            <Button onClick={() => createNode('filter'    )}>FLT</Button>
            <Button onClick={() => createNode('waveShaper')}>SHP</Button>
            <Button onClick={() => createNode('_output'   )}>OUT</Button>
        </>
    );
}