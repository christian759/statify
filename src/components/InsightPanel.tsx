import { useStore } from '../store/useStore';
import { LuLightbulb, LuWaves, LuCircleAlert, LuActivity } from 'react-icons/lu';
import { cn } from '../utils/cn';

export const InsightPanel = () => {
    const { stats, columns } = useStore();

    const missingTotal = columns.reduce((acc, col) => acc + col.stats.missingCount, 0);
    const healthPercent = stats.rowCount > 0
        ? ((1 - (missingTotal / (stats.rowCount * columns.length))) * 100).toFixed(1)
        : "0";

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <LuLightbulb size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest">Data Summary</h3>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Key metrics</p>
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
        </div>
    );
};
