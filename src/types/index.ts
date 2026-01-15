import type { SortingState, VisibilityState, ColumnOrderState, RowSelectionState } from '@tanstack/react-table';

export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'refunded';

export interface Transaction {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    amount: number;
    currency: string;
    status: TransactionStatus;
    timestamp: string;
    category: string;
    region: string;
    metadata: {
        ip: string;
        device: 'Desktop' | 'Mobile';
        browser: 'Chrome' | 'Safari' | 'Firefox' | 'Edge';
    };
}

export interface MetricSummary {
    totalRevenue: number;
    transactionCount: number;
    activeUsers: number;
    avgOrderValue: number;
}

export interface FilterState {
    search: string;
    status: TransactionStatus[];
    dateRange: [Date | null, Date | null];
    minAmount: number;
    maxAmount: number;
}

export interface AppState {
    // Data
    data: Transaction[];
    filteredData: Transaction[];
    metrics: MetricSummary;
    filters: FilterState;

    // UI State
    isLoading: boolean;
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    selectedRowId: string | null;
    rowSelection: RowSelectionState;

    // Table Config State (for persistence)
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
    setData: (data: Transaction[]) => void;
    setFilters: (filters: Partial<FilterState>) => void;
    setTheme: (theme: 'light' | 'dark') => void;
    toggleSidebar: () => void;
    setSelectedRow: (id: string | null) => void;
    setRowSelection: (updater: any) => void;
    updateTransaction: (id: string, updates: Partial<Transaction>) => void;
    setTableConfig: (config: any) => void;
}
