import type { SqliteQueryOptions } from '@evolu/common'
import { content } from '~/components/common/getting-started'
import {
	EditorSansSerifFonts,
	EditorSerifFonts,
	EditorToolbarMode,
	MusicChannels,
	type ShortcutConfig,
	SiteTheme,
	WritingDailyGoalType,
} from '~/lib/types'

export const CHANNELS = [
	{ value: MusicChannels.LOFI_HIP_HOP, label: 'LoFi Hip Hop' },
	{ value: MusicChannels.CHILL_SYNTH, label: 'Chill Synth' },
	{ value: MusicChannels.CHILLSTEP, label: 'Chillstep' },
	{ value: MusicChannels.POST_ROCK, label: 'Post Rock' },
]

export const MUSIC_STATIONS = {
	[MusicChannels.LOFI_HIP_HOP]: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
	[MusicChannels.CHILL_SYNTH]: 'https://www.youtube.com/watch?v=4xDzrJKXOOY',
	[MusicChannels.CHILLSTEP]: 'https://www.youtube.com/watch?v=5yx6BWlEVcY',
	[MusicChannels.POST_ROCK]: 'https://www.youtube.com/watch?v=MRhplCpkPKE',
}

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

export const GENERAL_SHORTCUTS: ShortcutConfig[] = [
	{
		description: 'Fullscreen',
		key: 'F11',
		modifiers: {},
	},
]

export const FORMATTING_SHORTCUTS: ShortcutConfig[] = [
	{
		key: 'b',
		modifiers: { ctrl: true },
		description: 'Bold',
	},
	{
		key: 'i',
		modifiers: { ctrl: true },
		description: 'Italicize',
	},
	{
		key: 'u',
		modifiers: { ctrl: true },
		description: 'Underline',
	},
	{
		key: 'h',
		modifiers: { ctrl: true, shift: true },
		description: 'Highlight',
	},
	{
		key: 'c',
		modifiers: { ctrl: true, alt: true },
		description: 'Code Block',
	},
	{
		key: 'b',
		modifiers: { ctrl: true, shift: true },
		description: 'Blockquote',
	},
]

export const MARKDOWN_SHORTCUTS: ShortcutConfig[] = [
	{
		description: 'Heading 2',
		key: '##',
		modifiers: {},
	},
	{
		description: 'Heading 3',
		key: '###',
		modifiers: {},
	},
	{
		description: 'Heading 4',
		key: '####',
		modifiers: {},
	},
	{
		description: 'Bulleted List',
		key: '-',
		modifiers: {},
	},
	{
		description: 'Numbered List',
		key: '1.',
		modifiers: {},
	},
	{
		description: 'Bold',
		key: '**text**',
		modifiers: {},
	},
	{
		description: 'Italics',
		key: '*text*',
		modifiers: {},
	},
	{
		description: 'Strikethrough',
		key: '~text~',
		modifiers: {},
	},
	{
		description: 'Highlight',
		key: '==text==',
		modifiers: {},
	},
	{
		description: 'Hyperlink',
		key: '[text](url)',
		modifiers: {},
	},
	{
		description: 'Inline Code',
		key: '`text`',
		modifiers: {},
	},
	{
		description: 'Code Block',
		key: '```',
		modifiers: {},
	},
	{
		description: 'Blockquote',
		key: '>',
		modifiers: {},
	},
	{
		description: 'Divider',
		key: '---',
		modifiers: {},
	},
]

export const GETTING_STARTED_GUIDE = {
	title: 'Getting started with Aurelius',
	content: content,
}

export const ARLS_OPTIONS: SqliteQueryOptions = {
	logExplainQueryPlan: true,
	logQueryExecutionTime: true,
}

export const ROUTES = {
	ABOUT: '/about',
	BASE: '/',
	EDITOR: {
		BASE: '/editor',
		POST: '/editor/posts',
	},
	PRIVACY: '/privacy',
	VIEW: {
		POSTS: '/posts',
		WRITING_SESSIONS: '/sessions',
	},
}

export const IS_RESTORING_KEY = 'aurelius:isRestoring'
export const FIRST_TIME_LOADED_KEY = 'aurelius:firstTimeLoaded'
