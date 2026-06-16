import os
import json
import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI()

async def generate_batch(prompt, count, output_dir, prefix):
    tasks = []
    for i in range(count):
        tasks.append(client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are Arthur F. Appling Sr., Lead Technical Architect for Prime Pathwy. You prioritize $5,000+ 'Sovereign System' installations. We value Systems over Labor and Documentation over Assumption. Your tone is institutional, operationally experienced, avoiding hype, teaching real systems thinking. Aesthetic is Matte Black and Gold (#0B0B0B, #C9A646). High-authority, minimal. No fluff, no filler."},
                {"role": "user", "content": f"{prompt}\n\nGenerate variation {i+1} of {count}. Ensure it is unique, specific, and actionable."}
            ],
            temperature=0.7
        ))
    
    responses = await asyncio.gather(*tasks)
    
    for i, response in enumerate(responses):
        content = response.choices[0].message.content
        filename = f"{prefix}_{i+1:03d}.md"
        filepath = os.path.join(output_dir, filename)
        with open(filepath, "w") as f:
            f.write(content)
        print(f"Generated {filepath}")

async def main():
    print("Starting generation of Whitepapers...")
    await generate_batch(
        "Write a whitepaper concept/executive summary. Focus on deep industry analysis, compliance failure analysis, and institutional systems thinking.",
        3, # Reduced for speed
        "/home/ubuntu/Prime_Pathwy/Whitepapers",
        "whitepaper"
    )
    
    print("Starting generation of Founder Narratives...")
    await generate_batch(
        "Write a founder-story narrative. Focus on operational experience, building Prime Pathwy, and the transition from labor to systems.",
        3, # Reduced for speed
        "/home/ubuntu/Prime_Pathwy/Founder_Narratives",
        "founder_narrative"
    )
    
    print("Starting generation of Local Market Insights...")
    await generate_batch(
        "Write a local-market insight post. Focus on Solano County (Vallejo, Benicia, Fairfield, Vacaville, American Canyon). Discuss commercial real estate, logistics, or industrial services.",
        5, # Reduced for speed
        "/home/ubuntu/Prime_Pathwy/Content_Archive/Local_Market_Insights",
        "local_market_insight"
    )
    
    print("Starting generation of Data-Driven Industry Reports...")
    await generate_batch(
        "Write a data-driven industry report summary. Focus on competitive saturation analysis, operational inefficiency trends, or AI automation opportunity analysis.",
        3, # Reduced for speed
        "/home/ubuntu/Prime_Pathwy/Industry_Reports",
        "industry_report"
    )

if __name__ == "__main__":
    asyncio.run(main())
