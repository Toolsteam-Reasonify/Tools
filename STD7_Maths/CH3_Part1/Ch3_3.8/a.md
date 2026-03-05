# Decimal Place Value Tool — Agent Instructions

## Overview
Interactive educational tool for teaching decimal numbers, place value, unit conversions, and decimal operations. Based on **NCERT Ganita Prakash Grade 7, Chapter 3: A Peek Beyond the Point**.

Covers: tenths, hundredths, thousandths, decimal notation, reading decimals, addition/subtraction of decimals, comparing decimals, decimal sequences, and real-world unit conversions (mm↔cm, cm↔m, g↔kg, paise↔rupee).

---

## Quick Reference Table

| What student asks | Mode | Key parameters |
|---|---|---|
| "What is a decimal?" | learn | `initialMode: "learn"` |
| "Explain place value of 7.05" | learn | `additionalProps: { decimalNumber: 7.05 }` |
| "What is the tenths place?" | learn | `additionalProps: { decimalNumber: 2.7, highlightPlace: "tenths" }` |
| "Quiz me on decimals" | practice | `initialMode: "practice"` |
| "How to convert mm to cm?" | real_world | `filterSteps: [20]` |
| "Convert 254g to kg" | real_world | `filterSteps: [22]` |
| "Show me decimal disasters" | real_world | `filterSteps: [24]` |
| "Add 5.3 + 2.6" | learn | `filterSteps: [6]` |

---

## additionalProps Reference

| Property | Type | Default | Description |
|---|---|---|---|
| `decimalNumber` | number | — | Decimal number to visualize in place value table |
| `showPlaceValueTable` | boolean | true | Show/hide place value table |
| `highlightPlace` | string | — | Highlight a column: `ones`, `tenths`, `hundredths`, `thousandths`, `tens`, `hundreds` |
| `conversionType` | string | — | Unit conversion: `mm_cm`, `cm_m`, `g_kg`, `paise_rupee` |
| `conversionValue` | number | — | Value to convert |
| `compareNumbers` | [number, number] | — | Two decimals to compare |
| `sequenceStart` | number | — | Start of a decimal sequence |
| `sequenceStep` | number | — | Step increment for sequence |
| `fractionNumerator` | number | — | Numerator for fraction→decimal |
| `fractionDenominator` | number | — | Denominator (10, 100, 1000) |

---

## Tool Call Examples

### Example 1: Full Interactive Lesson
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Learn Decimals",
    "data": {
        "toolName": "decimal_place_value_tool",
        "parameters": {
            "initialMode": "learn",
            "showModeSelector": true
        }
    },
    "instructions_for_student": "Let's explore decimal numbers step by step!"
}
```

### Example 2: Explain Place Value of a Specific Number
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Place Value of 70.5",
    "data": {
        "toolName": "decimal_place_value_tool",
        "parameters": {
            "initialMode": "learn",
            "filterSteps": [2],
            "showModeSelector": false,
            "additionalProps": {
                "decimalNumber": 70.5,
                "highlightPlace": "tenths"
            }
        }
    },
    "instructions_for_student": "The 5 is in the tenths place — it means 5 × 1/10!"
}
```

### Example 3: Highlight Hundredths Place
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Understanding Hundredths",
    "data": {
        "toolName": "decimal_place_value_tool",
        "parameters": {
            "initialMode": "learn",
            "filterSteps": [4],
            "additionalProps": {
                "decimalNumber": 4.45,
                "highlightPlace": "hundredths"
            }
        }
    },
    "instructions_for_student": "The 5 in 4.45 is in the hundredths place — it means 5 × 1/100."
}
```

### Example 4: Practice Quiz Only
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Decimal Practice Quiz",
    "data": {
        "toolName": "decimal_place_value_tool",
        "parameters": {
            "initialMode": "practice",
            "showModeSelector": false,
            "autoPlayDuration": 0
        }
    },
    "instructions_for_student": "Test your knowledge of decimals!"
}
```

### Example 5: Unit Conversion — Grams to Kilograms
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Converting Grams to Kilograms",
    "data": {
        "toolName": "decimal_place_value_tool",
        "parameters": {
            "initialMode": "real_world",
            "filterSteps": [22],
            "showModeSelector": false,
            "additionalProps": {
                "conversionType": "g_kg",
                "conversionValue": 254
            }
        }
    },
    "instructions_for_student": "254 g = 0.254 kg. That's 2 tenths, 5 hundredths, and 4 thousandths of a kilogram!"
}
```

### Example 6: Money — Paise to Rupees
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Paise and Rupees",
    "data": {
        "toolName": "decimal_place_value_tool",
        "parameters": {
            "initialMode": "real_world",
            "filterSteps": [23],
            "showModeSelector": false
        }
    },
    "instructions_for_student": "75 paise = ₹0.75. In the 1970s, a dosa cost just 50 paise!"
}
```

### Example 7: Decimal Disasters — Real World Consequences
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "When Decimals Go Wrong!",
    "data": {
        "toolName": "decimal_place_value_tool",
        "parameters": {
            "initialMode": "real_world",
            "filterSteps": [24],
            "showModeSelector": false,
            "autoPlayDuration": 0
        }
    },
    "instructions_for_student": "Decimal mistakes can cause real disasters — always double check your decimal point!"
}
```

### Example 8: Adding Decimals Lesson
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Adding Decimal Numbers",
    "data": {
        "toolName": "decimal_place_value_tool",
        "parameters": {
            "initialMode": "learn",
            "filterSteps": [6],
            "showModeSelector": false
        }
    },
    "instructions_for_student": "Line up the decimal points and add column by column — just like whole numbers!"
}
```

### Example 9: Thousandths Deep Dive
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Understanding Thousandths",
    "data": {
        "toolName": "decimal_place_value_tool",
        "parameters": {
            "initialMode": "learn",
            "filterSteps": [5],
            "additionalProps": {
                "decimalNumber": 0.274,
                "highlightPlace": "thousandths"
            }
        }
    },
    "instructions_for_student": "0.274 has 2 tenths, 7 hundredths, and 4 thousandths. We read it digit by digit after the point!"
}
```

### Example 10: Length Conversion — mm to cm
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Millimeters to Centimeters",
    "data": {
        "toolName": "decimal_place_value_tool",
        "parameters": {
            "initialMode": "real_world",
            "filterSteps": [20],
            "showModeSelector": false
        }
    },
    "instructions_for_student": "12 mm = 1.2 cm. A human hair is about 0.1 mm = 0.01 cm thick!"
}
```

---

## Decision Tree for Agents

```
Student asks about decimals
    │
    ├─ "What is a decimal / place value?"
    │   └─ Use: initialMode: "learn", steps 1-2
    │
    ├─ "Explain tenths / hundredths / thousandths"
    │   └─ Use: filterSteps [3], [4], or [5] with highlightPlace
    │
    ├─ "Show place value of [X]"
    │   └─ Use: additionalProps.decimalNumber: X
    │
    ├─ "How to add/subtract decimals?"
    │   └─ Use: filterSteps [6] or [7]
    │
    ├─ "Quiz me" / "Practice"
    │   └─ Use: initialMode: "practice"
    │
    ├─ "Convert [X] mm/cm/g/paise"
    │   └─ Use: initialMode: "real_world", appropriate filterSteps
    │
    ├─ "Real world examples"
    │   └─ Use: initialMode: "real_world"
    │
    └─ "Why do decimals matter?"
        └─ Use: filterSteps: [24] (Decimal Disasters)
```

---

## Parameter Details

### Mode IDs
- **learn** (Steps 1-7): Intro, place value, tenths, hundredths, thousandths, addition, subtraction
- **practice** (Steps 10-15): Place value quiz, fraction conversion, add/subtract, compare, sequence
- **real_world** (Steps 20-24): mm↔cm, cm↔m, g↔kg, paise↔rupee, decimal disasters

### Content Source
All content is based on **NCERT Ganita Prakash Grade 7, Chapter 3 — "A Peek Beyond the Point"** (Sections 3.1–3.8), covering:
- Need for smaller units of measurement
- Tenths, hundredths, thousandths
- Decimal place value system
- Reading and writing decimal notation
- Addition and subtraction of decimals
- Comparing and ordering decimals
- Decimal sequences
- Unit conversions (mm, cm, m, g, kg, paise, rupees)
- Real-world decimal applications and disasters

---

## Error Handling
- If `additionalProps.decimalNumber` is not provided, default step data is used
- Invalid `initialMode` defaults to "learn"
- Empty `filterSteps` shows all steps for the current mode
- If `highlightPlace` doesn't match any digit position, no highlight is shown