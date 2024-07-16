import { database } from '@evolu/common'
import {
	PostTable,
	SettingsTable,
	WritingEffortTable,
	WritingSessionTable,
	WritingTable,
} from '~/services/evolu/schema'

const Database = database({
	post: PostTable,
	settings: SettingsTable,
	writing: WritingTable,
	writingEffort: WritingEffortTable,
	writingSession: WritingSessionTable,
})
type Database = typeof Database.Type

export { Database }
