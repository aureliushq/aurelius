import { useCallback, useEffect, useRef, useState } from 'react'

import { LinksFunction, MetaFunction } from '@remix-run/node'
import {
	ClientActionFunctionArgs,
	ClientLoaderFunctionArgs,
	useFetcher,
	useLoaderData,
	useNavigate,
} from '@remix-run/react'

import * as S from '@effect/schema/Schema'
import { NonEmptyString1000 } from '@evolu/common'
import GithubSlugger from 'github-slugger'
import invariant from 'tiny-invariant'
import Editor from '~/components/common/editor'
import { useAutoSave } from '~/lib/hooks'
import AureliusProvider from '~/lib/providers/aurelius'
import { EditorData } from '~/lib/types'
import {
	SettingsRow,
	evolu,
	settingsQuery,
	writingByWritingEffortQuery,
	writingEffortBySlugQuery,
} from '~/services/evolu/client'
import { Content, Int, NonEmptyString100 } from '~/services/evolu/schema'
import writerStylesheet from '~/writer.css?url'

const slugger = new GithubSlugger()

const checkSlugUniqueness = async (effortId: string, slug: string) => {
	const { row: writing } = await evolu.loadQuery(
		writingByWritingEffortQuery({ effortId, slug })
	)

	if (!writing) {
		return { isUnique: true, slug }
	} else {
		return { isUnique: false, slug: '' }
	}
}

export const meta: MetaFunction = () => {
	return [{ title: 'Aurelius' }, { name: 'description', content: '' }]
}

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: writerStylesheet },
]

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
	const { row: settings } = await evolu.loadQuery(settingsQuery)
	invariant(params.effort, 'Effort cannot be empty')
	const { row: effort } = await evolu.loadQuery(
		writingEffortBySlugQuery(params.effort)
	)
	invariant(effort, 'Writing effort not found')

	return { effort, settings }
}

export const clientAction = async ({
	params,
	request,
}: ClientActionFunctionArgs) => {
	invariant(params.effort, 'Writing Effort cannot be empty')
	const { row: effort } = await evolu.loadQuery(
		writingEffortBySlugQuery(params.effort)
	)
	invariant(effort, 'Writing effort not found')

	const body: EditorData & { wordCount: number } = await request.json()
	const { content, title, wordCount } = body

	const writingTitle = title.trim() !== '' ? title : 'Untitled'

	let finalSlug = ''
	let isUnique = false
	do {
		const generatedSlug = slugger.slug(writingTitle)
		const { isUnique: isSlugUnique, slug } = await checkSlugUniqueness(
			effort.id,
			generatedSlug
		)
		isUnique = isSlugUnique
		finalSlug = slug
	} while (!isUnique)

	// TODO: generalize this since I'm going to create different tables for different efforts
	evolu.create('writing', {
		content: S.decodeSync(Content)(content),
		effortId: effort.id,
		slug: S.decodeSync(NonEmptyString100)(finalSlug),
		title: S.decodeSync(NonEmptyString1000)(writingTitle),
		wordCount: S.decodeSync(Int)(wordCount),
	})

	return { message: 'ok', redirectTo: `/editor/${effort.slug}/${finalSlug}` }
}

const NewWriting = () => {
	const fetcher = useFetcher()
	const { settings } = useLoaderData<typeof clientLoader>()

	const navigate = useNavigate()

	const wordCount = useRef<number>(0)

	const [isSaving, setIsSaving] = useState<boolean>(false)
	const [isTitleFirstEdit, setIsTitleFirstEdit] = useState<boolean>(true)

	const onAutoSave = useCallback(({ content, title }: EditorData) => {
		setIsSaving(true)

		fetcher.submit(
			{ content, title, wordCount: wordCount.current },
			{ method: 'POST', encType: 'application/json' }
		)

		setTimeout(() => {
			setIsSaving(false)
		}, 3000)
	}, [])

	const [editorData, setEditorData, forceSave] = useAutoSave({
		initialData: { content: '', title: '' },
		onAutoSave,
		interval: 10000,
		debounce: 3000,
	})

	const providerData = {
		settings: settings as SettingsRow,
	}

	const handleTitleChange = (title: string) => {
		setEditorData({ title }, { ignoreAutoSave: isTitleFirstEdit })
	}

	const handleTitleBlur = () => {
		if (editorData.title.trim() !== '') {
			forceSave()
			setIsTitleFirstEdit(false)
		} else {
			setEditorData({ title: editorData.title })
		}
	}

	const handleContentChange = (content: string) => {
		setEditorData({ content })
	}

	const handleWordCountChange = (count: number) => {
		wordCount.current = count
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
		<AureliusProvider data={providerData}>
			<Editor
				content={editorData.content}
				isSaving={isSaving}
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

export default NewWriting
