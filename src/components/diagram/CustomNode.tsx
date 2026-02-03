import { memo, useMemo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  GitBranch,
  FileCode,
  FileEdit,
  FileJson,
  RefreshCw,
} from 'lucide-react';
import { NodeType } from '@/lib/types';

interface CustomNodeData {
  label: string;
  nodeType: NodeType;
  description?: string;
  quickInfo?: string;
}

const nodeConfig: Record<NodeType, { icon: typeof ArrowDownToLine; colorClass: string; bgClass: string }> = {
  sender: { icon: ArrowDownToLine, colorClass: 'text-node-sender', bgClass: 'bg-node-sender/10 border-node-sender/30' },
  receiver: { icon: ArrowUpFromLine, colorClass: 'text-node-receiver', bgClass: 'bg-node-receiver/10 border-node-receiver/30' },
  router: { icon: GitBranch, colorClass: 'text-node-router', bgClass: 'bg-node-router/10 border-node-router/30' },
  script: { icon: FileCode, colorClass: 'text-node-script', bgClass: 'bg-node-script/10 border-node-script/30' },
  'content-modifier': { icon: FileEdit, colorClass: 'text-node-content-modifier', bgClass: 'bg-node-content-modifier/10 border-node-content-modifier/30' },
  'message-mapping': { icon: FileJson, colorClass: 'text-node-message-mapping', bgClass: 'bg-node-message-mapping/10 border-node-message-mapping/30' },
  'integration-process': { icon: RefreshCw, colorClass: 'text-node-integration-process', bgClass: 'bg-node-integration-process/10 border-node-integration-process/30' },
};

const nodeTypeLabels: Record<NodeType, string> = {
  sender: 'Sender',
  receiver: 'Receiver',
  router: 'Router',
  script: 'Script',
  'content-modifier': 'Content Modifier',
  'message-mapping': 'Message Mapping',
  'integration-process': 'Integration Process',
};

function CustomNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as CustomNodeData;
  const config = nodeConfig[nodeData.nodeType] || nodeConfig.sender;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`relative min-w-[160px] rounded-xl border-2 bg-card p-3 shadow-md transition-all duration-200 ${
        selected
          ? 'ring-2 ring-primary ring-offset-2 shadow-lg'
          : 'hover:shadow-lg'
      } ${config.bgClass}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background"
      />
      
      <div className="flex items-start gap-2">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-card ${config.colorClass}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-xs font-medium ${config.colorClass} mb-0.5`}>
            {nodeTypeLabels[nodeData.nodeType]}
          </p>
          <p className="text-sm font-semibold text-foreground truncate">
            {nodeData.label}
          </p>
          {nodeData.quickInfo && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {nodeData.quickInfo}
            </p>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background"
      />
    </motion.div>
  );
}

export const CustomNode = memo(CustomNodeComponent);
