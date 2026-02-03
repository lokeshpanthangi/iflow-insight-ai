import { Project, ProjectDetail, IFlowNode, IFlowEdge, ChatMessage, NodeType } from './types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Customer Order Processing',
    status: 'ready',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    metadata: { iflowCount: 12, nodeCount: 48, fileSize: 2400000 },
  },
  {
    id: '2',
    name: 'Invoice Replication Flow',
    status: 'ready',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    metadata: { iflowCount: 8, nodeCount: 32, fileSize: 1800000 },
  },
  {
    id: '3',
    name: 'Product Master Sync',
    status: 'processing',
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000),
    metadata: { iflowCount: 0, nodeCount: 0, fileSize: 3200000 },
  },
  {
    id: '4',
    name: 'Employee Data Integration',
    status: 'failed',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    metadata: { iflowCount: 0, nodeCount: 0, fileSize: 500000 },
  },
  {
    id: '5',
    name: 'Sales Analytics Pipeline',
    status: 'ready',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    metadata: { iflowCount: 15, nodeCount: 67, fileSize: 4500000 },
  },
  {
    id: '6',
    name: 'Vendor Management API',
    status: 'ready',
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    metadata: { iflowCount: 6, nodeCount: 24, fileSize: 1200000 },
  },
];

const createNode = (
  id: string,
  type: NodeType,
  label: string,
  x: number,
  y: number,
  description?: string
): IFlowNode => ({
  id,
  type,
  label,
  position: { x, y },
  data: {
    description,
    configuration: getDefaultConfig(type),
    artifacts: getDefaultArtifacts(type, id),
  },
});

const getDefaultConfig = (type: NodeType): Record<string, string | number | boolean> => {
  const configs: Record<NodeType, Record<string, string | number | boolean>> = {
    sender: { address: 'https://api.example.com/orders', method: 'GET', timeout: 60 },
    receiver: { address: 'https://target.system.com/data', method: 'POST', retryCount: 3 },
    router: { routingCondition: '${property.orderType}', defaultRoute: 'standard' },
    script: { scriptType: 'Groovy', engine: '2.4', memoryLimit: 256 },
    'content-modifier': { setHeader: 'Content-Type', setValue: 'application/json' },
    'message-mapping': { sourceType: 'XML', targetType: 'JSON', mappingVersion: '1.0' },
    'integration-process': { processType: 'Parallel', maxConcurrency: 5, errorHandling: 'Continue' },
  };
  return configs[type];
};

const getDefaultArtifacts = (type: NodeType, nodeId: string) => {
  if (type === 'script') {
    return [
      { id: `${nodeId}-script-1`, name: 'transform.groovy', type: 'script' as const, language: 'Groovy', lineCount: 45 },
    ];
  }
  if (type === 'message-mapping') {
    return [
      { id: `${nodeId}-mapping-1`, name: 'orderMapping.mmap', type: 'mapping' as const },
    ];
  }
  return [];
};

export const mockNodes: IFlowNode[] = [
  createNode('1', 'sender', 'HTTP Receiver', 50, 200, 'Receives incoming order requests from external systems'),
  createNode('2', 'content-modifier', 'Set Headers', 250, 200, 'Adds authentication and content-type headers'),
  createNode('3', 'router', 'Order Router', 450, 200, 'Routes orders based on priority and type'),
  createNode('4', 'script', 'Validate Order', 650, 100, 'Validates order data and enriches with customer info'),
  createNode('5', 'message-mapping', 'Transform to SAP', 650, 300, 'Maps external format to SAP IDoc structure'),
  createNode('6', 'integration-process', 'Process Order', 850, 100, 'Handles order processing workflow'),
  createNode('7', 'script', 'Error Handler', 850, 300, 'Handles exceptions and sends notifications'),
  createNode('8', 'receiver', 'SAP S/4HANA', 1050, 200, 'Sends processed orders to SAP backend'),
];

export const mockEdges: IFlowEdge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4', label: 'Priority' },
  { id: 'e3-5', source: '3', target: '5', label: 'Standard' },
  { id: 'e4-6', source: '4', target: '6' },
  { id: 'e5-7', source: '5', target: '7', label: 'On Error' },
  { id: 'e5-8', source: '5', target: '8' },
  { id: 'e6-8', source: '6', target: '8' },
];

export const mockChatHistory: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm your CPI iFlow assistant. I've analyzed the **Customer Order Processing** integration flow. This flow handles incoming order requests and routes them to SAP S/4HANA.\n\nWhat would you like to know about this integration?",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
];

export const getProjectDetail = (projectId: string): ProjectDetail | null => {
  const project = mockProjects.find((p) => p.id === projectId);
  if (!project) return null;

  return {
    ...project,
    nodes: mockNodes,
    edges: mockEdges,
    chatHistory: mockChatHistory,
  };
};

export const suggestedPrompts = [
  "What does this iFlow do?",
  "Explain the error handling strategy",
  "List all external systems",
  "Show me all API endpoints",
  "Where is data transformation happening?",
  "Summarize security configurations",
];

export const mockAIResponses: Record<string, string> = {
  "What does this iFlow do?": `This integration flow processes **customer orders** from external systems and sends them to SAP S/4HANA.

**Key steps:**
1. Receives HTTP requests with order data
2. Validates and enriches order information
3. Routes based on order priority
4. Transforms to SAP IDoc format
5. Sends to SAP backend

The flow includes comprehensive error handling with automatic retry logic.`,
  "Explain the error handling strategy": `The error handling in this iFlow follows a **multi-layered approach**:

1. **Retry Logic**: The SAP receiver has 3 automatic retries with exponential backoff
2. **Exception Handler**: A dedicated Groovy script catches and logs exceptions
3. **Dead Letter Queue**: Failed messages are routed to a monitoring system
4. **Alerting**: Critical errors trigger email notifications

\`\`\`groovy
// Error handler snippet
if (exception instanceof TimeoutException) {
    sendAlert("Order processing timeout")
}
\`\`\``,
  default: `I've analyzed the integration flow and found relevant information. Let me provide more details based on the nodes and configurations present in this iFlow.

The flow contains **${mockNodes.length} integration steps** with various transformation and routing logic.`,
};
