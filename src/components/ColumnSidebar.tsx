import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';
import { LuTrash2, LuActivity, LuCircleAlert } from 'react-icons/lu';
import { motion } from 'framer-motion';
export const ColumnSidebar = () => {
    const { columns, activeAnalysisColumn, setActiveColumn, dropColumn } = useStore();

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Features Corpus</h3>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                    {columns.length} Total
                </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-premium">
                {columns.map((col) => {
                    const isActive = activeAnalysisColumn === col.id;
                    const hasAnomalies = (col.stats.outlierCount || 0) > 0;
                    const quality = col.qualityScore;

                    return (
                        <motion.div
                            key={col.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={cn(
                                "group relative p-4 rounded-2xl transition-all cursor-pointer border",
                                isActive
                                    ? "bg-primary/10 border-primary/20 shadow-lg shadow-primary/5"
                                    : "bg-white/5 border-white/5 hover:bg-white/[0.08] hover:border-white/10"
                            )}
                            onClick={() => setActiveColumn(col.id)}
                        >
                            <div className="flex flex-col gap-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full shrink-0",
                                            col.type === 'numeric' ? "bg-blue-500" : "bg-purple-500"
                                        )} />
                                        <span className="text-[11px] font-black truncate tracking-wide">
                                            {col.id}
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dropColumn(col.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-500/20 rounded-md text-rose-500 transition-all"
                                    >
                                        <LuTrash2 size={12} />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Reliability</span>
                                        <span className={cn(
                                            "text-[8px] font-black uppercase tracking-widest",
                                            quality >= 80 ? "text-emerald-500" :
                                                quality >= 50 ? "text-amber-500" : "text-rose-500"
                                        )}>
                                            {Math.round(quality)}%
                                        </span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full transition-all duration-1000",
                                                quality >= 80 ? "bg-emerald-500" :
                                                    quality >= 50 ? "bg-amber-500" : "bg-rose-500"
                                            )}
                                            style={{ width: `${quality}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <LuActivity size={10} className="text-muted-foreground" />
                                        <span className="text-[9px] font-bold text-muted-foreground/60">{col.type}</span>
                                    </div>
                                    {hasAnomalies && (
                                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-500">
                                            <LuCircleAlert size={8} />
                                            <span className="text-[8px] font-black">{col.stats.outlierCount} outliers</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                                />
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
