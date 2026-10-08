#!/usr/bin/env python3
"""Expanded nursing question bank generator.

This script generates a large bilingual nursing question bank with:
- 1000+ questions
- module-based rotation
- varied difficulty
- duplicate avoidance
- JSONL, CSV, and per-question JSON output
"""

from __future__ import annotations
import csv
import json
import random
from pathlib import Path
from hashlib import sha256

MODULES = {
    "急救與復甦": ["心肺復甦", "氣道管理", "CPR", "急性呼吸衰竭", "除顫", "緊急應變"],
    "藥物護理": ["給藥安全", "藥效觀察", "副作用", "劑量", "注射", "口服藥"],
    "感染控制": ["手部衛生", "標準預防", "隔離", "清消", "滅菌", "暴露處理"],
    "精神護理": ["焦慮", "憂鬱", "幻覺", "情緒穩定", "自傷風險", "躁動"],
    "基礎護理": ["活動照護", "沐浴", "轉位", "生活照護", "安全", "衛生"],
    "呼吸照護": ["氧療", "吸痰", "胸部評估", "呼吸窘迫", "氣道清除", "氧飽和"],
    "母嬰護理": ["新生兒評估", "哺乳", "產後照護", "黃疸", "分娩", "乳房護理"],
    "疼痛管理": ["疼痛評估", "術後疼痛", "慢性疼痛", "非藥物緩解", "鎮痛", "疼痛教育"],
    "泌尿護理": ["排尿評估", "導尿", "失禁", "尿路感染", "尿量監測", "膀胱功能"],
    "檢驗與影像": ["抽血", "檢體", "禁食", "影像準備", "檢查安全", "檢驗解讀"],
    "內科護理": ["發燒", "低血糖", "高血糖", "胸痛", "腹痛", "呼吸困難"],
    "骨科護理": ["骨折", "固定", "神經血管", "復健", "牽引", "疼痛管理"],
    "營養照護": ["營養評估", "高蛋白", "吞嚥", "低鹽", "補充飲食", "營養教育"],
    "病人安全": ["跌倒預防", "壓瘡預防", "交接", "防護裝備", "識別", "環境安全"],
    "評估與紀錄": ["生命徵象", "病歷", "紀錄", "病情變化", "文書", "觀察"],
}

TOPIC_HINTS = {
    "急救與復甦": ["CPR", "呼吸停止", "心跳驟停", "氣道", "AED"],
    "藥物護理": ["Six Rights", "過敏", "給藥", "副作用", "藥物"],
    "感染控制": ["手衛生", "Standard precautions", "隔離", "滅菌", "交叉感染"],
    "精神護理": ["焦慮", "躁動", "風險評估", "情緒", "自傷"],
    "基礎護理": ["轉位", "沐浴", "舒適", "活動", "安全"],
    "呼吸照護": ["氧療", "SpO2", "吸痰", "呼吸", "氧氣"],
    "母嬰護理": ["新生兒", "哺乳", "黃疸", "母乳", "護理"],
    "疼痛管理": ["疼痛評估", "鎮痛", "非藥物", "疼痛", "舒適"],
    "泌尿護理": ["導尿", "尿量", "失禁", "尿路感染", "膀胱"],
    "檢驗與影像": ["抽血", "檢驗", "X-ray", "禁食", "檢查"],
    "內科護理": ["發燒", "低血糖", "胸痛", "腹痛", "病情變化"],
    "骨科護理": ["骨折", "牽引", "固定", "神經血管", "疼痛"],
    "營養照護": ["高蛋白", "吞嚥", "營養", "飲食", "補充"],
    "病人安全": ["跌倒", "壓瘡", "識別", "交接", "環境"],
    "評估與紀錄": ["生命徵象", "病歷", "文書", "紀錄", "觀察"],
}

DUPLICATE_BLACKLIST = set()


def short_hash(text: str) -> str:
    return sha256(text.encode("utf-8")).hexdigest()[:12]


def build_wrong_pool(base: str, module: str) -> list[str]:
    generic = [
        "完全不處理",
        "等待家屬決定",
        "只觀察不動作",
        "直接給藥不核對",
        "忽略病人狀態",
        "延後至下一班",
        "只做表面詢問",
        "不做紀錄",
    ]
    return generic + [f"{module}中忽略{base}"]


def build_choices(answer: str, module: str) -> list[dict]:
    wrongs = build_wrong_pool(answer, module)[:3]
    out = [{"text_cn": answer, "text_en": answer, "correct": True}]
    for w in wrongs:
        out.append({"text_cn": w, "text_en": w, "correct": False})
    random.shuffle(out)
    return out


def generate_question(index: int) -> dict:
    module_names = list(MODULES.keys())
    module = module_names[(index - 1) % len(module_names)]
    topic = MODULES[module][(index - 1) % len(MODULES[module])]
    hints = TOPIC_HINTS[module]
    difficulty = "easy" if index % 4 == 0 else "medium" if index % 3 == 0 else "hard"
    difficulty_level = 1 if difficulty == "easy" else 2 if difficulty == "medium" else 4

    stem_templates = [
        f"病人{topic}時，最重要的護理行動是什麼？",
        f"在{module}情境中，最首要的處置為何？",
        f"面對{topic}相關問題，護理師最合理的反應是什麼？",
        f"病人出現{topic}的徵象時，最關鍵的優先處置為何？",
    ]
    stem = stem_templates[(index - 1) % len(stem_templates)]

    answer = (
        "先評估生命徵象並啟動適當急救流程"
        if module == "急救與復甦"
        else "確認病人身份與醫囑並再核對藥物"
        if module == "藥物護理"
        else "執行正確手部衛生與感染控制措施"
        if module == "感染控制"
        else "以低刺激、簡短溝通與評估風險"
        if module == "精神護理"
        else "維持病人安全與舒適照護"
        if module == "基礎護理"
        else "先評估呼吸狀態與氧合"
        if module == "呼吸照護"
        else "觀察母嬰狀態並提供適當支持"
        if module == "母嬰護理"
        else "重新評估疼痛並採取個別化處置"
        if module == "疼痛管理"
        else "評估尿量、脹痛與排尿狀況"
        if module == "泌尿護理"
        else "確認醫囑與病人安全後再檢查"
        if module == "檢驗與影像"
        else "優先評估生命徵象與病情變化"
        if module == "內科護理"
        else "持續監測神經血管狀態與疼痛"
        if module == "骨科護理"
        else "依需求調整營養與吞嚥支持"
        if module == "營養照護"
        else "先做風險評估與病人保護"
        if module == "病人安全"
        else "先進行客觀評估並即時紀錄"
    )

    choices = build_choices(answer, module)
    explanation_cn = (
        f"此題重點在於{topic}，護理師需結合{module}的專業知識，先評估病人狀態，並依照安全、有效與即時的原則作處置。"
        "正確的照護順序是先評估、再處置、再紀錄，才能降低風險並提升照護品質。"
    )
    explanation_en = (
        f"This question focuses on {topic} and requires the nurse to combine {module.lower()} knowledge with patient assessment and appropriate action. "
        "The correct sequence is assessment, intervention, and documentation to ensure safety and quality care."
    )

    record = {
        "id": f"Q{index:04d}",
        "module": module,
        "type": "mcq",
        "difficulty": difficulty,
        "difficulty_level": difficulty_level,
        "competency_level": ["novice"] if difficulty == "easy" else ["novice", "intermediate"] if difficulty == "medium" else ["advanced"],
        "question_cn": stem,
        "question_en": stem.replace("病人", "patient").replace("護理師", "nurse").replace("最重要", "most important").replace("是什麼", "is what?")[:200],
        "choices": choices,
        "explanation_levels": {
            "brief_cn": explanation_cn[:80],
            "brief_en": explanation_en[:80],
            "detailed_cn": explanation_cn,
            "detailed_en": explanation_en,
            "expert_cn": explanation_cn + "在臨床中，在遵守標準流程與病人個別差異下，應持續觀察並調整照護方案。",
            "expert_en": explanation_en + " In practice, nurses should continue monitoring and adjust care according to the patient's response and protocols."
        },
        "hints": hints[:3],
        "learning_objective_cn": f"掌握{module}中與{topic}相關的照護與風險管理重點。",
        "learning_objective_en": f"Understand the key care and risk management principles for {topic.lower()} in {module.lower()}.",
        "references": [{"title": f"{module} nursing guide", "url": "https://example.com/" + module.lower().replace(" ", "-"), "publisher": "Nursing education"}],
        "tags": [module.lower().replace(" ", "_"), topic.lower().replace(" ", "_")],
        "media": {"type": "image", "src": f"./media/{module.lower().replace(' ','-')}.png", "alt_cn": f"{module}示意", "alt_en": f"{module} illustration", "caption_cn": f"{module}重點", "caption_en": f"Key points in {module}"},
        "estimated_time_seconds": 30 + (index % 55),
        "srs_base_interval_days": 3 + (index % 10),
        "author": "auto-generator",
        "reviewer": None,
        "created_at": "2026-10-08T00:00:00Z",
        "updated_at": "2026-10-08T00:00:00Z",
    }
    key = short_hash(json.dumps({"module": record["module"], "quest": record["question_cn"]}, ensure_ascii=False, sort_keys=True))
    if key in DUPLICATE_BLACKLIST:
        return generate_question(index + 1)
    DUPLICATE_BLACKLIST.add(key)
    return record


def write_jsonl(path: Path, records: list[dict]) -> None:
    with path.open("w", encoding="utf-8") as f:
        for rec in records:
            f.write(json.dumps(rec, ensure_ascii=False, separators=(",", ":")))
            f.write("\n")


def write_csv(path: Path, records: list[dict]) -> None:
    fieldnames = ["id", "module", "difficulty", "question_cn", "question_en", "correct_answer", "tags"]
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for rec in records:
            answer = next(c["text_cn"] for c in rec["choices"] if c.get("correct") is True)
            writer.writerow({
                "id": rec["id"],
                "module": rec["module"],
                "difficulty": rec["difficulty"],
                "question_cn": rec["question_cn"],
                "question_en": rec["question_en"],
                "correct_answer": answer,
                "tags": ";".join(rec["tags"]),
            })


def write_single_files(path: Path, records: list[dict]) -> None:
    path.mkdir(exist_ok=True)
    for rec in records:
        (path / f"{rec['id']}.json").write_text(json.dumps(rec, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    records = []
    for i in range(101, 1001):
        rec = generate_question(i)
        records.append(rec)
    write_jsonl(Path("nursing_questions_Q0101-Q1000.jsonl"), records)
    write_csv(Path("nursing_questions_Q0101-Q1000.csv"), records)
    write_single_files(Path("questions"), records)
    print(f"Generated {len(records)} questions")


if __name__ == "__main__":
    main()
