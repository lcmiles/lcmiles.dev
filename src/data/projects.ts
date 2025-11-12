// Centralized projects data migrated from lcmiles.github.io
export interface ProjectLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  tags: string[];
  skills?: string[];
  links: ProjectLink[];
  featured?: boolean;
  year?: number;
}

export const projects: Project[] = [
    {
        id: 'drone-automation',
        title: 'Agricultural Drone Automation System',
        subtitle: 'CS-420 Software Engineering',
        description: 'An automated drone control system for precision agriculture. Implements path planning algorithms, real-time telemetry, and crop monitoring capabilities. Developed using software engineering best practices including requirements analysis, system design, and testing.',
        image: '/projects/project-2.png',
        tags: ['Python', 'JavaFX', 'OOP', 'Software Engineering'],
        skills: ['Python', 'Git'],
        links: [
        { label: 'GitHub', href: 'https://github.com/lcmiles/CS-420-Final-Project', external: true }
        ],
        featured: true,
        year: 2023
    },  
    {
    id: 'blazing-adoptions',
    title: 'Blazing Adoptions',
    subtitle: 'CS-499 Capstone',
    description: 'A full-stack web application for pet adoption management. Built with React, Node.js, and MongoDB, deployed on Google Cloud Run with CI/CD pipeline. Features include real-time search, user authentication, and admin dashboard for managing adoption listings.',
    image: '/projects/project-1.png',
    tags: ['Flask', 'HTML/CSS', 'SQL', 'Google Cloud', 'Docker', 'CI/CD'],
    skills: ['Python', 'HTML/CSS', 'SQL', 'Docker', 'Git', 'CI/CD', 'React', 'JavaScript', 'Tailwind CSS'],
    links: [
      { label: 'GitHub', href: 'https://github.com/lcmiles/CS-499-Capstone', external: true },
      { label: 'Live Demo', href: 'https://cs-499-capstone-380384151340.us-central1.run.app/', external: true }
    ],
    featured: true,
    year: 2024
  },
  {
    id: 'gearshift',
    title: 'GearShift',
    subtitle: 'CS-476 Game Development',
    description: 'A 3D racing game built with Unreal Engine featuring custom vehicle physics, procedurally generated tracks, and multiplayer capabilities. Showcases advanced game development techniques including shader programming, particle systems, and networked gameplay.',
    image: '/projects/project-3.png',
    tags: ['Unreal Engine', 'C++', 'Game Development', '3D Graphics'],
    skills: ['Git', 'JavaScript'],
    links: [
      { label: 'GitHub', href: 'https://github.com/lcmiles/cs-476-final-project', external: true },
      { label: 'Trailer', href: 'https://youtu.be/kRr7yWkFJJY', external: true },
      { label: 'Download', href: 'http://logansserver1511.duckdns.org/GearShift/', external: true }
    ],
    featured: true,
    year: 2024
  },
  {
    id: 'ollama-chat',
    title: 'Ollama Chat',
    description: 'A self-hosted AI chat interface powered by Ollama for running large language models locally. Features real-time streaming responses, conversation history, and support for multiple LLM models. Deployed on personal Ubuntu server infrastructure.',
    image: '/projects/project-4.png',
    tags: ['AI', 'Python', 'Self-Hosted', 'LLM', 'Web Development', 'Full-Stack'],
    skills: ['Python', 'Docker', 'Linux', 'Git', 'JavaScript'],
    links: [
      { label: 'GitHub', href: 'https://github.com/lcmiles/ollama-chat', external: true },
      { label: 'Live Demo', href: 'http://logansserver1511.duckdns.org:8090', external: true }
    ],
    year: 2025
  },
  {
    id: 'portfolio-dev',
    title: 'Developer Portfolio',
    description: 'A modern, dynamic portfolio built with Next.js 15, TypeScript, and Tailwind CSS. Features animated starfield background with shooting stars, real-time GitHub metrics integration, contact form with Resend API, and fully responsive design with dark theme. Deployed with Docker and includes CI/CD pipeline.',
    image: '/projects/project-5.png',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Docker', 'Resend API'],
    skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'Docker', 'Git', 'Linux', 'CI/CD', 'Node.js', 'HTML/CSS'],
    links: [
      { label: 'GitHub', href: 'https://github.com/lcmiles/lcmiles.dev', external: true },
      { label: 'Live Site', href: 'https://lcmiles.dev', external: true }
    ],
    featured: true,
    year: 2025
  }
];

export const featuredProjects = projects.filter(p => p.featured);
