import { useCallback, useContext, useEffect, useState } from 'react'

import {
	ClientActionFunctionArgs,
	ClientLoaderFunctionArgs,
	useFetcher,
	useLoaderData,
	useNavigate,
} from '@remix-run/react'

import * as S from '@effect/schema/Schema'
import { ExtractRow, Query, String1000 } from '@evolu/common'
import invariant from 'tiny-invariant'
import Editor from '~/components/common/editor'
import { ROUTES } from '~/lib/constants'
import { AureliusContext, AureliusProviderData } from '~/lib/providers/aurelius'
import { EditorData } from '~/lib/types'
import { Arls, TableQueryBuilder, arls } from '~/services/arls'
import { EffortsTable } from '~/services/evolu/database'
import {
	Content,
	Int,
	NonEmptyString100,
	WritingEffortId,
} from '~/services/evolu/schema'

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
	invariant(params.effort, 'Effort cannot be empty')
	invariant(params.slug, 'Content slug cannot be empty')
	const effort = await arls.writingEfforts.findUnique({
		slug: S.decodeSync(NonEmptyString100)(params.effort),
	})
	invariant(effort, 'Writing effort not found')

	if (params.effort === 'help') {
		const helpArticle = await arls._help.findUnique({
			slug: S.decodeSync(NonEmptyString100)(params.slug),
		})
		invariant(helpArticle, 'Content not found')
		return { effort, writing: helpArticle }
	}

	const table = arls[effort.type as keyof Arls]
	const writing = (await table.findUnique({
		effortId: S.decodeSync(WritingEffortId)(effort.id),
		slug: S.decodeSync(NonEmptyString100)(params.slug),
	})) as ExtractRow<Query<EffortsTable>>
	invariant(writing, 'Content not found')

	return { effort, writing }
}

export const clientAction = async ({
	params,
	request,
}: ClientActionFunctionArgs) => {
	invariant(params.effort, 'Effort cannot be empty')
	invariant(params.slug, 'Content slug cannot be empty')
	const effort = await arls.writingEfforts.findUnique({
		slug: S.decodeSync(NonEmptyString100)(params.effort),
	})
	invariant(effort, 'Writing effort not found')

	const writing = await arls[effort.type as keyof Arls].findUnique({
		effortId: S.decodeSync(WritingEffortId)(effort.id),
		slug: S.decodeSync(NonEmptyString100)(params.slug),
	})
	invariant(writing, 'Content not found')

	if (params.effort === 'help') {
		return {}
	} else {
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

		table.update(writing.id, data)

		return { message: 'ok' }
	}
}

const Writing = () => {
	const { setContentId } = useContext<AureliusProviderData>(AureliusContext)

	const fetcher = useFetcher()
	const { effort, writing } = useLoaderData<typeof clientLoader>()
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
		if (writing) {
			setContentId(writing.id)
		}
	}, [])

	return (
		<Editor
			data={{
				content: writing.content as string,
				title: (writing?.title || '') as string,
				wordCount: writing?.wordCount ?? 0,
			}}
			isSaving={isSaving}
			onAutoSave={onAutoSave}
			onReset={onReset}
		/>
	)
}

export default Writing
