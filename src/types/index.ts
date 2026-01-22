import type { SortingState, VisibilityState, ColumnOrderState, RowSelectionState } from '@tanstack/react-table';

export type ColumnType = 'numeric' | 'categorical' | 'string' | 'date';

export interface Insight {
    id: string;
    type: 'info' | 'warning' | 'success' | 'alert';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
}


export interface ColumnMetadata {
    id: string;
    type: ColumnType;
    stats: {
        min?: number;
        max?: number;
        mean?: number;
        median?: number;
        stdDev?: number;
        missingCount: number;
        uniqueCount: number;
        outlierCount?: number;
        skewness?: number;
        kurtosis?: number;
        frequencies?: Record<string, number>; // For categorical

        // Categorical Intelligence
        entropy?: number; // Diversity index
        cardinality?: 'low' | 'medium' | 'high';

        // Temporal Intelligence
        dateRange?: { min: string; max: string };
        isContinuous?: boolean;
    };
    qualityScore: number; // 0-100
}

export interface DataRow {
    [key: string]: any;
}

export interface DatasetStats {
    rowCount: number;
    columnCount: number;
    fileSize?: number;
    fileName?: string;
}

export interface FilterState {
    search: string;
    columnFilters: Record<string, any>;
}

export interface AppState {
    // Data
    data: DataRow[];
    filteredData: DataRow[];
    columns: ColumnMetadata[];
    correlations: Record<string, Record<string, number>>;
    stats: DatasetStats;
    filters: FilterState;
    insights: Insight[];
    isAnalyzing: boolean;


    // UI State
    isLoading: boolean;
    rowSelection: RowSelectionState;
    activeAnalysisColumn?: string;
    activeTab: 'analysis' | 'correlations' | 'data';

    // Table Config State
    tableConfig: {
        sorting: SortingState;
        columnVisibility: VisibilityState;
        columnOrder: ColumnOrderState;
        columnPinning: {
            left?: string[];
            right?: string[];
        };
    };

    // Actions
    setActiveTab: (tab: 'analysis' | 'correlations' | 'data') => void;

    setDataset: (data: DataRow[], metadata: { fileName: string; fileSize: number }) => void;
    setFilters: (filters: Partial<FilterState>) => void;
    setRowSelection: (updater: any) => void;
    setTableConfig: (config: any) => void;
    setActiveColumn: (columnId: string | undefined) => void;

    // Pro Actions
    imputeMissing: (columnId: string, strategy: 'mean' | 'median' | 'mode' | 'zero') => void;
    transformColumn: (columnId: string, transformation: 'log' | 'normalize' | 'standardize') => void;
    generateInsights: () => void;
    dropColumn: (columnId: string) => void;
}
