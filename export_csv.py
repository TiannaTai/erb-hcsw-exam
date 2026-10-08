# Export CSV from JSONL

This script reads the generated nursing question bank and exports it to CSV.

Usage:

```bash
python3 export_csv.py
```

Expected input:
- `nursing_questions_Q0101-Q1000.jsonl`

Expected output:
- `nursing_questions_Q0101-Q1000.csv`

It exports selected columns including question text, answer, module, and tags.
