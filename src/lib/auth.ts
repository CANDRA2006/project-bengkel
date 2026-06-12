// Simulasi auth dengan localStorage. Tidak ada backend.
export type User = {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
};

const USERS_KEY = "bh_users";
const SESSION_KEY = "bh_session";

type StoredUser = User & { password: string };

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function register(input: Omit<StoredUser, "id">): User {
  const users = readUsers();
  if (users.some((u) => u.email === input.email)) {
    throw new Error("Email sudah terdaftar");
  }
  const user: StoredUser = { ...input, id: crypto.randomUUID() };
  users.push(user);
  writeUsers(users);
  const { password: _p, ...session } = user;
  return session;
}

export function login(email: string, password: string, remember: boolean): User {
  const users = readUsers();
  const found = users.find((u) => u.email === email && u.password === password);
  if (!found) throw new Error("Email atau password salah");
  const { password: _p, ...session } = found;
  if (remember) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  // sync
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("bh-auth-changed"));
  return session;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("bh-auth-changed"));
}

// Simulasi OTP WhatsApp
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
