# PHASE 7 — ENTITY RELATIONSHIP GRAPH SCHEMA DEFINITION
## Sovereign Knowledge Graph Schema v1.0.0

---

## ENTITY SCHEMA

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | String (E###) | Yes | Unique entity identifier. Format: `E001`, `E002`, etc. |
| `type` | Enum | Yes | Entity type: `Organization`, `Client`, `Vendor`, `Acquisition Target`. |
| `name` | String | Yes | Human-readable entity name. |
| `category` | String | Yes | Business category classification. |
| `tier` | Integer (1-3) | Yes | Organizational tier: 1=Core, 2=Client/Partner, 3=Vendor/Dependency. |

## RELATIONSHIP SCHEMA

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | String (R###) | Yes | Unique relationship identifier. Format: `R001`, `R002`, etc. |
| `source_entity` | String (E###) | Yes | ID of the originating entity. |
| `target_entity` | String (E###) | Yes | ID of the target entity. |
| `relationship_type` | Enum | Yes | One of: `PROVIDES_SERVICE_TO`, `DEPENDS_ON`, `CONTRACTS_WITH`, `ACQUISITION_TARGET`. |
| `value_flow` | String | Yes | Direction of value/revenue flow. |
| `revenue_type` | String | No | Revenue classification for the relationship. |
| `dependency_criticality` | Enum | No | For `DEPENDS_ON` relationships: `Critical`, `High`, `Medium`, `Low`. |

## RELATIONSHIP TYPE DEFINITIONS

| Type | Definition |
|---|---|
| `PROVIDES_SERVICE_TO` | Prime Pathwy delivers a Sovereign System installation or managed service to the target entity. |
| `DEPENDS_ON` | Prime Pathwy's operations depend on the target entity for hardware, software, or infrastructure. |
| `CONTRACTS_WITH` | A client entity has an active or prospective contractual relationship with Prime Pathwy. |
| `ACQUISITION_TARGET` | The target entity is a candidate for business acquisition and AI modernization. |

---

*Prime Pathwy Knowledge Graph Schema — Confidential Institutional Asset*
