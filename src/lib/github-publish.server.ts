import { env } from "@/lib/env.server";
import { toPrettyJson } from "@/lib/site-json";
import type { SiteContent } from "@/lib/site-types";

export { mapGithubError } from "@/lib/github-errors";

const DEFAULT_PATH = "src/lib/app-data/app-data.json";
const DEFAULT_REPO = "hajbullint1-ctrl/site";

export type GithubPublishResult = {
  htmlUrl: string;
  path: string;
  repo: string;
  commitSha: string;
};

function githubHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "auto-emir-admin",
  };
}

async function readSha(
  repo: string,
  path: string,
  branch: string,
  token: string,
): Promise<{ sha?: string; branch: string }> {
  const url = `https://api.github.com/repos/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`;
  const res = await fetch(url, { headers: githubHeaders(token) });
  if (res.status === 404) return { branch };
  if (!res.ok) {
    throw Object.assign(new Error(`github_get_failed:${res.status}`), { status: res.status });
  }
  const data = (await res.json()) as { sha?: string };
  return { sha: data.sha, branch };
}

export async function publishAppDataJson(content: SiteContent): Promise<GithubPublishResult> {
  const token = env("GITHUB_TOKEN");
  const repo = env("GITHUB_REPO") ?? DEFAULT_REPO;
  const path = env("GITHUB_CONTENT_PATH") ?? DEFAULT_PATH;
  const preferredBranch = env("GITHUB_BRANCH") ?? "main";

  if (!token) throw new Error("github_not_configured");

  const body = toPrettyJson(content);
  try {
    const { writeFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    await writeFile(join(process.cwd(), DEFAULT_PATH), body, "utf8");
  } catch {
    // Deployed filesystem is read-only — GitHub is the source of truth there.
  }

  let meta: { sha?: string; branch: string };
  try {
    meta = await readSha(repo, path, preferredBranch, token);
  } catch (err) {
    if (preferredBranch === "main") {
      meta = await readSha(repo, path, "master", token);
    } else {
      throw err;
    }
  }

  const encoded = Buffer.from(body, "utf8").toString("base64");
  const payload: Record<string, unknown> = {
    message: "chore: publish Авто-Эмир content from admin",
    content: encoded,
    branch: meta.branch,
  };
  if (meta.sha) payload.sha = meta.sha;

  const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      ...githubHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!putRes.ok) {
    throw Object.assign(new Error(`github_put_failed:${putRes.status}`), {
      status: putRes.status,
    });
  }

  const result = (await putRes.json()) as {
    content?: { html_url?: string };
    commit?: { sha?: string; html_url?: string };
  };

  return {
    htmlUrl: result.commit?.html_url ?? result.content?.html_url ?? "",
    path,
    repo,
    commitSha: result.commit?.sha ?? "",
  };
}
