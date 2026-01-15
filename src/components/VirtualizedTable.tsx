import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnDef,
    flexRender,
    SortingState,
    ColumnOrderState,
    VisibilityState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Transaction } from '../types';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';
import {
    BsArrowDown,
    BsArrowUp,
    BsThreeDotsVertical,
    BsPinAngleFill,
    BsEyeSlash
} from 'react-icons/bs';

export const VirtualizedTable = () => {
    const { filteredData, selectedRowId, setSelectedRow, updateTransaction } = useStore();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);

    const columns = useMemo<ColumnDef<Transaction>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                size: 100,
                cell: (info) => <span className="font-mono text-xs text-muted-foreground">{info.getValue() as string}</span>,
            },
            {
                accessorKey: 'userName',
                header: 'User',
                size: 200,
                cell: (info) => (
                    <div className="flex flex-col">
                        <span className="font-medium">{info.getValue() as string}</span>
                        <span className="text-xs text-muted-foreground">{(info.row.original as any).userEmail}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'amount',
                header: 'Amount',
                size: 120,
                cell: (info) => (
                    <span className="font-semibold">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(info.getValue() as number)}
                    </span>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 130,
                cell: (info) => {
                    const status = info.getValue() as string;
                    return (
                        <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                            status === 'completed' && "bg-emerald-500/10 text-emerald-500",
                            status === 'pending' && "bg-amber-500/10 text-amber-500",
                            status === 'failed' && "bg-rose-500/10 text-rose-500",
                            status === 'refunded' && "bg-slate-500/10 text-slate-500"
                        )}>
                            {status}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'category',
                header: 'Category',
                size: 150,
            },
            {
                accessorKey: 'region',
                header: 'Region',
                size: 150,
            },
            {
                accessorKey: 'timestamp',
                header: 'Date',
                size: 180,
                cell: (info) => new Date(info.getValue() as string).toLocaleString(),
            },
        ],
        []
    );

    const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            sorting,
            columnVisibility,
            columnOrder,
        },
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnOrderChange: setColumnOrder,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        debugTable: true,
    });

    const { rows } = table.getRowModel();

    const tableContainerRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => tableContainerRef.current,
        estimateSize: () => 56, // row height
        overscan: 10,
    });

    return (
        <div className="flex flex-col h-full bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold">Transactions</h2>
                    <span className="px-2 py-0.5 rounded-md bg-secondary text-muted-foreground text-xs font-medium">
                        {filteredData.length.toLocaleString()} records
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {/* Column Controls */}
                    <button className="p-2 hover:bg-secondary rounded-md text-muted-foreground" title="Pin Columns">
                        <BsPinAngleFill />
                    </button>
                    <button className="p-2 hover:bg-secondary rounded-md text-muted-foreground" title="Hide/Show Columns">
                        <BsEyeSlash />
                    </button>
                    <button className="p-2 hover:bg-secondary rounded-md text-muted-foreground">
                        <BsThreeDotsVertical />
                    </button>
                </div>
            </div>

            <div
                ref={tableContainerRef}
                className="flex-1 overflow-auto relative"
                style={{ height: '1000px' }}
            >
                <table className="w-full border-collapse">
                    <thead className="sticky top-0 z-10 bg-background border-b border-border">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        style={{ width: header.getSize() }}
                                        className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-widest cursor-pointer hover:bg-secondary transition-colors"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center gap-2">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {{
                                                asc: <BsArrowUp className="text-primary" />,
                                                desc: <BsArrowDown className="text-primary" />,
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody
                        style={{
                            height: `${rowVirtualizer.getTotalSize()}px`,
                            position: 'relative',
                        }}
                    >
                        {rowVirtualizer.getVirtualItems().map(virtualRow => {
                            const row = rows[virtualRow.index];
                            return (
                                <tr
                                    key={row.id}
                                    onClick={() => setSelectedRow(row.original.id)}
                                    className={cn(
                                        "absolute w-full flex border-b border-border transition-colors hover:bg-secondary/40 cursor-pointer",
                                        selectedRowId === row.original.id && "bg-primary/5 hover:bg-primary/10 border-l-4 border-l-primary"
                                    )}
                                    style={{
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start}px)`,
                                    }}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td
                                            key={cell.id}
                                            style={{ width: cell.column.getSize() }}
                                            className="px-4 py-3 flex items-center overflow-hidden text-sm"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
