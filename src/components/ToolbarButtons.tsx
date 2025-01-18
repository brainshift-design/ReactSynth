import { ReactElement } from 'react';
import PanelButton from './PanelButton';
import Separator from './Separator';
import { useFlowState } from '../hooks/useFlowState';

export default function ToolbarButtons(): ReactElement {
    const { createNode } = useFlowState();

    return (
        <>
            <PanelButton>
                <i className="material-icons">menu</i>
            </PanelButton>

            <Separator />

            <PanelButton onClick={() => createNode('oscillator')}>Osc</PanelButton>
            <PanelButton onClick={() => createNode('noise')}>Nois</PanelButton>
            <PanelButton onClick={() => createNode('gain')}>Gain</PanelButton>
            <PanelButton onClick={() => createNode('delay')}>Del</PanelButton>
            <PanelButton onClick={() => createNode('reverb')}>Rev</PanelButton>
            <PanelButton onClick={() => createNode('filter')}>Flt</PanelButton>
            <PanelButton onClick={() => createNode('compressor')}>Cmp</PanelButton>
            <PanelButton onClick={() => createNode('distortion')}>Dst</PanelButton>
            <PanelButton onClick={() => createNode('trigger')}>Trg</PanelButton>
            <PanelButton onClick={() => createNode('envelope')}>Env</PanelButton>
            <PanelButton onClick={() => createNode('_output')}>Out</PanelButton>
        </>
    );
}
