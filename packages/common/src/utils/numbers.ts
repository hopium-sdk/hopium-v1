export function roundDown(value: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.floor(value * factor) / factor;
}
