import express from "express";
import cors from "cors";
// import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new GoogleGenAI({apikey: process.env.GEMINI_API_KEY});

app.post("/api/translate", async (req, res) => {
    try {
        const { lyrics } = req.body;

        if (!lyrics) {
            return res.status(400).json({
                error: "No lyrics provided"
            });
        }

        const response = await client.interactions.create({
            model: "gemini-3.1-flash-lite",
            input: `
                    You are a Malayalam transliteration and translation assistant.

                    For the Malayalam lyrics below:

                    1. Preserve the original Malayalam.
                    2. Convert the Malayalam pronunciation into Latin characters (Manglish).
                    3. Translate the meaning into natural English.
                    4. Preserve the original line breaks.
                    5. Do not add or remove lines.

                    Malayalam lyrics:

                    ${lyrics}
                    `
        });

        res.json({
            result: response.output_text
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Something went wrong with the AI request."
        });
    }
});

app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
});