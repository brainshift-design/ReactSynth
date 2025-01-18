import { useState, type PropsWithChildren } from 'react';
import { type Node, type Edge } from 'reactflow';
import { ClassContext, type FilterType } from './ClassContext';
import { audioContext } from '../audio/audio';

export function ClassProvider({ children }: PropsWithChildren) {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [filterTypes, setFilterTypes] = useState<FilterType[]>([]);

    const toggleAudio = (on: boolean) => {
        if (on) {
            audioContext?.resume();
        } else {
            audioContext?.suspend();
        }
    };

    return (
        <ClassContext.Provider
            value={{ nodes, edges, filterTypes, setNodes, setEdges, setFilterTypes, toggleAudio }}
        >
            {children}
        </ClassContext.Provider>
    );
}
