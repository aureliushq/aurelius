import { database } from '@evolu/common'
import {
	type BookId,
	Books,
	type BooksTable,
	type ChapterId,
	Chapters,
	type ChaptersTable,
	type EssayId,
	Essays,
	type EssaysTable,
	type HelpId,
	type HelpTable,
	type JournalId,
	Journals,
	type JournalsTable,
	type PostId,
	Posts,
	type PostsTable,
	Settings,
	type SettingsId,
	type SettingsTable,
	type WritingEffortId,
	WritingEfforts,
	type WritingEffortsTable,
	type WritingSessionId,
	WritingSessions,
	type WritingSessionsTable,
	_Help,
} from '~/services/evolu/schema'

const FIELDS = {
	_help: _Help,
	books: Books,
	chapters: Chapters,
	essays: Essays,
	journals: Journals,
	posts: Posts,
	settings: Settings,
	writingEfforts: WritingEfforts,
	writingSessions: WritingSessions,
}

const Database = database(FIELDS)
export type Database = typeof Database.Type
export type TableName = keyof Database
export type Table =
	| BooksTable
	| ChaptersTable
	| EssaysTable
	| JournalsTable
	| PostsTable
	| SettingsTable
	| WritingEffortsTable
	| WritingSessionsTable
	| HelpTable
// while books is also an effort I'm not including it here because books don't have content directly associated with them
// instead they have chapters which have content
// while chapters have content they are not considered efforts directly
export type EffortsTable = EssaysTable | JournalsTable | PostsTable
export type Id =
	| BookId
	| ChapterId
	| EssayId
	| HelpId
	| JournalId
	| PostId
	| SettingsId
	| WritingEffortId
	| WritingSessionId

// biome-ignore lint: it's fine
export { Database }
