import './App.css';
import { useState, useEffect } from 'react';

const App = () => {
  const [userTweets, setUserTweets] = useState([]);
  const [response, setResponse] = useState('');

  useEffect(() => {
    (async () => {
      // fetch all tweets from a specific user and load them into state as a numbered string
      const response = await fetch('https://fabxmporizzqflnftavs.supabase.co/storage/v1/object/public/archives/defenderofbasic/archive.json');
      const data = await response.json();
      const last100Tweets = data.tweets.slice(-10);
      console.log('last100Tweets', last100Tweets);

      const last100TweetsTextOnly = [];
      last100Tweets.forEach(tweet => {
        last100TweetsTextOnly.push(tweet.tweet.full_text);
      })

      const tweetList = last100TweetsTextOnly.map((tweet, i) => `${i + 1}. ${tweet}`).join('\n');
      // setUserTweets(last100Tweets);
      setUserTweets(last100TweetsTextOnly);
    })()
  }, [])

  const openRouterRequest = async (userInput) => {
    console.log('api request called');
    console.log('userTweets', userTweets);
    const prompt = `Based off the style, tone, and content of your past tweets, respond to the users question: ${userInput} \n
    Here is a reference to your past tweets in the form of a numbered string: ${userTweets} \n 
    Respond directly to the user \n`;
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_OPEN_ROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-chat:free",
        "messages": [
          {
            "role": "user",
            "content": prompt
          }
        ]
      })
    });
    const data = await response.json();
    const message = data?.choices[0]?.message?.content
    setResponse(message);
  }

  return (
    <div className='bg-amber-500 flex flex-col items-center' onClick={() => openRouterRequest('What should I do to become a better programmer while unemployed and job hunting?')}>
      <div>Tweet Bot AI</div>
      {response && <div>{response}</div>}
    </div>
  )
}

export default App
