import * as S from '@effect/schema/Schema'
import type { Evolu } from '@evolu/common'
import { String1000 } from '@evolu/react'
import { GETTING_STARTED_GUIDE } from '~/lib/constants'
import { Content, Int, NonEmptyString100 } from '~/services/evolu/schema'

export const runMigrations = (evolu: Evolu) => {
	// create a getting started guide under _help
	evolu.create('_help', {
		content: S.decodeSync(Content)(GETTING_STARTED_GUIDE.content),
		slug: S.decodeSync(NonEmptyString100)('getting-started'),
		title: S.decodeSync(String1000)(GETTING_STARTED_GUIDE.title),
		wordCount: S.decodeSync(Int)(0),
	})
}
