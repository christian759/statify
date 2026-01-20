import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';
import { LuTrash2, LuActivity, LuBinary, LuCalendar } from 'react-icons/lu';
import { motion } from 'framer-motion';

export const ColumnSidebar = () => {
    const { columns, activeAnalysisColumn, setActiveColumn, dropColumn } = useStore();

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="flex items-center justify-between px-3 py-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Features Corpus</h3>
                <span className="text-[10px] bg-white/5 text-muted-foreground px-2 py-0.5 rounded-full font-bold tabular-nums">
                    {columns.length}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-1 scrollbar-premium">
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
                                "group relative p-3 rounded-xl transition-all cursor-pointer border",
                                isActive
                                    ? "bg-primary/10 border-primary/20 shadow-sm shadow-primary/5"
                                    : "bg-transparent border-transparent hover:bg-white/[0.03] hover:border-white/5"
                            )}
                            onClick={() => setActiveColumn(col.id)}
                        >
                            <div className="flex flex-col gap-2">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className={cn(
                                            "w-1.5 h-1.5 rounded-full shrink-0",
                                            col.type === 'numeric' ? "bg-blue-500" :
                                                col.type === 'date' ? "bg-amber-500" :
                                                    "bg-purple-500"
                                        )} />
                                        <span className={cn(
                                            "text-[11px] font-bold truncate tracking-tight transition-colors",
                                            isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                                        )}>
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
                                        <LuTrash2 size={10} />
                                    </button>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/50">Quality</span>
                                        <span className={cn(
                                            "text-[9px] font-bold tabular-nums",
                                            quality >= 80 ? "text-emerald-500" :
                                                quality >= 50 ? "text-amber-500" : "text-rose-500"
                                        )}>
                                            {Math.round(quality)}%
                                        </span>
                                    </div>
                                    <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
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

                                <div className="flex items-center justify-between pt-1">
                                    <div className="flex items-center gap-1.5">
                                        {col.type === 'numeric' ? <LuActivity size={10} className="text-blue-500/50" /> :
                                            col.type === 'date' ? <LuCalendar size={10} className="text-amber-500/50" /> :
                                                <LuBinary size={10} className="text-purple-500/50" />}
                                        <span className="text-[9px] font-medium text-muted-foreground/50 lowercase">{col.type}</span>
                                    </div>
                                    {hasAnomalies && (
                                        <span className="text-[8px] font-bold text-amber-500/80 bg-amber-500/5 px-1 rounded tabular-nums">
                                            {col.stats.outlierCount} outliers
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
