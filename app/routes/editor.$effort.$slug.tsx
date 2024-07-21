import { useState } from 'react'

import { LinksFunction, MetaFunction } from '@remix-run/node'
import { ClientLoaderFunctionArgs, useLoaderData } from '@remix-run/react'

import invariant from 'tiny-invariant'
import Editor from '~/components/common/editor'
import { useAutoSave } from '~/lib/hooks'
import AureliusProvider from '~/lib/providers/aurelius'
import {
	SettingsRow,
	WritingEffortRow,
	evolu,
	helpArticleBySlugQuery,
	settingsQuery,
	writingByWritingEffortQuery,
	writingEffortBySlugQuery,
} from '~/services/evolu/client'
import writerStylesheet from '~/writer.css?url'

export const meta: MetaFunction = () => {
	return [{ title: 'Aurelius' }, { name: 'description', content: '' }]
}

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: writerStylesheet },
]

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
	const { row: settings } = await evolu.loadQuery(settingsQuery)
	if (!params.effort || params.effort === 'help') {
		const { row: effort } = await evolu.loadQuery(
			writingEffortBySlugQuery('help')
		)
		const { row: helpArticle } = await evolu.loadQuery(
			helpArticleBySlugQuery(params.slug || 'getting-started')
		)
		invariant(helpArticle, 'Help article not found')

		return { effort, writing: helpArticle, settings }
	} else {
		const { row: effort } = await evolu.loadQuery(
			writingEffortBySlugQuery(params.effort)
		)
		invariant(effort, 'Writing effort not found')
		const { row: writing } = await evolu.loadQuery(
			writingByWritingEffortQuery({
				effortId: effort.id,
				slug: params.slug,
			})
		)
		invariant(writing, 'Content not found')

		return { effort, writing, settings }
	}
}

const Writing = () => {
	const data = useLoaderData<typeof clientLoader>()

	const [isSaving, setIsSaving] = useState<boolean>(false)
	const [title, setTitle] = useState<string>(data?.writing?.title as string)

	const savePost = async (content: string) => {
		setIsSaving(true)
		// TODO: save writing to database
		setTimeout(() => {
			setIsSaving(false)
		}, 3000)
	}

	const [getContent, setContent] = useAutoSave({
		data: data?.writing?.content as string,
		onSave: savePost,
		interval: 10000,
		debounce: 3000,
	})

	const providerData = {
		settings: data?.settings as SettingsRow,
	}

	return (
		<AureliusProvider data={providerData}>
			<Editor
				content={getContent()}
				isSaving={isSaving}
				setContent={setContent}
				setTitle={setTitle}
				title={title}
			/>
		</AureliusProvider>
	)
}

export default Writing
