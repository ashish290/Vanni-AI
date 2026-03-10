import * as dotenv from "dotenv";
import dns from "dns";

// Force Node.js to use IPv4 first for DNS resolution
// This prevents UND_ERR_CONNECT_TIMEOUT when IPv6 is flaky
dns.setDefaultResultOrder("ipv4first");

dotenv.config();

const testFetch = async () => {
  console.log("Starting fetch to Sarvam AI (IPv4 forced)...");
  try {
    const startTime = Date.now();
    const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": process.env.SARVAM_API_KEY || "test-key",
      },
      body: JSON.stringify({
        model: "sarvam-m",
        messages: [{ role: "user", content: "hello" }],
        max_tokens: 10,
        temperature: 0.7,
      }),
    });

    console.log(
      `Status: ${response.status} (took ${Date.now() - startTime}ms)`,
    );
    const text = await response.text();
    console.log("Response:", text.substring(0, 100) + "...");
  } catch (error) {
    console.error("Fetch failed:", error.message);
    if (error.cause) console.error("Cause:", error.cause);
  }
};

testFetch();
