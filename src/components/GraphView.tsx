import { useContext } from 'react';
import ReactFlow, { Background } from 'reactflow';
import { useFlowState } from '../hooks/useFlowState';
import { nodeTypes } from '../nodes/nodeTypes';
import { NodeContext } from '../nodes/NodeContext';

import 'reactflow/dist/style.css';
import styles from './GraphView.module.css';



export default function GraphView()
{
    const nodeContext = useContext(NodeContext);
    

    const { onNodesChange, onEdgesChange, onConnect, removeNodes, removeEdges } = useFlowState();


    return (
        <div className={styles.graphView}>
            <ReactFlow 
                //nodeTypes     = {nodeTypes}
                nodes         = {nodeContext?.nodes}
                edges         = {nodeContext?.edges}
                deleteKeyCode = {['Delete', 'Backspace']}
                onNodesChange = {onNodesChange}
                onNodesDelete = {removeNodes}
                onEdgesChange = {onEdgesChange}
                onEdgesDelete = {removeEdges}
                onConnect     = {onConnect}>
                <Background />
            </ReactFlow>
        </div>
    );
}