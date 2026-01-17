import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';
import { LuHash, LuALargeSmall, LuCalendarDays, LuShieldAlert, LuTrash2, LuFocus } from 'react-icons/lu';
import { motion } from 'framer-motion';

export const ColumnSidebar = () => {
    const { columns, activeAnalysisColumn, setActiveColumn, dropColumn, stats } = useStore();

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">Features</h3>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                    {columns.length} Total
                </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-premium">
                {columns.map((col) => {
                    const isActive = activeAnalysisColumn === col.id;
                    const hasMissing = col.stats.missingCount > 0;
                    const healthScore = ((1 - (col.stats.missingCount / (stats.rowCount || 1))) * 100);

                    return (
                        <motion.div
                            key={col.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={cn(
                                "group relative flex flex-col p-4 rounded-2xl transition-all cursor-pointer border",
                                isActive
                                    ? "bg-primary/5 border-primary/20 shadow-lg shadow-primary/5"
                                    : "glass-card border-transparent hover:border-white/10"
                            )}
                            onClick={() => setActiveColumn(col.id)}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                        col.type === 'numeric' ? "bg-blue-500/10 text-blue-500" :
                                            col.type === 'date' ? "bg-amber-500/10 text-amber-500" :
                                                "bg-indigo-500/10 text-indigo-500"
                                    )}>
                                        {col.type === 'numeric' ? <LuHash size={16} /> :
                                            col.type === 'date' ? <LuCalendarDays size={16} /> :
                                                <LuALargeSmall size={16} />}
                                    </div>
                                    <span className={cn(
                                        "font-bold truncate text-sm transition-colors",
                                        isActive ? "text-primary" : "text-foreground/80 group-hover:text-foreground"
                                    )}>
                                        {col.id}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); dropColumn(col.id); }}
                                        className="p-1.5 hover:bg-rose-500/10 hover:text-rose-500 rounded-lg transition-colors text-muted-foreground/40"
                                        title="Drop Column"
                                    >
                                        <LuTrash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full transition-all duration-1000",
                                                healthScore === 100 ? "bg-emerald-500" :
                                                    healthScore > 80 ? "bg-amber-500" : "bg-rose-500"
                                            )}
                                            style={{ width: `${healthScore}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-black opacity-40">{healthScore.toFixed(0)}% Health</span>
                                </div>

                                {hasMissing && (
                                    <LuShieldAlert size={12} className="text-amber-500 animate-pulse" />
                                )}
                                {isActive && (
                                    <LuFocus size={12} className="text-primary" />
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
