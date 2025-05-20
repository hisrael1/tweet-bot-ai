import { ChromaClient } from "chromadb";

const chromaClient = new ChromaClient({ path: "http://localhost:8000" });

// delete user tweets and fail silently if it doesn't work
export const deleteOldUserTweetsCollection = async () => {
  try {
    await chromaClient.deleteCollection({
      name: "user_tweets",
    });
  } catch (error) {
    console.log(error);
  }
};

// create new tweets collection
export const createNewTweetsCollection = async () => {
  return await chromaClient.createCollection({
    name: "user_tweets",
    metadata: {
      description: "Collection for tweet history to power chatbot",
    },
  });
};