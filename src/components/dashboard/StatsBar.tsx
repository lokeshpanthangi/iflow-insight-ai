import { FolderArchive, Box, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsBarProps {
  totalProjects: number;
  readyProjects: number;
  totalIFlows: number;
}

export function StatsBar({ totalProjects, readyProjects, totalIFlows }: StatsBarProps) {
  const stats = [
    { label: 'Total Projects', value: totalProjects, icon: FolderArchive },
    { label: 'Analyzed', value: readyProjects, icon: CheckCircle },
    { label: 'iFlows Processed', value: totalIFlows, icon: Box },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-3 gap-4 mb-8"
    >
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 p-4 rounded-xl bg-card border"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <stat.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
