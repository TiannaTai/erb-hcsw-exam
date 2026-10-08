# QUESTION_SCHEMA

此文件說明題庫 JSON 格式（NDJSON，每行一題）。每題為一個 JSON 物件，字段如下：

- id: string (題號，例如 Q0001)
- module: string (模組名稱，例如 "基礎護理")
- type: string ("mcq" 或 "short")
- difficulty: string ("easy"|"medium"|"hard")
- question_cn: string (中文題幹)
- question_en: string (英文題幹)
- choices: array (僅 mcq 使用，每項 {id, text_cn, text_en, correct})
- answer: string (標準答案或簡答參考答案，簡答題可為中/英雙版本以 / 分隔)
- explanation_cn: string (中文解說)
- explanation_en: string (英文解說)
- hints: array (糾錯提示，可在答錯後顯示)
- tags: array (關鍵字)
- related_terms: array (百科關鍵詞)
- linked_hospitals: array (可選，關聯醫院)
- source: string (來源或草稿標記)
- last_reviewed: string (日期，若未審核可為空)

範例檔案： `questions/sample-questions.ndjson`（每行為一題的 JSON）。

匯入/擴充建議流程：
1. 先用小批量（20-100 題）進行格式驗證與內容審核。
2. 由專業醫護人員審核題目內容與解說。
3. 使用批次匯入腳本（未來可加入）將經審核的題目合併到主題庫中。

注意事項：自動生成的題目需標註為 draft，並在正式使用前完成人工審核以避免醫療責任風險。
