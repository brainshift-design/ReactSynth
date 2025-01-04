import nodeStyles from './Node.module.css';
import { NodeProps, Position } from "reactflow";
import OutputHandle from '../components/OutputHandle';
import Button from '../components/Button';
import Node from './Node';


interface TriggerNodeState
{
    isPlaying: boolean;
}


export default class TriggerNode 
extends Node<NodeProps, TriggerNodeState>
{
    constructor(props: NodeProps)
    {
        super(props);

        this.state = { isPlaying: false };

        this.startNote = this.startNote.bind(this);
        this.stopNote  = this.stopNote .bind(this);
    }



    startNote()
    {
        this.setState({ isPlaying: true });

        if (this.props.data.parameter)
            this.props.data.parameter.setValue(true);
    }



    stopNote()
    {
        this.setState({ isPlaying: false });

        if (this.props.data.parameter)
            this.props.data.parameter.setValue(false);
    }



    renderContent()
    {
        return (
            <>
                <h1>Trigger</h1>

                <div className={nodeStyles.nodeContent}>

                    <Button 
                        onPointerDown  = {this.startNote}
                        onPointerUp    = {this.stopNote }
                        onPointerLeave = {this.stopNote }
                        style= 
                        {{
                            margin: '8px 18px 18px 18px'
                        }}>
                        ■
                    </Button>

                </div>

                <OutputHandle 
                    type       = 'source' 
                    handletype = 'control' 
                    id         = {'control-out'} 
                    position   = {Position.Right} 
                    nodeid     = {this.props.id} 
                    style      = {{ top: 'calc(50% + 7px)' }}
                />
            </>
        );
    }
}
