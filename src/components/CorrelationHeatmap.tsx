import { useStore } from '../store/useStore';
import { LuActivity, LuInfo } from 'react-icons/lu';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

export const CorrelationHeatmap = () => {
    const { correlations, columns } = useStore();
    const numericCols = columns.filter(c => c.type === 'numeric').map(c => c.id);

    if (numericCols.length < 2) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center glass-premium rounded-[2.5rem] h-64 opacity-50 border-dashed">
                <LuInfo size={32} className="mb-4" />
                <h3 className="text-sm font-black uppercase tracking-widest">Insufficient Dimensions</h3>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-2">Correlation requires at least 2 numerical features</p>
            </div>
        );
    }

    return (
        <div className="glass-premium rounded-[2.5rem] p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <LuActivity size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest">Pearson Association Matrix</h3>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Multi-variable Correlation Analysis</p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto pb-4 scrollbar-premium">
                <div className="inline-block min-w-full align-middle">
                    <table className="border-separate border-spacing-1">
                        <thead>
                            <tr>
                                <th className="p-2"></th>
                                {numericCols.map(col => (
                                    <th key={col} className="p-2 text-[8px] font-black uppercase tracking-tighter text-muted-foreground text-center max-w-[80px] truncate">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {numericCols.map(rowCol => (
                                <tr key={rowCol}>
                                    <td className="p-2 text-[8px] font-black uppercase tracking-tighter text-muted-foreground text-right max-w-[100px] truncate">
                                        {rowCol}
                                    </td>
                                    {numericCols.map(colCol => {
                                        const r = correlations[rowCol]?.[colCol] ?? 0;
                                        const intensity = Math.abs(r);

                                        return (
                                            <td key={colCol} className="p-0">
                                                <motion.div
                                                    initial={{ scale: 0.9, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className={cn(
                                                        "w-12 h-12 rounded-lg flex items-center justify-center text-[10px] font-black transition-all cursor-crosshair",
                                                        r > 0 ? "text-white" : "text-white",
                                                        intensity < 0.2 ? "bg-white/[0.02] text-muted-foreground" :
                                                            r > 0 ? `bg-blue-500` : `bg-rose-500`
                                                    )}
                                                    style={{
                                                        opacity: intensity < 0.2 ? 0.3 : intensity,
                                                        filter: intensity < 0.4 ? 'grayscale(0.5)' : 'none'
                                                    }}
                                                    title={`${rowCol} vs ${colCol}: ${r.toFixed(4)}`}
                                                >
                                                    {r === 1 ? '1.0' : r.toFixed(2)}
                                                </motion.div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Positive Assoc.</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Negative Assoc.</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Neutral (r &lt; 0.2)</span>
                </div>
            </div>
        </div>
    );
};
