import { AxiosInstance } from 'axios';
import { 
  Conversation, 
  ConversationFilter, 
  Message, 
  MessageOptions, 
  JsonResponseMessage, 
  ResourceOptions 
} from '../interfaces';

/**
 * Conversation resource for managing conversations and messages
 */
class ConversationResource {
  private client: AxiosInstance;
  private handleError: (error: any) => void;

  constructor(options: ResourceOptions) {
    this.client = options.client;
    this.handleError = options.handleError;
  }

  /**
   * Create a new conversation with a peer
   * @param peerId The ID of the peer to create a conversation with
   * @returns Promise<Conversation> The created conversation
   */
  async create(peerId: string): Promise<Conversation> {
    try {
      const response = await this.client.post('/conversation', { peerId });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  /**
   * Get a list of conversations with optional filtering
   * @param filter Optional filter parameters
   * @returns Promise<Conversation[]> List of matching conversations
   */
  async list(filter: ConversationFilter = {}): Promise<Conversation[]> {
    try {
      const response = await this.client.post('/conversation', filter);
      return response.data;
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }
  
  /**
   * Get a specific conversation by ID
   * @param id The ID of the conversation
   * @returns Promise<Conversation> The conversation details
   */
  async get(id: string): Promise<Conversation> {
    try {
      const response = await this.client.get(`/conversation/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  /**
   * Send a message to an existing conversation
   * @param id The ID of the conversation
   * @param content The message content
   * @param options Additional options for the message
   * @returns Promise<Message | JsonResponseMessage> The response message
   */
  async sendMessage(
    id: string, 
    content: string, 
    options: MessageOptions = {}
  ): Promise<Message | JsonResponseMessage> {
    try {
      const payload: any = { content };
      
      // Add response_format if JSON is requested
      if (options.responseFormat === 'json') {
        payload.response_format = 'json';
      }
      
      const response = await this.client.post(
        `/conversation/${id}/message`, 
        payload
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  /**
   * Get messages from a conversation
   * @param id The ID of the conversation
   * @param messagesCount Optional number of messages to return (default: 10)
   * @returns Promise<Message[]> List of messages in the conversation
   */
  async getMessages(
    id: string, 
    messagesCount: number = 10
  ): Promise<Message[]> {
    try {
      const response = await this.client.get(
        `/conversation/${id}/message`, 
        { params: { messagesCount } }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }
}

export default ConversationResource;
