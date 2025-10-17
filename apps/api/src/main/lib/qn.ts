import z from "zod";
import { CONSTANTS } from "./constants";

const qnUrl = CONSTANTS.qn.url;
const qnApiKey = CONSTANTS.qn.apiKey;

const KvResponseSchema = z.object({
  code: z.number(),
  msg: z.string(),
  data: z.object({}).loose().nullable().optional(),
});

const sendQnRequest = async ({ url, body, method }: { url: string; body?: string; method: string }) => {
  const qnHeaders = new Headers();
  qnHeaders.append("accept", "application/json");
  qnHeaders.append("Content-Type", "application/json");
  qnHeaders.append("x-api-key", qnApiKey);

  const response = await fetch(url, {
    method: method,
    redirect: "follow",
    headers: qnHeaders,
    body: method === "GET" ? undefined : body,
  });

  const data = await response.json();

  if (data.code !== 200) {
    throw new Error(`Failed to create KV list: ${data.msg}`);
  }

  const result = KvResponseSchema.parse(data);
  return result;
};

const getAllKvListsKeys = async () => {
  const response = await sendQnRequest({ url: `${qnUrl}/kv/rest/v1/lists`, method: "GET" });

  if (!response?.data?.keys) {
    throw new Error(`Failed to get all KV lists: ${response.msg}`);
  }

  return response.data.keys;
};

const getKvList = async ({ key }: { key: string }) => {
  const response = await sendQnRequest({ url: `${qnUrl}/kv/rest/v1/lists/${key}`, body: JSON.stringify({ key: key }), method: "GET" });

  if (!response?.data?.items) {
    throw new Error(`Failed to get KV list: ${response.msg}`);
  }

  return response.data.items as string[];
};

const addToKvList = async ({ key, values }: { key: string; values: string[] }) => {
  await sendQnRequest({ url: `${qnUrl}/kv/rest/v1/lists/${key}`, body: JSON.stringify({ addItems: values }), method: "PATCH" });

  return true;
};

const removeFromKvList = async ({ key, values }: { key: string; values: string[] }) => {
  await sendQnRequest({ url: `${qnUrl}/kv/rest/v1/lists/${key}`, body: JSON.stringify({ removeItems: values }), method: "PATCH" });

  return true;
};

const upsertKvList = async ({ key, values }: { key: string; values: string[] }) => {
  const currentValues = new Set(await getKvList({ key }));
  const newValues = values.filter((value) => !currentValues.has(value));

  await addToKvList({ key, values: newValues });

  return true;
};

export const QN = {
  getKvList,
  getAllKvListsKeys,
  addToKvList,
  removeFromKvList,
  upsertKvList,
};
