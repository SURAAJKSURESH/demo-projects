// Thin client for the Express/PostgreSQL backend (proxied from /api by Vite in dev).

const request = async (path, options = {}) => {
  let res;
  try {
    res = await fetch(`/api${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the server. Is the API running (npm run server)?');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
};

export const api = {
  getBooks: () => request('/books'),
  login: (email, name) => request('/login', { method: 'POST', body: { email, name } }),
  getAccount: (userId) => request(`/users/${encodeURIComponent(userId)}`),
  addAddress: (userId, address) =>
    request(`/users/${encodeURIComponent(userId)}/addresses`, { method: 'POST', body: address }),
  placeOrder: (order) => request('/orders', { method: 'POST', body: order }),
  cancelOrder: (orderId, userId) =>
    request(`/orders/${encodeURIComponent(orderId)}/cancel`, { method: 'POST', body: { userId } }),
};
