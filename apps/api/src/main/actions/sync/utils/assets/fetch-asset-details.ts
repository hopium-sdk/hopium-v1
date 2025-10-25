import { T_Asset } from "@repo/convex/schema";
import { HOPIUM } from "@/main/lib/hopium";
import { uploadImageFromUrl } from "@/main/fns/blob/upload-image-from-url/upload-image-from-url";
import { COMMON_CONSTANTS } from "@repo/common/utils/constants";
import { normalizeAddress } from "@repo/common/utils/address";
import { fetchAssetDetailsFromGeckoTerminal } from "@repo/common/utils/asset-details";

export const fetchAssetDetails = async ({ tokenAddress }: { tokenAddress: string }) => {
  try {
    const find = await fetchAssetDetailsFromGeckoTerminal({ tokenAddress });

    if (find.image_url) {
      await uploadImageFromUrl({ url: find.image_url, name: `token_images/${COMMON_CONSTANTS.networkSelected}/${normalizeAddress(find.address)}` });
    }

    const token: T_Asset = {
      docId: normalizeAddress(find.address),
      address: normalizeAddress(find.address),
      name: find.name,
      symbol: find.symbol,
      decimals: find.decimals,
      tv_ticker: "",
    };

    return token;
  } catch {
    const tokenDetails = await HOPIUM.fns.erc20.fetchTokenDetails({ tokenAddress: tokenAddress as `0x${string}` });

    const token: T_Asset = {
      docId: normalizeAddress(tokenAddress),
      address: normalizeAddress(tokenAddress),
      name: tokenDetails.name,
      symbol: tokenDetails.symbol,
      decimals: tokenDetails.decimals,
      tv_ticker: "",
    };

    return token;
  }
};
