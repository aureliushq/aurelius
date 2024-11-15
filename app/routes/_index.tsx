import {
	Suspense,
	lazy,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'

import { useLoaderData, useNavigate } from '@remix-run/react'

import SuspenseFallback from '~/components/common/suspense-fallback'
import SyncFallback from '~/components/common/sync-fallback'
import { IS_RESTORING_KEY, ROUTES } from '~/lib/constants'
import { useFirstVisit } from '~/lib/hooks'
import { loadHelpArticleBySlug } from '~/lib/loaders'
import {
	type AureliusProviderData,
	AureliusContext,
} from '~/lib/providers/aurelius'
import { StartPage } from '~/lib/types'

const Editor = lazy(() => import('~/components/common/editor'))

export const clientLoader = async () => {
	// TODO: only load this the first time. after loading set local storage to prevent loading again. check local storage before loading.
	const helpArticle = await loadHelpArticleBySlug('getting-started')
	if (!helpArticle) {
		return { writing: null }
	}

	return { writing: helpArticle }
}

const Index = () => {
	const { settings } = useContext<AureliusProviderData>(AureliusContext)
	const shouldRedirect = useFirstVisit()
	const { writing } = useLoaderData<typeof clientLoader>()
	const navigate = useNavigate()
	const [isSaving, setIsSaving] = useState<boolean>(false)

	const isRestoring = localStorage.getItem(IS_RESTORING_KEY)

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
		navigate(ROUTES.EDITOR.POST)
	}

	useEffect(() => {
		if (shouldRedirect) {
			switch (settings.startPage) {
				case StartPage.VIEW_ALL_POSTS:
					navigate(ROUTES.VIEW.POSTS, { replace: true })
					break
				case StartPage.NEW_POST:
					navigate(ROUTES.EDITOR.POST, { replace: true })
					break
			}
		}
	}, [settings.startPage, shouldRedirect, navigate])

	if (shouldRedirect) {
		return null // Will be redirected by the useEffect
	}

	if (isRestoring === 'true' && !writing) {
		return <SyncFallback />
	}

	return (
		<Suspense fallback={<SuspenseFallback />}>
			<Editor
				data={{
					content: writing?.content as string,
					title: writing?.title as string,
					wordCount: 0,
				}}
				isSaving={isSaving}
				onAutoSave={onAutoSave}
				onReset={onReset}
				saveOnTitleBlur={false}
			/>
		</Suspense>
	)
}

export default Index
