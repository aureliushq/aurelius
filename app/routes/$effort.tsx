import {
	ClientLoaderFunctionArgs,
	Outlet,
	useLoaderData,
} from '@remix-run/react'

import * as S from '@effect/schema/Schema'
import invariant from 'tiny-invariant'
import EffortLayout from '~/layouts/effort'
import { arls } from '~/services/arls'
import { NonEmptyString100 } from '~/services/evolu/schema'

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
	invariant(params.effort, 'Writing Effort cannot be empty')

	const effort = await arls.writingEfforts.findUnique({
		slug: S.decodeSync(NonEmptyString100)(params.effort),
	})
	invariant(effort, 'Writing effort not found')

	return { effort }
}

const EffortRoot = () => {
	const { effort } = useLoaderData<typeof clientLoader>()

	return (
		<EffortLayout>
			<div className='prose dark:prose-invert max-w-none flex w-full flex items-center justify-between text-white'>
				<h1 className='mb-4 text-center'>{effort.name}</h1>
			</div>
			<Outlet />
		</EffortLayout>
	)
}

export default EffortRoot
