import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { createClient } from './client.js';
import { registerDiscoveryTools } from './tools/discovery.js';
import { registerRegisterTools } from './tools/register.js';
import { registerEntityTools } from './tools/entity.js';
import { registerInteractionTools } from './tools/interaction.js';
import { registerAddonTools } from './tools/addons.js';

const PORT = process.env.PORT || 3001;

function createMcpServer(authHeader) {
  const server = new McpServer({
    name: 'subfeed',
    version: '1.0.0',
  });

  const client = createClient(authHeader);

  registerDiscoveryTools(server, client);
  registerRegisterTools(server, client);
  registerEntityTools(server, client);
  registerInteractionTools(server, client);
  registerAddonTools(server, client);

  return server;
}

const app = express();
app.use(express.json());
const transports = {};

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/sse', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  const transport = new SSEServerTransport('/messages', res);
  transports[transport.sessionId] = transport;

  res.on('close', () => {
    delete transports[transport.sessionId];
  });

  const server = createMcpServer(authHeader);
  await server.connect(transport);
});

app.post('/messages', async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = transports[sessionId];
  if (!transport) {
    res.status(400).json({ error: 'Unknown session' });
    return;
  }
  await transport.handlePostMessage(req, res);
});

app.listen(PORT, () => {
  console.log(`Subfeed MCP server running on port ${PORT}`);
});
