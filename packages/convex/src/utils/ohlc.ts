import { T_OhlcTimeframe } from "../../../convex/convex/schema/ohlc";

export type Unit = "m" | "h" | "d" | "w" | "M";
export const TF_RE = /^(\d+)([mhdwM])$/;

export function parseTimeframe(tf: T_OhlcTimeframe): { n: number; unit: Unit } {
  const match = TF_RE.exec(tf);
  if (!match) throw new Error(`Invalid timeframe: ${tf}`);
  const n = parseInt(match[1]!, 10);
  const unit = match[2]! as Unit;
  if (!Number.isFinite(n) || n <= 0) throw new Error(`Invalid timeframe number: ${tf}`);
  return { n, unit };
}

const MS_PER_MIN = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MIN;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const MS_PER_WEEK = 7 * MS_PER_DAY;

const MS_PER: Record<Exclude<Unit, "w" | "M">, number> = {
  m: MS_PER_MIN,
  h: MS_PER_HOUR,
  d: MS_PER_DAY,
};

// ---------- helpers (UTC) ----------

// Floor timestamp to fixed-size m/h/d buckets in UTC.
function floorFixedUTC(timestamp: number, n: number, unit: "m" | "h" | "d"): number {
  const size = n * MS_PER[unit];
  return Math.floor(timestamp / size) * size;
}

// First day of ISO week (Monday 00:00:00.000 UTC) that contains `timestamp`.
function isoWeekStartUTC(timestamp: number): number {
  const d = new Date(timestamp);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const date = d.getUTCDate();

  // JS: 0=Sun ... 6=Sat  -> ISO shift: Mon=0 ... Sun=6
  const jsDow = d.getUTCDay(); // 0..6
  const isoDow = (jsDow + 6) % 7; // Mon=0 ... Sun=6
  const mondayDate = date - isoDow;

  return Date.UTC(y, m, mondayDate, 0, 0, 0, 0);
}

// Floor to start of an n-ISO-week bucket aligned to the epoch Monday 1970-01-05.
const EPOCH_MONDAY_UTC = Date.UTC(1970, 0, 5, 0, 0, 0, 0); // This was a Monday.
function floorIsoWeeksUTC(timestamp: number, n: number): number {
  const thisWeekStart = isoWeekStartUTC(timestamp);
  const weeksSinceEpoch = Math.floor((thisWeekStart - EPOCH_MONDAY_UTC) / MS_PER_WEEK);
  const bucketIndex = Math.floor(weeksSinceEpoch / n) * n;
  return EPOCH_MONDAY_UTC + bucketIndex * MS_PER_WEEK;
}

// Month helpers (true calendar months).
function floorMonthUTC(timestamp: number, n: number): number {
  const d = new Date(timestamp);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth(); // 0..11
  const monthIndex = year * 12 + month;
  const bucketStartMonthIndex = Math.floor(monthIndex / n) * n;
  const bucketYear = Math.floor(bucketStartMonthIndex / 12);
  const bucketMonth = bucketStartMonthIndex % 12;
  return Date.UTC(bucketYear, bucketMonth, 1, 0, 0, 0, 0);
}
export function addMonthsUTC(ts: number, n: number): number {
  const d = new Date(ts);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const total = y * 12 + m + n;
  const ny = Math.floor(total / 12);
  const nm = total % 12;
  return Date.UTC(ny, nm, 1, 0, 0, 0, 0);
}

// ---------- exported API ----------

/**
 * Returns the bucket size in ms for the given timeframe.
 * - m/h/d: fixed size
 * - w: n * 7 days
 * - M: true calendar size based on `referenceTimestamp`
 */
export function getBucketSizeMs(tf: T_OhlcTimeframe, referenceTimestamp: number = Date.now()): number {
  const { n, unit } = parseTimeframe(tf);

  if (unit === "M") {
    const start = floorMonthUTC(referenceTimestamp, n);
    return addMonthsUTC(start, n) - start;
  }
  if (unit === "w") {
    return n * MS_PER_WEEK; // weeks are fixed-length (7 days) in UTC
  }
  return n * MS_PER[unit];
}

/**
 * Floors a timestamp (ms) to the start of its bucket, in UTC.
 * - m/h/d: fixed UTC bucketing
 * - w: ISO week start (Monday 00:00:00 UTC), aligned to n-week epochs from 1970-01-05
 * - M: calendar month start (UTC), aligned to every n months
 */
export function getBucketTimestamp(timestamp: number, timeframe: T_OhlcTimeframe): number {
  const { n, unit } = parseTimeframe(timeframe);

  if (unit === "M") return floorMonthUTC(timestamp, n);
  if (unit === "w") return floorIsoWeeksUTC(timestamp, n);
  return floorFixedUTC(timestamp, n, unit);
}

export function normalizeTs(ts: number): number {
  if (!Number.isFinite(ts)) throw new Error(`Invalid timestamp: ${ts}`);
  return ts < 1e12 ? Math.trunc(ts) * 1000 : Math.trunc(ts);
}
