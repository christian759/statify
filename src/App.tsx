import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { StatisticalCards } from './components/StatisticalCards';
import { AnalyticalVisualizer } from './components/AnalyticalVisualizer';
import { VirtualizedTable } from './components/VirtualizedTable';
import { DataUpload } from './components/DataUpload';
import { cn } from './utils/cn';
import { LuPlus, LuSun, LuMoon, LuSearch, LuDatabase } from 'react-icons/lu';

const App = () => {
  const { theme, isLoading, filters, setFilters, stats } = useStore();

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

      <main className="relative z-10 max-w-[1600px] mx-auto w-full p-4 lg:p-12 space-y-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl premium-gradient flex items-center justify-center text-white shadow-xl shadow-primary/20 rotate-3">
              <LuDatabase size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                Statify
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Data workbench 2.0</p>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="relative group">
              <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search observations..."
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                className="w-full h-12 pl-12 pr-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => useStore.getState().setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-3 w-12 h-12 rounded-2xl glass-card border-none hover:bg-white dark:hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center"
            >
              {theme === 'light' ? <LuMoon size={22} /> : <LuSun size={22} />}
            </button>
            <button className="flex items-center gap-2 px-6 h-12 premium-gradient text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-500/15 hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all">
              <LuPlus size={18} />
              <span>New Analysis</span>
            </button>
          </div>
        </header>

        <section className="space-y-8">
          <StatisticalCards />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            <div className="xl:col-span-1 space-y-8 animate-in slide-in-from-left duration-700">
              <DataUpload />
              <div className="glass-card p-6 rounded-3xl space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Source metadata</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Filename</span>
                    <span className="font-bold truncate max-w-[150px]">{stats.fileName || 'Untitled Dataset'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Size</span>
                    <span className="font-bold">{(stats.fileSize ? stats.fileSize / 1024 : 0).toFixed(2)} KB</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-2 space-y-8 animate-in slide-in-from-right duration-700">
              <AnalyticalVisualizer />
            </div>
          </div>
        </section>

        <section className="animate-in slide-in-from-bottom duration-700 delay-500">
          <div className="glass-card rounded-[2.5rem] overflow-hidden border-none shadow-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl min-h-[500px]">
            <VirtualizedTable />
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
