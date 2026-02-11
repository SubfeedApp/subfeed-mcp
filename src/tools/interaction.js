import { z } from 'zod';

export function registerInteractionTools(server, client) {
  server.tool(
    'subfeed_chat',
    'Chat with your entity.',
    {
      id: z.string().describe('Entity ID'),
      message: z.string().describe('Message to send'),
      sessionId: z.string().optional().describe('Session ID for conversation continuity'),
    },
    async (args) => {
      try {
        const { id, ...body } = args;
        const data = await client.post(`/v1/entity/${id}/chat`, body);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      } catch (err) {
        return { isError: true, content: [{ type: 'text', text: err.message }] };
      }
    }
  );

  server.tool(
    'subfeed_invoke',
    'Invoke a public entity. No auth required.',
    {
      id: z.string().describe('Public entity ID'),
      message: z.string().describe('Message to send'),
    },
    async (args) => {
      try {
        const { id, ...body } = args;
        const data = await client.post(`/v1/entity/${id}/invoke`, body);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      } catch (err) {
        return { isError: true, content: [{ type: 'text', text: err.message }] };
      }
    }
  );

  server.tool(
    'subfeed_webhook',
    'Send a webhook payload to a public entity. No auth required.',
    {
      id: z.string().describe('Public entity ID'),
      payload: z.record(z.unknown()).describe('JSON payload to send'),
    },
    async ({ id, payload }) => {
      try {
        const data = await client.post(`/v1/entity/${id}/webhook`, payload);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      } catch (err) {
        return { isError: true, content: [{ type: 'text', text: err.message }] };
      }
    }
  );
}
