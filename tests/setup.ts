import "@testing-library/jest-dom/vitest";
import { beforeEach, vi } from "vitest";

type MockUser = {
  uid: string;
  email: string;
  providerData: { providerId: string }[];
};

const DEMO_USERS = new Map<string, string>();
let currentUser: MockUser | null = null;
const listeners = new Set<(user: MockUser | null) => void>();

function notify() {
  listeners.forEach((listener) => listener(currentUser));
}

function authError(code: string) {
  const error = new Error(code) as Error & { code: string };
  error.code = code;
  return error;
}

beforeEach(() => {
  currentUser = null;
  listeners.clear();
  DEMO_USERS.clear();
  DEMO_USERS.set("usuario@demo.com", "123456");
});

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: (_auth: unknown, callback: (user: MockUser | null) => void) => {
    listeners.add(callback);
    callback(currentUser);
    return () => listeners.delete(callback);
  },
  signInWithEmailAndPassword: async (_auth: unknown, email: string, password: string) => {
    const storedPassword = DEMO_USERS.get(email);
    if (!storedPassword || storedPassword !== password) {
      throw authError("auth/invalid-credential");
    }
    currentUser = { uid: email, email, providerData: [{ providerId: "password" }] };
    notify();
    return { user: currentUser };
  },
  createUserWithEmailAndPassword: async (_auth: unknown, email: string, password: string) => {
    if (DEMO_USERS.has(email)) {
      throw authError("auth/email-already-in-use");
    }
    DEMO_USERS.set(email, password);
    currentUser = { uid: email, email, providerData: [{ providerId: "password" }] };
    notify();
    return { user: currentUser };
  },
  signInWithPopup: async () => {
    currentUser = {
      uid: "google-demo-uid",
      email: "usuario.google@demo.com",
      providerData: [{ providerId: "google.com" }],
    };
    notify();
    return { user: currentUser };
  },
  signOut: async () => {
    currentUser = null;
    notify();
  },
  GoogleAuthProvider: class GoogleAuthProvider {},
}));
