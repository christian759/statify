import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { MetricCards } from './components/MetricCards';
import { DashboardCharts } from './components/DashboardCharts';
import { VirtualizedTable } from './components/VirtualizedTable';
import { DataUpload } from './components/DataUpload';
import { FilterPanel } from './components/FilterPanel';
import { cn } from './utils/cn';
import { LuPlus, LuSun, LuMoon } from 'react-icons/lu';

const App = () => {
  const { theme, isLoading } = useStore();

  useEffect(() => {
    // Update body class for dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto shadow-lg shadow-primary/20" />
          <h2 className="text-2xl font-bold tracking-tight">Initializing Statify</h2>
        </div>
      </div>
    );
  }

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

      <main className="relative z-10 max-w-[1400px] mx-auto w-full p-4 lg:p-12 space-y-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              Statify
            </h1>
            <p className="text-muted-foreground mt-2 font-medium">Professional Statistical Data Analysis</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => useStore.getState().setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-3 rounded-2xl glass-card border-none hover:bg-white dark:hover:bg-slate-900 transition-all active:scale-95"
            >
              {theme === 'light' ? <LuMoon size={22} /> : <LuSun size={22} />}
            </button>
            <button className="flex items-center gap-2 px-6 py-3 premium-gradient text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-500/15 hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all">
              <LuPlus size={18} />
              <span>New Analysis</span>
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div className="xl:col-span-1 space-y-8 animate-in slide-in-from-left duration-700">
            <DataUpload />
            <FilterPanel />
          </div>

          <div className="xl:col-span-2 space-y-8 animate-in slide-in-from-right duration-700">
            <div className="animate-in delay-200">
              <MetricCards />
            </div>
            <div className="animate-in delay-300">
              <DashboardCharts />
            </div>
          </div>
        </section>

        <section className="animate-in slide-in-from-bottom duration-700 delay-500">
          <div className="glass-card rounded-[2rem] overflow-hidden border-none shadow-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl">
            <VirtualizedTable />
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
