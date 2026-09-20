// ========== API Configuration ==========
// وقتی روی سرور واقعی اجرا می‌شه، آدرس خالی بذار (نسبی)
// برای تست محلی: 'http://localhost:3000'
const API_BASE = '';  // خالی = همون دامنه سایت

async function apiRequest(path, options = {}) {
  const url = API_BASE + path;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `خطای سرور: ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error('API Error:', err);
    throw err;
  }
}

// محصولات
async function fetchProducts() {
  return apiRequest('/api/products');
}

async function fetchProduct(id) {
  return apiRequest(`/api/products/${id}`);
}

async function createProduct(product, password) {
  return apiRequest('/api/products', {
    method: 'POST',
    headers: { 'x-admin-password': password },
    body: JSON.stringify(product)
  });
}

async function updateProduct(id, product, password) {
  return apiRequest(`/api/products/${id}`, {
    method: 'PUT',
    headers: { 'x-admin-password': password },
    body: JSON.stringify(product)
  });
}

async function deleteProductApi(id, password) {
  return apiRequest(`/api/products/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-password': password }
  });
}

async function resetProducts(password) {
  return apiRequest('/api/products/reset', {
    method: 'POST',
    headers: { 'x-admin-password': password }
  });
}

async function submitOrder(orderData) {
  return apiRequest('/api/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
}

async function fetchOrders(password) {
  return apiRequest('/api/orders', {
    headers: { 'x-admin-password': password }
  });
}
