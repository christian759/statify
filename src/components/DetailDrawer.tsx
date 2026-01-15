import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';
import {
    BsX,
    BsInfoCircle,
    BsActivity,
    BsDatabase,
    BsClockHistory,
    BsPerson,
    BsEnvelope,
    BsPinMap
} from 'react-icons/bs';
import type { Transaction } from '../types';

export const DetailDrawer = () => {
    const { selectedRowId, setSelectedRow, data, updateTransaction } = useStore();
    const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'metadata'>('overview');
    const [editMode, setEditMode] = useState(false);
    const [localData, setLocalData] = useState<Partial<Transaction>>({});

    const transaction = data.find(t => t.id === selectedRowId);

    useEffect(() => {
        if (transaction) {
            setLocalData(transaction);
            setEditMode(false);
        }
    }, [selectedRowId, transaction]);

    if (!selectedRowId || !transaction) return null;

    const hasChanges = JSON.stringify(localData) !== JSON.stringify(transaction);

    const handleSave = () => {
        if (selectedRowId) {
            updateTransaction(selectedRowId, localData);
            setEditMode(false);
        }
    };

    return (
        <div className="fixed inset-y-0 right-0 w-[450px] bg-card border-l border-border shadow-2xl z-[60] flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-border flex items-center justify-between bg-background/50 backdrop-blur-md">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold">Details</h2>
                        {hasChanges && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                Unsaved Changes
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 font-mono">{selectedRowId}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                            editMode ? "bg-slate-200 dark:bg-slate-800" : "bg-primary/10 text-primary hover:bg-primary/20"
                        )}
                    >
                        {editMode ? 'Cancel' : 'Edit'}
                    </button>
                    <button
                        onClick={() => setSelectedRow(null)}
                        className="p-2 hover:bg-secondary rounded-full transition-colors"
                    >
                        <BsX className="text-2xl" />
                    </button>
                </div>
            </div>

            <div className="flex border-b border-border px-6">
                {[
                    { id: 'overview', icon: BsInfoCircle, label: 'Overview' },
                    { id: 'activity', icon: BsActivity, label: 'Activity' },
                    { id: 'metadata', icon: BsDatabase, label: 'Metadata' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-all",
                            activeTab === tab.id
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-8">
                {activeTab === 'overview' && (
                    <>
                        <div className="bg-secondary/20 p-5 rounded-2xl space-y-5 border border-border/50">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Status</label>
                                {editMode ? (
                                    <select
                                        value={localData.status}
                                        onChange={(e) => setLocalData({ ...localData, status: e.target.value as any })}
                                        className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    >
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending</option>
                                        <option value="failed">Failed</option>
                                        <option value="refunded">Refunded</option>
                                    </select>
                                ) : (
                                    <div className="flex items-center justify-between bg-background p-3 rounded-xl border border-border/30">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            transaction.status === 'completed'
                                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                                : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                        )}>
                                            {transaction.status}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground italic">System Verified</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Amount</label>
                                {editMode ? (
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                                        <input
                                            type="number"
                                            value={localData.amount}
                                            onChange={(e) => setLocalData({ ...localData, amount: parseFloat(e.target.value) })}
                                            className="w-full bg-background border border-border rounded-xl pl-8 pr-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-background p-3 rounded-xl border border-border/30">
                                        <span className="text-2xl font-black tracking-tight">${transaction.amount.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-5">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                                <div className="h-px flex-1 bg-border" />
                                Customer Data
                                <div className="h-px flex-1 bg-border" />
                            </h3>
                            <div className="grid gap-3">
                                <div className="flex items-center gap-4 p-4 rounded-xl border border-border/30 hover:bg-secondary/10 transition-colors group">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <BsPerson size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate">{transaction.userName}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Customer</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-xl border border-border/30 hover:bg-secondary/10 transition-colors group">
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                        <BsEnvelope size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate italic underline decoration-blue-500/30">{transaction.userEmail}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Billing Contact</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'activity' && (
                    <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-border">
                        {[
                            { time: '2 minutes ago', desc: 'Status updated by Antigravity AI', icon: BsActivity, color: 'text-primary' },
                            { time: '1 hour ago', desc: 'Address matched with shipping records', icon: BsPinMap, color: 'text-emerald-500' },
                            { time: 'Yesterday', desc: 'Secure payment layer initialized', icon: BsClockHistory, color: 'text-slate-400' }
                        ].map((act, i) => (
                            <div key={i} className="flex gap-4 relative">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center z-10 border-4 border-card",
                                    "bg-secondary/50",
                                    act.color
                                )}>
                                    <act.icon size={12} />
                                </div>
                                <div className="flex-1 pt-1">
                                    <p className="text-sm font-bold leading-none">{act.desc}</p>
                                    <p className="text-[10px] text-muted-foreground mt-2 font-medium bg-secondary/30 w-fit px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                        {act.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'metadata' && (
                    <div className="space-y-4">
                        <div className="relative group">
                            <pre className="bg-slate-950 text-emerald-500 p-5 rounded-2xl text-[11px] font-mono overflow-auto max-h-[500px] border border-emerald-500/20 shadow-inner custom-scrollbar">
                                {JSON.stringify(transaction.metadata, null, 2)}
                            </pre>
                            <button className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur">
                                <BsDatabase size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-border mt-auto bg-background/50 backdrop-blur-md">
                {hasChanges ? (
                    <button
                        onClick={handleSave}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Save Corrections
                    </button>
                ) : (
                    <button className="w-full bg-secondary text-foreground py-4 rounded-2xl font-bold text-sm border border-border hover:bg-secondary/80 transition-colors">
                        Generate Receipt PDF
                    </button>
                )}
                <p className="text-[9px] text-muted-foreground text-center mt-4 uppercase tracking-widest font-black opacity-40">
                    Statify Audit Log Secure v2.0
                </p>
            </div>
        </div>
    );
};
