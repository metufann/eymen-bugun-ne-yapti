import React from 'react';

export const TaskCardSkeleton: React.FC = () => {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/5 animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 bg-white/10 rounded-lg"></div>
        <div className="h-7 w-24 bg-white/10 rounded-full"></div>
      </div>
      <div className="grid grid-cols-4 gap-2 pt-2">
        <div className="h-10 bg-white/5 rounded-xl"></div>
        <div className="h-10 bg-white/5 rounded-xl"></div>
        <div className="h-10 bg-white/5 rounded-xl"></div>
        <div className="h-10 bg-white/5 rounded-xl"></div>
      </div>
      <div className="h-11 w-full bg-white/10 rounded-xl"></div>
    </div>
  );
};

export const SummarySkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="glass-panel rounded-2xl p-4 border border-white/5 h-24">
          <div className="h-4 w-16 bg-white/10 rounded mb-2"></div>
          <div className="h-7 w-12 bg-white/15 rounded"></div>
        </div>
      ))}
    </div>
  );
};
