import { useStore } from '../store/useStore';
import { LuWand, LuTrash2, LuStethoscope, LuCircleAlert, LuCircleCheck } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

export const AlchemyTools = () => {
    const { activeAnalysisColumn, columns, imputeMissing, dropColumn } = useStore();
    const activeCol = columns.find(c => c.id === activeAnalysisColumn);

    if (!activeCol) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center glass-premium rounded-[2rem] border-dashed h-48 opacity-40">
                <LuStethoscope size={32} className="mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest">Select a feature to calibrate</p>
            </div>
        );
    }

    const hasMissing = activeCol.stats.missingCount > 0;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={activeCol.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-premium p-8 rounded-[2rem] space-y-6"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                            <LuWand size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest">Data Alchemy</h3>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Rehabilitate Feature: {activeCol.id}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => dropColumn(activeCol.id)}
                        className="px-4 h-10 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2"
                    >
                        <LuTrash2 size={14} />
                        Drop
                    </button>
                </div>

                {hasMissing ? (
                    <div className="space-y-4">
                        <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex items-start gap-3">
                            <LuCircleAlert className="text-amber-500 shrink-0 mt-0.5" size={16} />
                            <p className="text-xs text-amber-500/80 font-medium leading-relaxed">
                                <strong>Integrity Gap</strong>: {activeCol.stats.missingCount} missing values detected.
                                Choose an imputation strategy to rehabilitate this feature.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {activeCol.type === 'numeric' && (
                                <>
                                    <button
                                        onClick={() => imputeMissing(activeCol.id, 'mean')}
                                        className="h-12 px-4 glass-card rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all text-left flex items-center justify-between group"
                                    >
                                        Fill Mean
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                    </button>
                                    <button
                                        onClick={() => imputeMissing(activeCol.id, 'median')}
                                        className="h-12 px-4 glass-card rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all text-left flex items-center justify-between group"
                                    >
                                        Fill Median
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => imputeMissing(activeCol.id, 'mode')}
                                className="h-12 px-4 glass-card rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all text-left flex items-center justify-between group"
                            >
                                Fill Mode
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            </button>
                            <button
                                onClick={() => imputeMissing(activeCol.id, 'zero')}
                                className="h-12 px-4 glass-card rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all text-left flex items-center justify-between group"
                            >
                                Zero Fill
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 flex flex-col items-center justify-center text-center space-y-3 bg-emerald-500/5 rounded-[1.5rem] border border-emerald-500/20">
                        <LuCircleCheck size={32} className="text-emerald-500" />
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-widest text-emerald-500">Feature Optimized</p>
                            <p className="text-[10px] text-muted-foreground font-medium">No missing values or anomalies detected in this dimension.</p>
                        </div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};
