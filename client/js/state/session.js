let auth = { user: null, token: null };

const AUTH_KEY = 'codequest_auth_v1';

export function getAuth() {
  const raw = sessionStorage.getItem(AUTH_KEY);
  if (raw) auth = JSON.parse(raw);
  return auth;
}

export function setAuth(next) {
  auth = next; sessionStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export function signOut() {
  auth = { user: null, token: null }; sessionStorage.removeItem(AUTH_KEY);
}


