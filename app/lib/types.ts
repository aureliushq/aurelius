export type HelpDialogProps = {
	helpOpen?: boolean
	setHelpOpen: (open: boolean) => void
}

export type PreferencesDialogProps = {
	preferencesOpen?: boolean
	setPreferencesOpen: (open: boolean) => void
}

export type WritingSessionDialogProps = {
	writingSessionOpen?: boolean
	setWritingSessionOpen: (open: boolean) => void
}

export enum EditorToolbarMode {
	FIXED = 'FIXED',
	FLOATING = 'FLOATING',
}

export enum EditorSerifFonts {
	LIBRE_BASKERVILLE = 'font-libre-baskerville',
	MERRIWEATHER = 'font-merriweather',
	NOTO_SERIF = 'font-noto-serif',
	PT_SERIF = 'font-pt-serif',
}

export enum EditorSansSerifFonts {
	INTER = 'font-inter',
	LATO = 'font-lato',
	OPEN_SANS = 'font-open-sans',
	ROBOTO = 'font-roboto',
}

export enum SiteTheme {
	LIGHT = 'light',
	DARK = 'dark',
	SYSTEM = 'system',
}

export enum WritingDailyGoalType {
	DURATION = 'DURATION',
	WORD_COUNT = 'WORD_COUNT',
}

export enum MusicChannels {
	LOFI_HIP_HOP = 'LOFI_HIP_HOP',
	CHILL_SYNTH = 'CHILL_SYNTH',
	CHILLSTEP = 'CHILLSTEP',
	POST_ROCK = 'POST_ROCK',
}

export type WritingSessionSettings = {
	targetDuration: number
	focusMode: boolean
	music: boolean
	notifyOnTargetDuration: boolean
}

export enum EditorShortcuts {
	BLUR = 'blur',
	FOCUS_MODE = 'focusMode',
	HELP = 'help',
	MAIN_MENU = 'mainMenu',
	PREFERENCES = 'preferences',
	RESET_EDITOR = 'resetEditor',
	SPLASH_DIALOG = 'splashDialog',
	WRITING_SESSION = 'writingSession',
}

export enum EditorMarks {
	BOLD = 'bold',
	ITALIC = 'italic',
	UNDERLINE = 'underline',
	LINK = 'link',
	HIGHLIGHT = 'highlight',
}

export enum EditorHeadings {
	NORMAL = 'normal',
	H2 = 'h2',
	H3 = 'h3',
	H4 = 'h4',
}

export enum EditorNodes {
	CODE = 'codeBlock',
	QUOTE = 'blockquote',
}

export type ModifierKeys = {
	ctrl?: boolean
	alt?: boolean
	shift?: boolean
	meta?: boolean
}

export type ShortcutConfig = {
	description: string
	global?: boolean
	key: string
	modifiers: ModifierKeys
	runInInput?: boolean
}

export type ShortcutAction = () => void

export type AllShortcuts = {
	[key: string]: ShortcutConfig
}

export type ShortcutActions = {
	[key: string]: ShortcutAction
}
