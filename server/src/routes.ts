import express from "express";
import { retriveRelevantTweets } from "./services/openRouter";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;


const router = express.Router();

router.post("/query", async (req, res) => {
  try {
    const { prompt, user, pastMessages } = req.body;

    if (!prompt || !user) {
      throw new Error(
        "Missing required fields: prompt and user are required" 
      )
    }

    const message = await retriveRelevantTweets(prompt, user, pastMessages);

    res.json(message);
  } catch(error) {
    console.error("Error in /query endpoint:", error);
    
    res.status(500).json({ 
      error: "Something went wrong processing your request" 
    });
  }
});

router.get("/allUsernames", async (req, res) => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_ANON_KEY"
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.from("account").select("username");

    if (error) throw error;

    res.json({
      usernames: data,
    });
  } catch (error) {
    console.error("Error fetching usernames:", error);
    res.status(500).json({
      error: "Failed to fetch usernames",
    });
  }
});

export default router;