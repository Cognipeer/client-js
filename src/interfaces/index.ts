import { AxiosInstance } from 'axios';

export interface CognipeerOptions {
  baseUrl?: string;
  token?: string;
}

export interface Peer {
  _id: string;
  name: string;
  shortDescription: string;
  initialPrompts: string;
  securityFilters: string[];
  modelId: string;
  avatar: string;
  galleryKey: string;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  updatedBy: string;
  additionalPrompt?: string;
}

export interface Conversation {
  _id: string;
  peerId?: string;
  peer?: Peer;
  [key: string]: any;
}

export interface ConversationFilter {
  peerId?: string;
  [key: string]: any;
}

export interface Tool {
  tool: string;
  action: string;
}

export interface Message {
  content: string;
  tools?: Tool[];
  id: string;
}

export interface JsonResponseMessage {
  output: any;
  tools?: Tool[];
  id: string;
}

export interface MessageOptions {
  responseFormat?: 'text' | 'json';
}

export interface ResourceOptions {
  client: AxiosInstance;
  handleError: (error: any) => void;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export interface PeerCompetitionOptions {
  content: string;
  responseFormat?: 'text' | 'json';
  responseSchema?: any;
  additionalContext?: any;
}

export interface PeerChatOptions {
  messages: ChatMessage[];
  responseFormat?: 'text' | 'json';
  responseSchema?: any;
  additionalContext?: any;
}

export interface PeerListOptions {
  limit?: number;
}

export interface AppDefinitionInput {
  name: string;
  type: string;
  [key: string]: any;
}

export interface AppDefinitionOutput {
  name: string;
  id: string;
  [key: string]: any;
}

export interface AppDefinition {
  inputs?: AppDefinitionInput[];
  outputs?: AppDefinitionOutput[];
  [key: string]: any;
}

export interface App {
  _id: string;
  definition?: AppDefinition;
  [key: string]: any;
}

export interface AppExecuteOptions {
  inputs: Record<string, any>;
}
