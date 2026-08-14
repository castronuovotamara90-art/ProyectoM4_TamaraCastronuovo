import { FormEvent, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

type Session = {
  email: string;
  provider: "email" | "google";
};

type Task = {
  id: number;
  title: string;
  userEmail: string;
  completed: boolean;
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
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Revisar roadmap", userEmail: "usuario@demo.com", completed: false }
  ]);

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

  const handleAddTask = (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle || !session) {
      return;
    }

    setTasks((currentTasks) => [
      { id: Date.now(), title: trimmedTitle, userEmail: session.email, completed: false },
      ...currentTasks
    ]);
  };

  const handleUpdateTask = (taskId: number, nextTitle: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, title: nextTitle.trim() } : task
      )
    );
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
  tasks: Task[];
  onLogout: () => void;
  onAddTask: (title: string) => void;
  onUpdateTask: (taskId: number, nextTitle: string) => void;
  onToggleTaskComplete: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
};

function DashboardPage({
  session,
  tasks,
  onLogout,
  onAddTask,
  onUpdateTask,
  onToggleTaskComplete,
  onDeleteTask
}: DashboardPageProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const userTasks = tasks.filter((task) => task.userEmail === session.email);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddTask(taskTitle);
    setTaskTitle("");
  };

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const handleSaveTask = () => {
    if (editingTaskId === null) {
      return;
    }

    const trimmedTitle = editingTitle.trim();
    if (!trimmedTitle) {
      return;
    }

    onUpdateTask(editingTaskId, trimmedTitle);
    setEditingTaskId(null);
    setEditingTitle("");
  };

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

        <form onSubmit={handleSubmit} className="task-form">
          <div className="field-group">
            <label htmlFor="taskTitle">Titulo de la tarea</label>
            <input
              id="taskTitle"
              type="text"
              value={taskTitle}
              onChange={(event) => setTaskTitle(event.target.value)}
              placeholder="Escribe una tarea"
            />
          </div>

          <button type="submit" className="primary-button">
            Agregar tarea
          </button>
        </form>

        <div className="task-list" aria-live="polite">
          <h2>Tareas del usuario</h2>
          {userTasks.length === 0 ? (
            <p className="empty-state">Todavia no hay tareas para este usuario.</p>
          ) : (
            <ul>
              {userTasks.map((task) => (
                <li key={task.id} className={task.completed ? "task-item complete" : "task-item"}>
                  {editingTaskId === task.id ? (
                    <>
                      <input
                        aria-label={`Editar tarea ${task.title}`}
                        value={editingTitle}
                        onChange={(event) => setEditingTitle(event.target.value)}
                      />
                      <div className="task-actions">
                        <button type="button" className="small-button" onClick={handleSaveTask}>
                          Guardar cambios
                        </button>
                        <button
                          type="button"
                          className="small-button secondary"
                          onClick={() => {
                            setEditingTaskId(null);
                            setEditingTitle("");
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="task-main">
                        <span className={task.completed ? "task-title completed" : "task-title"}>
                          {task.title}
                        </span>
                        <span className="task-status">{task.completed ? "Completada" : "Pendiente"}</span>
                      </div>
                      <div className="task-actions">
                        <button type="button" className="small-button" onClick={() => handleEditTask(task)}>
                          Editar tarea
                        </button>
                        <button
                          type="button"
                          className="small-button"
                          onClick={() => onToggleTaskComplete(task.id)}
                        >
                          {task.completed ? "Marcar como pendiente" : "Marcar como completada"}
                        </button>
                        <button
                          type="button"
                          className="small-button danger"
                          onClick={() => onDeleteTask(task.id)}
                        >
                          Eliminar tarea
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="button" className="primary-button logout-button" onClick={onLogout}>
          Cerrar sesión
        </button>
      </section>
    </main>
  );
}

export default App;
