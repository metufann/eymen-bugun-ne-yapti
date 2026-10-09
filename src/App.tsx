import React, { useState } from 'react';
import { Header, type TabType } from './components/Header';
import { Ps5Progress } from './components/Ps5Progress';
import { Dashboard } from './pages/Dashboard';
import { History } from './pages/History';
import { Statistics } from './pages/Statistics';
import { SettingsPage } from './pages/Settings';
import { useStudyData } from './hooks/useStudyData';
import { useSettings } from './hooks/useSettings';
import { AlertCircle, RefreshCw } from 'lucide-react';

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
    completeStudy,
    deleteStudy,
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
    { id: 'today' as TabType, label: 'Bugün' },
    { id: 'history' as TabType, label: 'Geçmiş' },
    { id: 'stats' as TabType, label: 'İstatistikler' },
    { id: 'settings' as TabType, label: 'Ayarlar' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        daysRemaining={daysRemaining}
        lgsDate={lgsDate}
      />

      {/* Supabase Not Configured Warning Banner */}
      {!isConfigured && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-center">
          <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
            <span>
              <strong>Veritabanı yapılandırması eksik:</strong> Lütfen proje ana dizinindeki <code>.env</code> dosyasındaki Supabase URL ve Anon Key değerlerini tanımlayın.
            </span>
          </div>
        </div>
      )}

      {/* Main Error Banner */}
      {studiesError && (
        <div className="max-w-5xl mx-auto mt-4 px-4 w-full">
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>Veriler yüklenirken bir sorun oluştu.</span>
            </div>
            <button
              onClick={refreshStudies}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-900 font-medium transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Tekrar Dene
            </button>
          </div>
        </div>
      )}

      {/* Page Content Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 pb-24">
        {currentTab === 'today' && (
          <Dashboard
            todayStudies={todayStudies}
            todaySummary={todaySummary}
            loading={studiesLoading}
            onToggleComplete={toggleComplete}
            onCompleteStudy={completeStudy}
            onAddStudy={addStudy}
            onDelete={deleteStudy}
          />
        )}

        {currentTab === 'history' && (
          <History
            studies={studies}
            loading={studiesLoading}
            onToggleComplete={toggleComplete}
            onCompleteStudy={completeStudy}
            onDelete={deleteStudy}
          />
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

      {/* Discrete floating progress bar */}
      <Ps5Progress
        progress={todayProgress}
        completedTasks={todaySummary.totalCompleted}
        totalTasks={todaySummary.totalTasks}
      />

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 py-2.5 shadow-sm">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`py-1 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'text-primary font-semibold bg-orange-50'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
