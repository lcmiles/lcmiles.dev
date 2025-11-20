'use client';

import { Navigation } from '@/components/Navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { aboutData } from '@/data/about';
import { contactData } from '@/data/contact';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navigation />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-4 pb-2 leading-tight">
              About Me
            </h1>
            <p className="text-xl text-slate-400">
              {aboutData.title}
            </p>
          </motion.div>

          {/* Main Content Area */}
          <div className="grid lg:grid-cols-[320px_1fr] gap-8 lg:gap-12">
            {/* Left Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Profile Picture */}
              <div className="relative w-full aspect-square max-w-[320px] mx-auto rounded-2xl overflow-hidden border-4 border-cyan-500/30 shadow-xl shadow-cyan-500/20">
                <Image
                  src={aboutData.profileImage}
                  alt={aboutData.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Info Cards */}
              <div className="space-y-4">
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-5 hover:border-cyan-500/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={aboutData.currentPosition.icon} alt="Briefcase icon" className="w-6 h-6 opacity-90" />
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">{aboutData.currentPosition.label}</h3>
                  </div>
                  <p className="text-slate-300 whitespace-pre-line leading-relaxed">{aboutData.currentPosition.value}</p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-5 hover:border-cyan-500/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={aboutData.education.icon} alt="Graduation cap icon" className="w-6 h-6 opacity-90" />
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">{aboutData.education.label}</h3>
                  </div>
                  <p className="text-slate-300 whitespace-pre-line leading-relaxed">{aboutData.education.value}</p>
                </div>
              </div>

              {/* Resume / Transcript Buttons */}
              <div className="space-y-3">
                {aboutData.resumeUrl && (
                  <a
                    href={aboutData.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-center shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Download Resume</span>
                    </div>
                  </a>
                )}
                {aboutData.transcriptUrl && (
                  <a
                    href={aboutData.transcriptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-center border border-slate-700 hover:border-slate-600"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Download Transcript</span>
                    </div>
                  </a>
                )}
              </div>

              {/* Social Media Links */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider text-center">My Socials</h3>
                <div className="flex gap-3 justify-center">
                  {contactData.links
                    .filter(link => link.id === 'x' || link.id === 'instagram')
                    .map((link) => (
                      <a
                        key={link.id}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.ariaLabel}
                        className="flex-1 bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 transition-all duration-300 flex items-center justify-center group"
                      >
                        <img 
                          src={link.icon} 
                          alt={link.label}
                          className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity duration-300 invert"
                        />
                      </a>
                    ))
                  }
                </div>
              </div>
            </motion.div>

            {/* Right Content - Biography */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-xl p-8 space-y-6"
            >
              {aboutData.paragraphs.map((para, idx) => (
                <p key={idx} className="text-slate-300 leading-relaxed text-lg">
                  {para}
                </p>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
