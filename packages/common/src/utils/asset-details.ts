import { COMMON_CONSTANTS } from "./constants";

const chain = COMMON_CONSTANTS.networkSelected == "mainnet" ? "eth" : "base";

export const fetchAssetDetailsFromGeckoTerminal = async ({ tokenAddress }: { tokenAddress: string }) => {
  const response = await fetch(`https://api.geckoterminal.com/api/v2/networks/${chain}/tokens/${tokenAddress}`);
  const data = await response.json();

  if (
    data &&
    data.data &&
    data.data &&
    data.data.attributes &&
    data.data.attributes.name &&
    data.data.attributes.symbol &&
    data.data.attributes.decimals &&
    data.data.attributes.image_url
  ) {
    return {
      address: tokenAddress,
      name: data.data.attributes.name,
      symbol: data.data.attributes.symbol,
      decimals: data.data.attributes.decimals,
      image_url: data.data.attributes.image_url,
    };
  } else {
    throw new Error("Failed to fetch asset details from Gecko Terminal");
  }
};
