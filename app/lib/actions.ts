import * as S from '@effect/schema/Schema'
import { String1000 } from '@evolu/common'
import GithubSlugger from 'github-slugger'
import type { EditorData } from '~/lib/types'
import { checkSlugUniqueness } from '~/lib/utils'
import { type Arls, arls } from '~/services/arls'
import {
	Content,
	Int,
	NonEmptyString100,
	type WritingEffortsTable,
} from '~/services/evolu/schema'

const slugger = new GithubSlugger()

type CreateWritingArgs = {
	body: EditorData & { wordCount: number }
	effort: WritingEffortsTable
}

export const createWriting = async ({ body, effort }: CreateWritingArgs) => {
	const { content, title, wordCount } = body
	const writingTitle = title.trim() !== '' ? title : 'Untitled'
	let finalSlug = ''
	let isUnique = false
	do {
		const generatedSlug = slugger.slug(writingTitle)
		const { isUnique: isSlugUnique, slug } = await checkSlugUniqueness({
			effortId: effort.id,
			effortType: effort.type,
			slug: generatedSlug,
		})
		isUnique = isSlugUnique
		finalSlug = slug
	} while (!isUnique)

	const table = arls[effort.type as keyof Arls]
	await table.create({
		content: S.decodeSync(Content)(content),
		effortId: effort.id,
		slug: S.decodeSync(NonEmptyString100)(finalSlug),
		title: S.decodeSync(String1000)(title),
		wordCount: S.decodeSync(Int)(wordCount),
	})

	return { slug: finalSlug }
}
