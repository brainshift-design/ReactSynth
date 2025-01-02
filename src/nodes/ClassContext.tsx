import { createContext, ReactNode, useState, Dispatch, SetStateAction, useContext, useCallback } from 'react';
import { Edge, Node } from 'reactflow';
import { audioContext, audioIsRunning } from '../audio/audio';
import { FilterType } from './FilterNode';



export interface ClassContextProps
{
    nodes:          Node[];
    setNodes:       Dispatch<SetStateAction<Node[]>>;
 
    edges:          Edge[];
    setEdges:       Dispatch<SetStateAction<Edge[]>>;

    isRunning:      boolean;
    toggleAudio:    () => void;

    filterTypes:    FilterType[];
    setFilterTypes: Dispatch<SetStateAction<FilterType[]>>;
}



export const ClassContext = createContext<ClassContextProps | undefined>(undefined);



export const ClassProvider = ({ children }: { children: ReactNode }) =>
{
    const [nodes, setNodes]             = useState<Node[]>([]);
    const [edges, setEdges]             = useState<Edge[]>([]);
    const [isRunning, setIsRunning]     = useState(false);
    const [filterTypes, setFilterTypes] = useState<FilterType[]>([]);


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

                isRunning,
                toggleAudio,

                filterTypes,
                setFilterTypes
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