import { useEvolu, useQuery } from '@evolu/react'
import { SettingsRow, settingsQuery } from '~/services/evolu/client'
import { Database } from '~/services/evolu/database'

const useSettingsQuery = () => {
	const { create, createOrUpdate, update } = useEvolu<Database>()
	const settings = {
		create,
		createOrUpdate,
		read: {
			first: () => {
				const { row } = useQuery(settingsQuery)
				return row as SettingsRow
			},
		},
		update,
	}

	return settings
}

export default useSettingsQuery
