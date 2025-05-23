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
exports.createNewTweetsCollection = exports.deleteOldUserTweetsCollection = void 0;
const chromadb_1 = require("chromadb");
const chromaClient = new chromadb_1.ChromaClient({ path: "http://localhost:8000" });
// delete user tweets and fail silently if it doesn't work
const deleteOldUserTweetsCollection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield chromaClient.deleteCollection({
            name: "user_tweets",
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteOldUserTweetsCollection = deleteOldUserTweetsCollection;
// create new tweets collection
const createNewTweetsCollection = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield chromaClient.createCollection({
        name: "user_tweets",
        metadata: {
            description: "Collection for tweet history to power chatbot",
        },
    });
});
exports.createNewTweetsCollection = createNewTweetsCollection;
