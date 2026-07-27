import type { IconName } from "../components/ui/Icon/IconPaths";

export const site = {
  name: "Stefan Gogov",
  url: "https://sgogov.dev",
  defaultTitle: "Stefan Gogov | Portfolio",
  defaultDescription: "The portfolio of Stefan Gogov",
} as const;

export const routes = {
  overview: "/",
  experience: "/work",
  projects: "/projects",
  connect: "/connect",
  bio: "/bio",
} as const;

export type Destination = {
  href: string;
  label: string;
  title: string;
  external?: boolean;
};

export const destinations = {
  cv: {
    href: "https://app.enhancv.com/share/5e64dcd1/?utm_medium=growth&utm_campaign=share-resume&utm_source=dynamic",
    label: "View CV",
    title: "View Stefan's CV",
    external: true,
  },
  email: {
    href: "mailto:stefangogov@proton.me",
    label: "Send a message",
    title: "Send Stefan a message",
    external: false,
  },
  linkedin: {
    href: "https://www.linkedin.com/in/stefan-gogov/",
    label: "LinkedIn",
    title: "Open Stefan's LinkedIn profile",
    external: true,
  },
  github: {
    href: "https://github.com/stekatag",
    label: "GitHub",
    title: "Open Stefan's GitHub",
    external: true,
  },
  bio: { href: routes.bio, label: "Bio", title: "View Stefan's bio page", external: false },
  portfolio: { href: routes.overview, label: "View portfolio", title: "View Stefan's portfolio", external: false },
  inverso: { href: "https://www.inverso.bg/", label: "Inverso.bg", title: "Open Inverso.bg", external: true },
  voidweb: { href: "https://www.voidweb.eu/", label: "Voidweb", title: "Open Voidweb", external: true },
  scaleFocusApp: { href: "https://appointment-management-fe.vercel.app/", label: "View the app", title: "Open the appointment-management app", external: true },
  scaleFocus: { href: "https://www.scalefocus.com/", label: "ScaleFocus", title: "Open ScaleFocus", external: true },
} as const satisfies Record<string, Destination>;

export type DestinationKey = keyof typeof destinations;

export type WorkspaceNavigationItem = {
  label: string;
  href: string;
  icon: IconName;
  title: string;
};

export const workspaceNavigation: WorkspaceNavigationItem[] = [
  { label: "Overview", href: routes.overview, icon: "layout", title: "Overview" },
  { label: "Experience", href: routes.experience, icon: "terminal-window", title: "Experience" },
  { label: "Personal Projects", href: routes.projects, icon: "code", title: "Personal Projects" },
  { label: "Connect", href: routes.connect, icon: "message", title: "Connect" },
];

export const workspaceQuickLinks: (Destination & { icon: IconName })[] = [
  { ...destinations.cv, icon: "readCV" },
  { ...destinations.linkedin, icon: "linkedin" },
  { ...destinations.github, icon: "github-logo" },
  { ...destinations.bio, icon: "handwave" },
];

export const pinnedRepoEndpoints = [
  "https://pinned-repos.teamsync.vip/stekatag",
  "https://gh-pinned-repos-tsj7ta5xfhep.deno.dev/?username=stekatag",
] as const;
