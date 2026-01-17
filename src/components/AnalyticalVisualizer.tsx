import { useStore } from '../store/useStore';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import { LuBarChart2, LuPieChart, LuWaves } from 'react-icons/lu';
import { cn } from '../utils/cn';

export const AnalyticalVisualizer = () => {
    const { columns, activeAnalysisColumn, filteredData, theme } = useStore();

    const activeCol = columns.find(c => c.id === activeAnalysisColumn);

    if (!activeCol) {
        return (
            <div className="glass-card h-[400px] rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center space-y-4 border-dashed">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-muted-foreground/20">
                    <LuWaves size={32} />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-bold tracking-tight">Virtual Signal Lost</p>
                    <p className="text-xs text-muted-foreground/60 uppercase font-black tracking-widest">Select a dimension from the grid to visualize distribution</p>
                </div>
            </div>
        );
    }

    // Prepare data for Histogram (Numeric) or Category Bar Chart
    let chartData: any[] = [];
    if (activeCol.type === 'numeric' && activeCol.stats.min !== undefined && activeCol.stats.max !== undefined) {
        // Simple Histogram implementation (10 bins)
        const min = activeCol.stats.min;
        const max = activeCol.stats.max;
        const binSize = (max - min) / 10;
        const bins = Array.from({ length: 11 }, (_, i) => ({
            range: min + i * binSize,
            count: 0,
            label: (min + i * binSize).toFixed(2)
        }));

        filteredData.forEach(row => {
            const val = Number(row[activeCol.id]);
            if (!isNaN(val)) {
                const binIndex = Math.min(Math.floor((val - min) / binSize), 10);
                bins[binIndex].count++;
            }
        });
        chartData = bins;
    } else if (activeCol.stats.frequencies) {
        chartData = Object.entries(activeCol.stats.frequencies).map(([name, value]) => ({
            name,
            value
        }));
    }

    const isNumeric = activeCol.type === 'numeric';

    return (
        <div className="glass-card p-10 rounded-[2.5rem] space-y-8 animate-in zoom-in-95 duration-700">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shadow-inner">
                        {isNumeric ? <LuWaves size={24} /> : <LuBarChart2 size={24} />}
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight flex items-center gap-2 text-foreground">
                            {activeCol.id} <span className="text-[10px] opacity-40 uppercase tracking-widest font-mono">Analysis</span>
                        </h3>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">
                            {isNumeric ? 'Probability Density / Distribution' : 'Categorical Feature Frequency'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {isNumeric ? (
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#ffffff05' : '#00000005'} />
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#888' }}
                                dy={10}
                            />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: theme === 'dark' ? '#0f172a' : '#fff',
                                    border: 'none',
                                    borderRadius: '16px',
                                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="#6366f1"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                                animationDuration={2000}
                            />
                        </AreaChart>
                    ) : (
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#ffffff05' : '#00000005'} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#888' }}
                                dy={10}
                            />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: theme === 'dark' ? '#0f172a' : '#fff',
                                    border: 'none',
                                    borderRadius: '16px',
                                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}
                            />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={1500}>
                                {chartData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#818cf8'} />
                                ))}
                            </Bar>
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};
