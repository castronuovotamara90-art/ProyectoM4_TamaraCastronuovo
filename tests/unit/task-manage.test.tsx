import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/App";
import { renderWithRouter } from "../../src/test-utils/renderWithRouter";

describe("Etapa D - gestion de tareas", () => {
  it("edita, marca como completada y elimina una tarea del usuario", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />);

    await user.type(screen.getByLabelText(/email/i), "usuario@demo.com");
    await user.type(screen.getByLabelText(/password/i), "123456");
    await user.click(screen.getByRole("button", { name: /iniciar sesi[oó]n/i }));

    await user.type(screen.getByLabelText(/titulo de la tarea/i), "Preparar sprint");
    await user.click(screen.getByRole("button", { name: /agregar tarea/i }));

    const task = await screen.findByText(/preparar sprint/i);
    expect(task).toBeInTheDocument();

    const editButtons = screen.getAllByRole("button", { name: /editar tarea/i });
    await user.click(editButtons[0]);

    const editInput = screen.getByDisplayValue(/preparar sprint/i);
    await user.clear(editInput);
    await user.type(editInput, "Preparar sprint final");
    await user.click(screen.getByRole("button", { name: /guardar cambios/i }));

    expect(await screen.findByText(/preparar sprint final/i)).toBeInTheDocument();

    const completeButtons = screen.getAllByRole("button", { name: /marcar como completada/i });
    await user.click(completeButtons[0]);
    expect(await screen.findByRole("button", { name: /marcar como pendiente/i })).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole("button", { name: /eliminar tarea/i });
    await user.click(deleteButtons[0]);
    expect(screen.queryByText(/preparar sprint final/i)).not.toBeInTheDocument();
  });
});
