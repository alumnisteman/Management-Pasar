import json

transcript_path = r"C:\Users\Administrator\.gemini\antigravity\brain\31d0d653-20ff-4b94-ad83-1f263e6e58f8\.system_generated/logs/transcript.jsonl"

user_messages = []
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            step = json.loads(line)
            if step.get('source') == 'USER_EXPLICIT' and step.get('type') == 'USER_INPUT':
                user_messages.append((step.get('step_index'), step.get('content')))
        except:
            pass

print("--- ALL USER INPUTS ---")
for idx, content in user_messages:
    print(f"Step {idx}:")
    print(content)
    print("-" * 50)
