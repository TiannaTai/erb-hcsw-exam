# ERB HCSW Exam Training Platform

A focused training platform for ERB-HCSW exam preparation, designed to help learners identify weak areas and improve efficiently through targeted practice.

## Overview

This project is not just a question bank. It is a structured exam training system that helps users:
- practice by module
- simulate timed exams
- review weak points
- repeat incorrect questions
- track performance over time

The goal is to transform learning from random question practice into a precise improvement process.

## Key Features

- Module-based question selection
- Question type filtering
- Study mode
- Exam mode
- Weak-point review mode
- Weakness diagnostics
- Error tracking through local storage
- Result summary page
- Hospital distribution and medical encyclopedia links
- Bilingual content in Chinese and English
- Visual learning with image and Lottie animation support

## Project Structure

```text
.
├── frontend/
│   ├── quiz.html
│   ├── quiz.js
│   ├── diagnostics.html
│   ├── diagnostics.js
│   ├── results.html
│   ├── results.js
│   ├── hospitals.html
│   ├── encyclopedia.html
│   └── media/
│       ├── demo-handwash.json
│       └── demo-cpr.json
├── questions/
│   ├── question-bank.ndjson
│   ├── sample-questions.ndjson
│   └── modules.json
├── README.md
└── ...
```

## How to Use

1. Open `frontend/quiz.html`
2. Select a module and question type
3. Choose study mode, exam mode, or weak-point mode
4. Answer the questions
5. Review the error feedback
6. Open `frontend/diagnostics.html` to inspect weak areas
7. Revisit weak modules and continue targeted review
8. Check `frontend/results.html` for overall outcomes

## Why This Matters

Many exam preparation tools focus only on quantity of questions. This project focuses on quality of learning:
- identify what is wrong
- identify where the weakness is
- review the same weak areas until improvement is visible

This is the essence of targeted exam preparation.

## Tech Stack

- HTML
- CSS
- JavaScript
- NDJSON question data
- localStorage for tracking weak points
- Lottie animation for visual learning

## Notes

- This is a frontend prototype and training tool
- Content should be reviewed by qualified professionals
- It is intended for study and review, not as a final official assessment standard
- This platform is designed for educational use and should not replace clinical judgment

## Summary

This project aims to help learners move from passive question reading to active skill correction. It is designed to make exam preparation more strategic, efficient, and personalized.
