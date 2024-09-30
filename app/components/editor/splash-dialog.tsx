import { FormEvent, ReactNode, useContext, useEffect } from 'react'

import { Form, Link, useNavigate } from '@remix-run/react'

import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { formatDistanceToNow } from 'date-fns'
import {
	AlarmClockCheckIcon,
	BadgeInfoIcon,
	BookOpenIcon,
	CircleHelpIcon,
	FileIcon,
	FileTextIcon,
	FolderOpenIcon,
	PenLineIcon,
	RocketIcon,
	SettingsIcon,
	ShieldIcon,
	TimerIcon,
} from 'lucide-react'
import KeyboardShortcut from '~/components/editor/keyboard-shortcut'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '~/components/ui/dialog'
import { ROUTES } from '~/lib/constants'
import { allShortcuts } from '~/lib/hooks/useKeyboardShortcuts'
import { AureliusContext, AureliusProviderData } from '~/lib/providers/aurelius'
import { EditorShortcuts } from '~/lib/types'
import { getShortcutWithModifiers } from '~/lib/utils'
import { arls } from '~/services/arls'
import { SettingsRow } from '~/services/evolu/client'

const SplashDialogButton = ({
	badge,
	description,
	icon,
	label,
	onClick,
	shortcut,
}: {
	badge?: string
	description?: string
	icon: ReactNode
	label: ReactNode | string
	onClick?: (...args: unknown[]) => void
	shortcut?: string
}) => {
	return (
		<Button
			className='w-[calc(100%+1rem)] h-10 justify-between -ml-4'
			onClick={onClick}
			variant='ghost'
		>
			<span className='w-full inline-flex flex-col items-start gap-1'>
				<span className='w-full text-sm inline-flex items-center'>
					{icon}
					{label}
					{badge && (
						<Badge className='ml-2' variant='outline'>
							{badge}
						</Badge>
					)}
				</span>
				{description ? (
					<span className='inline-flex flex-wrap pl-6 text-xs italic'>
						{description}
					</span>
				) : null}
			</span>
			{shortcut ? <KeyboardShortcut keys={shortcut} /> : null}
		</Button>
	)
}

type SplashDialogProps = {
	settings: SettingsRow
	setSplashOpen: (open: boolean) => void
	splashOpen?: boolean
	triggerShortcut: (_: string) => void
}

const SplashDialog = ({
	settings,
	setSplashOpen,
	splashOpen,
	triggerShortcut,
}: SplashDialogProps) => {
	const { latestPosts } = useContext<AureliusProviderData>(AureliusContext)

	const navigate = useNavigate()

	const handleChange = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const showSplashDialog = formData.get('dont-show-again') !== 'on'
		arls.settings.update(settings.id, {
			// @ts-ignore
			showSplashDialog,
		})
	}

	// TODO: synced devices is not picking up the correct value initially. it changes after a bit but it should be instant? investigate why.

	return (
		<Dialog onOpenChange={setSplashOpen} open={splashOpen}>
			<DialogContent className='flex max-w-none w-[48rem] p-0 [&>button]:z-10'>
				<VisuallyHidden>
					<DialogHeader>
						<DialogTitle>Quick Start</DialogTitle>
						<DialogDescription>
							List of common actions you can do in Aurelius
						</DialogDescription>
					</DialogHeader>
				</VisuallyHidden>
				<div className='flex flex-col min-h-[36rem] h-auto w-full rounded-lg overflow-hidden divide-y divide-subtle'>
					<div className='relative w-full h-[16rem] flex items-start justify-start p-8'>
						<img
							alt="Quick Start dialog cover image that shows a writer's workspace with a laptop, a notebook, and a cup of coffee."
							className='w-full h-full object-cover object-center z-0 absolute top-0 left-0'
							src='/images/splash-screen-cover.png'
						/>
						<div className='w-full h-full absolute top-0 left-0 bg-gray-900/80 z-10' />
						<img
							className='w-32 z-20'
							src={'/images/logo_dark.png'}
							alt='Aurelius Logo'
						/>
					</div>
					<div className='grid grid-cols-2 w-full min-h-[20rem] h-auto flex-1 flex-grow py-8 pl-8 pr-4 gap-8'>
						{/*<div className='col-span-2 flex items-center'>*/}
						{/*	<Input placeholder='Search Posts' />*/}
						{/*</div>*/}
						<div className='col-span-1 py-2 flex flex-col'>
							<h3 className='text-sm font-semibold text-foreground mb-4'>
								Create
							</h3>
							<ul className='text-sm flex flex-col gap-1'>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										icon={
											<FileIcon className='mr-2 w-4 h-4' />
										}
										label='Start a New Post'
										onClick={() =>
											triggerShortcut(
												EditorShortcuts.NEW_POST,
											)
										}
										shortcut={getShortcutWithModifiers(
											allShortcuts[
												EditorShortcuts.NEW_POST
											].key,
											allShortcuts[
												EditorShortcuts.NEW_POST
											].modifiers,
										)}
									/>
								</li>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										icon={
											<TimerIcon className='mr-2 w-4 h-4' />
										}
										label='Start a Writing Session'
										onClick={() =>
											triggerShortcut(
												EditorShortcuts.WRITING_SESSION,
											)
										}
										shortcut={getShortcutWithModifiers(
											allShortcuts[
												EditorShortcuts.WRITING_SESSION
											].key,
											allShortcuts[
												EditorShortcuts.WRITING_SESSION
											].modifiers,
										)}
									/>
								</li>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										icon={
											<FolderOpenIcon className='mr-2 w-4 h-4' />
										}
										label='View All Posts'
										onClick={() => {
											setSplashOpen(false)
											navigate(ROUTES.VIEW.POSTS)
										}}
										shortcut={getShortcutWithModifiers(
											allShortcuts[
												EditorShortcuts.VIEW_ALL_POSTS
											].key,
											allShortcuts[
												EditorShortcuts.VIEW_ALL_POSTS
											].modifiers,
										)}
									/>
								</li>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										icon={
											<AlarmClockCheckIcon className='mr-2 w-4 h-4' />
										}
										label='View All Writing Sessions'
										onClick={() => {
											setSplashOpen(false)
											navigate(
												ROUTES.VIEW.WRITING_SESSIONS,
											)
										}}
										shortcut={getShortcutWithModifiers(
											allShortcuts[
												EditorShortcuts
													.VIEW_ALL_WRITING_SESSIONS
											].key,
											allShortcuts[
												EditorShortcuts
													.VIEW_ALL_WRITING_SESSIONS
											].modifiers,
										)}
									/>
								</li>
								{latestPosts.length > 0 ? (
									<>
										{latestPosts.map((post) => (
											<li
												className='w-full flex items-center justify-between'
												key={post.id}
											>
												<SplashDialogButton
													icon={
														<FileTextIcon className='mr-2 w-4 h-4' />
													}
													label={
														<span className='w-full flex items-center justify-between'>
															<span
																className='w-36 overflow-hidden text-ellipsis text-left'
																title={
																	post.title
																}
															>
																{`Resume: ${
																	post.title ||
																	'Untitled'
																}`}
															</span>
															<span
																className='text-xs italic'
																title={new Date(
																	post.createdAt,
																).toDateString()}
															>
																{formatDistanceToNow(
																	new Date(
																		post.createdAt,
																	),
																	{
																		addSuffix: true,
																	},
																)}
															</span>
														</span>
													}
													onClick={() => {
														setSplashOpen(false)
														navigate(
															`${ROUTES.EDITOR.POST}/${post.slug}`,
														)
													}}
												/>
											</li>
										))}
									</>
								) : null}
							</ul>
						</div>
						<div className='col-span-1 py-2 flex flex-col'>
							<h3 className='text-sm font-semibold text-foreground mb-4'>
								Resources
							</h3>
							<ul className='text-sm flex flex-col gap-1'>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										icon={
											<RocketIcon className='mr-2 w-4 h-4' />
										}
										label='Getting Started'
										onClick={() => {
											setSplashOpen(false)
											navigate(ROUTES.BASE)
										}}
									/>
								</li>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										badge='Coming Soon'
										icon={
											<BookOpenIcon className='mr-2 w-4 h-4' />
										}
										label='Manual'
									/>
								</li>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										badge='Coming Soon'
										icon={
											<PenLineIcon className='mr-2 w-4 h-4' />
										}
										label='Blog'
									/>
								</li>
							</ul>
						</div>
						<div className='col-span-1 py-2 flex flex-col'>
							<ul className='text-sm flex flex-col gap-1'>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										icon={
											<SettingsIcon className='mr-2 w-4 h-4' />
										}
										label='Preferences'
										onClick={() =>
											triggerShortcut(
												EditorShortcuts.PREFERENCES,
											)
										}
										shortcut={getShortcutWithModifiers(
											allShortcuts[
												EditorShortcuts.PREFERENCES
											].key,
											allShortcuts[
												EditorShortcuts.PREFERENCES
											].modifiers,
										)}
									/>
								</li>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										icon={
											<CircleHelpIcon className='mr-2 w-4 h-4' />
										}
										label='Help'
										onClick={() =>
											triggerShortcut(
												EditorShortcuts.HELP,
											)
										}
										shortcut={getShortcutWithModifiers(
											allShortcuts[EditorShortcuts.HELP]
												.key,
											allShortcuts[EditorShortcuts.HELP]
												.modifiers,
										)}
									/>
								</li>
							</ul>
						</div>
						<div className='col-span-1 py-2 flex flex-col'>
							<ul className='text-sm flex flex-col gap-1'>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										icon={
											<BadgeInfoIcon className='mr-2 w-4 h-4' />
										}
										label='About'
										onClick={() => {
											setSplashOpen(false)
											navigate(ROUTES.ABOUT)
										}}
									/>
								</li>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										icon={
											<ShieldIcon className='mr-2 w-4 h-4' />
										}
										label='Privacy'
										onClick={() => {
											setSplashOpen(false)
											navigate(ROUTES.PRIVACY)
										}}
									/>
								</li>
							</ul>
						</div>
					</div>
					<Form
						className='w-full px-8 py-4 flex items-center justify-between gap-2'
						onChange={handleChange}
					>
						<p className='leading-relaxed italic text-xs text-foreground'>
							Note: All your data will be saved locally in the
							browser.{' '}
							<Link
								className='underline'
								prefetch='intent'
								to='/privacy'
							>
								Learn more
							</Link>
							.
						</p>
						<div className='items-center flex space-x-2'>
							<Checkbox
								name='dont-show-again'
								id='dont-show-again'
							/>
							<label
								htmlFor='dont-show-again'
								className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
							>
								Don&apos;t show this again.
							</label>
						</div>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default SplashDialog
