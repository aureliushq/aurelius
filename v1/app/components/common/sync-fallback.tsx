import { LoaderCircleIcon } from 'lucide-react'

const SyncFallback = () => {
	return (
		<div className='w-screen h-screen flex flex-col justify-center items-center gap-4'>
			<LoaderCircleIcon className='w-12 h-12 animate-spin text-primary' />
			<p className=''>We're syncing your data. This may take a moment.</p>
		</div>
	)
}

export default SyncFallback
