import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { calculateLinearRegression, calculateKMeans } from '../utils/mining';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Line,
    ComposedChart,
    Legend
} from 'recharts';
import { LuBrainCircuit, LuShare2, LuTrendingUp, LuBinary } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

export const DataMiningLab = () => {
    const { columns, filteredData } = useStore();
    const numericCols = columns.filter(c => c.type === 'numeric');

    const [mode, setMode] = useState<'regression' | 'clustering'>('regression');

    // Regression State
    const [regX, setRegX] = useState<string>('');
    const [regY, setRegY] = useState<string>('');

    // Clustering State
    const [clusterX, setClusterX] = useState<string>('');
    const [clusterY, setClusterY] = useState<string>('');
    const [k, setK] = useState<number>(3);

    // ----------------------------------------------------------------------
    // Regression Logic
    // ----------------------------------------------------------------------
    const regressionResult = useMemo(() => {
        if (!regX || !regY || mode !== 'regression') return null;
        return calculateLinearRegression(filteredData, regX, regY);
    }, [filteredData, regX, regY, mode]);

    const regressionChartData = useMemo(() => {
        if (!regressionResult) return [];
        const { points, predict } = regressionResult;
        // Add regression line points (start and end)
        const sortedX = points.map(p => p.x).sort((a, b) => a - b);
        const minX = sortedX[0];
        const maxX = sortedX[sortedX.length - 1];

        return points.map(p => ({
            x: p.x,
            y: p.y,
            predictedY: predict(p.x) // For plotting the line, we ideally need just 2 points but mapping all is easier for specific charts or just distinct line data
        }));
    }, [regressionResult]);

    // Optimize line data (just min/max)
    const lineData = useMemo(() => {
        if (!regressionResult) return [];
        const { points, predict } = regressionResult;
        const xs = points.map(p => p.x);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        return [
            { x: minX, predictedY: predict(minX) },
            { x: maxX, predictedY: predict(maxX) }
        ];
    }, [regressionResult]);


    // ----------------------------------------------------------------------
    // Clustering Logic
    // ----------------------------------------------------------------------
    const clusteringResult = useMemo(() => {
        if (!clusterX || !clusterY || mode !== 'clustering') return null;

        // We only cluster on 2 dimensions for visualization purposes here
        const result = calculateKMeans(filteredData, [clusterX, clusterY], k);
        if (!result) return null;

        // Map back to plot data
        // We need to re-scan data to match the filtered logic in mining.ts
        const chartPoints = [];
        const { assignments, centroids } = result;

        // We need to re-scan data to match the filtered logic in mining.ts
        let validIdx = 0;
        for (let i = 0; i < filteredData.length; i++) {
            const x = Number(filteredData[i][clusterX]);
            const y = Number(filteredData[i][clusterY]);
            if (!isNaN(x) && !isNaN(y)) {
                chartPoints.push({
                    x,
                    y,
                    cluster: assignments[validIdx]
                });
                validIdx++;
            }
        }
        return { chartPoints, centroids };
    }, [filteredData, clusterX, clusterY, k, mode]);

    // Colors for clusters
    const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-premium rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 z-10 relative">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 flex items-center justify-center shadow-inner border border-white/5">
                        <LuBrainCircuit size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-foreground">Data Mining Lab</h2>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Unsupervised Learning & Regression</p>
                    </div>
                </div>

                <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
                    <button
                        onClick={() => setMode('regression')}
                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'regression' ? 'bg-indigo-600 text-white shadow-lg' : 'text-muted-foreground hover:text-white'}`}
                    >
                        <LuTrendingUp size={14} /> Regression
                    </button>
                    <button
                        onClick={() => setMode('clustering')}
                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'clustering' ? 'bg-pink-600 text-white shadow-lg' : 'text-muted-foreground hover:text-white'}`}
                    >
                        <LuShare2 size={14} /> Clustering
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-white/5 p-6 rounded-2xl border border-white/5">
                {mode === 'regression' ? (
                    <>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Independent (X)</label>
                            <select
                                value={regX}
                                onChange={e => setRegX(e.target.value)}
                                className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all"
                            >
                                <option value="">Select Feature...</option>
                                {numericCols.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Dependent (Y)</label>
                            <select
                                value={regY}
                                onChange={e => setRegY(e.target.value)}
                                className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all"
                            >
                                <option value="">Select Target...</option>
                                {numericCols.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                            </select>
                        </div>
                        <div className="flex items-end pb-2">
                            {regressionResult && (
                                <div className="flex gap-4">
                                    <div className="text-center">
                                        <div className="text-[10px] uppercase text-muted-foreground font-black">R-Squared</div>
                                        <div className="text-xl font-black text-emerald-400">{(regressionResult.rSquared * 100).toFixed(1)}%</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[10px] uppercase text-muted-foreground font-black">Slope</div>
                                        <div className="text-xl font-black text-indigo-400">{regressionResult.slope.toFixed(4)}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Feature A (X)</label>
                            <select
                                value={clusterX}
                                onChange={e => setClusterX(e.target.value)}
                                className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-pink-500 outline-none transition-all"
                            >
                                <option value="">Select Feature...</option>
                                {numericCols.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Feature B (Y)</label>
                            <select
                                value={clusterY}
                                onChange={e => setClusterY(e.target.value)}
                                className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-pink-500 outline-none transition-all"
                            >
                                <option value="">Select Feature...</option>
                                {numericCols.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Clusters (K={k})</label>
                            <input
                                type="range"
                                min="2"
                                max="10"
                                value={k}
                                onChange={e => setK(Number(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Visualization Canvas */}
            <div className="h-[400px] w-full bg-[#0f172a]/50 rounded-2xl border border-white/5 relative overflow-hidden backdrop-blur-sm">
                <ResponsiveContainer width="100%" height="100%">
                    {mode === 'regression' && regressionResult ? (
                        <ComposedChart
                            data={regressionChartData}
                            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis type="number" dataKey="x" name={regX} tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={false} />
                            <YAxis type="number" dataKey="y" name={regY} tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                            />
                            <Scatter name="Data Points" data={regressionResult.points} fill="#818cf8" fillOpacity={0.6} />
                            <Line type="monotone" dataKey="predictedY" stroke="#c084fc" strokeWidth={3} dot={false} activeDot={false} data={lineData} />
                        </ComposedChart>
                    ) : mode === 'clustering' && clusteringResult ? (
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis type="number" dataKey="x" name={clusterX} tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={false} />
                            <YAxis type="number" dataKey="y" name={clusterY} tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                            />
                            {Array.from({ length: k }).map((_, idx) => (
                                <Scatter
                                    key={idx}
                                    name={`Cluster ${idx + 1}`}
                                    data={clusteringResult.chartPoints.filter(p => p.cluster === idx)}
                                    fill={COLORS[idx % COLORS.length]}
                                />
                            ))}
                        </ScatterChart>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-30 gap-4">
                            <LuBinary size={48} />
                            <p className="text-xs font-black uppercase tracking-widest">Select parameters to initialize engine</p>
                        </div>
                    )}
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
