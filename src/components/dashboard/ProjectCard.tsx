import { motion } from 'framer-motion';
import { Upload, FileArchive, ArrowRight, MoreVertical, Trash2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Project, ProjectStatus } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const statusConfig: Record<ProjectStatus, { label: string; variant: 'default' | 'secondary' | 'destructive'; className: string }> = {
  ready: { label: 'Ready', variant: 'default', className: 'bg-success/10 text-success border-success/20' },
  processing: { label: 'Processing', variant: 'secondary', className: 'bg-warning/10 text-warning border-warning/20 animate-pulse-subtle' },
  failed: { label: 'Failed', variant: 'destructive', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const status = statusConfig[project.status];
  const isClickable = project.status === 'ready';

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const cardContent = (
    <>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <Badge variant="outline" className={status.className}>
          {status.label}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reprocess
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileArchive className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Created {formatDistanceToNow(project.createdAt, { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="font-medium text-foreground">{project.metadata.iflowCount}</span> iFlows
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-1">
            <span className="font-medium text-foreground">{project.metadata.nodeCount}</span> Nodes
          </span>
          {project.status === 'ready' && (
            <>
              <span className="text-border">•</span>
              <span>{formatFileSize(project.metadata.fileSize)}</span>
            </>
          )}
        </div>
        {isClickable && (
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        )}
        {project.status === 'failed' && (
          <Button size="sm" variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10">
            Retry
          </Button>
        )}
      </CardFooter>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      {isClickable ? (
        <Link to={`/projects/${project.id}`} className="block">
          <Card className="group card-hover gradient-border">
            {cardContent}
          </Card>
        </Link>
      ) : (
        <Card className="group card-hover gradient-border opacity-80">
          {cardContent}
        </Card>
      )}
    </motion.div>
  );
}
