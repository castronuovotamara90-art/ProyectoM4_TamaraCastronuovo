import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/App";
import { renderWithRouter } from "../../src/test-utils/renderWithRouter";

describe("Etapa B1 - autenticacion", () => {
  it("permite iniciar sesion con email y password y entra al dashboard", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />);

    await user.type(screen.getByLabelText(/email/i), "usuario@demo.com");
    await user.type(screen.getByLabelText(/password/i), "123456");
    await user.click(screen.getByRole("button", { name: /iniciar sesi[oó]n/i }));

    expect(await screen.findByRole("heading", { name: /panel principal/i })).toBeInTheDocument();
    expect(screen.getByText(/usuario@demo.com/i)).toBeInTheDocument();
  });

  it("redirige a login si el usuario intenta entrar a una ruta privada sin autenticarse", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "", "/dashboard");
    renderWithRouter(<App />);

    expect(await screen.findByRole("heading", { name: /inicia sesi[oó]n/i })).toBeInTheDocument();
    expect(screen.getByText(/acceso protegido/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/email/i), "usuario@demo.com");
    await user.type(screen.getByLabelText(/password/i), "123456");
    await user.click(screen.getByRole("button", { name: /iniciar sesi[oó]n/i }));

    expect(await screen.findByRole("heading", { name: /panel principal/i })).toBeInTheDocument();
  });

  it("permite iniciar sesion con Google y entra al dashboard", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />);

    await user.click(screen.getByRole("button", { name: /continuar con google/i }));

    expect(await screen.findByRole("heading", { name: /panel principal/i })).toBeInTheDocument();
    expect(screen.getByText(/usuario.google@demo.com/i)).toBeInTheDocument();
  });
});
