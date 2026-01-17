import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { StatisticalCards } from './components/StatisticalCards';
import { AnalyticalVisualizer } from './components/AnalyticalVisualizer';
import { VirtualizedTable } from './components/VirtualizedTable';
import { DataUpload } from './components/DataUpload';
import { cn } from './utils/cn';
import { LuTerminal, LuSearch } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';
import { ColumnSidebar } from './components/ColumnSidebar';
import { ChartExplorer } from './components/ChartExplorer';
import { InsightPanel } from './components/InsightPanel';
import { QualityMetrics } from './components/QualityMetrics';
import { CorrelationHeatmap } from './components/CorrelationHeatmap';
import { DataMiningLab } from './components/DataMiningLab';
import { TopNavigation } from './components/TopNavigation';

const App = () => {
  const { theme, hasData, setDataset, activeTab, filters, setFilters } = useStore(state => ({
    theme: state.theme,
    hasData: state.data.length > 0,
    setDataset: state.setDataset,
    activeTab: state.activeTab,
    filters: state.filters,
    setFilters: state.setFilters
  }));

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
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

  return (
    <div className={cn(
      "min-h-screen transition-all duration-700 bg-background text-foreground selection:bg-primary/30",
      theme === 'light' ? "light" : "dark"
    )}>
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="bg-mesh absolute inset-0 opacity-50" />
      </div>

      <AnimatePresence mode="wait">
        {!hasData ? (
          <motion.main
            key="landing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 max-w-4xl mx-auto"
          >
            {/* Landing Page Content */}
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
            className="relative z-10 w-full min-h-screen pt-16" // pt-16 for TopNav
          >
            <TopNavigation />

            <div className="flex h-[calc(100vh-4rem)]">
              {/* Sidebar - Only visible in Analysis tab for now or always? Let's keep it but make it sleek. */}
              {/* The user said "remove clustered stiff". Maybe hide sidebar in other tabs. */}
              {activeTab === 'analysis' && (
                <aside className="w-64 h-full border-r border-white/5 bg-background/50 backdrop-blur-3xl p-4 hidden xl:block overflow-hidden">
                  <ColumnSidebar />
                </aside>
              )}

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto scrollbar-premium p-6 lg:p-8">
                <div className="max-w-[1920px] mx-auto space-y-8">

                  {activeTab === 'analysis' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 xl:grid-cols-12 gap-6"
                    >
                      {/* Row 1: Summary Cards */}
                      <div className="xl:col-span-12">
                        <StatisticalCards />
                      </div>

                      {/* Row 2: Insight Panel + Visualizer */}
                      <div className="xl:col-span-4 space-y-6">
                        <InsightPanel />
                        <QualityMetrics />
                      </div>
                      <div className="xl:col-span-8">
                        <AnalyticalVisualizer />
                      </div>

                      {/* Row 3: Advanced Mining */}
                      <div className="xl:col-span-12">
                        <DataMiningLab />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'correlations' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      <ChartExplorer />
                      <CorrelationHeatmap />
                    </motion.div>
                  )}

                  {activeTab === 'data' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-premium rounded-[2.5rem] overflow-hidden min-h-[700px] shadow-2xl relative flex flex-col"
                    >
                      <header className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
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
                      <div className="flex-1 min-h-0">
                        <VirtualizedTable />
                      </div>
                    </motion.div>
                  )}
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
