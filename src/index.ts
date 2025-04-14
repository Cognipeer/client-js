import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { CognipeerOptions } from './interfaces';
import ConversationResource from './resources/conversation';
import PeerResource from './resources/peer';
import AppResource from './resources/app';

/**
 * Main Cognipeer API client
 */
class CognipeerClient {
  private client: AxiosInstance;
  private baseUrl: string;
  
  /**
   * Conversation-related operations
   */
  public conversation: ConversationResource;
  
  /**
   * Peer-related operations
   */
  public peer: PeerResource;
  
  /**
   * App-related operations
   */
  public app: AppResource;

  constructor(options: CognipeerOptions = {}) {
    this.baseUrl = options.baseUrl || 'https://api.cognipeer.com/v1/client';
    
    const config: AxiosRequestConfig = {
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add authorization header if token is provided
    if (options.token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${options.token}`
      };
    }

    this.client = axios.create(config);
    
    // Initialize resource classes
    const resourceOptions = {
      client: this.client,
      handleError: this.handleError.bind(this)
    };
    
    this.conversation = new ConversationResource(resourceOptions);
    this.peer = new PeerResource(resourceOptions);
    this.app = new AppResource(resourceOptions);
  }

  /**
   * Handle API errors
   * @param error The error object
   */
  private handleError(error: any): void {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      console.error(`Cognipeer API Error (${status}):`, data || error.message);
    } else {
      console.error('Cognipeer Client Error:', error);
    }
  }
}

export default CognipeerClient;

// For backward compatibility, re-export types
export * from './interfaces';

// CommonJS module.exports for compatibility with require()
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CognipeerClient;
}
