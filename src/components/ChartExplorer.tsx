import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area,
    ScatterChart, Scatter, PieChart, Pie, RadarChart, Radar, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { LuSettings2, LuLayoutGrid, LuActivity } from 'react-icons/lu';
import { motion } from 'framer-motion';

export const ChartExplorer = () => {
    const { columns, filteredData } = useStore();

    // Config State
    const [chartType, setChartType] = useState<'line' | 'bar' | 'area' | 'scatter' | 'pie' | 'radar'>('line');
    const [xAxis, setXAxis] = useState<string>('');
    const [yAxis, setYAxis] = useState<string>('');
    const [color, setColor] = useState<string>('#8884d8');

    const numericCols = columns.filter(c => c.type === 'numeric');

    // Prepare Data
    const chartData = useMemo(() => {
        if (!xAxis || !yAxis) return [];
        // Limit to 50 points for performance in scatter/lines if not aggregated
        // For scatter we want all points
        // For line/bar we might want to aggregate if X is categorical? 
        // Let's keep it simple: raw data plotting for now, but limit rows if too many.
        return filteredData.slice(0, 200).map(row => ({
            x: row[xAxis], // Can be string or number
            y: Number(row[yAxis]), // Must be number
        })).filter(d => !isNaN(d.y));
    }, [filteredData, xAxis, yAxis]);

    // Render Chart
    const renderChart = () => {
        if (!xAxis || !yAxis) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-30">
                    <LuLayoutGrid size={48} />
                    <p className="mt-4 text-xs font-black uppercase tracking-widest">Select dimensions to visualize</p>
                </div>
            );
        }

        const commonProps = {
            data: chartData,
            margin: { top: 20, right: 30, left: 20, bottom: 20 }
        };

        switch (chartType) {
            case 'line':
                return (
                    <LineChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="x" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                        <Legend />
                        <Line type="monotone" dataKey="y" stroke={color} strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
                    </LineChart>
                );
            case 'bar':
                return (
                    <BarChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="x" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                        <Legend />
                        <Bar dataKey="y" fill={color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                );
            case 'area':
                return (
                    <AreaChart {...commonProps}>
                        <defs>
                            <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="x" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="y" stroke={color} fillOpacity={1} fill="url(#colorY)" />
                    </AreaChart>
                );
            case 'scatter':
                return (
                    <ScatterChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="x" name={xAxis} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <YAxis dataKey="y" name={yAxis} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                        <Scatter name="Data" data={chartData} fill={color} />
                    </ScatterChart>
                );
            case 'pie':
                // Aggregate for pie? Pie usually needs categorical X and numeric Y sum
                // Let's assume user wants to sum Y for each X
                const pieData = chartData.reduce((acc: any[], curr) => {
                    const existing = acc.find(item => item.name === curr.x);
                    if (existing) {
                        existing.value += curr.y;
                    } else {
                        acc.push({ name: curr.x, value: curr.y });
                    }
                    return acc;
                }, []).slice(0, 10); // Limit slices

                const COLORS = [color, '#06b6d4', '#f59e0b', '#ec4899', '#10b981'];

                return (
                    <PieChart>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                );
            case 'radar':
                // Similar aggregate for radar
                const radarData = chartData.slice(0, 50); // Radar gets messy with too many points
                return (
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="x" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <Radar name={yAxis} dataKey="y" stroke={color} fill={color} fillOpacity={0.6} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                    </RadarChart>
                );
            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-premium rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col h-[600px]"
        >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shadow-inner">
                        <LuActivity size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">Chart Explorer</h2>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Custom Visualizations</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl">
                    {['line', 'bar', 'area', 'scatter', 'pie', 'radar'].map(t => (
                        <button
                            key={t}
                            onClick={() => setChartType(t as any)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${chartType === t ? 'bg-orange-500 text-white shadow-lg' : 'text-muted-foreground hover:bg-white/5'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-6 h-full min-h-0">
                {/* Sidebar Controls */}
                <div className="w-64 shrink-0 flex flex-col gap-6 bg-white/5 rounded-2xl p-6 border border-white/5 overflow-y-auto">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <LuSettings2 size={12} /> Dimension (X Axis)
                        </label>
                        <select
                            value={xAxis}
                            onChange={e => setXAxis(e.target.value)}
                            className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-orange-500 outline-none"
                        >
                            <option value="">Select Column...</option>
                            {columns.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <LuSettings2 size={12} /> Metric (Y Axis)
                        </label>
                        <select
                            value={yAxis}
                            onChange={e => setYAxis(e.target.value)}
                            className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-orange-500 outline-none"
                        >
                            <option value="">Select Metric...</option>
                            {numericCols.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Color Theme</label>
                        <div className="flex flex-wrap gap-2">
                            {['#8884d8', '#82ca9d', '#ffc658', '#ef4444', '#ec4899', '#f97316'].map(c => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-white' : 'border-transparent'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Graph Area */}
                <div className="flex-1 bg-[#0f172a]/50 rounded-2xl border border-white/5 relative overflow-hidden backdrop-blur-sm p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        {renderChart() || <div />}
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    );
};
