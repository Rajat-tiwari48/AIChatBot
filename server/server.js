import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const port = 5000;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello friends! The API server is up and running.",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    // ✅ Use chat completion, not completion
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    res.status(200).send({
      bot: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).send(error?.response?.data || "Something went wrong!");
  }
});

app.listen(port, () =>
  console.log(`🚀 Server is running on http://localhost:${port}`)
);
