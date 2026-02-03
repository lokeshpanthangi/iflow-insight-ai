export type ProjectStatus = 'ready' | 'processing' | 'failed';

export type NodeType = 
  | 'sender'
  | 'receiver'
  | 'router'
  | 'script'
  | 'content-modifier'
  | 'message-mapping'
  | 'integration-process';

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    iflowCount: number;
    nodeCount: number;
    fileSize: number;
  };
}

export interface Artifact {
  id: string;
  name: string;
  type: 'script' | 'mapping' | 'resource';
  language?: string;
  lineCount?: number;
  content?: string;
}

export interface IFlowNode {
  id: string;
  type: NodeType;
  label: string;
  position: { x: number; y: number };
  data: {
    description?: string;
    configuration: Record<string, string | number | boolean>;
    artifacts: Artifact[];
  };
}

export interface IFlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export interface Source {
  id: string;
  type: 'file' | 'node';
  name: string;
  nodeId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: Date;
  nodeContext?: string;
  isLoading?: boolean;
  error?: string;
}

export interface ProjectDetail extends Project {
  nodes: IFlowNode[];
  edges: IFlowEdge[];
  chatHistory: ChatMessage[];
}
