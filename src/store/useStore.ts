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

const calculateStats = (data: DataRow[]): { columns: ColumnMetadata[]; stats: DatasetStats; correlations: Record<string, Record<string, number>> } => {
    if (data.length === 0) return { columns: [], stats: { rowCount: 0, columnCount: 0 }, correlations: {} };

    const keys = Object.keys(data[0]);
    const numericCols: string[] = [];

    const columns: ColumnMetadata[] = keys.map(key => {
        const values = data.map(row => row[key]);
        const type = detectColumnType(values);
        const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');

        let qualityScore = 100;

        const stats: ColumnMetadata['stats'] = {
            missingCount: data.length - nonNullValues.length,
            uniqueCount: new Set(values).size,
        };

        const missingPercent = (stats.missingCount / data.length) * 100;
        qualityScore -= missingPercent * 0.8;

        if (type === 'numeric') {
            numericCols.push(key);
            const numericValues = nonNullValues.map(v => Number(v));
            stats.min = Math.min(...numericValues);
            stats.max = Math.max(...numericValues);
            stats.mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;

            const sorted = [...numericValues].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            stats.median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

            const mean = stats.mean;
            stats.stdDev = Math.sqrt(numericValues.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / numericValues.length);

            // Outlier Detection (IQR)
            const q1 = sorted[Math.floor(sorted.length * 0.25)] || 0;
            const q3 = sorted[Math.floor(sorted.length * 0.75)] || 0;
            const iqr = q3 - q1;
            const lowerBound = q1 - 1.5 * iqr;
            const upperBound = q3 + 1.5 * iqr;
            const outliers = numericValues.filter(v => v < lowerBound || v > upperBound);
            stats.outlierCount = outliers.length;

            const outlierPercent = (outliers.length / numericValues.length) * 100;
            qualityScore -= outlierPercent * 0.5;

            // Skewness (Simplified Pearson second)
            stats.skewness = stats.stdDev !== 0 ? (3 * (stats.mean - stats.median)) / stats.stdDev : 0;

            // Quality penalty for skewness
            if (Math.abs(stats.skewness) > 1) qualityScore -= 5;
        } else if (type === 'date') {
            const dateValues = nonNullValues.map(v => new Date(String(v)).getTime()).filter(t => !isNaN(t));
            if (dateValues.length > 0) {
                stats.dateRange = {
                    min: new Date(Math.min(...dateValues)).toISOString(),
                    max: new Date(Math.max(...dateValues)).toISOString()
                };
            }
        } else {
            const frequencies: Record<string, number> = {};
            nonNullValues.forEach(v => {
                const s = String(v);
                frequencies[s] = (frequencies[s] || 0) + 1;
            });
            stats.frequencies = Object.fromEntries(
                Object.entries(frequencies)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10)
            );

            // Entropy (Natural diversity index)
            const prob = Object.values(frequencies).map(c => c / nonNullValues.length);
            stats.entropy = -prob.reduce((acc, p) => acc + (p * Math.log(p)), 0);

            const ratio = stats.uniqueCount / data.length;
            stats.cardinality = ratio > 0.8 ? 'high' : ratio > 0.3 ? 'medium' : 'low';
        }

        return { id: key, type, stats, qualityScore: Math.max(0, Math.min(100, qualityScore)) };
    });

    // Correlation Matrix (Pearson)
    const correlations: Record<string, Record<string, number>> = {};
    numericCols.forEach(colA => {
        correlations[colA] = {};
        numericCols.forEach(colB => {
            if (colA === colB) {
                correlations[colA][colB] = 1;
                return;
            }

            const activeRows = data.filter(r =>
                r[colA] !== null && r[colA] !== undefined && r[colA] !== '' &&
                r[colB] !== null && r[colB] !== undefined && r[colB] !== ''
            );

            if (activeRows.length < 2) {
                correlations[colA][colB] = 0;
                return;
            }

            const valA = activeRows.map(r => Number(r[colA]));
            const valB = activeRows.map(r => Number(r[colB]));
            const meanA = valA.reduce((a, b) => a + b, 0) / valA.length;
            const meanB = valB.reduce((a, b) => a + b, 0) / valB.length;

            const num = valA.reduce((acc, v, i) => acc + (v - meanA) * (valB[i] - meanB), 0);
            const den = Math.sqrt(
                valA.reduce((acc, v) => acc + Math.pow(v - meanA, 2), 0) *
                valB.reduce((acc, v) => acc + Math.pow(v - meanB, 2), 0)
            );

            correlations[colA][colB] = den !== 0 ? num / den : 0;
        });
    });

    return {
        columns,
        correlations,
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
        (set, get: () => AppState) => ({
            data: [],
            filteredData: [],
            columns: [],
            correlations: {},
            stats: { rowCount: 0, columnCount: 0 },
            filters: initialFilters,
            insights: [],
            isAnalyzing: false,
            isLoading: false,
            theme: 'light',
            rowSelection: {},
            activeAnalysisColumn: undefined,
            activeTab: 'analysis',
            tableConfig: {
                sorting: [],
                columnVisibility: {},
                columnOrder: [],
                columnPinning: {},
            },

            setActiveTab: (tab: 'analysis' | 'correlations' | 'data') => set({ activeTab: tab }),

            setDataset: (data: DataRow[], metadata: { fileName: string; fileSize: number }) => {
                const { columns, stats, correlations } = calculateStats(data);
                set(() => ({
                    data,
                    filteredData: data,
                    columns,
                    correlations,
                    stats: { ...stats, ...metadata },
                    isLoading: false,
                    insights: []
                }));
                get().generateInsights();
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
                        const counts: Record<any, number> = {};
                        nonNullValues.forEach((v: any) => counts[v] = (counts[v] || 0) + 1);
                        fillValue = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
                    }
                }

                const newData = data.map((row: DataRow) => ({
                    ...row,
                    [columnId]: (row[columnId] === null || row[columnId] === undefined || row[columnId] === '') ? fillValue : row[columnId]
                }));

                const { columns: newCols, stats: newStats, correlations: newCorrs } = calculateStats(newData);
                set((state: AppState) => ({
                    data: newData,
                    filteredData: newData,
                    columns: newCols,
                    correlations: newCorrs,
                    stats: { ...newStats, fileName: state.stats.fileName, fileSize: state.stats.fileSize }
                }));
                get().generateInsights();
            },

            transformColumn: (columnId: string, transformation: 'log' | 'normalize' | 'standardize') => {
                const { data, columns, stats } = get();
                const col = columns.find((c: ColumnMetadata) => c.id === columnId);
                if (!col || col.type !== 'numeric') return;

                const values = data.map(r => Number(r[columnId])).filter(v => !isNaN(v));
                const min = Math.min(...values);
                const max = Math.max(...values);
                const mean = values.reduce((a, b) => a + b, 0) / values.length;
                const stdDev = Math.sqrt(values.reduce((sq: number, n: number) => sq + Math.pow(n - mean, 2), 0) / values.length);

                const newData = data.map((row: DataRow) => {
                    const val = Number(row[columnId]);
                    if (isNaN(val)) return row;

                    let newVal = val;
                    if (transformation === 'log') {
                        newVal = Math.log(Math.abs(val) + 1) * Math.sign(val);
                    } else if (transformation === 'normalize') {
                        newVal = max !== min ? (val - min) / (max - min) : 0;
                    } else if (transformation === 'standardize') {
                        newVal = stdDev !== 0 ? (val - mean) / stdDev : 0;
                    }

                    return { ...row, [columnId]: newVal };
                });

                const { columns: newCols, stats: newStats, correlations: newCorrs } = calculateStats(newData);
                set((state: AppState) => ({
                    data: newData,
                    filteredData: newData,
                    columns: newCols,
                    correlations: newCorrs,
                    stats: { ...newStats, fileName: state.stats.fileName, fileSize: state.stats.fileSize }
                }));
                get().generateInsights();
            },

            generateInsights: () => {
                const { data, columns, correlations } = get();
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

                // 2. High Correlation Detection
                const strongCorrs: string[] = [];
                Object.entries(correlations).forEach(([colA, related]) => {
                    Object.entries(related as Record<string, number>).forEach(([colB, r]) => {
                        if (colA < colB && Math.abs(r as number) > 0.85) {
                            strongCorrs.push(`${colA} & ${colB}`);
                        }
                    });
                });

                if (strongCorrs.length > 0) {
                    insights.push({
                        id: 'correlation-alert',
                        type: 'info',
                        title: 'Multicollinearity Detected',
                        description: `Strong correlations found between ${strongCorrs.slice(0, 2).join(', ')}. These variables may provide redundant information.`,
                        impact: 'medium'
                    });
                }

                // 3. High Variance Insight
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

                // 4. Quality Score Alert
                const lowQualityCols = columns.filter((c: ColumnMetadata) => c.qualityScore < 70);
                if (lowQualityCols.length > 0) {
                    insights.push({
                        id: 'low-quality',
                        type: 'alert',
                        title: 'Feature Quality Warning',
                        description: `Features like ${lowQualityCols[0].id} have low scientific reliability scores. Rehabilitation recommended.`,
                        impact: 'high'
                    });
                }

                set(() => ({ insights }));
            },

            dropColumn: (columnId: string) => {
                const { data, stats } = get();
                const newData = data.map(({ [columnId]: _, ...rest }: DataRow) => rest);
                const { columns: newCols, stats: newStats, correlations: newCorrs } = calculateStats(newData);
                set((state: AppState) => ({
                    data: newData,
                    filteredData: newData,
                    columns: newCols,
                    correlations: newCorrs,
                    stats: { ...newStats, fileName: state.stats.fileName, fileSize: state.stats.fileSize }
                }));
                get().generateInsights();
            },
        }),
        {
            name: 'statify-storage-v2',
            partialize: (state: any) => ({
                theme: state.theme,
                filters: state.filters,
                tableConfig: state.tableConfig,
                activeAnalysisColumn: state.activeAnalysisColumn,
            }),
        }
    )
);
