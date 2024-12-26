import { ReactElement } from 'react';
import Button from './Button';
import Separator from './Separator';
import { useFlowState } from '../hooks/useFlowState';
import { createNode } from '../nodes/util';



export default function ToolbarButtons(): ReactElement
{
    const { addNode } = useFlowState();


    return (
        <>
            <Button>
                <i className='material-icons'>menu</i>
            </Button>

            <Separator />            

            <Button onClick={() => addNode(createNode('oscillator'))}>Osc</Button>
            <Button onClick={() => addNode(createNode('gain'      ))}>Gain</Button>
        </>
    );
}