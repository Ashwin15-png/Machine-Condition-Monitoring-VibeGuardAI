import React from 'react';
import { APP_CONFIG } from '../../utils/constants';

export const Footer = () => {
  return (
    <footer className="w-full mt-8 py-4 px-6 border-t border-[var(--border)] text-xs text-[var(--text-muted)] flex flex-col sm:flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
        <span>VibeGuard Edge Gateway: Online</span>
      </div>
      <div>
        © {new Date().getFullYear()} {APP_CONFIG.COMPANY}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
