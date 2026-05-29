# Prime Pathwy Global Relationship & Network Mapping
## Sovereign System Specification

### I. Strategic Objective
In high-ticket B2B sales and sovereign procurement, transactions are rarely isolated. They are governed by complex, interlocking networks of vendors, agencies, subcontractors, ownership groups, and operational dependencies. 

The **Prime Pathwy Relationship Mapping Engine** is designed to visualize, analyze, and exploit these connections. By mapping the linkages between logistics operators, facilities managers, and municipal agencies, Prime Pathwy can identify strategic entry points, forecast competitive moves, and build robust consortia to capture large-scale contracts.

---

### II. JSON Relationship Graph Schema
To support programmatic analysis and visualization, all entity relationships are structured into a standardized JSON graph format containing `nodes` (entities) and `links` (relationships).

#### Node Schema:
```json
{
    "id": "entity_id_or_unique_name",
    "label": "Legal Business Name",
    "group": "industry_classification_or_type",
    "scale": "estimated_operational_scale"
}
```

#### Link Schema:
```json
{
    "source": "source_node_id",
    "target": "target_node_id",
    "type": "relationship_type",
    "details": "Specific operational details or contract links"
}
```

---

### III. Adjacency & Dependency Matrix
To evaluate network density and identify high-leverage nodes, we utilize an adjacency matrix that maps dependencies across the ecosystem:

| Entity Name | Apex Transport | Sovereign Janitorial | Vanguard Storage | BAAQMD | Vallejo Transit | Solano Records |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Apex Transport** | — | — | Subcontractor | Incumbent | — | — |
| **Sovereign Janitorial** | — | — | — | — | — | — |
| **Vanguard Storage** | Subcontractor | — | — | — | — | — |
| **BAAQMD** | Regulator | — | — | — | — | — |
| **Vallejo Transit** | — | — | — | — | — | — |
| **Solano Records** | — | — | — | — | — | — |

---

### IV. Network Visualization & Mapping Tool
The generation of relationship graphs is automated via `/tools/relationship_mapper.py`. 

This script:
1. Queries the SQLite database for all active entities and relationships.
2. Formats the data into a standard D3.js-compatible JSON structure.
3. Generates a static HTML network visualization styled in the Prime Pathwy Matte Black and Gold theme.
4. Outputs the JSON map to `/vault/relationships/relationship_graph.json` and the HTML visualization to `/vault/relationships/relationship_map.html`.
