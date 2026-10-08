# Nursing Question Bank: Q0101–Q0250

This repository now contains a JSONL file with nursing questions Q0101 through Q0250 (Chinese/English bilingual). Each line in the file is a JSON object representing one question. The file was generated and uploaded by an automated assistant on behalf of the repository owner.

Files added:
- nursing_questions_Q0101-Q0250.jsonl: JSONL file containing 150 questions (Q0101–Q0250).
- REPORT.md: Upload report and summary.

How to use:
- To parse the JSONL file in Python: see the example below.

```python
import json
with open('nursing_questions_Q0101-Q0250.jsonl', 'r', encoding='utf-8') as f:
    questions = [json.loads(line) for line in f]
print(len(questions))
```

License & attribution:
- Content was generated and structured by an automated assistant and may require human review before clinical use. Please verify content accuracy before using in assessments or educational settings.
