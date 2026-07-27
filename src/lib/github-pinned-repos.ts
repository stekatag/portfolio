import { pinnedRepoEndpoints } from "../config/site";

export type PinnedRepo = {
  owner: string;
  repo: string;
  link: string;
  description: string;
  image: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
};

export type FetchLike = (url: string) => Promise<{ ok: boolean; json: () => Promise<unknown> }>;

export class PinnedReposError extends Error {
  constructor(public readonly code: "network" | "empty") {
    super(code === "empty" ? "No pinned repos found" : "Your network may be down. Please try again.");
  }
}

const isPinnedRepo = (value: unknown): value is PinnedRepo => {
  if (!value || typeof value !== "object") return false;
  const repo = value as Record<string, unknown>;
  return typeof repo.repo === "string" && typeof repo.link === "string" && typeof repo.description === "string" && typeof repo.language === "string";
};

async function fetchEndpoint(fetcher: FetchLike, endpoint: string): Promise<PinnedRepo[]> {
  let response: Awaited<ReturnType<FetchLike>>;
  try {
    response = await fetcher(endpoint);
  } catch {
    throw new PinnedReposError("network");
  }

  if (!response.ok) throw new PinnedReposError("network");

  try {
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0 || !data.every(isPinnedRepo)) {
      throw new PinnedReposError("empty");
    }
    return data;
  } catch (error) {
    if (error instanceof PinnedReposError) throw error;
    throw new PinnedReposError("empty");
  }
}

export async function loadPinnedRepos(
  fetcher: FetchLike = (url) => fetch(url),
  endpoints: readonly string[] = pinnedRepoEndpoints,
): Promise<PinnedRepo[]> {
  const [primary, fallback] = endpoints;
  try {
    return await fetchEndpoint(fetcher, primary);
  } catch {
    try {
      return await fetchEndpoint(fetcher, fallback);
    } catch (error) {
      throw error instanceof PinnedReposError ? error : new PinnedReposError("network");
    }
  }
}
