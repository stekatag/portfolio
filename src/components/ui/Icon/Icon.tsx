import { iconPaths } from "./IconPaths";

type IconProps = {
  icon: keyof typeof iconPaths;
  color?: string;
  gradient?: boolean;
  size?: string;
};

export default function Icon({
  icon,
  color = "currentColor",
  gradient = false,
  size = "1em",
}: IconProps) {
  const iconPath = iconPaths[icon];
  const gradientId = `icon-gradient-${Math.round(
    Math.random() * 10e12
  ).toString(36)}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 256 256"
      aria-hidden="true"
      style={{ width: size, height: size }}
      stroke={gradient ? `url(#${gradientId})` : color}
    >
      <g dangerouslySetInnerHTML={{ __html: iconPath }} />
      {gradient && (
        <defs>
          <linearGradient
            id={gradientId}
            x1="23"
            x2="235"
            y1="43"
            y2="202"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="var(--gradient-stop-1)" />
            <stop offset="0.5" stopColor="var(--gradient-stop-2)" />
            <stop offset="1" stopColor="var(--gradient-stop-3)" />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
}
