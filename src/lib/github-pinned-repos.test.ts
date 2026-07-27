import { describe, expect, it, vi } from "vitest";
import { loadPinnedRepos } from "./github-pinned-repos";

const repo = {
  owner: "stekatag", repo: "portfolio", link: "https://github.com/stekatag/portfolio",
  description: "Portfolio", image: "", language: "TypeScript", languageColor: "#3178c6", stars: 1, forks: 0,
};
const response = (body: unknown, ok = true) => ({ ok, json: async () => body });

describe("loadPinnedRepos", () => {
  it("uses the primary endpoint when it succeeds", async () => {
    const fetcher = vi.fn().mockResolvedValue(response([repo]));
    await expect(loadPinnedRepos(fetcher, ["primary", "fallback"])).resolves.toEqual([repo]);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("uses the fallback when the primary endpoint fails", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(response([], false)).mockResolvedValueOnce(response([repo]));
    await expect(loadPinnedRepos(fetcher, ["primary", "fallback"])).resolves.toEqual([repo]);
    expect(fetcher).toHaveBeenNthCalledWith(2, "fallback");
  });

  it("reports empty data after both endpoints fail validation", async () => {
    const fetcher = vi.fn().mockResolvedValue(response([]));
    await expect(loadPinnedRepos(fetcher, ["primary", "fallback"])).rejects.toMatchObject({ code: "empty" });
  });

  it("reports a network error when both endpoints are unavailable", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("offline"));
    await expect(loadPinnedRepos(fetcher, ["primary", "fallback"])).rejects.toMatchObject({ code: "network" });
  });
});
