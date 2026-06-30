const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { existsSync, readFileSync, rmSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");
const targetRoot = path.join(repoRoot, ".tmp", "project-prefix-test");

function runNode(args, options = {}) {
  return execFileSync(process.execPath, args, {
    cwd: options.cwd ?? repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

test("initializes prefixed project directories and resolves mapped paths", () => {
  rmSync(targetRoot, { recursive: true, force: true });

  runNode(["ai-project-kit.js", targetRoot, "all", "--project-prefix", "qtgs"]);

  assert.equal(existsSync(path.join(targetRoot, "01_req")), false);
  assert.equal(existsSync(path.join(targetRoot, "qtgs01req", "playbook")), true);
  assert.equal(existsSync(path.join(targetRoot, "qtgs02build", "playbook")), true);

  const mapPath = path.join(targetRoot, "ai-kit-framework", "project-map.yaml");
  const projectMap = readFileSync(mapPath, "utf8");
  assert.match(projectMap, /code: qtgs/);
  assert.match(projectMap, /template: 01_req/);
  assert.match(projectMap, /path: qtgs01req/);
  assert.match(projectMap, /stages:/);
  assert.match(projectMap, /design:/);
  assert.match(projectMap, /skill: qtgs02build\/playbook\/02_design\/skills\/SKILL\.md/);
  assert.match(projectMap, /rule: qtgs02build\/playbook\/02_design\/rules\/RULE\.md/);
  assert.match(projectMap, /agent: qtgs02build\/playbook\/02_design\/agents\/agent\.md/);
  assert.match(projectMap, /workspace: qtgs02build\/workspace\/02_design\//);

  const projectReadme = readFileSync(
    path.join(targetRoot, "ai-kit-framework", "README.md"),
    "utf8"
  );
  assert.match(projectReadme, /qtgs01req\/workspace\/01_inputs/);
  assert.match(projectReadme, /qtgs02build\/workspace\/01_architecture/);

  const pipeline = readFileSync(
    path.join(targetRoot, "ai-kit-framework", "automation", "pipelines", "requirement-to-code.yaml"),
    "utf8"
  );
  assert.match(pipeline, /qtgs01req\/playbook\/01_requirements\/skills\/SKILL\.md/);
  assert.match(pipeline, /qtgs02build\/workspace\/03_code\//);

  const codingAgent = readFileSync(
    path.join(targetRoot, "qtgs02build", "playbook", "03_code", "agents", "agent.md"),
    "utf8"
  );
  assert.match(codingAgent, /qtgs02build\/workspace\/02_design\/common\//);
  assert.match(codingAgent, /qtgs06gov\/workspace\//);

  const designAgent = readFileSync(
    path.join(targetRoot, "qtgs02build", "playbook", "02_design", "agents", "agent.md"),
    "utf8"
  );
  assert.match(designAgent, /qtgs02build\/workspace\/02_design\/common\//);
  assert.doesNotMatch(designAgent, /`02_build\/workspace\/02_design\//);

  const designRule = readFileSync(
    path.join(targetRoot, "qtgs02build", "playbook", "02_design", "rules", "RULE.md"),
    "utf8"
  );
  assert.match(designRule, /qtgs02build\/workspace\/02_design/);
  assert.doesNotMatch(designRule, /`02_build\/workspace\/02_design/);

  const designSkill = readFileSync(
    path.join(targetRoot, "qtgs02build", "playbook", "02_design", "skills", "SKILL.md"),
    "utf8"
  );
  assert.match(designSkill, /qtgs02build\/workspace\/02_design/);
  assert.doesNotMatch(designSkill, /`02_build\/workspace\/02_design/);

  const syncOutput = runNode(
    [
      "ai-kit-framework/cursor-script/sync-cursor.mjs",
      "--root",
      targetRoot,
      "--only",
      "rules",
      "--dry-run",
    ],
    { cwd: targetRoot }
  );
  assert.match(syncOutput, /rule requirements -> \.cursor\/rules\/requirements\.mdc/);

  const contextPath = path.join(targetRoot, ".tmp", "context-pack.md");
  runNode(
    [
      "ai-kit-framework/automation/scripts/prepare-context.mjs",
      "--pipeline",
      "ai-kit-framework/automation/pipelines/requirement-to-code.yaml",
      "--stage",
      "req-baseline",
      "--feature",
      "USER-MGMT",
      "--out",
      contextPath,
    ],
    { cwd: targetRoot }
  );

  const context = readFileSync(contextPath, "utf8");
  assert.match(context, /qtgs01req\/playbook\/01_requirements\/skills\/SKILL\.md/);
  assert.match(context, /qtgs01req\/workspace\/03_baseline\//);
  assert.doesNotMatch(context, /Missing file/);
});

test("accepts project prefix as third positional argument", () => {
  const positionalTargetRoot = path.join(repoRoot, ".tmp", "project-prefix-positional-test");
  rmSync(positionalTargetRoot, { recursive: true, force: true });

  runNode(["ai-project-kit.js", positionalTargetRoot, "all", "qtgs"]);

  assert.equal(existsSync(path.join(positionalTargetRoot, "qtgs01req", "playbook")), true);
  assert.equal(existsSync(path.join(positionalTargetRoot, "qtgs02build", "playbook")), true);

  const projectMap = readFileSync(
    path.join(positionalTargetRoot, "ai-kit-framework", "project-map.yaml"),
    "utf8"
  );
  assert.match(projectMap, /code: qtgs/);
  assert.match(projectMap, /path: qtgs01req/);
});
