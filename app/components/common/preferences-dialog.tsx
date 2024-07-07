import { useState } from 'react'

import { Form } from '@remix-run/react'

import { ExternalLinkIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent } from '~/components/ui/dialog'
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
import { PreferencesDialogProps } from '~/lib/types'

const Editor = () => {
	const TOOLBAR_MODES = [
		{ value: 'fixed', label: 'Fixed' },
		{ value: 'floating', label: 'Floating' },
	]

	return (
		<Form className='flex flex-col gap-4'>
			<div className='flex items-center justify-between'>
				<Label className='flex flex-col gap-2'>
					Display splash screen
					<small className='au-text-xs au-font-light'>
						Display the popup that lists all the common actions when
						you load the website
					</small>
				</Label>
				<Switch id='show-splash-dialog' />
			</div>
			<Separator />
			<div className='flex items-center justify-between pr-1'>
				<Label className='flex flex-col gap-2'>
					Default editor toolbar mode
					<small className='au-text-xs au-font-light'>
						Whether to always show the formatting toolbar or only
						when text is selected
					</small>
				</Label>
				<Select defaultValue={TOOLBAR_MODES[0].value}>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='Theme' />
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
		</Form>
	)
}

const Writing = () => {
	const DAILY_GOAL_OPTIONS = [
		{ value: 'duration', label: 'Duration' },
		{ value: 'wordCount', label: 'Word Count' },
	]
	const [dailyGoalType, setDailyGoalType] = useState(
		DAILY_GOAL_OPTIONS[0].value
	)

	return (
		<Form className='flex flex-col gap-4'>
			<div className='flex items-center justify-between pr-1'>
				<Label className='flex flex-col gap-2'>
					Daily Goal
					<small className='au-text-xs au-font-light'>
						Whether the daily goal should be an amount of time or
						number of words
					</small>
				</Label>
				<Select
					defaultValue={DAILY_GOAL_OPTIONS[0].value}
					value={dailyGoalType}
					onValueChange={setDailyGoalType}
				>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='Daily Goal' />
					</SelectTrigger>
					<SelectContent>
						{DAILY_GOAL_OPTIONS.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<Separator />
			<div className='flex items-center justify-between pr-1'>
				{dailyGoalType === 'duration' ? (
					<>
						<Label className='flex flex-col gap-2'>
							Duration
							<small className='au-text-xs au-font-light'>
								The amount of time you want to write everyday
								measured in minutes
							</small>
						</Label>
						<Input
							className='max-w-48'
							id='daily-goal-duration'
							type='number'
						/>
					</>
				) : (
					<>
						<Label className='flex flex-col gap-2'>
							Word Count
							<small className='au-text-xs au-font-light'>
								The number of words you want to write everyday
							</small>
						</Label>
						<Input
							className='max-w-48'
							id='daily-goal-word-count'
							type='number'
						/>
					</>
				)}
			</div>
		</Form>
	)
}

const Export = () => {
	return (
		<Form className='flex flex-col gap-4'>
			<div className='flex items-center justify-between pr-1'>
				<Label className='flex flex-col gap-2'>
					Footer Text
					<small className='au-text-xs au-font-light'>
						Custom text to be included at the bottom of the exported
						image
					</small>
				</Label>
				<Input
					className='max-w-64'
					id='export-footer-text'
					placeholder='Footer Text'
				/>
			</div>
			<Separator />
			<div className='flex items-center justify-between'>
				<Label className='flex flex-col gap-2'>
					Watermark
					<small className='au-text-xs au-font-light'>
						Show a &quot;Made with Aurelius&quot; watermark on the
						exported image
					</small>
				</Label>
				<div className='flex items-center gap-4'>
					<a
						className='text-xs px-2 py-1 h-auto flex items-center'
						href='https://plus.aurelius.ink'
						rel='noreferrer noopener'
					>
						Upgrade to Plus
						<ExternalLinkIcon className='ml-2 w-3 h-3' />
					</a>
					<Switch
						defaultChecked={true}
						disabled={true}
						id='export-watermark'
					/>
				</div>
			</div>
		</Form>
	)
}

const Music = () => {
	const CHANNELS = [
		{ value: 'lofi-hiphop', label: 'LoFi Hip Hop' },
		{ value: 'chill-synth', label: 'Chill Synth' },
		{ value: 'chillstep', label: 'Chillstep' },
		{ value: 'post-rock', label: 'Post Rock' },
	]

	return (
		<Form className='flex flex-col gap-4'>
			<div className='flex items-center justify-between pr-1'>
				<Label className='flex flex-col gap-2'>
					Channels
					<small className='au-text-xs au-font-light'>
						Genre of focus music to play in the music player
					</small>
				</Label>
				<Select>
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
			</div>
			<Separator />
			<div className='flex items-center justify-between pr-1'>
				<Label className='flex flex-col gap-2'>
					YouTube Video/Playlist
					<small className='au-text-xs au-font-light'>
						Link of the YouTube video or playlist to play. Overrides
						the selected channel.
					</small>
				</Label>
				<Input className='max-w-64' id='youtube-link' type='text' />
			</div>
		</Form>
	)
}

const Profile = () => {
	return (
		<Form className='flex flex-col gap-4'>
			<div className='flex items-center justify-between pr-1'>
				<Label className='flex flex-col gap-2'>Name</Label>
				<Input
					className='max-w-64'
					id='name'
					placeholder='Name'
					type='text'
				/>
			</div>
			<Separator />
			<div className='flex items-center justify-between pr-1'>
				<Label className='flex flex-col gap-2'>Bio</Label>
				<Input
					className='max-w-64'
					id='bio'
					placeholder='Bio'
					type='text'
				/>
			</div>
			<Separator />
			<div className='flex items-center justify-between pr-1'>
				<Label className='flex flex-col gap-2'>Username</Label>
				<Input
					className='max-w-64'
					id='username'
					placeholder='Username'
					type='text'
				/>
			</div>
		</Form>
	)
}

const PreferencesDialog = ({
	preferencesOpen,
	setPreferencesOpen,
}: PreferencesDialogProps) => {
	const TABS = [
		{
			id: 'editor',
			label: 'Editor',
			content: <Editor />,
		},
		{
			id: 'writing',
			label: 'Writing',
			content: <Writing />,
		},
		{
			id: 'export',
			label: 'Export',
			content: <Export />,
		},
		{
			id: 'music',
			label: 'Music',
			content: <Music />,
		},
	]

	const USER_TABS = [
		{
			id: 'profile',
			label: 'Profile',
			content: <Profile />,
		},
	]

	return (
		<Dialog onOpenChange={setPreferencesOpen} open={preferencesOpen}>
			<DialogContent className='w-[64rem] max-w-none max-h-[96rem] min-h-[40rem] p-0'>
				<Tabs className='w-full h-full' defaultValue={TABS[0].id}>
					<div className='h-full flex rounded-lg overflow-hidden'>
						<ScrollArea className='w-64 h-full px-4 py-6'>
							<div className='flex flex-col w-full h-auto gap-8'>
								<section className='flex flex-col gap-4'>
									<Label className='text-muted-foreground px-4 font-semibold'>
										General
									</Label>
									<TabsList className='w-full h-full flex-col justify-start p-0 bg-transparent'>
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
									<Label className='text-muted-foreground px-4 font-semibold'>
										Account
									</Label>
									<TabsList className='w-full h-full flex-col justify-start p-0 bg-transparent'>
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
						<ScrollArea className='w-full h-full min-h-[40rem] max-h-[40rem] flex-1 flex-grow grid-cols-2 gap-2 px-12 py-6'>
							{[...TABS, ...USER_TABS].map((tab) => (
								<TabsContent key={tab.id} value={tab.id}>
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
