// Centralized skills data with tangible 1–5 levels
// Level anchors:
// 1: Novice – follows tutorials, completes guided tasks
// 2: Practitioner – builds small features independently
// 3: Competent – ships production features end-to-end
// 4: Proficient – designs components, improves perf/reliability, mentors
// 5: Expert – sets patterns/org practices, solves novel problems

export type SkillCategory = 'Frontend' | 'Backend' | 'Cloud' | 'DevOps';

export interface Skill {
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  category: SkillCategory;
  // description removed
  years?: number;
  tags?: string[];
  projectIds?: string[];
}

export const skills: Skill[] = [
  // Frontend
  {
    name: 'HTML',
    level: 5,
    category: 'Frontend',
    projectIds: ['blazing-adoptions', 'portfolio-dev']
  },
  {
    name: 'CSS',
    level: 5,
    category: 'Frontend',
    projectIds: ['blazing-adoptions', 'portfolio-dev']
  },
  {
    name: 'JavaScript',
    level: 1,
    category: 'Frontend',
    projectIds: ['blazing-adoptions', 'gearshift', 'ollama-chat', 'portfolio-dev']
  },
  {
    name: 'TypeScript',
    level: 1,
    category: 'Frontend',
    projectIds: ['portfolio-dev']
  },
  {
    name: 'React',
    level: 2,
    category: 'Frontend',
    projectIds: ['blazing-adoptions', 'portfolio-dev']
  },
  {
    name: 'Next.js',
    level: 1,
    category: 'Frontend',
    projectIds: ['portfolio-dev']
  },
  {
    name: 'Tailwind CSS',
    level: 1,
    category: 'Frontend',
    projectIds: ['portfolio-dev']
  },

  // Backend
  {
    name: 'Python',
    level: 4,
    category: 'Backend',
    projectIds: ['blazing-adoptions']
  },
  {
    name: 'Java',
    level: 2,
    category: 'Backend',
    projectIds: ['drone-automation']
  },
  {
    name: 'C',
    level: 1,
    category: 'Backend',
  },
  {
    name: 'C++',
    level: 1,
    category: 'Backend',
    projectIds: ['gearshift']
  },
  {
    name: 'Go',
    level: 2,
    category: 'Backend',
  },
  {
    name: 'Flask',
    level: 2,
    category: 'Backend',
    projectIds: ['blazing-adoptions']
  },
  {
    name: 'MySQL',
    level: 2,
    category: 'Backend',
    projectIds: ['blazing-adoptions', 'ollama-chat']
  },
  {
    name: 'PostgreSQL',
    level: 1,
    category: 'Backend',
  },

  // Cloud
  {
    name: 'Google Cloud Run',
    level: 3,
    category: 'Cloud',
    projectIds: ['blazing-adoptions']
  },
  {
    name: 'BigQuery',
    level: 3,
    category: 'Cloud',
  },
  {
    name: 'Terraform',
    level: 2,
    category: 'Cloud',
  },
  {
    name: 'Google Cloud Apigee',
    level: 4,
    category: 'Cloud',
  },

  // DevOps
  {
    name: 'Docker',
    level: 2,
    category: 'DevOps',
    projectIds: ['blazing-adoptions', 'ollama-chat', 'portfolio-dev']
  },
  {
    name: 'CI/CD Pipelines',
    level: 4,
    category: 'DevOps',
    projectIds: ['blazing-adoptions', 'portfolio-dev']
  },
];

export const skillCategories: ('All' | SkillCategory)[] = ['All', 'Frontend', 'Backend', 'Cloud', 'DevOps'];

export const skillLevelDefinitions: Record<Skill['level'], string> = {
  1: 'Novice – follows tutorials and completes guided tasks',
  2: 'Practitioner – builds small features independently; basic testing/tooling',
  3: 'Competent – ships production features end-to-end; on-call/debugging',
  4: 'Proficient – designs components; improves performance/reliability; mentors',
  5: 'Expert – sets patterns and practices; solves novel problems; publishes/shares',
};
