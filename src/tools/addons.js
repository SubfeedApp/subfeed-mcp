import { z } from 'zod';

const ADDON_TYPE_ENUM = z.enum([
  'web_search',
  'code_execution',
  'image_gen',
  'web_scrape',
  'web_screenshot',
  'web_extract',
  'image_input',
  'streaming',
]);

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
      addonType: ADDON_TYPE_ENUM.describe('Addon type to enable'),
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
      addonType: ADDON_TYPE_ENUM.describe('Addon type to disable'),
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
