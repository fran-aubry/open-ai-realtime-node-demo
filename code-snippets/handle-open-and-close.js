// Import the web socket library
const WebSocket = require("ws");
// Load the .env file into memory so the code has access to the key
const dotenv = require("dotenv");
dotenv.config();

async function main() {
  // Connect to the API
  const url = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01";
  const ws = new WebSocket(url, {
      headers: {
          "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
          "OpenAI-Beta": "realtime=v1",
      },
  });
  function handleOpen() {
    console.log("Connection is opened");
  }
  ws.on("open", handleOpen);
  function handleMessage(message) {
    console.log(JSON.parse(message));
  }
  ws.on("message", handleMessage);  
}

main();
