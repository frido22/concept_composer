import { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  NodeTypes,
  ReactFlowProvider,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import ConceptNode from './ConceptNode';
import SyncNode from './SyncNode';
import { ComposerNode, ComposerEdge, ConceptData, SyncData } from '../types';

interface CanvasProps {
  initialNodes?: ComposerNode[];
  initialEdges?: ComposerEdge[];
  onNodesChange?: (nodes: ComposerNode[]) => void;
  onEdgesChange?: (edges: ComposerEdge[]) => void;
  onSelectionChange?: (nodes: ComposerNode[]) => void;
}

const nodeTypes: NodeTypes = {
  concept: ConceptNode,
  sync: SyncNode,
};

const Canvas = ({ 
  initialNodes = [], 
  initialEdges = [], 
  onNodesChange,
  onEdgesChange,
  onSelectionChange 
}: CanvasProps) => {
  const [nodes, setNodes, onNodesChangeHandler] = useNodesState<ComposerNode>([]);
  const [edges, setEdges, onEdgesChangeHandler] = useEdgesState<ComposerEdge>([]);

  // Update internal state when external state changes
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const isValidConnection = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target || !connection.sourceHandle || !connection.targetHandle) {
      return false;
    }

    const sourceNode = nodes.find(node => node.id === connection.source);
    const targetNode = nodes.find(node => node.id === connection.target);
    
    if (!sourceNode || !targetNode) return false;

    if (sourceNode.id === targetNode.id) return false;

    if (sourceNode.type === 'concept' && targetNode.type === 'sync') {
      return connection.targetHandle.includes('#when');
    }
    
    if (sourceNode.type === 'sync' && targetNode.type === 'concept') {
      return connection.sourceHandle.includes('#then');
    }

    return false;
  }, [nodes]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      onEdgesChange?.(newEdges);
    },
    [edges, setEdges, onEdgesChange]
  );

  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChangeHandler(changes);
      // Note: We can't easily get the updated nodes here synchronously
      // So we'll let the parent component handle the state
    },
    [onNodesChangeHandler]
  );

  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChangeHandler(changes);
      // Note: We can't easily get the updated edges here synchronously
      // So we'll let the parent component handle the state
    },
    [onEdgesChangeHandler]
  );

  const handleSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: Node[] }) => {
      onSelectionChange?.(selectedNodes as ComposerNode[]);
    },
    [onSelectionChange]
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onSelectionChange={handleSelectionChange}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="top-right"
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

const CanvasWithProvider = (props: CanvasProps) => (
  <ReactFlowProvider>
    <Canvas {...props} />
  </ReactFlowProvider>
);

export default CanvasWithProvider;