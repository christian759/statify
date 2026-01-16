import type { Transaction, TransactionStatus } from '../types';
import { subDays, formatISO } from 'date-fns';

const NAMES = ['Alice Smith', 'Bob Johnson', 'Charlie Brown', 'David Wilson', 'Eve Davis', 'Frank Miller', 'Grace Hopper', 'Hank Pym', 'Ivy League', 'Jack Sparrow'];
const CATEGORIES = ['Electronics', 'SaaS', 'Hardware', 'Consulting', 'Entertainment', 'Health', 'Travel'];
const REGIONS = ['North America', 'Europe', 'Asia-Pacific', 'Latin America', 'Middle East'];
const STATUSES: TransactionStatus[] = ['completed', 'pending', 'failed', 'refunded'];

export const generateMockData = (count: number): Transaction[] => {
    const data: Transaction[] = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
        const id = `tx_${i.toString().padStart(6, '0')}`;
        const nameIndex = Math.floor(Math.random() * NAMES.length);
        const categoryIndex = Math.floor(Math.random() * CATEGORIES.length);
        const regionIndex = Math.floor(Math.random() * REGIONS.length);
        const statusIndex = Math.floor(Math.random() * STATUSES.length);

        const timestamp = subDays(now, Math.floor(Math.random() * 30));
        const amount = parseFloat((Math.random() * 5000 + 10).toFixed(2));

        data.push({
            id,
            userId: `user_${Math.floor(Math.random() * 1000)}`,
            userName: NAMES[nameIndex],
            userEmail: `${NAMES[nameIndex].toLowerCase().replace(' ', '.')}@example.com`,
            amount,
            currency: 'USD',
            status: STATUSES[statusIndex],
            timestamp: formatISO(timestamp),
            category: CATEGORIES[categoryIndex],
            region: REGIONS[regionIndex],
            metadata: {
                ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.0.1`,
                device: Math.random() > 0.5 ? 'Desktop' : 'Mobile',
                browser: Math.random() > 0.5 ? 'Chrome' : 'Safari'
            }
        });
    }

    return data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
