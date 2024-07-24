import { database } from '@evolu/common'
import {
	PostTable,
	SettingsTable,
	WritingEffortTable,
	WritingSessionTable,
	WritingTable,
	_HelpTable,
} from '~/services/evolu/schema'

const FIELDS = {
	_help: _HelpTable,
	post: PostTable,
	settings: SettingsTable,
	writing: WritingTable,
	writingEffort: WritingEffortTable,
	writingSession: WritingSessionTable,
}

const Database = database(FIELDS)
export type Database = typeof Database.Type
export type TableName = keyof Database

export { Database }
