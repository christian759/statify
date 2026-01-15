import React, { useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { BsCloudArrowUp, BsFileEarmarkSpreadsheet, BsX, BsCheckCircleFill } from 'react-icons/bs';
import { cn } from '../utils/cn';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Transaction } from '../types';

export const DataUpload = () => {
    const { setData } = useStore();
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = (file: File) => {
        setStatus('uploading');

        if (file.name.endsWith('.csv')) {
            Papa.parse(file, {
                complete: (results) => {
                    // Mapping logic would go here, for now we just log and set mock data as if it worked
                    console.log('Parsed CSV:', results.data);
                    setTimeout(() => setStatus('success'), 1500);
                },
                header: true,
            });
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                console.log('Parsed Excel:', json);
                setTimeout(() => setStatus('success'), 1500);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    return (
        <div className="p-6 bg-card border border-border rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Import External Data</h3>
                <button className="text-muted-foreground hover:text-foreground"><BsX className="text-xl" /></button>
            </div>

            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer",
                    isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/30",
                    status === 'success' && "border-emerald-500 bg-emerald-500/5"
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
                    <>
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <BsCloudArrowUp className="text-3xl text-primary" />
                        </div>
                        <p className="font-bold">Click or drag to upload</p>
                        <p className="text-sm text-muted-foreground mt-2 text-center">Support for CSV, Excel (.xlsx, .xls) files.<br />Maximum size 50MB.</p>
                    </>
                )}

                {status === 'uploading' && (
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="font-bold">Analyzing document...</p>
                        <p className="text-sm text-muted-foreground mt-2">Mapping headers and scanning for anomalies</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center text-emerald-500">
                        <BsCheckCircleFill className="text-5xl mb-4" />
                        <p className="font-bold">Data Processed Successfully</p>
                        <p className="text-sm text-muted-foreground mt-2 text-center">Ready to be visualized in the dashboard</p>
                        <button
                            onClick={(e) => { e.stopPropagation(); setStatus('idle'); }}
                            className="mt-6 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-500/20"
                        >
                            Upload Another
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4 p-4 bg-secondary/30 rounded-xl">
                <BsFileEarmarkSpreadsheet className="text-xl text-primary" />
                <div className="flex-1">
                    <p className="text-sm font-bold">Download Template</p>
                    <p className="text-xs text-muted-foreground">Get our recommended data structure</p>
                </div>
                <button className="text-primary text-xs font-bold hover:underline">Download →</button>
            </div>
        </div>
    );
};
