import { useStore } from '../store/useStore';
import { LuDatabase, LuSun, LuMoon, LuLayoutDashboard, LuPieChart, LuTable, LuTrash2 } from 'react-icons/lu';
import { cn } from '../utils/cn';

export const TopNavigation = () => {
    const { theme, setTheme, activeTab, setActiveTab, stats, setDataset } = useStore();

    return (
        <nav className="fixed top-0 left-0 w-full z-50 h-16 border-b border-white/5 bg-background/80 backdrop-blur-xl flex items-center justify-between px-6">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <LuDatabase size={16} />
                </div>
                <span className="text-lg font-black tracking-tighter hidden md:block">
                    Statify <span className="text-primary">Pro</span>
                </span>

                {/* File Info Pill */}
                {stats.fileName && (
                    <div className="hidden lg:flex items-center gap-2 ml-6 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{stats.fileName}</span>
                        <span className="w-1 h-3 bg-white/10 rounded-full" />
                        <span className="text-[10px] font-bold text-primary">{stats.rowCount.toLocaleString()} rows</span>
                    </div>
                )}
            </div>

            {/* Center Navigation Tabs */}
            <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center p-1 rounded-xl bg-white/5 border border-white/5">
                {[
                    { id: 'analysis', label: 'Dashboard', icon: LuLayoutDashboard },
                    { id: 'correlations', label: 'Visualizer', icon: LuPieChart },
                    { id: 'data', label: 'Data', icon: LuTable },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as 'analysis' | 'correlations' | 'data')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                            activeTab === tab.id
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        )}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setDataset([], { fileName: '', fileSize: 0 })}
                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Reset Corpus"
                >
                    <LuTrash2 size={18} />
                </button>
                <button
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                >
                    {theme === 'light' ? <LuMoon size={18} /> : <LuSun size={18} />}
                </button>
            </div>
        </nav>
    );
};
