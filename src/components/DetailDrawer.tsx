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
    BsPinMap,
    BsShieldCheck
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
        <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] glass border-l-0 sm:border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[100] flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl premium-gradient flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                            <BsInfoCircle size={20} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight tracking-tight">Details</h2>
                            <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest mt-0.5">{selectedRowId}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95",
                            editMode ? "bg-slate-200 dark:bg-slate-800 text-foreground" : "glass text-primary hover:bg-primary/10 border-primary/20"
                        )}
                    >
                        {editMode ? 'Cancel' : 'Edit Row'}
                    </button>
                    <button
                        onClick={() => setSelectedRow(null)}
                        className="w-10 h-10 flex items-center justify-center glass hover:bg-rose-500/10 hover:text-rose-500 rounded-full transition-all active:rotate-90"
                    >
                        <BsX className="text-2xl" />
                    </button>
                </div>
            </div>

            <div className="flex border-b border-white/5 px-8 bg-white/[0.02]">
                {[
                    { id: 'overview', icon: BsInfoCircle, label: 'Overview' },
                    { id: 'activity', icon: BsActivity, label: 'Activity' },
                    { id: 'metadata', icon: BsDatabase, label: 'Metadata' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex items-center gap-2 px-5 py-5 text-[10px] font-black uppercase tracking-[0.1em] border-b-2 transition-all",
                            activeTab === tab.id
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground/60 hover:text-foreground hover:bg-white/[0.02]"
                        )}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-10 scrollbar-premium">
                {activeTab === 'overview' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="glass-card p-6 rounded-3xl space-y-6 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                    <BsShieldCheck size={12} className="text-emerald-500" />
                                    Security Status
                                </label>
                                {editMode ? (
                                    <select
                                        value={localData.status}
                                        onChange={(e) => setLocalData({ ...localData, status: e.target.value as any })}
                                        className="w-full bg-slate-100 dark:bg-slate-900 border border-white/5 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                                    >
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending</option>
                                        <option value="failed">Failed</option>
                                        <option value="refunded">Refunded</option>
                                    </select>
                                ) : (
                                    <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                                        <span className={cn(
                                            "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                                            transaction.status === 'completed'
                                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                        )}>
                                            {transaction.status}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] px-1">Transaction Value</label>
                                {editMode ? (
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                                        <input
                                            type="number"
                                            value={localData.amount}
                                            onChange={(e) => setLocalData({ ...localData, amount: parseFloat(e.target.value) })}
                                            className="w-full bg-slate-100 dark:bg-slate-900 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-lg font-black outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5">
                                        <span className="text-4xl font-black tracking-tighter tabular-nums bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">
                                            ${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-10 space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 text-center flex items-center gap-4">
                                <div className="h-px flex-1 bg-white/5" />
                                Account Information
                                <div className="h-px flex-1 bg-white/5" />
                            </h3>
                            <div className="grid gap-4">
                                <div className="glass-card p-5 rounded-3xl group hover:bg-white/[0.05] transition-all cursor-default">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                                            <BsPerson size={22} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-lg font-black truncate tracking-tight">{transaction.userName}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="glass-card p-5 rounded-3xl group hover:bg-white/[0.05] transition-all cursor-default">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-500">
                                            <BsEnvelope size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-md font-bold truncate opacity-80">{transaction.userEmail}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-300">
                            <BsClockHistory size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500">No Recent Activity</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Activities will appear as they occur</p>
                        </div>
                    </div>
                )}

                {activeTab === 'metadata' && (
                    <div className="animate-in zoom-in-95 duration-500">
                        <div className="relative group p-1 glass-card rounded-3xl overflow-hidden">
                            <pre className="bg-slate-950/80 text-emerald-400 p-8 rounded-[22px] text-xs font-mono overflow-auto max-h-[600px] border border-white/5 shadow-inner scrollbar-premium">
                                {JSON.stringify(transaction.metadata, null, 2)}
                            </pre>
                            <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button className="p-3 glass hover:bg-white/10 rounded-xl text-white transition-all shadow-xl">
                                    <BsDatabase size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-8 border-t border-white/5 bg-white/[0.02]">
                {hasChanges ? (
                    <button
                        onClick={handleSave}
                        className="w-full premium-gradient text-white py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Sync Changes
                    </button>
                ) : (
                    <button className="w-full glass text-foreground py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all active:scale-[0.98]">
                        Download Transaction Receipt
                    </button>
                )}
                <div className="flex items-center justify-center gap-2 mt-6 opacity-20">
                    <div className="h-px flex-1 bg-foreground" />
                    <p className="text-[9px] font-bold uppercase tracking-[0.4em]">
                        Statify End-to-End Encryption Enabled
                    </p>
                    <div className="h-px flex-1 bg-foreground" />
                </div>
            </div>
        </div>
    );
};
