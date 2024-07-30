import { useCallback, useEffect, useRef, useState } from 'react'

import { LinksFunction, MetaFunction } from '@remix-run/node'
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react'

import * as S from '@effect/schema/Schema'
import { useQuery } from '@evolu/react'
import invariant from 'tiny-invariant'
import Editor from '~/components/common/editor'
import { useAutoSave, useKeyboardShortcuts } from '~/lib/hooks'
import AureliusProvider from '~/lib/providers/aurelius'
import { EditorData, EditorShortcuts } from '~/lib/types'
import { arls } from '~/services/arls'
import { SettingsRow, settingsQuery } from '~/services/evolu/client'
import { NonEmptyString100 } from '~/services/evolu/schema'
import writerStylesheet from '~/writer.css?url'

export const meta: MetaFunction = () => {
	return [{ title: 'Aurelius' }, { name: 'description', content: '' }]
}

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: writerStylesheet },
]

export const clientLoader = async () => {
	// TODO: only load this the first time. after loading set local storage to prevent loading again. check local storage before loading.
	const helpArticle = await arls._help.findUnique({
		slug: S.decodeSync(NonEmptyString100)('getting-started'),
	})
	invariant(helpArticle, 'Help article not found')

	// TODO: once subscribe is implemented in arls use it here
	// const [settings] = await arls.settings.findMany()

	return { writing: { ...helpArticle, wordCount: 0 } }
}

const Index = () => {
	const shortcuts = {
		[EditorShortcuts.FORCE_SAVE]: () => handleForceSave(),
	}

	const fetcher = useFetcher()
	const { writing } = useLoaderData<typeof clientLoader>()
	const navigate = useNavigate()

	useKeyboardShortcuts(shortcuts)

	const { row: settings } = useQuery(settingsQuery)

	const wordCount = useRef<number>(writing?.wordCount ?? 0)
	const effortSlug = useRef<string | null>(null)
	const [isSaving, setIsSaving] = useState<boolean>(false)
	const [isTitleFirstEdit, setIsTitleFirstEdit] = useState<boolean>(true)

	const onAutoSave = useCallback(({ content, title }: EditorData) => {
		setIsSaving(true)

		// don't do anything here since we're not saving the changes in the editor
		// only way to create new content is to go to create page and save it there
		// which happens when resetting the editor
		// code is shown but commented for reference - to show how to save editor content
		// if (effortSlug.current) {
		// 	fetcher.submit(
		// 		{
		// 			content,
		// 			effort: effortSlug.current,
		// 			title,
		// 			wordCount: wordCount.current,
		// 		},
		// 		{ method: 'POST', encType: 'application/json' }
		// 	)
		// }

		setTimeout(() => {
			setIsSaving(false)
		}, 3000)
	}, [])

	const [editorData, setEditorData, forceSave] = useAutoSave({
		initialData: {
			content: writing.content as string,
			title: writing.title as string,
		},
		onAutoSave,
		interval: 10000,
		debounce: 1000,
	})

	const providerData = {
		effort: 'posts',
		settings: settings as SettingsRow,
	}

	const handleContentChange = (content: string) => {
		setEditorData({ content })
	}

	const handleForceSave = () => {
		forceSave()
	}

	const handleTitleBlur = () => {
		if (effortSlug.current) {
			if (editorData.title.trim() !== '') {
				forceSave()
				setIsTitleFirstEdit(false)
			} else {
				setEditorData({ title: editorData.title })
			}
		}
	}

	const handleTitleChange = (title: string) => {
		if (editorData.title.trim() === '') {
			setEditorData({ title }, { ignoreAutoSave: isTitleFirstEdit })
		} else {
			setEditorData({ title })
		}
	}

	const handleWordCountChange = (count: number) => {
		wordCount.current = count
	}

	const onReset = () => {
		effortSlug.current = 'posts'
		navigate(`/editor/${effortSlug.current}`)
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

	useEffect(() => {
		wordCount.current = writing?.wordCount ?? 0
	}, [writing])

	return (
		<AureliusProvider data={providerData}>
			<Editor
				content={editorData.content}
				isSaving={isSaving}
				onReset={onReset}
				onTitleBlur={handleTitleBlur}
				setContent={handleContentChange}
				setTitle={handleTitleChange}
				setWordCount={handleWordCountChange}
				title={editorData.title}
				wordCount={wordCount.current}
			/>
		</AureliusProvider>
	)
}

export default Index
