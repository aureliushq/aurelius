import { database } from '@evolu/common'
import {
	PostTable,
	SettingsTable,
	WritingEffortTable,
	WritingSessionTable,
	WritingTable,
	_HelpTable,
} from '~/services/evolu/schema'

const Database = database({
	_help: _HelpTable,
	post: PostTable,
	settings: SettingsTable,
	writing: WritingTable,
	writingEffort: WritingEffortTable,
	writingSession: WritingSessionTable,
})
type Database = typeof Database.Type

export { Database }
