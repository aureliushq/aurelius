import { useContext } from 'react'

import { ClientLoaderFunctionArgs, Link, useLoaderData } from '@remix-run/react'

import * as S from '@effect/schema/Schema'
import { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { ChevronDown, ChevronUp, EyeIcon, PencilIcon } from 'lucide-react'
import invariant from 'tiny-invariant'
import { DataTable } from '~/components/common/data-table'
import KeyboardShortcut from '~/components/editor/keyboard-shortcut'
import { Button } from '~/components/ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '~/components/ui/tooltip'
import { allShortcuts } from '~/lib/hooks/useKeyboardShortcuts'
import { AureliusContext, AureliusProviderData } from '~/lib/providers/aurelius'
import { EditorShortcuts } from '~/lib/types'
import { getShortcutWithModifiers } from '~/lib/utils'
import { Arls, TableQueryBuilder, arls } from '~/services/arls'
import { EffortsTable } from '~/services/evolu/database'
import { NonEmptyString100 } from '~/services/evolu/schema'

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
	invariant(params.effort, 'Writing Effort cannot be empty')

	const effort = await arls.writingEfforts.findUnique({
		slug: S.decodeSync(NonEmptyString100)(params.effort),
	})
	invariant(effort, 'Writing effort not found')

	if (params.effort === 'help') {
		const writings = await arls._help.findMany()
		return { effort, writings }
	}

	const table = arls[
		effort.type as keyof Arls
	] as TableQueryBuilder<EffortsTable>
	// TODO: implement select
	const writings = await table.findMany({ effortId: effort.id })
	return { effort, writings }
}

interface Writing {
	createdAt: Date
	effort: string
	slug: string
	title: string
}

const columns: ColumnDef<Writing>[] = [
	{
		accessorKey: 'title',
		cell: ({ row }) => (
			<div
				className='w-[360px] text-left truncate'
				title={row.original?.title || 'Untitled'}
			>
				{row.original?.title || 'Untitled'}
			</div>
		),
		header: 'Title',
	},
	{
		accessorKey: 'createdAt',
		cell: ({ row }) => (
			<span className='px-4 text-center'>
				{formatDistanceToNow(new Date(row.original.createdAt), {
					addSuffix: true,
				})}
			</span>
		),
		header: ({ column }) => (
			<span
				className='inline-flex items-center cursor-pointer px-4 gap-2'
				onClick={() =>
					column.toggleSorting(column.getIsSorted() === 'asc')
				}
			>
				Created On
				{column.getIsSorted() === 'asc' ? (
					<ChevronUp className='w-4 h-4' />
				) : (
					<ChevronDown className='w-4 h-4' />
				)}
			</span>
		),
		sortingFn: 'datetime',
	},
	{
		accessorKey: 'actions',
		cell: ({ row }) => (
			<div className='flex items-center justify-end gap-2'>
				<Link
					prefetch='intent'
					to={`/${row.original.effort}/${row.original.slug}`}
				>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className='w-9 h-9'
								size='icon'
								variant='ghost'
							>
								<EyeIcon className='w-4 h-4' />
							</Button>
						</TooltipTrigger>
						<TooltipContent>View Post</TooltipContent>
					</Tooltip>
				</Link>
				<Link
					prefetch='intent'
					to={`/editor/${row.original.effort}/${row.original.slug}`}
				>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className='w-9 h-9'
								size='icon'
								variant='ghost'
							>
								<PencilIcon className='w-4 h-4' />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Edit Post</TooltipContent>
					</Tooltip>
				</Link>
			</div>
		),
		header: '',
	},
]

const EffortHome = () => {
	const { triggerGlobalShortcut } =
		useContext<AureliusProviderData>(AureliusContext)

	const { effort, writings } = useLoaderData<typeof clientLoader>()

	const data = writings.map((writing) => ({
		createdAt: new Date(writing.createdAt),
		effort: effort.slug,
		slug: writing.slug,
		title: writing.title,
	}))

	return (
		<>
			<div className='prose dark:prose-invert max-w-none flex w-full flex items-center justify-between text-white'>
				<h1 className='mb-4 text-center'>{effort.name}</h1>
			</div>
			<DataTable
				columns={columns}
				data={data}
				newButton={
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
				}
				search={{ placeholder: 'Search Posts', show: true }}
			/>
		</>
	)
}

export default EffortHome
