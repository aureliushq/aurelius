import { ClientLoaderFunctionArgs, Link, useLoaderData } from '@remix-run/react'

import * as S from '@effect/schema/Schema'
import { ExtractRow, Query } from '@evolu/common'
import { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { EyeIcon, PencilIcon } from 'lucide-react'
import { useTheme } from 'remix-themes'
import invariant from 'tiny-invariant'
import { DataTable } from '~/components/common/data-table'
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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '~/components/ui/tooltip'
import { allShortcuts } from '~/lib/hooks/useKeyboardShortcuts'
import { EditorShortcuts } from '~/lib/types'
import { getShortcutWithModifiers } from '~/lib/utils'
import { Arls, TableQueryBuilder, arls } from '~/services/arls'
import { EffortsTable } from '~/services/evolu/database'
import { NonEmptyString100, PostsTable } from '~/services/evolu/schema'

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
	// TODO: implement select
	const writings = await table.findMany({ effortId: effort.id })
	return { effort, writings }
}

interface Writing {
	createdAt: string
	slug: string
	title: string
}

const columns: ColumnDef<Writing>[] = [
	{
		accessorKey: 'title',
		header: 'Title',
	},
	{
		accessorKey: 'createdAt',
		header: 'Created On',
	},
	{
		accessorKey: 'actions',
		header: '',
	},
]

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
						<TableRow className='grid grid-cols-8 gap-4'>
							<TableHead className='col-span-4 p-4'>
								Title
							</TableHead>
							{effort.slug !== 'help' && (
								<>
									<TableHead className='py-4 col-span-3 text-center'>
										Created On
									</TableHead>
									<TableHead className='p-4 col-span-1 text-right'></TableHead>
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
											className='h-20 grid grid-cols-8'
											to={
												effort.slug === 'help'
													? `/${effort.slug}/${writing.slug}`
													: `/editor/${effort.slug}/${writing.slug}`
											}
										>
											<TableCell className='col-span-4 font-medium flex items-center'>
												<span
													className='w-full text-left truncate'
													title={writing.title}
												>
													{writing.title}
												</span>
											</TableCell>
											{effort.slug !== 'help' && (
												<>
													<TableCell className='py-4 px-0 col-span-3 flex items-center justify-center'>
														{formatDistanceToNow(
															new Date(
																writing.createdAt
															),
															{
																addSuffix: true,
															}
														)}
													</TableCell>
													<TableCell className='col-span-1 text-right flex items-center justify-end gap-2'>
														<Link
															to={`/${effort.slug}/${writing.slug}`}
														>
															<Tooltip>
																<TooltipTrigger
																	asChild
																>
																	<Button
																		className='w-9 h-9'
																		size='icon'
																		variant='ghost'
																	>
																		<EyeIcon className='w-4 h-4' />
																	</Button>
																</TooltipTrigger>
																<TooltipContent>
																	View Post
																</TooltipContent>
															</Tooltip>
														</Link>
														<Link
															to={`/editor/${effort.slug}/${writing.slug}`}
														>
															<Tooltip>
																<TooltipTrigger
																	asChild
																>
																	<Button
																		className='w-9 h-9'
																		size='icon'
																		variant='ghost'
																	>
																		<PencilIcon className='w-4 h-4' />
																	</Button>
																</TooltipTrigger>
																<TooltipContent>
																	Edit Post
																</TooltipContent>
															</Tooltip>
														</Link>
													</TableCell>
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
				{/*<DataTable columns={columns} data={writings} />*/}
			</div>
		</>
	)
}

export default EffortHome
