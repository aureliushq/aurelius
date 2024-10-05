import * as S from '@effect/schema/Schema'
import { type Arls, arls } from '~/services/arls'
import { NonEmptyString100, WritingEffortId } from '~/services/evolu/schema'

export const loadEffort = async (effortSlug: string) => {
	const effort = await arls.writingEfforts.findUnique({
		slug: S.decodeSync(NonEmptyString100)(effortSlug),
	})
	if (!effort) throw new Error('Writing effort not found')
	return effort
}

export const loadWriting = async (
	effortType: keyof Arls,
	effortId: string,
	slug: string,
) => {
	const table = arls[effortType]
	const writing = await table.findUnique({
		effortId: S.decodeSync(WritingEffortId)(effortId),
		slug: S.decodeSync(NonEmptyString100)(slug),
	})
	if (!writing) throw new Error('Content not found')
	return writing
}
