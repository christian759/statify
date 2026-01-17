import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, DataRow, FilterState, ColumnMetadata, ColumnType, DatasetStats, Insight } from '../types';

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
            insights: [],
            isAnalyzing: false,
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
                    isLoading: false,
                    insights: [] // Reset insights on new dataset
                });
                get().generateInsights(); // Auto-generate on load
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

            // Pro Actions
            imputeMissing: (columnId: string, strategy: 'mean' | 'median' | 'mode' | 'zero') => {
                const { data, columns, stats } = get();
                const col = columns.find((c: ColumnMetadata) => c.id === columnId);
                if (!col) return;

                let fillValue: any;
                const nonNullValues = data.map((r: DataRow) => r[columnId]).filter((v: any) => v !== null && v !== undefined && v !== '');

                if (strategy === 'zero') {
                    fillValue = 0;
                } else if (strategy === 'mean' && col.type === 'numeric') {
                    fillValue = col.stats.mean;
                } else if (strategy === 'median' && col.type === 'numeric') {
                    fillValue = col.stats.median;
                } else if (strategy === 'mode') {
                    if (col.stats.frequencies) {
                        fillValue = Object.keys(col.stats.frequencies)[0];
                    } else {
                        // Calc mode manually if frequencies missing
                        const counts: Record<any, number> = {};
                        nonNullValues.forEach((v: any) => counts[v] = (counts[v] || 0) + 1);
                        fillValue = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
                    }
                }

                const newData = data.map((row: DataRow) => ({
                    ...row,
                    [columnId]: (row[columnId] === null || row[columnId] === undefined || row[columnId] === '') ? fillValue : row[columnId]
                }));

                const { columns: newCols, stats: newStats } = calculateStats(newData);
                set({
                    data: newData,
                    filteredData: newData,
                    columns: newCols,
                    stats: { ...newStats, fileName: stats.fileName, fileSize: stats.fileSize }
                });
                get().generateInsights();
            },

            generateInsights: () => {
                const { data, columns, stats } = get();
                if (data.length === 0) return;

                const insights: Insight[] = [];

                // 1. Missing Values Insight
                const columnsWithMissing = columns.filter((c: ColumnMetadata) => c.stats.missingCount > 0);
                if (columnsWithMissing.length > 0) {
                    insights.push({
                        id: 'missing-values',
                        type: 'warning',
                        title: 'Data Integrity Alert',
                        description: `${columnsWithMissing.length} columns contain missing values. Consider using the Imputation tool to clean your dataset.`,
                        impact: 'high'
                    });
                }

                // 2. High Variance Insight
                const highVarianceCols = columns.filter((c: ColumnMetadata) => c.type === 'numeric' && (c.stats.stdDev || 0) > (c.stats.mean || 1) * 2);
                if (highVarianceCols.length > 0) {
                    insights.push({
                        id: 'high-variance',
                        type: 'info',
                        title: 'High Dispersion Detected',
                        description: `Significant variance found in ${highVarianceCols[0].id}. This might indicate outliers or extreme data distribution.`,
                        impact: 'medium'
                    });
                }

                // 3. Unique Identifiers
                const potentialIds = columns.filter((c: ColumnMetadata) => c.stats.uniqueCount === stats.rowCount);
                if (potentialIds.length > 0) {
                    insights.push({
                        id: 'id-col',
                        type: 'success',
                        title: 'Identity Metadata',
                        description: `Column "${potentialIds[0].id}" appears to be a unique identifier (ID). Statistical analysis on this column might be irrelevant.`,
                        impact: 'low'
                    });
                }

                set({ insights });
            },

            dropColumn: (columnId: string) => {
                const { data, stats } = get();
                const newData = data.map(({ [columnId]: _, ...rest }: DataRow) => rest);
                const { columns: newCols, stats: newStats } = calculateStats(newData);
                set({
                    data: newData,
                    filteredData: newData,
                    columns: newCols,
                    stats: { ...newStats, fileName: stats.fileName, fileSize: stats.fileSize }
                });
                get().generateInsights();
            },
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
