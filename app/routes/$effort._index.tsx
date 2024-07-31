import { ClientLoaderFunctionArgs, Link, useLoaderData } from '@remix-run/react'

import * as S from '@effect/schema/Schema'
import { formatDistanceToNow } from 'date-fns'
import { useTheme } from 'remix-themes'
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
import { Arls, TableQueryBuilder, arls } from '~/services/arls'
import { EffortsTable } from '~/services/evolu/database'
import { NonEmptyString100 } from '~/services/evolu/schema'

import KeyboardShortcut from '../components/editor/keyboard-shortcut'

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
	const writings = await table.findMany({ effortId: effort.id })
	return { effort, writings }
}

const EffortHome = () => {
	const { effort, writings } = useLoaderData<typeof clientLoader>()
	const [theme] = useTheme()

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
							<TableHead className='col-span-5 p-4'>
								Title
							</TableHead>
							{effort.slug !== 'help' && (
								<>
									<TableHead className='p-4 col-span-3 text-right'>
										Created On
									</TableHead>
									{/*<TableHead className='p-4 col-span-2 text-right'>*/}
									{/*	Word Count*/}
									{/*</TableHead>*/}
								</>
							)}
						</TableRow>
					</TableHeader>
					<TableBody>
						{writings.length > 0 ? (
							<>
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
											<TableCell className='col-span-5 font-medium flex items-center'>
												<span
													className='w-full text-left truncate'
													title={writing.title}
												>
													{writing.title}
												</span>
											</TableCell>
											{effort.slug !== 'help' && (
												<>
													<TableCell className='col-span-3 flex items-center justify-end'>
														{formatDistanceToNow(
															new Date(
																writing.createdAt
															),
															{
																addSuffix: true,
															}
														)}
													</TableCell>
													{/*<TableCell className='col-span-2 text-right flex items-center justify-end'>*/}
													{/*	{writing.wordCount}{' '}*/}
													{/*	words*/}
													{/*</TableCell>*/}
												</>
											)}
										</Link>
									</TableRow>
								))}
							</>
						) : (
							<TableRow>
								<TableCell className='col-span-8 p-16 flex items-center justify-center flex-col gap-4'>
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

export default EffortHome
