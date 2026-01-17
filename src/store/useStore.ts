import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, DataRow, FilterState, ColumnMetadata, ColumnType, DatasetStats } from '../types';

const detectColumnType = (values: any[]): ColumnType => {
    const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
    if (nonNullValues.length === 0) return 'string';

    const isNumeric = nonNullValues.every(v => !isNaN(Number(v)));
    if (isNumeric) return 'numeric';

    const isDate = nonNullValues.every(v => !isNaN(Date.parse(v)));
    if (isDate) return 'date';

    return 'string';
};

const calculateStats = (data: DataRow[]): { columns: ColumnMetadata[]; stats: DatasetStats } => {
    if (data.length === 0) return { columns: [], stats: { rowCount: 0, columnCount: 0 } };

    const keys = Object.keys(data[0]);
    const columns: ColumnMetadata[] = keys.map(key => {
        const values = data.map(row => row[key]);
        const type = detectColumnType(values);
        const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');

        const stats: ColumnMetadata['stats'] = {
            missingCount: data.length - nonNullValues.length,
            uniqueCount: new Set(values).size,
        };

        if (type === 'numeric') {
            const numericValues = nonNullValues.map(v => Number(v));
            stats.min = Math.min(...numericValues);
            stats.max = Math.max(...numericValues);
            stats.mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;

            const sorted = [...numericValues].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            stats.median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

            const mean = stats.mean;
            stats.stdDev = Math.sqrt(numericValues.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / numericValues.length);
        } else {
            // Categorical/String frequency analysis
            const frequencies: Record<string, number> = {};
            nonNullValues.forEach(v => {
                const s = String(v);
                frequencies[s] = (frequencies[s] || 0) + 1;
            });
            stats.frequencies = Object.fromEntries(
                Object.entries(frequencies)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10) // Top 10 frequencies
            );
        }

        return { id: key, type, stats };
    });

    return {
        columns,
        stats: {
            rowCount: data.length,
            columnCount: keys.length,
        }
    };
};

const initialFilters: FilterState = {
    search: '',
    columnFilters: {},
};

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            data: [],
            filteredData: [],
            columns: [],
            stats: { rowCount: 0, columnCount: 0 },
            filters: initialFilters,
            isLoading: false,
            theme: 'light',
            rowSelection: {},
            activeAnalysisColumn: undefined,
            tableConfig: {
                sorting: [],
                columnVisibility: {},
                columnOrder: [],
                columnPinning: {},
            },

            setDataset: (data: DataRow[], metadata: { fileName: string; fileSize: number }) => {
                const { columns, stats } = calculateStats(data);
                set({
                    data,
                    filteredData: data,
                    columns,
                    stats: { ...stats, ...metadata },
                    isLoading: false
                });
            },

            setFilters: (newFilters: Partial<FilterState>) => {
                const filters = { ...get().filters, ...newFilters };
                const { data } = get();

                const filteredData = data.filter((item: DataRow) => {
                    const matchesSearch = !filters.search ||
                        Object.values(item).some(val =>
                            String(val).toLowerCase().includes(filters.search.toLowerCase())
                        );

                    const matchesColumnFilters = Object.entries(filters.columnFilters).every(([key, value]) => {
                        if (!value) return true;
                        return String(item[key]).toLowerCase().includes(String(value).toLowerCase());
                    });

                    return matchesSearch && matchesColumnFilters;
                });

                set({ filters, filteredData });
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

            setTableConfig: (config: any) => set((state: AppState) => ({
                tableConfig: { ...state.tableConfig, ...config }
            })),

            setActiveColumn: (columnId: string | undefined) => set({ activeAnalysisColumn: columnId }),
        }),
        {
            name: 'statify-data-science-storage',
            partialize: (state: any) => ({
                theme: state.theme,
                filters: state.filters,
                tableConfig: state.tableConfig,
                activeAnalysisColumn: state.activeAnalysisColumn,
            }),
        }
    )
);
