"use client";

import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Trash2,
  ChevronDown,
  ArrowUpDown,
  Loader2,
  Search,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function DataTable({
  columns,
  data,
  searchValue,
  onSearchChange,
  loading,
  deleteLoading = {},
  currentPage,
  totalPages,
  onPageChange,
  onSortChange,
  currentSort,
  filters = [],
  onDelete,
  onView,
  showActions = true,
  emptyMessage = "No results.",
}) {
  const [columnVisibility, setColumnVisibility] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { columnVisibility },
    manualPagination: true,
    manualSorting: true,
    pageCount: totalPages,
  });

  const handleSort = (columnId) => {
    const column = columns.find(col => col.id === columnId || col.accessorKey === columnId);
    const field = column?.sortField || column?.accessorKey || columnId;

    let newOrder = "";
    if (currentSort.field !== field) {
      newOrder = "asc";
    } else if (currentSort.order === "asc") {
      newOrder = "desc";
    } else {
      newOrder = "";
    }

    onSortChange(newOrder ? field : "", newOrder);
  };

  const getSortState = (columnId) => {
    const column = columns.find(col => col.id === columnId || col.accessorKey === columnId);
    const field = column?.sortField || column?.accessorKey || columnId;

    if (currentSort.field === field) {
      return currentSort.order;
    }
    return null;
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-hidden rounded-md border">
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center py-4 mx-4 gap-2">
          {onSearchChange && (
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 py-5"
              />
              {loading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {filters.map((filter, index) => (
              <DropdownMenu key={index}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 sm:flex-none min-w-[100px]"
                  >
                    {filter.icon && <filter.icon className="mr-2 h-4 w-4 flex-shrink-0" />}
                    <span className="hidden sm:inline truncate">
                      {filter.getLabel ? filter.getLabel() : filter.label}
                    </span>
                    <span className="sm:hidden">{filter.mobileLabel || filter.label}</span>
                    <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="px-5">
                  <DropdownMenuLabel>{filter.label}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={filter.value}
                    onValueChange={filter.onChange}
                  >
                    {filter.options.map((option) => (
                      <DropdownMenuRadioItem key={option.value} value={option.value}>
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="table-fixed w-full min-w-[800px]">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center font-semibold text-gray-600 uppercase text-[12px] pl-2 ${
                            header.column.columnDef.enableSorting !== false
                              ? "cursor-pointer select-none"
                              : ""
                          }`}
                          onClick={() => {
                            if (header.column.columnDef.enableSorting !== false) {
                              handleSort(header.column.id);
                            }
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.columnDef.enableSorting !== false && (
                            <>
                              {getSortState(header.column.id) === "asc" ? (
                                <ArrowUpDown className="text-green-600 ml-2 h-4 w-4 rotate-180 opacity-70" />
                              ) : getSortState(header.column.id) === "desc" ? (
                                <ArrowUpDown className="text-red-600 ml-2 h-4 w-4 opacity-70" />
                              ) : (
                                <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                  {showActions && (onDelete || onView) && (
                    <TableHead className="uppercase text-[12px] text-gray-600 w-32 pl-6">
                      action
                    </TableHead>
                  )}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (showActions && (onDelete || onView) ? 1 : 0)}
                    className="h-24 text-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  const rowId = row.original._id || row.original.id;
                  const isDeleting = deleteLoading[rowId];

                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="px-4 py-4 max-w-[200px] overflow-hidden font-medium"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                      {showActions && (onDelete || onView) && (
                        <TableCell className="py-4 w-32">
                          <div className="flex justify-left gap-2">
                            {onView && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onView(rowId)}
                                disabled={loading}
                                className="flex bg-[var(--muted)] text-black hover:bg-[var(--muted)] hover:text-[var(--accent)] cursor-pointer disabled:opacity-50"
                              >
                                <Eye className="w-4 h-4 " />
                              </Button>
                            )}
                            {onDelete && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDelete(rowId)}
                                disabled={isDeleting || loading}
                                className="flex bg-[var(--muted)] text-red-600 hover:bg-[var(--muted)] border-2 hover:border-red-600 cursor-pointer disabled:opacity-50"
                              >
                                {isDeleting ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (showActions && (onDelete || onView) ? 1 : 0)}
                    className="h-24 text-center"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex items-center justify-center py-6 mx-4 overflow-x-auto">
            <div className="flex items-center gap-1 flex-wrap justify-center min-w-0">
              {totalPages <= 3 ? (
                Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(pageNum)}
                      disabled={loading}
                      className="w-10 h-10 p-0 rounded-full cursor-pointer flex-shrink-0"
                    >
                      {pageNum}
                    </Button>
                  )
                )
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="w-10 h-10 p-0 rounded-full cursor-pointer flex-shrink-0"
                  >
                    <ChevronDown className="h-4 w-4 rotate-90" />
                  </Button>

                  {(() => {
                    const maxVisiblePages = 3;
                    let startPage = 1;
                    let endPage = totalPages;

                    if (totalPages > maxVisiblePages) {
                      const halfVisible = Math.floor(maxVisiblePages / 2);
                      
                      if (currentPage <= halfVisible) {
                        endPage = maxVisiblePages;
                      } else if (currentPage >= totalPages - halfVisible) {
                        startPage = totalPages - maxVisiblePages + 1;
                      } else {
                        startPage = currentPage - halfVisible;
                        endPage = currentPage + halfVisible;
                      }
                    }

                    const pages = [];
                    
                    if (startPage > 1) {
                      pages.push(
                        <Button
                          key={1}
                          variant="outline"
                          size="sm"
                          onClick={() => onPageChange(1)}
                          disabled={loading}
                          className="w-10 h-10 p-0 rounded-full cursor-pointer flex-shrink-0"
                        >
                          1
                        </Button>
                      );
                      if (startPage > 2) {
                        pages.push(
                          <span key="ellipsis-start" className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                    }

                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <Button
                          key={i}
                          variant={currentPage === i ? "default" : "outline"}
                          size="sm"
                          onClick={() => onPageChange(i)}
                          disabled={loading}
                          className="w-10 h-10 p-0 rounded-full cursor-pointer flex-shrink-0"
                        >
                          {i}
                        </Button>
                      );
                    }

                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(
                          <span key="ellipsis-end" className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      pages.push(
                        <Button
                          key={totalPages}
                          variant="outline"
                          size="sm"
                          onClick={() => onPageChange(totalPages)}
                          disabled={loading}
                          className="w-10 h-10 p-0 rounded-full cursor-pointer flex-shrink-0"
                        >
                          {totalPages}
                        </Button>
                      );
                    }

                    return pages;
                  })()}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="w-10 h-10 p-0 rounded-full cursor-pointer flex-shrink-0"
                  >
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}