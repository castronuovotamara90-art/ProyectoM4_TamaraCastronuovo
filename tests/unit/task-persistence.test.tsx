import { act, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/App";
import { renderWithRouter } from "../../src/test-utils/renderWithRouter";
import { useTasks } from "../../src/hooks/useTasks";

describe("Etapa E - persistencia y sincronizacion", () => {
  it("cada usuario solo ve sus propias tareas", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />);

    await user.type(screen.getByLabelText(/email/i), "usuario@demo.com");
    await user.type(screen.getByLabelText(/password/i), "123456");
    await user.click(screen.getByRole("button", { name: /iniciar sesi[oó]n/i }));

    await user.type(screen.getByLabelText(/titulo de la tarea/i), "Tarea de usuario A");
    await user.click(screen.getByRole("button", { name: /agregar tarea/i }));
    expect(await screen.findByText(/tarea de usuario a/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cerrar sesi[oó]n/i }));

    await user.click(screen.getByRole("button", { name: /no tengo cuenta, registrarme/i }));
    await user.type(screen.getByLabelText(/email/i), "usuario-b@demo.com");
    await user.type(screen.getByLabelText(/password/i), "654321");
    await user.click(screen.getByRole("button", { name: /crear cuenta/i }));

    await screen.findByText(/todav[ií]a no hay tareas/i);
    expect(screen.queryByText(/tarea de usuario a/i)).not.toBeInTheDocument();
  });

  it("expone un mensaje de error si una operacion sobre Firestore falla", async () => {
    const { result } = renderHook(() => useTasks("uid-test", "usuario-test@demo.com"));

    expect(result.current.error).toBe("");

    await act(async () => {
      await result.current.updateTask("id-inexistente", "Nuevo titulo");
    });

    expect(result.current.error).toMatch(/error/i);
  });
});
