import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (project: { id: string; name: string }) => void;
}

type UploadStep = 'upload' | 'processing' | 'success' | 'error';

const processingSteps = [
  { id: 'uploading', label: 'Uploading' },
  { id: 'extracting', label: 'Extracting' },
  { id: 'parsing', label: 'Parsing' },
  { id: 'indexing', label: 'Indexing' },
  { id: 'complete', label: 'Complete' },
];

export function UploadDialog({ open, onOpenChange, onSuccess }: UploadDialogProps) {
  const [step, setStep] = useState<UploadStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [currentProcessingStep, setCurrentProcessingStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile?.name.endsWith('.zip')) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.name.endsWith('.zip')) {
      setFile(selectedFile);
    }
  }, []);

  const simulateProcessing = async () => {
    setStep('processing');
    
    for (let i = 0; i < processingSteps.length; i++) {
      setCurrentProcessingStep(i);
      const stepDuration = i === 0 ? 1500 : 800;
      
      for (let p = 0; p <= 100; p += 5) {
        setProgress(p);
        await new Promise((resolve) => setTimeout(resolve, stepDuration / 20));
      }
    }

    setStep('success');
  };

  const handleUpload = () => {
    if (file) {
      simulateProcessing();
    }
  };

  const handleOpenProject = () => {
    onSuccess?.({ id: '1', name: file?.name.replace('.zip', '') || 'New Project' });
    resetDialog();
  };

  const resetDialog = () => {
    setStep('upload');
    setFile(null);
    setCurrentProcessingStep(0);
    setProgress(0);
    onOpenChange(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={resetDialog}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Upload a CPI iFlow ZIP export package
                </DialogDescription>
              </DialogHeader>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-colors ${
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <input
                  type="file"
                  accept=".zip"
                  onChange={handleFileSelect}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                
                {file ? (
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <File className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                      <Upload className="h-7 w-7" />
                    </div>
                    <p className="text-center font-medium">
                      Drag and drop your ZIP file here
                    </p>
                    <p className="text-center text-sm text-muted-foreground mt-1">
                      or click to browse
                    </p>
                    <p className="text-center text-xs text-muted-foreground mt-3">
                      Maximum 50MB • .zip files only
                    </p>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={resetDialog}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={!file} className="btn-press">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-6"
            >
              <DialogHeader>
                <DialogTitle className="text-center">Processing your package</DialogTitle>
                <DialogDescription className="text-center">
                  This may take a few moments...
                </DialogDescription>
              </DialogHeader>

              <div className="mt-8 space-y-4">
                <div className="flex justify-between">
                  {processingSteps.map((s, i) => (
                    <div key={s.id} className="flex flex-col items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                          i < currentProcessingStep
                            ? 'border-success bg-success text-success-foreground'
                            : i === currentProcessingStep
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border text-muted-foreground'
                        }`}
                      >
                        {i < currentProcessingStep ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : i === currentProcessingStep ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <span className="text-xs">{i + 1}</span>
                        )}
                      </div>
                      <span className={`text-xs ${i <= currentProcessingStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>

                <Progress value={progress} className="h-2" />
                
                <p className="text-center text-sm text-muted-foreground">
                  {processingSteps[currentProcessingStep]?.label}...
                </p>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-6 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
              </div>
              
              <DialogTitle className="text-center mb-2">
                Project created successfully!
              </DialogTitle>
              <DialogDescription className="text-center mb-6">
                {file?.name.replace('.zip', '')}
                <br />
                <span className="text-xs">
                  Extracted 12 iFlows with 48 integration steps
                </span>
              </DialogDescription>

              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={resetDialog}>
                  Create Another
                </Button>
                <Button onClick={handleOpenProject} className="btn-press">
                  Open Project
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-6 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
              </div>
              
              <DialogTitle className="text-center mb-2">
                Upload failed
              </DialogTitle>
              <DialogDescription className="text-center mb-6">
                There was an error processing your file. Please try again.
              </DialogDescription>

              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={resetDialog}>
                  Cancel
                </Button>
                <Button onClick={() => setStep('upload')} variant="destructive">
                  Try Again
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
