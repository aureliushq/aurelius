import { useCallback, useState } from 'react'

import { LinksFunction, MetaFunction } from '@remix-run/node'
import { ClientLoaderFunctionArgs, useLoaderData } from '@remix-run/react'

import invariant from 'tiny-invariant'
import Editor from '~/components/common/editor'
import { useAutoSave } from '~/lib/hooks'
import AureliusProvider from '~/lib/providers/aurelius'
import { EditorData } from '~/lib/types'
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

	const savePost = useCallback(async ({ content, title }: EditorData) => {
		setIsSaving(true)
		// TODO: save post to database
		setTimeout(() => {
			setIsSaving(false)
		}, 3000)
	}, [])

	const [editorData, setEditorData] = useAutoSave({
		initialData: { title: '', content: '' },
		onSave: savePost,
		interval: 10000,
		debounce: 3000,
	})

	const providerData = {
		settings: data?.settings as SettingsRow,
	}

	const handleTitleChange = (title: string) => {
		setEditorData({ title })
	}

	const handleContentChange = (content: string) => {
		setEditorData({ content })
	}

	return (
		<AureliusProvider data={providerData}>
			<Editor
				content={editorData.content}
				isSaving={isSaving}
				setContent={handleContentChange}
				setTitle={handleTitleChange}
				title={editorData.title}
			/>
		</AureliusProvider>
	)
}

export default NewWriting
