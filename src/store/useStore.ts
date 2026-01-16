import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Transaction, FilterState, MetricSummary } from '../types';
import { isWithinInterval, parseISO } from 'date-fns';

const calculateMetrics = (data: Transaction[]): MetricSummary => {
    const totalRevenue = data.reduce((acc, curr) => acc + (curr.status === 'completed' ? curr.amount : 0), 0);
    const activeUsers = new Set(data.map(d => d.userId)).size;

    return {
        totalRevenue,
        transactionCount: data.length,
        activeUsers,
        avgOrderValue: data.length > 0 ? totalRevenue / data.length : 0,
    };
};

const initialFilters: FilterState = {
    search: '',
    status: [],
    dateRange: [null, null],
    minAmount: 0,
    maxAmount: 10000,
};

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            data: [],
            filteredData: [],
            metrics: {
                totalRevenue: 0,
                transactionCount: 0,
                activeUsers: 0,
                avgOrderValue: 0,
            },
            filters: initialFilters,
            isLoading: false,
            theme: 'light',
            rowSelection: {},
            tableConfig: {
                sorting: [],
                columnVisibility: {},
                columnOrder: [],
                columnPinning: {},
            },

            setData: (data: Transaction[]) => {
                const metrics = calculateMetrics(data);
                set({ data, filteredData: data, metrics, isLoading: false });
            },

            setFilters: (newFilters: Partial<FilterState>) => {
                const filters = { ...get().filters, ...newFilters };
                const { data } = get();

                const filteredData = data.filter((item: Transaction) => {
                    const matchesSearch = !filters.search ||
                        item.userName.toLowerCase().includes(filters.search.toLowerCase()) ||
                        item.id.toLowerCase().includes(filters.search.toLowerCase());

                    const matchesStatus = filters.status.length === 0 || filters.status.includes(item.status);

                    const matchesAmount = item.amount >= (filters.minAmount || 0) && item.amount <= (filters.maxAmount || 1000000);

                    let matchesDate = true;
                    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
                        const itemDate = parseISO(item.timestamp);
                        matchesDate = isWithinInterval(itemDate, {
                            start: filters.dateRange[0],
                            end: filters.dateRange[1]
                        });
                    }

                    return matchesSearch && matchesStatus && matchesAmount && matchesDate;
                });

                set({ filters, filteredData, metrics: calculateMetrics(filteredData) });
            },

            setTheme: (theme: 'light' | 'dark') => {
                set({ theme });
                if (typeof document !== 'undefined') {
                    document.documentElement.classList.toggle('dark', theme === 'dark');
                }
            },
            setRowSelection: (updater: any) => set((state: AppState) => ({
                rowSelection: typeof updater === 'function' ? updater(state.rowSelection) : updater
            })),

            updateTransaction: (id: string, updates: Partial<Transaction>) => {
                const { data } = get();
                const newData = data.map((item: Transaction) => item.id === id ? { ...item, ...updates } : item);
                set({ data: newData });
                get().setFilters({}); // Re-apply filters
            },

            setTableConfig: (config: any) => set((state: AppState) => ({
                tableConfig: { ...state.tableConfig, ...config }
            })),
        }),
        {
            name: 'statify-storage',
            partialize: (state: any) => ({
                theme: state.theme,
                filters: state.filters,
                tableConfig: state.tableConfig,
                rowSelection: state.rowSelection,
            }),
        }
    )
);
