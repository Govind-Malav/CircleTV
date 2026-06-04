import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Dropdown = ({ trigger, items = [], align = 'left', className = '' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className={`absolute z-50 mt-1 min-w-[160px] bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            {items.map((item, i) =>
              item.divider ? (
                <div key={i} className="my-1 border-t border-gray-800" />
              ) : (
                <button
                  key={i}
                  onClick={() => { item.onClick?.(); setOpen(false); }}
                  disabled={item.disabled}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors ${
                    item.danger
                      ? 'text-red-400 hover:bg-red-500/10'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  } ${item.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  {item.label}
                </button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
