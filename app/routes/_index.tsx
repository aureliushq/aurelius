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
import { checkSlugUniqueness } from '~/lib/utils'
import {
	SettingsRow,
	evolu,
	helpArticleBySlugQuery,
	settingsQuery,
	writingEffortBySlugQuery,
} from '~/services/evolu/client'
import { Content, Int, NonEmptyString100 } from '~/services/evolu/schema'
import writerStylesheet from '~/writer.css?url'

const slugger = new GithubSlugger()

export const meta: MetaFunction = () => {
	return [{ title: 'Aurelius' }, { name: 'description', content: '' }]
}

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: writerStylesheet },
]

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
	// TODO: only load this the first time. after loading set local storage to prevent loading again. check local storage before loading.
	const { row: effort } = await evolu.loadQuery(
		writingEffortBySlugQuery('help')
	)
	const { row: helpArticle } = await evolu.loadQuery(
		helpArticleBySlugQuery(params.slug || 'getting-started')
	)
	invariant(helpArticle, 'Help article not found')
	const { row: settings } = await evolu.loadQuery(settingsQuery)

	return { effort, writing: helpArticle, settings }
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
	const body: EditorData & { effort: string; wordCount: number } =
		await request.json()
	const { content, effort: effortSlug, title, wordCount } = body

	if (effortSlug === 'help') {
		return {}
	}

	const { row: effort } = await evolu.loadQuery(
		writingEffortBySlugQuery('post')
	)
	invariant(effort, 'Writing effort not found')

	// TODO: Abstract this to a function
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

const Index = () => {
	const fetcher = useFetcher()
	const data = useLoaderData<typeof clientLoader>()
	const navigate = useNavigate()

	const wordCount = useRef<number>(data?.writing?.wordCount ?? 0)
	const effortSlug = useRef<string>(data?.effort?.slug as string)

	const [isSaving, setIsSaving] = useState<boolean>(false)
	const [isTitleFirstEdit, setIsTitleFirstEdit] = useState<boolean>(true)

	const onAutoSave = useCallback(({ content, title }: EditorData) => {
		setIsSaving(true)

		fetcher.submit(
			{
				content,
				effort: effortSlug.current,
				title,
				wordCount: wordCount.current,
			},
			{ method: 'POST', encType: 'application/json' }
		)

		setTimeout(() => {
			setIsSaving(false)
		}, 3000)
	}, [])

	const [editorData, setEditorData, forceSave] = useAutoSave({
		initialData: {
			content: data?.writing.content as string,
			title: data?.writing.title as string,
		},
		onAutoSave,
		interval: 10000,
		debounce: 1000,
	})

	const providerData = {
		effort: 'post',
		settings: data?.settings as SettingsRow,
	}

	const handleTitleBlur = () => {
		if (editorData.title.trim() !== '') {
			forceSave()
			setIsTitleFirstEdit(false)
		} else {
			setEditorData({ title: editorData.title })
		}
	}

	const handleTitleChange = (title: string) => {
		if (editorData.title.trim() === '') {
			setEditorData({ title }, { ignoreAutoSave: isTitleFirstEdit })
		} else {
			setEditorData({ title })
		}
	}

	const handleContentChange = (content: string) => {
		setEditorData({ content })
	}

	const handleWordCountChange = (count: number) => {
		wordCount.current = count
	}

	const onReset = () => {
		effortSlug.current = 'post'
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
		wordCount.current = data?.writing?.wordCount ?? 0
	}, [data?.writing])

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
