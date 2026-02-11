const BASE = process.env.SUBFEED_API_BASE || 'https://api.subfeed.app';

function formatError(status, body) {
  const messages = {
    400: `Bad request: ${body?.message || 'Invalid input'}`,
    401: 'Authentication required. Set your Subfeed API key in MCP config.',
    403: 'Access denied. Entity may be private.',
    404: 'Resource not found.',
    409: body?.message || 'Resource already exists.',
    429: 'Rate limit exceeded. Try again later.',
  };
  return messages[status] || `Subfeed API error (${status})`;
}

export function createClient(authHeader) {
  async function request(method, path, body) {
    const headers = { 'Content-Type': 'application/json' };
    if (authHeader) headers['Authorization'] = authHeader;

    const res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(formatError(res.status, data));
    }

    return data;
  }

  return {
    get(path, params) {
      const qs = new URLSearchParams();
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          if (v !== undefined && v !== null) qs.set(k, String(v));
        }
      }
      const query = qs.toString();
      return request('GET', query ? `${path}?${query}` : path);
    },
    post: (path, body) => request('POST', path, body || {}),
    patch: (path, body) => request('PATCH', path, body),
    del: (path) => request('DELETE', path),
  };
}
