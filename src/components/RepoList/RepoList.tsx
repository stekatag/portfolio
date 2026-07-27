import { useState, useEffect } from "react";
import RepoCard from "../RepoCard/RepoCard";
import Alert from "../ui/Alert/Alert";
import { loadPinnedRepos, PinnedReposError, type PinnedRepo } from "../../lib/github-pinned-repos";
import "./RepoList.styles.scss";

function RepoCardSkeleton() {
  return (
    <article className="repo-card repo-card--skeleton" aria-hidden="true">
      <div className="repo-card__header">
        <span className="repo-card__skeleton-line repo-card__skeleton-line--title" />
        <span className="repo-card__skeleton-icon" />
      </div>
      <div className="repo-card__skeleton-copy">
        <span className="repo-card__skeleton-line" />
        <span className="repo-card__skeleton-line" />
        <span className="repo-card__skeleton-line repo-card__skeleton-line--short" />
      </div>
      <div className="repo-card__footer">
        <span className="repo-card__skeleton-meta" />
        <span className="repo-card__skeleton-stats" />
      </div>
    </article>
  );
}

export default function RepoList() {
  const [repos, setRepos] = useState<PinnedRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setRepos(await loadPinnedRepos());
      } catch (error) {
        setError(error instanceof PinnedReposError ? error.message : "Error fetching repos");
        console.error("Unable to load pinned repositories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return (
    <>
      {loading && <p className="sr-only" role="status">Loading GitHub-pinned builds.</p>}
      <div className="repos" aria-busy={loading}>
        {loading ? (
          Array.from({ length: 6 }, (_, index) => <RepoCardSkeleton key={index} />)
        ) : (
          repos.map((repo) => <RepoCard key={repo.repo} {...repo} />)
        )}
      </div>
      {error && <Alert message={error} />}
    </>
  );
}
