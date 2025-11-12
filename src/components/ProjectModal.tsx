'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/data/projects';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

interface GitHubStats {
  stars: number;
  forks: number;
  watchers: number;
  lastUpdated: string;
  language: string;
  openIssues: number;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (!project || !isOpen) {
      setGithubStats(null);
      return;
    }

    const githubLink = project.links.find(link => 
      link.href.includes('github.com') && link.href.includes(project.id)
    );

    if (githubLink) {
      const match = githubLink.href.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (match) {
        const [, owner, repo] = match;
        fetchGitHubStats(owner, repo);
      }
    }
  }, [project, isOpen]);

  const fetchGitHubStats = async (owner: string, repo: string) => {
    setLoadingStats(true);
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: process.env.NEXT_PUBLIC_GITHUB_TOKEN
          ? { Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}` }
          : {},
      });

      if (response.ok) {
        const data = await response.json();
        setGithubStats({
          stars: data.stargazers_count,
          forks: data.forks_count,
          watchers: data.watchers_count,
          lastUpdated: new Date(data.updated_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          language: data.language || 'N/A',
          openIssues: data.open_issues_count,
        });
      }
    } catch (error) {
      console.error('Failed to fetch GitHub stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image Header */}
            <div className="relative h-64 md:h-80 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Title & Subtitle */}
              <div className="mb-6">
                {project.subtitle && (
                  <p className="text-sm text-cyan-400 font-medium mb-2 uppercase tracking-wider">
                    {project.subtitle}
                  </p>
                )}
                <h2 className="text-4xl font-bold text-white mb-2">
                  {project.title}
                </h2>
                {project.year && (
                  <p className="text-slate-400 text-sm">
                    {project.year}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-slate-300 leading-relaxed text-lg">
                  {project.description}
                </p>
              </div>

              {/* GitHub Stats */}
              {githubStats && (
                <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                    Repository Stats
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-cyan-400">⭐ {githubStats.stars}</div>
                      <div className="text-xs text-slate-400">Stars</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-cyan-400">🍴 {githubStats.forks}</div>
                      <div className="text-xs text-slate-400">Forks</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-cyan-400">👁️ {githubStats.watchers}</div>
                      <div className="text-xs text-slate-400">Watchers</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-300">{githubStats.language}</div>
                      <div className="text-xs text-slate-400">Primary Language</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-300">{githubStats.lastUpdated}</div>
                      <div className="text-xs text-slate-400">Last Updated</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-300">{githubStats.openIssues}</div>
                      <div className="text-xs text-slate-400">Open Issues</div>
                    </div>
                  </div>
                </div>
              )}

              {loadingStats && (
                <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <p className="text-slate-400 text-sm">Loading repository stats...</p>
                </div>
              )}

              {/* Tech Stack */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-4 py-2 text-sm font-medium bg-slate-800 text-cyan-400 rounded-lg border border-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-4">
                {project.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
                  >
                    {link.label} →
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
