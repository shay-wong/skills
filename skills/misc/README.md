# Misc

Tools I keep around but rarely use, not promoted in the plugin.

The remaining direct-child entries below include absorbed low-frequency and vertical ECC Skills.

- **[git-guardrails-claude-code](./git-guardrails-claude-code/SKILL.md)**: Set up Claude Code hooks to block dangerous git commands (push, reset --hard, clean, etc.) before they execute.
- **[migrate-to-shoehorn](./migrate-to-shoehorn/SKILL.md)**: Migrate test files from `as` type assertions to @total-typescript/shoehorn.
- **[scaffold-exercises](./scaffold-exercises/SKILL.md)**: Create exercise directory structures with sections, problems, solutions, and explainers.
- **[setup-pre-commit](./setup-pre-commit/SKILL.md)**: Set up Husky pre-commit hooks with lint-staged, Prettier, type checking, and tests.


## Imported library

Absorbed low-frequency and vertical third-party Skills, including ECC. Install them through the repository `skills.sh` route; they are not part of the inherited Matt plugin.

- **[agent-payment-x402](./agent-payment-x402/SKILL.md)**: Add x402 payment execution to AI agents with per-task budgets, spending controls, and non-custodial wallets.
- **[autonomous-loops](./autonomous-loops/SKILL.md)**: Patterns and architectures for autonomous Claude Code loops : from simple sequential pipelines to RFC-driven multi-agent DAG systems.
- **[cisco-ios-patterns](./cisco-ios-patterns/SKILL.md)**: Cisco IOS and IOS-XE review patterns for show commands, config hierarchy, wildcard masks, ACL placement, interface hygiene, and safe change-window verification.
- **[claude-devfleet](./claude-devfleet/SKILL.md)**: Orchestrate multi-agent coding tasks via Claude DevFleet : plan projects, dispatch parallel agents in isolated worktrees, monitor progress, and read structured reports.
- **[configure-ecc](./configure-ecc/SKILL.md)**: Guide ECC installation, update, or reconfiguration from inside Claude Code, Codex, or Kimi while respecting each harness's real plugin, scope, and hook capabilities.
- **[defi-amm-security](./defi-amm-security/SKILL.md)**: Security checklist for Solidity AMM contracts, liquidity pools, and swap flows.
- **[ecc-guide](./ecc-guide/SKILL.md)**: Guide users through ECC's current agents, skills, commands, hooks, rules, install profiles, and project onboarding by reading the live repository surface before answering.
- **[ecc-recipes](./ecc-recipes/SKILL.md)**: Map a described workflow to the right ECC command-GROUP with run-order and stop condition, and browse all command-group recipe families.
- **[ecc-tools-cost-audit](./ecc-tools-cost-audit/SKILL.md)**: Evidence-first ECC Tools burn and billing audit workflow.
- **[evm-token-decimals](./evm-token-decimals/SKILL.md)**: Prevent silent decimal mismatch bugs across EVM chains.
- **[gan-style-harness](./gan-style-harness/SKILL.md)**: GAN-inspired Generator-Evaluator agent harness for building high-quality applications autonomously.
- **[healthcare-cdss-patterns](./healthcare-cdss-patterns/SKILL.md)**: Clinical Decision Support System (CDSS) development patterns.
- **[healthcare-emr-patterns](./healthcare-emr-patterns/SKILL.md)**: EMR/EHR development patterns for healthcare applications.
- **[healthcare-eval-harness](./healthcare-eval-harness/SKILL.md)**: Patient safety evaluation harness for healthcare application deployments.
- **[healthcare-phi-compliance](./healthcare-phi-compliance/SKILL.md)**: Protected Health Information (PHI) and Personally Identifiable Information (PII) compliance patterns for healthcare applications.
- **[hipaa-compliance](./hipaa-compliance/SKILL.md)**: HIPAA-specific entrypoint for healthcare privacy and security work.
- **[homelab-network-readiness](./homelab-network-readiness/SKILL.md)**: Readiness checklist for homelab VLAN segmentation, local DNS filtering, and WireGuard-style remote access before changing router, firewall, DHCP, or VPN configuration.
- **[homelab-network-setup](./homelab-network-setup/SKILL.md)**: Practical home and homelab network planning for gateways, switches, access points, IP ranges, DHCP reservations, DNS, cabling, and common beginner mistakes.
- **[homelab-pihole-dns](./homelab-pihole-dns/SKILL.md)**: Pi-hole installation, blocklist management, DNS-over-HTTPS setup, DHCP integration, local DNS records, and troubleshooting broken DNS resolution on a home network.
- **[homelab-vlan-segmentation](./homelab-vlan-segmentation/SKILL.md)**: Segmenting home networks into VLANs for IoT, guest, trusted, and server traffic using UniFi, pfSense/OPNsense, and MikroTik : including switch trunk config, firewall rules, and wireless SSID mapping.
- **[homelab-wireguard-vpn](./homelab-wireguard-vpn/SKILL.md)**: WireGuard VPN server setup, peer configuration, key generation, split tunneling vs full tunnel routing, and remote access to a home network from mobile and laptop clients.
- **[ito-baskets](./ito-baskets/SKILL.md)**: Read-only Itô basket and prediction-market data skill.
- **[ito-compute](./ito-compute/SKILL.md)**: Query live GPU inventory, submit an authenticated Itô fixed-rate RFQ, inspect RFQ or procurement status, revoke device credentials, and run explicitly gated node qualification through the separately installed canonical CLI.
- **[ito-inference](./ito-inference/SKILL.md)**: Inspect the availability of model serving on a completed Itô compute booking and, when the canonical backend becomes available, hand off an explicitly confirmed serving manifest.
- **[ito-training](./ito-training/SKILL.md)**: Inspect the availability of ML training on a completed Itô compute booking and, when the canonical backend becomes available, hand off an explicitly confirmed training manifest.
- **[llm-trading-agent-security](./llm-trading-agent-security/SKILL.md)**: Security patterns for autonomous trading agents with wallet or transaction authority.
- **[nanoclaw-repl](./nanoclaw-repl/SKILL.md)**: Operate and extend NanoClaw v2, ECC's zero-dependency session-aware REPL built on claude -p.
- **[nasiko-control-plane](./nasiko-control-plane/SKILL.md)**: Install, detect, and operate the optional Nasiko agent control plane through ECC with pinned artifacts, explicit consent, and telemetry and secrets boundaries.
- **[netmiko-ssh-automation](./netmiko-ssh-automation/SKILL.md)**: Safe Python Netmiko patterns for read-only collection, bounded batch SSH, TextFSM parsing, guarded config changes, timeouts, and network automation error handling.
- **[network-bgp-diagnostics](./network-bgp-diagnostics/SKILL.md)**: Diagnostics-only BGP troubleshooting patterns for neighbor state, route exchange, prefix policy, AS path inspection, and safe evidence collection.
- **[network-config-validation](./network-config-validation/SKILL.md)**: Pre-deployment checks for router and switch configuration, including dangerous commands, duplicate addresses, subnet overlaps, stale references, management-plane risk, and IOS-style security hygiene.
- **[network-interface-health](./network-interface-health/SKILL.md)**: Diagnose interface errors, drops, CRCs, duplex mismatches, flapping, speed negotiation issues, and counter trends on routers, switches, and Linux hosts.
- **[nodejs-keccak256](./nodejs-keccak256/SKILL.md)**: Prevent Ethereum hashing bugs in JavaScript and TypeScript.
- **[nutrient-document-processing](./nutrient-document-processing/SKILL.md)**: Process, convert, OCR, extract, redact, sign, and fill documents using the Nutrient DWS API.
- **[prediction-market-oracle-research](./prediction-market-oracle-research/SKILL.md)**: Research prediction markets as data sources or oracle signals for products, agents, dashboards, and corporate decision intelligence.
- **[prediction-market-risk-review](./prediction-market-risk-review/SKILL.md)**: Review prediction-market, basket, oracle, and trading-agent workflows for compliance, safety, data-quality, privacy, and execution risk.
- **[scientific-db-pubmed-database](./scientific-db-pubmed-database/SKILL.md)**: Direct PubMed and NCBI E-utilities search workflows for biomedical literature, MeSH queries, PMID lookup, citation retrieval, and API-backed literature monitoring.
- **[scientific-db-uspto-database](./scientific-db-uspto-database/SKILL.md)**: USPTO patent and trademark data workflow for official record lookup, PatentSearch queries, TSDR checks, assignment data, and reproducible IP research logs.
- **[scientific-pkg-gget](./scientific-pkg-gget/SKILL.md)**: gget CLI and Python workflow for quick genomic database queries, sequence lookup, BLAST-style searches, enrichment checks, and reproducible bioinformatics evidence logs.
- **[scientific-thinking-literature-review](./scientific-thinking-literature-review/SKILL.md)**: Systematic literature-review workflow for academic, biomedical, technical, and scientific topics, including search planning, source screening, synthesis, citation checks, and evidence logging.
- **[scientific-thinking-scholar-evaluation](./scientific-thinking-scholar-evaluation/SKILL.md)**: Structured scholarly-work evaluation for papers, proposals, literature reviews, methods sections, evidence quality, citation support, and research-writing feedback.
- **[visa-doc-translate](./visa-doc-translate/SKILL.md)**: Translate visa application documents (images) to English and create a bilingual PDF with original and translation.
