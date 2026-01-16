import type { Transaction, TransactionStatus } from '../types';
import { subDays, formatISO } from 'date-fns';

const USERS = [
    { name: 'Marcus Aurelius', email: 'm.aurelius@nova-analytics.io' },
    { name: 'Sarah Chen', email: 's.chen@quantum-systems.com' },
    { name: 'Elena Rodriguez', email: 'e.rodriguez@global-stack.net' },
    { name: 'David Park', email: 'd.park@apex-logisitcs.com' },
    { name: 'James Wilson', email: 'j.wilson@sentinel-security.org' },
    { name: 'Aisha Gupta', email: 'a.gupta@infinitum-cloud.io' },
    { name: 'Michael O\'Brien', email: 'm.obrien@emerald-fintech.com' },
    { name: 'Hiroshi Tanaka', email: 'h.tanaka@horizon-dynamics.jp' },
    { name: 'Sofie Nielsen', email: 's.nielsen@nordic-ventures.dk' },
    { name: 'Julian Vance', email: 'j.vance@vanguard-cap.com' }
];

const CATEGORIES = [
    'Cloud Computing',
    'Enterprise SaaS',
    'Hardware Infrastructure',
    'Managed Services',
    'Digital Licensing',
    'Procurement',
    'Consulting Fees'
];

const REGIONS = ['North America (US-East)', 'European Union (EU-West)', 'Asia Pacific (Tokyo)', 'South America (Sao Paulo)', 'Middle East (Dubai)'];
const STATUSES: TransactionStatus[] = ['completed', 'pending', 'failed', 'refunded'];

export const generateMockData = (count: number): Transaction[] => {
    const data: Transaction[] = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
        const id = `TX-${(100000 + i).toString()}`;
        const user = USERS[Math.floor(Math.random() * USERS.length)];
        const categoryIndex = Math.floor(Math.random() * CATEGORIES.length);
        const regionIndex = Math.floor(Math.random() * REGIONS.length);
        const statusIndex = Math.floor(Math.random() * STATUSES.length);

        const timestamp = subDays(now, Math.floor(Math.random() * 60)); // More history (60 days)
        const amount = parseFloat((Math.random() * 25000 + 500).toFixed(2)); // Higher "enterprise" amounts

        data.push({
            id,
            userId: `USR-${1000 + Math.floor(Math.random() * 9000)}`,
            userName: user.name,
            userEmail: user.email,
            amount,
            currency: 'USD',
            status: STATUSES[statusIndex],
            timestamp: formatISO(timestamp),
            category: CATEGORIES[categoryIndex],
            region: REGIONS[regionIndex],
            metadata: {
                ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.1`,
                device: Math.random() > 0.8 ? 'Infrastructure' : (Math.random() > 0.5 ? 'Desktop' : 'Workstation'),
                browser: Math.random() > 0.5 ? 'System-API' : 'Secure-Browser'
            }
        });
    }

    return data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
