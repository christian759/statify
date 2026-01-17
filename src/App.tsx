import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { StatisticalCards } from './components/StatisticalCards';
import { AnalyticalVisualizer } from './components/AnalyticalVisualizer';
import { VirtualizedTable } from './components/VirtualizedTable';
import { DataUpload } from './components/DataUpload';
import { cn } from './utils/cn';
import { LuSun, LuMoon, LuSearch, LuDatabase, LuActivity, LuTerminal } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const { theme, isLoading, filters, setFilters, data, stats } = useStore();
  const hasData = data.length > 0;

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
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto shadow-lg shadow-primary/20" />
          <h2 className="text-2xl font-black tracking-tight text-white">Initializing Statify</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-700 bg-slate-950 text-white selection:bg-primary/30",
      theme === 'light' ? "bg-slate-50 text-slate-900" : "bg-slate-950 text-white"
    )}>
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute top-[20%] -right-[5%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full"
        />
      </div>

      <nav className="fixed top-0 left-0 w-full z-50 p-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto group">
          <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12">
            <LuDatabase size={20} />
          </div>
          <span className="text-2xl font-black tracking-tighter">Statify</span>
        </div>

        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={() => useStore.getState().setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-3 w-12 h-12 rounded-2xl glass-premium flex items-center justify-center transition-all active:scale-95"
          >
            {theme === 'light' ? <LuMoon size={20} /> : <LuSun size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {!hasData ? (
          <motion.main
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 max-w-4xl mx-auto"
          >
            <div className="text-center space-y-6 mb-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-premium text-[10px] font-black uppercase tracking-[0.3em] text-primary"
              >
                <LuTerminal size={12} />
                Statistical Engine v2.0
              </motion.div>
              <h1 className="text-7xl md:text-8xl font-black tracking-tightest leading-none">
                Solve your <span className="text-glow text-primary">Data</span>
              </h1>
              <p className="text-xl text-muted-foreground font-medium max-w-xl mx-auto">
                A professional-grade workbench for edge-computed statistical analysis and predictive modeling.
              </p>
            </div>
            <DataUpload />
          </motion.main>
        ) : (
          <motion.main
            key="workbench"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 max-w-[1600px] mx-auto w-full pt-32 pb-20 px-6 lg:px-12 space-y-12"
          >
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in slide-in-from-bottom duration-700">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <LuActivity className="text-primary" size={32} />
                  <h2 className="text-5xl font-black tracking-tight">Workbench</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="glass-premium px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {stats.fileName}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-xs font-bold text-muted-foreground/60">{data.length.toLocaleString()} Observations</span>
                </div>
              </div>

              <div className="flex-1 max-w-md mx-8">
                <div className="relative group">
                  <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="Filter observations..."
                    value={filters.search}
                    onChange={(e) => setFilters({ search: e.target.value })}
                    className="w-full h-14 pl-12 pr-4 glass-premium rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-lg placeholder:text-muted-foreground/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DataUpload />
                <button
                  onClick={() => window.location.reload()}
                  className="h-14 px-8 premium-gradient text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95"
                >
                  Reset Session
                </button>
              </div>
            </header>

            <section className="space-y-12">
              <StatisticalCards />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <AnalyticalVisualizer />
                <div className="glass-premium rounded-[2.5rem] overflow-hidden min-h-[600px] shadow-2xl">
                  <VirtualizedTable />
                </div>
              </div>
            </section>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
