import * as S from '@effect/schema/Schema'
import type { ExtractRow, Query } from '@evolu/common'
import { type Arls, type TableQueryBuilder, arls } from '~/services/arls'
import type { EffortsTable } from '~/services/evolu/database'
import {
	ContentId,
	type HelpTable,
	NonEmptyString100,
	WritingEffortId,
} from '~/services/evolu/schema'

export const loadEffort = async (effortSlug: string) => {
	const effort = await arls.writingEfforts.findUnique({
		slug: S.decodeSync(NonEmptyString100)(effortSlug),
	})
	if (!effort) throw new Error('Writing effort not found')
	return effort
}

export const loadEffortById = async (id: WritingEffortId) => {
	const effort = await arls.writingEfforts.findUnique({
		id,
	})
	if (!effort) throw new Error('Writing effort not found')
	return effort
}

export const loadWriting = async (
	effortType: keyof Arls,
	slug: string,
	effortId = '',
) => {
	const table = arls[effortType] as TableQueryBuilder<EffortsTable>
	const writing = effortId
		? await table.findUnique({
				effortId: S.decodeSync(WritingEffortId)(effortId),
				slug: S.decodeSync(NonEmptyString100)(slug),
			})
		: await table.findUnique({
				slug: S.decodeSync(NonEmptyString100)(slug),
			})
	if (!writing) throw new Error('Content not found')
	return writing
}

export const loadWritingById = async (
	effortType: keyof Arls,
	effortId: string,
	id: string,
) => {
	const table = arls[effortType] as TableQueryBuilder<EffortsTable>
	const writing = (await table.findUnique({
		effortId: S.decodeSync(WritingEffortId)(effortId),
		// @ts-ignore
		id: S.decodeSync(ContentId)(id),
	})) as ExtractRow<Query<EffortsTable>>
	if (!writing) throw new Error('Content not found')
	return writing
}

export const loadHelpArticles = async (): Promise<{
	writings: ReadonlyArray<ExtractRow<Query<HelpTable>>>
}> => {
	const writings = await arls._help.findMany({})
	return { writings }
}

export const loadWritingsInEffort = async (
	effortSlug: string,
	// { limit = 50, offset = 0 } = {}
): Promise<{
	writings: ReadonlyArray<ExtractRow<Query<EffortsTable>>>
	// total: number
}> => {
	// Load the effort first
	const effort = await arls.writingEfforts.findUnique({
		slug: S.decodeSync(NonEmptyString100)(effortSlug),
	})
	if (!effort) throw new Error('Writing effort not found')

	// Determine which table to query based on the effort type
	const table = arls[
		effort.type as keyof Arls
	] as TableQueryBuilder<EffortsTable>

	// Query for writings
	const writings = await table.findMany(
		{
			where: { effortId: S.decodeSync(WritingEffortId)(effort.id) },
		},
		// { limit, offset }
	)
	const sortedWritings = [...writings].sort(
		(a, b) =>
			new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	)

	// Get total count
	// const total = await table.count({
	// 	effortId: S.decodeSync(WritingEffortId)(effort.id),
	// })

	return { writings: sortedWritings }
}

export const loadWritingSessions = async () => {
	const writingSessions = await arls.writingSessions.findMany({})
	return writingSessions
}
