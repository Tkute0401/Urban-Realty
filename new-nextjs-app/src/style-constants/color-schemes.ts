import { tokens } from './tokens'

export type SemanticScheme = {
  bg: string
  surface: string
  surfaceElevated: string
  text: string
  textMuted: string
  primary: string
  primaryHover: string
  primaryContrast: string
  secondary: string
  accent: string
  success: string
  warning: string
  danger: string
  border: string
  focusRing: string
}

export const lightScheme: SemanticScheme = {
  bg: tokens.colors.base.gray50,
  surface: tokens.colors.base.white,
  surfaceElevated: tokens.colors.base.gray100,
  text: tokens.colors.base.gray900,
  textMuted: tokens.colors.base.gray600,
  primary: tokens.colors.base.brandPrimary,
  primaryHover: tokens.colors.base.brandPrimaryDark,
  primaryContrast: tokens.colors.base.white,
  secondary: tokens.colors.base.gray800,
  accent: tokens.colors.base.accent,
  success: tokens.colors.base.success,
  warning: tokens.colors.base.warning,
  danger: tokens.colors.base.danger,
  border: tokens.colors.base.gray200,
  focusRing: tokens.colors.base.brandPrimary
}

export const darkScheme: SemanticScheme = {
  bg: tokens.colors.base.gray900,
  surface: tokens.colors.base.gray800,
  surfaceElevated: tokens.colors.base.gray700,
  text: tokens.colors.base.gray50,
  textMuted: tokens.colors.base.gray400,
  primary: tokens.colors.base.brandPrimary,
  primaryHover: tokens.colors.base.brandPrimaryDark,
  primaryContrast: tokens.colors.base.black,
  secondary: tokens.colors.base.gray100,
  accent: tokens.colors.base.accent,
  success: tokens.colors.base.success,
  warning: tokens.colors.base.warning,
  danger: tokens.colors.base.danger,
  border: tokens.colors.base.gray700,
  focusRing: tokens.colors.base.brandPrimary
}

