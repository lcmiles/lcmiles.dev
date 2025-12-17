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
        description: 'A JavaFX dashboard for automating agricultural data collection with drones. Features animated flight visualization, simulated data collection for pests, livestock, crops, and soil moisture, and hierarchical item/container management with customizable flight plans.',
        image: '/projects/project-2.png',
        tags: ['JavaFX', 'OOP', 'Software Engineering'],
        skills: ['Java'],
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
    description: 'Semester-long group project for CS-499 Capstone. The goal of this project was to develop a web application to streamline the pet adoption process and make it more user-friendly. Deployed on Google Cloud Run with GitOps. Features include real-time search, user authentication, and admin dashboard for managing adoption listings.',
    image: '/projects/project-1.png',
    tags: ['Google Cloud Hosted', 'GitOps', 'User Authentication', 'Full-stack'],
    skills: ['Python', 'HTML/CSS', 'SQL', 'Docker', 'CI/CD', 'Flask', 'JavaScript', 'Tailwind CSS', 'Google Cloud Run'],
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
    description: 'A 3D puzzle game built with Unreal Engine. GearShift is a factory-based puzzle game. You play as a robot in a broken down factory, and your task is to fix up any broken machinery or faulty equipment you find in order to progress to the next level.',
    image: '/projects/project-3.png',
    tags: ['Unreal Engine 5', 'Game Development', '3D Graphics'],
    skills: ['C++'],
    links: [
      { label: 'GitHub', href: 'https://github.com/lcmiles/cs-476-final-project', external: true },
      { label: 'Trailer', href: 'https://youtu.be/kRr7yWkFJJY', external: true },
      { label: 'Download', href: '/api/download/GearShift_Windows_v2.zip', external: false }
    ],
    featured: true,
    year: 2024
  },
  {
    id: 'ollama-chat',
    title: 'Ollama Chat',
    description: 'A self-hosted AI chat interface powered by Ollama for running large language models locally. Features real-time streaming responses, conversation history, and support for multiple LLM models. Deployed on personal Ubuntu server infrastructure.',
    image: '/projects/project-4.png',
    tags: ['AI', 'Self-Hosted', 'LLM', 'Web Development', 'Full-Stack'],
    skills: ['Python', 'Docker'],
    links: [
      { label: 'GitHub', href: 'https://github.com/lcmiles/ollama-chat', external: true },
      { label: 'Live Demo', href: 'http://lcmiles.dev/chat', external: true }
    ],
    year: 2025
  },
  {
    id: 'portfolio-dev',
    title: 'Developer Portfolio',
    description: 'A modern, dynamic portfolio built with Next.js 15, TypeScript, and Tailwind CSS. Features animated starfield background with shooting stars, real-time GitHub metrics integration, contact form with Resend API, and fully responsive design with dark theme. Deployed on personal Ubuntu server infrastructure.',
    image: '/projects/project-5.png',
    tags: ['Framer Motion', 'Web Development', 'Self-Hosted'],
    skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Docker', 'Node.js', 'HTML/CSS'],
    links: [
      { label: 'GitHub', href: 'https://github.com/lcmiles/lcmiles.dev', external: true },
      
    ],
    featured: true,
    year: 2025
  }
];

export const featuredProjects = projects.filter(p => p.featured);
