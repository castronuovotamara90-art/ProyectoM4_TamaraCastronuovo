import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/App";
import { renderWithRouter } from "../../src/test-utils/renderWithRouter";

describe("Etapa C - tareas", () => {
  it("crea y lista una tarea en el dashboard del usuario", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />);

    await user.type(screen.getByLabelText(/email/i), "usuario@demo.com");
    await user.type(screen.getByLabelText(/password/i), "123456");
    await user.click(screen.getByRole("button", { name: /iniciar sesi[oó]n/i }));

    await user.type(screen.getByLabelText(/titulo de la tarea/i), "Preparar briefing semanal");
    await user.click(screen.getByRole("button", { name: /agregar tarea/i }));

    expect(await screen.findByText(/preparar briefing semanal/i)).toBeInTheDocument();
  });
});
