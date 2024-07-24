import * as S from '@effect/schema/Schema'
import { Number } from '@effect/schema/Schema'
import {
	NonEmptyString1000,
	PositiveInt,
	SqliteBoolean,
	String,
	String1000,
	id,
	table,
} from '@evolu/common'

export const Content = String.pipe(S.minLength(0), S.brand('Content'))

export const Int = S.Number.pipe(S.int(), S.brand('Int'))

export const NonEmptyString100 = String.pipe(
	S.minLength(1),
	S.maxLength(100),
	S.brand('NonEmptyString100')
)
export type NonEmptyString100 = typeof NonEmptyString100.Type

const TemporalString = S.String.pipe(S.brand('TemporalString'))
export const SqliteDateTime = TemporalString.pipe(S.brand('SqliteDateTime'))
export type SqliteDateTime = typeof SqliteDateTime.Type

export const WordCount = Number.pipe(
	S.greaterThanOrEqualTo(0),
	S.brand('WordCount')
)

const SettingsId = id('Settings')
export type SettingsId = typeof SettingsId.Type

export const SettingsTable = table({
	id: SettingsId,
	bodyFont: NonEmptyString100,
	enableMusicPlayer: SqliteBoolean,
	exportImageFooter: String1000,
	exportImageWatermark: SqliteBoolean,
	musicChannel: NonEmptyString100,
	showSplashDialog: S.NullOr(SqliteBoolean),
	titleFont: NonEmptyString100,
	toolbarMode: NonEmptyString100,
	writingDailyGoal: NonEmptyString100,
	writingDailyTarget: S.NullOr(Int),
	youtubeLink: String1000,
})
export type SettingsTable = typeof SettingsTable.Type

export const WritingEffortId = id('WritingEffort')
export type WritingEffortId = typeof WritingEffortId.Type

export const WritingEffortTable = table({
	id: WritingEffortId,
	days: S.NullOr(S.NonEmptyArray(NonEmptyString100)),
	name: NonEmptyString100,
	slug: NonEmptyString100,
	targetWordCount: S.NullOr(PositiveInt),
	time: S.NullOr(SqliteDateTime),
})

export const HelpId = id('HelpArticle')
export type HelpId = typeof HelpId.Type

export const _HelpTable = table({
	id: HelpId,
	content: Content,
	effortId: WritingEffortId,
	slug: NonEmptyString100,
	title: NonEmptyString1000,
	wordCount: Int,
})

export const WritingId = id('Writing')
export type WritingId = typeof WritingId.Type

export const WritingTable = table({
	id: WritingId,
	content: Content,
	effortId: WritingEffortId,
	slug: NonEmptyString100,
	title: NonEmptyString1000,
	wordCount: Int,
})

const WritingSessionId = id('WritingSession')
export type WritingSessionId = typeof WritingSessionId.Type

export const WritingSessionTable = table({
	id: WritingSessionId,
	duration: PositiveInt,
	startingWordCount: WordCount,
	endingWordCount: WordCount,
	// TODO: connect to writing table
})
