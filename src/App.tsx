import { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { MetricCards } from './components/MetricCards';
import { DashboardCharts } from './components/DashboardCharts';
import { VirtualizedTable } from './components/VirtualizedTable';
import { DetailDrawer } from './components/DetailDrawer';
import { DataUpload } from './components/DataUpload';
import { FilterPanel } from './components/FilterPanel';
import { generateMockData } from './data/mockData';
import { cn } from './utils/cn';
import { LuMenu, LuX, LuDownload, LuPlus } from 'react-icons/lu';

const App = () => {
  const { sidebarOpen, toggleSidebar, theme, setData, isLoading } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Generate mock data on mount
    const mockData = generateMockData(1000); // Reduced for better dev performance
    setData(mockData);
  }, []);

  useEffect(() => {
    // Update body class for dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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
        <TopNav />

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Statify
          </span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
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
          ) : (
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
                  <div className="premium-gradient rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 border border-white/30 group-hover:scale-110 transition-transform duration-500">
                        <LuLayoutDashboard size={24} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">Pro Analytics</h3>
                      <p className="text-white/80 mt-3 text-sm leading-relaxed font-medium">
                        Unlock advanced forecasting, anomaly detection, and custom API webhooks to take your data to the next level.
                      </p>
                      <button className="mt-8 w-full py-3 bg-white text-indigo-600 rounded-xl text-sm font-bold hover:bg-opacity-90 shadow-lg shadow-black/10 transition-all active:scale-95">
                        Get Started Now
                      </button>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-500" />
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl animate-pulse" />
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
        <DetailDrawer />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-64 glass-card border-r-0 rounded-none shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Recursive Sidebar-like logic or just reuse Sidebar if possible */}
            <Sidebar mobileMode />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
