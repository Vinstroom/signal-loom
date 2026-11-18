/**
 * Formats payload transform data for human-readable output.
 */
export function formatPayloadTransforms(transforms: Array<{ from: string; to: string; applied: boolean }>) {
  return transforms
    .map(({ from, to, applied }) => {
      const status = applied ? 'applied' : 'skipped';
      return `  - ${status}: ${from} -> ${to}`;
    })
    .join('\n');
}
