import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { StatisticalCards } from './components/StatisticalCards';
import { AnalyticalVisualizer } from './components/AnalyticalVisualizer';
import { VirtualizedTable } from './components/VirtualizedTable';
import { DataUpload } from './components/DataUpload';
import { cn } from './utils/cn';
import { LuSun, LuMoon, LuSearch, LuDatabase, LuActivity, LuTerminal } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';
import { ColumnSidebar } from './components/ColumnSidebar';
import { CorrelationHeatmap } from './components/CorrelationHeatmap';
import { InsightPanel } from './components/InsightPanel';
import { QualityMetrics } from './components/QualityMetrics';
import { DataMiningLab } from './components/DataMiningLab';

const App = () => {
  const { theme, isLoading, filters, setFilters, data, stats, setDataset, activeTab, setActiveTab } = useStore();
  const hasData = data.length > 0;

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const loadSampleData = () => {
    const sample = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      age: Math.floor(Math.random() * 50) + 20,
      salary: Math.floor(Math.random() * 80000) + 30000,
      department: ['Engineering', 'Marketing', 'Sales', 'Product'][Math.floor(Math.random() * 4)],
      performance: Math.random() * 100,
      contribution: Math.random() * 100,
      experience: Math.floor(Math.random() * 15),
      last_login: new Date(Date.now() - Math.random() * 1000000000).toISOString()
    }));
    setDataset(sample, { fileName: 'workforce_precision_01.csv', fileSize: 4520 });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto shadow-lg shadow-primary/20" />
          <h2 className="text-xl font-black tracking-tight text-white">Initializing Engine</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen transition-all duration-700 bg-background text-foreground selection:bg-primary/30",
      theme === 'light' ? "light" : "dark"
    )}>
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="bg-mesh absolute inset-0 opacity-50" />
      </div>

      <nav className="fixed top-0 left-0 w-full z-50 p-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto group">
          <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12">
            <LuDatabase size={20} />
          </div>
          <span className="text-xl font-black tracking-tighter">Statify <span className="text-primary">Pro</span></span>
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
            className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 max-w-4xl mx-auto"
          >
            <div className="text-center space-y-4 mb-12">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-premium text-[10px] font-black uppercase tracking-[0.3em] text-primary"
              >
                <LuTerminal size={12} />
                Scientific Precision Engine
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-black leading-none">
                Precision in <span className="text-glow text-primary">Data</span>
              </h1>
              <p className="text-lg text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed">
                Edge-computed statistical analysis, outlier detection, and predictive readiness scoring.
              </p>
            </div>
            <DataUpload />

            <button
              onClick={loadSampleData}
              className="mt-8 text-xs font-black uppercase tracking-widest text-muted-foreground/30 hover:text-primary transition-colors flex items-center gap-2 group"
            >
              Try sample workforce data
              <span className="w-4 h-4 rounded-full border border-white/10 group-hover:border-primary/50 flex items-center justify-center transition-all">→</span>
            </button>
          </motion.main>
        ) : (
          <motion.main
            key="workbench"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 w-full min-h-screen flex"
          >
            {/* Sidebar remains stable */}
            <aside className="w-72 h-screen sticky top-0 border-r border-white/5 bg-background/50 backdrop-blur-3xl p-6 pt-24 hidden xl:block">
              <ColumnSidebar />
            </aside>

            {/* Main Workspace Area */}
            <div className="flex-1 min-w-0 flex flex-col pt-24 pb-12 px-8 lg:px-12 space-y-8">
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <LuActivity className="text-primary" size={24} />
                    <h2 className="text-3xl font-black">Workspace</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                      <span className="text-[10px] font-black uppercase tracking-wider opacity-60">Source:</span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-primary">{stats.fileName}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider opacity-30">//</span>
                    <span className="text-[10px] font-black uppercase tracking-wider opacity-60">{data.length.toLocaleString()} Observations</span>
                  </div>
                </div>

                <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/5">
                  {['analysis', 'correlations', 'data'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={cn(
                        "px-6 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        activeTab === tab ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => useStore.getState().setDataset([], { fileName: '', fileSize: 0 })}
                  className="h-12 px-6 glass-premium text-muted-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all active:scale-95"
                >
                  Reset Corpus
                </button>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-8 min-h-[600px]">
                  {activeTab === 'analysis' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <StatisticalCards />
                      <AnalyticalVisualizer />
                      <DataMiningLab />
                    </motion.div>
                  )}
                  {activeTab === 'correlations' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <CorrelationHeatmap />
                    </motion.div>
                  )}
                  {activeTab === 'data' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-premium rounded-[2.5rem] overflow-hidden min-h-[700px] shadow-2xl relative">
                      <header className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-widest opacity-60">Observation Payload</h3>
                        <div className="flex items-center gap-4">
                          <div className="relative group">
                            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={14} />
                            <input
                              type="text"
                              placeholder="Search payload..."
                              value={filters.search}
                              onChange={(e) => setFilters({ search: e.target.value })}
                              className="h-10 pl-10 pr-4 bg-white/5 rounded-xl border border-white/5 focus:border-primary/50 outline-none text-xs w-48 transition-all"
                            />
                          </div>
                        </div>
                      </header>
                      <VirtualizedTable />
                    </motion.div>
                  )}
                </div>

                <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8 flex flex-col">
                  <div className="glass-premium p-6 rounded-[2rem] flex flex-col gap-8">
                    <InsightPanel />
                    <div className="h-[1px] bg-white/5 w-full" />
                    <QualityMetrics />
                  </div>
                </div>
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
