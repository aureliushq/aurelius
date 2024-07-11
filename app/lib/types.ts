export type HelpDialogProps = {
	helpOpen?: boolean
	setHelpOpen: (open: boolean) => void
}

export type PreferencesDialogProps = {
	preferencesOpen?: boolean
	setPreferencesOpen: (open: boolean) => void
}

export enum EditorToolbarMode {
	FIXED = 'FIXED',
	FLOATING = 'FLOATING',
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
