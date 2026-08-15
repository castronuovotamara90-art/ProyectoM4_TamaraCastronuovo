import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../../src/App";
import { renderWithRouter } from "../../src/test-utils/renderWithRouter";

const postMock = vi.fn();

vi.stubGlobal("fetch", postMock);

describe("Etapa E - resumen por email", () => {
  beforeEach(() => {
    postMock.mockReset();
    postMock.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true })
    });
  });

  it("dispara el envio de resumen por email desde el dashboard", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />);

    await user.type(screen.getByLabelText(/email/i), "usuario@demo.com");
    await user.type(screen.getByLabelText(/password/i), "123456");
    await user.click(screen.getByRole("button", { name: /iniciar sesi[oó]n/i }));

    await user.click(screen.getByRole("button", { name: /enviar resumen por email/i }));

    expect(postMock).toHaveBeenCalledWith(
      "/api/send-summary",
      expect.objectContaining({
        method: "POST"
      })
    );
    expect(await screen.findByText(/resumen enviado/i)).toBeInTheDocument();
  });
});
