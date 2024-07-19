import * as S from '@effect/schema/Schema'
import { useEvolu, useQuery } from '@evolu/react'
import {
	HelpArticleRow,
	helpArticleAllQuery,
	helpArticleBySlugQuery,
} from '~/services/evolu/client'
import { Database } from '~/services/evolu/database'
import { NonEmptyString100 } from '~/services/evolu/schema'

const useWritingQuery = () => {
	const { create, createOrUpdate, update } = useEvolu<Database>()
	const writing = {
		create,
		createOrUpdate,
		read: {
			all: () => {
				const { rows } = useQuery(helpArticleAllQuery)
				return rows as HelpArticleRow[]
			},
			// findById: (id: WritingId) => {
			// 	const { row } = useQuery(writingByIdQuery(id))
			// 	return row as WritingRow
			// },
			findBySlug: (slug: string) => {
				const { row } = useQuery(
					helpArticleBySlugQuery(
						S.decodeSync(NonEmptyString100)(slug)
					)
				)
				return row as HelpArticleRow
			},
			// findByWritingEffortId: (id: WritingEffortId) => {
			// 	const { rows } = useQuery(writingByWritingEffortIdQuery(id))
			// 	return rows as WritingRow[]
			// },
		},
		update,
	}

	return writing
}

export default useWritingQuery
