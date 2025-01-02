import { useCallback, useContext, useState } from 'react';
import { EdgeChange, type Node, Edge, NodeChange, applyEdgeChanges, applyNodeChanges, Connection, addEdge } from 'reactflow';
import { removeAudioNode, connectAudioNodes, disconnectAudioNodes } from '../audio/audio';
import { createId } from '../util';
import { ClassContext } from '../ClassContext';
import { nodeTypes } from '../nodes';



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
    
    const nodeContext = useContext(ClassContext);


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
        const newEdge = { id, type: 'wire', ...connection };

        if (nodeContext)
        {
            connectAudioNodes(connection.source!, connection.target!);
            nodeContext.setEdges((oldEdges: Edge[]) => addEdge(newEdge, oldEdges));
         }
     }, 
    [nodeContext?.edges]);



    const createReactFlowNode = useCallback((type: string) => 
    {
        if (   type == '_output'
            && nodeContext?.nodes.some(n => n.type == type))
            return null; // don't create more than once


        const NodeClass = Object.getOwnPropertyDescriptor(nodeTypes, type)?.value;
        const node      = NodeClass.createReactFlowNode();

        if (!node)
            throw new Error(`Invalid node type '${type}'`);
        

        if (nodeContext)
            nodeContext.setNodes(nodes => [...nodes, node]);


        return node;
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

        createNode: createReactFlowNode,
        //updateNode,
        removeNodes,
        removeEdges,

        isRunning
    };
}