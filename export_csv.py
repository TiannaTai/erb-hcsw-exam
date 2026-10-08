#!/usr/bin/env python3
"""Export the generated JSONL nursing question bank to CSV."""

from __future__ import annotations
import csv
import json
from pathlib import Path

IN_PATH = Path("nursing_questions_Q0101-Q1000.jsonl")
OUT_PATH = Path("nursing_questions_Q0101-Q1000.csv")


def main() -> None:
    if not IN_PATH.exists():
        raise FileNotFoundError(f"Input file not found: {IN_PATH}")

    rows = []
    with IN_PATH.open("r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            item = json.loads(line)
            answer = next(choice["text_cn"] for choice in item["choices"] if choice.get("correct") is True)
            rows.append({
                "id": item["id"],
                "module": item["module"],
                "difficulty": item["difficulty"],
                "question_cn": item["question_cn"],
                "question_en": item["question_en"],
                "correct_answer": answer,
                "tags": ";".join(item["tags"]),
            })

    with OUT_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "module", "difficulty", "question_cn", "question_en", "correct_answer", "tags"])
        writer.writeheader()
        writer.writerows(rows)

    print(f"Exported {len(rows)} questions to {OUT_PATH}")


if __name__ == "__main__":
    main()
