import { T_Asset } from "@repo/convex/schema";
import { HOPIUM } from "@/main/lib/hopium";
import { uploadImageFromUrl } from "@/main/fns/blob/upload-image-from-url/upload-image-from-url";
import { COMMON_CONSTANTS } from "@repo/common/utils/constants";
import { normalizeAddress } from "@repo/common/utils/address";

const chain = COMMON_CONSTANTS.networkSelected == "mainnet" ? "eth" : "base";

export const fetchAssetDetails = async ({ tokenAddress, syncBlockNumber }: { tokenAddress: string; syncBlockNumber: number }) => {
  try {
    const find = await fetchAssetDetailsFromGeckoTerminal({ tokenAddress });

    if (find.image_url) {
      await uploadImageFromUrl({ url: find.image_url, name: `token_images/${COMMON_CONSTANTS.networkSelected}/${normalizeAddress(find.address)}` });
    }

    const token: T_Asset = {
      address: normalizeAddress(find.address),
      name: find.name,
      symbol: find.symbol,
      decimals: find.decimals,
      tv_ticker: "",
      syncBlockNumber_: syncBlockNumber,
    };

    return token;
  } catch {
    const tokenDetails = await HOPIUM.fns.erc20.fetchTokenDetails({ tokenAddress: tokenAddress as `0x${string}` });

    const token: T_Asset = {
      address: tokenAddress,
      name: tokenDetails.name,
      symbol: tokenDetails.symbol,
      decimals: tokenDetails.decimals,
      tv_ticker: "",
      syncBlockNumber_: syncBlockNumber,
    };

    return token;
  }
};

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
