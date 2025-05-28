import { ChromaClient } from "chromadb";

const chromaClient = new ChromaClient({ path: "http://localhost:8000" });

// delete user tweets and fail silently if it doesn't work
export const getCurrentCollection = async () => {
  try {
    return await chromaClient.getCollection({ name: "user_tweets" } as any);
  } catch {
    return null;
  }
};

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
export const createNewTweetsCollection = async (username: string) => {
  return await chromaClient.createCollection({
    name: "user_tweets",
    metadata: {
      username: username,
    },
  });
};
