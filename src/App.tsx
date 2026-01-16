import { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import { Sidebar } from './components/Sidebar';
import { MetricCards } from './components/MetricCards';
import { DashboardCharts } from './components/DashboardCharts';
import { VirtualizedTable } from './components/VirtualizedTable';
import { DetailDrawer } from './components/DetailDrawer';
import { DataUpload } from './components/DataUpload';
import { FilterPanel } from './components/FilterPanel';
import { cn } from './utils/cn';
import { LuMenu, LuX, LuDownload, LuPlus } from 'react-icons/lu';

const App = () => {
  const { sidebarOpen, theme, isLoading, currentView } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // App initialization logic can go here
  }, []);

  useEffect(() => {
    // Update body class for dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                  Analytics Overview
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">Real-time performance metrics and transaction history.</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 glass-card rounded-xl text-sm font-semibold hover:bg-white dark:hover:bg-slate-900 transition-all active:scale-95">
                  <LuDownload size={18} />
                  <span>Export CSV</span>
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 premium-gradient text-white rounded-xl text-sm font-bold shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all">
                  <LuPlus size={18} />
                  <span>Create Report</span>
                </button>
              </div>
            </div>

            <div className="animate-in delay-1">
              <FilterPanel />
            </div>

            <div className="animate-in delay-2">
              <MetricCards />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              <div className="xl:col-span-3 space-y-8 animate-in delay-3">
                <DashboardCharts />
                <div className="glass-card rounded-2xl overflow-hidden h-[650px] border-none shadow-2xl">
                  <VirtualizedTable />
                </div>
              </div>
              <div className="space-y-8 animate-in delay-4">
                <DataUpload />
              </div>
            </div>
          </>
        );
      case 'analytics':
        return (
          <div className="space-y-8 animate-in">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">Deep Analytics</h1>
            <DashboardCharts />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-8 rounded-3xl">
                <h3 className="text-xl font-bold mb-4">Market Intelligence</h3>
                <p className="text-muted-foreground">Advanced market segment analysis and competitive benchmarking.</p>
              </div>
              <div className="glass-card p-8 rounded-3xl">
                <h3 className="text-xl font-bold mb-4">User Behavior</h3>
                <p className="text-muted-foreground">Heatmaps, conversion funnels, and retention analysis metrics.</p>
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="space-y-8 animate-in">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">User Management</h1>
            <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
              <VirtualizedTable />
            </div>
          </div>
        );
      case 'transactions':
        return (
          <div className="space-y-8 animate-in">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">Transaction Ledger</h1>
            <FilterPanel />
            <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
              <VirtualizedTable />
            </div>
          </div>
        );
      case 'import':
        return (
          <div className="space-y-8 animate-in">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">Import Control</h1>
            <div className="max-w-3xl mx-auto">
              <DataUpload />
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-8 animate-in">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">Global Settings</h1>
            <div className="glass-card p-10 rounded-3xl space-y-10 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">Preferences</h3>
                  <p className="text-sm text-muted-foreground">Customize your dashboard experience and reporting frequency.</p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">Data Management</h3>
                  <p className="text-sm text-muted-foreground">Manage your data retention policies and export schedules.</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      theme === 'dark' ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
    )}>
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-indigo-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
      </div>

      <Sidebar />

      <div className={cn(
        "transition-all duration-300 min-h-screen flex flex-col relative z-10",
        sidebarOpen ? "lg:pl-64" : "lg:pl-20"
      )}>
        {/* Mobile Menu Trigger - Floating if no top bar */}
        <div className="lg:hidden fixed top-4 right-4 z-50">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-slate-600 dark:text-slate-300 transition-all active:scale-95"
          >
            {mobileMenuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
          </button>
        </div>

        <main className="flex-1 p-4 lg:p-8 space-y-8 max-w-[1700px] mx-auto w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-[80vh]">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto shadow-lg shadow-primary/20" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight">Initializing Statify</h2>
                  <p className="text-muted-foreground animate-pulse">Warming up virtualized table...</p>
                </div>
              </div>
            </div>
          ) : renderView()}
        </main>
        <DetailDrawer />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-64 glass shadow-2xl animate-in slide-in-from-left duration-500"
            onClick={e => e.stopPropagation()}
          >
            <Sidebar mobileMode />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
