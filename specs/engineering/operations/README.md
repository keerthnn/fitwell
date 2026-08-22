# Operations documentation

## Purpose

Operations documents define safe, repeatable procedures for environments, configuration, deployment, database work, and recovery. Active runbooks have **operational** authority.

## Documents

- [Environments](environments.md) owns environment purpose and isolation.
- [Configuration](configuration.md) owns configuration names, exposure, source, and rotation.
- [Deployment runbook](deployment-runbook.md) owns release execution and evidence.
- [Database runbook](database-runbook.md) owns safe migration, seeding, inspection, and administrative database work.
- [Recovery runbook](recovery-runbook.md) owns incident stabilization and restoration.

## Runbook rules

- Preconditions, exact targets, safety checks, success evidence, failure stop conditions, and recovery must be explicit.
- Commands are examples only until verified in the target environment.
- Never include secret values.
- Do not claim a rollback or restore is available unless tested.
- Reverify a runbook before high-impact use if dependencies changed or `last_verified` is stale.

The operator executes the runbook; Keerthan K, the project owner, approves destructive production actions and accepts residual risk.
