import express from "express";
import OpenAI from "openai";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuration OpenAI
const apiKey = process.env.NVIDIA_API_KEY;
const baseURL = process.env.NVIDIA_BASE_URL;

// Initialization OpenAI
const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: baseURL,
});

// Endpoint to send a request to AI
app.post("/generate", async (req, res) => {
  try {
    console.log("Received request:", req.body); // Debugging

    const { content } = req.body; // Get input data from the frontend

    // Input validation
    if (!content) {
      console.error("Content is missing in request!");
      return res.status(400).json({ error: "Content is required" });
    }

    // Generate response
    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.1-405b-instruct",
      messages: [{ role: "user", content }],
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 1024,
    });

    // Response handling
    const responseText =
      completion.choices[0]?.message?.content || "No response from AI";
    res.json({ result: responseText });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(3000, () => console.log("Server is running on port 3000"));
