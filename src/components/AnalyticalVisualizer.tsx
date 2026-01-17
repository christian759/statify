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

/**
 * AnalyticalVisualizer – a premium, fully‑re‑designed visualisation component.
 *
 * Layout:
 *   ┌───────────────────────────────────────────────────────────────┐
 *   │ Header (title, description, transformation dropdown)          │
 *   ├───────────────────────┬─────────────────────────────────────┤
 *   │ Chart (2/3 width)      │ Stats panel (1/3 width)               │
 *   │                       │ – entropy, cardinality, date range   │
 *   │                       │ – missing, unique, quality score     │
 *   └───────────────────────┴─────────────────────────────────────┘
 *
 * The component is deliberately lightweight – it only pulls the data it
 * needs from the global store and renders a histogram for numeric columns or a
 * bar chart for categorical data.  All UI elements use the project's glass‑
 * premium theme and modern Tailwind utilities for a premium look.
 */
export const AnalyticalVisualizer = () => {
    const { columns, activeAnalysisColumn, filteredData, transformColumn } = useStore();
    const [transformation, setTransformation] = useState<string>('');

    const activeCol = columns.find(c => c.id === activeAnalysisColumn);
    if (!activeCol) return null;

    // ---------------------------------------------------------------
    // 1️⃣ Data preparation – histogram for numeric, bar for categorical
    // ---------------------------------------------------------------
    let chartData: any[] = [];
    if (activeCol.type === 'numeric' && activeCol.stats.min !== undefined && activeCol.stats.max !== undefined) {
        const min = activeCol.stats.min;
        const max = activeCol.stats.max;
        const binSize = (max - min) / 10;
        const bins = Array.from({ length: 11 }, (_, i) => ({
            label: (min + i * binSize).toFixed(2),
            count: 0,
        }));
        filteredData.forEach(row => {
            const val = Number(row[activeCol.id]);
            if (!isNaN(val)) {
                const idx = Math.min(Math.floor((val - min) / binSize), 10);
                bins[idx].count++;
            }
        });
        chartData = bins;
    } else if (activeCol.stats.frequencies) {
        chartData = Object.entries(activeCol.stats.frequencies).map(([name, value]) => ({ name, value }));
    }

    const isNumeric = activeCol.type === 'numeric';

    // ---------------------------------------------------------------
    // 2️⃣ Transformation handler – calls store action
    // ---------------------------------------------------------------
    const handleTransform = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value as 'log' | 'normalize' | 'standardize' | '';
        setTransformation(val);
        if (val && activeCol.id) {
            // @ts-ignore – transformColumn expects specific strings
            transformColumn(activeCol.id, val);
        }
    };

    // ---------------------------------------------------------------
    // 3️⃣ UI – premium glass card with two‑column layout
    // ---------------------------------------------------------------
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="glass-premium p-8 rounded-2xl space-y-6 shadow-2xl"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shadow-inner">
                            {isNumeric ? <LuWaves size={24} /> : <LuActivity size={24} />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-foreground">
                                {activeCol.id} ({activeCol.type})
                            </h2>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                Distribution Visualisation
                            </p>
                        </div>
                    </div>
                    {isNumeric && (
                        <select
                            className="bg-gray-800 text-white rounded px-3 py-1 text-sm"
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

                {/* Main content – chart + stats panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chart – takes 2/3 of the width */}
                    <div className="lg:col-span-2 h-[340px]">
                        <ResponsiveContainer width="100%" height="100%">
                            {isNumeric ? (
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(15,23,42,0.9)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            backdropFilter: 'blur(8px)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                                        }}
                                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="var(--color-primary)"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#gradient)"
                                        animationDuration={1200}
                                    />
                                </AreaChart>
                            ) : (
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(15,23,42,0.9)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            backdropFilter: 'blur(8px)',
                                        }}
                                    />
                                    <Bar dataKey="value" radius={[8, 8, 8, 8]} animationDuration={1200}>
                                        {chartData.map((_e, i) => (
                                            <Cell key={i} fill={`url(#grad-${i})`} />
                                        ))}
                                        <defs>
                                            {chartData.map((_e, i) => (
                                                <linearGradient key={i} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
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

                    {/* Stats panel – concise, premium cards */}
                    <div className="space-y-4 text-sm text-muted-foreground">
                        {activeCol.stats.entropy !== undefined && (
                            <div className="glass-card p-3 rounded-xl border-none">
                                <strong className="block text-xs uppercase text-muted-foreground/70">Entropy</strong>
                                <span className="text-base font-medium text-foreground">{activeCol.stats.entropy.toFixed(3)}</span>
                            </div>
                        )}
                        {activeCol.stats.cardinality && (
                            <div className="glass-card p-3 rounded-xl border-none">
                                <strong className="block text-xs uppercase text-muted-foreground/70">Cardinality</strong>
                                <span className="text-base font-medium text-foreground">{activeCol.stats.cardinality}</span>
                            </div>
                        )}
                        {activeCol.stats.dateRange && (
                            <div className="glass-card p-3 rounded-xl border-none">
                                <strong className="block text-xs uppercase text-muted-foreground/70">Date Range</strong>
                                <span className="text-base font-medium text-foreground">
                                    {new Date(activeCol.stats.dateRange.min).toLocaleDateString()} – {new Date(activeCol.stats.dateRange.max).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                        {activeCol.stats.isContinuous !== undefined && (
                            <div className="glass-card p-3 rounded-xl border-none">
                                <strong className="block text-xs uppercase text-muted-foreground/70">Continuous</strong>
                                <span className="text-base font-medium text-foreground">{activeCol.stats.isContinuous ? 'Yes' : 'No'}</span>
                            </div>
                        )}
                        <div className="glass-card p-3 rounded-xl border-none">
                            <strong className="block text-xs uppercase text-muted-foreground/70">Missing</strong>
                            <span className="text-base font-medium text-foreground">{activeCol.stats.missingCount}</span>
                        </div>
                        <div className="glass-card p-3 rounded-xl border-none">
                            <strong className="block text-xs uppercase text-muted-foreground/70">Unique</strong>
                            <span className="text-base font-medium text-foreground">{activeCol.stats.uniqueCount}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
