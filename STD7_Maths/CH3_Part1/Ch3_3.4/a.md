# Decimal Place Value Tool — Agent Instructions

## Overview

Interactive educational tool for **Grade 7 (NCERT Ganita Prakash, Chapter 3 — "A Peek Beyond the Point")**. Covers the decimal place value system: tenths, hundredths, thousandths, decimal notation, reading decimals, expanded form, comparing decimals, addition/subtraction, and real-world unit conversions (mm↔cm, cm↔m, g↔kg, ₹↔paise).

**3 Modes**: Learn, Practice, Real World

---

## Quick Reference Table

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `initialMode` | `"learn" \| "practice" \| "real_world"` | `"learn"` | Starting mode |
| `showModeSelector` | boolean | true | Show mode tabs |
| `showNavigation` | boolean | true | Show prev/next |
| `filterSteps` | number[] | null | Only show specific step IDs |
| `autoPlayDuration` | number | 0 | Auto-advance ms (0=off) |
| `themeColor` | string | "#6366f1" | Primary color |
| `darkMode` | boolean | false | Dark theme |

---

## additionalProps Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `decimalNumber` | number | null | Number to visualize in place value chart |
| `highlightPlace` | string | null | Place to glow-highlight: `"ones"`, `"tenths"`, `"hundredths"`, `"thousandths"`, `"tens"`, `"hundreds"` |
| `showExpandedForm` | boolean | true | Show expanded form breakdown |
| `compareNumbers` | [number, number] | null | Two numbers to compare |
| `conversionType` | string | null | `"mm_cm"`, `"cm_m"`, `"g_kg"`, `"paise_rupee"` |
| `conversionValue` | number | null | Value to convert |
| `practiceQuestions` | array | null | Custom quiz questions |

---

## Step IDs

### Learn Mode
| ID | Title |
|----|-------|
| 1 | Why Do We Need Decimals? |
| 2 | Tenths — Splitting a Unit into 10 |
| 3 | Hundredths — Even Smaller Parts |
| 4 | Thousandths — Going Even Deeper |
| 5 | The Decimal Place Value Chart |
| 6 | Reading Decimal Numbers |

### Practice Mode
| ID | Title |
|----|-------|
| 10 | Identify the Place Value |
| 11 | Convert Fractions to Decimals |
| 12 | Compare Decimal Numbers |
| 13 | Expanded Form Challenge |
| 14 | Addition & Subtraction |

### Real World Mode
| ID | Title |
|----|-------|
| 20 | Measuring Length: mm ↔ cm |
| 21 | Measuring Length: cm ↔ m |
| 22 | Weight: grams ↔ kilograms |
| 23 | Money: Rupees & Paise |
| 24 | Decimal Disasters! |

---

## Tool Call Examples

### Example 1: Full Tool (Default)
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Decimal Place Value",
    "data": {
        "toolName": "decimal_place_value_tool",
        "parameters": {}
    },
    "instructions_for_student": "Explore how decimals work using the three modes!"
}
```

### Example 2: Show Specific Decimal Number
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Understanding 285.347",
    "data": {
        "toolName": "decimal_place_value_tool",
        "parameters": {
            "initialMode": "learn",
            "filterSteps": [5],
            "additionalProps": {
                "decimalNumber": 285.347,
                "highlightPlace": "hundredths",
                "showExpandedForm": true
            }
        }
    },
    "instructions_for_student": "Look at how each digit has a different place value!"
}
```

### Example 3: Focus on Tenths
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Learning Tenths",
    "data": {
        "toolName": "decimal_place_value_tool",
        "parameters": {
            "initialMode": "learn",
            "filterSteps": [2],
            "additionalProps": {
                "decimalNumber": 3.7,
                "highlightPlace": "tenths"
            }
        }
    },
    "instructions_for_student": "When we split 1 unit into 10 equal parts, each part is one-tenth!"
}
```

### Example 4: Practice Only Mode
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Decimal Practice Quiz",
    "data": {
        "toolName": "decimal_place_value_tool",
        "parameters": {
            "initialMode": "practice",
            "enabledModes": ["practice"],
            "showModeSelector": false
        }
    },
    "instructions_for_student": "Test your knowledge of decimal place values!"
}
```

### Example 5: Custom Practice Questions
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Custom Quiz",
    "data": {
        "toolName": "decimal_place_value_tool",
        "parameters": {
            "initialMode": "practice",
            "filterSteps": [10],
            "additionalProps": {
                "practiceQuestions": [
                    {
                        "question": "What is 234 hundredths in decimal?",
                        "options": ["23.4", "2.34", "0.234", "234.0"],
                        "correctIndex": 1,
                        "explanation": "234/100 = 200/100 + 30/100 + 4/100 = 2 + 0.3 + 0.04 = 2.34"
                    }
                ]
            }
        }
    }
}
```

### Example 6: Real World — Weight Conversion
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Grams to Kilograms",
    "data": {
        "toolName": "decimal_place_value_tool",
        "parameters": {
            "initialMode": "real_world",
            "filterSteps": [22],
            "enabledModes": ["real_world"],
            "showModeSelector": false
        }
    },
    "instructions_for_student": "1 gram = 0.001 kg. Try converting different weights!"
}
```

### Example 7: Real World — Money
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Rupees and Paise",
    "data": {
        "toolName": "decimal_place_value_tool",
        "parameters": {
            "initialMode": "real_world",
            "filterSteps": [23]
        }
    },
    "instructions_for_student": "100 paise = 1 rupee. So 75 paise = ₹0.75!"
}
```

### Example 8: Reading Decimals Only
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "How to Read Decimals",
    "data": {
        "toolName": "decimal_place_value_tool",
        "parameters": {
            "initialMode": "learn",
            "filterSteps": [6],
            "showNavigation": false
        }
    },
    "instructions_for_student": "0.274 is read as 'zero point two seven four' — NOT 'two hundred seventy four'!"
}
```

### Example 9: Autoplay Presentation
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Decimal Place Value Tour",
    "data": {
        "toolName": "decimal_place_value_tool",
        "parameters": {
            "initialMode": "learn",
            "autoPlayDuration": 10000,
            "showModeSelector": false,
            "enabledModes": ["learn"]
        }
    },
    "instructions_for_student": "Sit back and watch the lesson unfold!"
}
```

### Example 10: Dark Mode with Custom Theme
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Decimal Explorer",
    "data": {
        "toolName": "decimal_place_value_tool",
        "parameters": {
            "darkMode": true,
            "themeColor": "#8b5cf6",
            "additionalProps": {
                "decimalNumber": 70.5
            }
        }
    }
}
```

---

## Decision Tree for Agents

```
Student asks about decimals/place value
    │
    ├─ "What is a decimal?" / "Explain decimals"
    │   └─ Use: initialMode: "learn", show all steps
    │
    ├─ "Show me [X.XX] in place value"
    │   └─ Use: additionalProps.decimalNumber with filterSteps: [5]
    │
    ├─ "What is tenths/hundredths/thousandths?"
    │   └─ Use: filterSteps: [2]/[3]/[4], highlightPlace
    │
    ├─ "How do I read 0.274?"
    │   └─ Use: filterSteps: [6]
    │
    ├─ "Convert mm to cm" / "grams to kg"
    │   └─ Use: initialMode: "real_world", appropriate filterSteps
    │
    ├─ "Quiz me" / "Practice problems"
    │   └─ Use: initialMode: "practice"
    │
    ├─ "Custom question about [topic]"
    │   └─ Use: additionalProps.practiceQuestions with custom MCQ
    │
    └─ "Expanded form of [number]"
        └─ Use: additionalProps: { decimalNumber: X, showExpandedForm: true }
```

---

## Tips for Agents

1. **For specific numbers**: Use `additionalProps.decimalNumber` to visualize any decimal
2. **For highlighting**: Use `highlightPlace` to draw attention to a specific column
3. **For quizzes**: Override with `practiceQuestions` array for custom MCQs
4. **For unit conversions**: Use Real World mode steps 20-23
5. **For minimal UI**: Set `showModeSelector: false, showNavigation: false`
6. **For presentations**: Use `autoPlayDuration: 10000` for auto-advance
7. **For single concept**: Use `filterSteps` to show only relevant steps

---

## Error Handling

- If `decimalNumber` is invalid: Falls back to step's default number
- If `highlightPlace` is wrong: No highlight shown (graceful degradation)
- Invalid `initialMode`: Defaults to "learn"
- Empty `additionalProps`: Uses all built-in defaults from NCERT content
- Missing `practiceQuestions`: Uses built-in quiz questions