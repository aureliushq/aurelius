import type { Dispatch, SetStateAction } from 'react'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '~/components/ui/alert-dialog'

const ResetEditor = ({
	confirmResetEditor,
	resetEditorOpen,
	setResetEditorOpen,
}: {
	confirmResetEditor: () => void
	resetEditorOpen: boolean
	setResetEditorOpen: Dispatch<SetStateAction<boolean>>
}) => {
	return (
		<AlertDialog onOpenChange={setResetEditorOpen} open={resetEditorOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This will clear the contents of the editor. Don't worry
						we've saved your work.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={confirmResetEditor}>
						Yes, I'm sure
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default ResetEditor
