'use client';

import { Navigation } from '@/components/Navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { projects, Project } from '@/data/projects';
import { useState } from 'react';
import ProjectModal from '@/components/ProjectModal';

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navigation />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-4 pb-2 leading-tight">
              Projects
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              A collection of my work and experiments
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => handleProjectClick(project)}
                className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 cursor-pointer"
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  {project.subtitle && (
                    <p className="text-xs text-cyan-400 font-medium mb-1 uppercase tracking-wider">
                      {project.subtitle}
                    </p>
                  )}
                  <h3 className="text-2xl font-bold text-slate-100 mb-2 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium bg-slate-800 text-cyan-400 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* View Details Link */}
                  <div className="text-sm text-cyan-400 font-medium hover:text-cyan-300 transition-colors">
                    View Details →
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </main>
  );
}
