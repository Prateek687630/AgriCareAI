import json
import re

with open('backend/models/diseases_55.json', encoding='utf-8') as f:
    d55 = json.load(f)

with open('AgriCare-AI-project/AgriCare-AI/src/data/diseases.js', encoding='utf-8') as f:
    js_text = f.read()

# 1. Update CROPS array
all_crops = [
    'Tomato',
    'Potato',
    'Corn (Maize)',
    'Apple',
    'Grape',
    'Pepper (Bell)',
    'Chilli',
    'Citrus',
    'Cotton',
    'Groundnut',
    'Rice',
    'Wheat',
    'Sugarcane',
    'Soybean',
    'Cashew',
    'Cassava',
    'Papaya',
    'Cherry',
    'Orange',
    'Peach',
    'Strawberry',
    'Squash',
    'Blueberry',
    'Raspberry',
]

crops_block = "export const CROPS = [\n" + "".join([f"  '{c}',\n" for c in all_crops]) + "]"

existing_ids = set(re.findall(r"id:\s*'([^']+)'", js_text))
new_diseases = [d for d in d55 if d['id'] not in existing_ids]

new_js_entries = []
for d in new_diseases:
    healthy_str = "\n    healthy: true," if d.get('healthy') else ""
    symptoms_str = json.dumps(d['symptoms'])
    mgmt_str = json.dumps(d['management'])
    prev_str = json.dumps(d['prevention'])
    entry = f"""  // ---------------- {d['crop']} - {d['name']} ----------------
  {{
    id: '{d['id']}',
    crop: '{d['crop']}',
    name: '{d['name']}',{healthy_str}
    pathogen: '{d['pathogen']}',
    type: '{d['type']}',
    severity: '{d['severity']}',
    summary: '{d['summary']}',
    symptoms: {symptoms_str},
    management: {mgmt_str},
    prevention: {prev_str},
  }},"""
    new_js_entries.append(entry)

insert_text = "\n\n" + "\n\n".join(new_js_entries)

# Locate the exact position of 'export const getDiseaseById'
idx = js_text.rfind('export const getDiseaseById')
if idx == -1:
    raise ValueError("Could not find getDiseaseById")

# Find the preceding ']'
closing_bracket = js_text.rfind(']', 0, idx)
if closing_bracket == -1:
    raise ValueError("Could not find closing bracket")

updated_js = js_text[:closing_bracket] + insert_text + "\n]\n\n" + js_text[idx:]

# Update CROPS block
pattern_crops = re.compile(r'export const CROPS = \[[^\]]+\]', re.DOTALL)
updated_js = pattern_crops.sub(crops_block, updated_js)

with open('AgriCare-AI-project/AgriCare-AI/src/data/diseases.js', 'w', encoding='utf-8') as f:
    f.write(updated_js)

print("Successfully updated diseases.js via string slice!")
