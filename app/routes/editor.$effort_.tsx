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
import { useQuery } from '@evolu/react'
import GithubSlugger from 'github-slugger'
import invariant from 'tiny-invariant'
import Editor from '~/components/common/editor'
import { useAutoSave, useKeyboardShortcuts } from '~/lib/hooks'
import AureliusProvider from '~/lib/providers/aurelius'
import { EditorData, EditorShortcuts } from '~/lib/types'
import { checkSlugUniqueness } from '~/lib/utils'
import { Arls, arls } from '~/services/arls'
import { SettingsRow, settingsQuery } from '~/services/evolu/client'
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
	invariant(params.effort, 'Effort cannot be empty')
	const effort = await arls.writingEfforts.findUnique({
		slug: S.decodeSync(NonEmptyString100)(params.effort),
	})
	invariant(effort, 'Writing effort not found')

	return { effort }
}

export const clientAction = async ({
	params,
	request,
}: ClientActionFunctionArgs) => {
	invariant(params.effort, 'Writing Effort cannot be empty')
	const effort = await arls.writingEfforts.findUnique({
		slug: S.decodeSync(NonEmptyString100)(params.effort),
	})
	invariant(effort, 'Writing effort not found')

	const body: EditorData & { wordCount: number } = await request.json()
	const { content, title, wordCount } = body

	const writingTitle = title.trim() !== '' ? title : 'Untitled'
	let finalSlug = ''
	let isUnique = false
	do {
		const generatedSlug = slugger.slug(writingTitle)
		const { isUnique: isSlugUnique, slug } = await checkSlugUniqueness({
			effortId: effort.id,
			effortType: effort.type,
			slug: generatedSlug,
		})
		isUnique = isSlugUnique
		finalSlug = slug
	} while (!isUnique)

	const table = arls[effort.type as keyof Arls]
	table.create({
		content: S.decodeSync(Content)(content),
		effortId: effort.id,
		slug: S.decodeSync(NonEmptyString100)(finalSlug),
		title: S.decodeSync(NonEmptyString1000)(writingTitle),
		wordCount: S.decodeSync(Int)(wordCount),
	})

	return { message: 'ok', redirectTo: `/editor/${effort.slug}/${finalSlug}` }
}

const NewWriting = () => {
	const shortcuts = {
		[EditorShortcuts.FORCE_SAVE]: () => handleForceSave(),
	}

	const fetcher = useFetcher()
	const { effort } = useLoaderData<typeof clientLoader>()
	const navigate = useNavigate()

	useKeyboardShortcuts(shortcuts)

	const { row: settings } = useQuery(settingsQuery)

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
		debounce: 1000,
	})

	const providerData = {
		settings: settings as SettingsRow,
	}

	const handleContentChange = (content: string) => {
		setEditorData({ content })
	}

	const handleForceSave = () => {
		forceSave()
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

	const handleWordCountChange = (count: number) => {
		wordCount.current = count
	}

	const onReset = () => {
		forceSave()
		navigate(`/editor/${effort.slug as string}`)
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

export default NewWriting
