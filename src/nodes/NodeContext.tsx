import { createContext, ReactNode, useState, Dispatch, SetStateAction, useContext } from 'react';
import { Edge, Node } from 'reactflow';



interface NodeContextProps
{
    nodes:        Node[];
    setNodes:     Dispatch<SetStateAction<Node[]>>;
 
    edges:        Edge[];
    setEdges:     Dispatch<SetStateAction<Edge[]>>;
}



export const NodeContext = createContext<NodeContextProps | undefined>(undefined);



export const NodeProvider = ({ children }: { children: ReactNode }) =>
{
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    return (
        <NodeContext.Provider value={{ nodes, setNodes, edges, setEdges }}>
            {children}
        </NodeContext.Provider>
    );
};



export const useNodeContext = () =>
{
    const nodeContext = useContext(NodeContext);

    if (nodeContext === undefined)
        throw new Error('useNodeContext must be used within a NodeProvider');

    return nodeContext;
};