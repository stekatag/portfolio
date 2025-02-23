import { useState, useEffect } from "react";
import RepoCard from "../RepoCard/RepoCard";
import Spinner from "../ui/Spinner/Spinner";
import Alert from "../ui/Alert/Alert";
import "./RepoList.styles.scss";

type PinnedRepos = {
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

export default function RepoList() {
  const [repos, setRepos] = useState<PinnedRepos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async (url: string): Promise<PinnedRepos[]> => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data.length === 0) {
        throw new Error("No pinned repos found");
      }
      return data;
    };

    const attemptFetch = async () => {
      try {
        // Try primary URL first
        const data = await fetchRepos(
          "https://pinned-repos.teamsync.vip/stekatag"
        );
        setRepos(data);
      } catch (primaryError) {
        console.error("Primary URL failed, trying fallback:", primaryError);

        try {
          // Try fallback URL
          const data = await fetchRepos(
            "https://gh-pinned-repos-tsj7ta5xfhep.deno.dev/?username=stekatag"
          );
          setRepos(data);
        } catch (fallbackError: any) {
          if (fallbackError.message === "Network response was not ok") {
            setError("Your network may be down. Please try again.");
          } else if (fallbackError.message === "No pinned repos found") {
            setError("No pinned repos found");
          } else {
            setError("Error fetching repos");
          }
          console.error("Both URLs failed:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    attemptFetch();
  }, []);

  return (
    <>
      <div className="repos">
        {loading ? (
          <div className="spinner-wrapper">
            <h4>Loading projects</h4>
            <Spinner />
          </div>
        ) : (
          repos.map((repo) => <RepoCard key={repo.repo} {...repo} />)
        )}
      </div>
      {error && <Alert message={error} />}
    </>
  );
}
