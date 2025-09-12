import { tokens } from './tokens'
import { lightScheme, darkScheme, type SemanticScheme } from './color-schemes'

export { tokens, lightScheme, darkScheme }

export function getActiveScheme(theme: 'light' | 'dark'): SemanticScheme {
  return theme === 'dark' ? darkScheme : lightScheme
}

export function toCssVars(scheme: SemanticScheme): Record<string, string> {
  return {
    '--color-bg': scheme.bg,
    '--color-surface': scheme.surface,
    '--color-surface-elevated': scheme.surfaceElevated,
    '--color-text': scheme.text,
    '--color-text-muted': scheme.textMuted,
    '--color-primary': scheme.primary,
    '--color-primary-hover': scheme.primaryHover,
    '--color-primary-contrast': scheme.primaryContrast,
    '--color-secondary': scheme.secondary,
    '--color-accent': scheme.accent,
    '--color-success': scheme.success,
    '--color-warning': scheme.warning,
    '--color-danger': scheme.danger,
    '--color-border': scheme.border,
    '--focus-ring': scheme.focusRing,
  }
}

