import { CONVEX } from "@/main/lib/convex";
import { T_Asset } from "@repo/convex/schema";
import { HOPIUM } from "@/main/lib/hopium";
import { uploadImageFromUrl } from "@/main/fns/blob/upload-image-from-url/upload-image-from-url";
import { COMMON_CONSTANTS } from "@repo/common/utils/constants";

export const fetchAssetDetails = async ({ tokenAddress, syncBlockNumber }: { tokenAddress: string; syncBlockNumber: number }) => {
  const find =
    COMMON_CONSTANTS.networkSelected == "mainnet"
      ? await CONVEX.httpClient.query(CONVEX.api.fns.defaultTokens.getByAddress.default, {
          address: tokenAddress,
        })
      : null;

  if (find) {
    if (find.imageUrl) {
      await uploadImageFromUrl({ url: find.imageUrl, name: `token_images/${find.address}` });
    }

    const token: T_Asset = {
      address: find.address,
      name: find.name,
      symbol: find.symbol,
      decimals: find.decimals,
      tv_ticker: "",
      syncBlockNumber_: syncBlockNumber,
    };

    return token;
  }

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
};
