import { type FormEvent, useEffect, useState } from 'react'

import { Form, useNavigate } from '@remix-run/react'

import * as S from '@effect/schema/Schema'
import { String1000, parseMnemonic } from '@evolu/common'
import { useEvolu } from '@evolu/react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Effect, Exit } from 'effect'
import {
	CheckIcon,
	ClipboardIcon,
	ExternalLinkIcon,
	LoaderCircleIcon,
	TriangleAlertIcon,
} from 'lucide-react'
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
import { Card, CardContent } from '~/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { ScrollArea } from '~/components/ui/scroll-area'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'
import { Switch } from '~/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Textarea } from '~/components/ui/textarea'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '~/components/ui/tooltip'
import { useToast } from '~/components/ui/use-toast'
import {
	ALL_FONTS,
	CHANNELS,
	DAILY_GOAL_TYPE,
	IS_RESTORING_KEY,
	MUSIC_STATIONS,
	SITE_THEMES,
	TOOLBAR_MODES,
} from '~/lib/constants'
import { useDebounce } from '~/lib/hooks'
import { type Theme, useTheme } from '~/lib/providers/theme'
import {
	type MusicChannels,
	type PreferencesDialogProps,
	SiteTheme,
	WritingDailyGoalType,
} from '~/lib/types'
import { copyToClipboard } from '~/lib/utils'
import { arls } from '~/services/arls'
import type { SettingsRow } from '~/services/evolu/client'
import type { Database } from '~/services/evolu/database'
import { Int, NonEmptyString100 } from '~/services/evolu/schema'

// TODO: Autosave settings on change

const SavedToastContent = () => (
	<span className='inline-flex items-center text-base'>
		<span className='w-5 h-5 mr-2 inline-flex items-center justify-center bg-primary rounded-full'>
			<CheckIcon className='w-4 h-4' />
		</span>
		Saved
	</span>
)

const Appearance = ({ settings }: { settings: SettingsRow }) => {
	const { theme, setTheme } = useTheme()
	const { toast } = useToast()

	const handleChange = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)

		const bodyFont = formData.get('body-font') as string
		const titleFont = formData.get('title-font') as string

		// @ts-ignore
		await arls.settings.update(settings.id, {
			bodyFont: S.decodeSync(NonEmptyString100)(bodyFont),
			titleFont: S.decodeSync(NonEmptyString100)(titleFont),
		})
		toast({
			description: <SavedToastContent />,
		})
	}

	const handleThemeChange = (theme: string) => {
		setTheme(theme as Theme)
	}

	return (
		<Form className='flex flex-col gap-8' onChange={handleChange}>
			<section className='flex flex-col gap-4'>
				<div className='flex items-center justify-between h-10'>
					<Label className='flex flex-col gap-2'>
						Theme
						<small className='text-xs font-light'>
							Choose Aurelius' default theme
						</small>
					</Label>
					<Select
						onValueChange={handleThemeChange}
						name='theme'
						value={theme ?? SiteTheme.DARK}
					>
						<SelectTrigger className='w-[180px]'>
							<SelectValue placeholder='Fonts' />
						</SelectTrigger>
						<SelectContent>
							{SITE_THEMES.map((mode) => (
								<SelectItem key={mode.value} value={mode.value}>
									{mode.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<Separator />
				<div className='flex items-center justify-between h-10'>
					<Label className='flex flex-col gap-2'>
						Title font
						<small className='text-xs font-light'>
							Set the font for the title
						</small>
					</Label>
					<Select
						defaultValue={settings.titleFont as string}
						name='title-font'
					>
						<SelectTrigger className='w-[180px]'>
							<SelectValue placeholder='Fonts' />
						</SelectTrigger>
						<SelectContent>
							{ALL_FONTS.map((font) => (
								<SelectItem
									className={`${font.value}`}
									key={font.value}
									value={font.value}
								>
									{font.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<Separator />
				<div className='flex items-center justify-between h-10'>
					<Label className='flex flex-col gap-2'>
						Body font
						<small className='text-xs font-light'>
							Set the font for the title
						</small>
					</Label>
					<Select
						defaultValue={settings.bodyFont as string}
						name='body-font'
					>
						<SelectTrigger className='w-[180px]'>
							<SelectValue placeholder='Fonts' />
						</SelectTrigger>
						<SelectContent>
							{ALL_FONTS.map((font) => (
								<SelectItem
									className={`${font.value}`}
									key={font.value}
									value={font.value}
								>
									{font.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</section>
		</Form>
	)
}

const Editor = ({ settings }: { settings: SettingsRow }) => {
	const { toast } = useToast()

	const handleChange = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)

		const showSplashDialog = formData.get('show-splash-dialog') === 'on'
		const toolbarMode = formData.get('editor-toolbar-mode') as string

		// @ts-ignore
		await arls.settings.update(settings.id, {
			// @ts-ignore
			showSplashDialog,
			toolbarMode: S.decodeSync(NonEmptyString100)(toolbarMode),
		})
		toast({
			description: <SavedToastContent />,
		})
	}

	return (
		<Form className='flex flex-col gap-4' onChange={handleChange}>
			<section className='flex flex-col gap-4'>
				<div className='flex items-center justify-between h-10'>
					<Label className='flex flex-col gap-2'>
						Show quick start
						<small className='text-xs font-light'>
							Show the popup that lists all the common actions
							when you load the website
						</small>
					</Label>
					<Switch
						defaultChecked={!!settings.showSplashDialog}
						name='show-splash-dialog'
					/>
				</div>
				<Separator />
				<div className='flex items-center justify-between h-10'>
					<Label className='flex flex-col gap-2'>
						Editor toolbar mode
						<small className='text-xs font-light'>
							Whether to always show the formatting toolbar or
							only when text is selected
						</small>
					</Label>
					<Select
						defaultValue={settings.toolbarMode as string}
						name='editor-toolbar-mode'
					>
						<SelectTrigger className='w-[180px]'>
							<SelectValue placeholder='Mode' />
						</SelectTrigger>
						<SelectContent>
							{TOOLBAR_MODES.map((mode) => (
								<SelectItem key={mode.value} value={mode.value}>
									{mode.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</section>
		</Form>
	)
}

const Writing = ({ settings }: { settings: SettingsRow }) => {
	const [dailyGoalType, setDailyGoalType] = useState(
		settings.writingDailyGoal || DAILY_GOAL_TYPE[0].value,
	)
	const { toast } = useToast()

	const saveFormData = async (
		writingDailyGoal: string,
		writingDailyTarget: number,
	) => {
		// @ts-ignore
		await arls.settings.update(settings.id, {
			writingDailyGoal: S.decodeSync(NonEmptyString100)(writingDailyGoal),
			writingDailyTarget: S.decodeSync(Int)(writingDailyTarget),
		})
		toast({
			description: <SavedToastContent />,
		})
	}

	const debouncedSaveFormData = useDebounce(saveFormData, 1000)

	const handleChange = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const target = event.target as HTMLInputElement | HTMLSelectElement
		const { type } = target
		const formData = new FormData(event.currentTarget)

		const writingDailyGoal = formData.get(
			'writing-daily-goal-type',
		) as string
		const writingDailyTarget =
			(writingDailyGoal as WritingDailyGoalType) ===
			WritingDailyGoalType.DURATION
				? Number.parseInt(
						formData.get('daily-goal-duration') as string,
						10,
					)
				: Number.parseInt(
						formData.get('daily-goal-word-count') as string,
						10,
					)

		if (type === 'number') {
			debouncedSaveFormData(writingDailyGoal, writingDailyTarget)
		} else {
			await saveFormData(writingDailyGoal, writingDailyTarget)
		}
	}

	return (
		<Form className='flex flex-col gap-4' onChange={handleChange}>
			<div className='flex items-center justify-between h-10'>
				<Label className='flex flex-col gap-2'>
					Daily Goal
					<small className='text-xs font-light'>
						Whether the daily goal should be an amount of time or
						number of words
					</small>
				</Label>
				<Select
					// @ts-ignore
					defaultValue={dailyGoalType}
					name='writing-daily-goal-type'
					onValueChange={(value) =>
						setDailyGoalType(value as WritingDailyGoalType)
					}
					// @ts-ignore
					value={dailyGoalType}
				>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='Daily Goal' />
					</SelectTrigger>
					<SelectContent>
						{DAILY_GOAL_TYPE.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<Separator />
			<div className='flex items-center justify-between h-10'>
				{dailyGoalType === WritingDailyGoalType.DURATION ? (
					<>
						<Label className='flex flex-col gap-2'>
							Duration
							<small className='text-xs font-light'>
								The amount of time you want to write everyday
								measured in minutes
							</small>
						</Label>
						<Input
							className='max-w-48'
							defaultValue={`${settings.writingDailyTarget}`}
							min={1}
							name='daily-goal-duration'
							type='number'
						/>
					</>
				) : (
					<>
						<Label className='flex flex-col gap-2'>
							Word Count
							<small className='text-xs font-light'>
								The number of words you want to write everyday
							</small>
						</Label>
						<Input
							className='max-w-48'
							defaultValue={`${settings.writingDailyTarget}`}
							min={1}
							name='daily-goal-word-count'
							type='number'
						/>
					</>
				)}
			</div>
		</Form>
	)
}

const Export = ({ settings }: { settings: SettingsRow }) => {
	const { toast } = useToast()

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)

		const exportImageFooter = formData.get('export-footer-text') as string
		const exportImageWatermark = formData.get('export-watermark')
			? formData.get('export-watermark') === 'on'
			: true

		// @ts-ignore
		await arls.settings.update(settings.id, {
			exportImageFooter: S.decodeSync(String1000)(exportImageFooter),
			// @ts-ignore
			exportImageWatermark,
		})
		toast({
			description: <SavedToastContent />,
		})
	}

	return (
		<Form className='flex flex-col gap-4' onSubmit={handleSubmit}>
			<div className='flex items-center justify-between h-10'>
				<Label className='flex flex-col gap-2'>
					Footer Text
					<small className='text-xs font-light'>
						Custom text to be included at the bottom of the exported
						image
					</small>
				</Label>
				<Input
					className='max-w-64'
					defaultValue={
						settings.exportImageFooter
							? `${settings.exportImageFooter}`
							: ''
					}
					name='export-footer-text'
					placeholder='Footer Text'
				/>
			</div>
			<Separator />
			<div className='flex items-center justify-between h-10'>
				<Label className='flex flex-col gap-2'>
					Watermark
					<small className='text-xs font-light'>
						Show a &quot;Made with Aurelius&quot; watermark on the
						exported image
					</small>
				</Label>
				<div className='flex items-center gap-2'>
					<a
						className='text-xs px-2 py-1 h-auto flex items-center'
						href='https://plus.aurelius.ink'
						rel='noreferrer noopener'
					>
						Upgrade to Plus
						<ExternalLinkIcon className='ml-2 w-3 h-3' />
					</a>
					<Switch
						defaultChecked={!!settings.exportImageWatermark}
						disabled={true}
						name='export-watermark'
					/>
				</div>
			</div>
			<div className='flex justify-start'>
				<Button size='sm' type='submit'>
					Save
				</Button>
			</div>
		</Form>
	)
}

const Music = ({ settings }: { settings: SettingsRow }) => {
	const [selectedChannel, setSelectedChannel] = useState(
		settings.musicChannel as string,
	)
	const { toast } = useToast()

	const saveFormData = async (
		enableMusicPlayer: boolean,
		musicChannel: string,
		youtubeLink: string,
	) => {
		// @ts-ignore
		await arls.settings.update(settings.id, {
			// @ts-ignore
			enableMusicPlayer,
			musicChannel: S.decodeSync(NonEmptyString100)(musicChannel),
			youtubeLink: S.decodeSync(String1000)(youtubeLink),
		})
		toast({
			description: <SavedToastContent />,
		})
	}

	const debouncedSaveFormData = useDebounce(saveFormData, 1000)

	const handleChange = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const target = event.target as HTMLInputElement
		const { type } = target
		const formData = new FormData(event.currentTarget)

		const enableMusicPlayer = formData.get('enable-music-player') === 'on'
		const musicChannel = formData.get('music-channel') as string
		const youtubeLink = formData.get('youtube-link') as string
		if (type === 'text') {
			debouncedSaveFormData(enableMusicPlayer, musicChannel, youtubeLink)
		} else {
			await saveFormData(enableMusicPlayer, musicChannel, youtubeLink)
		}
	}

	return (
		<Form className='flex flex-col gap-4' onChange={handleChange}>
			<div className='flex items-center justify-between h-10'>
				<Label className='flex flex-col gap-2'>
					Enable music player
					<small className='text-xs font-light'>
						Listen to focus music while you write.
					</small>
				</Label>
				<div className='flex items-center'>
					<Tooltip>
						<TooltipTrigger asChild>
							<TriangleAlertIcon className='w-4 h-4 mr-4 text-yellow-500' />
						</TooltipTrigger>
						<TooltipContent>
							<p className='text-sm text-center'>
								Important: This feature uses YouTube for music
								playback. Please be aware that enabling it will
								allow YouTube to set cookies for this site.
								<br /> If you prefer to avoid this, you can open
								the music channel link in a separate tab and
								play it there instead.
							</p>
						</TooltipContent>
					</Tooltip>
					<Switch
						defaultChecked={!!settings.enableMusicPlayer}
						name='enable-music-player'
					/>
				</div>
			</div>
			<Separator />
			<div className='flex items-center justify-between h-10'>
				<Label className='flex flex-col gap-2'>
					Channels
					<small className='text-xs font-light'>
						Genre of focus music to play in the music player
					</small>
				</Label>
				<div className='flex items-center gap-2'>
					<Select
						name='music-channel'
						onValueChange={setSelectedChannel}
						value={selectedChannel}
					>
						<SelectTrigger className='w-[180px]'>
							<SelectValue placeholder='Channels' />
						</SelectTrigger>
						<SelectContent>
							{CHANNELS.map((channel) => (
								<SelectItem
									key={channel.value}
									value={channel.value}
								>
									{channel.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<a
						href={
							MUSIC_STATIONS[
								selectedChannel as MusicChannels
							] as string
						}
						target='_blank'
						rel='noreferrer noopener'
					>
						<Button size='icon' type='button' variant='outline'>
							<ExternalLinkIcon className='w-4 h-4' />
						</Button>
					</a>
				</div>
			</div>
			<Separator />
			<div className='flex items-center justify-between h-10'>
				<Label className='flex flex-col gap-2'>
					YouTube Video/Playlist
					<small className='text-xs font-light'>
						YouTube video or playlist to play. Overrides Channel
						setting.
					</small>
				</Label>
				<Input
					className='max-w-64'
					defaultValue={
						settings.youtubeLink ? `${settings.youtubeLink}` : ''
					}
					name='youtube-link'
					type='text'
				/>
			</div>
		</Form>
	)
}

const Sync = ({
	setPreferencesOpen,
}: {
	setPreferencesOpen: (value: boolean) => void
}) => {
	const { getOwner, restoreOwner } = useEvolu<Database>()
	const navigate = useNavigate()
	const [hasCopied, setHasCopied] = useState(false)
	const [isStartSyncOpen, setIsStartSyncOpen] = useState(false)
	const { toast } = useToast()

	const owner = getOwner()

	// biome-ignore lint: correctness/useExhaustiveDependencies
	useEffect(() => {
		setTimeout(() => {
			setHasCopied(false)
		}, 2000)
	}, [hasCopied])

	const startSync = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		toast({
			description: (
				<span className='inline-flex items-center text-base'>
					<LoaderCircleIcon className='w-4 h-4 mr-2 animate-spin' />
					Sync started
				</span>
			),
		})
		const formData = new FormData(event.currentTarget)
		const syncCode = formData.get('sync-code') as string
		setTimeout(() => {
			parseMnemonic(syncCode)
				.pipe(Effect.runPromiseExit)
				.then(
					Exit.match({
						onFailure: (error) => {
							toast({
								title: 'Sync Failed',
								description:
									'This might be because of an invalid sync code or your browser/device is not connected to the internet. Please try again.',
							})
						},
						onSuccess: (mnemonic) => {
							localStorage.setItem(IS_RESTORING_KEY, 'true')
							restoreOwner(mnemonic).then()
						},
					}),
				)
		}, 3000)
	}

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex items-center justify-between h-10'>
				<Label className='flex flex-col gap-2'>
					Sync Code
					<small className='text-xs font-light'>
						Sync all your data with another device using this code
					</small>
				</Label>
				<Dialog>
					<DialogTrigger asChild>
						<Button size='sm' variant='outline'>
							View Sync Code
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Sync Code</DialogTitle>
							<DialogDescription>
								On your target computer, go to Preferences &gt;
								Sync and click the “I have a Sync Code” button.
								Enter the sync code words shown below. Treat
								this code like a password. If someone gets a
								hold of it, they can read and modify your synced
								data.
							</DialogDescription>
						</DialogHeader>
						<Card>
							<CardContent className='flex items-center justify-center p-0 bg-muted relative'>
								<Button
									className='absolute top-1 right-1 p-0 w-5 h-5'
									onClick={() => {
										copyToClipboard(
											owner?.mnemonic as string,
										).then(() => {
											setHasCopied(true)
										})
									}}
									size='icon'
									variant='ghost'
								>
									<span className='sr-only'>Copy</span>
									{hasCopied ? (
										<CheckIcon className='w-3 h-3' />
									) : (
										<ClipboardIcon className='w-3 h-3' />
									)}
								</Button>
								<pre className='text-wrap text-sm leading-relaxed p-4'>
									{owner?.mnemonic}
								</pre>
							</CardContent>
						</Card>
					</DialogContent>
				</Dialog>
			</div>
			<Separator />
			<div className='flex items-center justify-between h-10'>
				<Label className='flex flex-col gap-2'>
					Import Data from another device
					<small className='text-xs font-light'>
						Enter a sync code to sync all your data with another
						device
					</small>
				</Label>
				<Button
					onClick={() => setIsStartSyncOpen(true)}
					size='sm'
					variant='outline'
				>
					I have a Sync Code
				</Button>
				<Dialog
					onOpenChange={setIsStartSyncOpen}
					open={isStartSyncOpen}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Enter Sync Code</DialogTitle>
							<DialogDescription>
								This will sync all your data to this
								browser/device. Make sure you have a backup of
								the data on this browser/device before syncing.
							</DialogDescription>
						</DialogHeader>
						<Form
							className='flex flex-col gap-4'
							onSubmit={startSync}
						>
							<Textarea name='sync-code' />
							<DialogFooter>
								<Button>Start Sync</Button>
							</DialogFooter>
						</Form>
					</DialogContent>
				</Dialog>
			</div>
			<div className='py-4'>
				<span className='flex flex-col gap-2 italic text-sm text-muted-foreground'>
					Note: Sync is end-to-end encrypted so Aurelius servers
					can&apos;t read your data.
				</span>
			</div>
		</div>
	)
}

const DataDeletedToastTitle = () => (
	<span className='flex items-center'>
		<LoaderCircleIcon className='w-4 h-4 mr-2 animate-spin' />
		<span className='text-sm font-semibold'>Please wait...</span>
	</span>
)

const DataDeletedToastContent = () => (
	<div className='pl-6'>
		<span className='text-sm'>Your data is being deleted.</span>
	</div>
)

const Advanced = () => {
	const { resetOwner } = useEvolu<Database>()
	const { toast } = useToast()

	const confirmDelete = () => {
		toast({
			description: (
				<>
					<DataDeletedToastTitle />
					<DataDeletedToastContent />
				</>
			),
		})
		setTimeout(() => {
			resetOwner().then(() => {})
		}, 5000)
	}

	return (
		<div className='flex flex-col gap-8'>
			{/*<section className='flex flex-col gap-4'>*/}
			{/*	<div className='flex items-center justify-between h-10'>*/}
			{/*		<Label className='flex flex-col gap-2'>*/}
			{/*			Export your data*/}
			{/*			<small className='text-xs font-light'>*/}
			{/*				Download all of your data in a single JSON file.*/}
			{/*			</small>*/}
			{/*		</Label>*/}
			{/*		<div className='flex items-center gap-4'>*/}
			{/*			<Badge className='text-xs'>Coming Soon</Badge>*/}
			{/*			<Button disabled={true} size='sm' variant='secondary'>*/}
			{/*				Export*/}
			{/*			</Button>*/}
			{/*		</div>*/}
			{/*	</div>*/}
			{/*</section>*/}
			<section className='flex flex-col gap-4'>
				<div className='flex items-center justify-between p-4 border border-destructive bg-destructive/10 rounded-lg'>
					<Label className='flex flex-col gap-2'>
						Delete All Data
						<small className='text-xs font-light'>
							Delete all your data from this browser/device.
						</small>
					</Label>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button size='sm' variant='destructive'>
								Delete My Data
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This will delete your data from this
									browser/device. If you want to recover your
									data later, make sure you have synced your
									data with another device.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction asChild>
									<Button
										className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
										onClick={confirmDelete}
									>
										Yes, I&apos;m sure
									</Button>
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</section>
		</div>
	)
}

const Profile = ({ settings }: { settings: SettingsRow }) => {
	const { toast } = useToast()

	const saveFormData = async (userName: string) => {
		// @ts-ignore
		await arls.settings.update(settings.id, {
			userName: S.decodeSync(String1000)(userName),
		})
		toast({
			description: <SavedToastContent />,
		})
	}

	const debouncedSaveFormData = useDebounce(saveFormData, 1000)

	const handleChange = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const target = event.target as HTMLInputElement | HTMLSelectElement
		const { type } = target
		const formData = new FormData(event.currentTarget)

		const userName = formData.get('user-name') as string

		if (type === 'text') {
			debouncedSaveFormData(userName)
		} else {
			await saveFormData(userName)
		}
	}

	return (
		<Form className='flex flex-col gap-4' onChange={handleChange}>
			<div className='flex items-center justify-between'>
				<Label className='flex flex-col gap-2'>
					Name
					<small className='text-xs font-light'>
						Your name to display in the app
					</small>
				</Label>
				<Input
					className='max-w-64'
					defaultValue={settings.userName as string}
					name='user-name'
					placeholder='Name'
					type='text'
				/>
			</div>
		</Form>
	)
}

const PreferencesDialog = ({
	preferencesOpen,
	setPreferencesOpen,
	settings,
}: { settings: SettingsRow } & PreferencesDialogProps) => {
	const TABS = [
		{
			id: 'appearance',
			label: 'Appearance',
			content: <Appearance settings={settings} />,
		},
		{
			id: 'editor',
			label: 'Editor',
			content: <Editor settings={settings} />,
		},
		{
			id: 'writing',
			label: 'Writing',
			content: <Writing settings={settings} />,
		},
		// {
		// 	id: 'export',
		// 	label: 'Export',
		// 	content: <Export settings={settings} />,
		// },
		{
			id: 'music',
			label: 'Music',
			content: <Music settings={settings} />,
		},
		{
			id: 'sync',
			label: 'Sync',
			content: <Sync setPreferencesOpen={setPreferencesOpen} />,
		},
		{
			id: 'advanced',
			label: 'Advanced',
			content: <Advanced />,
		},
	]

	const USER_TABS = [
		{
			id: 'profile',
			label: 'Profile',
			content: <Profile settings={settings} />,
		},
	]

	return (
		<Dialog onOpenChange={setPreferencesOpen} open={preferencesOpen}>
			<DialogContent className='w-[64rem] max-w-none max-h-[96rem] min-h-[40rem] p-0'>
				<VisuallyHidden>
					<DialogHeader>
						<DialogTitle>Preferences</DialogTitle>
						<DialogDescription>
							List of preferences you can set to customize your
							experience in Aurelius
						</DialogDescription>
					</DialogHeader>
				</VisuallyHidden>
				<Tabs className='w-full h-full' defaultValue={TABS[0].id}>
					<div className='h-full flex rounded-lg overflow-hidden'>
						<ScrollArea className='w-64 h-full px-0 py-6'>
							<div className='flex flex-col w-full h-auto gap-8'>
								<section className='flex flex-col gap-4'>
									<Label className='text-muted-foreground px-8 font-semibold'>
										General
									</Label>
									<TabsList className='w-full h-full flex-col justify-start px-4 py-0 bg-transparent'>
										{TABS.map((tab) => (
											<TabsTrigger
												key={tab.id}
												className='w-full justify-start px-4 data-[state=active]:bg-primary/75'
												value={tab.id}
											>
												{tab.label}
											</TabsTrigger>
										))}
									</TabsList>
								</section>
								<section className='flex flex-col gap-4'>
									<Label className='text-muted-foreground px-8 font-semibold'>
										Account
									</Label>
									<TabsList className='w-full h-full flex-col justify-start px-4 py-0 bg-transparent'>
										{USER_TABS.map((tab) => (
											<TabsTrigger
												key={tab.id}
												className='w-full justify-start px-4 data-[state=active]:bg-primary/75'
												value={tab.id}
											>
												{tab.label}
											</TabsTrigger>
										))}
									</TabsList>
								</section>
							</div>
						</ScrollArea>
						<Separator className='h-full' orientation='vertical' />
						<ScrollArea className='w-full h-full min-h-[40rem] max-h-[40rem] flex-1 flex-grow grid-cols-2 gap-2 px-8 py-6'>
							{[...TABS, ...USER_TABS].map((tab) => (
								<TabsContent
									className='px-4'
									key={tab.id}
									value={tab.id}
								>
									{tab.content}
								</TabsContent>
							))}
						</ScrollArea>
					</div>
				</Tabs>
			</DialogContent>
		</Dialog>
	)
}

export default PreferencesDialog
