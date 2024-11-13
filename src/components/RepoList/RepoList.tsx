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
    const fetchRepos = async () => {
      try {
        const response = await fetch(
          "https://gh-pinned-repos-tsj7ta5xfhep.deno.dev/?username=stekatag"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (data.length === 0) {
          throw new Error("No pinned repos found");
        }
        setRepos(data);
      } catch (error: any) {
        if (error.message === "Network response was not ok") {
          setError("Your network may be down. Please try again.");
        } else if (error.message === "No pinned repos found") {
          setError("No pinned repos found");
        } else {
          setError("Error fetching repos");
        }
        console.error("Error fetching repos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
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
