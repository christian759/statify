import { useStore } from '../store/useStore';
import { BsFilter, BsX, BsCheck } from 'react-icons/bs';
import { cn } from '../utils/cn';
import type { TransactionStatus } from '../types';

const STATUS_OPTIONS: TransactionStatus[] = ['completed', 'pending', 'failed', 'refunded'];

export const FilterPanel = () => {
    const { filters, setFilters } = useStore();

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
        <div className="space-y-4 mb-8 p-6 bg-card border border-border rounded-2xl shadow-sm">
            <div className="flex flex-wrap items-center gap-6">
                {/* Search */}
                <div className="flex-1 min-w-[300px]">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">Quick Search</p>
                    <div className="relative group">
                        <BsFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Find by ID, user, or category..."
                            value={filters.search}
                            onChange={(e) => setFilters({ search: e.target.value })}
                            className="w-full bg-secondary/30 border border-border/50 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Status Chips */}
                <div className="flex-none">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">Transaction Status</p>
                    <div className="flex items-center gap-2">
                        {STATUS_OPTIONS.map(status => (
                            <button
                                key={status}
                                onClick={() => toggleStatus(status as any)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2",
                                    filters.status.includes(status as any)
                                        ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                                        : "bg-background border-border text-muted-foreground hover:border-primary/50"
                                )}
                            >
                                <span className="capitalize">{status}</span>
                                {filters.status.includes(status as any) && <BsCheck size={16} />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Range / Reset */}
                <div className="flex items-end gap-4 ml-auto">
                    <div className="hidden xl:block">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1 text-right">Active Filters</p>
                        <div className="flex gap-2">
                            {(filters.status.length > 0 || filters.search) ? (
                                <button
                                    onClick={clearAll}
                                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-500 bg-rose-500/10 rounded-xl hover:bg-rose-500/20 transition-all active:scale-95"
                                >
                                    <BsX size={18} />
                                    Clear Filters
                                </button>
                            ) : (
                                <div className="px-3 py-2 text-xs font-bold text-muted-foreground bg-secondary/30 rounded-xl opacity-50 cursor-not-allowed">
                                    No Active Filters
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Slider Placeholder / Advanced Info */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Real-time synchronization active
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <div className="text-xs text-muted-foreground font-mono">
                        Filtered: <span className="text-foreground font-bold">{useStore.getState().filteredData.length.toLocaleString()}</span> records
                    </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black italic uppercase tracking-widest text-muted-foreground/30">
                    Statify Query Engine v4
                </div>
            </div>
        </div>
    );
};
