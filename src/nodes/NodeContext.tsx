import { createContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';
import { Edge, Node } from 'reactflow';
import { createNode } from './util';



interface NodeContextProps
{
    nodes:    Node[];
    setNodes: Dispatch<SetStateAction<Node[]>>;
    
    edges:    Edge[];
    setEdges: Dispatch<SetStateAction<Edge[]>>;
}



export const NodeContext = createContext<NodeContextProps | undefined>(undefined);



export const NodeProvider = ({ children }: { children: ReactNode }) =>
{
    const defaultNodes = [createNode('_output')];

    const [nodes, setNodes] = useState<Node[]>(defaultNodes);
    const [edges, setEdges] = useState<Edge[]>([]);

    return (
        <NodeContext.Provider value={{ nodes, setNodes, edges, setEdges }}>
            {children}
        </NodeContext.Provider>
    );
};



export const useNodeContext = () =>
{
    const context = createContext(NodeContext);

    if (context === undefined)
        throw new Error('useNodes must be used within a NodeProvider');

    return context;
};