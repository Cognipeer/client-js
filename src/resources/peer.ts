import { AxiosInstance } from 'axios';
import { 
  Peer, 
  ResourceOptions, 
  PeerListOptions, 
  PeerCompetitionOptions, 
  PeerChatOptions,
  Message,
  JsonResponseMessage
} from '../interfaces';

/**
 * Peer resource for managing AI peers
 */
class PeerResource {
  private client: AxiosInstance;
  private handleError: (error: any) => void;

  constructor(options: ResourceOptions) {
    this.client = options.client;
    this.handleError = options.handleError;
  }

  /**
   * Get a list of all available peers
   * @param options Optional parameters for listing peers
   * @returns Promise<Peer[]> List of peers
   */
  async list(options: PeerListOptions = {}): Promise<Peer[]> {
    try {
      const response = await this.client.post('/peer/list', {
        limit: options.limit || 10
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }
  
  /**
   * Get details of a specific peer by ID
   * @param id The ID of the peer
   * @returns Promise<Peer> The peer details
   */
  async get(id: string): Promise<Peer> {
    try {
      const response = await this.client.get(`/peer/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Send a message to a peer in competition mode (creating a new conversation)
   * @param peerId The ID of the peer
   * @param options Message options
   * @returns Promise<Message | JsonResponseMessage> The response message
   */
  async competition(
    peerId: string, 
    options: PeerCompetitionOptions
  ): Promise<Message | JsonResponseMessage> {
    try {
      const payload: any = {
        content: options.content
      };

      if (options.responseFormat === 'json') {
        payload.response_format = 'json';
      }
      
      if (options.responseSchema) {
        payload.response_schema = options.responseSchema;
      }
      
      if (options.additionalContext) {
        payload.additionalContext = options.additionalContext;
      }

      const response = await this.client.post(
        `/peer/${peerId}/competition`, 
        payload
      );
      
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Chat with a peer by sending a series of messages (creating a new conversation)
   * @param peerId The ID of the peer
   * @param options Chat options including message history
   * @returns Promise<Message | JsonResponseMessage> The response message
   */
  async chat(
    peerId: string, 
    options: PeerChatOptions
  ): Promise<Message | JsonResponseMessage> {
    try {
      const payload: any = {
        messages: options.messages
      };

      if (options.responseFormat === 'json') {
        payload.response_format = 'json';
      }
      
      if (options.responseSchema) {
        payload.response_schema = options.responseSchema;
      }
      
      if (options.additionalContext) {
        payload.additionalContext = options.additionalContext;
      }

      const response = await this.client.post(
        `/peer/${peerId}/chat`, 
        payload
      );
      
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
}

export default PeerResource;
