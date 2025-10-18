import { DatafeedConfiguration, ResolutionString } from "@/public/tv/charting_library/charting_library";

export const SUPPORTED_RESOLUTIONS = ["1", "5", "15", "60", "240", "1D", "1W", "1M"] as ResolutionString[];

export const getConfig = () => {
  const configurationData: DatafeedConfiguration = {
    supported_resolutions: SUPPORTED_RESOLUTIONS,
  };

  return configurationData;
};
