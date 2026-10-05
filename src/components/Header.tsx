import React from 'react';
import { LgsCountdown } from './LgsCountdown';
import { Sparkles, CalendarDays, BarChart3, Settings as SettingsIcon, LayoutGrid } from 'lucide-react';

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
    { id: 'today' as TabType, label: 'Bugün', icon: LayoutGrid },
    { id: 'history' as TabType, label: 'Geçmiş', icon: CalendarDays },
    { id: 'stats' as TabType, label: 'İstatistikler', icon: BarChart3 },
    { id: 'settings' as TabType, label: 'Ayarlar', icon: SettingsIcon },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-surface-200/80 border-b border-white/5 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-accent-teal flex items-center justify-center text-white shadow-glow-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
              eymenbugunneyapti
              <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-primary/20 text-primary-light border border-primary/30">
                LGS PRO
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Günlük LGS Çalışma & Başarı Takip Sistemi
            </p>
          </div>
        </div>

        {/* Center / Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl bg-surface-100/70 border border-white/5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-glow-primary scale-[1.02]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right side LGS Countdown Badge */}
        <div className="flex items-center gap-3">
          <LgsCountdown daysRemaining={daysRemaining} lgsDate={lgsDate} />
        </div>
      </div>
    </header>
  );
};
