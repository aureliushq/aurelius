import {
	ClientLoaderFunctionArgs,
	Outlet,
	useLoaderData,
} from '@remix-run/react'

import invariant from 'tiny-invariant'
import { Button } from '~/components/ui/button'
import EffortLayout from '~/layouts/effort'
import { allShortcuts } from '~/lib/hooks/useKeyboardShortcuts'
import { EditorShortcuts } from '~/lib/types'
import { getShortcutWithModifiers } from '~/lib/utils'
import { evolu, writingEffortBySlugQuery } from '~/services/evolu/client'

import KeyboardShortcut from '../components/editor/keyboard-shortcut'

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
	invariant(params.effort, 'Writing Effort cannot be empty')

	const { row: effort } = await evolu.loadQuery(
		writingEffortBySlugQuery(params.effort)
	)
	invariant(effort, 'Writing effort not found')

	return { effort }
}

const EffortRoot = () => {
	const { effort } = useLoaderData<typeof clientLoader>()

	return (
		<EffortLayout>
			<div className='prose dark:prose-invert max-w-none flex w-full flex items-center justify-between text-white'>
				<h1 className='mb-4 text-center text-white'>{effort.name}</h1>
			</div>
			<Outlet />
		</EffortLayout>
	)
}

export default EffortRoot
