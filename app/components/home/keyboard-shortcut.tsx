const KeyboardShortcut = ({ keys }: { keys: string }) => {
	return (
		<p className='flex items-center gap-1 text-xs'>
			{keys.split('+').map((key) => (
				<kbd
					className='px-2 py-1 font-semibold text-foreground bg-card border border-border rounded text-[0.7rem] shadow-md'
					key={key}
				>
					{key}
				</kbd>
			))}
		</p>
	)
}

export default KeyboardShortcut
