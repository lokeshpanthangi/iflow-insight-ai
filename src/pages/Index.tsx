import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Link as LinkIcon } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { StatsBar } from '@/components/dashboard/StatsBar';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { UploadDialog } from '@/components/upload/UploadDialog';
import { Button } from '@/components/ui/button';
import { mockProjects } from '@/lib/mock-data';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [uploadOpen, setUploadOpen] = useState(false);
  const navigate = useNavigate();
  const projects = mockProjects;

  const readyProjects = projects.filter((p) => p.status === 'ready');
  const totalIFlows = readyProjects.reduce((acc, p) => acc + p.metadata.iflowCount, 0);

  const handleUploadSuccess = (project: { id: string; name: string }) => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Your Projects
              </h1>
              <p className="text-muted-foreground">
                Analyze SAP CPI iFlow packages and get instant insights with AI
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setUploadOpen(true)}
                className="btn-press shadow-glow hover:shadow-glow-lg"
              >
                <Upload className="mr-2 h-4 w-4" />
                New Project
              </Button>
              <Button variant="outline" disabled className="gap-2">
                <LinkIcon className="h-4 w-4" />
                Import from URL
              </Button>
            </div>
          </div>
        </motion.div>

        {projects.length > 0 ? (
          <>
            <StatsBar
              totalProjects={projects.length}
              readyProjects={readyProjects.length}
              totalIFlows={totalIFlows}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState onUpload={() => setUploadOpen(true)} />
        )}
      </main>

      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default Index;
