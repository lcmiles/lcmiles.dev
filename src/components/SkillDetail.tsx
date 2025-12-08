'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Skill } from '@/data/skills';
import { Project } from '@/data/projects';
import Link from 'next/link';
import { X } from 'lucide-react';

interface SkillDetailProps {
  skill: Skill | null;
  projects: Project[];
  onClose: () => void;
}

export function SkillDetail({ skill, projects, onClose }: SkillDetailProps) {
  if (!skill) return null;

  const relatedProjects = projects.filter(p => 
    skill.projectIds?.includes(p.id)
  );

  const levelDescriptions = {
    1: 'Novice – follows tutorials and completes guided tasks',
    2: 'Practitioner – builds small features independently; basic testing/tooling',
    3: 'Competent – ships production features end-to-end; on-call/debugging',
    4: 'Proficient – designs components; improves performance/reliability; mentors',
    5: 'Expert – sets patterns and practices; solves novel problems; publishes/shares',
  };

  const categoryColors = {
    Frontend: 'from-cyan-500 to-blue-600',
    Backend: 'from-purple-500 to-pink-600',
    Cloud: 'from-red-500 to-orange-600',
    DevOps: 'from-green-500 to-emerald-600',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-4 sm:px-6 py-4 flex justify-between items-start z-10">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">
                {skill.name}
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${categoryColors[skill.category]} text-white`}>
                  {skill.category}
                </span>
                {skill.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                Proficiency Level
              </h3>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-300 font-medium">Level {skill.level} of 5</span>
                  <span className="text-cyan-400 font-bold">{(skill.level / 5 * 100).toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(skill.level / 5) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full bg-gradient-to-r ${categoryColors[skill.category]} rounded-full`}
                  />
                </div>
                <p className="text-sm text-slate-400 mt-3 italic">
                  {levelDescriptions[skill.level]}
                </p>
              </div>
            </div>

            {/* Relationship data removed by request */}

            {relatedProjects.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  Projects Using This Skill
                </h3>
                <div className="space-y-3">
                  {relatedProjects.map(project => (
                    <Link
                      key={project.id}
                      href={`/projects?project=${project.id}`}
                      className="block p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 rounded-lg transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">
                            {project.title}
                          </h4>
                          {project.subtitle && (
                            <p className="text-sm text-slate-400 mt-0.5">{project.subtitle}</p>
                          )}
                          <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {project.tags.slice(0, 4).map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-slate-700/50 rounded text-xs text-slate-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        {project.year && (
                          <span className="text-sm text-slate-500 font-medium">{project.year}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
