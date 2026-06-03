// Single source of truth for all portfolio content.
// Derived manually from public/skills/skills.md — do not read the .md at runtime.

export type SkillCategoryId =
  | "frontend"
  | "backend"
  | "ai"
  | "cloud"
  | "database"
  | "testing";

export interface SkillCategory {
  id: SkillCategoryId;
  label: string;
  blurb: string;
  skills: string[];
}

export const SKILL_CATEGORIES: Record<SkillCategoryId, SkillCategory> = {
  frontend: {
    id: "frontend",
    label: "Frontend",
    blurb: "The cockpit — what the user sees and touches.",
    skills: ["React", "Next.js", "TypeScript", "JavaScript", "Angular"],
  },
  backend: {
    id: "backend",
    label: "Backend",
    blurb: "The power unit — services, APIs and the logic that drives it all.",
    skills: ["Node.js", "NestJS", "FastAPI", "REST APIs", "Microservices"],
  },
  ai: {
    id: "ai",
    label: "AI & Automation",
    blurb: "Production multi-agent systems and Claude pipelines.",
    skills: ["LangGraph", "Anthropic Claude", "LangSmith", "Multi-Agent Systems"],
  },
  cloud: {
    id: "cloud",
    label: "Cloud & DevOps",
    blurb: "Shipping and scaling in production.",
    skills: [
      "AWS (Lambda, S3, Quicksight)",
      "CI/CD",
      "GitHub Actions",
      "Docker",
      "Cloudflare",
    ],
  },
  database: {
    id: "database",
    label: "Database",
    blurb: "Where the telemetry lives.",
    skills: ["PostgreSQL", "MongoDB"],
  },
  testing: {
    id: "testing",
    label: "Testing",
    blurb: "Quality gates before the lights go out.",
    skills: ["Cypress", "Playwright", "Mocha", "Unit Testing", "E2E Testing"],
  },
};

// The four categories shown as buttons on the zoomed steering wheel.
export const STEERING_CATEGORY_IDS: SkillCategoryId[] = [
  "ai",
  "cloud",
  "database",
  "testing",
];

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  highlights: string[];
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    company: "GoVisually",
    role: "Sr. Full Stack Engineer",
    period: "Oct 2024 – Present",
    highlights: [
      "Architected a production-grade AI compliance platform (LangGraph, Anthropic Claude, FastAPI) orchestrating 8 domain-specific agents to validate packaging artwork against FDA, EU & Thai regulations — cutting manual review effort by 80%.",
      "Designed a distributed DAG pipeline (ingest → extract → enrich → analyze → aggregate) with parallel agents, OCR, multimodal vision & barcode validation — reducing end-to-end analysis from hours to under 2 minutes.",
      "Integrated LangSmith observability across multi-agent workflows, reducing failure diagnosis time by 60%.",
      "Deployed AI-Core as an auto-scaling containerized FastAPI microservice achieving 99.9% uptime.",
      "Eliminated N+1 patterns — consolidated 300+ per-design queries into 3 batch queries, improving API response times by 99%.",
      "Closed a distributed write-atomicity gap in SSO onboarding via MongoDB transactions with rollback, reducing orphaned registrations from 15–20% to 0%.",
    ],
  },
  {
    company: "GoVisually",
    role: "Full Stack Engineer",
    period: "Oct 2023 – Oct 2024",
    highlights: [
      "Led full migration from Angular 2.0 to Next.js, halving frontend delivery cycles and eliminating technical debt.",
      "Designed a backend pre-caching strategy improving page load performance by 80% for large asset workflows.",
      "Architected an RBAC private-sections feature enabling permission-based asset isolation for multi-team environments.",
      "Built an internal notifications & email orchestration module, reducing missed updates by 65%.",
    ],
  },
  {
    company: "RepairDesk",
    role: "Full Stack Engineer",
    period: "May 2022 – Sep 2023",
    highlights: [
      "Integrated Square payment gateway across web & mobile — +25% transaction volume, +15% customer satisfaction.",
      "Built \"Connect\", a unified messaging hub consolidating Facebook/Google reviews, emails & messages into one dashboard.",
      "Led RepairDesk 2.0 Marketplace — a multi-vendor platform with price comparison, direct ordering & inventory sync.",
      "Implemented Bitbucket CI/CD for automated AWS Lambda deployments, cutting deployment effort by 50%.",
    ],
  },
  {
    company: "Grey Loops",
    role: "Full Stack Engineer",
    period: "Apr 2021 – May 2022",
    highlights: [
      "Integrated Paymob, MyFatoorah & Fawry gateways (Cards, Kiosks, Wallets, Souhoola) with automated refunds across 5+ MENA markets.",
      "Improved API performance by 75% by optimizing critical queries and restructuring data access patterns, including Shopify integrations.",
    ],
  },
  {
    company: "Tech Hive (Pvt) Ltd",
    role: "Full Stack Engineer",
    period: "Feb 2020 – Mar 2021",
    highlights: [
      "Built a gamified recruitment platform with interactive assessments for enterprises including Nestlé, UBL, Abu-Dawood & Silk Bank, reducing manual screening effort.",
    ],
  },
];

export const ACHIEVEMENTS = [
  "Star Performer of the Month — RepairDesk (2023), for debugging & problem solving.",
  "3rd place — company annual hackathon (2024).",
];

export const EDUCATION = {
  school: "University of South Asia",
  degree: "BS Computer Science",
  year: "2020",
};

export const PROFILE = {
  name: "Umair Butt",
  title: "Senior Full Stack Engineer",
  summary:
    "Senior Full Stack Engineer with 5+ years architecting scalable SaaS platforms, microservices and AI-driven automation across fintech, compliance and e-commerce. Specialized in production-grade multi-agent LangGraph & Anthropic Claude pipelines.",
};
