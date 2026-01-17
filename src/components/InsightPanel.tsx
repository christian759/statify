import { useStore } from '../store/useStore';
import { LuLightbulb, LuWaves, LuCircleAlert, LuCircleCheck, LuCircleMinus, LuActivity } from 'react-icons/lu';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export const InsightPanel = () => {
    const { insights, stats, columns } = useStore();

    const missingTotal = columns.reduce((acc, col) => acc + col.stats.missingCount, 0);
    const healthPercent = stats.rowCount > 0
        ? ((1 - (missingTotal / (stats.rowCount * columns.length))) * 100).toFixed(1)
        : "0";

    return (
        <div className="space-y-8 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        <LuLightbulb size={20} className="animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest">AI Insights</h3>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Statistical Anomalies detected</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-2xl border-none">
                    <LuActivity size={18} className="text-primary mb-2" />
                    <div className="text-2xl font-black">{healthPercent}%</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Global Health</div>
                </div>
                <div className="glass-card p-4 rounded-2xl border-none">
                    <LuCircleAlert size={18} className={cn("mb-2", missingTotal > 0 ? "text-rose-500" : "text-emerald-500")} />
                    <div className="text-2xl font-black">{missingTotal}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Missing Cells</div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-premium">
                <AnimatePresence mode="popLayout">
                    {insights.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-center space-y-3 opacity-20">
                            <LuWaves size={40} />
                            <p className="text-[10px] font-black uppercase tracking-widest">Calibrating Insights...</p>
                        </div>
                    ) : (
                        insights.map((insight, idx) => (
                            <motion.div
                                key={insight.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className={cn(
                                    "p-5 rounded-2xl border-none shadow-xl",
                                    insight.type === 'alert' || insight.type === 'warning' ? "bg-rose-500/10" : "glass-card"
                                )}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={cn(
                                        "p-2 rounded-xl shrink-0 mt-1",
                                        insight.type === 'warning' ? "bg-rose-500 text-white" :
                                            insight.type === 'success' ? "bg-emerald-500 text-white" :
                                                "bg-blue-500 text-white"
                                    )}>
                                        {insight.type === 'warning' ? <LuCircleAlert size={16} /> :
                                            insight.type === 'success' ? <LuCircleCheck size={16} /> :
                                                <LuCircleMinus size={16} />}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-sm">{insight.title}</h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {insight.description}
                                        </p>
                                        <div className={cn(
                                            "inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest mt-2",
                                            insight.impact === 'high' ? "bg-rose-500/20 text-rose-500" :
                                                insight.impact === 'medium' ? "bg-amber-500/20 text-amber-500" :
                                                    "bg-blue-500/20 text-blue-500"
                                        )}>
                                            Impact: {insight.impact}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
