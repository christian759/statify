import { User, Transaction, Metric, Status } from '../types';
import { subDays, format, startOfToday } from 'date-fns';

const ROLES = ['Admin', 'Editor', 'Viewer', 'Analyst', 'Engineer'];
const STATUSES: Status[] = ['active', 'pending', 'inactive', 'error'];
const CATEGORIES = ['SaaS', 'Infrastructure', 'Marketing', 'Sales', 'Support'];

export const generateMockUsers = (count: number): User[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `user-${i + 1}`,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: ROLES[Math.floor(Math.random() * ROLES.length)],
        status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
        lastActive: format(subDays(new Date(), Math.floor(Math.random() * 30)), 'yyyy-MM-dd HH:mm:ss'),
    }));
};

export const generateMockTransactions = (count: number, userIds: string[]): Transaction[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `tx-${i + 1}`,
        userId: userIds[Math.floor(Math.random() * userIds.length)],
        amount: parseFloat((Math.random() * 1000).toFixed(2)),
        currency: 'USD',
        status: ['completed', 'processing', 'failed'][Math.floor(Math.random() * 3)] as Transaction['status'],
        timestamp: format(subDays(new Date(), Math.floor(Math.random() * 14)), 'yyyy-MM-dd HH:mm:ss'),
        category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
    }));
};

export const generateMockMetrics = (): Metric[] => [
    {
        id: 'total-revenue',
        label: 'Total Revenue',
        value: 124500,
        change: 12.5,
        trend: 'up',
        history: Array.from({ length: 20 }, () => Math.floor(Math.random() * 50) + 50),
    },
    {
        id: 'active-users',
        label: 'Active Users',
        value: 8420,
        change: -2.4,
        trend: 'down',
        history: Array.from({ length: 20 }, () => Math.floor(Math.random() * 30) + 70),
    },
    {
        id: 'churn-rate',
        label: 'Churn Rate',
        value: 1.2,
        change: -0.1,
        trend: 'up',
        history: Array.from({ length: 20 }, () => Math.floor(Math.random() * 10) + 5),
    },
    {
        id: 'avg-order-value',
        label: 'Avg. Order Value',
        value: 85.50,
        change: 5.3,
        trend: 'up',
        history: Array.from({ length: 20 }, () => Math.floor(Math.random() * 20) + 80),
    },
];
