import { ZoomIn, ZoomOut, Maximize, Lock, Unlock, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface DiagramControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  isLocked: boolean;
  onToggleLock: () => void;
  showMinimap: boolean;
  onToggleMinimap: () => void;
}

export function DiagramControls({
  onZoomIn,
  onZoomOut,
  onFitView,
  isLocked,
  onToggleLock,
  showMinimap,
  onToggleMinimap,
}: DiagramControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 p-1 rounded-xl bg-card/90 backdrop-blur border shadow-md">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Zoom in</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Zoom out</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onFitView}>
            <Maximize className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Fit view</TooltipContent>
      </Tooltip>

      <div className="h-px bg-border my-1" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isLocked ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={onToggleLock}
          >
            {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">{isLocked ? 'Unlock pan' : 'Lock pan'}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={showMinimap ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={onToggleMinimap}
          >
            <Map className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Toggle minimap</TooltipContent>
      </Tooltip>
    </div>
  );
}
