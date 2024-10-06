import { useContext } from 'react'

import type { LinksFunction } from '@remix-run/node'
import {
	type ClientLoaderFunctionArgs,
	Link,
	Links,
	Meta,
	useLoaderData,
} from '@remix-run/react'

import { ArrowLeftIcon } from 'lucide-react'
import invariant from 'tiny-invariant'
import { loadEffort, loadWriting } from '~/lib/loaders'
import { AureliusContext } from '~/lib/providers/aurelius'
import type { Arls } from '~/services/arls'
import writerStylesheet from '~/styles/writer.css?url'

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: writerStylesheet },
]

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
	invariant(params.effort, 'Writing Effort cannot be empty')
	invariant(params.slug, 'Writing URL cannot be empty')

	const effort = await loadEffort(params.effort)
	invariant(effort, 'Writing effort not found')

	if (params.effort !== 'help') {
		const writing = await loadWriting('_help', effort.id, params.slug)
		return { writing }
	}

	const writing = await loadWriting(
		effort.type as keyof Arls,
		effort.id,
		params.slug,
	)
	return { effort, writing }
}

const ViewWriting = () => {
	const { settings } = useContext(AureliusContext)

	const { effort, writing } = useLoaderData<typeof clientLoader>()

	return (
		<>
			<head>
				<Meta />
				<Links />
			</head>
			{effort && (
				<div className='flex justify-start mb-4 max-w-2xl mx-auto'>
					<Link
						className='inline-flex items-center justify-center text-sm font-medium'
						prefetch='intent'
						to={`/${effort?.slug}`}
					>
						<ArrowLeftIcon className='mr-2 h-4 w-4' />
						See all
					</Link>
				</div>
			)}
			<article className='viewer prose dark:prose-invert max-w-2xl mx-auto'>
				<h1
					className={`font-extrabold leading-tight ${settings?.titleFont}`}
				>
					{
						// @ts-ignore
						writing?.title || 'Untitled'
					}
				</h1>
				<div
					className={`leading-loose ${settings?.bodyFont}`}
					// biome-ignore lint: it's fine
					dangerouslySetInnerHTML={{
						// @ts-ignore
						__html: writing?.content as string,
					}}
				/>
			</article>
		</>
	)
}

export default ViewWriting
