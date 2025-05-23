import type { Message } from "../../../shared/types";
import {
  deleteOldUserTweetsCollection,
  createNewTweetsCollection,
} from "./chroma";
import { fetchTweets } from "./tweetService";

// this is the request to open router. Returns the text
export const openRouterRequest = async (
  userInput: any,
  relevantTweets: any,
  pastMessagesString: string,
  username: string
): Promise<string> => {
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
  const message = data?.choices[0]?.message?.content;
  return message;
};

export const stringifyConvoHistory = (pastMessages: Message[]) => {
  let convoHistoryString = "";
  pastMessages.forEach((message) => {
    const messageStr = `${message.isBot ? "Bot" : "User"}: ${message.text} \n`;
    convoHistoryString += messageStr;
  });
  return convoHistoryString;
};

// main function sets up chroma and retuns the message
export const retriveRelevantTweets = async (
  prompt: string,
  username: string,
  pastMessages: Message[]
) => {
  console.log('prompt', prompt);
  const pastMessagesString: string = stringifyConvoHistory(pastMessages);
  await deleteOldUserTweetsCollection();
  const collection = await createNewTweetsCollection();
  // const documentsAndIds = await fetchTweets(
  //   `https://fabxmporizzqflnftavs.supabase.co/storage/v1/object/public/archives/${username}/archive.json`
  // );
  const documentsAndIds = await fetchTweets(username);
  await collection.add(documentsAndIds);

  const results = await collection.query({
    queryTexts: prompt, // Chroma will embed this for you
    // queryTexts: userInput, // Chroma will embed this for you
    nResults: 10, // how many results to return
  });

  console.log('results', results);

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

  return responseMessage;
};
