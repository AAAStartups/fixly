// FIXLY Website API Client Service
// Integrates live backend deployed on Render Cloud

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://fixly-backend-kd8o.onrender.com/api/v1';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[Fixly Website API] Request to ${endpoint} failed:`, err.message);
    throw err;
  }
}

// 1. Catalog Endpoints
export async function getBrands() {
  return request('/catalog/brands');
}

export async function getModelsByBrand(brandId) {
  return request(`/catalog/brands/${encodeURIComponent(brandId)}/models`);
}

export async function getServices() {
  return request('/catalog/services');
}

export async function getEstimates(issue) {
  const query = issue ? `?issue=${encodeURIComponent(issue)}` : '';
  return request(`/catalog/estimates${query}`);
}

// 2. Orders Endpoints
export async function createOrder(payload) {
  return request('/orders/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getActiveOrder(customerId) {
  const query = customerId ? `?customerId=${encodeURIComponent(customerId)}` : '';
  return request(`/orders/active${query}`);
}

export async function lookupOrder(orderQuery) {
  return request(`/orders/${encodeURIComponent(orderQuery)}`);
}
