import { CONVEX } from "@/main/lib/convex";
import { T_HoldingToken } from "@repo/convex/schema";
import { HOPIUM } from "@/main/lib/hopium";
import { CONSTANTS } from "@/main/lib/constants";
import { uploadImageFromUrl } from "@/main/fns/blob/upload-image-from-url/upload-image-from-url";

export const fetchTokenDetails = async ({ tokenAddress, syncBlockNumber }: { tokenAddress: `0x${string}`; syncBlockNumber: number }) => {
  const find =
    CONSTANTS.networkSelected == "mainnet"
      ? await CONVEX.httpClient.query(CONVEX.api.fns.defaultTokens.getByAddress.default, {
          address: tokenAddress,
        })
      : null;

  if (find) {
    if (find.imageUrl) {
      await uploadImageFromUrl({ url: find.imageUrl, name: `token_images/${find.address}` });
    }

    const token: T_HoldingToken = {
      address: find.address,
      name: find.name,
      symbol: find.symbol,
      decimals: find.decimals,
      tv_ticker: "",
      syncBlockNumber_: syncBlockNumber,
    };

    return token;
  }

  const tokenDetails = await HOPIUM.fns.erc20.fetchTokenDetails({ tokenAddress });

  const token: T_HoldingToken = {
    address: tokenAddress,
    name: tokenDetails.name,
    symbol: tokenDetails.symbol,
    decimals: tokenDetails.decimals,
    tv_ticker: "",
    syncBlockNumber_: syncBlockNumber,
  };

  return token;
};
