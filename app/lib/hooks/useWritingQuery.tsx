import * as S from '@effect/schema/Schema'
import { useEvolu, useQuery } from '@evolu/react'
import {
	WritingRow,
	writingAllQuery,
	writingByIdQuery,
	writingBySlugQuery,
	writingByWritingEffortQuery,
} from '~/services/evolu/client'
import { Database } from '~/services/evolu/database'
import {
	NonEmptyString100,
	WritingEffortId,
	WritingId,
} from '~/services/evolu/schema'

const useWritingQuery = () => {
	const { create, createOrUpdate, update } = useEvolu<Database>()
	const writing = {
		create,
		createOrUpdate,
		read: {
			all: () => {
				const { rows } = useQuery(writingAllQuery)
				return rows as WritingRow[]
			},
			findById: (id: WritingId) => {
				const { row } = useQuery(writingByIdQuery(id))
				return row as WritingRow
			},
			findBySlug: (slug: string) => {
				const { row } = useQuery(
					writingBySlugQuery(S.decodeSync(NonEmptyString100)(slug))
				)
				return row as WritingRow
			},
			findByWritingEffortId: (id: WritingEffortId) => {
				const { rows } = useQuery(
					writingByWritingEffortQuery({ effortId: id })
				)
				return rows as WritingRow[]
			},
		},
		update,
	}

	return writing
}

export default useWritingQuery
