import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const isOverviewPage = location.pathname === '/overview';

  return (
    <nav className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-4 font-medium" aria-label="Breadcrumb">
      <Link
        to="/overview"
        className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {!isOverviewPage && (
        <>
          <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />
          <Link to="/overview" className="hover:text-[var(--text-primary)] transition-colors">
            Overview
          </Link>
        </>
      )}

      {pathnames.map((value, index) => {
        if (value === 'overview') {
          return (
            <React.Fragment key="/overview">
              <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />
              <span className="text-[var(--info)] font-semibold">Overview</span>
            </React.Fragment>
          );
        }

        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const name = value.charAt(0).toUpperCase() + value.slice(1);

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />
            {isLast ? (
              <span className="text-[var(--info)] font-semibold">{name}</span>
            ) : (
              <Link to={to} className="hover:text-[var(--text-primary)] transition-colors">
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
