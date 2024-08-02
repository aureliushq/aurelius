import { ClientLoaderFunctionArgs, Link, useLoaderData } from '@remix-run/react'

import * as S from '@effect/schema/Schema'
import { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import {
	ChevronDown,
	ChevronUp,
	EyeIcon,
	PencilIcon,
	TrashIcon,
} from 'lucide-react'
import invariant from 'tiny-invariant'
import { DataTable } from '~/components/common/data-table'
import { Button } from '~/components/ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '~/components/ui/tooltip'
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
				title={row.original.title}
			>
				{row.original.title}
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
			<Button
				className='gap-2'
				onClick={() =>
					column.toggleSorting(column.getIsSorted() === 'asc')
				}
				variant='ghost'
			>
				Created On
				{column.getIsSorted() === 'asc' ? (
					<ChevronUp className='w-4 h-4' />
				) : (
					<ChevronDown className='w-4 h-4' />
				)}
			</Button>
		),
		sortingFn: 'datetime',
	},
	{
		accessorKey: 'actions',
		cell: ({ row }) => (
			<div className='flex items-center justify-end gap-2'>
				<Link to={`/${row.original.effort}/${row.original.slug}`}>
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
				<Link to={`/${row.original.effort}/${row.original.slug}`}>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className='w-9 h-9'
								size='icon'
								variant='ghost'
							>
								<TrashIcon className='w-4 h-4' />
							</Button>
						</TooltipTrigger>
						<TooltipContent>View Post</TooltipContent>
					</Tooltip>
				</Link>
			</div>
		),
		header: '',
	},
]

const EffortHome = () => {
	const { effort, writings } = useLoaderData<typeof clientLoader>()

	const data = writings.map((writing) => ({
		createdAt: new Date(writing.createdAt),
		effort: effort.slug,
		slug: writing.slug,
		title: writing.title,
	}))

	return <DataTable columns={columns} data={data} effort={effort} />
}

export default EffortHome
