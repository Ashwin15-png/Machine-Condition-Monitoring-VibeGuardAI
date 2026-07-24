import React from 'react';
import { clsx } from 'clsx';

export const Skeleton = ({ className = '', count = 1, ...props }) => {
  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, idx) => (
        <div
          key={idx}
          className={clsx(
            'animate-pulse rounded-xl bg-slate-800/60 border border-slate-700/20',
            className
          )}
          {...props}
        />
      ))}
    </>
  );
};

export const CardSkeleton = () => (
  <div className="rounded-2xl border border-slate-800 bg-[#111827]/90 p-5 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
    <Skeleton className="h-8 w-1/2" />
    <Skeleton className="h-3 w-2/3" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="w-full space-y-3">
    <Skeleton className="h-10 w-full rounded-xl" />
    {Array.from({ length: rows }).map((_, idx) => (
      <Skeleton key={idx} className="h-12 w-full rounded-xl" />
    ))}
  </div>
);

export default Skeleton;
