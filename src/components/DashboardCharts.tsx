import { useMemo } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    AreaChart,
    Area
} from 'recharts';
import { useStore } from '../store';
import { format, parseISO } from 'date-fns';

export const DashboardCharts = () => {
    const filteredData = useStore((state) => state.filteredData);

    // Process data for trend chart
    const trendData = useMemo(() => {
        const groups: Record<string, number> = {};
        filteredData.slice(0, 500).forEach(item => {
            const day = format(parseISO(item.timestamp), 'MMM dd');
            groups[day] = (groups[day] || 0) + item.amount;
        });
        return Object.entries(groups).map(([name, total]) => ({ name, total })).reverse();
    }, [filteredData]);

    // Process data for category pie chart
    const categoryData = useMemo(() => {
        const groups: Record<string, number> = {};
        filteredData.forEach(item => {
            groups[item.category] = (groups[item.category] || 0) + 1;
        });
        return Object.entries(groups).map(([name, value]) => ({ name, value }));
    }, [filteredData]);

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Trend */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold mb-6">Revenue Trend (Last 500 Samples)</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                                itemStyle={{ color: '#3b82f6' }}
                            />
                            <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold mb-6">Category Distribution</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
