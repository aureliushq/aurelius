import { database } from '@evolu/common'
import {
	BookId,
	Books,
	BooksTable,
	ChapterId,
	Chapters,
	ChaptersTable,
	EssayId,
	Essays,
	EssaysTable,
	HelpId,
	HelpTable,
	JournalId,
	Journals,
	JournalsTable,
	PostId,
	Posts,
	PostsTable,
	Settings,
	SettingsId,
	SettingsTable,
	WritingEffortId,
	WritingEfforts,
	WritingEffortsTable,
	WritingSessionId,
	WritingSessions,
	WritingSessionsTable,
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

export { Database }
