import { FormEvent } from 'react'

import { Form } from '@remix-run/react'

import { LinkIcon, UnlinkIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'

type LinkDialogProps = {
	defaultValue?: string
	handleSetLink: (link: string) => void
	onOpenChange: (open: boolean) => void
	open: boolean
}

const LinkDialog = ({
	defaultValue,
	handleSetLink,
	onOpenChange,
	open,
}: LinkDialogProps) => {
	const handleLinkSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const formData = new FormData(e.currentTarget)
		const link = formData.get('link') as string
		const intent = formData.get('intent') as string

		if (intent === 'set') {
			handleSetLink(link)
		} else {
			handleSetLink('')
		}
	}

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className='sm:max-w-[480px]'>
				<DialogHeader>
					<DialogTitle>Insert Link</DialogTitle>
				</DialogHeader>
				<Form
					className='w-full flex items-center gap-2'
					onSubmit={handleLinkSubmit}
				>
					<div className='w-full'>
						<Input
							defaultValue={defaultValue}
							id='link'
							name='link'
							placeholder='https://karasunohigh.co.jp/clubs/volleyball'
						/>
					</div>
					{defaultValue ? (
						<>
							<Input name='intent' type='hidden' value='unset' />
							<Button size='icon' type='submit'>
								<UnlinkIcon className='w-4 h-4' />
							</Button>
						</>
					) : (
						<>
							<Input name='intent' type='hidden' value='set' />
							<Button size='icon' type='submit'>
								<LinkIcon className='w-4 h-4' />
							</Button>
						</>
					)}
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default LinkDialog
