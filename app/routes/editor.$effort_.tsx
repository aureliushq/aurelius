import {
	Suspense,
	lazy,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'

import {
	type ClientActionFunctionArgs,
	type ClientLoaderFunctionArgs,
	useFetcher,
	useLoaderData,
	useNavigate,
} from '@remix-run/react'

import invariant from 'tiny-invariant'
import SuspenseFallback from '~/components/common/suspense-fallback'
import { createWriting } from '~/lib/actions'
import { ROUTES } from '~/lib/constants'
import { loadEffort } from '~/lib/loaders'
import {
	AureliusContext,
	type AureliusProviderData,
} from '~/lib/providers/aurelius'
import type { EditorData } from '~/lib/types'

const Editor = lazy(() => import('~/components/common/editor'))

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
	invariant(params.effort, 'Effort cannot be empty')
	const effort = await loadEffort(params.effort)
	return { effort }
}

export const clientAction = async ({
	params,
	request,
}: ClientActionFunctionArgs) => {
	invariant(params.effort, 'Writing Effort cannot be empty')
	const effort = await loadEffort(params.effort)
	invariant(effort, 'Writing effort not found')

	const body: EditorData & { wordCount: number } = await request.json()
	const { slug } = await createWriting({ body, effort })

	return { message: 'ok', redirectTo: `/editor/${effort.slug}/${slug}` }
}

const NewWriting = () => {
	const { setEffortId } = useContext<AureliusProviderData>(AureliusContext)

	const fetcher = useFetcher()
	const { effort } = useLoaderData<typeof clientLoader>()
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
		<Suspense fallback={<SuspenseFallback />}>
			<Editor
				data={{ content: '', title: '', wordCount: 0 }}
				isSaving={isSaving}
				onAutoSave={onAutoSave}
				onReset={onReset}
			/>
		</Suspense>
	)
}

export default NewWriting
