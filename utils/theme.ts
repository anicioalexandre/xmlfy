import { darkTheme, lightTheme } from 'styles/theme'
import type { Theme, ThemeMode } from 'types/theme'

export const getTheme = (mode: ThemeMode) => {
  return mode === 'dark' ? darkTheme : lightTheme
}

export const setCSSVariables = (element: HTMLElement, theme: Theme) => {
  element.style.setProperty('--xmlfy-primary', theme.primary)
  element.style.setProperty('--xmlfy-secondary', theme.secondary)
  element.style.setProperty('--xmlfy-error', theme.error)
  element.style.setProperty('--xmlfy-text', theme.text)
  element.style.setProperty('--xmlfy-disabled', theme.disabled)
  element.style.setProperty('--xmlfy-black', theme.black)
  element.style.setProperty('--xmlfy-white', theme.white)
}
