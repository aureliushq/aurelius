import { useEffect, useState } from 'react'

import GithubSlugger from 'github-slugger'
import { evolu, writingByWritingEffortQuery } from '~/services/evolu/client'

export function useUniqueSlug({
	effortId,
	title,
}: {
	effortId: string
	title: string
}) {
	const [slug, setSlug] = useState('')

	useEffect(() => {
		const slugger = new GithubSlugger()

		// Generate the initial slug
		let newSlug = slugger.slug(title)
		let isUnique = !slugExists({ effortId, slug: newSlug })

		do {
			newSlug = slugger.slug(title)
			isUnique = !slugExists({ effortId, slug: newSlug })
		} while (!isUnique)

		setSlug(newSlug)
	}, [title])

	return slug
}

const slugExists = async ({
	effortId,
	slug,
}: {
	effortId: string
	slug: string
}): Promise<boolean> => {
	const { row: writing } = await evolu.loadQuery(
		writingByWritingEffortQuery({
			effortId,
			slug,
		})
	)

	if (writing) {
		return true
	}

	return false
}
