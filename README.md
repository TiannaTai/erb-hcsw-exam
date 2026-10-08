# Nursing Question Bank Project

This repository contains a large, bilingual nursing question bank generator and browser interface.

## What is included
- `generate_questions.py` to generate the question bank.
- `export_csv.py` to convert JSONL to CSV.
- `index.html` to preview the bank in a browser.
- `questions/` folder with one JSON file per question.
- `nursing_questions_Q0101-Q1000.jsonl` and `nursing_questions_Q0101-Q1000.csv` after generation.

## Generate the question bank
```bash
python3 generate_questions.py
```

## Export to CSV
```bash
python3 export_csv.py
```

## View the bank
Open `index.html` in a browser.

## Notes
This content is intended for educational use and should be reviewed by nursing professionals before use in formal examinations.
