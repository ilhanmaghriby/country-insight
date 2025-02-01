import express from "express";
import OpenAI from "openai";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.NVIDIA_API_KEY; // Ambil API key dari .env
const baseURL = process.env.NVIDIA_BASE_URL; // Ambil base URL dari .env

// Inisialisasi OpenAI
const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: baseURL,
});

// Endpoint untuk mengirim permintaan ke AI
app.post("/generate", async (req, res) => {
  try {
    console.log("Received request:", req.body); // Debugging

    const { content } = req.body; // Dapatkan data input dari frontend

    // Validasi data
    if (!content) {
      console.error("Content is missing in request!");
      return res.status(400).json({ error: "Content is required" });
    }

    // Kirim data input ke AI
    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.1-405b-instruct",
      messages: [{ role: "user", content }],
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 1024,
    });

    // Ambil respon dari AI
    const responseText =
      completion.choices[0]?.message?.content || "No response from AI";

    res.json({ result: responseText });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: error.message });
  }
});

// Mulai server di port 3000
app.listen(3000, () => console.log("Server is running on port 3000"));
