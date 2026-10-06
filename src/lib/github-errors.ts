export function mapGithubError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err ?? "");
  if (message === "github_not_configured" || message.includes("github_not_configured")) {
    return "На сервере нет GITHUB_TOKEN. Добавьте его в переменные Vercel и выложите сайт ещё раз.";
  }
  if (message.includes("401")) {
    return "Токен GitHub недействителен. Обновите GITHUB_TOKEN в Vercel.";
  }
  if (message.includes("403")) {
    return "У токена нет прав на репозиторий. Нужен доступ contents:write.";
  }
  if (message.includes("404")) {
    return "Репозиторий не найден. Проверьте GITHUB_REPO (hajbullint1-ctrl/site).";
  }
  if (message.includes("409") || message.includes("422")) {
    return "Файл на GitHub изменился. Нажмите опубликовать ещё раз.";
  }
  if (message === "unauthorized") return "Сессия админки истекла. Войдите снова.";
  return "Не удалось опубликовать на GitHub. Попробуйте ещё раз.";
}
