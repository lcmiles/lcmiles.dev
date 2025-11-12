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
    "Outside of work, I enjoy building personal projects that deepen my technical skills. I manage a personal Ubuntu server for home automation and other self-hosted applications. I also enjoy building custom gaming rigs, optimizing system performance, and diving into the latest trends in computer hardware. I'm passionate about performance optimization and system automation—whether in the cloud or on my own hardware.",
    "Feel free to connect with me if you share similar interests or want to collaborate on exciting projects—I'm always eager to learn and grow with others in the tech community!",
  ],
};
