"use client";
import { Icons } from "@/main/utils/icons";
import { ColumnDef, flexRender, Row, Table as TableType } from "@tanstack/react-table";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/main/shadcn/components/ui/table";
import { cn } from "../../shadcn/lib/utils";
import { TableVirtuoso } from "react-virtuoso";
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PaginatedQueryReference, UsePaginatedQueryReturnType } from "convex/react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { EmptyContainer, EmptyContainerCssVariants, EmptyContainerVariants } from "./empty-container";
import { LoadingRows } from "./loading-rows";
import { LoadingDiv } from "./loading-div";

/** -------------------- Types -------------------- */

type CommonProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  isBlinkable?: boolean;
  isPausable?: boolean; // ignored in 'query' mode
  loading?: {
    type?: "spinner" | "rows";
    numRows?: number;
    rowHeight?: string;
    logoSize?: string;
  };
  empty?: {
    type?: "table" | "container";
    tableMinRows?: number;
    containerCssVariant?: keyof typeof EmptyContainerCssVariants;
    containerLabelVariant?: keyof typeof EmptyContainerVariants;
    containerShowSubtext?: boolean;
  };
  handleClick?: (row: Row<TData>) => void;
  getRowClassName?: ({ row, index }: { row: Row<TData>; index: number }) => string;
  cellClassName?: string;
};

type PaginatedProps<TData, TValue, Query extends PaginatedQueryReference> = CommonProps<TData, TValue> & {
  queryMode: "paginated";
  queryResult: UsePaginatedQueryReturnType<Query>;
  pageSize: number;
};

type PlainQueryProps<TData, TValue> = CommonProps<TData, TValue> & {
  queryMode: "query";
  /** data from useQuery; `undefined` means "loading first page" */
  queryData: TData[] | undefined;
};

type RealtimeTableProps<TData, TValue, Query extends PaginatedQueryReference> = PaginatedProps<TData, TValue, Query> | PlainQueryProps<TData, TValue>;

/** -------------------- Component -------------------- */

export const RealtimeTable = <TData, TValue, Query extends PaginatedQueryReference>(props: RealtimeTableProps<TData, TValue, Query>) => {
  const { columns, isBlinkable = false, isPausable = false, loading, empty, handleClick, getRowClassName, cellClassName } = props;

  const emptyConfig = {
    type: empty?.type ?? "container",
    tableMinRows: empty?.tableMinRows ?? 10,
    containerCssVariant: empty?.containerCssVariant ?? "default",
    containerLabelVariant: empty?.containerLabelVariant ?? "default",
    containerShowSubtext: empty?.containerShowSubtext ?? false,
  };

  const loadingConfig = {
    type: loading?.type ?? "rows",
    numRows: loading?.numRows ?? 10,
    rowHeight: loading?.rowHeight ?? "h-10",
    logoSize: loading?.logoSize,
  };

  const [data, setData] = useState<TData[]>([]);
  const [isAtScrollTop, setIsAtScrollTop] = useState(true);
  const [prevStatus, setPrevStatus] = useState<"LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted">("LoadingFirstPage");

  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  /** derive a uniform view; memoized so identity doesn't churn every render */
  const derived = useMemo(() => {
    if (props.queryMode === "paginated") {
      const { queryResult } = props;
      return {
        mode: "paginated" as const,
        results: (queryResult.results ?? []) as TData[],
        isLoadingFirstPage: queryResult.status === "LoadingFirstPage",
        isLoadingMore: queryResult.isLoading && queryResult.status !== "LoadingFirstPage",
        canLoadMore: queryResult.status === "CanLoadMore",
        status: queryResult.status as "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted",
        loadMore: () => {
          if (!queryResult.isLoading && queryResult.status === "CanLoadMore") {
            queryResult.loadMore((props as PaginatedProps<TData, TValue, Query>).pageSize);
          }
        },
      };
    } else {
      const { queryData } = props;
      return {
        mode: "query" as const,
        results: (queryData ?? []) as TData[],
        isLoadingFirstPage: queryData === undefined,
        isLoadingMore: false,
        canLoadMore: false,
        status: (queryData === undefined ? "LoadingFirstPage" : "Exhausted") as "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted",
        loadMore: () => {},
      };
    }
  }, [props]);

  /** setData only when it actually changes to avoid loops */
  useEffect(() => {
    const next = derived.results ?? [];

    if (derived.mode === "paginated" && isPausable) {
      if (isAtScrollTop || derived.status === "LoadingFirstPage") {
        setData((prev) => (prev === next ? prev : next));
      } else if (prevStatus === "LoadingMore") {
        setData((prev) => {
          const oldLen = prev.length;
          if (next.length > oldLen) return [...prev, ...next.slice(oldLen)];
          // when lengths are equal, still replace if the reference changed
          return prev === next ? prev : next;
        });
      }
      if (prevStatus !== derived.status) setPrevStatus(derived.status);
    } else {
      // non-pausable or 'query' mode: mirror the source array
      setData((prev) => (prev === next ? prev : next));
    }
  }, [derived.mode, derived.results, derived.status, isPausable, isAtScrollTop, prevStatus]);

  const showLoadingFirst = derived.isLoadingFirstPage;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {showLoadingFirst ? (
        loadingConfig.type === "rows" ? (
          <LoadingRows num_rows={loadingConfig.numRows} row_height={loadingConfig.rowHeight} />
        ) : (
          <LoadingDiv logoSize={loadingConfig.logoSize} />
        )
      ) : data.length > 0 ? (
        <Suspense>
          <DataTable
            table={table}
            loadMoreData={derived.loadMore}
            isLoading={derived.isLoadingMore}
            setIsAtScrollTop={setIsAtScrollTop}
            isBlinkable={isBlinkable}
            isPausable={derived.mode === "paginated" && isPausable}
            handleClick={handleClick}
            getRowClassName={getRowClassName}
            cellClassName={cellClassName}
            canLoadMore={derived.canLoadMore}
          />
        </Suspense>
      ) : (
        <EmptyTable
          table={table}
          type={emptyConfig.type}
          tableMinRows={emptyConfig.tableMinRows}
          containerCssVariant={emptyConfig.containerCssVariant}
          containerLabelVariant={emptyConfig.containerLabelVariant}
          containerShowSubtext={emptyConfig.containerShowSubtext}
        />
      )}
    </div>
  );
};

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
interface DataTableProps<TData, TValue> {
  table: TableType<TData>;
  loadMoreData: () => void;
  isLoading: boolean;
  setIsAtScrollTop: (isAtScrollTop: boolean) => void;
  isBlinkable?: boolean;
  isPausable?: boolean;
  handleClick?: (row: Row<TData>) => void;
  getRowClassName?: ({ row, index }: { row: Row<TData>; index: number }) => string;
  cellClassName?: string;
  canLoadMore?: boolean; // disables endReached for 'query' mode
}

export function DataTable<TData, TValue>({
  table,
  loadMoreData,
  isLoading,
  setIsAtScrollTop,
  isBlinkable = false,
  isPausable = false,
  handleClick,
  getRowClassName,
  cellClassName,
  canLoadMore = true,
}: DataTableProps<TData, TValue>) {
  "use no memo";
  const { rows } = table.getRowModel();

  // stable scroll handler + attach exactly once per element
  const scrollerElRef = useRef<HTMLElement | null>(null);
  const lastAtTopRef = useRef(true);

  const onScroll = useCallback(() => {
    const el = scrollerElRef.current;
    if (!el) return;
    const atTop = el.scrollTop === 0;
    if (atTop !== lastAtTopRef.current) {
      lastAtTopRef.current = atTop;
      setIsAtScrollTop(atTop);
    }
  }, [setIsAtScrollTop]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      const el = scrollerElRef.current;
      if (el) el.removeEventListener("scroll", onScroll as EventListener);
    };
  }, [onScroll]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <TableVirtuoso
        totalCount={rows.length}
        endReached={canLoadMore ? loadMoreData : undefined}
        components={{
          Table: Table,
          TableRow: (props) => {
            // eslint-disable-next-line  react/prop-types
            const index = props["data-index"];
            const row = rows[index];

            return (
              <TableRow
                {...props}
                id={index?.toString?.() ?? String(index)}
                className={cn(
                  "border-b",
                  index == 0 && isBlinkable && "blink",
                  handleClick && "cursor-pointer",
                  row !== undefined && getRowClassName?.({ row, index })
                )}
                onClick={() => (handleClick && row ? handleClick(row) : undefined)}
              >
                {row && <TableCellItems row={row} cellClassName={cellClassName} />}
              </TableRow>
            );
          },
        }}
        fixedHeaderContent={() => <TableHeaderItems table={table} />}
        scrollerRef={(el) => {
          if (!isPausable) return;
          // swap listener if element instance changes
          const prev = scrollerElRef.current;
          if (prev && prev !== el) {
            prev.removeEventListener("scroll", onScroll as EventListener);
          }
          scrollerElRef.current = el as unknown as HTMLElement | null;
          if (el) {
            (el as unknown as HTMLElement).addEventListener("scroll", onScroll as EventListener, { passive: true });
          }
        }}
      />
      {isLoading && <TableScrollLoader />}
    </div>
  );
}

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
const TableCellItems = <TData, TValue>({ row, cellClassName }: { row: Row<TData>; cellClassName?: string }) => {
  const allCells = row.getVisibleCells();

  return (
    <>
      {allCells.map((cell) => (
        <TableCell key={cell.id} className={cn(cellClassName)}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </>
  );
};

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
const TableHeaderItems = <TData, TValue>({ table }: { table: TableType<TData> }) => {
  return (
    <>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="sticky top-0 bg-bg shadow-[0_1px_0_#ffffff] hover:bg-bg">
          {headerGroup.headers.map((header) => (
            <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
          ))}
        </TableRow>
      ))}
    </>
  );
};

const TableScrollLoader = () => (
  <div className="absolute bottom-0 w-full flex items-center justify-center">
    <div className="w-full bg-bg-900/90 flex items-center justify-center py-1.5 px-4 border-t-0">
      <div className="flex items-center gap-2">
        <Icons.Loading className="animate-spin size-3 text-subtext" />
        <p className="text-xs text-subtext font-medium">Loading more</p>
      </div>
    </div>
  </div>
);

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export const EmptyTable = <TData, TValue>({
  table,
  type,
  tableMinRows = 10,
  containerCssVariant = "default",
  containerLabelVariant = "default",
  containerShowSubtext = false,
}: {
  table: TableType<TData>;
  type: "table" | "container";
  tableMinRows?: number;
  containerCssVariant?: keyof typeof EmptyContainerCssVariants;
  containerLabelVariant?: keyof typeof EmptyContainerVariants;
  containerShowSubtext?: boolean;
}) => {
  const headerGroups = typeof table.getHeaderGroups === "function" ? table.getHeaderGroups() : [];
  const headers = headerGroups.length > 0 && Array.isArray(headerGroups[0]?.headers) ? headerGroups[0].headers : [];

  return (
    <>
      <Table containerClassName="h-fit">
        <TableHeader>
          <TableRow className="border-b">
            {headers.map((header, index) => (
              <TableHead key={index} className="bg-bg hover:bg-bg">
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        {type === "table" && (
          <tbody>
            {Array.from({ length: tableMinRows }).map((_, index) => (
              <TableRow key={index} className="border-b h-10" />
            ))}
          </tbody>
        )}
      </Table>
      {type === "container" && <EmptyContainer cssVariant={containerCssVariant} labelVariant={containerLabelVariant} showSubtext={containerShowSubtext} />}
    </>
  );
};
