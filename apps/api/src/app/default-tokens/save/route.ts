import { tryRoute } from "@/main/utils/tryRoute";
import { NextResponse } from "next/server";
import { saveDefaultTokens } from "@/main/actions/default-tokens/save";

export const GET = tryRoute(async () => {
  const validatedTokens = await saveDefaultTokens();

  return NextResponse.json({
    message: validatedTokens,
  });
});
