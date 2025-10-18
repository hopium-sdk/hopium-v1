import { ResolutionString } from "@/public/tv/charting_library/charting_library";
import { OHLC_TIMEFRAMES, T_OhlcTimeframe } from "@repo/convex/schema";

export const convertResolution = (resolution: ResolutionString): T_OhlcTimeframe => {
  // Match number + optional unit (like 1, 60, 1D, 1W, 1M)
  const match = resolution.match(/^(\d+)([A-Za-z])?$/);
  if (!match) throw new Error(`Invalid resolution: ${resolution}`);

  const value = parseInt(match[1]!, 10);
  const unit = match[2];
  let converted: string;

  switch (unit) {
    case undefined: {
      // no unit means minutes
      if (value < 60) converted = `${value}m`;
      else if (value % 60 === 0) converted = `${value / 60}h`;
      else throw new Error(`Unrecognized minute/hour format: ${resolution}`);
      break;
    }

    case "D":
      converted = `${value}d`;
      break;

    case "W":
      converted = `${value}w`;
      break;

    case "M":
      converted = `${value}M`;
      break;

    case "S":
    case "T":
      throw new Error(`${unit} resolution not supported in OHLC_TIMEFRAMES`);

    default:
      throw new Error(`Unknown unit: ${unit}`);
  }

  // ✅ Only return values included in OHLC_TIMEFRAMES
  if (!OHLC_TIMEFRAMES.includes(converted as T_OhlcTimeframe)) {
    throw new Error(`Unsupported resolution: ${converted}`);
  }

  return converted as T_OhlcTimeframe;
};
