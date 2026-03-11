import https from "https";
import http from "http";

/**
 * Pings the server's own health endpoint to prevent sleep/spin-down.
 * Render free tier spins down after 15 minutes of inactivity.
 */
export const initKeepAlive = () => {
  const url = process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL;
  
  if (!url) {
    console.log("⚠️ Keep-Alive: No RENDER_EXTERNAL_URL or BACKEND_URL found. Skipping self-ping.");
    return;
  }

  const healthUrl = `${url}/api/health`;
  const interval = 14 * 60 * 1000; // 14 minutes

  console.log(`🚀 Keep-Alive service started. Pinging: ${healthUrl} every 14 mins.`);

  setInterval(() => {
    const protocol = healthUrl.startsWith("https") ? https : http;
    
    protocol.get(healthUrl, (res) => {
      if (res.statusCode === 200) {
        console.log(`✅ Keep-Alive: Self-ping successful at ${new Date().toLocaleTimeString()}`);
      } else {
        console.log(`⚠️ Keep-Alive: Self-ping failed with status ${res.statusCode}`);
      }
    }).on("error", (err) => {
      console.log(`❌ Keep-Alive: Error during self-ping:`, err.message);
    });
  }, interval);
};
