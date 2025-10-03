import type { ButtonVariant } from './types'

export const BACKGROUND_VARIANT_MAP: Record<ButtonVariant, string> = {
  contained: 'var(--xmlfy-primary)',
  outlined: 'var(--xmlfy-secondary)',
}

export const BORDER_VARIANT_MAP: Record<ButtonVariant, string> = {
  contained: 'none',
  outlined: '1px solid var(--xmlfy-primary)',
}

export const COLOR_VARIANT_MAP: Record<ButtonVariant, string> = {
  contained: 'var(--xmlfy-secondary)',
  outlined: 'var(--xmlfy-primary)',
}
