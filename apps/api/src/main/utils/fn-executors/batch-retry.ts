export type T_BatchRetry<T> = {
  tasks: Array<() => Promise<T>>;
  timeoutMs?: number;
  backoffBaseMs?: number;
  backoffMultiplier?: number;
};

export async function batchRetry<T>(opts: T_BatchRetry<T>): Promise<T[]> {
  const { tasks, timeoutMs = 10000, backoffBaseMs = 200, backoffMultiplier = 2 } = opts;
  if (!Array.isArray(tasks)) throw new TypeError("tasks must be an array");
  if (timeoutMs <= 0) throw new RangeError("timeoutMs must be > 0");

  const deadline = Date.now() + timeoutMs;

  const results: (T | undefined)[] = new Array(tasks.length);
  const errors: (unknown | undefined)[] = new Array(tasks.length);
  let remaining = tasks.length;

  type Item = { i: number; fn: () => Promise<T> };
  type Group = { items: Item[]; retryLevel: number };

  const queue: Group[] = [{ items: tasks.map((fn, i) => ({ i, fn })), retryLevel: 0 }];

  const timeLeft = () => Math.max(0, deadline - Date.now());
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  function withTimeout<U>(p: Promise<U>, ms: number): Promise<U> {
    return new Promise<U>((resolve, reject) => {
      const t = setTimeout(() => {
        const err = new Error("Global timeout while awaiting task");
        (err as any).__globalTimeout = true;
        reject(err);
      }, ms);
      p.then(
        (v) => {
          clearTimeout(t);
          resolve(v);
        },
        (e) => {
          clearTimeout(t);
          reject(e);
        }
      );
    });
  }

  while (remaining > 0) {
    if (timeLeft() <= 0) {
      const err = new Error("Timed out before resolving all tasks");
      (err as any).errors = errors.slice(); // expose errors instead of partialResults
      throw err;
    }

    const group = queue.shift();
    if (!group || group.items.length === 0) {
      const err = new Error("Stalled: no groups to process but tasks remain");
      (err as any).errors = errors.slice();
      throw err;
    }

    // Backoff for retries beyond first attempt.
    if (group.retryLevel > 0) {
      const delay = backoffBaseMs * Math.pow(backoffMultiplier, group.retryLevel - 1);
      const ms = Math.min(delay, timeLeft());
      if (ms > 0) await sleep(ms);
    }

    const ms = timeLeft();
    const attempts = group.items.map(({ i, fn }) =>
      withTimeout(
        fn().then(
          (val) => ({ i, ok: true as const, val }),
          (err) => ({ i, ok: false as const, err })
        ),
        ms
      )
    );

    let settled: Array<{ i: number; ok: true; val: T } | { i: number; ok: false; err: unknown }>;
    try {
      settled = await Promise.all(attempts);
    } catch (e: any) {
      if (e && e.__globalTimeout) {
        const err = new Error("Timed out before resolving all tasks");
        (err as any).errors = errors.slice();
        throw err;
      }
      // Treat as if every item in the group failed with the same error
      settled = group.items.map(({ i }) => ({ i, ok: false as const, err: e }));
    }

    const failures: Item[] = [];
    for (const r of settled) {
      if (r.ok) {
        if (results[r.i] === undefined) {
          results[r.i] = r.val;
          remaining--;
        }
        errors[r.i] = undefined; // success clears any prior error
      } else {
        errors[r.i] = r.err; // record the latest failure for this index
        const orig = group.items.find((g) => g.i === r.i)!;
        failures.push(orig);
      }
    }

    if (failures.length > 0) {
      if (timeLeft() <= 0) {
        const err = new Error("Timed out before resolving all tasks");
        (err as any).errors = errors.slice();
        throw err;
      }
      const nextLevel = group.retryLevel + 1;
      if (failures.length === 1) {
        queue.push({ items: failures, retryLevel: nextLevel });
      } else {
        const mid = Math.floor(failures.length / 2);
        queue.push({ items: failures.slice(0, mid), retryLevel: nextLevel });
        queue.push({ items: failures.slice(mid), retryLevel: nextLevel });
      }
    }
  }

  return results as T[];
}
