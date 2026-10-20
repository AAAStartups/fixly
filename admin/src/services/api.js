// FIXLY Admin API Client
// Direct integration with NestJS Admin Endpoints

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
      throw new Error(errorBody.message || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[Fixly Admin API] Error at ${endpoint}:`, err.message);
    throw err;
  }
}

// 1. Dashboard Stats
export async function getDashboardStats() {
  return request('/admin/dashboard/stats');
}

// 2. Orders Management
export async function getOrders(status = '', page = 1, limit = 50) {
  const query = status ? `?status=${encodeURIComponent(status)}&page=${page}&limit=${limit}` : `?page=${page}&limit=${limit}`;
  return request(`/admin/orders${query}`);
}

export async function assignRider(orderId, riderId) {
  return request(`/admin/orders/${orderId}/assign-rider`, {
    method: 'PATCH',
    body: JSON.stringify({ riderId }),
  });
}

export async function assignTech(orderId, technicianId) {
  return request(`/admin/orders/${orderId}/assign-tech`, {
    method: 'PATCH',
    body: JSON.stringify({ technicianId }),
  });
}

export async function submitDiagnosis(orderId, diagnosisNotes, requiredParts = []) {
  return request(`/admin/orders/${orderId}/diagnosis`, {
    method: 'POST',
    body: JSON.stringify({ diagnosisNotes, requiredParts }),
  });
}

export async function createEstimate(orderId, estimateData) {
  return request(`/admin/orders/${orderId}/estimate`, {
    method: 'POST',
    body: JSON.stringify(estimateData),
  });
}

export async function updateOrderStatus(orderId, status, timelineTitle, timelineDescription) {
  return request(`/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, timelineTitle, timelineDescription }),
  });
}

export async function updateOrderCustomer(orderId, customerData) {
  return request(`/admin/orders/${orderId}/customer`, {
    method: 'PATCH',
    body: JSON.stringify(customerData),
  });
}

export async function updateOrderDetails(orderId, detailsData) {
  return request(`/admin/orders/${orderId}/details`, {
    method: 'PATCH',
    body: JSON.stringify(detailsData),
  });
}

// 3. Pricing & Catalog Controls
export async function getPricingServices() {
  return request('/admin/pricing/services');
}

export async function updatePricingService(code, serviceData) {
  return request(`/admin/pricing/services/${encodeURIComponent(code)}`, {
    method: 'PATCH',
    body: JSON.stringify(serviceData),
  });
}

// 4. Spare Parts Inventory
export async function getPartsInventory() {
  return request('/admin/inventory/parts');
}

export async function upsertSparePart(partData) {
  return request('/admin/inventory/parts', {
    method: 'POST',
    body: JSON.stringify(partData),
  });
}

// 5. Staff (Technicians & Riders)
export async function getStaff() {
  return request('/admin/staff');
}

// 6. Customers Directory
export async function getCustomers() {
  return request('/admin/customers');
}

export async function updateCustomer(customerId, customerData) {
  return request(`/admin/customers/${customerId}`, {
    method: 'PATCH',
    body: JSON.stringify(customerData),
  });
}
