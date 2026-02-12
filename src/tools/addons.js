import { z } from 'zod';

export function registerAddonTools(server, client) {
  server.tool(
    'subfeed_list_addons',
    'List addons enabled on an entity.',
    {
      id: z.string().describe('Entity ID'),
    },
    async ({ id }) => {
      try {
        const data = await client.get(`/v1/entity/${id}/addons`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      } catch (err) {
        return { isError: true, content: [{ type: 'text', text: err.message }] };
      }
    }
  );

  server.tool(
    'subfeed_enable_addon',
    'Enable an addon on an entity.',
    {
      id: z.string().describe('Entity ID'),
      addonType: z.string().describe('web_search | code_execution | image_gen | image_input | streaming | web_scrape | web_screenshot | web_extract'),
    },
    async ({ id, addonType }) => {
      try {
        const data = await client.post(`/v1/entity/${id}/addons`, {
          addon_type: addonType,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      } catch (err) {
        return { isError: true, content: [{ type: 'text', text: err.message }] };
      }
    }
  );

  server.tool(
    'subfeed_disable_addon',
    'Disable an addon on an entity.',
    {
      id: z.string().describe('Entity ID'),
      addonType: z.string().describe('Addon type to disable'),
    },
    async ({ id, addonType }) => {
      try {
        const data = await client.del(`/v1/entity/${id}/addons/${addonType}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      } catch (err) {
        return { isError: true, content: [{ type: 'text', text: err.message }] };
      }
    }
  );
}
