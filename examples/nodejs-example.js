// CommonJS import using require
const CognipeerClient = require('../dist');

async function example() {
  // Initialize the client with optional custom URL and token
  const client = new CognipeerClient({
    baseUrl: 'https://api.cognipeer.com/v1/client',
    token: 'token'
  });

  try {
    // List available peers
    console.log('Listing peers...');
    const peers = await client.peer.list();
    console.log(`Found ${peers.length} peers`);
    
    if (peers.length > 0) {
      const peer = peers[0];
      console.log(`Selected peer: ${peer.name} (${peer._id})`);
      
      // Create a conversation with a peer
      console.log('Creating conversation...');
      const conversation = await client.conversation.create(peer._id);
      console.log(`Created conversation with ID: ${conversation._id}`);
      
      // Send a message to the conversation
      console.log('Sending message...');
      const message = await client.conversation.sendMessage(conversation._id, 'Hello! How can you help me?');
      console.log('Received response:', message.content);
      
      // Get JSON response
      // console.log('Requesting JSON response...');
      // const jsonResponse = await client.conversation.sendMessage(
      //   conversation._id, 
      //   'Give me a structured response with user data', 
      //   { responseFormat: 'json' }
      // );
      // console.log('Structured data:', jsonResponse.output);
      
      // Get messages from the conversation
      console.log('Getting conversation messages...');
      const messages = await client.conversation.getMessages(conversation._id);
      console.log(`Retrieved ${messages.length} messages`);
      
      // Get a specific conversation
      console.log('Getting conversation details...');
      const conversationDetails = await client.conversation.get(conversation._id);
      console.log('Conversation details:', conversationDetails);
      
      // Using the competition endpoint
      console.log('Using competition endpoint...');
      const competitionResponse = await client.peer.competition(
        peer._id,
        { 
          content: 'What are your main capabilities?',
          responseFormat: 'text'
        }
      );
      console.log('Competition response:', competitionResponse.content);
      
      // Using the chat endpoint with message history
      console.log('Using chat endpoint with message history...');
      const chatResponse = await client.peer.chat(
        peer._id,
        {
          messages: [
            { role: 'user', content: 'Hello there' },
            { role: 'ai', content: 'Hi! How can I assist you today?' },
            { role: 'user', content: 'Tell me about your company' }
          ]
        }
      );
      console.log('Chat response:', chatResponse.content);
      
      // Execute an app
      console.log('Executing an app...');
      const appId = 'app-id';
      const appResult = await client.app.execute(appId, {
        inputs: {
          text: 'Analyze this content',
          options: { detailed: true }
        }
      });
      console.log('App execution result:', appResult);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Using promises instead of async/await
function promiseExample() {
  const client = new CognipeerClient({
    baseUrl: 'https://api.cognipeer.com/v1/client',
    token: 'your-api-token'
  });
  
  client.peer.list()
    .then(peers => {
      if (peers.length === 0) throw new Error('No peers found');
      console.log(`Found ${peers.length} peers`);
      return client.conversation.create(peers[0]._id);
    })
    .then(conversation => {
      console.log(`Created conversation with ID: ${conversation._id}`);
      return client.conversation.sendMessage(conversation._id, 'Hello!');
    })
    .then(message => {
      console.log('Received response:', message.content);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Run the async example
example();

// Uncomment to run the promise example
// promiseExample();
