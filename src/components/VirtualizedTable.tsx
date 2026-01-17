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
import type { DataRow } from '../types';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';
import {
    BsArrowDown,
    BsArrowUp,
    BsThreeDotsVertical,
    BsEyeSlash
} from 'react-icons/bs';

export const VirtualizedTable = () => {
    const { filteredData, columns: datasetColumns, tableConfig, setTableConfig, setActiveColumn } = useStore();
    const [rowSelection, setRowSelection] = useState({});

    const columns = useMemo<ColumnDef<DataRow>[]>(
        () => {
            if (!datasetColumns || datasetColumns.length === 0) return [];

            return datasetColumns.map(col => ({
                accessorKey: col.id,
                header: () => (
                    <div className="flex flex-col">
                        <span className="truncate">{col.id}</span>
                        <span className="text-[8px] opacity-40 lowercase font-mono">{col.type}</span>
                    </div>
                ),
                size: col.type === 'numeric' ? 120 : 200,
                cell: (info) => {
                    const value = info.getValue();
                    if (value === null || value === undefined) return <span className="opacity-20 italic">null</span>;

                    if (col.type === 'numeric') {
                        return <span className="font-mono tabular-nums">{Number(value).toLocaleString()}</span>;
                    }
                    if (col.type === 'date') {
                        return <span className="text-xs">{new Date(value as string).toLocaleDateString()}</span>;
                    }
                    return <span className="truncate text-sm">{String(value)}</span>;
                },
            }));
        },
        [datasetColumns]
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
        estimateSize: () => 48,
        overscan: 10,
    });

    if (columns.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground/40 font-black uppercase tracking-widest text-sm">
                Payload Ingestion Required
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-white/10 glass-card rounded-none border-none">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold tracking-tight">Dataset Explorer</h2>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg glass text-muted-foreground text-[10px] font-bold uppercase tracking-widest border-none">
                            {filteredData.length.toLocaleString()} rows
                        </span>
                        <span className="px-2.5 py-1 rounded-lg glass text-muted-foreground text-[10px] font-bold uppercase tracking-widest border-none">
                            {datasetColumns.length} dimensions
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
                style={{ height: '500px' }}
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
                                                onClick={() => {
                                                    header.column.getToggleSortingHandler()?.(null);
                                                    setActiveColumn(header.id);
                                                }}
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
