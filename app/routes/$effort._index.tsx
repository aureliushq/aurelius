import { ClientLoaderFunctionArgs, Link, useLoaderData } from '@remix-run/react'

import { formatDistanceToNow } from 'date-fns'
import invariant from 'tiny-invariant'
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
import { EditorShortcuts } from '~/lib/types'
import { getShortcutWithModifiers } from '~/lib/utils'
import {
	evolu,
	helpArticleAllQuery,
	writingByWritingEffortQuery,
	writingEffortBySlugQuery,
} from '~/services/evolu/client'

import KeyboardShortcut from '../components/editor/keyboard-shortcut'

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
	invariant(params.effort, 'Writing Effort cannot be empty')

	const { row: effort } = await evolu.loadQuery(
		writingEffortBySlugQuery(params.effort)
	)
	invariant(effort, 'Writing effort not found')

	if (params.effort === 'help') {
		const { rows: writings } = await evolu.loadQuery(helpArticleAllQuery)
		return { effort, writings }
	}

	const { rows: writings } = await evolu.loadQuery(
		writingByWritingEffortQuery({ effortId: effort.id })
	)
	return { effort, writings }
}

const EffortHome = () => {
	const { effort, writings } = useLoaderData<typeof clientLoader>()

	return (
		<>
			<div className='flex w-full grid grid-cols-3 gap-4 text-white mb-4'>
				<Input placeholder={`Search ${effort.name}`} />
				<div />
				<div className='flex items-center justify-end'>
					<Button className='gap-2' size='sm'>
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
			<div className='border border-border rounded-lg'>
				<Table>
					<TableHeader>
						<TableRow className='grid grid-cols-8'>
							<TableHead className='col-span-4 p-4'>
								Title
							</TableHead>
							{effort.slug !== 'help' && (
								<>
									<TableHead className='p-4 col-span-2 text-center'>
										Created On
									</TableHead>
									<TableHead className='p-4 col-span-2 text-right'>
										Word Count
									</TableHead>
								</>
							)}
						</TableRow>
					</TableHeader>
					<TableBody>
						{writings.map((writing) => (
							<TableRow key={writing.id}>
								<Link
									className='h-16 grid grid-cols-8'
									to={
										effort.slug === 'help'
											? `/${effort.slug}/${writing.slug}`
											: `/editor/${effort.slug}/${writing.slug}`
									}
								>
									<TableCell className='col-span-4 font-medium flex items-center'>
										{writing.title}
									</TableCell>
									{effort.slug !== 'help' && (
										<>
											<TableCell className='col-span-2 flex items-center justify-center'>
												{formatDistanceToNow(
													new Date(writing.createdAt),
													{
														addSuffix: true,
													}
												)}
											</TableCell>
											<TableCell className='col-span-2 text-right flex items-center justify-end'>
												{writing.wordCount} words
											</TableCell>
										</>
									)}
								</Link>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</>
	)
}

export default EffortHome
