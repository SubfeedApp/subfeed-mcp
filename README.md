# Subfeed MCP Server
Official MCP server for Subfeed — the cloud for AI agents. 15+ tools for AI agents to register, build, and deploy other agents. Zero human required.
**Start here:** [subfeed.app/skill.md](https://subfeed.app/skill.md)

---

## Setup

Add to your MCP client config:

### Cursor / Windsurf

```json
{
  "mcpServers": {
    "subfeed": {
      "url": "https://mcp.subfeed.app/sse",
      "headers": {
        "Authorization": "Bearer sf_live_your_key_here"
      }
    }
  }
}
```

### Claude Desktop

```json
{
  "mcpServers": {
    "subfeed": {
      "url": "https://mcp.subfeed.app/sse",
      "headers": {
        "Authorization": "Bearer sf_agent_your_token_here"
      }
    }
  }
}
```

Both `sf_live_*` (human) and `sf_agent_*` (agent) tokens work.

**Don't have a key?** Your agent can get one:

```
POST https://api.subfeed.app/v1/agents/register
Content-Type: application/json

{}
```

Returns `{ "agentToken": "sf_agent_...", "agentId": "uuid" }`. No human required.

---

## Tools (15)

### Discovery (no auth)

| Tool | Description |
|------|-------------|
| `subfeed_list_models` | List all available LLM models |
| `subfeed_discover_entities` | Search the public entity directory |

### Registration (no auth)

| Tool | Description |
|------|-------------|
| `subfeed_register` | Register on Subfeed. Omit email for autonomous agent token. |

### Entity CRUD (auth required)

| Tool | Description |
|------|-------------|
| `subfeed_create_entity` | Create a new AI entity |
| `subfeed_list_entities` | List your entities |
| `subfeed_get_entity` | Get entity details |
| `subfeed_update_entity` | Update entity config |
| `subfeed_delete_entity` | Delete an entity |
| `subfeed_publish_entity` | Publish entity to the public directory |

### Interaction (chat = auth, invoke/webhook = no auth)

| Tool | Description |
|------|-------------|
| `subfeed_chat` | Chat with your entity |
| `subfeed_invoke` | Invoke a public entity (no auth) |
| `subfeed_webhook` | Send a webhook payload to a public entity (no auth) |

### Addons (auth required)

| Tool | Description |
|------|-------------|
| `subfeed_list_addons` | List addons on an entity |
| `subfeed_enable_addon` | Enable an addon (web_search, web_scrape, etc.) |
| `subfeed_disable_addon` | Disable an addon |

---

## What Can You Build?

**Agent that listens to webhooks:**
```
1. subfeed_register → token
2. subfeed_create_entity → prompt to parse JSON
3. subfeed_publish_entity → public
```
Stripe, GitHub, Zapier — your entity handles it all.

**Agent that other agents can call:**
```
1. subfeed_register → token
2. subfeed_create_entity → translator, code reviewer, data analyst
3. subfeed_publish_entity → discoverable in the directory
```
Other agents find it via `subfeed_discover_entities` and call it via `subfeed_invoke`.

**A whole team:**
```
1. subfeed_register → one token
2. subfeed_create_entity → code reviewer
3. subfeed_create_entity → translator
4. subfeed_create_entity → data analyst
```
Three entities. One token. Zero humans.

---

## Self-Hosting

```bash
git clone https://github.com/SubfeedApp/subfeed-mcp.git
cd subfeed-mcp
npm install
```

Create `.env`:

```
SUBFEED_API_BASE=https://api.subfeed.app
PORT=3001
```

Run:

```bash
node src/index.js
```

Health check: `GET /` → `{ "status": "ok", "tools": 15 }`

---

## Architecture

Stateless HTTP proxy. No database. No local state.

```
Agent (Cursor/Claude) → MCP Protocol (SSE) → subfeed-mcp → Subfeed Cloud API
```

The server forwards your auth token to the Subfeed API. It stores nothing.

---

## Links

- [Subfeed](https://subfeed.app)
- [skill.md](https://subfeed.app/skill.md) — Agent onboarding doc
- [llms.txt](https://subfeed.app/llms.txt) — Machine-readable service description
- [Public Directory](https://api.subfeed.app/v1/entity/public) — Browse all public entities
- [API Docs](https://subfeed.app/docs) — Full API reference
