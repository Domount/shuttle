/**
 * @param {import('./types.js').AgentRequest} request
 * @param {{ projectName?: string, agentDoc?: string }} [context]
 */
export function buildPrompt(request, context = {}) {
  const projectName = context.projectName ?? "this Loom app";
  const agentDoc = context.agentDoc ?? "AGENT.md";
  const payload =
    request.payload && Object.keys(request.payload).length > 0
      ? `\nPayload: ${JSON.stringify(request.payload, null, 2)}`
      : "";

  return [
    `You are the agent for ${projectName}.`,
    `Read ${agentDoc} and active memory under memory/active/ before acting.`,
    "",
    "Process this pending request from data/requests/:",
    `- id: ${request.id}`,
    `- type: ${request.type}`,
    `- queued: ${request.createdAt ?? "unknown"}${payload}`,
    "",
    "Follow the task matrix in AGENT.md for this request type.",
    "When finished: write required data files, update request status to done, set completedAt and response.",
    "Do not change files the user did not ask for via this request.",
  ].join("\n");
}
