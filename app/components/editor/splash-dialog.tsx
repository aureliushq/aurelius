import { FormEvent, ReactNode, useContext } from 'react'

import { Form, Link } from '@remix-run/react'

import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { formatDistanceToNow } from 'date-fns'
import {
	AlarmClockCheckIcon,
	CircleHelpIcon,
	FileIcon,
	FileTextIcon,
	FolderOpenIcon,
	ListIcon,
	SettingsIcon,
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
	label: string
	onClick?: (...args: unknown[]) => void
	shortcut?: string
}) => {
	return (
		<Button
			className='w-[calc(100%+1rem)] h-12 justify-between -ml-4'
			onClick={onClick}
			variant='ghost'
		>
			<span className='inline-flex flex-col items-start gap-1'>
				<span className='inline-flex items-center'>
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
						<DialogTitle>Splash Dialog</DialogTitle>
						<DialogDescription>
							List of common actions you can do in Aurelius
						</DialogDescription>
					</DialogHeader>
				</VisuallyHidden>
				<div className='flex flex-col min-h-[36rem] h-auto w-full rounded-lg overflow-hidden divide-y divide-subtle'>
					<div className='relative w-full h-[16rem] flex items-start justify-start p-8'>
						<img
							alt='Splash Dialog Cover'
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
							<ul className='text-sm flex flex-col gap-2'>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										description='Begin a new post from scratch'
										icon={
											<FileIcon className='mr-2 w-4 h-4' />
										}
										label='Start a New Post'
										onClick={() =>
											triggerShortcut(
												EditorShortcuts.NEW_POST
											)
										}
										shortcut={getShortcutWithModifiers(
											allShortcuts[
												EditorShortcuts.NEW_POST
											].key,
											allShortcuts[
												EditorShortcuts.NEW_POST
											].modifiers
										)}
									/>
								</li>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										description='Set a timer and focus on your writing'
										icon={
											<TimerIcon className='mr-2 w-4 h-4' />
										}
										label='Start a Writing Session'
										onClick={() =>
											triggerShortcut(
												EditorShortcuts.WRITING_SESSION
											)
										}
										shortcut={getShortcutWithModifiers(
											allShortcuts[
												EditorShortcuts.WRITING_SESSION
											].key,
											allShortcuts[
												EditorShortcuts.WRITING_SESSION
											].modifiers
										)}
									/>
								</li>
							</ul>
						</div>
						{latestPosts.length > 0 ? (
							<div className='col-span-1 py-2 flex flex-col'>
								<h3 className='text-sm font-semibold text-foreground mb-4'>
									Resume
								</h3>
								<ul className='w-full text-sm flex flex-col gap-2'>
									{latestPosts.map((post) => (
										<li
											className='w-full flex items-center justify-between'
											key={post.id}
										>
											<Link
												className='w-full'
												to={`${ROUTES.EDITOR.POST}/${post.slug}`}
											>
												<SplashDialogButton
													description={`Written ${formatDistanceToNow(
														new Date(
															post.createdAt
														),
														{
															addSuffix: true,
														}
													)}`}
													icon={
														<FileTextIcon className='mr-2 w-4 h-4' />
													}
													label={post.title}
												/>
											</Link>
										</li>
									))}
								</ul>
							</div>
						) : null}
						<div className='col-span-1 py-2 flex flex-col'>
							<h3 className='text-sm font-semibold text-foreground mb-4'>
								Explore
							</h3>
							<ul className='w-full text-sm flex flex-col gap-2'>
								<li className='w-full flex items-center justify-between'>
									<Link
										className='w-full'
										to={ROUTES.VIEW.POSTS}
									>
										<SplashDialogButton
											description='Browse & manage your existing posts'
											icon={
												<FolderOpenIcon className='mr-2 w-4 h-4' />
											}
											label='View All Posts'
											onClick={() =>
												triggerShortcut(
													EditorShortcuts.VIEW_ALL_POSTS
												)
											}
											shortcut={getShortcutWithModifiers(
												allShortcuts[
													EditorShortcuts
														.VIEW_ALL_POSTS
												].key,
												allShortcuts[
													EditorShortcuts
														.VIEW_ALL_POSTS
												].modifiers
											)}
										/>
									</Link>
								</li>
								<li className='w-full flex items-center justify-between'>
									<Link
										className='w-full'
										to={ROUTES.VIEW.WRITING_SESSIONS}
									>
										<SplashDialogButton
											description='Browse your past writing sessions'
											icon={
												<AlarmClockCheckIcon className='mr-2 w-4 h-4' />
											}
											label='View All Writing Sessions'
											onClick={() =>
												triggerShortcut(
													EditorShortcuts.VIEW_ALL_WRITING_SESSIONS
												)
											}
											shortcut={getShortcutWithModifiers(
												allShortcuts[
													EditorShortcuts
														.VIEW_ALL_WRITING_SESSIONS
												].key,
												allShortcuts[
													EditorShortcuts
														.VIEW_ALL_WRITING_SESSIONS
												].modifiers
											)}
										/>
									</Link>
								</li>
							</ul>
						</div>
						<div className='col-span-1 py-2 flex flex-col'>
							<h3 className='text-sm font-semibold text-foreground mb-4'>
								Resources
							</h3>
							<ul className='text-sm flex flex-col gap-2'>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										description='Customize your writing environment'
										icon={
											<SettingsIcon className='mr-2 w-4 h-4' />
										}
										label='Preferences'
										onClick={() =>
											triggerShortcut(
												EditorShortcuts.PREFERENCES
											)
										}
										shortcut={getShortcutWithModifiers(
											allShortcuts[
												EditorShortcuts.PREFERENCES
											].key,
											allShortcuts[
												EditorShortcuts.PREFERENCES
											].modifiers
										)}
									/>
								</li>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										description='Find guides, shortcuts, and more'
										icon={
											<CircleHelpIcon className='mr-2 w-4 h-4' />
										}
										label='Help'
										onClick={() =>
											triggerShortcut(
												EditorShortcuts.HELP
											)
										}
										shortcut={getShortcutWithModifiers(
											allShortcuts[EditorShortcuts.HELP]
												.key,
											allShortcuts[EditorShortcuts.HELP]
												.modifiers
										)}
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
