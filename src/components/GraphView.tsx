import { useContext } from 'react';
import ReactFlow, { Background } from 'reactflow';
import { useFlowState } from '../hooks/useFlowState';
import { reactNodeTypes } from '../nodes';
import { ClassContext } from '../nodes/ClassContext';

import 'reactflow/dist/style.css';
import styles from './GraphView.module.css';



export default function GraphView()
{
    const nodeContext = useContext(ClassContext);
    

    const { onNodesChange, onEdgesChange, onConnect, removeNodes, removeEdges } = useFlowState();


    return (
        <div className={styles.graphView}>
            <ReactFlow 
                nodeTypes     = {reactNodeTypes}
                nodes         = {nodeContext?.nodes}
                edges         = {nodeContext?.edges}
                deleteKeyCode = {['Delete', 'Backspace']}
                onNodesChange = {onNodesChange}
                onNodesDelete = {removeNodes}
                onEdgesChange = {onEdgesChange}
                onEdgesDelete = {removeEdges}
                onConnect     = {onConnect}
                maxZoom       = {8}
                >
                <Background />
            </ReactFlow>
        </div>
    );
}