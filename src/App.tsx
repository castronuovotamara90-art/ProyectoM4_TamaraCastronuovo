import { FormEvent, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

type Session = {
  email: string;
  provider: "email" | "google";
};

const DEMO_USER = {
  email: "usuario@demo.com",
  password: "123456"
};

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Completa email y password para continuar.");
      return;
    }

    if (email.toLowerCase() !== DEMO_USER.email || password !== DEMO_USER.password) {
      setError("Credenciales invalidas. Prueba usuario@demo.com / 123456");
      return;
    }

    setSession({ email: email.trim(), provider: "email" });
    setError("");
  };

  const handleGoogleLogin = () => {
    setSession({ email: "usuario.google@demo.com", provider: "google" });
    setError("");
  };

  const handleLogout = () => {
    setSession(null);
    setEmail("");
    setPassword("");
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginPage
            email={email}
            password={password}
            error={error}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleLogin}
            onGoogleLogin={handleGoogleLogin}
            isAuthenticated={Boolean(session)}
          />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={Boolean(session)}>
            <DashboardPage session={session} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={session ? "/dashboard" : "/login"} replace />} />
      <Route path="*" element={<Navigate to={session ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

type LoginPageProps = {
  email: string;
  password: string;
  error: string;
  isAuthenticated: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onGoogleLogin: () => void;
};

function LoginPage({
  email,
  password,
  error,
  isAuthenticated,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onGoogleLogin
}: LoginPageProps) {
  const location = useLocation();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const isProtectedAccess = location.state && (location.state as { from?: string }).from === "/dashboard";

  return (
    <main className="auth-shell">
      <section className="auth-card" aria-label="login de usuario">
        <p className="stage-chip">Etapa B1</p>
        <h1>Inicia sesión</h1>
        {isProtectedAccess ? <p className="notice">Acceso protegido</p> : null}
        <p className="subtitle">Ingresa tus credenciales para continuar.</p>

        <form onSubmit={onSubmit} className="auth-form">
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="usuario@demo.com"
              autoComplete="email"
            />
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="••••••"
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <p className="error-message" aria-live="polite">
              {error}
            </p>
          ) : null}

          <button type="submit" className="primary-button">
            Iniciar sesión
          </button>
        </form>

        <div className="divider">
          <span>o</span>
        </div>

        <button type="button" className="google-button" onClick={onGoogleLogin}>
          Continuar con Google
        </button>

        <p className="demo-credentials">
          Demo: <strong>usuario@demo.com</strong> / <strong>123456</strong>
        </p>
        <button type="button" className="secondary-button" onClick={() => navigate("/dashboard")}>
          Ir al dashboard
        </button>
      </section>
    </main>
  );
}

type ProtectedRouteProps = {
  isAuthenticated: boolean;
  children: React.ReactNode;
};

function ProtectedRoute({ isAuthenticated, children }: ProtectedRouteProps) {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

type DashboardPageProps = {
  session: Session | null;
  onLogout: () => void;
};

function DashboardPage({ session, onLogout }: DashboardPageProps) {
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="dashboard-shell">
      <section className="dashboard-card" aria-label="panel principal">
        <p className="stage-chip">Sesión activa</p>
        <h1>Panel principal</h1>
        <p className="user-email">{session.email}</p>
        <p className="provider-tag">{session.provider === "google" ? "Google" : "Email"}</p>
        <p className="dashboard-copy">
          Has ingresado correctamente a la gestion de tareas.
        </p>
        <button type="button" className="primary-button" onClick={onLogout}>
          Cerrar sesión
        </button>
      </section>
    </main>
  );
}

export default App;
