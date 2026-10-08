# Nursing Question Bank

This repository contains a complete nursing question bank system for generation, browsing, export, and review.

## Included files
- `generate_questions.py` — generates a large, unique, bilingual nursing question bank.
- `export_csv.py` — exports the generated JSONL question bank to CSV.
- `index.html` — browser-based viewer for quick inspection in the browser.
- `README.md` — usage instructions.
- `REPORT.md` — summary of the system and how to use it.

## Generate the full question bank
From the repository root, run:

```bash
python3 generate_questions.py
```

This creates a JSONL file named:

```bash
nursing_questions_Q0101-Q1000.jsonl
```

It contains a full generated bank from Q0101 through Q1000 using:
- modular topic rotation
- difficulty balance
- bilingual content (Chinese/English)
- non-redundant question generation
- standard nursing metadata fields

## Export to CSV
After generating the JSONL bank, run:

```bash
python3 export_csv.py
```

This exports:

```bash
nursing_questions_Q0101-Q1000.csv
```

The CSV includes the most important fields for import into a spreadsheet or LMS:
- id
- module
- difficulty
- question_cn
- question_en
- correct_answer
- tags

## Open the browser viewer
Open:

```text
index.html
```

in your browser to view generated questions and filter by module or difficulty.

## Basic usage flow
1. Generate the bank
   ```bash
   python3 generate_questions.py
   ```
2. Export CSV
   ```bash
   python3 export_csv.py
   ```
3. Open `index.html` to browse
4. Review and refine before using in assessments

## Why this system
- supports large-scale generation
- avoids repeated question stems
- gives modular coverage across nursing domains
- stays bilingual and educationally readable
- can be extended for more questions or LMS import

## Important note
This system is designed for education and knowledge review. For formal exams or clinical assessments, a domain expert should review the final bank before use in high-stakes evaluation.
