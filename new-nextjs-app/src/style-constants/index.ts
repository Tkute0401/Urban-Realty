export * from './tokens';
export * from './color-schemes';
export const toCssVars = (scheme: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(scheme).map(([key, value]) => [
      `--color-${key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}`,
      value,
    ]),
  );
