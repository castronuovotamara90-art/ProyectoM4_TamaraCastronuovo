import "@testing-library/jest-dom/vitest";
import { beforeEach, vi } from "vitest";

type MockUser = {
  uid: string;
  email: string;
  providerData: { providerId: string }[];
};

type MockTask = {
  id: string;
  userId: string;
  createdBy: string;
  title: string;
  assignedTo: string;
  priority: string;
  completed: boolean;
  createdAt: number;
};

const DEMO_USERS = new Map<string, string>();
let currentUser: MockUser | null = null;
const listeners = new Set<(user: MockUser | null) => void>();

let DEMO_TASKS: MockTask[] = [];
let nextTaskId = 1;
const taskListeners = new Set<{ userId: string; callback: () => void }>();

function notify() {
  listeners.forEach((listener) => listener(currentUser));
}

function notifyTasks() {
  taskListeners.forEach((listener) => listener.callback());
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
  DEMO_TASKS = [];
  nextTaskId = 1;
  taskListeners.clear();
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

type MockClause = { __type: "where" | "orderBy"; field: string; value?: unknown };
type MockQuery = { clauses: MockClause[] };
type MockDocRef = { id: string };

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(() => ({})),
  collection: (_db: unknown, path: string) => ({ __type: "collection", path }),
  doc: (_db: unknown, _path: string, id: string) => ({ __type: "doc", id }),
  query: (_collectionRef: unknown, ...clauses: MockClause[]): MockQuery => ({ clauses }),
  where: (field: string, _op: string, value: unknown): MockClause => ({ __type: "where", field, value }),
  orderBy: (field: string): MockClause => ({ __type: "orderBy", field }),
  serverTimestamp: () => Date.now(),
  onSnapshot: (
    queryRef: MockQuery,
    onNext: (snapshot: { docs: { id: string; data: () => unknown }[] }) => void,
    _onError?: (error: Error) => void
  ) => {
    const userId = queryRef.clauses.find((clause) => clause.__type === "where")?.value as string;

    const emit = () => {
      const docsForUser = DEMO_TASKS.filter((task) => task.userId === userId).sort(
        (a, b) => b.createdAt - a.createdAt
      );
      onNext({
        docs: docsForUser.map((task) => ({
          id: task.id,
          data: () => {
            const { id: _id, ...rest } = task;
            return rest;
          },
        })),
      });
    };

    const listener = { userId, callback: emit };
    taskListeners.add(listener);
    emit();

    return () => taskListeners.delete(listener);
  },
  addDoc: async (_collectionRef: unknown, data: Record<string, unknown>) => {
    const id = String(nextTaskId++);
    DEMO_TASKS.push({
      id,
      userId: data.userId as string,
      createdBy: data.createdBy as string,
      title: data.title as string,
      assignedTo: data.assignedTo as string,
      priority: data.priority as string,
      completed: Boolean(data.completed),
      createdAt: Date.now() + Number(id),
    });
    notifyTasks();
    return { id };
  },
  updateDoc: async (docRef: MockDocRef, data: Record<string, unknown>) => {
    const task = DEMO_TASKS.find((current) => current.id === docRef.id);
    if (!task) {
      throw authError("not-found");
    }
    Object.assign(task, data);
    notifyTasks();
  },
  deleteDoc: async (docRef: MockDocRef) => {
    DEMO_TASKS = DEMO_TASKS.filter((task) => task.id !== docRef.id);
    notifyTasks();
  },
}));
