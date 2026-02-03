import { useState, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  MoreVertical,
  RefreshCw,
  Download,
  Image,
  Settings,
  Trash2,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { FlowDiagram } from '@/components/diagram/FlowDiagram';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { NodeDrawer } from '@/components/node-details/NodeDrawer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getProjectDetail, mockAIResponses } from '@/lib/mock-data';
import { IFlowNode, ChatMessage, ProjectStatus } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  ready: { label: 'Ready', className: 'bg-success/10 text-success border-success/20' },
  processing: { label: 'Processing', className: 'bg-warning/10 text-warning border-warning/20' },
  failed: { label: 'Failed', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = useMemo(() => getProjectDetail(projectId || '1'), [projectId]);

  const [selectedNode, setSelectedNode] = useState<IFlowNode | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [nodeContext, setNodeContext] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(project?.chatHistory || []);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  const status = statusConfig[project.status];

  const handleNodeClick = useCallback((node: IFlowNode) => {
    setSelectedNode(node);
    setDrawerOpen(true);
  }, []);

  const handleAskAI = useCallback((context: string) => {
    setNodeContext(context);
  }, []);

  const handleSendMessage = useCallback((content: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
      nodeContext: nodeContext || undefined,
    };

    const loadingMessage: ChatMessage = {
      id: `loading-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);

    // Simulate AI response
    setTimeout(() => {
      const responseContent = mockAIResponses[content] || mockAIResponses.default;
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        sources: [
          { id: '1', type: 'file', name: 'integration-flow.xml' },
          { id: '2', type: 'node', name: 'Order Router', nodeId: '3' },
        ],
      };

      setMessages((prev) => prev.filter((m) => !m.isLoading).concat(assistantMessage));
    }, 1500);

    setNodeContext(null);
  }, [nodeContext]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-card/50 px-6 py-4"
      >
        <div className="container flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">
                Projects
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium truncate max-w-[200px]">
                {project.name}
              </span>
            </div>

            {/* Status & Metadata */}
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={status.className}>
                {status.label}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Updated {formatDistanceToNow(project.updatedAt, { addSuffix: true })}
              </span>
              <Badge variant="secondary">{project.metadata.iflowCount} iFlows</Badge>
            </div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh / Reprocess
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download ZIP
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Image className="mr-2 h-4 w-4" />
                Export Diagram
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Project Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.header>

      {/* Main Content - Split Layout */}
      <main className="flex-1 container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-220px)]">
          {/* Diagram Workspace */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 h-full"
          >
            <FlowDiagram
              iflowNodes={project.nodes}
              iflowEdges={project.edges}
              onNodeClick={handleNodeClick}
              selectedNodeId={selectedNode?.id}
            />
          </motion.div>

          {/* Chat Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 h-full"
          >
            <ChatPanel
              messages={messages}
              onSendMessage={handleSendMessage}
              nodeContext={nodeContext}
              onClearContext={() => setNodeContext(null)}
            />
          </motion.div>
        </div>
      </main>

      {/* Node Details Drawer */}
      <NodeDrawer
        node={selectedNode}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAskAI={handleAskAI}
      />
    </div>
  );
}
