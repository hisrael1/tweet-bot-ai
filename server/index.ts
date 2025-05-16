import express from "express";
import { ChromaClient } from "chromadb";
import dotenv from "dotenv";
import path from "path";
import cors from 'cors';
dotenv.config();
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://fabxmporizzqflnftavs.supabase.co';
// const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;
import type { Message } from '../shared/types';

const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());
const port = 3000;

const chromaClient = new ChromaClient({ path: "http://localhost:8000" });

// delete user tweets and fail silently if it doesn't work
const deleteOldUserTweetsCollection = async () => {
  try {
    await chromaClient.deleteCollection({
      name: "user_tweets",
    });
  } catch (error) {
    console.log(error);
  }
};

// create new tweets collection
const createNewTweetsCollection = async () => {
  return await chromaClient.createCollection({
    name: "user_tweets",
    metadata: {
      description: "Collection for tweet history to power chatbot",
    },
  });
};

// fetch tweets and return them as an obj with keys document and id
const fetchTweets = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  if (!data.tweets || data.tweets.length === 0) {
    throw new Error("No tweets found for this user");
  }
  let recentTweets;
  if (data?.tweets?.length > 500) {
    recentTweets = data.tweets.slice(0, 500);
  } else {
    recentTweets = data.tweets
  }
  
  interface DocumentsAndIds {
    documents: string[];
    ids: string[];
  }

  const documentsAndIds: DocumentsAndIds = {
    documents: [],
    ids: [],
  };

  recentTweets.forEach((tweet: any, idx: number) => {
    const tweetText = tweet.tweet.full_text;
    documentsAndIds.documents.push(tweetText);
    const idText = `id${idx}`;
    documentsAndIds.ids.push(idText);
  });

  return documentsAndIds;
};

// this is the request to open router. Returns the text
const openRouterRequest = async (userInput: any, relevantTweets: any, pastMessagesString: string, username: string): Promise<string> => {
  const prompt = `You are roleplaying as a Twitter user based on their tweet history. Your 
  responses should precisely match their writing style, vocabulary, sentence structure, 
  and personality. \n

  username: ${username} \n

  TWITTER PERSONA REFERENCE: ${relevantTweets} \n
  
  CONVERSATION HISTORY: ${pastMessagesString} \n

  When responding: \n
  1. Match the exact tone, attitude, and speech patterns shown in the tweets \n
  2. Use similar sentence length, punctuation style, and word choices \n
  3. Include any characteristic emoji usage, slang, or unique phrases \n
  4. Maintain the same level of formality/informality \n
  5. Mirror any opinion patterns or perspectives evident in the tweets \n
  6. Never mention that you're AI or that you're imitating someone \n
  7. Avoid using - or dashes \n
  8: Don't use emojis. \n

  Current message: ${userInput} \n

  Respond exactly as this Twitter user would in a direct message conversation:`;

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat:free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    }
  );
  const data = await response.json();
  console.log('data', data);
  const message = data?.choices[0]?.message?.content;
  return message;
};

const stringifyConvoHistory = (pastMessages: Message[]) => {
  let convoHistoryString = '';
  pastMessages.forEach(message => {
    const messageStr = `${message.isBot ? "Bot" : "User"}: ${message.text} \n`;
    convoHistoryString += messageStr;
  })
  return convoHistoryString
}

// main function sets up chroma and retuns the message
const retriveRelevantTweets = async (prompt: string, username: string, pastMessages: Message[]) => {
  const pastMessagesString: string = stringifyConvoHistory(pastMessages);
  await deleteOldUserTweetsCollection();
  const collection = await createNewTweetsCollection();
  const documentsAndIds = await fetchTweets(
    `https://fabxmporizzqflnftavs.supabase.co/storage/v1/object/public/archives/${username}/archive.json`
  );
  await collection.add(documentsAndIds);

  const results = await collection.query({
    queryTexts: prompt, // Chroma will embed this for you
    nResults: 10, // how many results to return
  });

  const relevantTweetResults = results.documents[0];
  let relevantTweetsNumberedString = "";
  relevantTweetResults.forEach((tweet, idx) => {
    const numberedTweet = `${idx}: ${tweet} \n`;
    relevantTweetsNumberedString += numberedTweet;
  });

  const responseMessage = await openRouterRequest(
    prompt,
    relevantTweetsNumberedString,
    pastMessagesString,
    username
  );

  return responseMessage
};

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`example app listening on http://localhost:${port}/`);
});

app.post("/api/query", async (req, res) => {
  try {
    const { prompt, user, pastMessages } = req.body;
    const message = await retriveRelevantTweets(prompt, user, pastMessages);
    res.json(message);
  } catch (error) {
    console.error('Error in /api/query:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    });
  }
});

// app.post("/api/query", async (req, res) => {
//   const { prompt, user, pastMessages } = req.body;
//   const message = await retriveRelevantTweets(prompt, user, pastMessages);
//   res.json(message);
// });

app.get("/api/allUsernames", async (req, res) => {
  try {    
    // Validate that environment variables are set
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_ANON_KEY');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch all usernames (simpler version without pagination for now)
    const { data, error } = await supabase
      .from('account')
      .select('username');
    
    if (error) throw error;
    
    // Return the data with minimal metadata
    res.json({
      usernames: data
    });
  } catch (error) {
    console.error('Error fetching usernames:', error);
    res.status(500).json({
      error: 'Failed to fetch usernames'
    });
  }
});