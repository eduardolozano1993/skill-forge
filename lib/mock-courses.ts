export type MockCourse = {
  id: number;
  title: string;
  summary: string;
  dueDateLabel: string;
  isAssigned: boolean;
  isRecommended: boolean;
  overview: [string, string];
};

export type MockCourseContentOverride = {
  courseId: number;
  content: string;
};

export const mockCourses: MockCourse[] = [
  {
    id: 101,
    title: "API Foundations",
    summary:
      "Learn how teams design stable APIs with consistent contracts, versioning strategies, and practical review habits.",
    dueDateLabel: "Apr 18",
    isAssigned: true,
    isRecommended: false,
    overview: [
      "API Foundations introduces the decisions that shape a dependable interface before a single endpoint is shipped. The course walks through resource modeling, request and response design, error handling, and the tradeoffs between REST conventions and pragmatic product requirements.",
      "It also covers the collaboration side of API work: documenting contracts, planning version changes, and aligning frontend and backend teams around a shared understanding of payloads. By the end, learners should understand how a well-designed API reduces churn, lowers integration risk, and makes new features easier to deliver.",
    ],
  },
  {
    id: 102,
    title: "React Systems",
    summary:
      "Study component architecture, state boundaries, and rendering patterns that keep larger React applications maintainable.",
    dueDateLabel: "Apr 22",
    isAssigned: true,
    isRecommended: true,
    overview: [
      "React Systems focuses on how small component decisions scale across an entire product surface. Instead of treating screens as isolated implementations, the course frames React as a system made up of reusable primitives, data boundaries, asynchronous states, and interface conventions.",
      "Learners review patterns for composition, state ownership, and rendering performance while discussing when to split components, when to co-locate logic, and when to abstract shared behavior. The goal is to build a mental model that supports consistency without forcing every feature into the same rigid template.",
    ],
  },
  {
    id: 103,
    title: "Data Modeling",
    summary:
      "Explore how to structure application data for clarity, reporting, and future feature growth across products.",
    dueDateLabel: "Apr 25",
    isAssigned: false,
    isRecommended: true,
    overview: [
      "Data Modeling covers the fundamentals of shaping information so that both the application and the organization can rely on it. The course introduces entities, relationships, constraints, and normalization with an emphasis on making domain concepts explicit rather than hidden in implementation shortcuts.",
      "The material also connects model design to everyday product work such as analytics, permission checks, workflow automation, and change management. Learners see how clear data structures make systems easier to query, reason about, and evolve as new requirements appear.",
    ],
  },
  {
    id: 104,
    title: "Testing Workflows",
    summary:
      "Build practical testing habits across unit, integration, and end-to-end layers without slowing product delivery.",
    dueDateLabel: "Apr 29",
    isAssigned: false,
    isRecommended: true,
    overview: [
      "Testing Workflows explains how effective teams choose the right level of test coverage for the right kind of risk. It compares fast unit tests, integration coverage around critical flows, and end-to-end checks for production confidence, showing where each approach adds signal and where it adds noise.",
      "Beyond tooling, the course emphasizes workflow design: writing tests that survive refactors, using failures as feedback, and deciding what should block a release. The outcome is a more disciplined approach to quality that supports speed instead of competing with it.",
    ],
  },
  {
    id: 105,
    title: "Observability",
    summary:
      "Understand logs, metrics, and traces as connected signals for diagnosing issues in modern distributed systems.",
    dueDateLabel: "May 2",
    isAssigned: false,
    isRecommended: true,
    overview: [
      "Observability introduces the core signals engineers use to understand system behavior in production. The course explains how logs, metrics, and traces answer different questions, and why teams need all three to move from raw telemetry to useful operational insight.",
      "Learners work through alert design, dashboard interpretation, and incident investigation so they can connect user-facing problems back to system causes. The broader aim is to help engineers build services that are not only functional, but also understandable under pressure.",
    ],
  },
  {
    id: 106,
    title: "Leadership",
    summary:
      "Practice communication, delegation, and decision-making patterns that help technical teams grow sustainably.",
    dueDateLabel: "May 6",
    isAssigned: false,
    isRecommended: false,
    overview: [
      "Leadership looks at the operational side of influence inside product and engineering teams. The course covers feedback, expectation setting, cross-functional alignment, and the difference between solving a problem yourself and creating the conditions for others to solve it well.",
      "Rather than framing leadership as a title, the content presents it as a collection of repeatable behaviors. Learners examine how clear decisions, strong communication, and coaching habits improve execution quality while reducing avoidable team friction.",
    ],
  },
  {
    id: 107,
    title: "AI Evals",
    summary:
      "Learn how to measure AI feature quality with evaluation datasets, task-specific rubrics, and release gates.",
    dueDateLabel: "May 9",
    isAssigned: false,
    isRecommended: false,
    overview: [
      "AI Evals introduces a structured approach to validating model-driven features before they reach users. The course covers dataset design, baseline tasks, rubric development, and the difference between qualitative exploration and repeatable evaluation pipelines.",
      "It also explains how teams use evals to compare prompts, models, and guardrails over time. By grounding iteration in evidence instead of anecdotes, learners see how evaluation systems reduce regression risk and support more reliable AI product development.",
    ],
  },
  {
    id: 108,
    title: "System Design",
    summary:
      "Reason through reliability, performance, and scaling tradeoffs when designing systems used by growing teams.",
    dueDateLabel: "May 13",
    isAssigned: false,
    isRecommended: false,
    overview: [
      "System Design explores how engineers translate product requirements into resilient technical architectures. The course examines service boundaries, caching, consistency tradeoffs, failure modes, and scaling patterns with the goal of making architectural choices legible and defensible.",
      "A major focus is communication: how to explain why a design is appropriate for the current stage of a product, what risks remain, and what would need to change as demand grows. Learners come away with a stronger framework for discussing design beyond whiteboard exercises.",
    ],
  },
  {
    id: 109,
    title: "Cloud Infrastructure",
    summary:
      "Understand the building blocks of cloud environments, from compute and networking to deployment patterns and cost tradeoffs.",
    dueDateLabel: "May 16",
    isAssigned: false,
    isRecommended: false,
    overview: [
      "Cloud Infrastructure introduces the operational foundations behind modern application hosting. The course covers virtual machines, containers, storage layers, networking basics, and managed platform services so learners can understand how application architecture maps to cloud resources.",
      "It also looks at environment design, scaling choices, and the practical cost implications of infrastructure decisions. The goal is to help teams make cloud systems more predictable, easier to operate, and better aligned with product growth.",
    ],
  },
  {
    id: 110,
    title: "Secure Coding",
    summary:
      "Learn to spot common application security risks early and design safer defaults into everyday engineering work.",
    dueDateLabel: "May 20",
    isAssigned: false,
    isRecommended: false,
    overview: [
      "Secure Coding focuses on the habits that reduce security risk before code reaches production. The course introduces common vulnerabilities such as injection flaws, broken access control, unsafe data handling, and insecure configuration patterns in web applications.",
      "The content emphasizes prevention through design reviews, defensive coding, and threat-aware implementation choices. Learners come away with a clearer sense of how security fits into routine product delivery instead of existing only as a late-stage review step.",
    ],
  },
  {
    id: 111,
    title: "Frontend Performance",
    summary:
      "Improve perceived speed with better rendering strategies, bundle control, and performance-focused interface design.",
    dueDateLabel: "May 23",
    isAssigned: false,
    isRecommended: false,
    overview: [
      "Frontend Performance examines the technical and experiential sides of speed in browser-based applications. The course covers render paths, asset loading, code splitting, caching behavior, and the performance implications of common UI architecture decisions.",
      "It also frames performance as a product concern, showing how responsiveness shapes user trust and task completion. Learners practice identifying bottlenecks and prioritizing improvements that deliver clear value rather than chasing abstract benchmarks.",
    ],
  },
  {
    id: 112,
    title: "SQL Essentials",
    summary:
      "Build a strong foundation in querying relational data, modeling joins, and writing maintainable SQL for product work.",
    dueDateLabel: "May 27",
    isAssigned: false,
    isRecommended: false,
    overview: [
      "SQL Essentials introduces the core query patterns engineers and analysts use to work with relational databases effectively. The course covers filtering, aggregation, joins, subqueries, and ordering with an emphasis on understanding how data relationships shape the query itself.",
      "It also explores readability, debugging, and the tradeoffs between quick queries and durable reporting logic. By the end, learners should be better equipped to inspect product data, support investigations, and collaborate on data-backed decisions.",
    ],
  },
  {
    id: 113,
    title: "Product Discovery",
    summary:
      "Explore lightweight research, framing, and validation techniques that help teams build the right thing sooner.",
    dueDateLabel: "May 30",
    isAssigned: false,
    isRecommended: false,
    overview: [
      "Product Discovery centers on the work teams do before committing deeply to implementation. The course covers problem framing, stakeholder interviews, user research inputs, and hypothesis-driven validation so product ideas can be shaped with better evidence.",
      "Rather than treating discovery as a separate discipline, the material shows how engineers, designers, and product managers contribute from different angles. Learners see how structured discovery reduces rework and improves the quality of roadmap decisions.",
    ],
  },
  {
    id: 114,
    title: "Technical Writing",
    summary:
      "Write clearer engineering docs, design notes, and operational guidance that reduce confusion across teams.",
    dueDateLabel: "Jun 3",
    isAssigned: false,
    isRecommended: false,
    overview: [
      "Technical Writing focuses on the documents that support good engineering decisions long after a meeting ends. The course covers audience awareness, structure, clarity, and revision habits for design docs, onboarding guides, incident writeups, and procedural references.",
      "It also highlights how writing quality affects execution quality by making decisions easier to review and reuse. Learners practice making complex technical ideas easier to scan, easier to trust, and easier to act on.",
    ],
  },
  {
    id: 115,
    title: "GraphQL in Practice",
    summary:
      "Understand schema design, resolver boundaries, and operational concerns when shipping GraphQL APIs at scale.",
    dueDateLabel: "Jun 6",
    isAssigned: false,
    isRecommended: false,
    overview: [
      "GraphQL in Practice introduces the patterns that make GraphQL effective beyond simple demos. The course covers schema modeling, resolver architecture, caching, authorization, and the tradeoffs between flexible queries and backend complexity.",
      "Learners also examine how GraphQL changes collaboration between client and server teams, especially when product interfaces evolve quickly. The goal is to build a practical view of when GraphQL helps and how to avoid common implementation pitfalls.",
    ],
  },
  {
    id: 116,
    title: "Design Systems",
    summary:
      "Learn how reusable UI primitives, documentation, and governance practices support faster product delivery.",
    dueDateLabel: "Jun 10",
    isAssigned: false,
    isRecommended: false,
    overview: [
      "Design Systems looks at the infrastructure behind consistent user interfaces across a growing product surface. The course covers tokens, components, accessibility patterns, contribution workflows, and the relationship between design intent and coded implementation.",
      "It also explores the operating model required to keep a system healthy over time, including documentation, ownership, and adoption strategy. Learners see how shared interface systems reduce duplication while preserving room for product-specific needs.",
    ],
  },
  {
    id: 117,
    title: "DevOps Foundations",
    summary:
      "Study deployment automation, environment reliability, and feedback loops that connect development to operations.",
    dueDateLabel: "Jun 13",
    isAssigned: true,
    isRecommended: false,
    overview: [
      "DevOps Foundations introduces the practices that reduce the gap between writing software and operating it well. The course covers automation, release workflows, environment consistency, monitoring feedback loops, and the cultural changes that support shared operational ownership.",
      "Rather than treating DevOps as a separate team function, the material presents it as a product delivery discipline. Learners understand how automation and clear process design improve release confidence while shortening the path from change to value.",
    ],
  },
  {
    id: 118,
    title: "Team Communication",
    summary:
      "Strengthen day-to-day alignment with better meeting habits, written updates, and technical decision framing.",
    dueDateLabel: "Jun 17",
    isAssigned: false,
    isRecommended: false,
    overview: [
      "Team Communication examines the routines that help engineering teams stay aligned without creating process drag. The course covers status communication, asynchronous updates, meeting structure, and ways to frame technical decisions so the right people can respond effectively.",
      "It also explores how communication failures surface as delivery failures, duplicated work, and avoidable tension. Learners practice making collaboration more predictable by being explicit, concise, and context-aware.",
    ],
  },
  {
    id: 119,
    title: "Microservices",
    summary:
      "Evaluate service decomposition, ownership boundaries, and reliability concerns in distributed product architectures.",
    dueDateLabel: "Jun 20",
    isAssigned: false,
    isRecommended: false,
    overview: [
      "Microservices explores the architectural and organizational tradeoffs involved in splitting systems into independent services. The course covers service boundaries, communication patterns, data ownership, deployment independence, and the operational complexity introduced by distribution.",
      "A central theme is choosing the right level of separation for the actual problem being solved. Learners gain a more disciplined way to discuss when microservices add value and when they simply add coordination cost.",
    ],
  },
  {
    id: 120,
    title: "Accessibility Basics",
    summary:
      "Build a practical understanding of accessible interfaces, semantic markup, and inclusive product behaviors.",
    dueDateLabel: "Jun 24",
    isAssigned: true,
    isRecommended: false,
    overview: [
      "Accessibility Basics introduces the principles that make digital products usable by more people in more contexts. The course covers semantic HTML, keyboard navigation, focus management, color contrast, form behavior, and assistive technology considerations.",
      "It frames accessibility as a core quality concern rather than an optional refinement. Learners leave with concrete habits they can apply during design and implementation to create interfaces that are both more inclusive and more robust.",
    ],
  },
];

const mockCourseDelayMs = 750;

async function delayMockCourses() {
  await new Promise((resolve) => setTimeout(resolve, mockCourseDelayMs));
}

export async function getCourses() {
  await delayMockCourses();

  return mockCourses;
}

export async function getAssignedCourses() {
  await delayMockCourses();

  return mockCourses.filter((course) => course.isAssigned);
}

export async function getRecommendedCourses() {
  await delayMockCourses();

  return mockCourses.filter((course) => course.isRecommended);
}

export async function getBookmarkedCourses(): Promise<MockCourse[]> {
  await delayMockCourses();

  return [];
}

export async function getCourseById(id: number) {
  await delayMockCourses();

  return mockCourses.find((course) => course.id === id) ?? null;
}

export function normalizeCourseSearchQuery(query: string) {
  return query.trim().toLowerCase();
}

export function filterCoursesByQuery(courses: MockCourse[], query: string) {
  const normalizedQuery = normalizeCourseSearchQuery(query);

  if (!normalizedQuery) {
    return courses;
  }

  return courses.filter((course) =>
    `${course.title} ${course.summary}`.toLowerCase().includes(normalizedQuery),
  );
}

export function getCourseContentText(course: MockCourse) {
  return course.overview.join("\n\n");
}

export function getCourseContentParagraphs(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
