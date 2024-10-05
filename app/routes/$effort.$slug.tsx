import { useContext } from 'react'

import type { LinksFunction } from '@remix-run/node'
import {
	type ClientLoaderFunctionArgs,
	Link,
	Links,
	Meta,
	useLoaderData,
} from '@remix-run/react'

import * as S from '@effect/schema/Schema'
import { ArrowLeftIcon } from 'lucide-react'
import invariant from 'tiny-invariant'
import { AureliusContext } from '~/lib/providers/aurelius'
import { type Arls, type TableQueryBuilder, arls } from '~/services/arls'
import type { EffortsTable } from '~/services/evolu/database'
import { NonEmptyString100 } from '~/services/evolu/schema'
import writerStylesheet from '~/styles/writer.css?url'

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: writerStylesheet },
]

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
	invariant(params.effort, 'Writing Effort cannot be empty')
	invariant(params.slug, 'Writing URL cannot be empty')

	if (params.effort === 'help') {
		const writing = await arls._help.findUnique({
			slug: S.decodeSync(NonEmptyString100)(params.slug),
		})

		return { writing }
	} else {
		const effort = await arls.writingEfforts.findUnique({
			slug: S.decodeSync(NonEmptyString100)(params.effort),
		})
		invariant(effort, 'Writing effort not found')

		const table = arls[
			effort.type as keyof Arls
		] as TableQueryBuilder<EffortsTable>
		const writing = await table.findUnique({
			effortId: effort.id,
			slug: S.decodeSync(NonEmptyString100)(params.slug),
		})

		return { effort, writing }
	}
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
					{writing?.title || 'Untitled'}
				</h1>
				<div
					className={`leading-loose ${settings?.bodyFont}`}
					dangerouslySetInnerHTML={{
						__html: writing?.content as string,
					}}
				/>
			</article>
		</>
	)
}

export default ViewWriting
