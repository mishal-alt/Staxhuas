import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GitBranch, Upload, MessageSquare, FileText, ExternalLink } from 'lucide-react';
import { PRIORITY_STYLES, STATUS_STYLES } from '../tasksData';

const TaskDetailPanel = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex justify-end"
        role="dialog"
        aria-modal="true"
        aria-label="Task details"
      >
        <button
          type="button"
          className="absolute inset-0 bg-brand-charcoal/40"
          onClick={onClose}
          aria-label="Close panel"
        />
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative w-full max-w-md md:max-w-lg bg-white border-l border-gray-200 shadow-xl overflow-y-auto h-full"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-start justify-between gap-3 z-10">
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-brand-gray uppercase">{task.type} · {task.module}</p>
              <h2 className="text-sm font-black text-brand-charcoal leading-snug mt-0.5">{task.title}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md border border-gray-200 hover:bg-brand-light transition-colors shrink-0"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${PRIORITY_STYLES[task.priority]}`}>
                {task.priority}
              </span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${STATUS_STYLES[task.status]}`}>
                {task.status.replace('_', ' ')}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-gray-200 bg-brand-light text-brand-charcoal">
                {task.difficulty}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {[
                ['Assigned by', task.assignedBy],
                ['Due', task.dueDate],
                ['Est. time', `${task.estHours}h`],
                ['Eval weight', `${task.evalWeight}%`],
                ['Impact', task.impact],
                ['Progress', `${task.progress}%`],
              ].map(([label, val]) => (
                <div key={label} className="p-2 border border-gray-200 rounded-md bg-brand-light/50">
                  <span className="text-brand-gray font-semibold block">{label}</span>
                  <span className="font-bold text-brand-charcoal">{val}</span>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-brand-gray uppercase mb-1">Description</h3>
              <p className="text-xs text-brand-charcoal leading-relaxed">{task.description}</p>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-brand-gray uppercase mb-1">Learning Outcomes</h3>
              <ul className="list-disc list-inside text-xs text-brand-charcoal space-y-0.5">
                {task.outcomes.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-brand-gray uppercase mb-1">Facilitator Instructions</h3>
              <p className="text-xs text-brand-charcoal bg-brand-light p-2 rounded-md border border-gray-200">
                {task.instructions}
              </p>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-brand-gray uppercase mb-1">Evaluation Rubric</h3>
              <p className="text-xs text-brand-gray">{task.rubric}</p>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-brand-gray uppercase mb-2">Attached Resources</h3>
              <div className="space-y-1.5">
                {task.resources.map((r) => (
                  <a
                    key={r}
                    href="#"
                    className="flex items-center gap-2 p-2 border border-gray-200 rounded-md hover:border-brand-orange/40 text-xs font-semibold text-brand-charcoal transition-colors"
                  >
                    <FileText size={13} className="text-brand-orange shrink-0" />
                    {r}
                    <ExternalLink size={11} className="ml-auto text-brand-gray" />
                  </a>
                ))}
              </div>
            </div>

            {task.github !== 'n/a' && (
              <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md">
                <GitBranch size={14} className="text-brand-charcoal" />
                <span className="text-xs font-semibold">GitHub: {task.github}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-white bg-brand-orange rounded-md hover:opacity-90 transition-opacity"
              >
                <Upload size={13} />
                Upload Submission
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold border border-gray-200 rounded-md hover:bg-brand-light transition-colors"
              >
                <GitBranch size={13} />
                Link Repository
              </button>
            </div>

            {task.submissions.length > 0 && (
              <div>
                <h3 className="text-[10px] font-bold text-brand-gray uppercase mb-2">Submission History</h3>
                {task.submissions.map((s, i) => (
                  <div key={i} className="p-2 border border-gray-200 rounded-md text-xs mb-1.5">
                    <span className="font-bold text-brand-charcoal">{s.date}</span>
                    <span className="text-brand-gray"> · {s.status}</span>
                    {s.note && <p className="text-brand-gray mt-0.5">{s.note}</p>}
                  </div>
                ))}
              </div>
            )}

            {task.comments.length > 0 && (
              <div>
                <h3 className="text-[10px] font-bold text-brand-gray uppercase mb-2 flex items-center gap-1">
                  <MessageSquare size={12} />
                  Discussion
                </h3>
                {task.comments.map((c, i) => (
                  <div key={i} className="p-2 bg-brand-light border border-gray-200 rounded-md text-xs mb-1.5">
                    <p className="font-bold text-brand-charcoal">{c.author}</p>
                    <p className="text-brand-charcoal mt-0.5">{c.text}</p>
                    <p className="text-[10px] text-brand-gray mt-1">{c.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.aside>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskDetailPanel;
