import {
	Dispatch,
	FormEvent,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react'
import { Timer, TimerRenderer, useTimer } from 'react-use-precision-timer'

import { Form } from '@remix-run/react'

import * as S from '@effect/schema/Schema'
import { PositiveInt } from '@evolu/common'
import {
	CircleHelpIcon,
	PauseIcon,
	PlayIcon,
	SquareIcon,
	TimerIcon,
	TriangleAlertIcon,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
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
import { Separator } from '~/components/ui/separator'
import { Switch } from '~/components/ui/switch'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '~/components/ui/tooltip'
import { useToast } from '~/components/ui/use-toast'
import { AureliusContext, AureliusProviderData } from '~/lib/providers/aurelius'
import {
	WritingSessionDialogProps,
	WritingSessionSettings,
	WritingSessionStatus,
} from '~/lib/types'
import { formatTime } from '~/lib/utils'
import { arls } from '~/services/arls'
import { WordCount } from '~/services/evolu/schema'

const HelpTooltip = ({ children }: { children: string | ReactNode }) => {
	return (
		<Tooltip>
			<TooltipTrigger>
				<CircleHelpIcon className='w-4 h-4 ml-2' />
			</TooltipTrigger>
			<TooltipContent>
				<p className='text-sm text-center'>{children}</p>
			</TooltipContent>
		</Tooltip>
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

type WritingSessionTimerProps = {
	enableMusicPlayer: boolean
	focusMode: boolean
	isMusicPlaying: boolean
	setFocusMode: Dispatch<SetStateAction<boolean>>
	setIsMusicPlaying: Dispatch<SetStateAction<boolean>>
	setWritingSessionSettings: (settings: WritingSessionSettings) => void
	setWritingSessionStatus: (status: WritingSessionStatus) => void
	wordCount: number
	writingSessionSettings: WritingSessionSettings
} & WritingSessionDialogProps

const WritingSessionTimer = ({
	enableMusicPlayer,
	focusMode,
	isMusicPlaying,
	setFocusMode,
	setIsMusicPlaying,
	setWritingSessionOpen,
	setWritingSessionSettings,
	setWritingSessionStatus,
	wordCount,
	writingSessionOpen,
	writingSessionSettings,
}: WritingSessionTimerProps) => {
	const { sessionTimer } = useContext<AureliusProviderData>(AureliusContext)

	const [elapsedMinutes, setElapsedMinutes] = useState(0)
	const [startingWordCount, setStartingWordCount] = useState(wordCount)

	const { toast } = useToast()

	const pauseWritingSession = () => {
		sessionTimer.pause()
		setWritingSessionStatus(WritingSessionStatus.PAUSED)
		if (writingSessionSettings.focusMode) {
			setFocusMode(false)
		}
		if (writingSessionSettings.music && isMusicPlaying) {
			setIsMusicPlaying(false)
		}
	}

	const resumeWritingSession = () => {
		sessionTimer.resume()
		setWritingSessionStatus(WritingSessionStatus.RUNNING)
		if (writingSessionSettings.focusMode) {
			setFocusMode(true)
		}
		if (writingSessionSettings.music && !isMusicPlaying) {
			setIsMusicPlaying(true)
		}
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
		setWritingSessionOpen(false)
		setWritingSessionStatus(WritingSessionStatus.RUNNING)
	}

	const stopWritingSession = () => {
		const duration = sessionTimer.getElapsedRunningTime()
		sessionTimer.stop()
		setWritingSessionStatus(WritingSessionStatus.STOPPED)
		if (writingSessionSettings.focusMode) {
			setFocusMode(false)
		}
		if (writingSessionSettings.music && !isMusicPlaying) {
			setIsMusicPlaying(false)
		}
		arls.writingSessions.create({
			duration: S.decodeSync(PositiveInt)(duration),
			endingWordCount: S.decodeSync(WordCount)(wordCount),
			startingWordCount: S.decodeSync(WordCount)(startingWordCount),
		})
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
		<div
			className={`flex items-center gap-4 transition-opacity duration-100 hover:opacity-100 ${focusMode ? 'opacity-5' : 'opacity-100'}`}
		>
			<section className='flex items-center gap-2 h-9'>
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
					<Dialog
						onOpenChange={setWritingSessionOpen}
						open={writingSessionOpen}
					>
						<DialogTrigger asChild>
							<Button
								className='w-9 h-9'
								size='icon'
								variant='outline'
							>
								<TimerIcon className='w-4 h-4' />
							</Button>
						</DialogTrigger>
						<DialogContent className='w-[32rem] grid gap-4'>
							<DialogHeader>
								<DialogTitle>New Writing Session</DialogTitle>
								<DialogDescription>
									Configure the session to your liking.
								</DialogDescription>
							</DialogHeader>
							<Form
								className='flex flex-col gap-2'
								onSubmit={startWritingSession}
							>
								<div className='grid grid-cols-3 items-center gap-4 h-10'>
									<Label
										className='col-span-2 flex items-center leading-snug'
										htmlFor='session-duration'
									>
										Writing Time (in minutes)
									</Label>
									<Input
										className='col-span-1'
										defaultValue={
											writingSessionSettings.targetDuration
										}
										min={1}
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
										Play music to help with focus
									</Label>
									<div className='col-span-1 flex items-center justify-end'>
										{!enableMusicPlayer && (
											<Tooltip>
												<TooltipTrigger asChild>
													<TriangleAlertIcon className='w-4 h-4 mr-4 text-yellow-500' />
												</TooltipTrigger>
												<TooltipContent>
													<p className='text-sm text-center'>
														Enable music player in
														Preferences to use this
														feature.
													</p>
												</TooltipContent>
											</Tooltip>
										)}
										<Switch
											className='w-9 h-5 [&>span]:w-4 [&>span]:h-4 [&>span]:data-[state=checked]:translate-x-4'
											defaultChecked={
												writingSessionSettings.music
											}
											disabled={!enableMusicPlayer}
											name='music'
										/>
									</div>
								</div>
								<div className='grid grid-cols-3 items-center gap-4 h-10'>
									<Label
										className='col-span-2 flex items-center'
										htmlFor='notify'
									>
										Notify when target duration is reached
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
								<DialogFooter>
									<div className='flex items-center justify-end mt-2'>
										<Button size='sm' type='submit'>
											Start Session
										</Button>
									</div>
								</DialogFooter>
							</Form>
						</DialogContent>
					</Dialog>
				)}
			</section>
		</div>
	)
}

export default WritingSessionTimer
