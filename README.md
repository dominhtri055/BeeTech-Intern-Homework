# BeeTech WhatsApp AI Chatbot

A practical AI-powered customer support chatbot built with **Next.js**, **MongoDB**, **OpenAI**, and the **WhatsApp Cloud API**.

This project receives incoming WhatsApp messages through a webhook, stores conversation history in MongoDB, generates AI responses using OpenAI, and sends replies back to users through WhatsApp. It also includes a simple admin dashboard for reviewing conversations and a tone-control feature for customizing the assistant's reply style.

---

## Features

- **WhatsApp webhook integration**
  - Verifies the webhook endpoint
  - Receives incoming messages from WhatsApp

- **AI response generation**
  - Uses OpenAI to generate short, natural replies
  - Injects a configurable tone into the system prompt

- **Conversation management**
  - Stores users, conversations, and messages in MongoDB
  - Uses recent message history as context for replies

- **Admin dashboard**
  - Displays conversations grouped by WhatsApp user
  - Shows saved message history for each conversation

- **Tone control**
  - Supports configurable tones such as:
    - `friendly`
    - `professional`
    - `sales`

---

## Tech Stack

- **Frontend / Server**: Next.js
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **AI**: OpenAI API
- **Messaging**: WhatsApp Cloud API
- **HTTP Client**: Axios

---

## Project Structure

```text
src/
  app/
    page.tsx
    layout.tsx
    dashboard/
      page.tsx
    api/
      webhook/
        route.ts
      conversations/
        route.ts
      conversations/
        tone/
          route.ts
  lib/
    mongodb.ts
    openai.ts
    whatsapp.ts
  models/
    User.ts
    Conversation.ts
    Message.ts
```

> Note: If your current project still has API routes under `src/api/...`, move them into `src/app/api/...` to match the Next.js App Router structure.

---

## Database Design

### `users`
Stores WhatsApp users.

```ts
{
  whatsappId: string,
  name: string
}
```

### `conversations`
Stores one conversation record per WhatsApp user.

```ts
{
  whatsappId: string,
  tone: string,
  lastMessageAt: Date
}
```

### `messages`
Stores individual user and assistant messages.

```ts
{
  whatsappId: string,
  role: "user" | "assistant",
  content: string,
  createdAt: Date
}
```

---

## Environment Variables

Create a `.env.local` file in the project root and add the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id
WHATSAPP_VERIFY_TOKEN=your_custom_verify_token
DEFAULT_BOT_TONE=friendly
```

### Variable Notes

- `MONGODB_URI`: MongoDB Atlas connection string
- `OPENAI_API_KEY`: OpenAI API key
- `WHATSAPP_ACCESS_TOKEN`: temporary or permanent access token from Meta
- `WHATSAPP_PHONE_NUMBER_ID`: phone number ID from WhatsApp API Setup
- `WHATSAPP_VERIFY_TOKEN`: custom token you create yourself for webhook verification
- `DEFAULT_BOT_TONE`: default assistant tone for new conversations

---

## Installation

Install dependencies:

```bash
npm install
npm install mongoose openai axios
```

If needed, also install Node type definitions:

```bash
npm install --save-dev @types/node
```

---

## Running the Project

Start the development server:

```bash
npm run dev
```

Open the app in your browser:

```text
http://localhost:3000
```

Admin dashboard:

```text
http://localhost:3000/dashboard
```

---

## WhatsApp Setup

### 1. Get your test assets from Meta
In **Meta App Dashboard > WhatsApp > API Setup**, collect:

- Temporary Access Token
- Phone Number ID
- Test Phone Number

### 2. Configure the webhook
Set the callback URL to:

```text
https://your-public-url/api/webhook
```

Set the verify token to the same value as `WHATSAPP_VERIFY_TOKEN` in `.env.local`.

### 3. Subscribe to the `messages` field
Make sure the WhatsApp webhook is subscribed to incoming message events.

### 4. Add your personal number as a test recipient
If you are using Meta's test number, add your own phone number to the allowed recipient list.

---

## How It Works

1. A user sends a WhatsApp message to the bot
2. Meta forwards the message event to `/api/webhook`
3. The server verifies and parses the incoming payload
4. The user and conversation are created if they do not already exist
5. The message is saved in MongoDB
6. The latest conversation history is loaded from the database
7. A reply is generated with OpenAI
8. The assistant message is saved in MongoDB
9. The reply is sent back to the user through the WhatsApp Cloud API

---

## Context Handling

This project uses **recent conversation history** to improve response quality.

When a new user message arrives:

- the system loads the most recent messages for that WhatsApp user
- those messages are passed into the OpenAI request as conversation context
- the model uses that context to generate a more relevant response

This allows the bot to maintain short-term conversational continuity without requiring a more complex memory system.

---

## Prompt Design

The assistant uses a simple system prompt similar to the following:

```text
You are a WhatsApp business assistant.
Reply in a friendly tone.
Keep answers concise, helpful, and natural.
```

The selected tone is inserted dynamically, so the same chatbot can respond in different styles depending on the conversation configuration.

---

## API Endpoints

### `GET /api/webhook`
Used by Meta to verify the WhatsApp webhook.

### `POST /api/webhook`
Receives incoming WhatsApp messages, stores them, generates AI replies, and sends responses.

### `GET /api/conversations`
Returns conversation data for the admin dashboard.

### `POST /api/conversations/tone`
Updates the tone for a specific conversation.

---

## Local Testing

### Webhook verification test
Open this URL in your browser:

```text
http://localhost:3000/api/webhook?hub.mode=subscribe&hub.verify_token=your_verify_token&hub.challenge=12345
```

If configured correctly, the response should be:

```text
12345
```

### Manual webhook payload test
You can test incoming messages locally using Postman or Thunder Client by sending a `POST` request to:

```text
http://localhost:3000/api/webhook
```

with a mock WhatsApp payload.

---

## Known Issues / Improvement Opportunities

- Duplicate messages can occur if webhook retries are not deduplicated using the WhatsApp `message.id`
- The dashboard currently focuses on basic message visibility rather than advanced filtering
- The current implementation uses a simple recent-history strategy rather than long-term memory
- Route naming and placement should remain consistent with the App Router structure

---

## Future Improvements

- Add authentication for the admin dashboard
- Add search and filtering for conversations
- Add better error handling and logging
- Add production deployment instructions
- Support attachments and interactive messages

---

## Submission Notes

This project was designed as a practical AI product prototype that demonstrates:

- real-time messaging integration
- GPT-powered response generation
- conversation persistence
- basic admin tooling
- configurable assistant behavior

The focus is on creating a working end-to-end chatbot system rather than a heavily polished production application.
