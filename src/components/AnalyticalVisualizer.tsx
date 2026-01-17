import { useStore } from '../store/useStore';
import {
    BarChart,
    Bar,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    AreaChart,
    Area,
    Legend,
    LabelList,
} from 'recharts';
import { LuActivity, LuWaves } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export const AnalyticalVisualizer = () => {
    const { columns, activeAnalysisColumn, filteredData, transformColumn } = useStore();
    const [transformation, setTransformation] = useState<string>('');

    const activeCol = columns.find(c => c.id === activeAnalysisColumn);

    if (!activeCol) return null;

    // Prepare data for Histogram (Numeric) or Category Bar Chart
    let chartData: any[] = [];
    if (activeCol.type === 'numeric' && activeCol.stats.min !== undefined && activeCol.stats.max !== undefined) {
        const min = activeCol.stats.min;
        const max = activeCol.stats.max;
        const binSize = (max - min) / 10;
        const bins = Array.from({ length: 11 }, (_, i) => ({
            range: min + i * binSize,
            count: 0,
            label: (min + i * binSize).toFixed(2),
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
        chartData = Object.entries(activeCol.stats.frequencies).map(([name, value]) => ({ name, value }));
    }

    const isNumeric = activeCol.type === 'numeric';

    const handleTransform = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value as 'log' | 'normalize' | 'standardize' | '';
        setTransformation(val);
        if (val && activeCol.id) {
            // @ts-ignore – transformColumn expects specific strings
            transformColumn(activeCol.id, val);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-premium p-10 rounded-[2.5rem] space-y-8 shadow-2xl"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shadow-inner">
                            {isNumeric ? <LuWaves size={24} /> : <LuActivity size={24} />}
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tight flex items-center gap-2 text-foreground">
                                Distribution Analysis
                            </h3>
                            <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">
                                Feature: {activeCol.id} • {activeCol.type}
                            </p>
                        </div>
                    </div>
                    {isNumeric && (
                        <select
                            className="bg-gray-800 text-white rounded px-2 py-1"
                            value={transformation}
                            onChange={handleTransform}
                        >
                            <option value="">Transform…</option>
                            <option value="log">Log Scale</option>
                            <option value="normalize">Normalize (0‑1)</option>
                            <option value="standardize">Standardize (Z‑score)</option>
                        </select>
                    )}
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {isNumeric ? (
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="label"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 700 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(12px)',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                    }}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="var(--color-primary)"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorCount)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        ) : (
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 700 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(12px)',
                                    }}
                                />
                                <Bar dataKey="value" radius={[10, 10, 10, 10]} animationDuration={1500}>
                                    {chartData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`url(#premiumGradient-${index})`} />
                                    ))}
                                    <defs>
                                        {chartData.map((_entry, index) => (
                                            <linearGradient key={`premiumGradient-${index}`} id={`premiumGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="var(--color-primary)" />
                                                <stop offset="100%" stopColor="#ec4899" />
                                            </linearGradient>
                                        ))}
                                    </defs>
                                    <LabelList dataKey="value" position="top" fill="#fff" />
                                </Bar>
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    {activeCol.stats.entropy !== undefined && (
                        <div>
                            <strong>Entropy:</strong> {activeCol.stats.entropy.toFixed(3)}
                        </div>
                    )}
                    {activeCol.stats.cardinality && (
                        <div>
                            <strong>Cardinality:</strong> {activeCol.stats.cardinality}
                        </div>
                    )}
                    {activeCol.stats.dateRange && (
                        <div>
                            <strong>Date Range:</strong> {new Date(activeCol.stats.dateRange.min).toLocaleDateString()} – {new Date(activeCol.stats.dateRange.max).toLocaleDateString()}
                        </div>
                    )}
                    {activeCol.stats.isContinuous !== undefined && (
                        <div>
                            <strong>Continuous:</strong> {activeCol.stats.isContinuous ? 'Yes' : 'No'}
                        </div>
                    )}
                    <div>
                        <strong>Missing:</strong> {activeCol.stats.missingCount}
                    </div>
                    <div>
                        <strong>Unique:</strong> {activeCol.stats.uniqueCount}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
