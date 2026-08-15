import { describe, expect, it, vi, beforeEach } from "vitest";
import { buildSummaryEmail, default as handler } from "./send-summary";

vi.mock("@aws-sdk/client-sesv2", () => {
  const send = vi.fn().mockResolvedValue({ MessageId: "message-123" });
  return {
    SESv2Client: vi.fn(() => ({ send })),
    SendEmailCommand: vi.fn((input) => input),
    __sendMock: send
  };
});

describe("send-summary function", () => {
  beforeEach(() => {
    process.env.AWS_REGION = "eu-west-1";
    process.env.SES_FROM_EMAIL = "from@example.com";
    process.env.SES_TO_EMAIL = "to@example.com";
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

  it("returns success when the request is valid", async () => {
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
    await expect(response.json()).resolves.toEqual({ ok: true, userEmail: "usuario@demo.com", sentTasks: 1 });
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
