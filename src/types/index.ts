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
        frequencies?: Record<string, number>; // For categorical
    };
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
    stats: DatasetStats;
    filters: FilterState;
    insights: Insight[];
    isAnalyzing: boolean;


    // UI State
    isLoading: boolean;
    theme: 'light' | 'dark';
    rowSelection: RowSelectionState;
    activeAnalysisColumn?: string;

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
    setDataset: (data: DataRow[], metadata: { fileName: string; fileSize: number }) => void;
    setFilters: (filters: Partial<FilterState>) => void;
    setTheme: (theme: 'light' | 'dark') => void;
    setRowSelection: (updater: any) => void;
    setTableConfig: (config: any) => void;
    setActiveColumn: (columnId: string | undefined) => void;

    // Pro Actions
    imputeMissing: (columnId: string, strategy: 'mean' | 'median' | 'mode' | 'zero') => void;
    generateInsights: () => void;
    dropColumn: (columnId: string) => void;
}
