"use client";

import { getSupabaseBrowser } from './supabase-browser';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

const buildUrl = (path, params) => {
  const url = new URL(path.startsWith('http') ? path : `${API_BASE_URL}${path}`, window.location.origin);

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

export const requestJson = async (path, { method = 'GET', body, params } = {}) => {
  const supabase = getSupabaseBrowser();
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;

  const response = await fetch(buildUrl(path, params), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    cache: 'no-store',
  });

  if (!response.ok) {
    let message = 'Pozadavek na backend selhal.';

    try {
      const error = await response.json();
      if (error?.error) {
        message = error.error;
        if (error?.details) {
          message += ` ${error.details}`;
        }
      }
    } catch {
      // ignore invalid json
    }

    throw new Error(message);
  }

  return response.json();
};

export const listingsApi = {
  list(sortBy, limit) {
    return requestJson('/listings', {
      params: { sortBy, limit },
    });
  },
  get(id) {
    return requestJson(`/listings/${id}`);
  },
  create(payload) {
    return requestJson('/listings', {
      method: 'POST',
      body: payload,
    });
  },
  update(id, payload) {
    return requestJson(`/listings/${id}`, {
      method: 'PATCH',
      body: payload,
    });
  },
  delete(id) {
    return requestJson(`/listings/${id}`, {
      method: 'DELETE',
    });
  },
};

export const aiApi = {
  identify(payload) {
    return requestJson('/ai/identify', {
      method: 'POST',
      body: payload,
    });
  },
  analyze(payload) {
    return requestJson('/ai/analyze', {
      method: 'POST',
      body: payload,
    });
  },
  price(payload) {
    return requestJson('/ai/price', {
      method: 'POST',
      body: payload,
    });
  },
  generate(payload) {
    return requestJson('/ai/generate', {
      method: 'POST',
      body: payload,
    });
  },
};

export const uploadsApi = {
  async upload(file) {
    const supabase = getSupabaseBrowser();
    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(buildUrl('/uploads/image'), {
      method: 'POST',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      body: formData,
      cache: 'no-store',
    });

    if (!response.ok) {
      let message = 'Nahrání souboru selhalo.';

      try {
        const error = await response.json();
        if (error?.error) {
          message = error.error;
          if (error?.details) {
            message += ` ${error.details}`;
          }
        }
      } catch {
        // ignore invalid json
      }

      throw new Error(message);
    }

    return response.json();
  },
  remove(fileUrl) {
    return requestJson('/uploads/image', {
      method: 'DELETE',
      body: { file_url: fileUrl },
    });
  },
};
