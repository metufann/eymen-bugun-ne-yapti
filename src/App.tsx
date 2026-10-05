import React, { useState } from 'react';
import { Header, type TabType } from './components/Header';
import { Ps5Progress } from './components/Ps5Progress';
import { Dashboard } from './pages/Dashboard';
import { History } from './pages/History';
import { Statistics } from './pages/Statistics';
import { SettingsPage } from './pages/Settings';
import { useStudyData } from './hooks/useStudyData';
import { useSettings } from './hooks/useSettings';
import { AlertCircle, RefreshCw, LayoutGrid, CalendarDays, BarChart3, Settings as SettingsIcon } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('today');

  const {
    studies,
    todayStudies,
    todaySummary,
    todayProgress,
    loading: studiesLoading,
    error: studiesError,
    addStudy,
    toggleComplete,
    refreshStudies,
    isConfigured,
  } = useStudyData();

  const {
    settings,
    lgsDate,
    daysRemaining,
    updateLgsDate,
  } = useSettings();

  const tabs = [
    { id: 'today' as TabType, label: 'Bugün', icon: LayoutGrid },
    { id: 'history' as TabType, label: 'Geçmiş', icon: CalendarDays },
    { id: 'stats' as TabType, label: 'İstatistikler', icon: BarChart3 },
    { id: 'settings' as TabType, label: 'Ayarlar', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col relative selection:bg-primary/30 selection:text-white ambient-glow">
      {/* Top Navbar */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        daysRemaining={daysRemaining}
        lgsDate={lgsDate}
      />

      {/* Supabase Not Configured Warning Banner */}
      {!isConfigured && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3 text-center">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-xs text-amber-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              <strong>Supabase bağlantısı yapılandırılmamış:</strong> Lütfen proje ana dizinindeki <code>.env</code> dosyasındaki Supabase URL ve Anon Key değerlerini tanımlayın.
            </span>
          </div>
        </div>
      )}

      {/* Main Error Banner */}
      {studiesError && (
        <div className="max-w-4xl mx-auto mt-4 px-4 w-full">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Veriler yüklenirken bir sorun oluştu.</span>
            </div>
            <button
              onClick={refreshStudies}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-white font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Tekrar Dene
            </button>
          </div>
        </div>
      )}

      {/* Page Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 pb-28 sm:pb-24">
        {currentTab === 'today' && (
          <Dashboard
            todayStudies={todayStudies}
            todaySummary={todaySummary}
            loading={studiesLoading}
            onToggleComplete={toggleComplete}
            onAddStudy={addStudy}
          />
        )}

        {currentTab === 'history' && (
          <History studies={studies} loading={studiesLoading} />
        )}

        {currentTab === 'stats' && (
          <Statistics studies={studies} />
        )}

        {currentTab === 'settings' && (
          <SettingsPage
            settings={settings}
            onUpdateLgsDate={updateLgsDate}
            isConfigured={isConfigured}
          />
        )}
      </main>

      {/* PS5-inspired discrete floating progress bar */}
      <Ps5Progress
        progress={todayProgress}
        completedTasks={todaySummary.totalCompleted}
        totalTasks={todaySummary.totalTasks}
      />

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-200/90 backdrop-blur-xl border-t border-white/5 px-2 py-2">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-primary-light font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary scale-110' : ''}`} />
                <span className="text-[10px] tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
