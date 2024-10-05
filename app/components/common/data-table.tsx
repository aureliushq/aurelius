import { type ReactNode, useState } from 'react'

import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { Input } from '~/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table'
import { useTheme } from '~/lib/providers/theme'

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	newButton?: ReactNode
	search?: { placeholder?: string; show?: boolean; value?: string }
}

export function DataTable<TData, TValue>({
	columns,
	data,
	newButton,
	search = { placeholder: 'Search', show: true },
}: DataTableProps<TData, TValue>) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [sorting, setSorting] = useState<SortingState>([])

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		onSortingChange: setSorting,
		state: {
			columnFilters,
			sorting,
		},
	})
	const { theme } = useTheme()

	return (
		<>
			{(search?.show || newButton) && (
				<div className='flex w-full grid grid-cols-3 gap-4 text-white mb-4'>
					{search?.show && (
						<Input
							onChange={(event) =>
								table
									.getColumn('title')
									?.setFilterValue(event.target.value)
							}
							placeholder={search.placeholder}
							value={
								(table
									.getColumn('title')
									?.getFilterValue() as string) || ''
							}
						/>
					)}
					<div />
					{newButton && (
						<div className='flex items-center justify-end'>
							{newButton}
						</div>
					)}
				</div>
			)}
			<div className='rounded-lg border border-border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef
															.header,
														header.getContext(),
													)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					{table.getRowModel().rows?.length > 0 && (
						<TableBody>
							{table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() && 'selected'
									}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					)}
				</Table>
				{table.getRowModel().rows?.length === 0 && (
					<div className='w-full p-16 flex items-center justify-center flex-col gap-4 text-muted-foreground'>
						{theme === 'dark' || theme === 'system' ? (
							<img
								alt='Illustration of a person pointing to an large empty notebook'
								className='w-64 h-64 invert'
								src='/images/no-data-light.svg'
							/>
						) : (
							<img
								alt='Illustration of a person pointing to an large empty notebook'
								className='w-64 h-64'
								src='/images/no-data-light.svg'
							/>
						)}
						Nothing here yet! Waiting for you to bring your ideas to
						life.
					</div>
				)}
			</div>
		</>
	)
}
