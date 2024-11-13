import Icon from "../ui/Icon/Icon";
import "./RepoCard.styles.scss";

type RepoCardProps = {
  repo: string;
  link: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
};

export default function RepoCard({
  repo,
  link,
  description,
  language,
  languageColor,
  stars,
  forks,
}: RepoCardProps) {
  return (
    <a
      className="repo-card"
      href={link}
      title="View repo"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="repo-card__header">
        <h3 className="repo-card__title">{repo}</h3>
        <Icon icon="github-logo" color="var(--gray-200)" size="2.5em" />
      </div>
      <p className="repo-card__description">{description}</p>
      <div className="repo-card__footer">
        <div className="repo-card__footer-left">
          <span
            className="repo-card__footer-lang-color"
            style={{ backgroundColor: languageColor }}
          ></span>
          <span className="repo-card__footer-language">{language}</span>
        </div>

        <div className="repo-card__footer-right">
          {stars > 0 && (
            <span className="repo-card__footer-stars">
              <Icon icon="star" color="var(--gray-200)" size="1.25em" />
              <span>{stars}</span>
            </span>
          )}
          {forks > 0 && (
            <span className="repo-card__footer-forks">
              <Icon icon="git-fork" color="var(--gray-200)" size="1.25em" />
              <span>{forks}</span>
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
