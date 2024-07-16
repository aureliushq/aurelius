import * as S from '@effect/schema/Schema'
import { useEvolu, useQuery } from '@evolu/react'
import {
	WritingEffortRow,
	writingEffortAllQuery,
	writingEffortByIdQuery,
	writingEffortBySlugQuery,
} from '~/services/evolu/client'
import { Database } from '~/services/evolu/database'
import { NonEmptyString100, WritingEffortId } from '~/services/evolu/schema'

const useWritingEffortQuery = () => {
	const { create, createOrUpdate, update } = useEvolu<Database>()
	const writingEffort = {
		create,
		createOrUpdate,
		read: {
			all: () => {
				const { rows } = useQuery(writingEffortAllQuery)
				return rows as WritingEffortRow[]
			},
			findById: (id: WritingEffortId) => {
				const { row } = useQuery(writingEffortByIdQuery(id))
				return row as WritingEffortRow
			},
			findBySlug: (slug: string) => {
				const { row } = useQuery(
					writingEffortBySlugQuery(
						S.decodeSync(NonEmptyString100)(slug)
					)
				)
				return row as WritingEffortRow
			},
		},
		update,
	}

	return writingEffort
}

export default useWritingEffortQuery
