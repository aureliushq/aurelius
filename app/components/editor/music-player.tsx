import { useContext, useState } from 'react'

// import ReactPlayer from 'react-player'
import {
	PauseIcon,
	PlayIcon,
	Volume1Icon,
	Volume2Icon,
	VolumeXIcon,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '~/components/ui/popover'
import { Separator } from '~/components/ui/separator'
import { Slider } from '~/components/ui/slider'
// import { MUSIC_STATIONS } from '~/lib/constants'
import {
	AureliusContext,
	type AureliusProviderData,
} from '~/lib/providers/aurelius'

// import type { MusicChannels } from '~/lib/types'

type MusicPlayerProps = {
	focusMode: boolean
	isMusicPlaying: boolean
	setIsMusicPlaying: (isPlaying: boolean) => void
}

const MusicPlayer = ({
	focusMode,
	isMusicPlaying,
	setIsMusicPlaying,
}: MusicPlayerProps) => {
	const { settings } = useContext<AureliusProviderData>(AureliusContext)

	const [volume, setVolume] = useState(50)

	return (
		<div
			className={`p-4 flex items-center transition-opacity duration-100 hover:opacity-100 ${focusMode ? 'opacity-5' : 'opacity-100'}`}
		>
			<div className='flex items-center h-9 bg-background rounded-lg border border-border'>
				<Popover>
					<PopoverTrigger asChild>
						<Button className='w-9 h-9' size='icon' variant='ghost'>
							{volume === 0 ? (
								<VolumeXIcon className='w-4 h-4' />
							) : volume > 0 && volume <= 50 ? (
								<Volume1Icon className='w-4 h-4' />
							) : (
								<Volume2Icon className='w-4 h-4' />
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-9 h-48 p-0 flex justify-center py-4'>
						<Slider
							max={100}
							min={0}
							onValueChange={(value) => setVolume(value[0])}
							orientation='vertical'
							value={[volume]}
						/>
					</PopoverContent>
				</Popover>
				<Separator orientation='vertical' />
				{isMusicPlaying ? (
					<Button
						className='w-9 h-9'
						onClick={() => setIsMusicPlaying?.(false)}
						size='icon'
						variant='ghost'
					>
						<PauseIcon className='w-4 h-4' />
					</Button>
				) : (
					<Button
						className='w-9 h-9'
						onClick={() => setIsMusicPlaying?.(true)}
						size='icon'
						variant='ghost'
					>
						<PlayIcon className='w-4 h-4' />
					</Button>
				)}
			</div>
			{/*<Suspense fallback={<div>Loading...</div>}>*/}
			{/*	<ReactPlayer*/}
			{/*		playing={isMusicPlaying}*/}
			{/*		// @ts-ignore*/}
			{/*		url={*/}
			{/*			settings?.youtubeLink ||*/}
			{/*			MUSIC_STATIONS[settings?.musicChannel as MusicChannels]*/}
			{/*		}*/}
			{/*		width='0'*/}
			{/*		height='0'*/}
			{/*		loop={true}*/}
			{/*		volume={volume / 100}*/}
			{/*		config={{*/}
			{/*			youtube: {*/}
			{/*				playerVars: {*/}
			{/*					control: 1,*/}
			{/*					start: 1,*/}
			{/*				},*/}
			{/*			},*/}
			{/*		}}*/}
			{/*	/>*/}
			{/*</Suspense>*/}
		</div>
	)
}

export default MusicPlayer
