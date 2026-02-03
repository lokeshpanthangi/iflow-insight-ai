import { motion } from 'framer-motion';
import { Upload, Link as LinkIcon } from 'lucide-react';

interface EmptyStateProps {
  onUpload: () => void;
}

export function EmptyState({ onUpload }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-float">
          <div className="h-32 w-32 rounded-3xl bg-primary/10 blur-2xl" />
        </div>
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
          <Upload className="h-10 w-10 text-primary" />
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold text-center mb-2">No projects yet</h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Upload your first CPI iFlow ZIP package to get started with AI-powered analysis and insights.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onUpload}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-glow hover:shadow-glow-lg transition-shadow"
        >
          <Upload className="h-4 w-4" />
          Create Project
        </motion.button>
        <button
          disabled
          className="flex items-center gap-2 px-6 py-3 rounded-xl border text-muted-foreground font-medium opacity-50 cursor-not-allowed"
        >
          <LinkIcon className="h-4 w-4" />
          Import from URL
        </button>
      </div>
    </motion.div>
  );
}
