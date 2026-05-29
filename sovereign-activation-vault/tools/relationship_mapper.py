#!/usr/bin/env python3
"""
Prime Pathwy Global Relationship & Network Mapping Tool
Queries SQLite database, builds D3.js-compatible JSON graphs, and generates Matte Black & Gold HTML visualizations.
"""

import os
import sqlite3
import json

class RelationshipMapper:
    def __init__(self, db_path="/home/ubuntu/prime-pathwy-sovereign-vault/vault/exports/sqlite/prime_pathwy_sovereign.db", 
                 output_dir="/home/ubuntu/prime-pathwy-sovereign-vault/vault/relationships"):
        self.db_path = db_path
        self.output_dir = output_dir
        self.json_output = os.path.join(output_dir, "relationship_graph.json")
        self.html_output = os.path.join(output_dir, "relationship_map.html")
        
        os.makedirs(output_dir, exist_ok=True)

    def generate_graph_data(self):
        if not os.path.exists(self.db_path):
            return {"nodes": [], "links": []}
            
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Fetch Nodes (Entities)
        cursor.execute("SELECT entity_id, legal_business_name, industry_classification, estimated_operational_scale FROM crm_entities")
        entities = cursor.fetchall()
        
        nodes = []
        for ent in entities:
            e_id, name, industry, scale = ent
            nodes.append({
                "id": e_id,
                "label": name,
                "group": industry,
                "scale": scale
            })
            
        # Add Issuing Agencies as Nodes
        cursor.execute("SELECT DISTINCT issuing_agency FROM procurement_contracts")
        agencies = cursor.fetchall()
        for agency in agencies:
            agency_name = agency[0]
            # Check if agency already has a node ID (use hash or unique string)
            nodes.append({
                "id": agency_name,
                "label": agency_name,
                "group": "Government Agency",
                "scale": "N/A"
            })
            
        # Fetch Links (Explicit Relationships)
        cursor.execute("SELECT source_entity_id, target_entity_id, relationship_type, relationship_details FROM entity_relationships")
        relationships = cursor.fetchall()
        
        links = []
        for rel in relationships:
            src, tgt, r_type, details = rel
            links.append({
                "source": src,
                "target": tgt,
                "type": r_type,
                "details": details
            })
            
        # Fetch Links (Procurement Incumbents)
        cursor.execute("SELECT issuing_agency, incumbent_id, contract_value FROM procurement_contracts WHERE incumbent_id IS NOT NULL")
        contracts = cursor.fetchall()
        for contract in contracts:
            agency, incumbent_id, value = contract
            links.append({
                "source": incumbent_id,
                "target": agency,
                "type": "incumbent_contractor",
                "details": f"Holds active contract valued at {value}"
            })
            
        conn.close()
        
        graph_data = {"nodes": nodes, "links": links}
        
        # Save JSON
        with open(self.json_output, 'w', encoding='utf-8') as f:
            json.dump(graph_data, f, indent=4)
            
        return graph_data

    def generate_html_visualization(self, graph_data):
        """
        Generates a self-contained, highly polished HTML file using D3.js
        styled in the Prime Pathwy Matte Black (#0B0B0B) and Gold (#C9A646) theme.
        """
        nodes_json = json.dumps(graph_data["nodes"], indent=4)
        links_json = json.dumps(graph_data["links"], indent=4)
        
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Prime Pathwy — Sovereign Relationship Map</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <style>
        body {{
            background-color: #0B0B0B;
            color: #FFFFFF;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            overflow: hidden;
        }}
        #header {{
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 10;
            border-left: 4px solid #C9A646;
            padding-left: 15px;
        }}
        h1 {{
            margin: 0;
            font-size: 24px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #C9A646;
        }}
        p {{
            margin: 5px 0 0 0;
            font-size: 12px;
            color: #888888;
        }}
        .node {{
            stroke: #0B0B0B;
            stroke-width: 2px;
            cursor: pointer;
        }}
        .link {{
            stroke: #444444;
            stroke-opacity: 0.6;
            stroke-width: 1.5px;
        }}
        .label {{
            font-size: 10px;
            fill: #DDDDDD;
            pointer-events: none;
            text-anchor: middle;
        }}
        #tooltip {{
            position: absolute;
            background-color: rgba(11, 11, 11, 0.9);
            border: 1px solid #C9A646;
            padding: 10px;
            border-radius: 4px;
            pointer-events: none;
            font-size: 12px;
            display: none;
            color: #FFFFFF;
            max-width: 250px;
        }}
    </style>
</head>
<body>
    <div id="header">
        <h1>Sovereign Relationship Map</h1>
        <p>Prime Pathwy Network Intelligence & Ecosystem Graph</p>
    </div>
    <div id="tooltip"></div>
    <svg width="100vw" height="100vh" id="graph"></svg>

    <script>
        const graphData = {{
            nodes: {nodes_json},
            links: {links_json}
        }};

        const width = window.innerWidth;
        const height = window.innerHeight;

        const svg = d3.select("#graph")
            .attr("width", width)
            .attr("height", height);

        const simulation = d3.forceSimulation(graphData.nodes)
            .force("link", d3.forceLink(graphData.links).id(d => d.id).distance(150))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = svg.append("g")
            .selectAll("line")
            .data(graphData.links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke", d => {{
                if (d.type === 'logistics_subcontractor') return '#C9A646';
                if (d.type === 'incumbent_contractor') return '#4488ff';
                return '#444444';
            }});

        const node = svg.append("g")
            .selectAll("circle")
            .data(graphData.nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", d => d.group === 'Government Agency' ? 12 : 8)
            .style("fill", d => {{
                if (d.group === 'Government Agency') return '#4488ff';
                if (d.id === 1) return '#C9A646'; // Highlight primary
                return '#888888';
            }})
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        const label = svg.append("g")
            .selectAll("text")
            .data(graphData.nodes)
            .enter().append("text")
            .attr("class", "label")
            .attr("dy", -15)
            .text(d => d.label);

        node.on("mouseover", function(event, d) {{
            const tooltip = d3.select("#tooltip");
            tooltip.style("display", "block")
                .html(`<strong>${{d.label}}</strong><br/>Group: ${{d.group}}<br/>Scale: ${{d.scale}}`)
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 15) + "px");
        }}).on("mouseout", function() {{
            d3.select("#tooltip").style("display", "none");
        }});

        simulation.on("tick", () => {{
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            label
                .attr("x", d => d.x)
                .attr("y", d => d.y);
        }});

        function dragstarted(event, d) {{
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }}

        function dragged(event, d) {{
            d.fx = event.x;
            d.fy = event.y;
        }}

        function dragended(event, d) {{
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }}
    </script>
</body>
</html>
"""
        with open(self.html_output, 'w', encoding='utf-8') as f:
            f.write(html_content)

if __name__ == "__main__":
    mapper = RelationshipMapper()
    print("Generating programmatic relationship graph...")
    data = mapper.generate_graph_data()
    print(f"Nodes: {len(data['nodes'])}, Links: {len(data['links'])}")
    
    print("Generating Matte Black & Gold D3.js visualization...")
    mapper.generate_html_visualization(data)
    print("Visualization saved successfully.")
