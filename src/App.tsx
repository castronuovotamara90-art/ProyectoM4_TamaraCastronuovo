import { FormEvent, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Chrome,
  ListChecks,
  ListTodo,
  Lock,
  LogOut,
  Mail,
  Mails,
  Send,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react";
import { Priority, Task, toSession } from "./types";
import { useAuth } from "./hooks/useAuth";
import { useTasks } from "./hooks/useTasks";
import { logout, signIn, signInWithGoogle, signUp } from "./services/authService";
import CreateTaskPanel from "./CreateTaskPanel";
import PriorityPanel from "./PriorityPanel";
import StatusPanel from "./StatusPanel";

type PanelKey = "crear" | "prioridad" | "estado";
type AuthMode = "login" | "register";

function App() {
  const { user, loading: authLoading } = useAuth();
  const session = user ? toSession(user) : null;
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    addTask,
    updateTask,
    toggleComplete,
    deleteTask,
  } = useTasks(user?.uid ?? null, session?.email ?? null);

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summaryStatus, setSummaryStatus] = useState("");

  const resetAuthForm = () => {
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleToggleMode = () => {
    setMode((currentMode) => (currentMode === "login" ? "register" : "login"));
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Completa email y password para continuar.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      if (mode === "register") {
        await signUp(email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Ocurrio un error. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");

    try {
      await signInWithGoogle();
    } catch (googleError) {
      setError(googleError instanceof Error ? googleError.message : "Ocurrio un error. Intenta nuevamente.");
    }
  };

  const handleLogout = async () => {
    await logout();
    resetAuthForm();
    setSummaryStatus("");
  };

  const handleAddTask = (title: string, assignedTo: string, priority: Priority) => {
    if (!session) {
      return;
    }

    void addTask(title, assignedTo, priority);
  };

  const handleToggleTaskComplete = (taskId: string) => {
    void toggleComplete(taskId);
  };

  const handleDeleteTask = (taskId: string) => {
    void deleteTask(taskId);
  };

  const handleUpdateTask = (taskId: string, title: string) => {
    void updateTask(taskId, title);
  };

  if (authLoading) {
    return (
      <main className="auth-shell">
        <p className="notice">Cargando sesion...</p>
      </main>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginPage
            mode={mode}
            email={email}
            password={password}
            error={error}
            isSubmitting={isSubmitting}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
            onGoogleLogin={handleGoogleLogin}
            onToggleMode={handleToggleMode}
            isAuthenticated={Boolean(session)}
          />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={Boolean(session)}>
            <DashboardPage
              session={session}
              tasks={tasks}
              tasksLoading={tasksLoading}
              tasksError={tasksError}
              summaryStatus={summaryStatus}
              onSummaryStatusChange={setSummaryStatus}
              onLogout={handleLogout}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onToggleTaskComplete={handleToggleTaskComplete}
              onDeleteTask={handleDeleteTask}
            />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={session ? "/dashboard" : "/login"} replace />} />
      <Route path="*" element={<Navigate to={session ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

type LoginPageProps = {
  mode: AuthMode;
  email: string;
  password: string;
  error: string;
  isSubmitting: boolean;
  isAuthenticated: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onGoogleLogin: () => void;
  onToggleMode: () => void;
};

function LoginPage({
  mode,
  email,
  password,
  error,
  isSubmitting,
  isAuthenticated,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onGoogleLogin,
  onToggleMode,
}: LoginPageProps) {
  const location = useLocation();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const isProtectedAccess = location.state && (location.state as { from?: string }).from === "/dashboard";
  const isRegister = mode === "register";

  return (
    <main className="auth-shell">
      <section className="auth-card" aria-label={isRegister ? "registro de usuario" : "login de usuario"}>
        <p className="stage-chip">
          <ListChecks size={14} strokeWidth={2.5} />
          Gestor estratégico de tareas
        </p>
        <h1>{isRegister ? "Crea tu cuenta" : "Inicia sesión"}</h1>
        {isProtectedAccess ? (
          <p className="notice icon-label">
            <ShieldCheck size={16} />
            Acceso protegido
          </p>
        ) : null}
        <p className="subtitle">
          {isRegister
            ? "Registra un email y password para crear tu cuenta."
            : "Ingresa tus credenciales para continuar."}
        </p>

        <form onSubmit={onSubmit} className="auth-form">
          <div className="field-group">
            <label htmlFor="email" className="icon-label">
              <Mail size={15} />
              Email
            </label>
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
            <label htmlFor="password" className="icon-label">
              <Lock size={15} />
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="••••••"
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
          </div>

          {error ? (
            <p className="error-message" aria-live="polite">
              <AlertCircle size={16} />
              {error}
            </p>
          ) : null}

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isRegister ? "Crear cuenta" : "Iniciar sesión"}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="divider">
          <span>o</span>
        </div>

        <button type="button" className="google-button" onClick={onGoogleLogin}>
          <Chrome size={17} />
          Continuar con Google
        </button>

        <button type="button" className="secondary-button" onClick={onToggleMode}>
          <UserPlus size={16} />
          {isRegister ? "Ya tengo cuenta, iniciar sesión" : "No tengo cuenta, registrarme"}
        </button>

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
  session: { email: string; provider: "email" | "google" } | null;
  tasks: Task[];
  tasksLoading: boolean;
  tasksError: string;
  summaryStatus: string;
  onSummaryStatusChange: (value: string) => void;
  onLogout: () => void;
  onAddTask: (title: string, assignedTo: string, priority: Priority) => void;
  onUpdateTask: (taskId: string, title: string) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
};

function DashboardPage({
  session,
  tasks,
  tasksLoading,
  tasksError,
  summaryStatus,
  onSummaryStatusChange,
  onLogout,
  onAddTask,
  onUpdateTask,
  onToggleTaskComplete,
  onDeleteTask,
}: DashboardPageProps) {
  const [activePanel, setActivePanel] = useState<PanelKey>("crear");
  const [sendingSummary, setSendingSummary] = useState(false);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const handleSendSummary = async () => {
    setSendingSummary(true);
    onSummaryStatusChange("");

    try {
      const response = await fetch("/api/send-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: session.email,
          tasks: tasks.map((task) => ({
            title: task.title,
            assignedTo: task.assignedTo,
            priority: task.priority,
            completed: task.completed,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo enviar el resumen.");
      }

      onSummaryStatusChange("Resumen enviado");
    } catch {
      onSummaryStatusChange("No se pudo enviar el resumen");
    } finally {
      setSendingSummary(false);
    }
  };

  return (
    <main className="dashboard-shell">
      <section className="dashboard-card" aria-label="panel principal">
        <div className="dashboard-header">
          <div>
            <p className="stage-chip">
              <ShieldCheck size={14} strokeWidth={2.5} />
              Sesión activa
            </p>
            <h1>Panel principal</h1>
            <p className="user-email">
              <User size={14} />
              {session.email}
            </p>
          </div>
          <button type="button" className="secondary-button logout-button" onClick={onLogout}>
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>

        <nav className="panel-tabs" aria-label="Paneles de gestión de tareas">
          <button
            type="button"
            className={activePanel === "crear" ? "tab-button active" : "tab-button"}
            onClick={() => setActivePanel("crear")}
          >
            <ListTodo size={16} />
            Nueva tarea
          </button>
          <button
            type="button"
            className={activePanel === "prioridad" ? "tab-button active" : "tab-button"}
            onClick={() => setActivePanel("prioridad")}
          >
            <BarChart3 size={16} />
            Por prioridad
          </button>
          <button
            type="button"
            className={activePanel === "estado" ? "tab-button active" : "tab-button"}
            onClick={() => setActivePanel("estado")}
          >
            <ListChecks size={16} />
            Estado
          </button>
        </nav>

        {tasksError ? (
          <p className="error-message" aria-live="polite">
            <AlertCircle size={16} />
            {tasksError}
          </p>
        ) : null}

        {tasksLoading ? (
          <p className="notice">Cargando tareas...</p>
        ) : (
          <>
            {activePanel === "crear" ? (
              <CreateTaskPanel
                tasks={tasks}
                onAddTask={onAddTask}
                onUpdateTask={onUpdateTask}
                onToggleComplete={onToggleTaskComplete}
                onDelete={onDeleteTask}
              />
            ) : null}
            {activePanel === "prioridad" ? (
              <PriorityPanel
                tasks={tasks}
                onUpdateTask={onUpdateTask}
                onToggleComplete={onToggleTaskComplete}
                onDelete={onDeleteTask}
              />
            ) : null}
            {activePanel === "estado" ? (
              <StatusPanel
                tasks={tasks}
                onUpdateTask={onUpdateTask}
                onToggleComplete={onToggleTaskComplete}
                onDelete={onDeleteTask}
              />
            ) : null}
          </>
        )}

        <div className="summary-panel">
          <button
            type="button"
            className="primary-button"
            onClick={handleSendSummary}
            disabled={sendingSummary}
          >
            {sendingSummary ? <Mails size={16} /> : <Send size={16} />}
            {sendingSummary ? "Enviando resumen..." : "Enviar resumen por email"}
          </button>
          {summaryStatus ? (
            <p className="summary-status">
              <ShieldCheck size={15} />
              {summaryStatus}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}

export default App;
