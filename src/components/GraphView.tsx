import 'reactflow/dist/style.css';
import styles from './GraphView.module.css';
import { useContext } from 'react';
import ReactFlow, { Background } from 'reactflow';
import { useFlowState } from '../hooks/useFlowState';
import { reactEdgeTypes, reactNodeTypes } from '../nodes';
import { ClassContext } from '../contexts/ClassContext';
import ConnectingWire from './ConnectingWire';

export default function GraphView() {
    const nodeContext = useContext(ClassContext);

    const { onNodesChange, onEdgesChange, onConnect, removeNodes, removeEdges } = useFlowState();

    return (
        <div className={styles.graphView}>
            <ReactFlow
                nodeTypes={reactNodeTypes}
                edgeTypes={reactEdgeTypes}
                nodes={nodeContext?.nodes}
                edges={nodeContext?.edges}
                connectionLineComponent={ConnectingWire}
                deleteKeyCode={['Delete', 'Backspace']}
                onNodesChange={onNodesChange}
                onNodesDelete={removeNodes}
                onEdgesChange={onEdgesChange}
                onEdgesDelete={removeEdges}
                onConnect={onConnect}
                minZoom={0.25}
                maxZoom={16}
            >
                <Background />
            </ReactFlow>
        </div>
    );
}
