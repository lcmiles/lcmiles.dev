'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Starfield from './Starfield';

export default function Hero() {
  const [displayedName, setDisplayedName] = useState('');
  const fullName = 'Logan Miles';

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullName.length) {
        setDisplayedName(fullName.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100); // Speed of typing (100ms per character)

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center px-4 overflow-hidden -mt-20">
      {/* Starfield background */}
      <Starfield className="fixed inset-0 z-0 pointer-events-none" density={0.18} twinkleSpeed={1.1} driftSpeed={5} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Name with Typewriter Effect */}
          <motion.h1
            className="text-4xl sm:text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 min-h-[1.2em]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {displayedName}
            <motion.span
              className="inline-block w-1 h-[0.8em] bg-cyan-400 ml-1 align-middle"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </motion.h1>

          {/* Title */}
          <motion.p
            className="text-xl sm:text-2xl md:text-4xl text-slate-300 font-light px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Software Engineer & Tech Enthusiast
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Building effecient and secure cloud-native, full-stack systems.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link
              href="/projects"
              className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105 text-center"
            >
              <span className="relative z-10">View Projects</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 border-2 border-slate-600 text-slate-300 font-semibold rounded-lg hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 text-center"
            >
              Get in Touch
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
