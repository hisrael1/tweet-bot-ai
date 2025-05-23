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
const express_1 = __importDefault(require("express"));
const openRouter_1 = require("./services/openRouter");
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const router = express_1.default.Router();
router.post("/query", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { prompt, user, pastMessages } = req.body;
        if (!prompt || !user) {
            throw new Error("Missing required fields: prompt and user are required");
        }
        const message = yield (0, openRouter_1.retriveRelevantTweets)(prompt, user, pastMessages);
        res.json(message);
    }
    catch (error) {
        console.error("Error in /query endpoint:", error);
        res.status(500).json({
            error: "Something went wrong processing your request"
        });
    }
}));
router.get("/allUsernames", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!supabaseUrl || !supabaseKey) {
            throw new Error("Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_ANON_KEY");
        }
        const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
        const { data, error } = yield supabase.from("account").select("username");
        if (error)
            throw error;
        res.json({
            usernames: data,
        });
    }
    catch (error) {
        console.error("Error fetching usernames:", error);
        res.status(500).json({
            error: "Failed to fetch usernames",
        });
    }
}));
exports.default = router;
