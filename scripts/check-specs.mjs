import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

const required = [
  "specs/README.md",
  "specs/DEVELOPER_GUIDE.md",
  "specs/ai-native-development-architecture.md",
  "specs/traced-knowledge-graph.md",
  "specs/changes/CLARIFY_AND_PROPOSE.md",
  "specs/changes/README.md",
  "specs/engineering/spec-authoring.md",
  "specs/handbook/documentation-policy.md",
  "specs/handbook/engineering-workflow.md",
  "specs/meta/domain-dictionary.yaml",
  "specs/review/REVIEW_GUIDE.md",
  "specs/review/TESTING_GUIDE.md",
  "specs/templates/clarify-template.md",
  "specs/templates/proposal-template.md",
  "specs/templates/design-template.md",
  "specs/templates/tasks-template.md",
  "specs/templates/verification-template.md",
  ".agents/skills/opsx/_manifest.yaml",
  ".agents/skills/opsx-mode/SKILL.md",
  ".agents/skills/opsx-clarify/SKILL.md",
  ".agents/skills/opsx-propose/SKILL.md",
  ".agents/skills/opsx-red/SKILL.md",
  ".agents/skills/opsx-apply/SKILL.md",
  ".agents/skills/opsx-verify/SKILL.md",
  ".agents/skills/opsx-archive/SKILL.md",
  ".agents/skills/lightweight-plan-archive/SKILL.md",
];

for (const relative of required) {
  if (!fs.existsSync(path.join(root, relative))) failures.push(`missing required file: ${relative}`);
}

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

const processFiles = [
  ...walk(path.join(root, "specs")),
  ...walk(path.join(root, ".agents", "skills")),
].filter((file) => /\.(md|ya?ml)$/.test(file) && !file.includes(`${path.sep}changes${path.sep}archive${path.sep}`));

const stalePatterns = [
  [/\.cursor\/skills\//i, "workflow skills must use .agents/skills"],
  [/\bGloX\b/i, "stale GloX project reference"],
  [/\bFloDown\b|\bMathHub\b|\bsTeX\b|src\/serverFns\//i, "stale GloX stack reference"],
  [/\bTanStack Start\b/i, "stale framework reference"],
];

const manifestPath = path.join(root, ".agents", "skills", "opsx", "_manifest.yaml");
if (fs.existsSync(manifestPath)) {
  const manifest = fs.readFileSync(manifestPath, "utf8");
  for (const match of manifest.matchAll(/^\s+skill:\s+([a-z0-9-]+)\s*$/gm)) {
    const skillPath = `.agents/skills/${match[1]}/SKILL.md`;
    if (!fs.existsSync(path.join(root, skillPath))) failures.push(`manifest references missing skill: ${skillPath}`);
  }
  for (const match of manifest.matchAll(/^\s+-\s+(specs\/[A-Za-z0-9_./-]+)\s*$/gm)) {
    if (!fs.existsSync(path.join(root, match[1]))) failures.push(`manifest references missing policy: ${match[1]}`);
  }
}

for (const file of processFiles) {
  const text = fs.readFileSync(file, "utf8");
  for (const [pattern, message] of stalePatterns) {
    if (pattern.test(text)) failures.push(`${path.relative(root, file)}: ${message}`);
  }

  if (!file.endsWith(".md") || file.includes(`${path.sep}templates${path.sep}`)) continue;
  const linkPattern = /\[[^\]]*\]\(([^)]+)\)/g;
  for (const match of text.matchAll(linkPattern)) {
    const raw = match[1].split("#")[0].trim();
    if (!raw || /^(https?:|mailto:|app:|codex:)/.test(raw) || raw.startsWith("/")) continue;
    const decoded = decodeURIComponent(raw.replace(/^<|>$/g, ""));
    if (decoded.includes("<") || decoded.includes(">")) continue;
    if (!fs.existsSync(path.resolve(path.dirname(file), decoded))) {
      failures.push(`${path.relative(root, file)}: broken link ${raw}`);
    }
  }
}

const activeRoot = path.join(root, "specs", "changes", "active");
if (fs.existsSync(activeRoot)) {
  for (const entry of fs.readdirSync(activeRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (!/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(entry.name)) {
      failures.push(`invalid active package name: specs/changes/active/${entry.name}`);
    }
    const packageRoot = path.join(activeRoot, entry.name);
    const artifacts = ["clarify.md", "proposal.md", "design.md", "tasks.md", "verification.md"];
    const present = artifacts.map((artifact) => fs.existsSync(path.join(packageRoot, artifact)));
    if (!present[0]) failures.push(`active package ${entry.name} is missing clarify.md`);
    for (let index = 1; index < present.length; index += 1) {
      if (present[index] && present.slice(0, index).some((value) => !value)) {
        failures.push(`active package ${entry.name} has ${artifacts[index]} before its prerequisite artifact`);
      }
    }
  }
}

if (failures.length) {
  console.error(`Spec validation failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Spec validation passed (${required.length} required files, ${processFiles.length} process files).`);
