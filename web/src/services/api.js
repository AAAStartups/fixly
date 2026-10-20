// FIXLY API Client Service
// Integrates all backend endpoints defined in plan.md

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

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
      throw new Error(errorBody.message || `API request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[FIXLY API] Request to ${endpoint} failed:`, err.message);
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

export async function getOrderHistory(customerId) {
  const query = customerId ? `?customerId=${encodeURIComponent(customerId)}` : '';
  return request(`/orders/history${query}`);
}

export async function getOrderById(orderId) {
  return request(`/orders/${orderId}`);
}

export async function respondToEstimate(orderId, isApproved, rejectionReason = '') {
  return request(`/orders/${orderId}/estimate/respond`, {
    method: 'POST',
    body: JSON.stringify({ isApproved, rejectionReason }),
  });
}

export async function claimWarranty(orderId, claimNotes) {
  return request(`/orders/${orderId}/warranty/claim`, {
    method: 'POST',
    body: JSON.stringify({ claimNotes }),
  });
}

export async function getInvoice(orderId) {
  return request(`/orders/${orderId}/invoice`);
}

export async function uploadMedia(fileName, fileType) {
  return request('/orders/upload-media', {
    method: 'POST',
    body: JSON.stringify({ fileName, fileType }),
  });
}

// 3. Payments Endpoints
export async function createPaymentOrder(orderId, amount) {
  return request('/payments/razorpay/create-order', {
    method: 'POST',
    body: JSON.stringify({ orderId, amount }),
  });
}

export async function verifyPayment(paymentData) {
  return request('/payments/razorpay/verify', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });
}

// 4. Admin & Operations Endpoints
export async function getDashboardStats() {
  return request('/admin/dashboard/stats');
}

export async function getAdminOrders(status, page = 1) {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  params.append('page', page);
  return request(`/admin/orders?${params.toString()}`);
}

export async function updateOrderStatus(orderId, status, timelineTitle, timelineDescription) {
  return request(`/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, timelineTitle, timelineDescription }),
  });
}
