import os
import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI()

async def generate_bos_component(prompt, filepath):
    response = await client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": "You are Arthur F. Appling Sr., Lead Technical Architect for Prime Pathwy. You prioritize $5,000+ 'Sovereign System' installations. We value Systems over Labor and Documentation over Assumption. Your tone is institutional, operationally experienced, avoiding hype, teaching real systems thinking. Aesthetic is Matte Black and Gold (#0B0B0B, #C9A646). High-authority, minimal. No fluff, no filler. Output must be implementation-ready Markdown."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )
    content = response.choices[0].message.content
    with open(filepath, "w") as f:
        f.write(content)
    print(f"Generated {filepath}")

async def main():
    tasks = []
    
    # Section 1: Executive Operations
    tasks.append(generate_bos_component(
        "Create the Master Operating Manual - Section 1: Executive Operations. Include daily operating procedures, weekly review systems, KPI frameworks, and accountability systems.",
        "/home/ubuntu/Prime_Pathwy/Operations_OS/Executive_Ops/executive_operations_manual.md"
    ))
    
    # Section 2: Field Operations
    tasks.append(generate_bos_component(
        "Create the Master Operating Manual - Section 2: Field Operations. Include site inspection systems, route management, crew deployment, and safety protocols.",
        "/home/ubuntu/Prime_Pathwy/Operations_OS/Field_Ops/field_operations_manual.md"
    ))
    
    # Section 3: Client Management
    tasks.append(generate_bos_component(
        "Create the Master Operating Manual - Section 3: Client Management. Include client onboarding, proposal systems, contract workflows, and retention systems.",
        "/home/ubuntu/Prime_Pathwy/Operations_OS/Client_Management/client_management_manual.md"
    ))
    
    # Section 4: Compliance
    tasks.append(generate_bos_component(
        "Create the Master Operating Manual - Section 4: Compliance. Include OSHA-style procedures, insurance verification workflows, contractor verification, and audit procedures.",
        "/home/ubuntu/Prime_Pathwy/Operations_OS/Compliance/compliance_manual.md"
    ))
    
    # Section 5: AI + Automation
    tasks.append(generate_bos_component(
        "Create the Master Operating Manual - Section 5: AI + Automation. Include CRM workflows, lead routing logic, AI agent task structures, and file hierarchy architecture.",
        "/home/ubuntu/Prime_Pathwy/Operations_OS/AI_Automation/ai_automation_manual.md"
    ))
    
    # Section 6: Financial Operations
    tasks.append(generate_bos_component(
        "Create the Master Operating Manual - Section 6: Financial Operations. Include invoice systems, collections workflows, vendor management, and profitability analysis systems.",
        "/home/ubuntu/Prime_Pathwy/Operations_OS/Financial_Ops/financial_operations_manual.md"
    ))
    
    # SOP Library
    tasks.append(generate_bos_component(
        "Create 5 essential implementation-ready forms (e.g., Site Inspection, Incident Report) in Markdown format for the SOP Library.",
        "/home/ubuntu/Prime_Pathwy/SOP_Library/Forms/essential_forms.md"
    ))
    tasks.append(generate_bos_component(
        "Create 5 essential implementation-ready checklists (e.g., Onboarding, QA) in Markdown format for the SOP Library.",
        "/home/ubuntu/Prime_Pathwy/SOP_Library/Checklists/essential_checklists.md"
    ))
    
    await asyncio.gather(*tasks)
    print("Business Operating System generation complete.")

if __name__ == "__main__":
    asyncio.run(main())
