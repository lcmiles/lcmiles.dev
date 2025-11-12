'use client';

import { Navigation } from '@/components/Navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { aboutData } from '@/data/about';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navigation />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-4 pb-2 leading-tight">
              About Me
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              {aboutData.title}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Profile Picture */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-1 flex justify-center"
            >
              <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-4 border-cyan-500/30 shadow-xl shadow-cyan-500/20">
                <Image
                  src={aboutData.profileImage}
                  alt={aboutData.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>

            {/* Quick Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 flex items-start gap-4">
                <img src={aboutData.currentPosition.icon} alt="Briefcase icon" className="w-10 h-10 opacity-90" />
                <div>
                  <h3 className="text-lg font-bold text-slate-100 mb-1">{aboutData.currentPosition.label}</h3>
                  <p className="text-slate-400 whitespace-pre-line">{aboutData.currentPosition.value}</p>
                </div>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 flex items-start gap-4">
                <img src={aboutData.education.icon} alt="Graduation cap icon" className="w-10 h-10 opacity-90" />
                <div>
                  <h3 className="text-lg font-bold text-slate-100 mb-1">{aboutData.education.label}</h3>
                  <p className="text-slate-400 whitespace-pre-line">{aboutData.education.value}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Biography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8 space-y-6"
          >
            {aboutData.paragraphs.map((para, idx) => (
              <p key={idx} className="text-slate-300 leading-relaxed text-lg">
                {para}
              </p>
            ))}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
