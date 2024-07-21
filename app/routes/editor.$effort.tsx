import { useState } from 'react'

import { LinksFunction, MetaFunction } from '@remix-run/node'
import { ClientLoaderFunctionArgs, useLoaderData } from '@remix-run/react'

import invariant from 'tiny-invariant'
import Editor from '~/components/common/editor'
import { useAutoSave } from '~/lib/hooks'
import AureliusProvider from '~/lib/providers/aurelius'
import {
	SettingsRow,
	evolu,
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
	const { row: settings } = await evolu.loadQuery(settingsQuery)
	invariant(params.effort, 'Effort cannot be empty')
	const { row: effort } = await evolu.loadQuery(
		writingEffortBySlugQuery(params.effort)
	)
	invariant(effort, 'Writing effort not found')

	return { effort, settings }
}

const NewWriting = () => {
	const data = useLoaderData<typeof clientLoader>()

	const [isSaving, setIsSaving] = useState<boolean>(false)
	const [title, setTitle] = useState<string>('')

	const savePost = async (content: string) => {
		setIsSaving(true)
		// TODO: save post to database
		setTimeout(() => {
			setIsSaving(false)
		}, 3000)
	}

	const [getContent, setContent] = useAutoSave({
		data: '',
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

export default NewWriting
