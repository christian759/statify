import { useStore } from '../store/useStore';
import { LuDatabase, LuColumns, LuActivity, LuInfo } from 'react-icons/lu';
import { cn } from '../utils/cn';

export const StatisticalCards = () => {
    const { stats, columns, activeAnalysisColumn } = useStore();

    const activeCol = columns.find(c => c.id === activeAnalysisColumn);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-3xl space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <LuDatabase size={80} />
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <LuDatabase size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Dataset Size</span>
                </div>
                <div className="space-y-1">
                    <h3 className="text-3xl font-black tracking-tight">{stats.rowCount.toLocaleString()}</h3>
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Observations Loaded
                    </p>
                </div>
            </div>

            <div className="glass-card p-6 rounded-3xl space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <LuColumns size={80} />
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                        <LuColumns size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Dimensions</span>
                </div>
                <div className="space-y-1">
                    <h3 className="text-3xl font-black tracking-tight">{stats.columnCount}</h3>
                    <p className="text-xs text-muted-foreground font-medium">Feature vectors detected</p>
                </div>
            </div>

            {activeCol ? (
                <>
                    <div className="glass-card p-6 rounded-3xl space-y-4 relative overflow-hidden group border-primary/20 bg-primary/5">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <LuActivity size={80} />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl premium-gradient text-white flex items-center justify-center shadow-lg shadow-primary/20">
                                <LuActivity size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">Mean ({activeCol.id})</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">
                                {activeCol.type === 'numeric' ? activeCol.stats.mean?.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'N/A'}
                            </h3>
                            <p className="text-xs text-muted-foreground font-medium">Arithmetic Average</p>
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-3xl space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <LuInfo size={80} />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                <LuInfo size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Variance</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">
                                {activeCol.type === 'numeric' ? activeCol.stats.stdDev?.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'N/A'}
                            </h3>
                            <p className="text-xs text-muted-foreground font-medium">Standard Deviation (σ)</p>
                        </div>
                    </div>
                </>
            ) : (
                <div className="col-span-2 glass-card p-6 rounded-3xl border-dashed flex items-center justify-center text-muted-foreground/30 font-black uppercase tracking-[0.2em] text-[10px]">
                    Select a column header to see detailed statistics
                </div>
            )}
        </div>
    );
};
