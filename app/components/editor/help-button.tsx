import { CircleHelpIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { EditorShortcuts } from '~/lib/types'

const HelpButton = ({
	triggerGlobalShortcut,
}: {
	triggerGlobalShortcut: (_: string) => void
}) => {
	return (
		<Button
			className='w-9 h-9'
			onClick={() => triggerGlobalShortcut(EditorShortcuts.HELP)}
			size='icon'
			variant='outline'
		>
			<CircleHelpIcon className='w-4 h-4' />
		</Button>
	)
}

export default HelpButton
