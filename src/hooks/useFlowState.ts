import { useCallback, useContext, useState } from 'react';
import { EdgeChange, type Node, Edge, NodeChange, applyEdgeChanges, applyNodeChanges, Connection, addEdge } from 'reactflow';
import { updateAudioNode, removeAudioNode, connectAudioNodes, disconnectAudioNodes } from '../audio/audio';
import { createId } from '../util';
import { NodeContext } from '../nodes/NodeContext';
import GainNode from '../nodes/GainNode';
import OscillatorNode from '../nodes/OscillatorNode';
import DelayNode from '../nodes/DelayNode';
import FilterNode from '../nodes/FilterNode';
import OutputNode from '../nodes/OutputNode';
import WaveShaperNode from '../nodes/WaveShaperNode';



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
    const [isRunning] = useState<boolean>(false);
    
    const nodeContext = useContext(NodeContext);


    const onNodesChange = useCallback((changes: NodeChange[]) =>
    {
        if (nodeContext)
            nodeContext.setNodes((oldNodes: Node[]) => applyNodeChanges(changes, oldNodes));
    }, 
    [nodeContext?.nodes]);



    const onEdgesChange = useCallback((changes: EdgeChange[]) =>
    {
        if (nodeContext)
            nodeContext.setEdges((oldEdges: Edge[]) => applyEdgeChanges(changes, oldEdges));
    }, 
    [nodeContext?.edges]);



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
    [nodeContext?.edges]);



    const createNode = useCallback((type: string) => 
    {
        if (   type == '_output'
            && nodeContext?.nodes.some(n => n.type == type))
            return null; // don't create more than once


        let node: Node | undefined = undefined;
        
        switch (type)
        {
            case 'oscillator': node = OscillatorNode.create(); break;
            case 'gain':       node = GainNode      .create(); break;
            case 'delay':      node = DelayNode     .create(); break;
            case 'filter':     node = FilterNode    .create(); break;
            case 'waveShaper': node = WaveShaperNode.create(); break;
            case '_output':    node = OutputNode    .create(); break;
        }

        if (!node)
            throw new Error(`Invalid node type '${type}'`);
        
        
        if (nodeContext)
            nodeContext.setNodes(nodes => [...nodes, node]);

        
        node.position = { x: 0, y: 0 };


        return node;
    },
    [nodeContext?.nodes]);



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
    [nodeContext?.nodes]);



    const removeNodes = useCallback((nodes: Node[]) =>
    {
        for (const { id } of nodes)
            removeAudioNode(id);
    },
    [nodeContext?.nodes]);

    

    const removeEdges = useCallback((edges: Edge[]) =>
    {
        for (const { source, target } of edges)
            disconnectAudioNodes(source!, target!);
    },
    [nodeContext?.edges]);



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