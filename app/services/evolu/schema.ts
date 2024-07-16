import * as S from '@effect/schema/Schema'
import {
	NonEmptyString1000,
	PositiveInt,
	SqliteBoolean,
	SqliteDate,
	String,
	String1000,
	id,
	table,
} from '@evolu/common'

export const Content = String.pipe(S.minLength(1), S.brand('Content'))

export const NonEmptyString100 = String.pipe(
	S.minLength(1),
	S.maxLength(100),
	S.brand('NonEmptyString100')
)
export type NonEmptyString100 = typeof NonEmptyString100.Type

const TemporalString = S.String.pipe(S.brand('TemporalString'))

export const SqliteDateTime = TemporalString.pipe(S.brand('SqliteDateTime'))
export type SqliteDateTime = typeof SqliteDateTime.Type

const SettingsId = id('Settings')
export type SettingsId = typeof SettingsId.Type

export const SettingsTable = table({
	id: SettingsId,
	bodyFont: NonEmptyString100,
	exportImageFooter: String1000,
	exportImageWatermark: SqliteBoolean,
	musicChannel: NonEmptyString100,
	showSplashDialog: S.NullOr(SqliteBoolean),
	theme: NonEmptyString100,
	titleFont: NonEmptyString100,
	toolbarMode: NonEmptyString100,
	writingDailyGoal: NonEmptyString100,
	writingDailyTarget: S.NullOr(PositiveInt),
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

const PostId = id('Post')
export type PostId = typeof PostId.Type

export const PostTable = table({
	id: PostId,
	content: Content,
	slug: NonEmptyString100,
	title: NonEmptyString1000,
	wordCount: PositiveInt,
	writingEffortId: WritingEffortId,
})

export const WritingId = id('Writing')
export type WritingId = typeof WritingId.Type

export const WritingTable = table({
	id: WritingId,
	content: Content,
	slug: NonEmptyString100,
	title: NonEmptyString1000,
	wordCount: S.NullOr(PositiveInt),
	writingEffortId: WritingEffortId,
})

const WritingSessionId = id('WritingSession')
export type WritingSessionId = typeof WritingSessionId.Type

export const WritingSessionTable = table({
	id: WritingSessionId,
	duration: PositiveInt,
	startingWordCount: PositiveInt,
	endingWordCount: PositiveInt,
	writingEffortId: WritingEffortId,
})
