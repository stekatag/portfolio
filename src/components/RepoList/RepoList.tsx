import { useState, useEffect } from "react";
import RepoCard from "../RepoCard/RepoCard";
import Spinner from "../ui/Spinner/Spinner";
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

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(
          "https://repos.sulej.ch/?username=stekatag"
        );
        const data = await response.json();
        setRepos(data);
      } catch (error) {
        console.error("Error fetching repos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return (
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
  );
}
