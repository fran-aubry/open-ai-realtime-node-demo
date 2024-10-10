// index.js
// Import the web socket library
const WebSocket = require("ws");
// Load the .env file into memory so the code has access to the key
const dotenv = require("dotenv");
dotenv.config();
// Connect to the API
const url = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01";
const ws = new WebSocket(url, {
    headers: {
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
        "OpenAI-Beta": "realtime=v1",
    },
});

function handleOpen() {
  // Define what happens when the connection is opened
  // Create and send an event to initiate a conversation
  const createConversationEvent = {
    event_id: "datacamp_test",
    type: "conversation.item.create",
    item: {
      type: "message",
      role: "user",
      content: [
        {
          type: "input_text",
          text: "Explain in one sentence what a web socket is"
        }
      ]
    }
  };
  // Create and send an event to initiate a response
  ws.send(JSON.stringify(createConversationEvent));
  const createResponseEvent = {
    type: "response.create",
    event_id: "datacamp_test",
    response: {
        modalities: ["text"],
        instructions: "Please assist the user.",
        max_output_tokens: 100
    }
  }
  ws.send(JSON.stringify(createResponseEvent));
}
ws.on("open", handleOpen);

function handleMessage(messageStr) {
  const message = JSON.parse(messageStr);
  // Define what happens when a message is received
  switch(message.type) {
    case "response.text.delta":
      // We got a new text chunk, print it
      process.stdout.write(message.delta);
    break;
    case "response.text.done":
      // The text is complete, print a new line
      process.stdout.write("\n");
    break;
    case "response.done":
      // Response complete, close the socket
      ws.close();
    break;
  }
}
ws.on("message", handleMessage);
