"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retriveRelevantTweets = exports.stringifyConvoHistory = exports.openRouterRequest = void 0;
const chroma_1 = require("./chroma");
const tweetService_1 = require("./tweetService");
// this is the request to open router. Returns the text
const openRouterRequest = (userInput, relevantTweets, pastMessagesString, username) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
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
    const response = yield fetch("https://openrouter.ai/api/v1/chat/completions", {
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
    });
    const data = yield response.json();
    const message = (_b = (_a = data === null || data === void 0 ? void 0 : data.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
    return message;
});
exports.openRouterRequest = openRouterRequest;
const stringifyConvoHistory = (pastMessages) => {
    let convoHistoryString = "";
    pastMessages.forEach((message) => {
        const messageStr = `${message.isBot ? "Bot" : "User"}: ${message.text} \n`;
        convoHistoryString += messageStr;
    });
    return convoHistoryString;
};
exports.stringifyConvoHistory = stringifyConvoHistory;
// main function sets up chroma and retuns the message
const retriveRelevantTweets = (prompt, username, pastMessages) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('prompt', prompt);
    const pastMessagesString = (0, exports.stringifyConvoHistory)(pastMessages);
    yield (0, chroma_1.deleteOldUserTweetsCollection)();
    const collection = yield (0, chroma_1.createNewTweetsCollection)();
    // const documentsAndIds = await fetchTweets(
    //   `https://fabxmporizzqflnftavs.supabase.co/storage/v1/object/public/archives/${username}/archive.json`
    // );
    const documentsAndIds = yield (0, tweetService_1.fetchTweets)(username);
    yield collection.add(documentsAndIds);
    const results = yield collection.query({
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
    const responseMessage = yield (0, exports.openRouterRequest)(prompt, relevantTweetsNumberedString, pastMessagesString, username);
    return responseMessage;
});
exports.retriveRelevantTweets = retriveRelevantTweets;
