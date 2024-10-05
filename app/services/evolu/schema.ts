import * as S from '@effect/schema/Schema'
import {
	String as NonEmptyString,
	NonEmptyString1000,
	PositiveInt,
	SqliteBoolean,
	String1000,
	id,
	table,
} from '@evolu/common'

// custom column types
export const Content = NonEmptyString.pipe(S.minLength(0), S.brand('Content'))
export enum WritingEffortType {
	BOOKS = 'books',
	ESSAYS = 'essays',
	JOURNALS = 'journals',
	POSTS = 'posts',
}
export const EffortType = S.Enums(WritingEffortType)
export const Int = S.Number.pipe(S.int(), S.brand('Int'))
export const NonEmptyString100 = NonEmptyString.pipe(
	S.minLength(1),
	S.maxLength(100),
	S.brand('NonEmptyString100'),
)
export type NonEmptyString100 = typeof NonEmptyString100.Type
const TemporalString = S.String.pipe(S.brand('TemporalString'))
export const SqliteDateTime = TemporalString.pipe(S.brand('SqliteDateTime'))
export type SqliteDateTime = typeof SqliteDateTime.Type
export const WordCount = S.Number.pipe(
	S.greaterThanOrEqualTo(0),
	S.brand('WordCount'),
)

// IDs
export const BookId = id('Books')
export type BookId = typeof BookId.Type

export const ChapterId = id('Chapters')
export type ChapterId = typeof ChapterId.Type

export const EssayId = id('Essays')
export type EssayId = typeof EssayId.Type

export const HelpId = id('HelpArticles')
export type HelpId = typeof HelpId.Type

export const JournalId = id('Journals')
export type JournalId = typeof JournalId.Type

export const PostId = id('Posts')
export type PostId = typeof PostId.Type

export const ContentId = ChapterId || EssayId || JournalId || PostId
export type ContentId = typeof ContentId.Type

const SettingsId = id('Settings')
export type SettingsId = typeof SettingsId.Type

export const WritingEffortId = id('WritingEfforts')
export type WritingEffortId = typeof WritingEffortId.Type

const WritingSessionId = id('WritingSessions')
export type WritingSessionId = typeof WritingSessionId.Type

// non-syncing tables
export const _Help = table({
	id: HelpId,
	content: Content,
	slug: NonEmptyString100,
	title: String1000,
	wordCount: Int,
})
export type HelpTable = typeof _Help.Type

// syncing tables
export const Books = table({
	id: BookId,
	author: S.NullOr(NonEmptyString1000),
	effortId: WritingEffortId,
	slug: NonEmptyString100,
	title: String1000,
	type: EffortType,
	wordCount: Int,
})
export type BooksTable = typeof Books.Type

export const Chapters = table({
	id: ChapterId,
	bookId: BookId,
	content: Content,
	slug: NonEmptyString100,
	title: String1000,
	wordCount: Int,
})
export type ChaptersTable = typeof Chapters.Type

export const Essays = table({
	id: EssayId,
	author: S.NullOr(NonEmptyString1000),
	content: Content,
	effortId: WritingEffortId,
	slug: NonEmptyString100,
	title: String1000,
	type: EffortType,
	wordCount: Int,
})
export type EssaysTable = typeof Essays.Type

export const Journals = table({
	id: JournalId,
	author: S.NullOr(NonEmptyString1000),
	content: Content,
	effortId: WritingEffortId,
	slug: NonEmptyString100,
	title: String1000,
	type: EffortType,
	wordCount: Int,
})
export type JournalsTable = typeof Journals.Type

export const Posts = table({
	id: PostId,
	author: S.NullOr(NonEmptyString1000),
	content: Content,
	effortId: WritingEffortId,
	slug: NonEmptyString100,
	title: String1000,
	type: EffortType,
	wordCount: Int,
})
export type PostsTable = typeof Posts.Type

export const Settings = table({
	id: SettingsId,
	bodyFont: NonEmptyString100,
	enableMusicPlayer: SqliteBoolean,
	exportImageFooter: String1000,
	exportImageWatermark: SqliteBoolean,
	musicChannel: NonEmptyString100,
	showSplashDialog: S.NullOr(SqliteBoolean),
	titleFont: NonEmptyString100,
	toolbarMode: NonEmptyString100,
	userName: String1000,
	writingDailyGoal: NonEmptyString100,
	writingDailyTarget: S.NullOr(Int),
	youtubeLink: String1000,
})
export type SettingsTable = typeof Settings.Type

export const WritingEfforts = table({
	id: WritingEffortId,
	days: S.NullOr(S.NonEmptyArray(NonEmptyString100)),
	description: S.NullOr(String1000),
	name: NonEmptyString100,
	slug: NonEmptyString100,
	targetWordCount: S.NullOr(PositiveInt),
	time: S.NullOr(SqliteDateTime),
	type: EffortType,
})
export type WritingEffortsTable = typeof WritingEfforts.Type

export const WritingSessions = table({
	id: WritingSessionId,
	contentId: S.NullOr(ContentId),
	duration: PositiveInt,
	effortId: WritingEffortId,
	endingWordCount: WordCount,
	startingWordCount: WordCount,
})
export type WritingSessionsTable = typeof WritingSessions.Type
