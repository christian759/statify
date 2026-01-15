export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

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
    metadata: Record<string, any>;
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
    data: Transaction[];
    filteredData: Transaction[];
    metrics: MetricSummary;
    filters: FilterState;
    isLoading: boolean;
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    selectedRowId: string | null;

    // Actions
    setData: (data: Transaction[]) => void;
    setFilters: (filters: Partial<FilterState>) => void;
    setTheme: (theme: 'light' | 'dark') => void;
    toggleSidebar: () => void;
    setSelectedRow: (id: string | null) => void;
    updateTransaction: (id: string, updates: Partial<Transaction>) => void;
}
