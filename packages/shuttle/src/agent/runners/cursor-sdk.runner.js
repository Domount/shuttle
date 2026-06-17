import { buildPrompt } from "../prompt.js";
import { createStreamEmitter } from "../stream.js";
import { getRunnerDefinition, sdkModelSelection } from "../registry.js";

export const id = "cursor-sdk";

function isConfigured() {
  return Boolean(process.env.CURSOR_API_KEY);
}

export function getInfo() {
  const def = getRunnerDefinition(id);
  const configured = isConfigured();
  return {
    providerId: id,
    label: def.label,
    canExecuteFromApp: configured,
    canStream: configured,
    setupHint: configured
      ? "SDK runs with CURSOR_API_KEY."
      : "Set CURSOR_API_KEY and install @cursor/sdk to enable.",
  };
}

/**
 * @param {import('../types.js').AgentRequest} request
 * @param {{ modelId: string }} settings
 * @param {(event: string, data: Record<string, unknown>) => void} emit
 * @param {{ projectRoot?: string, projectName?: string }} ctx
 */
export async function executeStream(request, settings, emit, ctx = {}) {
  const stream = createStreamEmitter(emit);
  const prompt = buildPrompt(request, { projectName: ctx.projectName });
  const root = ctx.projectRoot ?? process.cwd();

  if (!isConfigured()) {
    stream.done({ providerId: id, status: "not-configured", message: getInfo().setupHint, prompt });
    return;
  }

  let Agent;
  try {
    ({ Agent } = await import("@cursor/sdk"));
  } catch {
    stream.done({
      providerId: id,
      status: "not-configured",
      message: "Install @cursor/sdk in server/ (npm install @cursor/sdk).",
      prompt,
    });
    return;
  }

  const model = sdkModelSelection(settings.modelId);
  stream.status({ phase: "running", runner: id, modelId: settings.modelId });

  try {
    await using agent = await Agent.create({
      apiKey: process.env.CURSOR_API_KEY,
      model,
      local: { cwd: root },
    });

    const run = await agent.send(prompt);
    for await (const event of run.stream()) {
      if (event.type === "assistant") {
        for (const block of event.message?.content ?? []) {
          if (block.type === "text" && block.text) stream.log(block.text, { kind: "assistant" });
        }
      } else if (event.type === "tool_call" || event.type === "tool_use") {
        stream.log(`[tool] ${event.name ?? event.tool ?? "tool"}`, { kind: "tool" });
      }
    }

    await run.wait();
    const status = run.status === "completed" ? "completed" : "failed";

    stream.done({
      providerId: id,
      status,
      message:
        status === "completed"
          ? "SDK run finished. Refresh requests if still pending."
          : `SDK run ended: ${run.status}`,
      prompt,
      error: status === "completed" ? undefined : String(run.result ?? run.status),
    });
  } catch (err) {
    stream.done({
      providerId: id,
      status: "failed",
      message: "Cursor SDK run failed.",
      prompt,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

export async function execute(request, settings, ctx) {
  let result = null;
  await executeStream(request, settings, (_event, data) => {
    if (_event === "done") result = data;
  }, ctx);
  return result ?? { providerId: id, status: "failed", message: "SDK run produced no result." };
}
