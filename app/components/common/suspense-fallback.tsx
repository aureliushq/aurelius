import { LoaderCircleIcon } from 'lucide-react'
import { useTheme } from '~/lib/providers/theme'

const SuspenseFallback = () => {
	const { theme } = useTheme()

	return (
		<div className='w-screen h-screen flex justify-center items-center'>
			<LoaderCircleIcon className='w-12 h-12 animate-spin text-primary' />
		</div>
	)
}

export default SuspenseFallback
