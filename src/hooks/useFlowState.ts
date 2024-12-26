import { useCallback, useContext, useState } from 'react';
import { EdgeChange, type Node, Edge, NodeChange, applyEdgeChanges, applyNodeChanges, Connection, addEdge } from 'reactflow';
import { updateAudioNode, removeAudioNode, connectAudioNodes, disconnectAudioNodes, createAudioNode } from '../audio/audio';
import { createId } from '../util';
import { NodeContext } from '../nodes/NodeContext';



export interface FlowStateProps
{
    nodes:          Node[];
    edges:          Edge[];

    onNodesChange?: (changes: NodeChange[]) => void;
    onEdgesChange?: (changes: EdgeChange[]) => void;

    addEdge?:       (data: Omit<Edge, 'id'>) => void;
};



export function useFlowState()
{
    const [isRunning, setIsRunning] = useState<boolean>(false);
    
    const nodeContext = useContext(NodeContext);
    const { setNodes, setEdges } = nodeContext!;


    const onNodesChange = useCallback((changes: NodeChange[]) =>
    {
        if (nodeContext)
            setNodes((oldNodes: Node[]) => applyNodeChanges(changes, oldNodes));
    }, 
    [nodeContext, setNodes]);



    const onEdgesChange = useCallback((changes: EdgeChange[]) =>
    {
        if (nodeContext)
            setEdges((oldEdges: Edge[]) => applyEdgeChanges(changes, oldEdges));
    }, 
    [nodeContext, setEdges]);



    const onConnect = useCallback((connection: Connection) =>
    {
        const id      = createId();
        const newEdge = { id, ...connection };

        if (nodeContext)
        {
            setEdges((oldEdges: Edge[]) => addEdge(newEdge, oldEdges));
            connectAudioNodes(connection.source!, connection.target!);
         }
     }, 
    []);



    const addNode = useCallback((node: Node) => 
    {
        createAudioNode(node.type!, node.id, node.data);
        setNodes(nodes => [...nodes, node]);
    },
    []);



    const updateNode = useCallback((id: string, data: {}) =>
    {
        setNodes(nodes =>
            nodes.map(node =>
                node.id == id
                    ? { ...node, data: { ...node.data, ...data } }
                    : node
            )
        );

        updateAudioNode(id, data);
    },
    []);



    const removeNodes = useCallback((nodes: Node[]) =>
    {
        for (const { id } of nodes)
            removeAudioNode(id);
    },
    []);

    

    const removeEdges = useCallback((edges: Edge[]) =>
    {
        for (const { sourceHandle, targetHandle } of edges)
            disconnectAudioNodes(sourceHandle!, targetHandle!);
    },
    []);



    const toggleAudio = useCallback(() =>
    {
        setIsRunning(!isRunning);
    },
    []);



    return {
        onNodesChange,
        onEdgesChange,
        onConnect,

        addNode,
        updateNode,
        removeNodes,
        removeEdges,

        toggleAudio,
        
        isRunning
    };
}