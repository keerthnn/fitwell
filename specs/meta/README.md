# Specification metadata

This folder owns shared vocabulary and machine-readable metadata used across product and engineering
specifications. It must not become a second home for product requirements or implementation design.

- [`domain-dictionary.yaml`](domain-dictionary.yaml) is the ubiquitous-language contract.
- [`domain-dictionary.TEMPLATE.yaml`](domain-dictionary.TEMPLATE.yaml) documents the entry shape.

Prefer dictionary labels in new PRDs and SDDs. Add aliases for terms found in legacy code; do not
silently change an existing term's meaning.

