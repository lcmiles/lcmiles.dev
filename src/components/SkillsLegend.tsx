"use client";

import { AnimatePresence, motion } from "framer-motion";

interface SkillsLegendProps {
  isOpen: boolean;
  onClose: () => void;
  definitions: { [level: number]: string };
}

export function SkillsLegend({ isOpen, onClose, definitions }: SkillsLegendProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Close legend"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6">
              <h3 className="text-2xl font-bold text-slate-100 mb-4">What do levels mean?</h3>
              <p className="text-slate-400 mb-6">Levels are anchored to real outcomes and responsibilities.</p>

              <div className="space-y-4">
                {([1,2,3,4,5] as const).map((lvl) => (
                  <div key={lvl} className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/50">
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center">
                      {lvl}
                    </div>
                    <div className="text-slate-300">
                      <div className="text-slate-400">{definitions[lvl]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
