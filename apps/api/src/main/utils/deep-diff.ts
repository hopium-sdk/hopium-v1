/**
 * Deeply compares two objects and returns only the changed fields.
 * Returns null if there are no changes.
 */
export function deepDiff<T extends Record<string, any>>(oldData: T, newData: T): Partial<T> | null {
  let hasChanges = false;

  const diff: Record<string, any> = {};

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

function isObject(value: any): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Handles NaN, arrays, and simple types */
function isEqual(a: any, b: any): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, i) => isEqual(val, b[i]));
  }
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  return a === b;
}
