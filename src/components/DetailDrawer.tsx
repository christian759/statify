import React, { useEffect, useState } from 'react';
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
    BsTag
} from 'react-icons/bs';

export const DetailDrawer = () => {
    const { selectedRowId, setSelectedRow, data, updateTransaction } = useStore();
    const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'metadata'>('overview');

    const transaction = data.find(t => t.id === selectedRowId);

    if (!selectedRowId) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-[450px] bg-card border-l border-border shadow-2xl z-[60] flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Transaction Details</h2>
                    <p className="text-sm text-muted-foreground mt-1">{selectedRowId}</p>
                </div>
                <button
                    onClick={() => setSelectedRow(null)}
                    className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                    <BsX className="text-2xl" />
                </button>
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
                        <tab.icon />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-auto p-6">
                {transaction ? (
                    <div className="space-y-8">
                        {activeTab === 'overview' && (
                            <>
                                <div className="bg-secondary/30 p-4 rounded-xl space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Status</span>
                                        <span className={cn(
                                            "px-2 py-1 rounded-full text-xs font-bold uppercase",
                                            transaction.status === 'completed' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                        )}>
                                            {transaction.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Amount</span>
                                        <span className="text-lg font-bold">${transaction.amount}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">User Information</h3>
                                    <div className="grid gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-secondary rounded-lg"><BsPerson className="text-primary" /></div>
                                            <div>
                                                <p className="text-sm font-medium">{transaction.userName}</p>
                                                <p className="text-xs text-muted-foreground">Full Name</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-secondary rounded-lg"><BsEnvelope className="text-primary" /></div>
                                            <div>
                                                <p className="text-sm font-medium">{transaction.userEmail}</p>
                                                <p className="text-xs text-muted-foreground">Email Address</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Location & Category</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-secondary/20 rounded-lg">
                                            <BsPinMap className="text-muted-foreground mb-2" />
                                            <p className="text-sm font-medium">{transaction.region}</p>
                                        </div>
                                        <div className="p-3 bg-secondary/20 rounded-lg">
                                            <BsTag className="text-muted-foreground mb-2" />
                                            <p className="text-sm font-medium">{transaction.category}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'activity' && (
                            <div className="space-y-6">
                                {[
                                    { time: '2 minutes ago', desc: 'Status changed to Completed', icon: BsClockHistory },
                                    { time: '1 hour ago', desc: 'Manual verification passed', icon: BsActivity },
                                    { time: 'Yesterday', desc: 'Payment initiated from Chrome/Desktop', icon: BsClockHistory }
                                ].map((act, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="relative">
                                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center relative z-10">
                                                <act.icon className="text-xs" />
                                            </div>
                                            {i < 2 && <div className="absolute top-8 left-4 w-px h-full bg-border" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{act.desc}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{act.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'metadata' && (
                            <div className="space-y-4">
                                <pre className="bg-secondary/50 p-4 rounded-xl text-xs font-mono overflow-auto max-h-[400px]">
                                    {JSON.stringify(transaction.metadata, null, 2)}
                                </pre>
                                <div className="p-4 border border-dashed border-border rounded-xl">
                                    <p className="text-xs text-muted-foreground text-center">Add custom metadata tags or notes</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground">No data found</p>
                )}
            </div>

            <div className="p-6 border-t border-border mt-auto">
                <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                    Print Receipt
                </button>
            </div>
        </div>
    );
};
