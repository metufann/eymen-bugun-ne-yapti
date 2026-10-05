import React from 'react';
import { LgsCountdown } from './LgsCountdown';

export type TabType = 'today' | 'history' | 'stats' | 'settings';

interface HeaderProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  daysRemaining: number;
  lgsDate: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  daysRemaining,
  lgsDate,
}) => {
  const tabs = [
    { id: 'today' as TabType, label: 'Bugün' },
    { id: 'history' as TabType, label: 'Geçmiş' },
    { id: 'stats' as TabType, label: 'İstatistikler' },
    { id: 'settings' as TabType, label: 'Ayarlar' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm tracking-tight">
            E
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-slate-900">
              eymenbugunneyapti
            </h1>
            <p className="text-[11px] text-slate-500 leading-none">
              LGS Çalışma Takibi
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'text-primary bg-primary-muted font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right side countdown */}
        <LgsCountdown daysRemaining={daysRemaining} lgsDate={lgsDate} />
      </div>
    </header>
  );
};
