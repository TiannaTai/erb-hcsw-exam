# Nursing Question Bank Final Version

This repository contains a complete nursing question bank generation system.

## Included files
- `generate_questions.py` — generates the JSONL question bank
- `export_csv.py` — exports the JSONL bank to CSV
- `index.html` — browser viewer for reviewing questions
- `README.md` — usage guide
- `REPORT.md` — final project summary

## How to generate the question bank
Run:

```bash
python3 generate_questions.py
```

This generates the file:

```bash
nursing_questions_Q0101-Q1000.jsonl
```

This contains a large bilingual nursing bank with module coverage, difficulty variation, and non-redundant generation.

## Export to CSV
Run:

```bash
python3 export_csv.py
```

This creates:

```bash
nursing_questions_Q0101-Q1000.csv
```

## Open the browser viewer
Open `index.html` in a browser to inspect the generated questions.

## Final note
This project is designed for educational and review purposes. Before use in formal exams, the content should be reviewed by nursing educators or clinical experts.
