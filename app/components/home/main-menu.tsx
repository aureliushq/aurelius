import { Link } from '@remix-run/react'

import {
	CircleHelpIcon,
	CirclePlusIcon,
	DownloadIcon,
	FileTextIcon,
	FocusIcon,
	ImageIcon,
	InstagramIcon,
	ListIcon,
	LogInIcon,
	MenuIcon,
	PencilIcon,
	RefreshCcwIcon,
	RefreshCwIcon,
	RocketIcon,
	SettingsIcon,
	TimerIcon,
	TwitterIcon,
} from 'lucide-react'
import KeyboardShortcut from '~/components/home/keyboard-shortcut'
import { Button } from '~/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { SHORTCUTS } from '~/lib/constants'
import { HelpDialogProps, PreferencesDialogProps } from '~/lib/types'

type MainMenuProps = {
	createPost?: () => void
} & HelpDialogProps &
	PreferencesDialogProps

const MainMenu = ({ setHelpOpen, setPreferencesOpen }: MainMenuProps) => {
	return (
		<div className='absolute top-4 left-4'>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className='w-9 h-9' size='icon' variant='secondary'>
						<MenuIcon className='w-4 h-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='start'>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<span className='w-full h-full flex items-center justify-start cursor-pointer'>
								<FileTextIcon className='mr-2 w-4 h-4' />
								<span>Posts</span>
							</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuItem className='justify-between'>
									<span className='w-full h-full flex items-center justify-start cursor-pointer'>
										<CirclePlusIcon className='mr-2 w-4 h-4' />
										<span>New Post</span>
										<DropdownMenuShortcut className='ml-16'>
											<KeyboardShortcut
												keys={SHORTCUTS.NEW_POST}
											/>
										</DropdownMenuShortcut>
									</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<span className='w-full h-full flex items-center justify-start cursor-pointer'>
										<ListIcon className='mr-2 w-4 h-4' />
										<span>View All Posts</span>
									</span>
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<span className='w-full h-full flex items-center justify-start cursor-pointer'>
								<PencilIcon className='mr-2 w-4 h-4' />
								<span>Writing Sessions</span>
							</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuItem>
									<span className='w-full h-full flex items-center justify-start cursor-pointer'>
										<TimerIcon className='mr-2 w-4 h-4' />
										<span>New Writing Session</span>
										<DropdownMenuShortcut className='ml-16'>
											<KeyboardShortcut
												keys={
													SHORTCUTS.NEW_WRITING_SESSION
												}
											/>
										</DropdownMenuShortcut>
									</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<span className='w-full h-full flex items-center justify-start cursor-pointer'>
										<RefreshCcwIcon className='mr-2 w-4 h-4' />
										<span>Resume Previous Session</span>
									</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<span className='w-full h-full flex items-center justify-start cursor-pointer'>
										<ListIcon className='mr-2 w-4 h-4' />
										<span>View All Sessions</span>
									</span>
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<span className='w-full h-full flex items-center justify-start cursor-pointer'>
								<DownloadIcon className='mr-2 w-4 h-4' />
								<span>Export As</span>
							</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuItem>
									<span className='w-full h-full flex items-center justify-between cursor-pointer'>
										<span className='inline-flex items-center'>
											<ImageIcon className='mr-2 w-4 h-4' />
											<span>Image</span>
										</span>
										<DropdownMenuShortcut className='ml-16'>
											<KeyboardShortcut
												keys={SHORTCUTS.EXPORT_AS_IMAGE}
											/>
										</DropdownMenuShortcut>
									</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<span className='w-full h-full flex items-center justify-start cursor-pointer'>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
											className='mr-2 w-4 h-4'
										>
											<path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'></path>
											<polyline points='14 2 14 8 20 8'></polyline>
											<path d='M12 18v-6'></path>
											<path d='m9 15 3 3 3-3'></path>
										</svg>
										<span>Markdown</span>
										<DropdownMenuShortcut className='ml-16'>
											<KeyboardShortcut
												keys={
													SHORTCUTS.EXPORT_AS_MARKDOWN
												}
											/>
										</DropdownMenuShortcut>
									</span>
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<span className='w-full h-full flex items-center justify-between cursor-pointer'>
							<span className='inline-flex items-center'>
								<FocusIcon className='mr-2 w-4 h-4' />
								<span>Focus Mode</span>
							</span>
							<DropdownMenuShortcut className='ml-16'>
								<KeyboardShortcut keys={SHORTCUTS.FOCUS_MODE} />
							</DropdownMenuShortcut>
						</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<span className='w-full h-full flex items-center justify-between cursor-pointer'>
							<span className='inline-flex items-center'>
								<RefreshCwIcon className='mr-2 w-4 h-4' />
								<span>Reset Editor</span>
							</span>
							<DropdownMenuShortcut className='ml-16'>
								<KeyboardShortcut
									keys={SHORTCUTS.RESET_EDITOR}
								/>
							</DropdownMenuShortcut>
						</span>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setPreferencesOpen(true)}>
						<span className='w-full h-full flex items-center justify-between cursor-pointer'>
							<span className='inline-flex items-center'>
								<SettingsIcon className='mr-2 w-4 h-4' />
								<span>Preferences</span>
							</span>
							<DropdownMenuShortcut className='ml-16'>
								<KeyboardShortcut
									keys={SHORTCUTS.PREFERENCES}
								/>
							</DropdownMenuShortcut>
						</span>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<Link
							className='w-full h-full flex items-center justify-start cursor-pointer'
							to='/blog'
						>
							<PencilIcon className='mr-2 w-4 h-4' />
							<span>Blog</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<a
							className='w-full h-full flex items-center justify-start cursor-pointer'
							href='https://twitter.com/aurelius_ink'
							rel='noopener noreferrer'
							target='_blank'
						>
							<TwitterIcon className='mr-2 w-4 h-4' />
							<span>Twitter</span>
						</a>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<a
							className='w-full h-full flex items-center justify-start cursor-pointer'
							href='https://instagram.com/aurelius_ink'
							rel='noopener noreferrer'
							target='_blank'
						>
							<InstagramIcon className='mr-2 w-4 h-4' />
							<span>Instagram</span>
						</a>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setHelpOpen(true)}>
						<span className='w-full h-full flex items-center justify-between cursor-pointer'>
							<span className='inline-flex items-center'>
								<CircleHelpIcon className='mr-2 w-4 h-4' />
								<span>Help</span>
							</span>
							<DropdownMenuShortcut className='ml-16'>
								<KeyboardShortcut keys={SHORTCUTS.HELP} />
							</DropdownMenuShortcut>
						</span>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<span className='w-full h-full flex items-center justify-start cursor-pointer'>
							<RocketIcon className='mr-2 w-4 h-4' />
							<span>Plus</span>
						</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<span className='w-full h-full flex items-center justify-start cursor-pointer'>
							<LogInIcon className='mr-2 w-4 h-4' />
							<span>Sign Up</span>
						</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export default MainMenu
