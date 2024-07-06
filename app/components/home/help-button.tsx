import { CircleHelpIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'

const HelpButton = () => {
	return (
		<div className='absolute bottom-4 right-4'>
			<Button size='icon' variant='secondary'>
				<CircleHelpIcon className='w-5 h-5' />
			</Button>
		</div>
	)
}

export default HelpButton
