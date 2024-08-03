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
			<Outlet />
		</EffortLayout>
	)
}

export default EffortRoot
