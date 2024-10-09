import { Link, useLoaderData } from '@remix-run/react'

import type { ColumnDef } from '@tanstack/react-table'
import { formatDistance } from 'date-fns'
import { DataTable } from '~/components/common/data-table'
import {
	loadEffortById,
	loadWritingById,
	loadWritingSessions,
} from '~/lib/loaders'
import type { Arls } from '~/services/arls'

export const clientLoader = async () => {
	const writingSessions = await loadWritingSessions()

	const sessions = await Promise.all(
		writingSessions.map(async (session) => {
			const effort = await loadEffortById(session.effortId)
			if (session.contentId) {
				const writing = await loadWritingById(
					effort?.type as keyof Arls,
					session.effortId,
					session.contentId,
				)

				return {
					content: writing?.title,
					contentSlug: `/${effort?.slug}/${writing?.slug}`,
					duration: session.duration,
					effort: effort?.name,
					words: session.endingWordCount - session.startingWordCount,
				}
			}

			return {
				content: 'No Content Written',
				contentSlug: '',
				duration: session.duration,
				effort: effort?.name,
				words: session.endingWordCount - session.startingWordCount,
			}
		}),
	)

	return { sessions }
}

interface WritingSession {
	content: string
	contentSlug: string
	duration: number
	effort: string
	words: number
}

const columns: ColumnDef<WritingSession>[] = [
	{
		accessorKey: 'content',
		cell: ({ row }) => {
			if (row.original?.contentSlug) {
				return (
					<Link
						className='block w-[360px] text-left truncate text-primary'
						relative='path'
						to={row.original?.contentSlug}
					>
						{row.original?.content || 'Untitled'}
					</Link>
				)
			}

			return (
				<span className='w-[360px] text-left truncate text-foreground'>
					{row.original?.content}
				</span>
			)
		},
		header: 'Content Title',
	},
	{
		accessorKey: 'effort',
		cell: ({ row }) => (
			<span className='flex justify-center text-right'>
				{row.original?.effort}
			</span>
		),
		header: ({ column }) => (
			<span className='flex items-center justify-center cursor-pointer gap-2'>
				Writing Effort
			</span>
		),
	},
	{
		accessorKey: 'words',
		cell: ({ row }) => (
			<span className='flex justify-center text-right'>
				{row.original?.words}
			</span>
		),
		header: ({ column }) => (
			<span className='flex items-center justify-center cursor-pointer gap-2'>
				Words Written
			</span>
		),
	},
	{
		accessorKey: 'duration',
		cell: ({ row }) => (
			<span className='flex justify-end text-right'>
				{formatDistance(0, row.original?.duration, {
					includeSeconds: true,
				})}
			</span>
		),
		header: ({ column }) => (
			<span className='flex items-center justify-end cursor-pointer gap-2'>
				Duration
			</span>
		),
	},
]
const WritingSessionsHome = () => {
	const { sessions } = useLoaderData<typeof clientLoader>()

	return (
		<>
			<div className='prose dark:prose-invert max-w-none flex w-full flex items-center justify-between text-white'>
				<h1 className='mb-4 text-center'>Writing Sessions</h1>
			</div>
			<DataTable
				columns={columns}
				data={sessions as WritingSession[]}
				search={{ show: false }}
			/>
		</>
	)
}

export default WritingSessionsHome
