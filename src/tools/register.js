import { z } from 'zod';

export function registerRegisterTools(server, client) {
  server.tool(
    'subfeed_register',
    'Register on Subfeed. Omit email for autonomous agent token. Include email for full human account.',
    {
      name: z.string().optional().describe('Agent name'),
      description: z.string().optional().describe('What this agent does'),
      homepage_url: z.string().optional().describe('Agent origin URL (GitHub repo, website)'),
      referred_by: z.string().optional().describe('Token of agent that referred you'),
      email: z.string().optional().describe('Human email for full account. Omit for autonomous agent token.'),
    },
    async (args) => {
      try {
        const data = await client.post('/v1/agents/register', args);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      } catch (err) {
        return { isError: true, content: [{ type: 'text', text: err.message }] };
      }
    }
  );
}
