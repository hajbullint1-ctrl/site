export function mapGithubError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err ?? "");
  const detail = message.split(":").slice(2).join(":").trim();
  if (message === "github_not_configured" || message.includes("github_not_configured")) {
    return "На сервере нет GITHUB_TOKEN. Он должен быть в переменных Vercel.";
  }
  if (message.includes(":401") || message.includes("Bad credentials")) {
    return `Токен GitHub недействителен. ${detail}`.trim();
  }
  if (message.includes(":403") || message.includes("Resource not accessible")) {
    return `У токена нет права записывать файлы (contents). ${detail}`.trim();
  }
  if (message.includes(":404")) {
    return `Файл или репозиторий не найден. ${detail}`.trim();
  }
  if (message.includes(":409") || message.includes(":422")) {
    return `GitHub не принял запись. Нажмите «Сохранить» ещё раз. ${detail}`.trim();
  }
  if (message === "unauthorized" || message.includes("unauthorized")) {
    return "Сессия админки истекла. Войдите снова.";
  }
  if (message.startsWith("github_")) {
    return detail || "GitHub отклонил сохранение app-data.json.";
  }
  return message && message !== "undefined" ? message.slice(0, 220) : "Не удалось сохранить.";
}