import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Transaction, FilterState, MetricSummary } from '../types';
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
            isLoading: true,
            sidebarOpen: true,
            theme: 'light',
            selectedRowId: null,

            setData: (data) => {
                const metrics = calculateMetrics(data);
                set({ data, filteredData: data, metrics, isLoading: false });
            },

            setFilters: (newFilters) => {
                const filters = { ...get().filters, ...newFilters };
                const { data } = get();

                const filteredData = data.filter(item => {
                    const matchesSearch = !filters.search ||
                        item.userName.toLowerCase().includes(filters.search.toLowerCase()) ||
                        item.id.toLowerCase().includes(filters.search.toLowerCase());

                    const matchesStatus = filters.status.length === 0 || filters.status.includes(item.status);

                    const matchesAmount = item.amount >= filters.minAmount && item.amount <= filters.maxAmount;

                    let matchesDate = true;
                    if (filters.dateRange[0] && filters.dateRange[1]) {
                        matchesDate = isWithinInterval(parseISO(item.timestamp), {
                            start: filters.dateRange[0],
                            end: filters.dateRange[1]
                        });
                    }

                    return matchesSearch && matchesStatus && matchesAmount && matchesDate;
                });

                set({ filters, filteredData, metrics: calculateMetrics(filteredData) });
            },

            setTheme: (theme) => set({ theme }),
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            setSelectedRow: (id) => set({ selectedRowId: id }),

            updateTransaction: (id, updates) => {
                const { data } = get();
                const newData = data.map(item => item.id === id ? { ...item, ...updates } : item);
                set({ data: newData });
                get().setFilters({}); // Re-apply filters
            },
        }),
        {
            name: 'statify-storage',
            partialize: (state) => ({
                theme: state.theme,
                sidebarOpen: state.sidebarOpen,
                filters: state.filters
            }),
        }
    )
);
