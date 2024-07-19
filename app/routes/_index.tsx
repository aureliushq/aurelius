import { useState } from 'react'

import { LinksFunction, MetaFunction } from '@remix-run/node'
import { ClientLoaderFunctionArgs, useLoaderData } from '@remix-run/react'

import invariant from 'tiny-invariant'
import EditorLayout from '~/components/layouts/editor'
import AureliusProvider from '~/lib/providers/aurelius'
import {
	SettingsRow,
	evolu,
	helpArticleBySlugQuery,
	settingsQuery,
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
	const { row: helpArticle } = await evolu.loadQuery(
		helpArticleBySlugQuery(params.slug || 'getting-started')
	)
	invariant(helpArticle, 'Help article not found')
	const { row: settings } = await evolu.loadQuery(settingsQuery)

	return { writing: helpArticle, settings }
}

const Index = () => {
	const data = useLoaderData<typeof clientLoader>()
	const [title, setTitle] = useState<string>(data?.writing?.title as string)
	console.log(data)

	const providerData = {
		content: data?.writing?.content as string,
		settings: data?.settings as SettingsRow,
		setTitle,
		title,
	}

	return (
		<AureliusProvider data={providerData}>
			<EditorLayout />
		</AureliusProvider>
	)
}

export default Index
