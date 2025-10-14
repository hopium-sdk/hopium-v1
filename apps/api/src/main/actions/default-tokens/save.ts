import { z } from "zod";
import { fetchMutation } from "convex/nextjs";
import { CONVEX } from "@/main/lib/convex";

export const saveDefaultTokens = async () => {
  const validatedTokens = await fetchDefaultTokens();

  await fetchMutation(CONVEX.api.mutations.defaultTokens.upsert.default, {
    tokens: validatedTokens,
  });

  return validatedTokens;
};

const ethereum = {
  chainId: 1,
  address: "0x0000000000000000000000000000000000000000",
  name: "Ethereum",
  symbol: "ETH",
  decimals: 18,
  imageUrl: "https://token-icons.s3.amazonaws.com/eth.png",
};

const fetchDefaultTokens = async () => {
  const [result1, result2] = await Promise.all([
    fetch("https://raw.githubusercontent.com/Uniswap/extended-token-list/refs/heads/main/src/tokens/mainnet.json"),
    fetch("https://raw.githubusercontent.com/Uniswap/default-token-list/refs/heads/main/src/tokens/mainnet.json"),
  ]);
  const [data1, data2] = await Promise.all([result1.json(), result2.json()]);

  const fetchedTokens = [...data1, ...data2];

  //remove duplicates by address
  const uniqueTokens = fetchedTokens.filter((token, index, self) => index === self.findIndex((t) => t.address.toLowerCase() === token.address.toLowerCase()));

  const tokens: DefaultToken[] = uniqueTokens.map((token: any) => ({
    chainId: token.chainId,
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    imageUrl: token.logoURI || null,
  }));

  tokens.push(ethereum);

  const validatedTokens = z.array(DefaultTokenSchema).parse(tokens);

  return validatedTokens;
};

const DefaultTokenSchema = z.object({
  chainId: z.number(),
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
  decimals: z.number(),
  imageUrl: z.string().nullable(),
});

type DefaultToken = z.infer<typeof DefaultTokenSchema>;
