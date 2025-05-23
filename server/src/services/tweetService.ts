import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(supabaseUrl, supabaseKey);

const getAccountId = async (username: string): Promise<string> => {
  const { data } = await supabase
    .from("account")
    .select("account_id")
    .eq("username", username)
    .single();
  const { account_id } = data as any;
  return account_id;
};

const getTweetsByAccountId = async (accountId: string) => {
  const { data } = await supabase
    .schema("public")
    .from("tweets")
    .select("*")
    .eq("account_id", accountId)
    .order("created_at", { ascending: false })
    .limit(200);
  return data
};

const getRecentTweets = async (username: string) => {
  const accountId = await getAccountId(username);
  const recentTweets = await getTweetsByAccountId(accountId);
  return recentTweets
}

export const fetchTweets = async (username: string) => {
  const recentTweets = await getRecentTweets(username) as any;

  interface DocumentsAndIds {
    documents: string[];
    ids: string[];
  }

  const documentsAndIds: DocumentsAndIds = {
    documents: [],
    ids: [],
  };

  recentTweets.forEach((tweet: any, idx: number) => {
    const tweetText = tweet.full_text;
    documentsAndIds.documents.push(tweetText);
    const idText = `id${idx}`;
    documentsAndIds.ids.push(idText);
  });

  return documentsAndIds;
};