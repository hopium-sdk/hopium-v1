const MAX_EXPANDED_DECIMALS = 15;

const DEFAULT_OPTIONS = {
  useRounding: false, // if true, use Math.round instead of Math.trunc
  largeNumberDecimals: 2, // decimals to show for K/M/B/T formatting
  mediumNumberDecimals: 2, // > 1
  smallNumberSubscriptZeroes: 3, // threshold for “0.0<sub>n</sub>…” style
  smallNumberSubscriptDecimals: 4, // how many digits after significant zeros
  smallNumberNormalDecimals: 9, // how many digits after significant zeros
  type: "jsx",
};

type FormatterOptions = Partial<typeof DEFAULT_OPTIONS>;

// Suffixes from largest to smallest
const SUFFIXES: { value: number; symbol: string }[] = [
  { value: 1e12, symbol: "T" },
  { value: 1e9, symbol: "B" },
  { value: 1e6, symbol: "M" },
  { value: 1e3, symbol: "K" },
];

function applyRounding(n: number, decimals: number, round: boolean) {
  const factor = 10 ** decimals;
  const v = n * factor;

  const eps = Number.EPSILON * factor;
  const fudge = (v >= 0 ? 1 : -1) * eps;
  const adjusted = v + fudge;

  const intPart = round ? Math.round(adjusted) : Math.trunc(adjusted);

  return intPart / factor;
}

const _formatLargeNumbers = ({ value, sign, opts }: { value: number; sign: string; opts?: FormatterOptions }) => {
  const { largeNumberDecimals, useRounding } = {
    ...DEFAULT_OPTIONS,
    ...opts,
  };

  for (const { value: threshold, symbol } of SUFFIXES) {
    if (value >= threshold) {
      const formatted = applyRounding(value / threshold, largeNumberDecimals, useRounding).toFixed(largeNumberDecimals);
      return `${sign}${formatted}${symbol}`;
    }
  }

  return null;
};

const _formatMediumNumbers = ({ value, sign, opts }: { value: number; sign: string; opts?: FormatterOptions }) => {
  const { mediumNumberDecimals } = {
    ...DEFAULT_OPTIONS,
    ...opts,
  };

  if (value >= 1) {
    return (
      sign +
      value.toLocaleString("en-US", {
        maximumFractionDigits: mediumNumberDecimals,
        minimumFractionDigits: mediumNumberDecimals,
      })
    );
  }

  return null;
};

const _formatSmallNumbers = ({ value, sign, opts }: { value: number; sign: string; opts?: FormatterOptions }) => {
  const { smallNumberSubscriptZeroes, smallNumberSubscriptDecimals, smallNumberNormalDecimals, useRounding, type } = {
    ...DEFAULT_OPTIONS,
    ...opts,
  };

  // 0 < value < 1: more than threshold decimals e.g 0.000012
  const asFixed = value.toFixed(MAX_EXPANDED_DECIMALS); // e.g. "0.000123450000000"
  const match = asFixed.match(/^0\.(0*)(\d.*)/);
  const leadingZeroes = match && match[1] ? match[1].length : 0;
  const trailingDigits = match && match[2] ? match[2] : "";

  // If there are more zeroes than threshold, use subscript notation
  if (leadingZeroes > smallNumberSubscriptZeroes) {
    const displayed = trailingDigits.slice(0, smallNumberSubscriptDecimals);

    if (type === "jsx") {
      return (
        <span>
          {sign}0.0<sub>{leadingZeroes}</sub>
          {displayed}
        </span>
      );
    }

    const smallCount = String(leadingZeroes)
      .split("")
      .map((digit) => String.fromCharCode(8320 + parseInt(digit)))
      .join("");

    return `${sign}0.0${smallCount}${displayed}`;
  }

  // 0 < value < 1: less than threshold decimals e.g 0.01
  // Otherwise just show up to maxVisibleDecimalsPlaces
  const totalDecimals = Math.min(leadingZeroes + smallNumberSubscriptDecimals, smallNumberNormalDecimals);
  const cropped = applyRounding(value, totalDecimals, useRounding).toFixed(totalDecimals); // remove leading "0"
  if (type === "jsx") {
    return (
      <span>
        {sign}
        {cropped}
      </span>
    );
  }

  return `${sign}${cropped}`;
};

function _formatNumber(rawValue: number, opts?: FormatterOptions): React.ReactNode;
function _formatNumber(rawValue: number, opts?: FormatterOptions): string;
function _formatNumber(rawValue: number, opts?: FormatterOptions): string | React.ReactNode {
  if (Object.is(rawValue, -0) || rawValue === 0) {
    return "0.00";
  }
  const sign = rawValue < 0 ? "-" : "";
  const value = Math.abs(rawValue);

  const formattedLargeNumber = _formatLargeNumbers({ value, sign, opts });
  if (formattedLargeNumber) {
    return formattedLargeNumber;
  }

  const formattedMediumNumber = _formatMediumNumbers({ value, sign, opts });
  if (formattedMediumNumber) {
    return formattedMediumNumber;
  }

  return _formatSmallNumbers({ value, sign, opts });
}

const _truncateDecimals = (number: number, decimals: number) => {
  const factor = 10 ** decimals;
  return Math.trunc(number * factor) / factor;
};

export const NUMBERS_WEB = {
  formatNumber: _formatNumber,
  truncateDecimals: _truncateDecimals,
};
