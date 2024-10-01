import { useCallback, useContext, useEffect, useState } from 'react'

import {
	type ClientActionFunctionArgs,
	type ClientLoaderFunctionArgs,
	useFetcher,
	useLoaderData,
	useNavigate,
} from '@remix-run/react'

import * as S from '@effect/schema/Schema'
import { String1000 } from '@evolu/common'
import GithubSlugger from 'github-slugger'
import invariant from 'tiny-invariant'
import Editor from '~/components/common/editor'
import { ROUTES } from '~/lib/constants'
import { AureliusContext, type AureliusProviderData } from '~/lib/providers/aurelius'
import type { EditorData } from '~/lib/types'
import { checkSlugUniqueness } from '~/lib/utils'
import { type Arls, arls } from '~/services/arls'
import { Content, Int, NonEmptyString100 } from '~/services/evolu/schema'

const slugger = new GithubSlugger()

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
		title: S.decodeSync(String1000)(title),
		wordCount: S.decodeSync(Int)(wordCount),
	})

	return { message: 'ok', redirectTo: `/editor/${effort.slug}/${finalSlug}` }
}

const NewWriting = () => {
	const { setEffortId } = useContext<AureliusProviderData>(AureliusContext)

	const fetcher = useFetcher()
	const { effort } = useLoaderData<typeof clientLoader>()
	const navigate = useNavigate()

	const [isSaving, setIsSaving] = useState<boolean>(false)

	const onAutoSave = useCallback(
		({ content, title, wordCount }: EditorData) => {
			setIsSaving(true)

			fetcher.submit(
				{ content, title, wordCount: wordCount ?? 0 },
				{ method: 'POST', encType: 'application/json' },
			)

			setTimeout(() => {
				setIsSaving(false)
			}, 3000)
		},
		[],
	)

	const onReset = () => {
		navigate(`${ROUTES.EDITOR.BASE}/${effort.slug as string}`)
	}

	useEffect(() => {
		if (effort) {
			setEffortId(effort.id)
		}
	}, [effort])

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
		<Editor
			data={{ content: '', title: '', wordCount: 0 }}
			isSaving={isSaving}
			onAutoSave={onAutoSave}
			onReset={onReset}
		/>
	)
}

export default NewWriting
