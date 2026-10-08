# Upload REPORT

Repository: TiannaTai/erb-hcsw-exam

## Current state
The repository contains the full generation system for a bilingual nursing question bank, and can generate a large bank (including Q0101–Q1000 and beyond) using the included Python generator.

## Added files
- `generate_questions.py` — main generator
- `export_csv.py` — CSV export utility
- `index.html` — browser viewer
- `README.md` — usage instructions
- `REPORT.md` — project summary

## Generation flow
1. Run `python3 generate_questions.py`
2. Review generated JSONL file
3. Run `python3 export_csv.py`
4. Open `index.html` to browse the bank

## Coverage approach
- Module-based question rotation
- Difficulty balancing
- Bilingual structure
- Avoidance of duplicate stems and repeated patterns
- Standard metadata for later import/export

## Note
This is a strong educational drafting system and is best used after clinical review if intended for formal exam or licensing purposes.
