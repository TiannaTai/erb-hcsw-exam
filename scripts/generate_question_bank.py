#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate a 1000-question ERB-HCSW bank from a template library.

Usage:
    python3 scripts/generate_question_bank.py
"""

from __future__ import annotations
import json
from pathlib import Path
from typing import Any, Dict, List

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "questions" / "question-bank.ndjson"

MODULES = [
    "基礎護理",
    "感染控制",
    "急救",
    "藥物護理",
    "評估與紀錄",
    "老年照護",
    "內科常見",
    "倫理與安全",
]

MCQ_POOL: List[Dict[str, Any]] = [
    {
        "question_cn": "病人活動後出現短暫頭暈，最重要的處置為何？",
        "question_en": "A patient becomes briefly dizzy after ambulation. What is the most important immediate action?",
        "choices": [
            {"id": "A", "text_cn": "立即讓病人快速站立再活動", "text_en": "Let the patient stand up immediately again", "correct": False},
            {"id": "B", "text_cn": "讓病人坐下休息並評估生命徵象", "text_en": "Have the patient sit down and assess vital signs", "correct": True},
            {"id": "C", "text_cn": "直接給予安眠藥", "text_en": "Administer sedatives immediately", "correct": False},
            {"id": "D", "text_cn": "不做任何處理", "text_en": "No intervention", "correct": False},
        ],
        "answer": "B",
        "explanation_cn": "頭暈可能與姿位改變造成暈厥或低血壓相關，先坐下休息並評估生命徵象最安全。",
        "explanation_en": "Dizziness may be related to postural hypotension; sitting down and assessing vital signs is the safest immediate step.",
        "hints": ["先保護安全再評估原因", "注意跌倒風險"],
        "tags": ["跌倒", "生命徵象"],
        "related_terms": ["姿位性低血壓"],
    },
    {
        "question_cn": "用藥前最重要的確認是什麼？",
        "question_en": "What is the most important check before medication administration?",
        "choices": [
            {"id": "A", "text_cn": "藥袋是否漂亮", "text_en": "Whether the medication bag looks neat", "correct": False},
            {"id": "B", "text_cn": "病人的身份、藥名、劑量與途徑", "text_en": "Patient identity, drug name, dose, and route", "correct": True},
            {"id": "C", "text_cn": "看藥名是否有英文", "text_en": "Whether the drug name has English letters", "correct": False},
            {"id": "D", "text_cn": "看藥師是否在旁邊", "text_en": "Whether the pharmacist is nearby", "correct": False},
        ],
        "answer": "B",
        "explanation_cn": "用藥前必須核對病人身份、藥品、劑量、給藥路徑與時間，以降低錯誤。",
        "explanation_en": "Before medication administration, verify patient identity, drug, dose, route, and time to reduce medication errors.",
        "hints": ["記住 5R/6R 原則", "不要只看藥袋外觀"],
        "tags": ["用藥安全", "三查"],
        "related_terms": ["用藥錯誤", "護理照護"],
    },
    {
        "question_cn": "哪種情況最適合進行口腔護理？",
        "question_en": "In which situation is oral care most appropriate?",
        "choices": [
            {"id": "A", "text_cn": "病人無法進食但口腔乾燥", "text_en": "The patient cannot eat but has a dry mouth", "correct": True},
            {"id": "B", "text_cn": "病人剛進食完 5 分鐘", "text_en": "The patient just finished eating 5 minutes ago", "correct": False},
            {"id": "C", "text_cn": "沒有任何黏膜問題", "text_en": "There are no mucosal issues", "correct": False},
            {"id": "D", "text_cn": "病人昏迷後不需要口腔護理", "text_en": "No oral care needed after altered consciousness", "correct": False},
        ],
        "answer": "A",
        "explanation_cn": "口腔護理可減少黏膜乾燥、感染風險，對無法進食或有口腔不適者很重要。",
        "explanation_en": "Oral care reduces dryness and infection risk, especially for patients who cannot eat or have oral discomfort.",
        "hints": ["維持口腔黏膜健康", "與飲食狀況相關"],
        "tags": ["口腔護理", "舒適照護"],
        "related_terms": ["黏膜保護"],
    },
    {
        "question_cn": "病人出現呼吸急促、發紺，最優先處理是？",
        "question_en": "A patient develops tachypnea and cyanosis. What is the priority management?",
        "choices": [
            {"id": "A", "text_cn": "等待醫師安排", "text_en": "Wait for the physician's arrangement", "correct": False},
            {"id": "B", "text_cn": "評估呼吸道、氧氣供應與生命徵象", "text_en": "Assess airway, oxygen supply, and vital signs", "correct": True},
            {"id": "C", "text_cn": "讓病人躺平睡眠", "text_en": "Let the patient rest supine", "correct": False},
            {"id": "D", "text_cn": "只記錄不處理", "text_en": "Record only without intervention", "correct": False},
        ],
        "answer": "B",
        "explanation_cn": "發紺和呼吸急促代表氧合不足，需立即評估呼吸道與氧療。",
        "explanation_en": "Cyanosis and tachypnea suggest inadequate oxygenation; airway and oxygenation must be assessed immediately.",
        "hints": ["先處理呼吸再處理其他問題", "發紺為危急訊號"],
        "tags": ["氧療", "急救"],
        "related_terms": ["發紺", "呼吸衰竭"],
    },
    {
        "question_cn": "何者最能預防壓瘡發生？",
        "question_en": "Which measure best prevents pressure injuries?",
        "choices": [
            {"id": "A", "text_cn": "長時間固定在同一體位", "text_en": "Keep the patient in the same position for long periods", "correct": False},
            {"id": "B", "text_cn": "定期翻身並減少局部壓力", "text_en": "Reposition regularly and reduce localized pressure", "correct": True},
            {"id": "C", "text_cn": "完全不移動病人", "text_en": "Do not move the patient at all", "correct": False},
            {"id": "D", "text_cn": "只在病人抱怨時才護理", "text_en": "Only provide care when the patient complains", "correct": False},
        ],
        "answer": "B",
        "explanation_cn": "壓瘡預防重點是減少局部持續壓力，常用翻身與支架保護。",
        "explanation_en": "Pressure injury prevention focuses on reducing sustained local pressure through repositioning and support.",
        "hints": ["壓瘡是壓力累積的結果", "防患於未然"],
        "tags": ["壓瘡", "體位變換"],
        "related_terms": ["壓力傷口"],
    },
    {
        "question_cn": "下列哪一項最符合無菌操作的原則？",
        "question_en": "Which option best reflects aseptic technique?",
        "choices": [
            {"id": "A", "text_cn": "操作前不必洗手", "text_en": "No hand hygiene before procedure", "correct": False},
            {"id": "B", "text_cn": "清潔與消毒並保持無菌物品不接觸污染面", "text_en": "Clean and disinfect while keeping sterile items away from contaminated surfaces", "correct": True},
            {"id": "C", "text_cn": "衣物隨意接觸無菌區", "text_en": "Allow clothing to contact sterile areas", "correct": False},
            {"id": "D", "text_cn": "手套穿戴後即可忽略手部衛生", "text_en": "Ignore hand hygiene after gloves are worn", "correct": False},
        ],
        "answer": "B",
        "explanation_cn": "無菌操作需遵守手部衛生、器材消毒與污染防護。",
        "explanation_en": "Aseptic technique requires hand hygiene, disinfection, and preventing sterile items from contacting contaminated surfaces.",
        "hints": ["無菌=避免污染", "先清潔再無菌"],
        "tags": ["無菌", "感染控制"],
        "related_terms": ["無菌技術"],
    },
    {
        "question_cn": "病人有明顯低血糖，最合適的第一步是？",
        "question_en": "A patient has obvious hypoglycemia. What is the best first step?",
        "choices": [
            {"id": "A", "text_cn": "給予葡萄糖或含糖飲料並再評估", "text_en": "Give glucose or sugary drink and reassess", "correct": True},
            {"id": "B", "text_cn": "直接給胰島素", "text_en": "Administer insulin immediately", "correct": False},
            {"id": "C", "text_cn": "讓病人睡覺", "text_en": "Let the patient sleep", "correct": False},
            {"id": "D", "text_cn": "只觀察不處理", "text_en": "Observe without intervention", "correct": False},
        ],
        "answer": "A",
        "explanation_cn": "低血糖需要立即補充葡萄糖，若不能口服則轉為靜脈給糖。",
        "explanation_en": "Hypoglycemia requires prompt glucose replacement; if the patient cannot take orally, IV glucose may be required.",
        "hints": ["低血糖先補糖", "確認意識狀態"],
        "tags": ["低血糖", "血糖"],
        "related_terms": ["葡萄糖"],
    },
]

SHORT_POOL = [
    {
        "question_cn": "簡述如何評估病人疼痛程度，至少說明一種工具。",
        "question_en": "Describe how to assess pain intensity and mention at least one tool.",
        "answer": "可使用 NRS 0-10 或 VAS，讓病人自行評分疼痛程度。 / Use NRS 0-10 or VAS and ask the patient to rate pain intensity.",
        "explanation_cn": "疼痛評估應包括疼痛部位、程度、性質及影響，常用量表可使評估一致。",
        "explanation_en": "Pain assessment should include location, severity, quality, and impact; standard tools improve consistency.",
        "hints": ["疼痛量表是常用的評估工具", "評估要包含程度與影響"],
        "tags": ["疼痛", "評估"],
        "related_terms": ["NRS", "VAS"],
    },
    {
        "question_cn": "寫出護理紀錄中應記錄的三項重要內容。",
        "question_en": "State three important items that should be recorded in nursing documentation.",
        "answer": "病人的主訴與客觀觀察、護理措施及反應、藥物與過敏紀錄。 / Patient complaint and objective findings, nursing actions and responses, medication and allergy records.",
        "explanation_cn": "護理紀錄需客觀、完整且即時，才能支援照護與轉介。",
        "explanation_en": "Nursing documentation must be objective, complete, and timely to support care and handover.",
        "hints": ["客觀資料很重要", "不要只記感覺"],
        "tags": ["紀錄", "照護"],
        "related_terms": ["護理文書"],
    },
    {
        "question_cn": "何謂高風險跌倒病人？簡短說明。",
        "question_en": "What is a high-risk fall patient? Briefly explain.",
        "answer": "指有年齡、步態、視覺、藥物或意識狀況等因素，使跌倒風險增加的病人。 / A high-risk fall patient has factors such as age, gait, vision, medications, or altered consciousness that increase fall risk.",
        "explanation_cn": "跌倒風險評估需綜合病人的功能狀況與環境因素。",
        "explanation_en": "Fall risk assessment should consider both the patient's functional status and environmental factors.",
        "hints": ["風險評估重點在因素整合", "環境不可忽略"],
        "tags": ["跌倒", "評估"],
        "related_terms": ["跌倒預防"],
    },
]


def build_mcq(index: int, module: str, pool_item: Dict[str, Any]) -> Dict[str, Any]:
    item = {
        "id": f"Q{index:04d}",
        "module": module,
        "type": "mcq",
        "difficulty": ["easy", "medium", "hard"][index % 3],
        "question_cn": pool_item["question_cn"],
        "question_en": pool_item["question_en"],
        "choices": pool_item["choices"],
        "answer": pool_item["answer"],
        "explanation_cn": pool_item["explanation_cn"],
        "explanation_en": pool_item["explanation_en"],
        "hints": pool_item["hints"],
        "tags": pool_item["tags"],
        "related_terms": pool_item["related_terms"],
        "linked_hospitals": [],
        "source": "template_bank",
        "last_reviewed": "",
    }
    return item


def build_short(index: int, module: str, pool_item: Dict[str, Any]) -> Dict[str, Any]:
    item = {
        "id": f"Q{index:04d}",
        "module": module,
        "type": "short",
        "difficulty": ["easy", "medium", "hard"][index % 3],
        "question_cn": pool_item["question_cn"],
        "question_en": pool_item["question_en"],
        "choices": [],
        "answer": pool_item["answer"],
        "explanation_cn": pool_item["explanation_cn"],
        "explanation_en": pool_item["explanation_en"],
        "hints": pool_item["hints"],
        "tags": pool_item["tags"],
        "related_terms": pool_item["related_terms"],
        "linked_hospitals": [],
        "source": "template_bank",
        "last_reviewed": "",
    }
    return item


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    bank: List[Dict[str, Any]] = []

    # 1000-question bank generation
    for i in range(1, 1001):
        module = MODULES[(i - 1) % len(MODULES)]
        use_mcq = (i % 5 != 0)  # ~80% MCQ, 20% short
        if use_mcq:
            pool = MCQ_POOL[(i - 1) % len(MCQ_POOL)]
            bank.append(build_mcq(i, module, pool))
        else:
            pool = SHORT_POOL[(i - 1) % len(SHORT_POOL)]
            bank.append(build_short(i, module, pool))

    with OUT.open("w", encoding="utf-8") as f:
        for item in bank:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")

    print(f"Generated {len(bank)} questions -> {OUT}")


if __name__ == "__main__":
    main()
