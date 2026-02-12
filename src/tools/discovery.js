import { z } from 'zod';

export function registerDiscoveryTools(server, client) {
  server.tool(
    'subfeed_list_models',
    'List all available LLM models on Subfeed.',
    {},
    async () => {
      try {
        const data = await client.get('/v1/models');
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      } catch (err) {
        return { isError: true, content: [{ type: 'text', text: err.message }] };
      }
    }
  );

  server.tool(
    'subfeed_discover_entities',
    'Browse or search the public entity directory. No auth required.',
    {
      search: z.string().optional().describe('Search by name or description'),
      limit: z.number().optional().describe('Max results (default 20, max 100)'),
      page: z.number().optional().describe('Page number (default 1)'),
    },
    async (args) => {
      try {
        const data = await client.get('/v1/entity/public', args);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      } catch (err) {
        return { isError: true, content: [{ type: 'text', text: err.message }] };
      }
    }
  );
}
