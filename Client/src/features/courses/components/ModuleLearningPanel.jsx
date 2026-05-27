import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Video, Code2, GitBranch, BookOpen, ExternalLink, ClipboardList } from 'lucide-react';
import { MODULE_STATUS_STYLES } from '../coursesData';

const ModuleLearningPanel = ({ module, onClose }) => {
  if (!module) return null;
  const c = module.content || {};

  const sections = [
    { key: 'sessions', label: 'Recorded Sessions', icon: Video, items: c.sessions },
    { key: 'pdfs', label: 'PDFs & Notes', icon: FileText, items: c.pdfs },
    { key: 'videos', label: 'Video Resources', icon: Video, items: c.videos },
    { key: 'docs', label: 'Documentation', icon: BookOpen, items: c.docs },
    { key: 'exercises', label: 'Coding Exercises', icon: Code2, items: c.exercises },
    { key: 'github', label: 'GitHub References', icon: GitBranch, items: c.github },
    { key: 'assignments', label: 'Assignments', icon: ClipboardList, items: c.assignments },
    { key: 'reviewPrep', label: 'Review Preparation', icon: FileText, items: c.reviewPrep },
    { key: 'roadmap', label: 'Module Roadmap', icon: BookOpen, items: c.roadmap },
  ].filter((s) => s.items?.length);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex justify-end"
        role="dialog"
        aria-modal="true"
        aria-label="Module learning workspace"
      >
        <button type="button" className="absolute inset-0 bg-brand-charcoal/40" onClick={onClose} aria-label="Close" />
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative w-full max-w-lg bg-white border-l border-gray-200 shadow-xl h-full overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex justify-between gap-3 z-10">
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-brand-gray uppercase">{module.code} · {module.type}</p>
              <h2 className="text-sm font-black text-brand-charcoal">{module.name}</h2>
            </div>
            <button type="button" onClick={onClose} className="p-1.5 border border-gray-200 rounded-md hover:bg-brand-light" aria-label="Close">
              <X size={16} />
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${MODULE_STATUS_STYLES[module.status]}`}>
                {module.status.replace('_', ' ')}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-gray-200 bg-brand-light">{module.difficulty}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-sm overflow-hidden">
              <div className="h-full bg-brand-orange rounded-sm" style={{ width: `${module.progress}%` }} />
            </div>
            {sections.length === 0 ? (
              <p className="text-xs text-brand-gray py-8 text-center">Module locked or content not yet released.</p>
            ) : (
              sections.map(({ label, icon: Icon, items }) => (
                <div key={label}>
                  <h3 className="text-[10px] font-bold text-brand-gray uppercase mb-2 flex items-center gap-1">
                    <Icon size={12} className="text-brand-orange" />
                    {label}
                  </h3>
                  <ul className="space-y-1.5">
                    {items.map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="flex items-center gap-2 p-2 border border-gray-200 rounded-md hover:border-brand-orange/40 text-xs font-semibold text-brand-charcoal transition-colors"
                        >
                          <span className="truncate flex-1">{item}</span>
                          <ExternalLink size={11} className="text-brand-gray shrink-0" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </motion.aside>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModuleLearningPanel;
