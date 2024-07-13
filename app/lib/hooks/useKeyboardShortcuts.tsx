import { useCallback, useEffect, useState } from 'react'

import { EditorShortcuts } from '~/lib/types'

export type ModifierKeys = {
	ctrl?: boolean
	alt?: boolean
	shift?: boolean
	meta?: boolean
}

export type ShortcutConfig = {
	key: string
	modifiers: ModifierKeys
	description: string
	global?: boolean
}

type ShortcutAction = () => void

type AllShortcuts = {
	[key: string]: ShortcutConfig
}

type ShortcutActions = {
	[key: string]: ShortcutAction
}

// Centralized record of all shortcuts
const allShortcuts: AllShortcuts = {
	// TODO: add all local shortcuts here
	[EditorShortcuts.FOCUS_MODE]: {
		key: 'f',
		modifiers: {},
		description: 'Focus Mode',
	},
	[EditorShortcuts.HELP]: {
		key: '?',
		modifiers: {},
		description: 'Help',
	},
	// TODO: this is a global shortcut
	[EditorShortcuts.PREFERENCES]: {
		key: 'p',
		modifiers: {},
		description: 'Preferences',
	},
	[EditorShortcuts.SPLASH_DIALOG]: {
		key: 's',
		modifiers: {},
		description: 'Splash Dialog',
	},
	[EditorShortcuts.WRITING_SESSION]: {
		key: 'w',
		modifiers: {},
		description: 'New Writing Session',
	},
}

// Global store for global shortcut actions
// TODO: add all global shortcut actions here
let globalShortcutActions: ShortcutActions = {}

// Function to set global shortcut actions
export const setGlobalShortcutAction = (
	shortcutName: string,
	action: ShortcutAction
): void => {
	if (allShortcuts[shortcutName] && allShortcuts[shortcutName].global) {
		globalShortcutActions[shortcutName] = action
	}
}

const useKeyboardShortcuts = (shortcuts: ShortcutActions) => {
	const [, forceUpdate] = useState({})

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (
				event.target instanceof HTMLElement &&
				(event.target.tagName === 'INPUT' ||
					event.target.tagName === 'TEXTAREA' ||
					event.target.isContentEditable)
			) {
				return
			}

			const key = event.key.toLowerCase()
			const modifiers: ModifierKeys = {
				ctrl: event.ctrlKey,
				alt: event.altKey,
				shift: event.shiftKey,
				meta: event.metaKey,
			}

			for (const shortcutName in allShortcuts) {
				const shortcutConfig = allShortcuts[shortcutName]
				const {
					key: shortcutKey,
					modifiers: shortcutModifiers,
					global,
				} = shortcutConfig

				if (
					key === shortcutKey.toLowerCase() &&
					Object.entries(shortcutModifiers).every(
						([mod, active]) =>
							modifiers[mod as keyof ModifierKeys] === active
					)
				) {
					event.preventDefault()
					if (global && globalShortcutActions[shortcutName]) {
						globalShortcutActions[shortcutName]()
					} else if (shortcuts[shortcutName]) {
						shortcuts[shortcutName]()
					}
					return
				}
			}
		},
		[shortcuts]
	)

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [handleKeyDown])

	const triggerShortcut = useCallback(
		(shortcutName: string): void => {
			const shortcutConfig = allShortcuts[shortcutName]
			if (shortcutConfig) {
				if (
					shortcutConfig.global &&
					globalShortcutActions[shortcutName]
				) {
					globalShortcutActions[shortcutName]()
				} else if (shortcuts[shortcutName]) {
					shortcuts[shortcutName]()
				}
			}
		},
		[shortcuts]
	)

	return { triggerShortcut }
}

// Utility function to get all global shortcuts
const getGlobalShortcuts = (): string[] => {
	return Object.entries(allShortcuts)
		.filter(([_, config]) => config.global)
		.map(([name, _]) => name)
}

export { useKeyboardShortcuts, allShortcuts, getGlobalShortcuts }
