import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const SARVAM_BASE_URL = "https://api.sarvam.ai/v1";

async function testRow() {
  try {
    console.log("Fetching RAW LLM Response from Sarvam API...");
    const response = await fetch(`${SARVAM_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": process.env.SARVAM_API_KEY,
      },
      body: JSON.stringify({
        model: "sarvam-m",
        messages: [
          { role: "system", content: "You are a helpful tutor." },
          { role: "user", content: "Hello, how are you?" },
        ],
        max_tokens: 800,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      console.error("Error Status:", response.status);
      console.error("Error Body:", await response.text());
      return;
    }

    const data = await response.json();
    console.log("Raw JSON output:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("exception:", e);
  }
}

testRow();
