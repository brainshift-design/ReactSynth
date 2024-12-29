import { createContext, ReactNode, useState, Dispatch, SetStateAction, useContext, useCallback } from 'react';
import { Edge, Node } from 'reactflow';
import { audioContext, audioIsRunning, updateAudioNode } from '../audio/audio';



export interface ClassContextProps
{
    nodes:       Node[];
    setNodes:    Dispatch<SetStateAction<Node[]>>;
 
    edges:       Edge[];
    setEdges:    Dispatch<SetStateAction<Edge[]>>;

    updateNode:  (id: string, data: any) => void;

    isRunning:   boolean;
    toggleAudio: () => void;
}



export const ClassContext = createContext<ClassContextProps | undefined>(undefined);



export const ClassProvider = ({ children }: { children: ReactNode }) =>
{
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [isRunning, setIsRunning] = useState(false);


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

 
    const toggleAudio = useCallback(() => 
    {
        if (audioIsRunning()) audioContext?.suspend().then(() => setIsRunning(audioIsRunning()));
        else                  audioContext?.resume ().then(() => setIsRunning(audioIsRunning()));
    },
    []);
 
 
     return (
        <ClassContext.Provider 
            value=
            {{ 
                nodes, 
                setNodes, 

                edges, 
                setEdges, 

                updateNode,

                isRunning,
                toggleAudio
            }}>

            {children}

        </ClassContext.Provider>
    );
};



export const useNodeContext = () =>
{
    const nodeContext = useContext(ClassContext);

    if (nodeContext === undefined)
        throw new Error('useNodeContext must be used within a NodeProvider');

    return nodeContext;
};