/**
 * Deeply compares two objects and returns only the changed fields.
 * Returns null if there are no changes.
 */
export function deepDiff<T extends Record<string, unknown>>(oldData: T, newData: T): Partial<T> | null {
  let hasChanges = false;

  const diff: Record<string, unknown> = {};

  for (const key of Object.keys(newData)) {
    const oldVal = oldData[key];
    const newVal = newData[key];

    if (isObject(oldVal) && isObject(newVal)) {
      const nestedDiff = deepDiff(oldVal, newVal);
      if (nestedDiff && Object.keys(nestedDiff).length > 0) {
        diff[key] = nestedDiff;
        hasChanges = true;
      }
    } else if (!isEqual(oldVal, newVal)) {
      diff[key] = newVal;
      hasChanges = true;
    }
  }

  return hasChanges ? (diff as Partial<T>) : null;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Handles NaN, arrays, and simple types */
function isEqual(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, i) => isEqual(val, b[i]));
  }
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  return a === b;
}
