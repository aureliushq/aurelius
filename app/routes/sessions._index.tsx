import { Link, useLoaderData } from '@remix-run/react'

import * as S from '@effect/schema/Schema'
import { ExtractRow, Query } from '@evolu/common'
import { ColumnDef } from '@tanstack/react-table'
import { formatDistance } from 'date-fns'
import { DataTable } from '~/components/common/data-table'
import { Arls, arls } from '~/services/arls'
import { EffortsTable } from '~/services/evolu/database'
import { ContentId, WritingEffortId } from '~/services/evolu/schema'

export const clientLoader = async () => {
	const writingSessions = await arls.writingSessions.findMany({})

	const sessions = await Promise.all(
		writingSessions.map(async (session) => {
			const effort = await arls.writingEfforts.findUnique({
				id: S.decodeSync(WritingEffortId)(session.effortId),
			})
			const table = arls[effort?.type as keyof Arls]
			const writing = (await table.findUnique({
				// @ts-ignore
				id: S.decodeSync(ContentId)(session.contentId),
			})) as ExtractRow<Query<EffortsTable>>

			return {
				content: writing?.title,
				contentSlug: `/${effort?.slug}/${writing?.slug}`,
				duration: session.duration,
				effort: effort?.name,
				words: session.endingWordCount - session.startingWordCount,
			}
		})
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
		cell: ({ row }) => (
			<Link
				className='w-[360px] text-left truncate text-primary'
				relative='path'
				to={row.original?.contentSlug}
			>
				{row.original?.content || 'Untitled'}
			</Link>
		),
		header: 'Content Title',
	},
	{
		accessorKey: 'effort',
		header: 'Writing Effort',
	},
	{
		accessorKey: 'words',
		header: 'Words Written',
	},
	{
		accessorKey: 'duration',
		cell: ({ row }) => (
			<span className='text-center'>
				{formatDistance(0, row.original?.duration, {
					includeSeconds: true,
				})}
			</span>
		),
		header: 'Duration',
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
