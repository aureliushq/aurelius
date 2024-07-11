import { CircleHelpIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { HelpDialogProps } from '~/lib/types'

const HelpButton = ({ setHelpOpen }: HelpDialogProps) => {
	return (
		<Button
			className='w-9 h-9'
			onClick={() => setHelpOpen(true)}
			size='icon'
			variant='outline'
		>
			<CircleHelpIcon className='w-4 h-4' />
		</Button>
	)
}

export default HelpButton
