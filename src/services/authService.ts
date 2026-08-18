import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "Credenciales invalidas. Revisa tu email y password.",
  "auth/invalid-email": "El email ingresado no es valido.",
  "auth/user-not-found": "No existe una cuenta con ese email.",
  "auth/wrong-password": "Credenciales invalidas. Revisa tu email y password.",
  "auth/email-already-in-use": "Ya existe una cuenta registrada con ese email.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/popup-closed-by-user": "Se cerro la ventana de Google antes de completar el inicio de sesion.",
  "auth/too-many-requests": "Demasiados intentos. Intenta de nuevo en unos minutos.",
};

function toErrorMessage(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;
  return (code && ERROR_MESSAGES[code]) || "Ocurrio un error. Intenta nuevamente.";
}

export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function signUp(email: string, password: string): Promise<User> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return credential.user;
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
}

export async function signIn(email: string, password: string): Promise<User> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
}

export async function signInWithGoogle(): Promise<User> {
  try {
    const credential = await signInWithPopup(auth, new GoogleAuthProvider());
    return credential.user;
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
}

export async function logout(): Promise<void> {
  await signOut(auth);
}
