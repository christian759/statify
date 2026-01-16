import { useMemo, useRef, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    type ColumnDef,
    flexRender,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Transaction } from '../types';
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
    const { filteredData, tableConfig, setTableConfig } = useStore();
    const [rowSelection, setRowSelection] = useState({});

    const columns = useMemo<ColumnDef<Transaction>[]>(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <input
                        type="checkbox"
                        checked={table.getIsAllRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-primary focus:ring-primary"
                    />
                ),
                cell: ({ row }) => (
                    <input
                        type="checkbox"
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-primary focus:ring-primary"
                    />
                ),
                size: 50,
                enablePinning: true,
            },
            {
                accessorKey: 'id',
                header: 'ID',
                size: 100,
                cell: (info) => <span className="font-mono text-[10px] text-muted-foreground/60">{info.getValue() as string}</span>,
            },
            {
                accessorKey: 'userName',
                header: 'User',
                size: 200,
                cell: (info) => (
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm">{info.getValue() as string}</span>
                        <span className="text-[11px] text-muted-foreground/80">{info.row.original.userEmail}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'amount',
                header: 'Amount',
                size: 120,
                cell: (info) => (
                    <span className="font-bold tabular-nums">
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
                            "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                            status === 'completed' && "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
                            status === 'pending' && "bg-amber-500/10 text-amber-500 border border-amber-500/20",
                            status === 'failed' && "bg-rose-500/10 text-rose-500 border border-rose-500/20",
                            status === 'refunded' && "bg-slate-500/10 text-slate-500 border border-slate-500/20"
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
                cell: (info) => <span className="text-sm font-medium opacity-80">{info.getValue() as string}</span>,
            },
            {
                accessorKey: 'region',
                header: 'Region',
                size: 150,
                cell: (info) => <span className="text-sm font-medium opacity-80">{info.getValue() as string}</span>,
            },
            {
                accessorKey: 'timestamp',
                header: 'Date',
                size: 180,
                cell: (info) => <span className="text-sm opacity-80">{new Date(info.getValue() as string).toLocaleString()}</span>,
            },
        ],
        []
    );

    const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            sorting: tableConfig.sorting,
            columnVisibility: tableConfig.columnVisibility,
            columnOrder: tableConfig.columnOrder,
            columnPinning: tableConfig.columnPinning,
            rowSelection,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: (updater) => {
            const newSorting = typeof updater === 'function' ? updater(tableConfig.sorting) : updater;
            setTableConfig({ sorting: newSorting });
        },
        onColumnVisibilityChange: (updater) => {
            const newVisibility = typeof updater === 'function' ? updater(tableConfig.columnVisibility) : updater;
            setTableConfig({ columnVisibility: newVisibility });
        },
        onColumnOrderChange: (updater) => {
            const newOrder = typeof updater === 'function' ? updater(tableConfig.columnOrder) : updater;
            setTableConfig({ columnOrder: newOrder });
        },
        columnResizeMode: 'onChange',
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const { rows } = table.getRowModel();

    const tableContainerRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => tableContainerRef.current,
        estimateSize: () => 64, // increased row height
        overscan: 10,
    });

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-white/10 glass-card rounded-none border-none">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold tracking-tight">Transactions</h2>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg glass text-muted-foreground text-[10px] font-bold uppercase tracking-widest border-none">
                            {filteredData.length.toLocaleString()} total
                        </span>
                        {Object.keys(rowSelection).length > 0 && (
                            <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 animate-in zoom-in">
                                {Object.keys(rowSelection).length} selected
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setTableConfig({ columnPinning: { left: ['select', 'id'] } })}
                        className="w-10 h-10 flex items-center justify-center glass hover:bg-white/10 rounded-xl text-muted-foreground transition-all active:scale-90"
                        title="Pin Columns"
                    >
                        <BsPinAngleFill size={18} />
                    </button>
                    <button
                        onClick={() => setTableConfig({ columnVisibility: {} })}
                        className="w-10 h-10 flex items-center justify-center glass hover:bg-white/10 rounded-xl text-muted-foreground transition-all active:scale-90"
                        title="Reset View"
                    >
                        <BsEyeSlash size={18} />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center glass hover:bg-white/10 rounded-xl text-muted-foreground transition-all active:scale-90">
                        <BsThreeDotsVertical size={18} />
                    </button>
                </div>
            </div>

            <div
                ref={tableContainerRef}
                className="flex-1 overflow-auto relative scrollbar-premium"
                style={{ height: '700px' }}
            >
                <table className="w-full border-collapse">
                    <thead className="sticky top-0 z-30">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    const isPinned = header.column.getIsPinned();
                                    return (
                                        <th
                                            key={header.id}
                                            style={{
                                                width: header.getSize(),
                                                left: isPinned === 'left' ? header.column.getStart('left') : undefined,
                                                right: isPinned === 'right' ? header.column.getAfter('right') : undefined,
                                            }}
                                            className={cn(
                                                "px-6 py-4 text-left text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] glass border-none z-10",
                                                isPinned && "sticky z-40"
                                            )}
                                        >
                                            <div
                                                className="flex items-center gap-2 cursor-pointer select-none group/header"
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                <div className="w-4 h-4 flex items-center justify-center">
                                                    {{
                                                        asc: <BsArrowUp className="text-primary animate-in fade-in slide-in-from-bottom-1" />,
                                                        desc: <BsArrowDown className="text-primary animate-in fade-in slide-in-from-top-1" />,
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </div>
                                            </div>

                                            <div
                                                onMouseDown={header.getResizeHandler()}
                                                onTouchStart={header.getResizeHandler()}
                                                className={cn(
                                                    "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none bg-primary opacity-0 group-hover:opacity-40 transition-opacity",
                                                    header.column.getIsResizing() && "opacity-100 bg-blue-500 w-0.5"
                                                )}
                                            />
                                        </th>
                                    );
                                })}
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
                            if (!row) return null;

                            return (
                                <tr
                                    key={row.id}
                                    className={cn(
                                        "absolute w-full flex items-center border-b border-white/5 transition-all hover:bg-slate-100/50 dark:hover:bg-white/[0.02] cursor-pointer group/row",
                                        row.getIsSelected() && "bg-primary/[0.02]"
                                    )}
                                    style={{
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start}px)`,
                                    }}
                                >
                                    {row.getVisibleCells().map(cell => {
                                        const isPinned = cell.column.getIsPinned();
                                        return (
                                            <td
                                                key={cell.id}
                                                style={{
                                                    width: cell.column.getSize(),
                                                    left: isPinned === 'left' ? cell.column.getStart('left') : undefined,
                                                    right: isPinned === 'right' ? cell.column.getAfter('right') : undefined,
                                                }}
                                                className={cn(
                                                    "px-6 py-4 flex items-center overflow-hidden h-full",
                                                    isPinned && "sticky z-20 bg-inherit border-r border-white/5"
                                                )}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
