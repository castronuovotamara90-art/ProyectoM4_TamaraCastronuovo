import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const client = new SESv2Client({
  region: process.env.AWS_REGION
});

type SummaryTask = {
  title: string;
  completed: boolean;
};

type SummaryRequest = {
  userEmail?: unknown;
  tasks?: unknown;
};

export function buildSummaryEmail(userEmail: string, tasks: SummaryTask[]) {
  const lines = tasks.length
    ? tasks
        .map((task) => `${task.completed ? "[x]" : "[ ]"} ${task.title}`)
        .join("\n")
    : "[ ] Todavia no hay tareas registradas";

  return [
    `Resumen de tareas para ${userEmail}`,
    "",
    lines,
    "",
    "Este correo fue generado desde la Etapa E."
  ].join("\n");
}

export async function sendSummaryEmail(userEmail: string, tasks: SummaryTask[]) {
  const fromEmail = process.env.SES_FROM_EMAIL;

  if (!fromEmail || !process.env.AWS_REGION) {
    throw new Error("Missing SES configuration");
  }

  const command = new SendEmailCommand({
    FromEmailAddress: fromEmail,
    Destination: {
      ToAddresses: [userEmail]
    },
    Content: {
      Simple: {
        Subject: {
          Data: `Resumen de tareas de ${userEmail}`
        },
        Body: {
          Text: {
            Data: buildSummaryEmail(userEmail, tasks)
          }
        }
      }
    }
  });

  return client.send(command);
}

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const body = (await request.json()) as SummaryRequest;
  const userEmail = typeof body.userEmail === "string" ? body.userEmail : "";
  const tasks = Array.isArray(body.tasks)
    ? body.tasks
        .filter((task): task is SummaryTask =>
          Boolean(task) && typeof task === "object" && "title" in task && "completed" in task
        )
        .map((task) => ({
          title: String(task.title),
          completed: Boolean(task.completed)
        }))
    : [];

  if (!userEmail) {
    return Response.json({ error: "Missing userEmail" }, { status: 400 });
  }

  const result = await sendSummaryEmail(userEmail, tasks);

  return Response.json({ ok: true, userEmail, sentTasks: tasks.length, messageId: result.MessageId });
}
