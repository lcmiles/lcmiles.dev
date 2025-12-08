'use client';

import { Navigation } from '@/components/Navigation';
import { motion } from 'framer-motion';
import { useEffect, useState, Suspense } from 'react';
import { skills as skillsData, skillCategories, Skill } from '@/data/skills';
import { projects } from '@/data/projects';
import { SkillsLegend } from '@/components/SkillsLegend';
// Growth chart removed by request
import { SkillDetail } from '@/components/SkillDetail';
import { useSearchParams } from 'next/navigation';

function SkillsContent() {
  const [selectedCategory, setSelectedCategory] = useState<'All' | Skill['category']>('All');
  const [legendOpen, setLegendOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  // Single view: grid only (chart removed)
  const [viewMode, setViewMode] = useState<'grid'>('grid');
  const searchParams = useSearchParams();

  const normalize = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const findSkillByQuery = (query: string): Skill | undefined => {
    const target = normalize(query);
    // 1) exact normalized name match
    let match = skillsData.find(skill => normalize(skill.name) === target);
    if (match) return match;
    // 2) query contains skill name (for tags like "Google Cloud" vs "Google Cloud Run")
    match = skillsData.find(skill => target.includes(normalize(skill.name)));
    if (match) return match;
    // 3) skill name contains query (for tags like "CI/CD" vs "CI/CD Pipelines")
    match = skillsData.find(skill => normalize(skill.name).includes(target));
    if (match) return match;
    return undefined;
  };

  useEffect(() => {
    const skillParam = searchParams.get('skill');
    if (skillParam) {
      const match = findSkillByQuery(skillParam);
      if (match) {
        setSelectedCategory('All');
        setSelectedSkill(match);
      }
    }
  }, [searchParams]);

  const filteredSkills = selectedCategory === 'All'
    ? skillsData
    : skillsData.filter(skill => skill.category === selectedCategory);

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill);
  };

  const handleCategoryChange = (category: 'All' | Skill['category']) => {
    setSelectedCategory(category);
    setSelectedSkill(null);
  };

  return (
    <>
      <Navigation />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-4 pb-2">
              Skills & Technologies
            </h1>
            <p className="text-xl text-slate-400 mb-4">
              My technical expertise and proficiency levels
            </p>
            <button
              onClick={() => setLegendOpen(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
            >
              What do levels mean?
            </button>
          </motion.div>

          {/* View Mode Toggle removed; grid-only view */}

          {/* Category Filter */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {skillCategories.map((category) => {
              const categoryColors: Record<string, string> = {
                'All': 'bg-slate-600 hover:bg-slate-500 shadow-slate-600/50',
                'Frontend': 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/50',
                'Backend': 'bg-purple-500 hover:bg-purple-400 shadow-purple-500/50',
                'Cloud': 'bg-red-500 hover:bg-red-400 shadow-red-500/50',
                'DevOps': 'bg-green-500 hover:bg-green-400 shadow-green-500/50',
              };
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isSelected
                      ? `${categoryColors[category]} text-white shadow-lg`
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Skill Growth Visualization */}
          {/* Growth chart removed */}

          {/* Skills Grid */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  onClick={() => handleSkillClick(skill)}
                  className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg p-6 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-slate-100">
                      {skill.name}
                    </h3>
                    <span className="text-cyan-400 font-medium">
                      Level {skill.level}/5
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(skill.level/5)*100}%` }}
                      transition={{ duration: 1, delay: index * 0.05 + 0.3 }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-slate-500">
                      {skill.category}
                    </span>
                    {skill.projectIds && skill.projectIds.length > 0 && (
                      <span className="text-xs text-purple-400">
                        {skill.projectIds.length} project{skill.projectIds.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <SkillsLegend isOpen={legendOpen} onClose={() => setLegendOpen(false)} definitions={{
        1: 'Novice – follows tutorials and completes guided tasks',
        2: 'Practitioner – builds small features independently; basic testing/tooling',
        3: 'Competent – ships production features end-to-end; on-call/debugging',
        4: 'Proficient – designs components; improves performance/reliability; mentors',
        5: 'Expert – sets patterns and practices; solves novel problems; publishes/shares',
      }} />
      
      <SkillDetail 
        skill={selectedSkill} 
        projects={projects}
        onClose={() => setSelectedSkill(null)} 
      />
    </>
  );
}

export default function SkillsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      }>
        <SkillsContent />
      </Suspense>
    </main>
  );
}
