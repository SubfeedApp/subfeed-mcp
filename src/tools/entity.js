import { z } from 'zod';

export function registerEntityTools(server, client) {
  server.tool(
    'subfeed_create_entity',
    'Create a new AI entity on Subfeed.',
    {
      name: z.string().describe('Entity name'),
      model: z.string().optional().describe('Model ID from subfeed_list_models'),
      systemPrompt: z.string().optional().describe('System prompt'),
      description: z.string().optional().describe('Public description'),
      temperature: z.number().optional(),
      topP: z.number().optional(),
      maxTokens: z.number().optional(),
    },
    async (args) => {
      try {
        const data = await client.post('/v1/entity', args);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      } catch (err) {
        return { isError: true, content: [{ type: 'text', text: err.message }] };
      }
    }
  );

  server.tool(
    'subfeed_list_entities',
    'List your entities.',
    {
      limit: z.number().optional().describe('Max results'),
      offset: z.number().optional().describe('Pagination offset'),
    },
    async (args) => {
      try {
        const data = await client.get('/v1/entity', args);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      } catch (err) {
        return { isError: true, content: [{ type: 'text', text: err.message }] };
      }
    }
  );

  server.tool(
    'subfeed_get_entity',
    'Get entity details.',
    {
      id: z.string().describe('Entity ID'),
    },
    async ({ id }) => {
      try {
        const data = await client.get(`/v1/entity/${id}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      } catch (err) {
        return { isError: true, content: [{ type: 'text', text: err.message }] };
      }
    }
  );

  server.tool(
    'subfeed_update_entity',
    "Update an entity's config.",
    {
      id: z.string().describe('Entity ID'),
      name: z.string().optional(),
      model: z.string().optional(),
      systemPrompt: z.string().optional(),
      description: z.string().optional(),
      public: z.boolean().optional(),
      discoverable: z.boolean().optional(),
      temperature: z.number().optional(),
      topP: z.number().optional(),
      maxTokens: z.number().optional(),
    },
    async (args) => {
      try {
        const { id, ...body } = args;
        const data = await client.patch(`/v1/entity/${id}`, body);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      } catch (err) {
        return { isError: true, content: [{ type: 'text', text: err.message }] };
      }
    }
  );

  server.tool(
    'subfeed_delete_entity',
    'Delete an entity.',
    {
      id: z.string().describe('Entity ID'),
    },
    async ({ id }) => {
      try {
        const data = await client.del(`/v1/entity/${id}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      } catch (err) {
        return { isError: true, content: [{ type: 'text', text: err.message }] };
      }
    }
  );

  server.tool(
    'subfeed_publish_entity',
    'Publish entity to the public directory. Sets public: true and discoverable: true.',
    {
      id: z.string().describe('Entity ID'),
    },
    async ({ id }) => {
      try {
        const data = await client.patch(`/v1/entity/${id}`, {
          public: true,
          discoverable: true,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      } catch (err) {
        return { isError: true, content: [{ type: 'text', text: err.message }] };
      }
    }
  );
}
