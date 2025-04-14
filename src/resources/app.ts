import { AxiosInstance } from 'axios';
import { 
  App, 
  ResourceOptions,
  AppExecuteOptions
} from '../interfaces';

/**
 * App resource for executing Cognipeer applications
 */
class AppResource {
  private client: AxiosInstance;
  private handleError: (error: any) => void;

  constructor(options: ResourceOptions) {
    this.client = options.client;
    this.handleError = options.handleError;
  }

  /**
   * Execute an app with inputs
   * @param id The ID of the app to execute
   * @param options Execution options including inputs
   * @returns Promise<Record<string, any>> The execution results with outputs mapped by name
   */
  async execute(id: string, options: AppExecuteOptions): Promise<Record<string, any>> {
    try {
      const response = await this.client.post(`/app/${id}/execute`, options.inputs);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
}

export default AppResource;
