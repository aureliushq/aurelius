import {
	EditorSansSerifFonts,
	EditorSerifFonts,
	EditorToolbarMode,
	MusicChannels,
	SiteTheme,
	WritingDailyGoalType,
} from '~/lib/types'

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

export const SERIF_FONTS = [
	{ value: EditorSerifFonts.LIBRE_BASKERVILLE, label: 'Libre Baskerville' },
	{ value: EditorSerifFonts.MERRIWEATHER, label: 'Merriweather' },
	{ value: EditorSerifFonts.NOTO_SERIF, label: 'Noto Serif' },
	{ value: EditorSerifFonts.PT_SERIF, label: 'PT Serif' },
]

export const SANS_SERIF_FONTS = [
	{ value: EditorSansSerifFonts.INTER, label: 'Inter' },
	{ value: EditorSansSerifFonts.LATO, label: 'Lato' },
	{ value: EditorSansSerifFonts.OPEN_SANS, label: 'Open Sans' },
	{ value: EditorSansSerifFonts.ROBOTO, label: 'Roboto' },
]

export const ALL_FONTS = [...SERIF_FONTS, ...SANS_SERIF_FONTS].sort((a, b) => {
	if (a.label < b.label) return -1
	if (a.label > b.label) return 1
	return 0
})

export const SITE_THEMES = [
	{ value: SiteTheme.LIGHT, label: 'Light' },
	{ value: SiteTheme.DARK, label: 'Dark' },
	{ value: SiteTheme.SYSTEM, label: 'System' },
]
