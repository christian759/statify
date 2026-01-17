import { useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { BsCloudArrowUp, BsFileEarmarkSpreadsheet, BsCheckCircleFill, BsDatabase } from 'react-icons/bs';
import { cn } from '../utils/cn';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export const DataUpload = () => {
    const { setDataset } = useStore();
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = (file: File) => {
        setStatus('uploading');
        const metadata = { fileName: file.name, fileSize: file.size };

        if (file.name.endsWith('.csv')) {
            Papa.parse(file, {
                complete: (results) => {
                    setTimeout(() => {
                        setDataset(results.data as any[], metadata);
                        setStatus('success');
                    }, 1000);
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
                }, 1000);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    return (
        <div className="p-8 glass-card rounded-3xl animate-in space-y-8 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-primary">
                        <BsDatabase size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight tracking-tight">Data Input</h3>
                        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.1em]">Legacy & Cloud Import</p>
                    </div>
                </div>
            </div>

            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files[0]; if (file) processFile(file); }}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "flex-1 border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all duration-500 cursor-pointer min-h-[300px]",
                    isDragging ? "border-primary bg-primary/5 scale-[0.98]" : "border-white/5 hover:border-primary/30 hover:bg-white/[0.02] shadow-inner",
                    status === 'success' && "border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
                )}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                />

                {status === 'idle' && (
                    <div className="text-center space-y-6 animate-in">
                        <div className="w-20 h-20 rounded-3xl premium-gradient flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-500">
                            <BsCloudArrowUp className="text-4xl text-white" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-lg font-black tracking-tight">Drop analytics segment</p>
                            <p className="text-[10px] text-muted-foreground/60 uppercase font-black tracking-[0.1em] leading-relaxed max-w-[200px] mx-auto">
                                Supports binary (.xlsx, .xls) and text segments (.csv) up to 1GB
                            </p>
                        </div>
                    </div>
                )}

                {status === 'uploading' && (
                    <div className="flex flex-col items-center space-y-6 animate-pulse">
                        <div className="relative w-20 h-20">
                            <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-lg font-black tracking-tight">Deep Segment Scan</p>
                            <p className="text-[10px] text-muted-foreground/60 uppercase font-black tracking-widest">Neural mapping in progress</p>
                        </div>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center space-y-6 animate-in zoom-in-95 duration-500 text-center">
                        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shadow-xl">
                            <BsCheckCircleFill className="text-4xl" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-lg font-black tracking-tight text-emerald-500">Ingestion Complete</p>
                            <p className="text-[10px] text-muted-foreground/60 uppercase font-black tracking-widest">Segments ready for visualization</p>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); setStatus('idle'); }}
                            className="px-6 py-3 glass text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 rounded-2xl transition-all"
                        >
                            Import New Payload
                        </button>
                    </div>
                )}
            </div>

            <div className="p-5 glass-card rounded-2xl border-none flex items-center gap-5 group hover:bg-white/[0.05] transition-all cursor-pointer">
                <div className="w-12 h-12 glass rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <BsFileEarmarkSpreadsheet size={22} />
                </div>
                <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Developer Assets</p>
                    <p className="text-sm font-bold tracking-tight">Download Schema Template</p>
                </div>
                <button className="w-10 h-10 flex items-center justify-center glass rounded-xl hover:text-primary transition-all">
                    →
                </button>
            </div>
        </div>
    );
};
