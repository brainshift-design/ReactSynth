import nodeStyles from './Node.module.css';
import { Component } from "react";
import { ClassContext, ClassContextProps } from "./ClassContext";
import { Node as ReactFlowNode } from "reactflow";
import { createId } from "../util";
import { getTypeName } from "./util";


export interface NodeProps 
{
    id:       string;
    selected: boolean;
    data:     any;
}



export default abstract class Node<T extends NodeProps = NodeProps> 
extends Component<T>
{
    static  contextType = ClassContext;
    declare context: ClassContextProps;

    
    // subscribers: Set<() => void> = new Set();

    // subscribe(callback: () => void)
    // {
    //     this.subscribers.add(callback);
    //     return () => this.subscribers.delete(callback);
    // }

    // notify()
    // {
    //     this.subscribers.forEach(callback => callback());
    // }



    protected abstract renderContent(): JSX.Element;



    static createReactFlowNode(): ReactFlowNode 
    {
        return {
            id:       createId(),
            type:     getTypeName(this),
            data:     {},
            position: { x: 0, y: 0 }
        };
    }
    
    

    update(data: any)
    {
        this.context.setNodes(nodes =>
            nodes.map(node =>
                node.id == this.props.id
                    ? { ...node, data: { ...node.data, ...data } }
                    : node
            )
        );

        //this.notify();
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