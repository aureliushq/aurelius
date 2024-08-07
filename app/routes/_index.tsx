import { useCallback, useEffect, useState } from 'react'

import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react'

import * as S from '@effect/schema/Schema'
import invariant from 'tiny-invariant'
import Editor from '~/components/common/editor'
import { arls } from '~/services/arls'
import { NonEmptyString100 } from '~/services/evolu/schema'

export const clientLoader = async () => {
	// TODO: only load this the first time. after loading set local storage to prevent loading again. check local storage before loading.
	const helpArticle = await arls._help.findUnique({
		slug: S.decodeSync(NonEmptyString100)('getting-started'),
	})
	invariant(helpArticle, 'Help article not found')

	return { writing: helpArticle }
}

const Index = () => {
	const fetcher = useFetcher()
	const { writing } = useLoaderData<typeof clientLoader>()
	const navigate = useNavigate()

	const [isSaving, setIsSaving] = useState<boolean>(false)

	const onAutoSave = useCallback(() => {
		// setIsSaving(true)
		//
		// don't do anything here since we're not saving the changes in the editor
		// only way to create new content is to go to create page and save it there
		// which happens when resetting the editor
		// code is shown but commented for reference - to show how to save editor content
		//
		// setTimeout(() => {
		// 	setIsSaving(false)
		// }, 3000)
	}, [])

	const onReset = () => {
		navigate(`/editor/posts`)
	}

	useEffect(() => {
		if (
			fetcher.state === 'idle' &&
			fetcher.data &&
			// @ts-expect-error: BS error. It's there. Check how to type fetcher.data.
			fetcher.data.message === 'ok' &&
			// @ts-expect-error: BS error. It's there. Check how to type fetcher.data.
			fetcher.data.redirectTo.trim() !== ''
		) {
			// @ts-expect-error: BS error. It's there. Check how to type fetcher.data.
			navigate(fetcher.data.redirectTo)
		}
	}, [fetcher])

	return (
		<Editor
			data={{
				content: writing.content as string,
				title: writing.title as string,
				wordCount: 0,
			}}
			isSaving={isSaving}
			onAutoSave={onAutoSave}
			onReset={onReset}
			saveOnTitleBlur={false}
		/>
	)
}

export default Index
