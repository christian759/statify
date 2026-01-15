import React, { useEffect } from 'react';
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

const App = () => {
  const { sidebarOpen, theme, setData, isLoading } = useStore();

  useEffect(() => {
    // Generate mock data on mount
    const mockData = generateMockData(10000);
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
      "min-h-screen transition-colors duration-300",
      theme === 'dark' ? "bg-background text-white" : "bg-slate-50 text-slate-900"
    )}>
      <Sidebar />
      <div className={cn(
        "transition-all duration-300 min-h-screen flex flex-col",
        sidebarOpen ? "pl-64" : "pl-20"
      )}>
        <TopNav />
        <main className="flex-1 p-6 lg:p-8 space-y-8 max-w-[1700px] mx-auto w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-[80vh]">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto shadow-lg shadow-primary/20" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight">Initializing Statify</h2>
                  <p className="text-muted-foreground animate-pulse">Warming up virtualized table (10,000+ nodes)...</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Analytics Overview</h1>
                  <p className="text-muted-foreground mt-1">Real-time performance metrics and transaction history.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors">Export CSV</button>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">Create Report</button>
                </div>
              </div>

              <FilterPanel />
              <MetricCards />

              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                <div className="xl:col-span-3 space-y-8">
                  <DashboardCharts />
                  <div className="h-[650px]">
                    <VirtualizedTable />
                  </div>
                </div>
                <div className="space-y-8">
                  <DataUpload />
                  <div className="bg-gradient-to-br from-primary to-blue-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold">Pro Features</h3>
                      <p className="text-white/80 mt-2 text-sm leading-relaxed">Unlock advanced forecasting, anomaly detection, and custom API webhooks.</p>
                      <button className="mt-6 px-4 py-2 bg-white text-primary rounded-xl text-sm font-bold hover:bg-opacity-90 transition-all">Upgrade Now</button>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
        <DetailDrawer />
      </div>
    </div>
  );
};

export default App;
