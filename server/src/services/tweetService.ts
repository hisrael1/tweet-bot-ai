// fetch tweets and return them as an obj with keys document and id
export const fetchTweets = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  let recentTweets;
  if (data.tweets.length > 500) {
    recentTweets = data.tweets.slice(0, 500);
  } else {
    recentTweets = data.tweets;
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
