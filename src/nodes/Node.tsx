import nodeStyles from './Node.module.css';
import { Component } from "react";
import { ClassContext, ClassContextProps } from "../ClassContext";
import { Node as ReactFlowNode } from "reactflow";
import { createId } from "../util";
import { getTypeName } from "./util";



export interface NodeProps<D = Record<string, unknown>> 
{
    id:       string;
    selected: boolean;
    data:     D;
}



export default abstract class Node<T extends NodeProps = NodeProps, S = Record<string, unknown>> 
extends Component<T, S>
{
    static  contextType = ClassContext;
    declare context: ClassContextProps;

    

    protected abstract renderContent(): JSX.Element;



    get id  () { return this.props.id; }
    get type() { return getTypeName(this.constructor); }
    get data() { return this.props.data; }



    static createReactFlowNode(): ReactFlowNode 
    {
        return {
            id:       createId(),
            type:     getTypeName(this),
            data:     {},
            position: { x: 0, y: 0 }
        };
    }
    
    

    update(data: Partial<T['data']>)
    {
        this.context.setNodes(nodes =>
            nodes.map(node =>
                node.id == this.props.id
                    ? { ...node, data: { ...node.data, ...data } }
                    : node
            )
        );
    }



    render()
    {
        const { selected } = this.props;
        
        return (
            <div 
                className = {nodeStyles.node}
                style     = {{ outline: selected ? 'var(--node-selected-style)' : 'none' }}
                >

                { this.renderContent() }

            </div>
        );
    }
}