import { createContext, ReactNode, useState, Dispatch, SetStateAction, useContext } from 'react';
import { Edge, Node } from 'reactflow';
import { updateAudioNode } from '../audio/audio';



export interface NodeContextProps
{
    nodes:        Node[];
    setNodes:     Dispatch<SetStateAction<Node[]>>;
 
    edges:        Edge[];
    setEdges:     Dispatch<SetStateAction<Edge[]>>;

    updateNode:   (id: string, data: any) => void;
}



export const NodeContext = createContext<NodeContextProps | undefined>(undefined);



export const NodeProvider = ({ children }: { children: ReactNode }) =>
{
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);


    const updateNode = (id: string, newData: {}) =>
    {
        updateAudioNode(id, newData);
        
        setNodes(nodes =>
            nodes.map(node =>
                node.id == id
                    ? { ...node, data: { ...node.data, ...newData } }
                    : node
            )
        );
    };


    return (
        <NodeContext.Provider 
            value=
            {{ 
                nodes, 
                setNodes, 
                edges, 
                setEdges, 
                updateNode
            }}>

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