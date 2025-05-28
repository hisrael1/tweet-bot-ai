import express from "express";
import cors from "cors";
import routes from './routes';

const app = express();

// Configure CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

app.use('/api', routes);

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`example app listening on http://localhost:${port}/`);
});

// app.get('/debug/tweets', async (req, res) => {
//   const response = await fetch('https://fabxmporizzqflnftavs.supabase.co/storage/v1/object/public/archives/defenderofbasic/archive.json');
//   const data = await response.json();
//   res.json(data.tweets.slice(-10));
// });