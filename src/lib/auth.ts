/**
 * Auth module — Enhanced with OTP, Forgot Password, Roles, Membership, Orders
 */

export type UserRole = "admin" | "customer";
export type MembershipStatus = "none" | "pending" | "active" | "rejected" | "expired";
export type OrderStatus = "pending" | "paid" | "processing" | "completed" | "cancelled";

export type User = {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  role: UserRole;
  membershipTier: "free" | "premium";
  membershipStatus: MembershipStatus;
  membershipExpiry?: string;
  emailVerified: boolean;
  createdAt: number;
  avatar?: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  category: string;
};

export type Order = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod?: string;
  createdAt: number;
  updatedAt: number;
  notes?: string;
};

export type MembershipRequest = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: "premium" | "fleet";
  price: number;
  paymentMethod: string;
  status: "pending" | "approved" | "rejected";
  createdAt: number;
  updatedAt: number;
  adminNote?: string;
};

type StoredUser = User & {
  passwordHash: string;
  failedAttempts: number;
  lockedUntil?: number;
  otpCode?: string;
  otpExpiry?: number;
  resetToken?: string;
  resetExpiry?: number;
};

type Session = { userId: string; token: string; expiresAt: number; createdAt: number; };

const USERS_KEY = "bh_users_v3";
const SESSION_KEY = "bh_session_v3";
const RATE_KEY = "bh_rate_v3";
const ORDERS_KEY = "bh_orders_v3";
const MEMBERSHIP_REQUESTS_KEY = "bh_membership_req_v3";
const CART_KEY = "bh_cart_v3";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const MAX_RATE_ATTEMPTS = 5;
const OTP_EXPIRY_MS = 10 * 60 * 1000;

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try { const r = localStorage.getItem(USERS_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
}
function writeUsers(u: StoredUser[]) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    if (s.expiresAt < Date.now()) { clearSession(); return null; }
    return s;
  } catch { return null; }
}
function writeSession(s: Session, persist: boolean) {
  const r = JSON.stringify(s);
  sessionStorage.setItem(SESSION_KEY, r);
  if (persist) localStorage.setItem(SESSION_KEY, r);
}
function clearSession() { sessionStorage.removeItem(SESSION_KEY); localStorage.removeItem(SESSION_KEY); }

type RateRecord = { count: number; windowStart: number };
function getRateRecord(email: string): RateRecord {
  try { const r = localStorage.getItem(`${RATE_KEY}:${email}`); return r ? JSON.parse(r) : { count: 0, windowStart: Date.now() }; } catch { return { count: 0, windowStart: Date.now() }; }
}
function incrementRate(email: string): RateRecord {
  const rec = getRateRecord(email);
  const now = Date.now();
  const expired = now - rec.windowStart > RATE_WINDOW_MS;
  const updated: RateRecord = expired ? { count: 1, windowStart: now } : { count: rec.count + 1, windowStart: rec.windowStart };
  localStorage.setItem(`${RATE_KEY}:${email}`, JSON.stringify(updated));
  return updated;
}
function clearRate(email: string) { localStorage.removeItem(`${RATE_KEY}:${email}`); }

async function hashPassword(password: string, salt?: string): Promise<string> {
  const s = salt || crypto.randomUUID().replace(/-/g, "");
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: enc.encode(s), iterations: 100000, hash: "SHA-256" }, key, 256);
  const hex = Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `pbkdf2:${s}:${hex}`;
}
async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try { const p = stored.split(":"); if (p.length !== 3 || p[0] !== "pbkdf2") return false; return await hashPassword(password, p[1]) === stored; } catch { return false; }
}
function generateToken(): string { const a = new Uint8Array(32); crypto.getRandomValues(a); return Array.from(a).map((b) => b.toString(16).padStart(2, "0")).join(""); }
function sanitize(s: string) { return s.trim().slice(0, 200); }
export function generateOtp(): string { const a = new Uint32Array(1); crypto.getRandomValues(a); return String(100000 + (a[0] % 900000)); }
function emit() { window.dispatchEvent(new Event("bh-auth-changed")); }

function stripUser(u: StoredUser): User {
  const { passwordHash: _a, failedAttempts: _b, lockedUntil: _c, otpCode: _d, otpExpiry: _e, resetToken: _f, resetExpiry: _g, ...pub } = u;
  return pub;
}

export function initializeAdmin() {
  const users = readUsers();
  if (users.some((u) => u.role === "admin")) return;
  const adminUser: StoredUser = {
    id: "admin-001", fullName: "Admin Bengkel Harun", email: "admin@bengkelharun.id",
    whatsapp: "081234567890", role: "admin", membershipTier: "premium",
    membershipStatus: "active", emailVerified: true, createdAt: Date.now(),
    passwordHash: "placeholder", failedAttempts: 0,
  };
  hashPassword("Admin@123456").then((hash) => {
    const u2 = readUsers(); const idx = u2.findIndex((u) => u.id === "admin-001");
    if (idx >= 0) { u2[idx].passwordHash = hash; writeUsers(u2); }
    else { adminUser.passwordHash = hash; u2.push(adminUser); writeUsers(u2); }
  });
  users.push(adminUser); writeUsers(users);
}

export function getSession(): User | null {
  const session = readSession(); if (!session) return null;
  const user = readUsers().find((u) => u.id === session.userId);
  if (!user) { clearSession(); return null; }
  return stripUser(user);
}

export async function register(input: { fullName: string; email: string; whatsapp: string; password: string; }): Promise<{ user: User; otp: string }> {
  const users = readUsers();
  const email = sanitize(input.email.toLowerCase());
  if (users.some((u) => u.email === email)) throw new Error("Email sudah terdaftar. Silakan login.");
  if (input.password.length < 8) throw new Error("Password minimal 8 karakter.");
  const otp = generateOtp();
  const newUser: StoredUser = {
    id: crypto.randomUUID(), fullName: sanitize(input.fullName), email,
    whatsapp: sanitize(input.whatsapp), passwordHash: await hashPassword(input.password),
    role: "customer", membershipTier: "free", membershipStatus: "none",
    emailVerified: false, createdAt: Date.now(), failedAttempts: 0,
    otpCode: otp, otpExpiry: Date.now() + OTP_EXPIRY_MS,
  };
  users.push(newUser); writeUsers(users);
  return { user: stripUser(newUser), otp };
}

export async function verifyOtp(email: string, otp: string): Promise<void> {
  const users = readUsers(); const idx = users.findIndex((u) => u.email === sanitize(email.toLowerCase()));
  if (idx === -1) throw new Error("Akun tidak ditemukan.");
  if (users[idx].emailVerified) return;
  if (!users[idx].otpCode || !users[idx].otpExpiry) throw new Error("OTP tidak valid.");
  if (Date.now() > users[idx].otpExpiry!) throw new Error("OTP kadaluarsa. Minta OTP baru.");
  if (users[idx].otpCode !== otp) throw new Error("OTP salah.");
  users[idx].emailVerified = true; users[idx].otpCode = undefined; users[idx].otpExpiry = undefined;
  writeUsers(users);
}

export async function resendOtp(email: string): Promise<string> {
  const users = readUsers(); const idx = users.findIndex((u) => u.email === sanitize(email.toLowerCase()));
  if (idx === -1) throw new Error("Akun tidak ditemukan.");
  const otp = generateOtp(); users[idx].otpCode = otp; users[idx].otpExpiry = Date.now() + OTP_EXPIRY_MS;
  writeUsers(users); return otp;
}

export async function login(email: string, password: string, remember: boolean): Promise<User> {
  const normalizedEmail = sanitize(email.toLowerCase());
  const rate = getRateRecord(normalizedEmail);
  if (Date.now() - rate.windowStart < RATE_WINDOW_MS && rate.count >= MAX_RATE_ATTEMPTS) {
    const remaining = Math.ceil((RATE_WINDOW_MS - (Date.now() - rate.windowStart)) / 60000);
    throw new Error(`Terlalu banyak percobaan. Coba lagi dalam ${remaining} menit.`);
  }
  const users = readUsers(); const userIdx = users.findIndex((u) => u.email === normalizedEmail);
  incrementRate(normalizedEmail);
  if (userIdx === -1) throw new Error("Email atau password salah.");
  const user = users[userIdx];
  if (user.lockedUntil && user.lockedUntil > Date.now()) { const r = Math.ceil((user.lockedUntil - Date.now()) / 60000); throw new Error(`Akun dikunci. Coba lagi dalam ${r} menit.`); }
  if (!await verifyPassword(password, user.passwordHash)) {
    users[userIdx].failedAttempts = (user.failedAttempts || 0) + 1;
    if (users[userIdx].failedAttempts >= MAX_FAILED_ATTEMPTS) users[userIdx].lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
    writeUsers(users); throw new Error("Email atau password salah.");
  }
  if (!user.emailVerified) throw new Error("EMAIL_NOT_VERIFIED:" + normalizedEmail);
  users[userIdx].failedAttempts = 0; users[userIdx].lockedUntil = undefined; writeUsers(users); clearRate(normalizedEmail);
  const session: Session = { userId: user.id, token: generateToken(), expiresAt: Date.now() + SESSION_DURATION_MS, createdAt: Date.now() };
  writeSession(session, remember); emit();
  return stripUser(user);
}

export async function forgotPassword(email: string): Promise<string> {
  const users = readUsers(); const idx = users.findIndex((u) => u.email === sanitize(email.toLowerCase()));
  if (idx === -1) throw new Error("Email tidak ditemukan.");
  const token = generateToken(); users[idx].resetToken = token; users[idx].resetExpiry = Date.now() + 30 * 60 * 1000;
  writeUsers(users); return token;
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const users = readUsers(); const idx = users.findIndex((u) => u.resetToken === token && u.resetExpiry && u.resetExpiry > Date.now());
  if (idx === -1) throw new Error("Token tidak valid atau kadaluarsa.");
  if (newPassword.length < 8) throw new Error("Password minimal 8 karakter.");
  users[idx].passwordHash = await hashPassword(newPassword); users[idx].resetToken = undefined; users[idx].resetExpiry = undefined;
  writeUsers(users);
}

export function logout() { clearSession(); emit(); }

// --- Orders ---
export function readOrders(): Order[] { try { const r = localStorage.getItem(ORDERS_KEY); return r ? JSON.parse(r) : []; } catch { return []; } }
function writeOrders(o: Order[]) { localStorage.setItem(ORDERS_KEY, JSON.stringify(o)); }
export function getUserOrders(userId: string): Order[] { return readOrders().filter((o) => o.userId === userId); }
export function createOrder(input: { userId: string; userName: string; userEmail: string; items: OrderItem[]; paymentMethod: string; notes?: string; }): Order {
  const orders = readOrders();
  const order: Order = {
    id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    ...input, total: input.items.reduce((s, i) => s + i.price * i.qty, 0),
    status: "pending", createdAt: Date.now(), updatedAt: Date.now(),
  };
  orders.push(order); writeOrders(orders); return order;
}
export function updateOrderStatus(orderId: string, status: OrderStatus): void {
  const orders = readOrders(); const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) throw new Error("Order tidak ditemukan.");
  orders[idx].status = status; orders[idx].updatedAt = Date.now(); writeOrders(orders); emit();
}

// --- Membership Requests ---
export function readMembershipRequests(): MembershipRequest[] { try { const r = localStorage.getItem(MEMBERSHIP_REQUESTS_KEY); return r ? JSON.parse(r) : []; } catch { return []; } }
function writeMembershipRequests(r: MembershipRequest[]) { localStorage.setItem(MEMBERSHIP_REQUESTS_KEY, JSON.stringify(r)); }
export function createMembershipRequest(input: { userId: string; userName: string; userEmail: string; plan: "premium" | "fleet"; price: number; paymentMethod: string; }): MembershipRequest {
  const requests = readMembershipRequests();
  const req: MembershipRequest = { id: `MEM-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, ...input, status: "pending", createdAt: Date.now(), updatedAt: Date.now() };
  requests.push(req); writeMembershipRequests(requests);
  const users = readUsers(); const idx = users.findIndex((u) => u.id === input.userId);
  if (idx >= 0) { users[idx].membershipStatus = "pending"; writeUsers(users); emit(); }
  return req;
}
export function approveMembership(requestId: string, adminNote?: string): void {
  const requests = readMembershipRequests(); const idx = requests.findIndex((r) => r.id === requestId);
  if (idx === -1) throw new Error("Request tidak ditemukan.");
  requests[idx].status = "approved"; requests[idx].updatedAt = Date.now(); if (adminNote) requests[idx].adminNote = adminNote;
  writeMembershipRequests(requests);
  const users = readUsers(); const ui = users.findIndex((u) => u.id === requests[idx].userId);
  if (ui >= 0) { const exp = new Date(); exp.setFullYear(exp.getFullYear() + 1); users[ui].membershipTier = "premium"; users[ui].membershipStatus = "active"; users[ui].membershipExpiry = exp.toISOString(); writeUsers(users); emit(); }
}
export function rejectMembership(requestId: string, adminNote?: string): void {
  const requests = readMembershipRequests(); const idx = requests.findIndex((r) => r.id === requestId);
  if (idx === -1) throw new Error("Request tidak ditemukan.");
  requests[idx].status = "rejected"; requests[idx].updatedAt = Date.now(); if (adminNote) requests[idx].adminNote = adminNote;
  writeMembershipRequests(requests);
  const users = readUsers(); const ui = users.findIndex((u) => u.id === requests[idx].userId);
  if (ui >= 0) { users[ui].membershipStatus = "rejected"; writeUsers(users); emit(); }
}

// --- Cart ---
export type CartItem = OrderItem;
export function readCart(userId: string): CartItem[] { try { const r = localStorage.getItem(`${CART_KEY}:${userId}`); return r ? JSON.parse(r) : []; } catch { return []; } }
export function writeCart(userId: string, items: CartItem[]) { localStorage.setItem(`${CART_KEY}:${userId}`, JSON.stringify(items)); }

// --- Admin ---
export function getAllUsers(): User[] { return readUsers().map(stripUser); }
export async function upgradeMembership(userId: string): Promise<void> {
  const users = readUsers(); const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error("User not found");
  const exp = new Date(); exp.setFullYear(exp.getFullYear() + 1);
  users[idx].membershipTier = "premium"; users[idx].membershipStatus = "active"; users[idx].membershipExpiry = exp.toISOString();
  writeUsers(users); emit();
}
