import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeTypes,
  ReactFlowProvider,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import ConceptNode from './ConceptNode';
import SyncNode from './SyncNode';
import { ComposerNode, ComposerEdge } from '../types';

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
  onEdgesChange,
  onSelectionChange 
}: CanvasProps) => {
  const [nodes, setNodes, onNodesChangeHandler] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeHandler] = useEdgesState(initialEdges);

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
      onSelectionChange?.(selectedNodes as any);
    },
    [onSelectionChange]
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes as any}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onSelectionChange={handleSelectionChange}
        isValidConnection={isValidConnection as any}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="top-right"
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
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