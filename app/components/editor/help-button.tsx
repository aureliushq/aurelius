import { CircleHelpIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { EditorShortcuts } from '~/lib/types'

const HelpButton = ({
	triggerShortcut,
}: {
	triggerShortcut: (_: string) => void
}) => {
	return (
		<Button
			className='w-9 h-9'
			onClick={() => triggerShortcut(EditorShortcuts.HELP)}
			size='icon'
			variant='outline'
		>
			<CircleHelpIcon className='w-4 h-4' />
		</Button>
	)
}

export default HelpButton
