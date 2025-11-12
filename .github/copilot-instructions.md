# Logan Miles Developer Portfolio - Project Instructions

## Project Overview
A modern, dynamic developer portfolio built with Next.js 15, React, TypeScript, and Tailwind CSS.

## Setup Status
- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements - Next.js portfolio with GitHub metrics, projects, skills, and contact pages
- [x] Scaffold the Project - Created Next.js 15 with TypeScript, Tailwind CSS, App Router
- [x] Customize the Project - Added Hero, Navigation, Projects, Skills, Metrics, Contact pages
- [x] Install Required Extensions - No specific extensions required
- [x] Compile the Project - Dependencies installed, framer-motion added
- [x] Create and Run Task - Development server running on port 3003
- [x] Launch the Project - Server is running at http://localhost:3003
- [x] Ensure Documentation is Complete - README.md updated with full documentation

## Tech Stack
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Docker & docker-compose
- GitHub API integration

## Project Structure
- `/src/app` - Next.js pages (home, projects, skills, metrics, contact)
- `/src/components` - Reusable components (Hero, Navigation)
- `Dockerfile` & `docker-compose.yml` - Container configuration
- `.env.example` - Environment variable template

## Development
- Server runs on port 3003 (3000 was in use)
- GitHub metrics fetch from public API
- Dark theme with slate/cyan/blue color scheme
- Fully responsive design

## Next Steps for Customization
1. Update GitHub username in metrics page
2. Add your projects to projects page
3. Customize skills in skills page
4. Update contact information and social links
5. Add profile picture and assets to public folder
6. Optional: Add GitHub token to .env for higher API rate limits

## Development Rules
1. Keep comments to a minimum. Only add them at the beginning of functions or to add important context.
2. Don't use emojis