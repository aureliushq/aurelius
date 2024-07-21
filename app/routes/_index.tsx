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

const Index = () => {
	const data = useLoaderData<typeof clientLoader>()

	const [isSaving, setIsSaving] = useState<boolean>(false)
	const [title, setTitle] = useState<string>(data?.writing?.title as string)

	const savePost = async (content: string) => {
		// TODO: only save if effort is not help
		if (data?.effort?.slug === 'help') {
			return
		} else {
			setIsSaving(true)
			// TODO: save post to database
			setTimeout(() => {
				setIsSaving(false)
			}, 3000)
		}
	}

	const [getContent, setContent] = useAutoSave({
		data: data?.writing?.content as string,
		onSave: savePost,
		interval: 10000,
		debounce: 3000,
	})

	const providerData = {
		content: data?.writing?.content as string,
		effort: data?.effort as WritingEffortRow,
		settings: data?.settings as SettingsRow,
		setTitle,
		title,
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

export default Index
