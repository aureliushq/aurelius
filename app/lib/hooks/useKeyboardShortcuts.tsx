import { useCallback, useEffect, useMemo } from 'react'

import {
	type AllShortcuts,
	EditorShortcuts,
	type ModifierKeys,
	type ShortcutAction,
	type ShortcutActions,
} from '~/lib/types'

// Centralized record of all shortcuts
const allShortcuts: AllShortcuts = {
	[EditorShortcuts.BLUR]: {
		description: 'Blur',
		key: 'Escape',
		label: 'Esc',
		modifiers: {},
		runInInputs: true,
	},
	[EditorShortcuts.FOCUS_MODE]: {
		description: 'Focus Mode',
		key: 'f',
		modifiers: {},
	},
	[EditorShortcuts.FORCE_SAVE]: {
		description: 'Save',
		key: 's',
		modifiers: { ctrl: true },
		runInInputs: true,
		preventDefault: true,
	},
	[EditorShortcuts.HELP]: {
		description: 'Help',
		key: '?',
		modifiers: {},
	},
	[EditorShortcuts.MAIN_MENU]: {
		description: 'Main Menu',
		key: 'm',
		modifiers: {},
	},
	[EditorShortcuts.NEW_POST]: {
		description: 'New Post',
		key: 'p',
		modifiers: {},
	},
	// TODO: this is a global shortcut
	[EditorShortcuts.PREFERENCES]: {
		description: 'Preferences',
		key: ',',
		modifiers: {},
	},
	[EditorShortcuts.RESET_EDITOR]: {
		description: 'Reset Editor',
		key: 'r',
		modifiers: {},
	},
	[EditorShortcuts.SPLASH_DIALOG]: {
		description: 'Quick Start',
		key: 'q',
		modifiers: {},
	},
	[EditorShortcuts.VIEW_ALL_POSTS]: {
		description: 'View All Posts',
		key: 'p',
		modifiers: { alt: true },
	},
	[EditorShortcuts.VIEW_ALL_WRITING_SESSIONS]: {
		description: 'View All Writing Sessions',
		key: 'w',
		modifiers: { alt: true },
	},
	[EditorShortcuts.WRITING_SESSION]: {
		description: 'New Writing Session',
		key: 'w',
		modifiers: {},
	},
}

// Global store for global shortcut actions
// TODO: add all global shortcut actions here
const globalShortcutActions: ShortcutActions = {}

// Function to set global shortcut actions
export const setGlobalShortcutAction = (
	shortcutName: string,
	action: ShortcutAction,
): void => {
	if (allShortcuts?.[shortcutName].global) {
		globalShortcutActions[shortcutName] = action
	}
}

const useKeyboardShortcuts = (shortcuts: ShortcutActions) => {
	const sortedShortcuts = useMemo(() => {
		return Object.entries(allShortcuts).sort(([, a], [, b]) => {
			const aModifiers = Object.values(a.modifiers).filter(Boolean).length
			const bModifiers = Object.values(b.modifiers).filter(Boolean).length
			return bModifiers - aModifiers
		})
	}, [])

	// biome-ignore lint: correctness/useExhaustiveDependencies
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const isInputField =
				event.target instanceof HTMLElement &&
				(event.target.tagName === 'INPUT' ||
					event.target.tagName === 'TEXTAREA' ||
					event.target.isContentEditable)

			const key = event.key.toLowerCase()
			const modifiers: ModifierKeys = {
				ctrl: event.ctrlKey,
				alt: event.altKey,
				shift: event.shiftKey,
				meta: event.metaKey,
			}

			for (const [shortcutName, shortcutConfig] of sortedShortcuts) {
				const {
					global,
					key: shortcutKey,
					modifiers: shortcutModifiers,
					preventDefault,
					runInInputs,
				} = shortcutConfig

				if (
					key === shortcutKey.toLowerCase() &&
					Object.entries(shortcutModifiers).every(
						([mod, active]) =>
							modifiers[mod as keyof ModifierKeys] === active,
					) &&
					(runInInputs || !isInputField)
				) {
					if (preventDefault) {
						event.preventDefault()
					}

					if (global && globalShortcutActions[shortcutName]) {
						globalShortcutActions[shortcutName]()
					} else if (shortcuts[shortcutName]) {
						shortcuts[shortcutName]()
					}
					return
				}
			}
		},
		[shortcuts],
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
		[shortcuts],
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
