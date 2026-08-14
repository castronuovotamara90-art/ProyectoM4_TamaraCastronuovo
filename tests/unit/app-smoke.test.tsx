import { render, screen } from "@testing-library/react";
import App from "../../src/App";

describe("App", () => {
  it("muestra el estado de la etapa A", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /gestor estrat.gico de tareas/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/etapa a en progreso/i)).toBeInTheDocument();
  });
});
