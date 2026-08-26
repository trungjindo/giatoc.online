// Lớp giao tiếp với backend PHP / Node.js đa dòng họ (Multi-Tenancy giatoc.online).
// Hỗ trợ tự động gắn token xác thực con cháu (X-Viewer-Token) và định danh dòng họ (X-Tenant-Slug).

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

export const VIEWER_TOKEN_KEY = 'familyViewerToken';
export const TENANT_SLUG_KEY = 'familyTenantSlug';

export class ApiAuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ApiAuthError';
    this.isAuthError = true;
  }
}

// Token xác thực con cháu được gắn TỰ ĐỘNG vào mọi lời gọi API
function viewerHeaders() {
  try {
    const t = localStorage.getItem(VIEWER_TOKEN_KEY);
    return t ? { 'X-Viewer-Token': t } : {};
  } catch {
    return {};
  }
}

// Gắn thông tin Tenant nếu đang chạy ở môi trường phát triển (localhost) hoặc cấu hình riêng
function tenantHeaders() {
  try {
    const slug = localStorage.getItem(TENANT_SLUG_KEY) || import.meta.env.VITE_TENANT_SLUG;
    return slug ? { 'X-Tenant-Slug': slug } : {};
  } catch {
    return {};
  }
}

async function parseJsonOrThrow(res) {
  let body;
  try {
    body = await res.json();
  } catch {
    throw new Error('Máy chủ trả về dữ liệu không hợp lệ.');
  }
  if (!res.ok) {
    const message = body?.error || `Lỗi máy chủ (${res.status})`;
    if (res.status === 401) throw new ApiAuthError(message);
    throw new Error(message);
  }
  return body;
}

export async function apiGet(key, token) {
  const res = await fetch(`${API_URL}/data.php?key=${encodeURIComponent(key)}`, {
    cache: 'no-store',
    headers: {
      ...viewerHeaders(),
      ...tenantHeaders(),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return parseJsonOrThrow(res);
}

export async function apiVerifyFamily({ fullName, fatherName, teHoDay, teHoMonth }) {
  const res = await fetch(`${API_URL}/family_verify.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...tenantHeaders(),
    },
    body: JSON.stringify({ fullName, fatherName, teHoDay, teHoMonth })
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, ...body };
}

export async function apiSave(key, data, token) {
  const res = await fetch(`${API_URL}/data.php?key=${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...tenantHeaders(),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data)
  });
  return parseJsonOrThrow(res);
}

export async function apiLogin(username, password) {
  const res = await fetch(`${API_URL}/login.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...tenantHeaders(),
    },
    body: JSON.stringify({ username, password })
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, ...body };
}

export async function apiLogout(token) {
  if (!token) return;
  try {
    await fetch(`${API_URL}/logout.php`, {
      method: 'POST',
      headers: {
        ...tenantHeaders(),
        Authorization: `Bearer ${token}`
      }
    });
  } catch {
    // Đăng xuất cục bộ vẫn tiếp tục
  }
}

export async function apiUpload(file, type, token) {
  const fd = new FormData();
  fd.append('image', file);
  const res = await fetch(`${API_URL}/upload.php?type=${encodeURIComponent(type)}`, {
    method: 'POST',
    headers: {
      ...tenantHeaders(),
      Authorization: `Bearer ${token}`
    },
    body: fd
  });
  return parseJsonOrThrow(res);
}

export async function apiRequest(path, { method = 'GET', body, token, params } = {}) {
  const query = params
    ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== null)).toString()
    : '';
  const res = await fetch(`${API_URL}/${path}${query}`, {
    method,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...viewerHeaders(),
      ...tenantHeaders(),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {})
  });
  return parseJsonOrThrow(res);
}
