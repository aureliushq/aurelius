import { CircleHelpIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { HelpDialogProps } from '~/lib/types'

const HelpButton = ({ setHelpOpen }: HelpDialogProps) => {
	return (
		<div className='absolute bottom-4 right-4'>
			<Button
				onClick={() => setHelpOpen(true)}
				size='icon'
				variant='secondary'
			>
				<CircleHelpIcon className='w-5 h-5' />
			</Button>
		</div>
	)
}

export default HelpButton
