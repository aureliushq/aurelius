import { useState } from 'react'

import { LinksFunction, MetaFunction } from '@remix-run/node'
import { ClientLoaderFunctionArgs, useLoaderData } from '@remix-run/react'

import invariant from 'tiny-invariant'
import Editor from '~/components/common/editor'
import AureliusProvider from '~/lib/providers/aurelius'
import {
	SettingsRow,
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
		const { row: helpArticle } = await evolu.loadQuery(
			helpArticleBySlugQuery(params.slug || 'getting-started')
		)
		invariant(helpArticle, 'Help article not found')

		return { writing: helpArticle, settings }
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

		return { writing, settings }
	}
}

const Index = () => {
	const data = useLoaderData<typeof clientLoader>()
	const [title, setTitle] = useState<string>(data?.writing?.title as string)

	const providerData = {
		content: data?.writing?.content as string,
		settings: data?.settings as SettingsRow,
		setTitle,
		title,
	}

	return (
		<AureliusProvider data={providerData}>
			<Editor />
		</AureliusProvider>
	)
}

export default Index
