import { useStore } from '../store/useStore';
import { BsFilter, BsX, BsCheck } from 'react-icons/bs';
import { cn } from '../utils/cn';
import type { TransactionStatus } from '../types';

const STATUS_OPTIONS: TransactionStatus[] = ['completed', 'pending', 'failed', 'refunded'];

export const FilterPanel = () => {
    const { filters, setFilters, filteredData } = useStore();

    const toggleStatus = (status: TransactionStatus) => {
        const current = filters.status;
        const next = current.includes(status)
            ? current.filter(s => s !== status)
            : [...current, status];
        setFilters({ status: next });
    };

    const clearAll = () => {
        setFilters({
            status: [],
            search: '',
            minAmount: 0,
            maxAmount: 10000,
            dateRange: [null, null],
        });
    };

    return (
        <div className="space-y-6 mb-8 p-8 glass-card rounded-3xl animate-in">
            <div className="flex flex-col xl:flex-row xl:items-center gap-8">
                {/* Search */}
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Search Database</p>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-all group-focus-within:text-primary group-focus-within:scale-110">
                            <BsFilter size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Scan by ID, user, or category..."
                            value={filters.search}
                            onChange={(e) => setFilters({ search: e.target.value })}
                            className="w-full bg-white/[0.03] dark:bg-slate-900/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none focus:bg-white/5 focus:ring-4 focus:ring-primary/10 transition-all font-semibold placeholder:text-muted-foreground/30 shadow-inner"
                        />
                    </div>
                </div>

                {/* Status Chips */}
                <div className="flex-none min-w-0 overflow-x-auto scrollbar-none">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Transaction Status</p>
                    <div className="flex items-center gap-2.5 pb-2 xl:pb-0">
                        {STATUS_OPTIONS.map(status => (
                            <button
                                key={status}
                                onClick={() => toggleStatus(status as any)}
                                className={cn(
                                    "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap active:scale-95",
                                    filters.status.includes(status as any)
                                        ? "bg-primary border-primary/20 text-white shadow-sm scale-100"
                                        : "bg-slate-100 dark:bg-slate-900 text-slate-500 hover:border-primary/30 hover:text-foreground"
                                )}
                            >
                                {status}
                                {filters.status.includes(status as any) && <BsCheck size={16} className="ml-2 inline-block" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reset */}
                <div className="flex xl:items-end gap-4 xl:ml-auto">
                    {(filters.status.length > 0 || filters.search) ? (
                        <button
                            onClick={clearAll}
                            className="flex items-center gap-2 px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-500/10 rounded-2xl border border-rose-200 dark:border-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all active:scale-95 animate-in zoom-in"
                        >
                            <BsX size={20} />
                            Reset Filters
                        </button>
                    ) : (
                        <div className="px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/30 glass rounded-2xl border-white/5 opacity-50 cursor-not-allowed">
                            Default state
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pt-6 border-t border-white/5 gap-4">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2.5 text-[11px] font-bold text-emerald-500/80">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                        Live Sync: Active
                    </div>
                    <div className="h-4 w-px bg-white/10 hidden md:block" />
                    <div className="text-[11px] text-muted-foreground/60 font-mono">
                        Indexing: <span className="text-foreground font-black">{filteredData.length.toLocaleString()}</span> segments
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Statify Analytics v1.0.0
                </div>
            </div>
        </div>
    );
};
