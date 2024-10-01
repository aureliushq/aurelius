import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from '~/components/ui/toast'
import { useToast } from '~/components/ui/use-toast'

export function Toaster() {
	const { toasts } = useToast()

	return (
		<ToastProvider>
			{toasts.map(({
				id,
				title,
				description,
				action,
				...props
			}) => (
					<Toast className='px-4 py-2 pr-6' key={id} {...props}>
						<div className='grid gap-1'>
							{title && <ToastTitle>{title}</ToastTitle>}
							{description && (
								<ToastDescription>
									{description}
								</ToastDescription>
							)}
						</div>
						{action}
						<ToastClose />
					</Toast>
				))}
			<ToastViewport />
		</ToastProvider>
	)
}
