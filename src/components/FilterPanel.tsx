import React from 'react';
import { useStore } from '../store/useStore';
import { BsFilter, BsX, BsCheck } from 'react-icons/bs';
import { cn } from '../utils/cn';

const STATUS_OPTIONS = ['completed', 'pending', 'failed', 'refunded'];

export const FilterPanel = () => {
    const { filters, setFilters } = useStore();

    const toggleStatus = (status: string) => {
        const current = filters.status;
        const next = current.includes(status as any)
            ? current.filter(s => s !== status)
            : [...current, status as any];
        setFilters({ status: next });
    };

    const clearAll = () => {
        setFilters({
            status: [],
            search: '',
            minAmount: 0,
            maxAmount: 10000,
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 border border-border rounded-full text-sm font-medium">
                <BsFilter className="text-muted-foreground" />
                <span>Filters</span>
            </div>

            <div className="flex items-center gap-2">
                {STATUS_OPTIONS.map(status => (
                    <button
                        key={status}
                        onClick={() => toggleStatus(status)}
                        className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1",
                            filters.status.includes(status as any)
                                ? "bg-primary border-primary text-primary-foreground"
                                : "bg-background border-border text-muted-foreground hover:border-primary/50"
                        )}
                    >
                        {filters.status.includes(status as any) && <BsCheck className="text-lg" />}
                        <span className="capitalize">{status}</span>
                    </button>
                ))}
            </div>

            <div className="h-6 w-px bg-border mx-2" />

            {(filters.status.length > 0 || filters.search) && (
                <button
                    onClick={clearAll}
                    className="flex items-center gap-1 text-xs font-bold text-destructive hover:underline"
                >
                    <BsX className="text-lg" />
                    Clear All
                </button>
            )}
        </div>
    );
};
