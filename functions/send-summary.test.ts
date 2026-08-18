import { describe, expect, it, vi, beforeEach } from "vitest";
import { buildSummaryEmail, default as handler } from "./send-summary";

const { sendMock } = vi.hoisted(() => ({
  sendMock: vi.fn().mockResolvedValue({ MessageId: "message-123" })
}));

vi.mock("@aws-sdk/client-sesv2", () => {
  return {
    SESv2Client: vi.fn(() => ({ send: sendMock })),
    SendEmailCommand: vi.fn((input) => input)
  };
});

describe("send-summary function", () => {
  beforeEach(() => {
    sendMock.mockClear();
    process.env.AWS_REGION = "eu-west-1";
    process.env.SES_FROM_EMAIL = "from@example.com";
  });

  it("builds a readable summary body", () => {
    const summary = buildSummaryEmail("usuario@demo.com", [
      { title: "Revisar roadmap", completed: false },
      { title: "Enviar reporte", completed: true }
    ]);

    expect(summary).toContain("Resumen de tareas para usuario@demo.com");
    expect(summary).toContain("[ ] Revisar roadmap");
    expect(summary).toContain("[x] Enviar reporte");
  });

  it("returns success and a messageId when the request is valid", async () => {
    const response = await handler(
      new Request("http://localhost/api/send-summary", {
        method: "POST",
        body: JSON.stringify({
          userEmail: "usuario@demo.com",
          tasks: [{ title: "Enviar reporte", completed: true }]
        })
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      userEmail: "usuario@demo.com",
      sentTasks: 1,
      messageId: "message-123"
    });
  });

  it("envia el resumen al email del usuario autenticado, no a una direccion fija", async () => {
    await handler(
      new Request("http://localhost/api/send-summary", {
        method: "POST",
        body: JSON.stringify({
          userEmail: "usuario-autenticado@demo.com",
          tasks: []
        })
      })
    );

    expect(sendMock).toHaveBeenCalledTimes(1);
    const sentCommand = sendMock.mock.calls[0][0];
    expect(sentCommand.Destination.ToAddresses).toEqual(["usuario-autenticado@demo.com"]);
  });

  it("rejects requests without userEmail", async () => {
    const response = await handler(
      new Request("http://localhost/api/send-summary", {
        method: "POST",
        body: JSON.stringify({ tasks: [] })
      })
    );

    expect(response.status).toBe(400);
  });
});
