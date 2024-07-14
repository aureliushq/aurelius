import { Fragment } from 'react'

const KeyboardShortcut = ({ keys }: { keys: string }) => {
	if (!keys) return null

	return (
		<p className='flex items-center gap-1 text-xs'>
			{keys.split('+').map((key) => (
				<Fragment key={key}>
					{key && (
						<kbd className='px-1 py-0.5 font-semibold text-foreground bg-card border border-border rounded text-xs shadow-md'>
							{key}
						</kbd>
					)}
				</Fragment>
			))}
		</p>
	)
}

export default KeyboardShortcut
