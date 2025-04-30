# Cognipeer JavaScript Client

[![npm](https://img.shields.io/npm/v/@cognipeer/client-js?color=success)](https://npmjs.com/package/@cognipeer/client-js)

A lightweight JavaScript client for the Cognipeer API. Works in both Node.js (CommonJS) and TypeScript environments.

## Installation

```bash
npm i @cognipeer/client-js
```

## Usage

### TypeScript / ES Modules

```typescript
import CognipeerClient from 'cognipeer-client';

// Initialize the client
const client = new CognipeerClient({
  baseUrl: 'https://api.cognipeer.com/v1/client', // Optional, defaults to this value
  token: 'your-api-token' // Optional, but recommended for authentication
});

// List available peers
const peers = await client.peer.list();
console.log(peers);

// Get a specific peer by ID
const peerId = '90aa68af-d5c4-4b60-b63e-b732db08bb46';
const peerDetails = await client.peer.get(peerId);

// Create a conversation with a peer
const conversation = await client.conversation.create(peerId);

// Send a message to a conversation
const conversationId = conversation._id;
const message = await client.conversation.sendMessage(
  conversationId, 
  'Hello, how can you help me?'
);
console.log(message.content);

// Get JSON response (structured data)
const jsonResponse = await client.conversation.sendMessage(
  conversationId, 
  'Give me data in JSON format', 
  { responseFormat: 'json' }
);
console.log(jsonResponse.output); // Access the parsed JSON output

// Find all conversations
const conversations = await client.conversation.list();

// Get a specific conversation
const specificConversation = await client.conversation.get(conversationId);

// Get messages from a conversation
const messages = await client.conversation.getMessages(conversationId);

// Send a message to a peer using competition mode (creates a new conversation)
const competitionResponse = await client.peer.competition(
  peerId, 
  { 
    content: 'Tell me about your features',
    responseFormat: 'json'
  }
);

// Chat with a peer using message history (creates a new conversation)
const chatResponse = await client.peer.chat(
  peerId,
  {
    messages: [
      { role: 'user', content: 'Hello, who are you?' },
      { role: 'ai', content: 'I am an AI assistant.' },
      { role: 'user', content: 'What can you help me with?' }
    ]
  }
);

// Execute an app with inputs
const appId = 'your-app-id';
const result = await client.app.execute(appId, {
  inputs: {
    textInput: 'Some text value',
    numberInput: 42,
    // File inputs will be handled automatically when sent to the API
    fileInput: fileData
  }
});
console.log(result); // Output values mapped by output name
```

### Node.js (CommonJS)

```javascript
const CognipeerClient = require('cognipeer-client');

// Initialize the client
const client = new CognipeerClient({
  baseUrl: 'https://api.cognipeer.com/v1/client', // Optional
  token: 'your-api-token' // Optional, but recommended
});

// Using async/await
async function example() {
  // List available peers
  const peers = await client.peer.list();
  
  // Create a conversation with the first peer
  if (peers.length > 0) {
    const conversation = await client.conversation.create(peers[0]._id);
    
    // Send a message
    const response = await client.conversation.sendMessage(conversation._id, 'Hello!');
    console.log(response.content);
    
    // Find all conversations for this peer
    const peerConversations = await client.conversation.list({ peerId: peers[0]._id });
    console.log(`Found ${peerConversations.length} conversations`);
    
    // Chat with the peer directly (creates a new conversation)
    const chatResponse = await client.peer.chat(
      peers[0]._id,
      {
        messages: [
          { role: 'user', content: 'What can you do?' }
        ]
      }
    );
    console.log(chatResponse.content);
  }
}

// Using promises
client.peer.list()
  .then(peers => {
    if (peers.length > 0) {
      return client.conversation.create(peers[0]._id);
    }
  })
  .then(conversation => {
    return client.conversation.sendMessage(conversation._id, 'Hello!');
  })
  .then(message => {
    console.log(message.content);
  })
  .catch(error => {
    console.error(error);
  });
```

## API Reference

### Constructor

```typescript
const client = new CognipeerClient(options);
```

- `options` (optional): Configuration object
  - `baseUrl` (optional): The base URL for the Cognipeer API. Defaults to 'https://api.cognipeer.com/v1/client'
  - `token` (optional): Authentication token for the API

### Peer Methods

#### peer.list(options)

Retrieves a list of all available peers.

```typescript
const peers = await client.peer.list({ limit: 20 });
```

- `options` (optional):
  - `limit` (optional): Maximum number of peers to return (default: 10)

Returns: `Promise<Peer[]>`

#### peer.get(id)

Get details of a specific peer by ID.

```typescript
const peer = await client.peer.get(peerId);
```

- `id` (required): The ID of the peer

Returns: `Promise<Peer>`

#### peer.competition(peerId, options)

Send a message to a peer in competition mode (creates a new conversation).

```typescript
const response = await client.peer.competition(
  peerId, 
  { 
    content: 'Tell me about your products',
    responseFormat: 'json',
    responseSchema: { type: 'object', properties: {} }, // Optional
    additionalContext: { customData: 'value' } // Optional
  }
);
```

- `peerId` (required): The ID of the peer
- `options` (required):
  - `content` (required): The message content
  - `responseFormat` (optional): Format of the response. Can be 'text' (default) or 'json'
  - `responseSchema` (optional): JSON schema for structured responses
  - `additionalContext` (optional): Additional context to provide to the peer

Returns: `Promise<Message>` or `Promise<JsonResponseMessage>` depending on the response format

#### peer.chat(peerId, options)

Chat with a peer by sending a series of messages (creates a new conversation).

```typescript
const response = await client.peer.chat(
  peerId,
  {
    messages: [
      { role: 'user', content: 'Hello' },
      { role: 'ai', content: 'Hi there! How can I help you?' },
      { role: 'user', content: 'What services do you offer?' }
    ],
    responseFormat: 'text'
  }
);
```

- `peerId` (required): The ID of the peer
- `options` (required):
  - `messages` (required): Array of message objects, each with role ('user' or 'ai') and content
  - `responseFormat` (optional): Format of the response. Can be 'text' (default) or 'json'
  - `responseSchema` (optional): JSON schema for structured responses
  - `additionalContext` (optional): Additional context to provide to the peer

Returns: `Promise<Message>` or `Promise<JsonResponseMessage>` depending on the response format

### Conversation Methods

#### conversation.create(peerId)

Creates a new conversation with the specified peer.

```typescript
const conversation = await client.conversation.create(peerId);
```

- `peerId` (required): The ID of the peer to create a conversation with

Returns: `Promise<Conversation>`

#### conversation.list(filter)

Get a list of conversations with optional filtering.

```typescript
const conversations = await client.conversation.list({ peerId: 'some-id' });
```

- `filter` (optional): Filter criteria for conversations
  - `peerId` (optional): Filter by peer ID

Returns: `Promise<Conversation[]>`

#### conversation.get(id)

Get a specific conversation by ID.

```typescript
const conversation = await client.conversation.get(conversationId);
```

- `id` (required): The ID of the conversation to find

Returns: `Promise<Conversation>`

#### conversation.sendMessage(id, content, options)

Sends a message to an existing conversation.

```typescript
const message = await client.conversation.sendMessage(
  conversationId, 
  content, 
  { responseFormat: 'json' }
);
```

- `id` (required): The ID of the conversation to send a message to
- `content` (required): The content of the message to send
- `options` (optional): Additional options for the message
  - `responseFormat` (optional): Format of the response. Can be 'text' (default) or 'json'

Returns: `Promise<Message>` or `Promise<JsonResponseMessage>` depending on the response format

#### conversation.getMessages(id, messagesCount)

Get messages from a conversation.

```typescript
const messages = await client.conversation.getMessages(conversationId, 20);
```

- `id` (required): The ID of the conversation to find messages in
- `messagesCount` (optional): Number of messages to return (default: 10)

Returns: `Promise<Message[]>`

### App Methods

#### app.execute(id, options)

Execute an app with the specified inputs.

```typescript
const result = await client.app.execute(appId, {
  inputs: {
    name: 'John Doe',
    query: 'How do I reset my password?',
    preferences: { language: 'en' }
    // File inputs are supported and will be handled by the API
  }
});
```

- `id` (required): The ID of the app to execute
- `options` (required):
  - `inputs` (required): Object containing input values keyed by input name

Returns: `Promise<Record<string, any>>` - The execution results with outputs mapped by name

## Error Handling

The client includes built-in error handling that will log API errors to the console. You can also wrap your calls in try/catch blocks for custom error handling:

```typescript
try {
  const peers = await client.peer.list();
} catch (error) {
  // Custom error handling
  console.error('Failed to list peers:', error);
}
```

## Running on-premises

For on-premises deployments, just specify your local API endpoint when initializing the client:

```typescript
const client = new CognipeerClient({
  baseUrl: 'https://api.cognipeer.com/v1/client',
  token: 'your-local-token'
});
```

## License

MIT
