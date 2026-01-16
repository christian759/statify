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
import { useStore } from '../store/useStore';
import type { AppState } from '../types';
import { format, parseISO } from 'date-fns';

export const DashboardCharts = () => {
    const filteredData = useStore((state: AppState) => state.filteredData);

    // Process data for trend chart (Area)
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

    // Process data for regional bar chart
    const regionalData = useMemo(() => {
        const groups: Record<string, number> = {};
        filteredData.forEach(item => {
            groups[item.region] = (groups[item.region] || 0) + item.amount;
        });
        return Object.entries(groups).map(([name, amount]) => ({ name, amount }));
    }, [filteredData]);

    const COLORS = ['#3b82f6', '#64748b', '#0f172a', '#334155', '#475569', '#1e293b'];

    const tooltipStyle = {
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        padding: '8px',
        fontSize: '12px',
        color: 'var(--foreground)'
    };

    return (
        <div className="space-y-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend (Area Chart) */}
                <div className="glass-card p-6 rounded-2xl animate-in delay-1">
                    <h3 className="text-sm font-bold mb-6 text-slate-500 uppercase tracking-wider">Revenue Trend</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip
                                    contentStyle={tooltipStyle}
                                    itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Regional Performance (Bar Chart) */}
                <div className="glass-card p-6 rounded-2xl animate-in delay-2">
                    <h3 className="text-sm font-bold mb-6 text-slate-500 uppercase tracking-wider">Revenue by Region</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={regionalData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
                                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32}>
                                    {regionalData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#3b82f6bb'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-center">
                {/* Daily Volume (Line Chart) */}
                <div className="glass-card p-6 rounded-2xl animate-in delay-3">
                    <h3 className="text-sm font-bold mb-6 text-slate-500 uppercase tracking-wider">Daily Activity</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, strokeWidth: 0 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Breakdown (Pie) */}
                <div className="glass-card p-6 rounded-2xl animate-in delay-4">
                    <h3 className="text-sm font-bold mb-6 text-slate-500 uppercase tracking-wider">Category Distribution</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                    animationBegin={0}
                                    animationDuration={1500}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
