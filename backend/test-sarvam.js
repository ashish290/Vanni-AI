import * as dotenv from "dotenv";
dotenv.config();

const testFetch = async () => {
  try {
    console.log("Starting fetch to Sarvam AI...");
    const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": process.env.SARVAM_API_KEY || "fake-key",
      },
      body: JSON.stringify({
        model: "sarvam-m",
        messages: [{ role: "user", content: "hello" }],
        max_tokens: 10,
        temperature: 0.7,
      }),
    });

    console.log("Status:", response.status);
    const text = await response.text();
    console.log("Response:", text);
  } catch (error) {
    console.error("Fetch failed with error:", error);
    console.error("Error cause:", error.cause);
  }
};

testFetch();
