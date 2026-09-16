import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const app = express();

app.use(cors());
app.use(express.json());

console.log("API key loaded:", !!process.env.GEMINI_API_KEY);

const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post("/api/translate", async (req, res) => {
    try {
        const { lyrics } = req.body;

        if (!lyrics) {
            return res.status(400).json({
                error: "No lyrics provided"
            });
        }

        const response = await client.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: `
You are a Malayalam transliteration and translation assistant.

Convert the following Malayalam lyrics into Manglish and English.

Rules:

1. Preserve the original Malayalam line structure.
2. Convert each Malayalam line into Latin characters (Manglish).
3. Translate each Malayalam line into natural English.
4. Keep the Manglish and English lines in the same order as the Malayalam lyrics.
5. Do not add explanations or extra text.

Return ONLY valid JSON in this exact format:

{
  "manglish": "Manglish lyrics here",
  "english": "English translation here"
}

Malayalam lyrics:

${lyrics}
`
        });

        console.log("Gemini response:", response.text);

        const result = JSON.parse(response.text);

        res.json({
            manglish: result.manglish,
            english: result.english
        });

    } catch (error) {
        console.error("Translation error:", error);

        res.status(500).json({
            error: "Something went wrong with the AI request."
        });
    }
});

app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
});