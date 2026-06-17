import { spawn } from "node:child_process";
import { buildPrompt } from "../prompt.js";
import { createStreamEmitter, parseAgentStreamLine } from "../stream.js";
import { getRunnerDefinition } from "../registry.js";

export const id = "cursor-cli";

function agentBin() {
  return process.env.CURSOR_AGENT_BIN || "agent";
}

export function getInfo() {
  const def = getRunnerDefinition(id);
  return {
    providerId: id,
    label: def.label,
    canExecuteFromApp: true,
    canStream: true,
    setupHint: "Run `agent login` once. Optional: CURSOR_API_KEY for API billing.",
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
  const modelId = settings.modelId;
  const root = ctx.projectRoot ?? process.cwd();

  stream.status({ phase: "starting", runner: id, modelId });
  stream.log(`Spawning ${agentBin()} --model ${modelId}`);

  const args = [
    "--print",
    "--output-format",
    "stream-json",
    "--stream-partial-output",
    "--workspace",
    root,
    "--model",
    modelId,
    "--approve-mcps",
    "--trust",
    prompt,
  ];

  const child = spawn(agentBin(), args, { cwd: root, env: process.env, stdio: ["ignore", "pipe", "pipe"] });

  let stdoutBuf = "";
  let stderrBuf = "";

  child.stdout.on("data", (chunk) => {
    stdoutBuf += chunk.toString();
    const lines = stdoutBuf.split("\n");
    stdoutBuf = lines.pop() ?? "";
    for (const line of lines) {
      const text = parseAgentStreamLine(line);
      if (text) stream.log(text, { kind: "stdout" });
    }
  });

  child.stderr.on("data", (chunk) => {
    const text = chunk.toString().trim();
    if (text) {
      stderrBuf += `${text}\n`;
      stream.log(text, { kind: "stderr" });
    }
  });

  const exit = await new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("close", resolve);
  });

  if (stdoutBuf.trim()) {
    const tail = parseAgentStreamLine(stdoutBuf) ?? stdoutBuf.trim();
    stream.log(tail, { kind: "stdout" });
  }

  if (exit === 0) {
    stream.done({
      providerId: id,
      status: "completed",
      message: "CLI agent run finished. Refresh requests if status is still pending.",
      prompt,
      exitCode: exit,
    });
    return;
  }

  stream.done({
    providerId: id,
    status: "failed",
    message: exit == null ? "CLI agent process failed to start." : `CLI agent exited with code ${exit}.`,
    prompt,
    error: stderrBuf.trim() || undefined,
    exitCode: exit,
  });
}

export async function execute(request, settings, ctx) {
  let result = null;
  await executeStream(request, settings, (_event, data) => {
    if (_event === "done") result = data;
  }, ctx);
  return result ?? { providerId: id, status: "failed", message: "CLI run produced no result." };
}
