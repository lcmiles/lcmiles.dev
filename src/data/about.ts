// Centralized About Me content for the portfolio.
// Update this file to change profile details and biography content.

export interface QuickInfo {
  label: string;
  value: string;
  icon?: string; // optional emoji or icon path
}

export interface AboutData {
  name: string;
  title: string;
  profileImage: string; // path under /public
  currentPosition: QuickInfo;
  education: QuickInfo;
  paragraphs: string[];
  resumeUrl?: string; // URL to resume/CV file
  transcriptUrl?: string; // URL to academic transcript
}

export const aboutData: AboutData = {
  name: 'Logan Miles',
  title: 'Software Engineer & Tech Enthusiast',
  profileImage: '/assets/profile_pic.JPG',
  currentPosition: {
    label: 'Current Position',
    value: 'Software Engineer\nRegions',
    icon: '/icons/briefcase.svg',
  },
  education: {
    label: 'Education',
    value: 'B.S. Computer Science\nUAB (2025)',
    icon: '/icons/cap.svg',
  },
  paragraphs: [
    "I'm a programming and full-stack development enthusiast with a passion for creative tech projects. I recently graduated Magna Cum Laude with Distinguished Honors from the University of Alabama at Birmingham, earning a Bachelor of Science in Computer Science. My academic journey gave me a strong foundation in programming languages like Java, Python, and C, and fueled my interests in web development, game development, algorithms, and problem-solving.",
    "I'm currently working full time as a Software Engineer at Regions, focusing on building full‑stack customer authentication and identity management systems. My work spans secure backend services and identity flows as well as the front‑end experiences that integrate them, with an emphasis on reliability, performance, and security best practices.",
    "What drives my passion for software development is the ability to transform ideas into tangible solutions that make a real impact. There's something incredibly rewarding about solving complex problems through elegant code and seeing users benefit from the systems I build. I'm fascinated by the constant evolution of technology—every challenge is an opportunity to learn something new, whether it's mastering a cutting-edge framework or discovering more efficient ways to architect solutions. The creative aspect of development excites me most: combining logic, design, and innovation to build tools that weren't possible before.",
    "Outside of work, I enjoy building personal projects that deepen my technical skills. I experiment and develop on a personal Ubuntu server for home automation and other self-hosted applications. I also enjoy building custom gaming rigs, optimizing system performance, and diving into the latest trends in computer hardware. I'm passionate about performance optimization and system automation—whether in the cloud or on my own hardware.",
    "Feel free to connect with me if you share similar interests or want to collaborate on exciting projects—I'm always eager to learn and grow with others in the tech community!",
  ],
  resumeUrl: 'https://lcmiles.dev/files/Resume%20-%202025.pdf',
  transcriptUrl: 'https://lcmiles.dev/files/Unofficial%20Academic%20Transcript%202025.pdf',
};
