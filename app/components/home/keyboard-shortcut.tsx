const KeyboardShortcut = ({ keys }: { keys: string }) => {
	return (
		<p className='flex items-center gap-1 text-xs'>
			{keys.split('+').map((key) => (
				<kbd
					className='px-1 py-0.5 font-semibold text-foreground bg-card border border-border rounded text-xs shadow-md'
					key={key}
				>
					{key}
				</kbd>
			))}
		</p>
	)
}

export default KeyboardShortcut
