import { useContext } from 'react'

import {
	type ClientActionFunctionArgs,
	type ClientLoaderFunctionArgs,
	Link,
	useLoaderData,
	useSubmit,
} from '@remix-run/react'

import type { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import {
	CheckIcon,
	ChevronDown,
	ChevronUp,
	ExternalLinkIcon,
	PencilIcon,
	Trash2Icon,
} from 'lucide-react'
import invariant from 'tiny-invariant'
import { DataTable } from '~/components/common/data-table'
import KeyboardShortcut from '~/components/editor/keyboard-shortcut'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '~/components/ui/tooltip'
import { useToast } from '~/components/ui/use-toast'
import { deleteWriting } from '~/lib/actions'
import { allShortcuts } from '~/lib/hooks/useKeyboardShortcuts'
import {
	loadEffort,
	loadHelpArticles,
	loadWritingsInEffort,
} from '~/lib/loaders'
import {
	AureliusContext,
	type AureliusProviderData,
} from '~/lib/providers/aurelius'
import { EditorShortcuts } from '~/lib/types'
import { getShortcutWithModifiers } from '~/lib/utils'
import type { WritingEffortsTable } from '~/services/evolu/schema'

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
	invariant(params.effort, 'Writing Effort cannot be empty')

	if (params.effort === 'help') {
		const { writings } = await loadHelpArticles()
		return { effort: { slug: 'help', name: 'Help Articles' }, writings }
	}

	const effort = await loadEffort(params.effort)
	invariant(effort, 'Writing effort not found')

	// TODO: implement select
	const { writings } = await loadWritingsInEffort(effort.slug)
	return { effort, writings }
}

export const clientAction = async ({
	params,
	request,
}: ClientActionFunctionArgs) => {
	invariant(params.effort, 'Writing Effort cannot be empty')
	const effort = await loadEffort(params.effort)

	const body: { id: string } = await request.json()
	await deleteWriting({ effort, id: body.id })

	return { message: 'ok' }
}

interface Writing {
	createdAt: Date
	effort: WritingEffortsTable
	id: string
	slug: string
	title: string
}

const EffortHome = () => {
	const { triggerGlobalShortcut } =
		useContext<AureliusProviderData>(AureliusContext)

	const { effort, writings } = useLoaderData<typeof clientLoader>()
	const submit = useSubmit()

	const { toast } = useToast()

	const data = writings.map((writing) => ({
		createdAt: new Date(writing.createdAt),
		effort,
		id: writing.id,
		slug: writing.slug,
		title: writing.title,
	}))

	const confirmDelete = async (id: string) => {
		submit(
			{ id },
			{ encType: 'application/json', method: 'post', navigate: false },
		)
		toast({
			description: (
				<span className='inline-flex items-center text-base'>
					<span className='w-4 h-4 mr-2 inline-flex items-center justify-center bg-primary rounded-full'>
						<CheckIcon className='w-2 h-2' />
					</span>
					Post deleted
				</span>
			),
		})
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
				// biome-ignore lint: it's fine
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
						to={`/${row.original.effort.slug}/${row.original.slug}`}
					>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									className='w-9 h-9'
									size='icon'
									variant='ghost'
								>
									<ExternalLinkIcon className='w-4 h-4' />
								</Button>
							</TooltipTrigger>
							<TooltipContent>View</TooltipContent>
						</Tooltip>
					</Link>
					{row.original.effort.slug !== 'help' && (
						<Link
							prefetch='intent'
							to={`/editor/${row.original.effort.slug}/${row.original.slug}`}
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
								<TooltipContent>Edit</TooltipContent>
							</Tooltip>
						</Link>
					)}
					<Input name='id' type='hidden' value={row.original.id} />
					<AlertDialog>
						<Tooltip>
							<TooltipTrigger asChild>
								<AlertDialogTrigger asChild>
									<Button
										className='w-9 h-9'
										size='icon'
										variant='ghost'
									>
										<Trash2Icon className='w-4 h-4 text-destructive' />
									</Button>
								</AlertDialogTrigger>
							</TooltipTrigger>
							<TooltipContent>Delete</TooltipContent>
						</Tooltip>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you absolutely sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will
									permanently delete your account and remove
									your data from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction asChild>
									<Button
										className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
										onClick={() =>
											confirmDelete(row.original.id)
										}
									>
										Yes, I&apos;m sure
									</Button>
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			),
			header: '',
		},
	]

	return (
		<>
			<div className='prose dark:prose-invert max-w-none w-full flex items-center justify-between text-white'>
				<h1 className='mb-4 text-center'>{effort.name}</h1>
			</div>
			<DataTable
				columns={columns}
				// @ts-ignore
				data={data}
				newButton={
					effort.slug !== 'help' && (
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
									allShortcuts[EditorShortcuts.NEW_POST]
										.modifiers,
								)}
							/>
						</Button>
					)
				}
				search={
					effort.slug !== 'help'
						? { placeholder: 'Search Posts', show: true }
						: { show: false }
				}
			/>
		</>
	)
}

export default EffortHome
