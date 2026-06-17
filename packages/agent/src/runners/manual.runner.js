import { buildPrompt } from "../prompt.js";
import { createStreamEmitter } from "../stream.js";
import { getRunnerDefinition } from "../registry.js";

export const id = "manual";

export function getInfo() {
  const def = getRunnerDefinition(id);
  return {
    providerId: id,
    label: def.label,
    canExecuteFromApp: false,
    canStream: true,
    setupHint: def.description,
  };
}

/**
 * @param {import('./types.js').AgentRequest} request
 * @param {{ modelId: string }} _settings
 * @param {(event: string, data: Record<string, unknown>) => void} emit
 * @param {{ projectRoot?: string, projectName?: string }} ctx
 */
export async function executeStream(request, _settings, emit, ctx = {}) {
  const stream = createStreamEmitter(emit);
  const prompt = buildPrompt(request, { projectName: ctx.projectName });

  stream.status({ phase: "manual", runner: id });
  stream.log("Copy the prompt below into a Cursor Agent chat in this repo.");
  for (const step of [
    "Open this repo in Cursor.",
    "Start Agent with AGENT.md context.",
    "Paste the prompt and let the agent process the queued request.",
    "Refresh the Agent page when the request file shows status done.",
  ]) {
    stream.log(step, { kind: "step" });
  }
  stream.log(prompt, { kind: "prompt" });

  stream.done({
    providerId: id,
    status: "manual",
    message: "Nothing runs automatically. Copy the prompt into Cursor Agent.",
    prompt,
    instructions: [
      "Open this repo in Cursor.",
      "Start Agent with AGENT.md context.",
      "Paste the prompt.",
      "Refresh when done.",
    ],
  });
}

export async function execute(request, settings, ctx) {
  let result = null;
  await executeStream(request, settings, (_event, data) => {
    if (_event === "done") result = data;
  }, ctx);
  return result;
}
