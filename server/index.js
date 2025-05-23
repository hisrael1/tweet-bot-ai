"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./src/routes"));
const app = (0, express_1.default)();
// Configure CORS
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use('/api', routes_1.default);
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
