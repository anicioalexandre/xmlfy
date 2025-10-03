import type { ThemeMode } from './theme'

export type XMLfySettings = {
  enableXMLfy: boolean
  themeMode: ThemeMode
  closeInterfaceOnClickOutside: boolean
}

export type XMLfySettingsKeys = keyof XMLfySettings
