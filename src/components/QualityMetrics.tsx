import { useStore } from '../store/useStore';
import { LuTriangleAlert, LuChartColumn, LuZap, LuFingerprint } from 'react-icons/lu';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

export const QualityMetrics = () => {
    const { activeAnalysisColumn, columns } = useStore();
    const activeCol = columns.find(c => c.id === activeAnalysisColumn);

    if (!activeCol) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center glass-premium rounded-[2rem] border-dashed opacity-40">
                <LuZap size={32} className="mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest">Select feature for quality scan</p>
            </div>
        );
    }

    const { stats, qualityScore } = activeCol;
    const isQualityHigh = qualityScore >= 80;
    const isQualityMed = qualityScore >= 50 && qualityScore < 80;

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                        Precision Metrics
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{activeCol.id}</p>
                </div>
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black",
                    isQualityHigh ? "bg-emerald-500/10 text-emerald-500" :
                        isQualityMed ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                )}>
                    {Math.round(qualityScore)}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2 scrollbar-premium">
                {/* Outlier Card */}
                <div className="p-4 glass-card rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Anomalies (IQR)</span>
                        <LuTriangleAlert className={cn(
                            (stats.outlierCount || 0) > 0 ? "text-amber-500" : "text-emerald-500"
                        )} size={14} />
                    </div>
                    <div className="flex items-end justify-between">
                        <span className="text-2xl font-black">{stats.outlierCount || 0}</span>
                        <span className="text-[10px] font-bold text-muted-foreground/60">Across Payload</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, ((stats.outlierCount || 0) / 10) * 100)}%` }}
                            className={cn(
                                "h-full",
                                (stats.outlierCount || 0) > 0 ? "bg-amber-500" : "bg-emerald-500"
                            )}
                        />
                    </div>
                </div>

                {/* Skewness Card */}
                <div className="p-4 glass-card rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Distribution Skew</span>
                        <LuChartColumn className="text-blue-500" size={14} />
                    </div>
                    <div className="flex items-end justify-between">
                        <span className="text-2xl font-black">{(stats.skewness || 0).toFixed(2)}</span>
                        <span className="text-[10px] font-bold text-muted-foreground/60">
                            {Math.abs(stats.skewness || 0) < 0.5 ? 'Symmetric' : 'Highly Skewed'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between h-4 px-1 gap-1">
                        <div className={cn("flex-1 h-1 rounded-full", (stats.skewness || 0) < -0.5 ? "bg-blue-500" : "bg-white/5")} />
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <div className={cn("flex-1 h-1 rounded-full", (stats.skewness || 0) > 0.5 ? "bg-blue-500" : "bg-white/5")} />
                    </div>
                </div>

                {/* Integrity Meta */}
                <div className="p-4 glass-card rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Biological Signatures</span>
                        <LuFingerprint className="text-purple-500" size={14} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-center p-2 rounded-xl bg-white/5">
                            <div className="text-xs font-black">{stats.uniqueCount}</div>
                            <div className="text-[8px] uppercase font-bold text-muted-foreground">Unique</div>
                        </div>
                        <div className="text-center p-2 rounded-xl bg-white/5">
                            <div className="text-xs font-black">{stats.missingCount}</div>
                            <div className="text-[8px] uppercase font-bold text-muted-foreground">Nulls</div>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                    <p className="text-[10px] leading-relaxed italic text-primary/80 font-medium">
                        Scientific Suggestion: {
                            qualityScore < 70 ? "Data rehabilitation required for predictive accuracy." :
                                "High reliability detected. Ready for modeling pipelines."
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};
