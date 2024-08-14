import { useContext, useState } from 'react'

import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table'
import { allShortcuts } from '~/lib/hooks/useKeyboardShortcuts'
import { AureliusContext, AureliusProviderData } from '~/lib/providers/aurelius'
import { useTheme } from '~/lib/providers/theme'
import { EditorShortcuts } from '~/lib/types'
import { getShortcutWithModifiers } from '~/lib/utils'
import { WritingEffortsTable } from '~/services/evolu/schema'

import KeyboardShortcut from '../editor/keyboard-shortcut'

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	effort: WritingEffortsTable
}

export function DataTable<TData, TValue>({
	columns,
	data,
	effort,
}: DataTableProps<TData, TValue>) {
	const { triggerGlobalShortcut } =
		useContext<AureliusProviderData>(AureliusContext)

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
			<div className='flex w-full grid grid-cols-3 gap-4 text-white mb-4'>
				<Input
					onChange={(event) =>
						table
							.getColumn('title')
							?.setFilterValue(event.target.value)
					}
					placeholder={`Search ${effort.name}`}
					value={
						(table
							.getColumn('title')
							?.getFilterValue() as string) || ''
					}
				/>
				<div />
				<div className='flex items-center justify-end'>
					<Button
						className='gap-2'
						onClick={() =>
							triggerGlobalShortcut(EditorShortcuts.NEW_POST)
						}
						size='sm'
					>
						New Post
						<KeyboardShortcut
							keys={getShortcutWithModifiers(
								allShortcuts[EditorShortcuts.NEW_POST].key,
								allShortcuts[EditorShortcuts.NEW_POST].modifiers
							)}
						/>
					</Button>
				</div>
			</div>
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
														header.getContext()
													)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
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
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='p-16 flex items-center justify-center flex-col gap-4'
								>
									<img
										className={`w-64 h-64 ${theme === 'dark' ? 'invert' : ''}`}
										src='/images/no-data.svg'
									/>
									Nothing here yet! Waiting for you to bring
									your ideas to life.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</>
	)
}
