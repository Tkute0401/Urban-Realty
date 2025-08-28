## Theme System Implementation and Changes

### Overview
Added a variable-driven light/dark theme across the client app, with a header toggle. The theme synchronizes CSS variables and MUI palette mode and persists the user’s choice in local storage.

### What was added/changed

- Theme context reworked for MUI + CSS sync and persistence:
  - File: `client/src/context/ThemeContext.jsx`
  - Created `ThemeModeProvider` exposing `{ mode, toggleColorMode }`
  - Uses MUI `createTheme` with dynamic `palette.mode`
  - Persists mode in `localStorage` and sets `data-theme` attribute on `<html>` for CSS variable switching

- Global CSS variables and data-theme switching:
  - File: `client/src/index.css`
  - Added root-level variables for colors (bg, text, header, accent, menu, etc.)
  - Added `[data-theme="dark"]` overrides
  - Updated body and scrollbar colors to use variables

- Header refactor to use variables and include theme toggle:
  - File: `client/src/components/common/Header.css`
  - Replaced hard-coded colors with CSS variables
  - Used `color-mix` for hover states
  - File: `client/src/components/common/Header.jsx`
  - Added theme toggle button for desktop and mobile
  - Connected to context via `useThemeContext()`

- App composition updated to single theme source of truth:
  - File: `client/src/main.jsx`
    - Wrapped app with `ThemeModeProvider`
  - File: `client/src/App.jsx`
    - Removed nested MUI `ThemeProvider` to avoid conflicts with the global provider

### Developer notes

- Access theme in components:
  - Use `const { mode, toggleColorMode } = useThemeContext();`
  - CSS respects the current theme via variables under `:root` and `[data-theme="dark"]`

- MUI components automatically pick up `palette.mode` through the provider.

- Persistence:
  - Selected theme stored in `localStorage` under key `theme-mode`
  - HTML `data-theme` updated on change for CSS variable switching

### Files touched

- `client/src/context/ThemeContext.jsx`
- `client/src/index.css`
- `client/src/components/common/Header.css`
- `client/src/components/common/Header.jsx`
- `client/src/main.jsx`
- `client/src/App.jsx`

### UI behavior

- Header now shows a Dark/Light toggle on both desktop and mobile menus.
- Theme choice persists across reloads and sessions.

