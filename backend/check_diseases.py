import json
import re

with open('backend/models/diseases_55.json', encoding='utf-8') as f:
    d55 = json.load(f)

with open('AgriCare-AI-project/AgriCare-AI/src/data/diseases.js', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r"id:\s*'([^']+)'")
existing_ids = set(pattern.findall(content))
new_diseases = [d for d in d55 if d['id'] not in existing_ids]

print('Existing disease IDs in diseases.js:', len(existing_ids))
print('New disease IDs to add:', len(new_diseases))
for d in new_diseases:
    print('  +', d['id'], f"({d['crop']} - {d['name']})")
