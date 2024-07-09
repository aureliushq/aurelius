import { database } from '@evolu/common'
import { SettingsTable } from '~/services/evolu/schema'

const Database = database({
	settings: SettingsTable,
})
type Database = typeof Database.Type

export { Database }
