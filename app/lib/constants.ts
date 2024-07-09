import {
	EditorToolbarMode,
	MusicChannels,
	WritingDailyGoalType,
} from '~/lib/types'

export const SHORTCUTS = {
	HELP: '?',
	NEW_POST: 'Alt+N',
	NEW_WRITING_SESSION: 'Alt+W',
	EXPORT_AS_IMAGE: 'Alt+I',
	EXPORT_AS_MARKDOWN: 'Alt+D',
	FOCUS_MODE: 'Alt+M',
	RESET_EDITOR: 'Alt+R',
	PREFERENCES: 'Alt+P',
}

export const CHANNELS = [
	{ value: MusicChannels.LOFI_HIP_HOP, label: 'LoFi Hip Hop' },
	{ value: MusicChannels.CHILL_SYNTH, label: 'Chill Synth' },
	{ value: MusicChannels.CHILLSTEP, label: 'Chillstep' },
	{ value: MusicChannels.POST_ROCK, label: 'Post Rock' },
]

export const DAILY_GOAL_TYPE = [
	{ value: WritingDailyGoalType.DURATION, label: 'Duration' },
	{ value: WritingDailyGoalType.WORD_COUNT, label: 'Word Count' },
]

export const TOOLBAR_MODES = [
	{ value: EditorToolbarMode.FIXED, label: 'Fixed' },
	{ value: EditorToolbarMode.FLOATING, label: 'Floating' },
]
