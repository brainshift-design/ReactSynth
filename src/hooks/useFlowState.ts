import { useCallback, useContext, useState } from 'react';
import { EdgeChange, type Node, Edge, NodeChange, applyEdgeChanges, applyNodeChanges, Connection, addEdge } from 'reactflow';
import { updateAudioNode, removeAudioNode, connectAudioNodes, disconnectAudioNodes } from '../audio/audio';
import { createId } from '../util';
import { NodeContext } from '../nodes/NodeContext';
import OscillatorUiNode from '../nodes/OscillatorUiNode';
import GainUiNode from '../nodes/GainUiNode';
import OutputUiNode from '../nodes/OutputUiNode';



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
    //const { setNodes, setEdges } = nodeContext!;


    const onNodesChange = useCallback((changes: NodeChange[]) =>
    {
        if (nodeContext)
            nodeContext.setNodes((oldNodes: Node[]) => applyNodeChanges(changes, oldNodes));
    }, 
    [nodeContext, nodeContext?.setNodes]);



    const onEdgesChange = useCallback((changes: EdgeChange[]) =>
    {
        if (nodeContext)
            nodeContext.setEdges((oldEdges: Edge[]) => applyEdgeChanges(changes, oldEdges));
    }, 
    [nodeContext, nodeContext?.setEdges]);



    const onConnect = useCallback((connection: Connection) =>
    {
        const id      = createId();
        const newEdge = { id, ...connection };

        if (nodeContext)
        {
            connectAudioNodes(connection.source!, connection.target!);
            nodeContext.setEdges((oldEdges: Edge[]) => addEdge(newEdge, oldEdges));
         }
     }, 
    []);



    const createNode = useCallback((type: string) => 
    {
        if (   type == '_output'
            && nodeContext?.nodes.some(n => n.type == type))
            return null; // singleton nodes


        let node: Node | undefined = undefined;
        
        switch (type)
        {
            case 'oscillator': node = OscillatorUiNode.create(); break;
            case 'gain':       node = GainUiNode      .create(); break;
            case '_output':    node = OutputUiNode    .create(); break;
        }

        if (!node)
            throw new Error(`Invalid node type '${type}'`);
        
        
        if (nodeContext)
            nodeContext.setNodes(nodes => [...nodes, node]);

        
        node.position = { x: 0, y: 0 };


        return node;
    },
    []);



    const updateNode = useCallback((id: string, data: {}) =>
    {
        updateAudioNode(id, data);

        if (nodeContext)
        {
            nodeContext.setNodes(nodes =>
                nodes.map(node =>
                    node.id == id
                        ? { ...node, data: { ...node.data, ...data } }
                        : node
                )
            );
        }
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



    return {
        onNodesChange,
        onEdgesChange,
        onConnect,

        createNode,
        updateNode,
        removeNodes,
        removeEdges,

        isRunning
    };
}