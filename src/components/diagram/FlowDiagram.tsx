import { useCallback, useState, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  Edge,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomNode } from './CustomNode';
import { CustomEdge } from './CustomEdge';
import { DiagramControls } from './DiagramControls';
import { IFlowNode, IFlowEdge } from '@/lib/types';

interface FlowDiagramProps {
  iflowNodes: IFlowNode[];
  iflowEdges: IFlowEdge[];
  onNodeClick?: (node: IFlowNode) => void;
  selectedNodeId?: string | null;
}

const nodeTypes = { custom: CustomNode };
const edgeTypes = { custom: CustomEdge };

function FlowDiagramInner({ iflowNodes, iflowEdges, onNodeClick, selectedNodeId }: FlowDiagramProps) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const [isLocked, setIsLocked] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);

  const initialNodes: Node[] = useMemo(
    () =>
      iflowNodes.map((node) => ({
        id: node.id,
        type: 'custom',
        position: node.position,
        data: {
          label: node.label,
          nodeType: node.type,
          description: node.data.description,
          quickInfo: node.type === 'router' ? `${Object.keys(node.data.configuration).length} conditions` : undefined,
        },
        selected: node.id === selectedNodeId,
      })),
    [iflowNodes, selectedNodeId]
  );

  const initialEdges: Edge[] = useMemo(
    () =>
      iflowEdges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'custom',
        label: edge.label,
        animated: edge.animated,
        markerEnd: { type: 'arrowclosed' as const },
      })),
    [iflowEdges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const iflowNode = iflowNodes.find((n) => n.id === node.id);
      if (iflowNode && onNodeClick) {
        onNodeClick(iflowNode);
      }
    },
    [iflowNodes, onNodeClick]
  );

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border bg-muted/30">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        panOnDrag={!isLocked}
        zoomOnScroll={!isLocked}
        minZoom={0.5}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'custom',
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="hsl(var(--muted-foreground) / 0.1)" />
        {showMinimap && (
          <MiniMap
            nodeColor="hsl(var(--primary))"
            maskColor="hsl(var(--background) / 0.8)"
            className="!bg-card !border !rounded-lg !shadow-md"
            pannable
            zoomable
          />
        )}
      </ReactFlow>
      <DiagramControls
        onZoomIn={() => zoomIn()}
        onZoomOut={() => zoomOut()}
        onFitView={() => fitView()}
        isLocked={isLocked}
        onToggleLock={() => setIsLocked(!isLocked)}
        showMinimap={showMinimap}
        onToggleMinimap={() => setShowMinimap(!showMinimap)}
      />
    </div>
  );
}

export function FlowDiagram(props: FlowDiagramProps) {
  return (
    <ReactFlowProvider>
      <FlowDiagramInner {...props} />
    </ReactFlowProvider>
  );
}
