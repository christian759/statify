import { useStore } from '../store/useStore';
import { LuTable, LuActivity, LuInfo, LuTarget } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

export const StatisticalCards = () => {
    const { stats, columns, activeAnalysisColumn } = useStore();
    const activeCol = columns.find(c => c.id === activeAnalysisColumn);

    return (
        <AnimatePresence>
            {activeCol && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <div className="glass-premium p-6 rounded-3xl space-y-4 relative overflow-hidden group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                <LuTarget size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Focus Index</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight truncate">{activeCol.id}</h3>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Active Dimension</p>
                        </div>
                    </div>

                    <div className="glass-premium p-6 rounded-3xl space-y-4 relative overflow-hidden group border-primary/20 bg-primary/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl premium-gradient text-white flex items-center justify-center shadow-lg shadow-primary/20">
                                <LuActivity size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">Central Tendency</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight text-glow text-primary">
                                {activeCol.type === 'numeric' ? activeCol.stats.mean?.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'N/A'}
                            </h3>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Mean Value</p>
                        </div>
                    </div>

                    <div className="glass-premium p-6 rounded-3xl space-y-4 relative overflow-hidden group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                <LuTable size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Dispersion</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">
                                {activeCol.type === 'numeric' ? activeCol.stats.stdDev?.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'N/A'}
                            </h3>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Standard Deviation</p>
                        </div>
                    </div>

                    <div className="glass-premium p-6 rounded-3xl space-y-4 relative overflow-hidden group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                <LuInfo size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Data Health</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">
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
