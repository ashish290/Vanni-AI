const testUndefinedHeader = async () => {
  try {
    const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": undefined,
      },
      body: JSON.stringify({
        model: "sarvam-m",
        messages: [{ role: "user", content: "hello" }],
      }),
    });
    console.log("Status:", response.status);
  } catch (error) {
    console.error("Caught error:", error.message);
  }
};

testUndefinedHeader();
