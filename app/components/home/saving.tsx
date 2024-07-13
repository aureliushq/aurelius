import { Loader2Icon } from 'lucide-react'

const Saving = ({ isSaving }: { isSaving: boolean }) => {
	return (
		<>
			{isSaving && (
				<span className='text-sm text-muted-foreground px-2 inline-flex items-center'>
					<Loader2Icon className='w-4 h-4 mr-2 animate-spin' />
					Saving...
				</span>
			)}
		</>
	)
}

export default Saving
