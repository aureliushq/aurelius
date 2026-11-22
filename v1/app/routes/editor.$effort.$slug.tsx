import { useCallback, useContext, useEffect, useState } from 'react'

import {
	type ClientActionFunctionArgs,
	type ClientLoaderFunctionArgs,
	useFetcher,
	useLoaderData,
	useNavigate,
} from '@remix-run/react'

import * as S from '@effect/schema/Schema'
import { type ExtractRow, type Query, String1000 } from '@evolu/common'
import invariant from 'tiny-invariant'
import Editor from '~/components/common/editor'
import { ROUTES } from '~/lib/constants'
import { loadEffort, loadWriting } from '~/lib/loaders'
import {
	AureliusContext,
	type AureliusProviderData,
} from '~/lib/providers/aurelius'
import type { EditorData } from '~/lib/types'
import { type Arls, type TableQueryBuilder, arls } from '~/services/arls'
import type { EffortsTable } from '~/services/evolu/database'
import {
	Content,
	Int,
	NonEmptyString100,
	WritingEffortId,
} from '~/services/evolu/schema'

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
	invariant(params.effort, 'Effort cannot be empty')
	invariant(params.slug, 'Content slug cannot be empty')

	const effort = await loadEffort(params.effort)
	if (params.effort === 'help') {
		window.location.href = `${ROUTES.HELP}/${params.slug}`
	}
	const writing = await loadWriting(
		effort.type as keyof Arls,
		params.slug,
		effort.id,
	)
	return { effort, writing }
}

export const clientAction = async ({
	params,
	request,
}: ClientActionFunctionArgs) => {
	invariant(params.effort, 'Effort cannot be empty')
	invariant(params.slug, 'Content slug cannot be empty')
	const effort = await loadEffort(params.effort)
	invariant(effort, 'Writing effort not found')

	const writing = await arls[effort.type as keyof Arls].findUnique({
		effortId: S.decodeSync(WritingEffortId)(effort.id),
		slug: S.decodeSync(NonEmptyString100)(params.slug),
	})
	invariant(writing, 'Content not found')

	if (params.effort !== 'help') {
		const body: EditorData & { wordCount: number } = await request.json()
		const { content, title, wordCount } = body

		const data = {
			content: S.decodeSync(Content)(content),
			title: S.decodeSync(String1000)(title),
			wordCount: S.decodeSync(Int)(wordCount),
		} as ExtractRow<Query<EffortsTable>>

		const table = arls[
			effort.type as keyof Arls
		] as TableQueryBuilder<EffortsTable>

		await table.update({ id: writing.id, data })

		return { message: 'ok' }
	}
}

const Writing = () => {
	const { setContentId, setEffortId } =
		useContext<AureliusProviderData>(AureliusContext)

	const fetcher = useFetcher()
	const { effort, writing } = useLoaderData<typeof clientLoader>()
	const navigate = useNavigate()

	const [isSaving, setIsSaving] = useState<boolean>(false)

	// biome-ignore lint: correctness/useExhaustiveDependencies
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

	// biome-ignore lint: correctness/useExhaustiveDependencies
	useEffect(() => {
		if (effort) {
			setEffortId(effort.id)
		}
	}, [effort])

	// biome-ignore lint: correctness/useExhaustiveDependencies
	useEffect(() => {
		if (writing) {
			setContentId(writing.id)
		}
	}, [])

	return (
		<Editor
			data={{
				// @ts-ignore
				content: writing.content as string,
				// @ts-ignore
				title: (writing?.title || '') as string,
				// @ts-ignore
				wordCount: writing?.wordCount ?? 0,
			}}
			isSaving={isSaving}
			onAutoSave={onAutoSave}
			onReset={onReset}
		/>
	)
}

export default Writing
