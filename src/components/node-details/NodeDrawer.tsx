import { motion } from 'framer-motion';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  GitBranch,
  FileCode,
  FileEdit,
  FileJson,
  RefreshCw,
  X,
  Sparkles,
  Copy,
  Download,
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { IFlowNode, NodeType } from '@/lib/types';

interface NodeDrawerProps {
  node: IFlowNode | null;
  open: boolean;
  onClose: () => void;
  onAskAI: (context: string) => void;
}

const nodeConfig: Record<NodeType, { icon: typeof ArrowDownToLine; colorClass: string }> = {
  sender: { icon: ArrowDownToLine, colorClass: 'bg-node-sender/10 text-node-sender border-node-sender/30' },
  receiver: { icon: ArrowUpFromLine, colorClass: 'bg-node-receiver/10 text-node-receiver border-node-receiver/30' },
  router: { icon: GitBranch, colorClass: 'bg-node-router/10 text-node-router border-node-router/30' },
  script: { icon: FileCode, colorClass: 'bg-node-script/10 text-node-script border-node-script/30' },
  'content-modifier': { icon: FileEdit, colorClass: 'bg-node-content-modifier/10 text-node-content-modifier border-node-content-modifier/30' },
  'message-mapping': { icon: FileJson, colorClass: 'bg-node-message-mapping/10 text-node-message-mapping border-node-message-mapping/30' },
  'integration-process': { icon: RefreshCw, colorClass: 'bg-node-integration-process/10 text-node-integration-process border-node-integration-process/30' },
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

export function NodeDrawer({ node, open, onClose, onAskAI }: NodeDrawerProps) {
  if (!node) return null;

  const config = nodeConfig[node.type];
  const Icon = config.icon;

  const handleAskAI = () => {
    onAskAI(`Tell me more about the "${node.label}" ${nodeTypeLabels[node.type]} step`);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <Badge variant="outline" className={`${config.colorClass} border`}>
              <Icon className="mr-1 h-3 w-3" />
              {nodeTypeLabels[node.type]}
            </Badge>
          </div>
          <SheetTitle className="text-xl">{node.label}</SheetTitle>
          {node.data.description && (
            <p className="text-sm text-muted-foreground">{node.data.description}</p>
          )}
        </SheetHeader>

        <Separator className="my-6" />

        <Tabs defaultValue="configuration" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>

          <TabsContent value="configuration" className="mt-4 space-y-4">
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 text-left text-sm font-medium">Property</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(node.data.configuration).map(([key, value], index) => (
                    <tr key={key} className={index !== Object.entries(node.data.configuration).length - 1 ? 'border-b' : ''}>
                      <td className="px-4 py-3 text-sm font-medium text-muted-foreground">{key}</td>
                      <td className="px-4 py-3 text-sm font-mono">{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="artifacts" className="mt-4 space-y-4">
            {node.data.artifacts.length > 0 ? (
              <div className="space-y-2">
                {node.data.artifacts.map((artifact) => (
                  <div
                    key={artifact.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileCode className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{artifact.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {artifact.language && (
                            <Badge variant="secondary" className="text-xs">
                              {artifact.language}
                            </Badge>
                          )}
                          {artifact.lineCount && <span>{artifact.lineCount} lines</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileCode className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No artifacts found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="connections" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Incoming</h4>
                <div className="p-3 rounded-lg border bg-muted/30 text-center text-sm text-muted-foreground">
                  Previous step data will be shown here
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Outgoing</h4>
                <div className="p-3 rounded-lg border bg-muted/30 text-center text-sm text-muted-foreground">
                  Next step data will be shown here
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        <div className="flex flex-col gap-2">
          <Button onClick={handleAskAI} className="w-full btn-press">
            <Sparkles className="mr-2 h-4 w-4" />
            Ask AI about this node
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" size="sm">
              <Copy className="mr-2 h-4 w-4" />
              Copy details
            </Button>
            <Button variant="outline" className="flex-1" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export config
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
