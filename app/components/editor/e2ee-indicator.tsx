import { ShieldCheckIcon } from 'lucide-react'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '~/components/ui/tooltip'

const E2EEIndicator = () => {
	return (
		<Tooltip>
			<TooltipTrigger className='p-0' asChild>
				<ShieldCheckIcon className='w-5 h-5 text-primary' />
			</TooltipTrigger>
			<TooltipContent>
				<p className='text-sm text-center'>
					All your data is stored in your device. Sync is end-to-end
					encrypted so <br /> Aurelius servers can&apos;t read your
					data.
				</p>
			</TooltipContent>
		</Tooltip>
	)
}

export default E2EEIndicator
