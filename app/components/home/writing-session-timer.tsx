import {
	Dispatch,
	FormEvent,
	ReactNode,
	SetStateAction,
	useEffect,
	useState,
} from 'react'
import { Timer, TimerRenderer, useTimer } from 'react-use-precision-timer'

import { Form } from '@remix-run/react'

import {
	CircleHelpIcon,
	PauseIcon,
	PlayIcon,
	SquareIcon,
	TimerIcon,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '~/components/ui/popover'
import { Separator } from '~/components/ui/separator'
import { Switch } from '~/components/ui/switch'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '~/components/ui/tooltip'
import { useToast } from '~/components/ui/use-toast'
import { WritingSessionSettings } from '~/lib/types'
import { formatTime } from '~/lib/utils'

const HelpTooltip = ({ children }: { children: string | ReactNode }) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					<CircleHelpIcon className='w-4 h-4 ml-2' />
				</TooltipTrigger>
				<TooltipContent>
					<p className='text-sm text-center'>{children}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

const SessionTimer = ({
	setElapsedMinutes,
	timer,
}: {
	setElapsedMinutes: Dispatch<SetStateAction<number>>
	timer: Timer
}) => {
	const { hours, minutes, seconds } = formatTime(
		timer.getElapsedRunningTime()
	)

	useEffect(() => {
		setElapsedMinutes(() => parseInt(minutes, 10))
	}, [minutes])

	return (
		<span className='w-24 px-4 text-center'>{`${hours}:${minutes}:${seconds}`}</span>
	)
}

const WritingSessionTimer = ({
	writingSessionSettings,
	setWritingSessionSettings,
}: {
	writingSessionSettings: WritingSessionSettings
	setWritingSessionSettings: Dispatch<SetStateAction<WritingSessionSettings>>
}) => {
	const [elapsedMinutes, setElapsedMinutes] = useState(0)
	const [writingSessionPopoverOpen, setWritingSessionPopoverOpen] =
		useState(false)
	const sessionTimer = useTimer()
	const { toast } = useToast()

	const pauseWritingSession = () => {
		sessionTimer.pause()
		// TODO: pause the music, disable focus time if enabled
	}

	const resumeWritingSession = () => {
		sessionTimer.resume()
		// TODO: resume playing music if enabled, re-enable focus time if enabled
	}

	const startWritingSession = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const targetDuration = parseInt(
			formData.get('target-duration') as string,
			10
		)
		const focusMode = formData.get('focus-mode') === 'on'
		const music = formData.get('music') === 'on'
		const notifyOnTargetDuration =
			formData.get('notify-on-target-duration') === 'on'

		setWritingSessionSettings({
			targetDuration,
			focusMode,
			music,
			notifyOnTargetDuration,
		})

		// start the timer
		sessionTimer.start()
		setWritingSessionPopoverOpen(false)
	}

	const stopWritingSession = () => {
		sessionTimer.stop()
		// TODO: stop the music, disable focus time if enabled, save the progress
	}

	useEffect(() => {
		// check if the session has reached the target duration
		if (
			sessionTimer.isRunning() &&
			elapsedMinutes === writingSessionSettings.targetDuration
		) {
			// if the user wants to be notified when the target duration is reached show a toast
			if (writingSessionSettings.notifyOnTargetDuration) {
				// show notification
				toast({
					title: "You've completed the writing session! 🎉",
					description: (
						<span>
							You&apos;ve reached your target duration of{' '}
							{writingSessionSettings.targetDuration} minutes. You
							can continue writing if you want. Click the stop
							button in the timer when you&apos;re done and
							we&apos;ll save your progress.
						</span>
					),
					duration: 10000,
				})
			}
		}
	}, [elapsedMinutes])

	return (
		<section className='flex items-center gap-2 h-10 absolute top-4 right-4'>
			{sessionTimer.isStarted() && (
				<div className='flex items-center h-9 bg-background rounded-lg border border-border'>
					{sessionTimer.isRunning() && (
						<>
							<Button
								className='w-9 h-9'
								onClick={pauseWritingSession}
								size='icon'
								variant='ghost'
							>
								<PauseIcon className='w-4 h-4' />
							</Button>
							<Separator orientation='vertical' />
						</>
					)}
					{sessionTimer.isPaused() && (
						<>
							<Button
								className='w-9 h-9'
								onClick={resumeWritingSession}
								size='icon'
								variant='ghost'
							>
								<PlayIcon className='w-4 h-4' />
							</Button>
							<Separator orientation='vertical' />
						</>
					)}
					{(!sessionTimer.isStopped() ||
						!sessionTimer.isRunning()) && (
						<>
							<Button
								className='w-9 h-9'
								onClick={stopWritingSession}
								size='icon'
								variant='ghost'
							>
								<SquareIcon className='w-4 h-4' />
							</Button>
							<Separator orientation='vertical' />
						</>
					)}
					<TimerRenderer
						timer={sessionTimer}
						render={(timer) => (
							<SessionTimer
								setElapsedMinutes={setElapsedMinutes}
								timer={timer}
							/>
						)}
						renderRate={10}
					/>
				</div>
			)}
			{!sessionTimer.isStarted() && !sessionTimer.isRunning() && (
				<Popover
					onOpenChange={setWritingSessionPopoverOpen}
					open={writingSessionPopoverOpen}
				>
					<PopoverTrigger asChild>
						<Button
							className='w-9 h-9'
							size='icon'
							variant='outline'
						>
							<TimerIcon className='w-4 h-4' />
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-80' align='end' sideOffset={8}>
						<div className='grid gap-4'>
							<div className='space-y-2'>
								<h4 className='font-medium leading-none'>
									New Writing Session
								</h4>
								<p className='text-sm text-muted-foreground'>
									Configure the session to your liking.
								</p>
							</div>
							<Form
								className='grid gap-1'
								onSubmit={startWritingSession}
							>
								<div className='grid grid-cols-3 items-center gap-4 h-10'>
									<Label
										className='col-span-2 flex items-center'
										htmlFor='session-duration'
									>
										Target Duration
										<HelpTooltip>
											Set the target duration for the
											writing session in minutes.
										</HelpTooltip>
									</Label>
									<Input
										className='col-span-1'
										defaultValue={
											writingSessionSettings.targetDuration
										}
										name='session-duration'
										type='number'
									/>
								</div>
								<div className='grid grid-cols-3 items-center gap-4 h-10'>
									<Label
										className='col-span-2 flex items-center'
										htmlFor='focus-mode'
									>
										Focus Mode
										<HelpTooltip>
											Enable focus mode. This will hide
											all the UI elements and only show
											the editor. <br /> Hover on the top
											left side of the screen to show the
											menu button.
										</HelpTooltip>
									</Label>
									<div className='col-span-1 flex justify-end'>
										<Switch
											className='w-9 h-5 [&>span]:w-4 [&>span]:h-4 [&>span]:data-[state=checked]:translate-x-4'
											defaultChecked={
												writingSessionSettings.focusMode
											}
											name='focus-mode'
										/>
									</div>
								</div>
								<div className='grid grid-cols-3 items-center gap-4 h-10'>
									<Label
										className='col-span-2 flex items-center'
										htmlFor='music'
									>
										Music
										<HelpTooltip>
											Play music during the writing
											session. Select the music channel to
											play in Preferences.
										</HelpTooltip>
									</Label>
									<div className='col-span-1 flex justify-end'>
										<Switch
											className='w-9 h-5 [&>span]:w-4 [&>span]:h-4 [&>span]:data-[state=checked]:translate-x-4'
											defaultChecked={
												writingSessionSettings.music
											}
											name='music'
										/>
									</div>
								</div>
								<div className='grid grid-cols-3 items-center gap-4 h-10'>
									<Label
										className='col-span-2 flex items-center'
										htmlFor='notify'
									>
										Notify on target duration
										<HelpTooltip>
											Receive a notification when the
											target duration is reached.
										</HelpTooltip>
									</Label>
									<div className='col-span-1 flex justify-end'>
										<Switch
											className='w-9 h-5 [&>span]:w-4 [&>span]:h-4 [&>span]:data-[state=checked]:translate-x-4'
											defaultChecked={
												writingSessionSettings.notifyOnTargetDuration
											}
											name='notify-on-target-duration'
										/>
									</div>
								</div>
								<div className='flex items-center justify-end h-10'>
									<Button size='sm' type='submit'>
										Start Session
									</Button>
								</div>
							</Form>
						</div>
					</PopoverContent>
				</Popover>
			)}
		</section>
	)
}

export default WritingSessionTimer
