import { AxiosInstance } from 'axios';
import ConversationResource from '../src/resources/conversation';
import PeerResource from '../src/resources/peer';
import AppResource from '../src/resources/app';

function createResourceOptions() {
  const post = jest.fn();
  const get = jest.fn();
  const handleError = jest.fn();

  return {
    client: { post, get } as unknown as AxiosInstance,
    post,
    get,
    handleError,
  };
}

describe('client resources', () => {
  it('lists peers with the default limit', async () => {
    const options = createResourceOptions();
    const peers = [{ _id: 'peer-1', name: 'Support' }];
    options.post.mockResolvedValue({ data: peers });

    await expect(new PeerResource(options).list()).resolves.toEqual(peers);
    expect(options.post).toHaveBeenCalledWith('/peer/list', { limit: 10 });
  });

  it('sends a conversation message with the JSON response format', async () => {
    const options = createResourceOptions();
    const message = { id: 'message-1', output: { answer: 'ok' } };
    options.post.mockResolvedValue({ data: message });

    await expect(
      new ConversationResource(options).sendMessage('conversation-1', 'Return JSON', {
        responseFormat: 'json',
      }),
    ).resolves.toEqual(message);
    expect(options.post).toHaveBeenCalledWith(
      '/conversation/conversation-1/message',
      { content: 'Return JSON', response_format: 'json' },
    );
  });

  it('passes app inputs to the execute endpoint', async () => {
    const options = createResourceOptions();
    const result = { answer: 'done' };
    const inputs = { prompt: 'Hello', count: 2 };
    options.post.mockResolvedValue({ data: result });

    await expect(new AppResource(options).execute('app-1', { inputs })).resolves.toEqual(result);
    expect(options.post).toHaveBeenCalledWith('/app/app-1/execute', inputs);
  });

  it('returns an empty peer list and reports request errors', async () => {
    const options = createResourceOptions();
    const error = new Error('request failed');
    options.post.mockRejectedValue(error);

    await expect(new PeerResource(options).list()).resolves.toEqual([]);
    expect(options.handleError).toHaveBeenCalledWith(error);
  });
});