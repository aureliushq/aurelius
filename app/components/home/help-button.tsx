import { useState } from 'react'

import { CircleHelpIcon } from 'lucide-react'
import HelpDialog from '~/components/home/help-dialog'
import { Button } from '~/components/ui/button'

const HelpButton = () => {
	const [open, setOpen] = useState(false)

	return (
		<>
			<div className='absolute bottom-4 right-4'>
				<Button
					size='icon'
					variant='secondary'
					onClick={() => setOpen(true)}
				>
					<CircleHelpIcon className='w-5 h-5' />
				</Button>
			</div>
			<HelpDialog onOpenChange={setOpen} open={open} />
		</>
	)
}

export default HelpButton
