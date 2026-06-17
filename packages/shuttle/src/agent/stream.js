/**
 * @param {(event: string, data: Record<string, unknown>) => void} emit
 */
export function createStreamEmitter(emit) {
  return {
    status(data) {
      emit("status", data);
    },
    log(line, extra = {}) {
      if (line == null || line === "") return;
      emit("log", { line: String(line), ...extra });
    },
    error(message) {
      emit("error", { message: String(message) });
    },
    done(data) {
      emit("done", data);
    },
  };
}

/** @param {string} line */
export function parseAgentStreamLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  try {
    const obj = JSON.parse(trimmed);
    if (typeof obj.text === "string") return obj.text;
    if (typeof obj.content === "string") return obj.content;
    if (obj.type === "assistant" && typeof obj.message === "string") return obj.message;
    if (obj.type === "tool_call" || obj.type === "tool_use") {
      return `[${obj.name ?? obj.tool ?? "tool"}]`;
    }
    if (obj.type === "system" && obj.message) return `[system] ${obj.message}`;
    if (obj.type === "result" && obj.result) return String(obj.result);
    return null;
  } catch {
    return trimmed;
  }
}
