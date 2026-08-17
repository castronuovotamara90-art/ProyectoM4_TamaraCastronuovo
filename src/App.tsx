
import { FormEvent, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Priority, Session, Task } from "./types";
import CreateTaskPanel from "./CreateTaskPanel";
import PriorityPanel from "./PriorityPanel";
import StatusPanel from "./StatusPanel";
 
const DEMO_USER = {
  email: "usuario@demo.com",
  password: "123456",
};
 
type PanelKey = "crear" | "prioridad" | "estado";
 
function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Revisar roadmap",
      assignedTo: "Equipo producto",
      createdBy: "usuario@demo.com",
      priority: "media",
      completed: false,
    },
  ]);
  const [summaryStatus, setSummaryStatus] = useState("");
 
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
    setSummaryStatus("");
  };
 
  const handleAddTask = (title: string, assignedTo: string, priority: Priority) => {
    if (!session) {
      return;
    }
 
    setTasks((currentTasks) => [
      {
        id: Date.now(),
        title,
        assignedTo,
        createdBy: session.email,
        priority,
        completed: false,
      },
      ...currentTasks,
    ]);
  };
 
  const handleToggleTaskComplete = (taskId: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };
 
  const handleDeleteTask = (taskId: number) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  };

  const handleUpdateTask = (taskId: number, title: string) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? { ...task, title: trimmedTitle } : task))
    );
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
            <DashboardPage
              session={session}
              tasks={tasks}
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
  onGoogleLogin,
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
        <p className="stage-chip">Gestor estratégico de tareas</p>
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
  tasks: Task[];
  summaryStatus: string;
  onSummaryStatusChange: (value: string) => void;
  onLogout: () => void;
  onAddTask: (title: string, assignedTo: string, priority: Priority) => void;
  onUpdateTask: (taskId: number, title: string) => void;
  onToggleTaskComplete: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
};
 
function DashboardPage({
  session,
  tasks,
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
            <p className="stage-chip">Sesión activa</p>
            <h1>Panel principal</h1>
            <p className="user-email">{session.email}</p>
          </div>
          <button type="button" className="secondary-button logout-button" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
 
        <nav className="panel-tabs" aria-label="Paneles de gestión de tareas">
          <button
            type="button"
            className={activePanel === "crear" ? "tab-button active" : "tab-button"}
            onClick={() => setActivePanel("crear")}
          >
            Nueva tarea
          </button>
          <button
            type="button"
            className={activePanel === "prioridad" ? "tab-button active" : "tab-button"}
            onClick={() => setActivePanel("prioridad")}
          >
            Por prioridad
          </button>
          <button
            type="button"
            className={activePanel === "estado" ? "tab-button active" : "tab-button"}
            onClick={() => setActivePanel("estado")}
          >
            Estado
          </button>
        </nav>
 
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
 
        <div className="summary-panel">
          <button
            type="button"
            className="primary-button"
            onClick={handleSendSummary}
            disabled={sendingSummary}
          >
            {sendingSummary ? "Enviando resumen..." : "Enviar resumen por email"}
          </button>
          {summaryStatus ? <p className="summary-status">{summaryStatus}</p> : null}
        </div>
      </section>
    </main>
  );
}
 
export default App;
