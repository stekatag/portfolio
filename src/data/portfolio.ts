import type { IconName } from "../components/ui/Icon/IconPaths";
import type { DestinationKey } from "../config/site";

export const profile = {
  name: "Stefan Gogov",
  role: "Product-minded Software Engineer",
  overview: "I build and ship reliable software across web, mobile, and cloud systems.",
  employer: "Voidweb",
  product: "Inverso.bg",
};

export type Contribution = {
  title: string;
  detail: string;
};

export type ExperienceLink = {
  destination: DestinationKey;
};

export type ExperienceItem = {
  status: "Current work" | "Professional foundation" | "Student practice";
  dates: string;
  role: string;
  context: string;
  summary: string;
  contributions: Contribution[];
  tools: string[];
  links: ExperienceLink[];
};

export const experience: ExperienceItem[] = [
  {
    status: "Current work",
    dates: "Jul 2025 — Present",
    role: "Software Engineer",
    context: "Voidweb · Product engineering for Inverso.bg",
    summary:
      "I build core functionality for Inverso.bg, a cloud platform for business finance and invoicing, while contributing to delivery across Voidweb's wider client portfolio.",
    contributions: [
      {
        title: "Product delivery",
        detail: "Design and ship Laravel and Vue.js features across the product stack.",
      },
      {
        title: "Mobile expansion",
        detail: "Bring core workflows to the official iOS and Android applications.",
      },
      {
        title: "Cloud operations",
        detail: "Manage environments and automated deployments with AWS and Laravel Cloud.",
      },
      {
        title: "Team support",
        detail: "Mentor students and interns through onboarding and practical coding standards.",
      },
    ],
    tools: ["Laravel", "Vue.js", "React Native", "AWS", "Laravel Cloud"],
    links: [
      { destination: "inverso" },
      { destination: "voidweb" },
    ],
  },
  {
    status: "Professional foundation",
    dates: "Mar 2025 — Jul 2025",
    role: "Intern Back-end Developer",
    context: "Voidweb",
    summary:
      "I developed Laravel APIs for client products, contributing to AI-enabled administrative workflows and the Inverso.bg platform.",
    contributions: [
      {
        title: "AI product work",
        detail: "Contributed to AntennAI features that generate concise summaries and reports for administrative users.",
      },
      {
        title: "Inverso.bg Projects",
        detail: "Led the implementation of a shared workspace for invoice and task management.",
      },
    ],
    tools: ["PHP", "Laravel", "OpenAI", "REST APIs"],
    links: [{ destination: "voidweb" }],
  },
  {
    status: "Student practice",
    dates: "Jul 2024 — Aug 2024",
    role: "Intern Front-end Developer",
    context: "ScaleFocus · University student practice",
    summary:
      "Completed a university student-practice internship, developing the front end of a barbershop appointment-management system.",
    contributions: [
      {
        title: "Interface delivery",
        detail: "Designed and implemented user interfaces for appointment-management workflows.",
      },
      {
        title: "API collaboration",
        detail: "Worked with the back-end team to integrate API services into the front end.",
      },
      {
        title: "Quality and testing",
        detail: "Tested and debugged front-end functionality to keep the experience reliable and user-friendly.",
      },
    ],
    tools: ["React", "Redux", "API integration", "Testing"],
    links: [
      { destination: "scaleFocusApp" },
      { destination: "scaleFocus" },
    ],
  },
];

export type Capability = {
  title: string;
  detail: string;
  tools: string[];
  icon: IconName;
};

export const capabilities: Capability[] = [
  {
    title: "Product engineering",
    detail: "Turn product requirements into dependable web features across the full stack.",
    tools: ["PHP", "Laravel", "Vue.js", "PostgreSQL", "Node.js"],
    icon: "terminal-window",
  },
  {
    title: "Mobile delivery",
    detail: "Extend essential workflows beyond the browser with iOS and Android applications.",
    tools: ["React Native", "iOS", "Android"],
    icon: "device-mobile",
  },
  {
    title: "Cloud and operations",
    detail: "Maintain reliable environments and releases from deployment through production.",
    tools: ["AWS", "Laravel Cloud", "Docker", "CI/CD"],
    icon: "cloud",
  },
  {
    title: "Team contribution",
    detail: "Help teams deliver consistently through mentoring, onboarding, and coding standards.",
    tools: ["Mentoring", "Onboarding", "Code review"],
    icon: "users-three",
  },
];

export const deliveryAreas = [
  { title: "Web product engineering", detail: "Features, APIs, and workflows across the product stack." },
  { title: "Mobile delivery", detail: "Core product workflows for iOS and Android." },
  { title: "Cloud operations", detail: "Environments, automated deployments, and dependable releases." },
];
