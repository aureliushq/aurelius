import { FormEvent, ReactNode } from 'react'

import { Form, Link } from '@remix-run/react'

import { useEvolu } from '@evolu/react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import {
	CircleHelpIcon,
	FileTextIcon,
	ListIcon,
	LogInIcon,
	PencilIcon,
	RefreshCcwIcon,
	RocketIcon,
	SettingsIcon,
	TimerIcon,
} from 'lucide-react'
import KeyboardShortcut from '~/components/home/keyboard-shortcut'
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
import { SHORTCUTS } from '~/lib/constants'
import {
	HelpDialogProps,
	PreferencesDialogProps,
	WritingSessionDialogProps,
} from '~/lib/types'
import { SettingsRow } from '~/services/evolu/client'
import { Database } from '~/services/evolu/database'

const SplashDialogButton = ({
	badge,
	icon,
	label,
	onClick,
	shortcut,
}: {
	badge?: string
	icon: ReactNode
	label: string
	onClick?: (...args: unknown[]) => void
	shortcut?: string
}) => {
	return (
		<Button
			className='w-[calc(100%+1rem)] justify-between -ml-4'
			onClick={onClick}
			variant='ghost'
		>
			<span className='inline-flex items-center'>
				{icon}
				{label}
				{badge && (
					<Badge className='ml-2' variant='outline'>
						{badge}
					</Badge>
				)}
			</span>
			{shortcut ? <KeyboardShortcut keys={shortcut} /> : null}
		</Button>
	)
}

type SplashDialogProps = {
	settings: SettingsRow
} & HelpDialogProps &
	PreferencesDialogProps &
	WritingSessionDialogProps

const SplashDialog = ({
	setHelpOpen,
	setPreferencesOpen,
	settings,
	setWritingSessionOpen,
}: SplashDialogProps) => {
	const { update } = useEvolu<Database>()

	const handleChange = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const displaySplashDialog = formData.get('dont-show-again') !== 'on'
		update('settings', {
			id: settings.id,
			displaySplashDialog,
		})
	}

	// TODO: synced devices is not picking up the correct value initially. it changes after a bit but it should be instant. investigate why.

	return (
		<Dialog defaultOpen={!!settings?.displaySplashDialog}>
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
					<div className='grid grid-cols-2 flex-col w-full min-h-[20rem] h-auto flex-1 flex-grow py-8 pl-8 pr-4 gap-x-12 gap-y-4'>
						<div className='col-span-1 py-2 flex flex-col'>
							<h3 className='text-sm font-semibold text-foreground mb-4'>
								Getting Started
							</h3>
							<ul className='text-sm flex flex-col gap-2'>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										icon={
											<FileTextIcon className='mr-2 w-4 h-4' />
										}
										label='New Post'
										shortcut={SHORTCUTS.NEW_POST}
									/>
								</li>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										icon={
											<TimerIcon className='mr-2 w-4 h-4' />
										}
										label='New Writing Session'
										onClick={() =>
											setWritingSessionOpen(true)
										}
										shortcut={SHORTCUTS.NEW_WRITING_SESSION}
									/>
								</li>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										icon={
											<SettingsIcon className='mr-2 w-4 h-4' />
										}
										label='Preferences'
										onClick={() => setPreferencesOpen(true)}
										shortcut={SHORTCUTS.PREFERENCES}
									/>
								</li>
							</ul>
						</div>
						<div className='col-span-1 py-2 flex flex-col'>
							<h3 className='text-sm font-semibold text-foreground mb-4'>
								Previous Session
							</h3>
							<ul className='w-full text-sm flex flex-col gap-2'>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										icon={
											<PencilIcon className='mr-2 w-4 h-4' />
										}
										label='Continue Writing'
									/>
								</li>
								<li className='w-full flex items-center justify-between'>
									<Link className='w-full' to='/dashboard'>
										<SplashDialogButton
											icon={
												<RefreshCcwIcon className='mr-2 w-4 h-4' />
											}
											label='Resume Writing Session'
										/>
									</Link>
								</li>
								<li className='w-full flex items-center justify-between'>
									<Link className='w-full' to='/dashboard'>
										<SplashDialogButton
											icon={
												<ListIcon className='mr-2 w-4 h-4' />
											}
											label='See all posts'
										/>
									</Link>
								</li>
							</ul>
						</div>
						<div className='col-span-1 py-2 flex flex-col'>
							<h3 className='text-sm font-semibold text-foreground mb-4'>
								Account
							</h3>
							<ul className='w-full flex flex-col items-center text-sm gap-2'>
								<li className='w-full flex items-center justify-between'>
									<Link className='w-full' to='/login'>
										<SplashDialogButton
											badge='Coming Soon'
											icon={
												<LogInIcon className='mr-2 w-4 h-4' />
											}
											label='Sign Up'
										/>
									</Link>
								</li>
								<li className='w-full flex items-center justify-between'>
									<a
										className='w-full'
										href='https://plus.aurelius.ink'
										rel='noreferrer noopener'
									>
										<SplashDialogButton
											badge='Coming Soon'
											icon={
												<RocketIcon className='mr-2 w-4 h-4' />
											}
											label='Try Aurelius Plus!'
										/>
									</a>
								</li>
							</ul>
						</div>
						<div className='col-span-1 py-2 flex flex-col'>
							<ul className='text-sm flex flex-col gap-2'>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										icon={
											<CircleHelpIcon className='mr-2 w-4 h-4' />
										}
										label='Help'
										onClick={() => setHelpOpen(true)}
										shortcut='?'
									/>
								</li>
							</ul>
						</div>
						{/*<div className='col-span-1 flex flex-col'>*/}
						{/*	<p className='leading-relaxed italic text-xs text-foreground'>*/}
						{/*		All your data will be saved locally in the*/}
						{/*		browser.*/}
						{/*	</p>*/}
						{/*</div>*/}
					</div>
					<Form
						className='w-full px-8 py-4 flex items-center gap-2'
						onChange={handleChange}
					>
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
