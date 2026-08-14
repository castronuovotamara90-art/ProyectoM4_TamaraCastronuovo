import { screen } from "@testing-library/react";
import App from "../../src/App";
import { renderWithRouter } from "../../src/test-utils/renderWithRouter";

describe("App", () => {
  it("muestra el formulario de login de la Etapa B1", () => {
    renderWithRouter(<App />);

    expect(screen.getByRole("heading", { name: /inicia sesi[oó]n/i })).toBeInTheDocument();
    expect(screen.getByText(/ingresa tus credenciales para continuar/i)).toBeInTheDocument();
  });
});
