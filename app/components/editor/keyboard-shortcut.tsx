import { Fragment } from 'react'

import { capitalize } from '~/lib/utils'

const KeyboardShortcut = ({
	keys,
	lowercase = false,
}: {
	keys: string
	lowercase?: boolean
}) => {
	if (!keys) return null

	return (
		<p className='flex items-center gap-1 text-xs'>
			{keys.split('+').map((key) => (
				<Fragment key={key}>
					{key && (
						<kbd className='px-1 py-0.5 font-semibold text-foreground bg-card border border-border rounded text-xs shadow-md'>
							{lowercase
								? key
								: capitalize({ str: key, lower: true })}
						</kbd>
					)}
				</Fragment>
			))}
		</p>
	)
}

export default KeyboardShortcut
