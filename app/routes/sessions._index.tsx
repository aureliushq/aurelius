import { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { DataTable } from '~/components/common/data-table'
import { arls } from '~/services/arls'

export const clientLoader = async () => {
	const sessions = await arls.writingSessions.findMany()
	console.log(sessions)

	return {}
}

interface WritingSession {
	content: string
	duration: number
	effort: string
}

const columns: ColumnDef<WritingSession>[] = [
	{
		accessorKey: 'content',
		cell: ({ row }) => (
			<div
				className='w-[360px] text-left truncate'
				title={row.original?.content || 'Untitled'}
			>
				{row.original?.content || 'Untitled'}
			</div>
		),
		header: 'Content Title',
	},
	{
		accessorKey: 'effort',
		cell: ({ row }) => (
			<div className='w-[360px] text-left truncate'>
				{row.original?.effort}
			</div>
		),
		header: 'Effort',
	},
	{
		accessorKey: 'duration',
		cell: ({ row }) => (
			<span className='px-4 text-center'>
				{formatDistanceToNow(new Date(row.original.duration), {
					addSuffix: true,
				})}
			</span>
		),
		header: 'Duration',
	},
]
const WritingSessionsHome = () => {
	return (
		<>
			<div className='prose dark:prose-invert max-w-none flex w-full flex items-center justify-between text-white'>
				<h1 className='mb-4 text-center'>Writing Sessions</h1>
			</div>
			<DataTable columns={columns} data={[]} search={{ show: false }} />
		</>
	)
}

export default WritingSessionsHome
