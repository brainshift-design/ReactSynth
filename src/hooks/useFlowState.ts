import { useCallback, useContext, useState } from 'react';
import {
    EdgeChange,
    type Node,
    Edge,
    NodeChange,
    applyEdgeChanges,
    applyNodeChanges,
    Connection,
    addEdge,
} from 'reactflow';
import { removeAudioNode, connectAudioNodes, disconnectAudioNodes } from '../audio/audio';
import { createId } from '../util';
import { ClassContext } from '../contexts/ClassContext';
import { nodeTypes } from '../nodes';

export interface FlowStateProps {
    nodes: Node[];
    edges: Edge[];

    onNodesChange?: (changes: NodeChange[]) => void;
    onEdgesChange?: (changes: EdgeChange[]) => void;

    addEdge?: (data: Omit<Edge, 'id'>) => void;
}

export function useFlowState() {
    const [isRunning] = useState<boolean>(false);

    const nodeContext = useContext(ClassContext);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            if (nodeContext)
                nodeContext.setNodes((oldNodes: Node[]) => applyNodeChanges(changes, oldNodes));
        },
        [nodeContext]
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
            if (nodeContext)
                nodeContext.setEdges((oldEdges: Edge[]) => applyEdgeChanges(changes, oldEdges));
        },
        [nodeContext]
    );

    const onConnect = useCallback(
        (connection: Connection) => {
            const id = createId();
            const newEdge = { id, type: 'wire', ...connection };

            if (nodeContext) {
                const sourceNode = nodeContext.nodes.find((node) => node.id === connection.source);
                const targetNode = nodeContext.nodes.find((node) => node.id === connection.target);

                if (sourceNode && targetNode) {
                    const sourceHandleType = connection.sourceHandle?.split('-')[0];
                    const targetHandleType = connection.targetHandle?.split('-')[0];

                    if (sourceHandleType === 'control' && targetHandleType === 'control') {
                        // For control connections, update both source and target nodes
                        let controlInput: {
                            type: 'control';
                            control: ((command: 'note-on' | 'note-off') => void) | undefined;
                        };

                        nodeContext.setNodes((nodes) => {
                            // First pass: update target node and capture controlInput
                            const updatedNodes = nodes.map((node) => {
                                if (node.id === targetNode.id) {
                                    controlInput = {
                                        type: 'control' as const,
                                        control: undefined,
                                    };

                                    return {
                                        ...node,
                                        data: {
                                            ...node.data,
                                            isControlled: true,
                                            controlInput,
                                        },
                                    };
                                }
                                return node;
                            });

                            // Second pass: update source node with reference to target's controlInput
                            return updatedNodes.map((node) => {
                                if (node.id === sourceNode.id) {
                                    const existingControlOutput = node.data.controlOutput;
                                    const existingControls = existingControlOutput?.controls || [];

                                    const controlOutput = {
                                        type: 'control' as const,
                                        controls: existingControls,
                                        control: (command: 'note-on' | 'note-off') => {
                                            if (controlInput.control) {
                                                controlInput.control(command);
                                                // Add the control function if it's not already in the array
                                                if (
                                                    !controlOutput.controls.includes(
                                                        controlInput.control
                                                    )
                                                ) {
                                                    controlOutput.controls.push(
                                                        controlInput.control
                                                    );
                                                }
                                            }
                                            // Call all existing controls
                                            existingControls.forEach(
                                                (
                                                    control: (
                                                        command: 'note-on' | 'note-off'
                                                    ) => void
                                                ) => {
                                                    if (control) control(command);
                                                }
                                            );
                                        },
                                    };

                                    return {
                                        ...node,
                                        data: {
                                            ...node.data,
                                            controlOutput,
                                        },
                                    };
                                }
                                return node;
                            });
                        });
                    } else if (sourceHandleType === 'audio' && targetHandleType === 'audio') {
                        // Handle audio connection
                        connectAudioNodes(connection.source!, connection.target!);
                    }
                }

                nodeContext.setEdges((oldEdges: Edge[]) => addEdge(newEdge, oldEdges));
            }
        },
        [nodeContext]
    );

    const createReactFlowNode = useCallback(
        (type: string) => {
            if (type === '_output' && nodeContext?.nodes.some((n) => n.type === type)) return null; // don't create more than once

            const NodeClass = Object.getOwnPropertyDescriptor(nodeTypes, type)?.value;
            const node = NodeClass.createReactFlowNode();

            if (!node) throw new Error(`Invalid node type '${type}'`);

            if (nodeContext) nodeContext.setNodes((nodes) => [...nodes, node]);

            return node;
        },
        [nodeContext]
    );

    const removeNodes = useCallback((nodes: Node[]) => {
        for (const { id } of nodes) removeAudioNode(id);
    }, []);

    const removeEdges = useCallback(
        (edges: Edge[]) => {
            for (const { source, target, sourceHandle, targetHandle } of edges) {
                const sourceHandleType = sourceHandle?.split('-')[0];
                const targetHandleType = targetHandle?.split('-')[0];

                if (sourceHandleType === 'control' && targetHandleType === 'control') {
                    // For control disconnections, update both source and target nodes
                    nodeContext?.setNodes((nodes) =>
                        nodes.map((node) => {
                            if (node.id === target) {
                                return {
                                    ...node,
                                    data: {
                                        ...node.data,
                                        isControlled: false,
                                        controlInput: undefined,
                                    },
                                };
                            }
                            if (node.id === source) {
                                const controlOutput = node.data.controlOutput;
                                if (controlOutput) {
                                    // Keep all valid control functions
                                    controlOutput.controls = controlOutput.controls.filter(Boolean);
                                }
                                return {
                                    ...node,
                                    data: {
                                        ...node.data,
                                        controlOutput: controlOutput?.controls.length
                                            ? controlOutput
                                            : undefined,
                                    },
                                };
                            }
                            return node;
                        })
                    );
                } else if (sourceHandleType === 'audio' && targetHandleType === 'audio') {
                    // Handle audio disconnection
                    disconnectAudioNodes(source!, target!);
                }
            }
        },
        [nodeContext]
    );

    return {
        onNodesChange,
        onEdgesChange,
        onConnect,

        createNode: createReactFlowNode,
        removeNodes,
        removeEdges,

        isRunning,
    };
}
