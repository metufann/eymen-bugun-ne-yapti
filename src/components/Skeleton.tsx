import React from 'react';

export const TaskCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 bg-slate-200 rounded"></div>
        <div className="h-6 w-16 bg-slate-200 rounded-md"></div>
      </div>
      <div className="h-3 w-40 bg-slate-100 rounded"></div>
    </div>
  );
};

export const SummarySkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white rounded-xl p-3.5 border border-slate-200 h-20">
          <div className="h-3 w-16 bg-slate-200 rounded mb-2"></div>
          <div className="h-6 w-10 bg-slate-100 rounded"></div>
        </div>
      ))}
    </div>
  );
};
