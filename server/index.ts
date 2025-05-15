import express from "express";
import { ChromaClient } from "chromadb";
import dotenv from "dotenv";
import path from "path";
import cors from 'cors';
dotenv.config();
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://fabxmporizzqflnftavs.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;

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

const USER_INPUT = "What is the community archive project?";

// delete user tweets and fail silently if it doesn't work
const deleteOldUserTweetsCollection = async () => {
  try {
    console.log("try to delete user tweets");
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
  console.log("fetching tweets to put in chroma");
  const response = await fetch(url);
  const data = await response.json();
  let recentTweets;
  if (data.tweets.length > 500) {
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
const openRouterRequest = async (userInput: any, relevantTweets: any): Promise<string> => {
  const prompt = `Based off the style, tone, and content of your past tweets, respond to the users question: ${userInput} \n
      Here is a reference to your past tweets in the form of a numbered string: ${relevantTweets} \n 
      Respond directly to the user \n`;

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
  const message = data?.choices[0]?.message?.content;
  return message;
};

// main function sets up chroma and retuns the message
const retriveRelevantTweets = async (prompt: string, username: string) => {
  await deleteOldUserTweetsCollection();
  const collection = await createNewTweetsCollection();
  const documentsAndIds = await fetchTweets(
    `https://fabxmporizzqflnftavs.supabase.co/storage/v1/object/public/archives/${username}/archive.json`
    // "https://fabxmporizzqflnftavs.supabase.co/storage/v1/object/public/archives/defenderofbasic/archive.json"
  );
  await collection.add(documentsAndIds);

  const results = await collection.query({
    queryTexts: USER_INPUT, // Chroma will embed this for you
    nResults: 10, // how many results to return
  });

  const relevantTweetResults = await results.documents[0];
  let relevantTweetsNumberedString = "";
  relevantTweetResults.forEach((tweet, idx) => {
    // console.log('tweet, idx', tweet, idx);
    const numberedTweet = `${idx}: ${tweet} \n`;
    relevantTweetsNumberedString += numberedTweet;
  });

  const responseMessage = await openRouterRequest(
    prompt,
    relevantTweetsNumberedString
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
  const { prompt, user } = req.body;
  const message = await retriveRelevantTweets(prompt, user);
  res.json(message);
});

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