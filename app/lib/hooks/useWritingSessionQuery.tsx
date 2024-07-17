import { useEvolu, useQuery } from '@evolu/react'
import {
	WritingSessionRow,
	writingSessionAllQuery,
} from '~/services/evolu/client'
import { Database } from '~/services/evolu/database'

const useWritingSessionQuery = () => {
	const { create, createOrUpdate, update } = useEvolu<Database>()
	const writingSession = {
		create,
		createOrUpdate,
		read: {
			all: () => {
				const { rows } = useQuery(writingSessionAllQuery)
				return rows as WritingSessionRow[]
			},
			// TODO: implement more read queries
		},
		update,
	}

	return writingSession
}

export default useWritingSessionQuery
