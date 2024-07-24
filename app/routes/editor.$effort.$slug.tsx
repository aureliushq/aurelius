import { useCallback, useEffect, useRef, useState } from 'react'

import { LinksFunction, MetaFunction } from '@remix-run/node'
import {
	ClientActionFunctionArgs,
	ClientLoaderFunctionArgs,
	useFetcher,
	useLoaderData,
} from '@remix-run/react'

import * as S from '@effect/schema/Schema'
import { NonEmptyString1000 } from '@evolu/common'
import invariant from 'tiny-invariant'
import Editor from '~/components/common/editor'
import { useAutoSave } from '~/lib/hooks'
import AureliusProvider from '~/lib/providers/aurelius'
import { EditorData } from '~/lib/types'
import {
	SettingsRow,
	evolu,
	helpArticleBySlugQuery,
	settingsQuery,
	writingByWritingEffortQuery,
	writingEffortBySlugQuery,
} from '~/services/evolu/client'
import { Content, Int } from '~/services/evolu/schema'
import writerStylesheet from '~/writer.css?url'

export const meta: MetaFunction = () => {
	return [{ title: 'Aurelius' }, { name: 'description', content: '' }]
}

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: writerStylesheet },
]

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
	const { row: effort } = await evolu.loadQuery(
		writingEffortBySlugQuery(params.effort ?? 'help')
	)

	invariant(effort, 'Writing effort not found')

	const { row: settings } = await evolu.loadQuery(settingsQuery)

	const { row: writing } =
		params.effort === 'help'
			? await evolu.loadQuery(
					helpArticleBySlugQuery(params.slug || 'getting-started')
				)
			: await evolu.loadQuery(
					writingByWritingEffortQuery({
						effortId: effort.id,
						slug: params.slug,
					})
				)

	invariant(writing, 'Content not found')

	return { effort, writing, settings }
}

export const clientAction = async ({
	params,
	request,
}: ClientActionFunctionArgs) => {
	const { row: effort } = await evolu.loadQuery(
		writingEffortBySlugQuery(params.effort ?? 'help')
	)

	invariant(effort, 'Writing effort not found')

	const { row: writing } = await evolu.loadQuery(
		writingByWritingEffortQuery({
			effortId: effort.id,
			slug: params.slug,
		})
	)

	invariant(writing, 'Content not found')

	if (params.effort === 'help') {
		return {}
	} else {
		const body: EditorData & { wordCount: number } = await request.json()
		const { content, title, wordCount } = body

		evolu.update('writing', {
			id: writing.id,
			content: S.decodeSync(Content)(content),
			title: S.decodeSync(NonEmptyString1000)(title),
			wordCount: S.decodeSync(Int)(wordCount),
		})

		return { message: 'ok' }
	}
}

const Writing = () => {
	const fetcher = useFetcher()
	const { settings, writing } = useLoaderData<typeof clientLoader>()

	const wordCount = useRef<number>(writing?.wordCount ?? 0)

	const [isSaving, setIsSaving] = useState<boolean>(false)

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

	const [editorData, setEditorData] = useAutoSave({
		initialData: {
			content: writing.content as string,
			title: writing.title as string,
		},
		onAutoSave,
		interval: 10000,
		debounce: 3000,
	})

	const providerData = {
		settings: settings as SettingsRow,
	}

	const handleTitleChange = (title: string) => {
		setEditorData({ title })
	}

	const handleContentChange = (content: string) => {
		setEditorData({ content })
	}

	const handleWordCountChange = (count: number) => {
		wordCount.current = count
	}

	useEffect(() => {
		wordCount.current = writing?.wordCount ?? 0
	}, [writing])

	return (
		<AureliusProvider data={providerData}>
			<Editor
				content={editorData.content}
				isSaving={isSaving}
				setContent={handleContentChange}
				setTitle={handleTitleChange}
				setWordCount={handleWordCountChange}
				title={editorData.title}
				wordCount={wordCount.current}
			/>
		</AureliusProvider>
	)
}

export default Writing
