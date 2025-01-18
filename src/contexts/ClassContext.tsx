import { createContext } from 'react';
import { type Node, type Edge } from 'reactflow';

export interface FilterType {
    id: string;
    type: string | number;
}

export interface ClassContextProps {
    nodes: Node[];
    edges: Edge[];
    filterTypes: FilterType[];
    setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;
    setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;
    setFilterTypes: (types: FilterType[]) => void;
    toggleAudio: (on: boolean) => void;
}

export const ClassContext = createContext<ClassContextProps | undefined>(undefined);
