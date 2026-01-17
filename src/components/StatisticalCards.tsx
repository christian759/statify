import { useStore } from '../store/useStore';
import { LuTable, LuActivity, LuInfo, LuTarget } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const StatisticalCards = () => {
    const { stats, columns, activeAnalysisColumn, filteredData } = useStore();
    const activeCol = columns.find(c => c.id === activeAnalysisColumn);

    // Generate Sparkline Data
    const sparkData = useMemo(() => {
        if (!activeCol) return [];
        if (activeCol.type === 'numeric' && activeCol.stats.min !== undefined && activeCol.stats.max !== undefined) {
            const min = activeCol.stats.min;
            const max = activeCol.stats.max;
            const binSize = (max - min) / 10;
            const bins = Array.from({ length: 11 }, (_, i) => ({ i, count: 0 }));
            filteredData.slice(0, 500).forEach(row => { // Sample first 500 for perf
                const val = Number(row[activeCol.id]);
                if (!isNaN(val)) {
                    const idx = Math.min(Math.floor((val - min) / binSize), 10);
                    bins[idx].count++;
                }
            });
            return bins;
        } else if (activeCol.stats.frequencies) {
            return Object.values(activeCol.stats.frequencies).slice(0, 10).map((count, i) => ({ i, count }));
        }
        return [];
    }, [activeCol, filteredData]);

    return (
        <AnimatePresence>
            {activeCol && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {/* Focus Index Card */}
                    <div className="glass-premium p-6 rounded-3xl space-y-4 relative overflow-hidden group">
                        <div className="absolute inset-x-0 bottom-0 h-16 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={sparkData}>
                                    <defs>
                                        <linearGradient id="sparkBlue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fill="url(#sparkBlue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                <LuTarget size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Focus Index</span>
                        </div>
                        <div className="space-y-1 relative z-10">
                            <h3 className="text-3xl font-black tracking-tight truncate" title={activeCol.id}>{activeCol.id}</h3>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Active Dimension</p>
                        </div>
                    </div>

                    {/* Central Tendency Card */}
                    <div className="glass-premium p-6 rounded-3xl space-y-4 relative overflow-hidden group border-primary/20 bg-primary/5">
                        <div className="absolute inset-x-0 bottom-0 h-16 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={sparkData}>
                                    <defs>
                                        <linearGradient id="sparkPrimary" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                                            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="count" stroke="var(--color-primary)" strokeWidth={2} fill="url(#sparkPrimary)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 rounded-xl premium-gradient text-white flex items-center justify-center shadow-lg shadow-primary/20">
                                <LuActivity size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">Central Tendency</span>
                        </div>
                        <div className="space-y-1 relative z-10">
                            <h3 className="text-3xl font-black tracking-tight text-glow text-primary tabular-nums">
                                {activeCol.type === 'numeric' ? activeCol.stats.mean?.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'N/A'}
                            </h3>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Mean Value</p>
                        </div>
                    </div>

                    {/* Dispersion Card */}
                    <div className="glass-premium p-6 rounded-3xl space-y-4 relative overflow-hidden group">
                        <div className="absolute inset-x-0 bottom-0 h-16 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={sparkData}>
                                    <Bar dataKey="count" fill="#6366f1" radius={[2, 2, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                <LuTable size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Dispersion</span>
                        </div>
                        <div className="space-y-1 relative z-10">
                            <h3 className="text-3xl font-black tracking-tight tabular-nums">
                                {activeCol.type === 'numeric' ? activeCol.stats.stdDev?.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'N/A'}
                            </h3>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Standard Deviation</p>
                        </div>
                    </div>

                    {/* Data Health Card */}
                    <div className="glass-premium p-6 rounded-3xl space-y-4 relative overflow-hidden group">
                        <div className="absolute inset-x-0 bottom-0 h-1 right-0 w-full">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${((1 - (activeCol.stats.missingCount / stats.rowCount)) * 100)}%` }}
                                className="h-full bg-emerald-500/50"
                            />
                        </div>
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                <LuInfo size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Data Health</span>
                        </div>
                        <div className="space-y-1 relative z-10">
                            <h3 className="text-3xl font-black tracking-tight tabular-nums">
                                {((1 - (activeCol.stats.missingCount / stats.rowCount)) * 100).toFixed(1)}%
                            </h3>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Integrity Score</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
