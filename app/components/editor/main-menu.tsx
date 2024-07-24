import { Dispatch, SetStateAction } from 'react'

import { Link } from '@remix-run/react'

import {
	BadgeInfoIcon,
	CircleHelpIcon,
	CirclePlusIcon,
	DownloadIcon,
	FileTextIcon,
	FocusIcon,
	ImageIcon,
	InstagramIcon,
	ListIcon,
	ListTreeIcon,
	MenuIcon,
	PencilIcon,
	RefreshCcwIcon,
	RefreshCwIcon,
	SettingsIcon,
	ShieldIcon,
	TimerIcon,
	TwitterIcon,
} from 'lucide-react'
import KeyboardShortcut from '~/components/editor/keyboard-shortcut'
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
import { allShortcuts } from '~/lib/hooks/useKeyboardShortcuts'
import { EditorShortcuts } from '~/lib/types'
import { getShortcutWithModifiers } from '~/lib/utils'

type MainMenuProps = {
	focusMode: boolean
	mainMenuOpen: boolean
	setMainMenuOpen: Dispatch<SetStateAction<boolean>>
	triggerShortcut: (shortcutName: string) => void
}

const MainMenu = ({
	focusMode,
	mainMenuOpen,
	setMainMenuOpen,
	triggerShortcut,
}: MainMenuProps) => {
	return (
		<div
			className={`transition-opacity duration-100 hover:opacity-100 ${focusMode ? 'opacity-5' : 'opacity-100'}`}
		>
			<DropdownMenu onOpenChange={setMainMenuOpen} open={mainMenuOpen}>
				<DropdownMenuTrigger asChild>
					<Button className='w-9 h-9' size='icon' variant='outline'>
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
											<KeyboardShortcut keys={''} />
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
								<DropdownMenuItem
									onClick={() =>
										triggerShortcut(
											EditorShortcuts.WRITING_SESSION
										)
									}
								>
									<span className='w-full h-full flex items-center justify-start cursor-pointer'>
										<TimerIcon className='mr-2 w-4 h-4' />
										<span>New Writing Session</span>
										<DropdownMenuShortcut className='ml-16'>
											<KeyboardShortcut
												keys={getShortcutWithModifiers(
													allShortcuts[
														EditorShortcuts
															.WRITING_SESSION
													].key,
													allShortcuts[
														EditorShortcuts
															.WRITING_SESSION
													].modifiers
												)}
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
											<KeyboardShortcut keys={''} />
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
											<KeyboardShortcut keys={''} />
										</DropdownMenuShortcut>
									</span>
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() =>
							triggerShortcut(EditorShortcuts.FOCUS_MODE)
						}
					>
						<span className='w-full h-full flex items-center justify-between cursor-pointer'>
							<span className='inline-flex items-center'>
								<FocusIcon className='mr-2 w-4 h-4' />
								<span>Focus Mode</span>
							</span>
							<DropdownMenuShortcut className='ml-16'>
								<KeyboardShortcut
									keys={getShortcutWithModifiers(
										allShortcuts[EditorShortcuts.FOCUS_MODE]
											.key,
										allShortcuts[EditorShortcuts.FOCUS_MODE]
											.modifiers
									)}
								/>
							</DropdownMenuShortcut>
						</span>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() =>
							triggerShortcut(EditorShortcuts.RESET_EDITOR)
						}
					>
						<span className='w-full h-full flex items-center justify-between cursor-pointer'>
							<span className='inline-flex items-center'>
								<RefreshCwIcon className='mr-2 w-4 h-4' />
								<span>Reset Editor</span>
							</span>
							<DropdownMenuShortcut className='ml-16'>
								<KeyboardShortcut
									keys={getShortcutWithModifiers(
										allShortcuts[
											EditorShortcuts.RESET_EDITOR
										].key,
										allShortcuts[
											EditorShortcuts.RESET_EDITOR
										].modifiers
									)}
								/>
							</DropdownMenuShortcut>
						</span>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() =>
							triggerShortcut(EditorShortcuts.PREFERENCES)
						}
					>
						<span className='w-full h-full flex items-center justify-between cursor-pointer'>
							<span className='inline-flex items-center'>
								<SettingsIcon className='mr-2 w-4 h-4' />
								<span>Preferences</span>
							</span>
							<DropdownMenuShortcut className='ml-16'>
								<KeyboardShortcut
									keys={getShortcutWithModifiers(
										allShortcuts[
											EditorShortcuts.PREFERENCES
										].key,
										allShortcuts[
											EditorShortcuts.PREFERENCES
										].modifiers
									)}
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
					<DropdownMenuItem
						onClick={() => triggerShortcut(EditorShortcuts.HELP)}
					>
						<span className='w-full h-full flex items-center justify-between cursor-pointer'>
							<span className='inline-flex items-center'>
								<CircleHelpIcon className='mr-2 w-4 h-4' />
								<span>Help</span>
							</span>
							<DropdownMenuShortcut className='ml-16'>
								<KeyboardShortcut
									keys={getShortcutWithModifiers(
										allShortcuts[EditorShortcuts.HELP].key,
										allShortcuts[EditorShortcuts.HELP]
											.modifiers
									)}
								/>
							</DropdownMenuShortcut>
						</span>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<Link
							className='w-full h-full flex items-center justify-start cursor-pointer'
							to='/about'
						>
							<BadgeInfoIcon className='mr-2 w-4 h-4' />
							<span>About</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Link
							className='w-full h-full flex items-center justify-start cursor-pointer'
							to='/privacy'
						>
							<ShieldIcon className='mr-2 w-4 h-4' />
							<span>Privacy</span>
						</Link>
					</DropdownMenuItem>
					{/*<DropdownMenuItem>*/}
					{/*	<Link*/}
					{/*		className='w-full h-full flex items-center justify-start cursor-pointer'*/}
					{/*		to='/changelog'*/}
					{/*	>*/}
					{/*		<ListTreeIcon className='mr-2 w-4 h-4' />*/}
					{/*		<span>Changelog</span>*/}
					{/*	</Link>*/}
					{/*</DropdownMenuItem>*/}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export default MainMenu
