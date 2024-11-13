import "./Spinner.styles.scss";

type SpinnerProps = {
  size?: string;
  color?: string;
};

export default function Spinner({
  size = "40px",
  color = "var(--accent-regular)",
}: SpinnerProps) {
  return (
    <div className="spinner" style={{ height: size }}>
      <div
        className="loader"
        style={{ borderTopColor: color, width: size, height: size }}
      ></div>
    </div>
  );
}
