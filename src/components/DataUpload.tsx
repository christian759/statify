import { useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { LuDatabase, LuUpload, LuCheck, LuFileJson, LuActivity } from 'react-icons/lu';
import { cn } from '../utils/cn';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';

export const DataUpload = () => {
    const { setDataset, data } = useStore();
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const hasData = data.length > 0;

    const processFile = (file: File) => {
        setStatus('uploading');
        const metadata = { fileName: file.name, fileSize: file.size };

        if (file.name.endsWith('.csv')) {
            Papa.parse(file, {
                complete: (results) => {
                    setTimeout(() => {
                        setDataset(results.data as any[], metadata);
                        setStatus('success');
                        setTimeout(() => setStatus('idle'), 2000);
                    }, 1200);
                },
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true,
            });
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataRaw = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(dataRaw, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                setTimeout(() => {
                    setDataset(json as any[], metadata);
                    setStatus('success');
                    setTimeout(() => setStatus('idle'), 2000);
                }, 1200);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    return (
        <div className={cn(
            "w-full transition-all duration-700 ease-out",
            !hasData ? "max-w-2xl mx-auto pt-20" : "max-w-none"
        )}>
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "relative group cursor-pointer overflow-hidden rounded-[2.5rem] transition-all duration-500",
                    !hasData ? "p-16 glass-premium" : "p-6 glass-card",
                    isDragging && "ring-2 ring-primary scale-[1.02] bg-primary/5",
                    status === 'uploading' && "pointer-events-none"
                )}
            >
                {!hasData && (
                    <div className="absolute inset-0 -z-10 bg-mesh opacity-50 group-hover:opacity-100 transition-opacity" />
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                />

                <div className={cn(
                    "flex flex-col items-center gap-8 text-center",
                    hasData && "flex-row text-left gap-4"
                )}>
                    <AnimatePresence mode="wait">
                        {status === 'idle' && (
                            <motion.div
                                key="idle"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className={cn(
                                    "rounded-3xl flex items-center justify-center transition-all duration-500",
                                    !hasData
                                        ? "w-28 h-28 premium-gradient text-white shadow-2xl shadow-primary/40 group-hover:rotate-6"
                                        : "w-12 h-12 bg-primary/10 text-primary"
                                )}
                            >
                                {!hasData ? <LuUpload size={48} /> : <LuUpload size={24} />}
                            </motion.div>
                        )}
                        {status === 'uploading' && (
                            <motion.div
                                key="uploading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-28 h-28 flex items-center justify-center"
                            >
                                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            </motion.div>
                        )}
                        {status === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-28 h-28 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center"
                            >
                                <LuCheck size={56} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-4">
                        <h3 className={cn(
                            "font-black tracking-tight",
                            !hasData ? "text-5xl" : "text-xl"
                        )}>
                            {status === 'uploading' ? 'Analyzing Dataset...' :
                                status === 'success' ? 'Ready for Science' :
                                    !hasData ? 'Drop your data' : 'Swap Dataset'}
                        </h3>
                        {!hasData && (
                            <p className="text-muted-foreground font-medium text-xl max-w-sm mx-auto leading-relaxed">
                                Upload your raw CSV or Excel payload to begin high-precision analysis.
                            </p>
                        )}
                        {hasData && status === 'idle' && (
                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">
                                <span className="flex items-center gap-1.5"><LuFileJson /> CSV/XLSX</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                <span>Fast Sync</span>
                            </div>
                        )}
                    </div>
                </div>

                {!hasData && status === 'uploading' && (
                    <div className="absolute bottom-0 left-0 w-full h-2 bg-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.2 }}
                            className="h-full premium-gradient"
                        />
                    </div>
                )}
            </div>

            {!hasData && (
                <div className="mt-16 flex items-center justify-center gap-16 opacity-30 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                    <div className="flex flex-col items-center gap-3">
                        <LuActivity size={28} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Realtime Stats</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <LuDatabase size={28} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Edge Process</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <LuFileJson size={28} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Live Viz</span>
                    </div>
                </div>
            )}
        </div>
    );
};
