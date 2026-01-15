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
    const { filteredData, selectedRowId, setSelectedRow, tableConfig, setTableConfig } = useStore();
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
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-blue-600 focus:ring-blue-500"
                    />
                ),
                cell: ({ row }) => (
                    <input
                        type="checkbox"
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-blue-600 focus:ring-blue-500"
                    />
                ),
                size: 50,
                enablePinning: true,
            },
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
                        <span className="text-xs text-muted-foreground">{info.row.original.userEmail}</span>
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
        estimateSize: () => 56, // row height
        overscan: 10,
    });

    return (
        <div className="flex flex-col h-full bg-card border border-border rounded-xl shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20">
            <div className="flex items-center justify-between p-4 border-b border-border bg-background/50 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold">Transactions</h2>
                    <span className="px-2 py-0.5 rounded-md bg-secondary text-muted-foreground text-xs font-medium">
                        {filteredData.length.toLocaleString()} records
                    </span>
                    {Object.keys(rowSelection).length > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-xs font-bold">
                            {Object.keys(rowSelection).length} selected
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setTableConfig({ columnPinning: { left: ['select', 'id'] } })}
                        className="p-2 hover:bg-secondary rounded-md text-muted-foreground transition-colors"
                        title="Pin ID & Select"
                    >
                        <BsPinAngleFill />
                    </button>
                    <button
                        onClick={() => setTableConfig({ columnVisibility: {} })}
                        className="p-2 hover:bg-secondary rounded-md text-muted-foreground transition-colors"
                        title="Reset Visibility"
                    >
                        <BsEyeSlash />
                    </button>
                    <button className="p-2 hover:bg-secondary rounded-md text-muted-foreground transition-colors">
                        <BsThreeDotsVertical />
                    </button>
                </div>
            </div>

            <div
                ref={tableContainerRef}
                className="flex-1 overflow-auto relative scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800"
                style={{ height: '700px' }}
            >
                <table className="w-full border-collapse table-fixed">
                    <thead className="sticky top-0 z-20 bg-background/90 backdrop-blur-md shadow-sm">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    const isPinned = header.column.getIsPinned();
                                    return (
                                        <th
                                            key={header.id}
                                            style={{
                                                width: header.getSize(),
                                                left: isPinned === 'left' ? header.getStart('left') : undefined,
                                                right: isPinned === 'right' ? header.getAfter('right') : undefined,
                                            }}
                                            className={cn(
                                                "px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-widest cursor-pointer hover:bg-secondary transition-colors relative group",
                                                isPinned && "sticky z-30 bg-background border-r border-border"
                                            )}
                                        >
                                            <div
                                                className="flex items-center gap-2"
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {{
                                                    asc: <BsArrowUp className="text-primary animate-in fade-in zoom-in duration-300" />,
                                                    desc: <BsArrowDown className="text-primary animate-in fade-in zoom-in duration-300" />,
                                                }[header.column.getIsSorted() as string] ?? null}
                                            </div>

                                            {/* Resize Handle */}
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
                                    onClick={() => setSelectedRow(row.original.id)}
                                    className={cn(
                                        "absolute w-full flex border-b border-border transition-colors hover:bg-secondary/40 cursor-pointer group",
                                        selectedRowId === row.original.id && "bg-primary/5 hover:bg-primary/10 border-l-4 border-l-primary",
                                        row.getIsSelected() && "bg-blue-500/5"
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
                                                    "px-4 py-3 flex items-center overflow-hidden text-sm",
                                                    isPinned && "sticky z-10 bg-card border-r border-border group-hover:bg-secondary/40"
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
