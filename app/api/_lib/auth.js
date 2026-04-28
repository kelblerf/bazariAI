import { getSupabaseAdmin } from '../../../lib/supabase-admin.js';
import { withCorsJson } from './cors';

const readBearerToken = (request) => {
  const header = request.headers.get('authorization') || request.headers.get('Authorization');

  if (!header?.startsWith('Bearer ')) {
    return '';
  }

  return header.slice('Bearer '.length).trim();
};

export const getAuthenticatedUser = async (request) => {
  const token = readBearerToken(request);

  if (!token) {
    return { user: null };
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return { user: null, error };
  }

  return { user: data.user };
};

export const requireAuthenticatedUser = async (request) => {
  const { user } = await getAuthenticatedUser(request);

  if (!user) {
    return {
      user: null,
      response: withCorsJson(
        {
          error: 'Pro tuto akci je nutné přihlášení.',
        },
        { status: 401 }
      ),
    };
  }

  return { user, response: null };
};
