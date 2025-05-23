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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTweets = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase_js_1 = require("@supabase/supabase-js");
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
const getAccountId = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield supabase
        .from("account")
        .select("account_id")
        .eq("username", username)
        .single();
    const { account_id } = data;
    return account_id;
});
const getTweetsByAccountId = (accountId) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield supabase
        .schema("public")
        .from("tweets")
        .select("*")
        .eq("account_id", accountId)
        .order("created_at", { ascending: false })
        .limit(200);
    return data;
});
const getRecentTweets = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const accountId = yield getAccountId(username);
    const recentTweets = yield getTweetsByAccountId(accountId);
    return recentTweets;
});
const fetchTweets = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const recentTweets = yield getRecentTweets(username);
    const documentsAndIds = {
        documents: [],
        ids: [],
    };
    recentTweets.forEach((tweet, idx) => {
        const tweetText = tweet.full_text;
        documentsAndIds.documents.push(tweetText);
        const idText = `id${idx}`;
        documentsAndIds.ids.push(idText);
    });
    return documentsAndIds;
});
exports.fetchTweets = fetchTweets;
