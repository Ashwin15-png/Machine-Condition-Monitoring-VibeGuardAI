import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

export const Dropdown = ({ trigger, children, align = 'right', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.15 }}
            className={clsx(
              'absolute z-50 mt-2 min-w-[12rem] rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] shadow-2xl p-1 backdrop-blur-md',
              align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
              className
            )}
            onClick={() => setIsOpen(false)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DropdownItem = ({ children, icon: Icon, onClick, danger = false, className = '' }) => (
  <button
    onClick={onClick}
    className={clsx(
      'w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-2.5 transition-colors duration-150',
      danger
        ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]',
      className
    )}
  >
    {Icon && <Icon className="w-4 h-4 text-[var(--text-muted)]" />}
    <span>{children}</span>
  </button>
);

export default Dropdown;
