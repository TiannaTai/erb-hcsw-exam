# Upload REPORT

Repository: TiannaTai/erb-hcsw-exam

## Goal
Expand the existing nursing question bank from Q0101–Q0250 to Q0101–Q1000, while preserving breadth, difficulty control, and uniqueness.

## Included files
- `generate_questions.py` — generates additional unique questions using a module-based template strategy.
- `index.html` — in-browser question viewer for quick inspection in GitHub-hosted or local environments.
- `README.md` — usage instructions.

## Generation strategy
- Uses a rotating module/topic combination to avoid duplicates.
- Balances difficulty across easy/medium/hard questions.
- Keeps bilingual (Chinese/English) content and metadata fields stable.
- Produces a JSONL bank that is easy to import or analyze.

## Suggested next step
Open `index.html` in a browser to quickly review the generated question bank, then run `python3 generate_questions.py` to regenerate and expand the file further.

## Important note
This is an educational drafting workflow and should still be reviewed by clinical instructors or domain experts before using in formal exams or high-stakes assessments.
