# Decimal Addition & Subtraction Tool — Agent Instructions

## Overview

Interactive educational tool for teaching decimal addition and subtraction, based on **NCERT Ganita Prakash Grade 7, Chapter 3.7**. Features animated column-wise computation, place value alignment visualization, practice with scoring, and real-world applications (cloth measurement, grocery weight, milk supply).

## Quick Reference Table

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `initialMode` | `"learn" \| "practice" \| "real_world"` | `"learn"` | Starting mode |
| `showModeSelector` | `boolean` | `true` | Show/hide mode tabs |
| `enabledModes` | `string[]` | `["learn","practice","real_world"]` | Active modes |
| `filterSteps` | `number[]` | `null` | Show only specific step IDs |
| `autoPlayDuration` | `number` | `10000` | Auto-advance ms (0 = off) |
| `themeColor` | `string` | `"#3b82f6"` | Primary color |
| `animationSpeed` | `number` | `1` | Animation speed multiplier |

## additionalProps Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `number1` | `number` | step default | First operand |
| `number2` | `number` | step default | Second operand |
| `operation` | `"add" \| "subtract"` | `"add"` | Operation type |
| `showPlaceValue` | `boolean` | `true` | Show place value breakdown |
| `highlightDecimalPoint` | `boolean` | `true` | Highlight decimal alignment |
| `difficulty` | `"easy" \| "medium" \| "hard"` | `"medium"` | Practice difficulty |
| `realWorldContext` | `"shopping" \| "measurement" \| "weight" \| "money"` | - | Real-world theme |
| `unit` | `string` | - | Unit label (m, kg, L, etc.) |
| `currency` | `string` | `"₹"` | Currency symbol |

## Step IDs

### Learn Mode
| ID | Title | Focus |
|----|-------|-------|
| 1 | Adding Decimals — Basics | Decimal point alignment |
| 2 | Place Value Alignment | Units, tenths, hundredths |
| 3 | Carrying Over | Carry when column sum ≥ 10 |
| 4 | Subtracting Decimals | Subtraction with alignment |
| 5 | Borrowing in Decimals | Borrowing from next column |

### Practice Mode
| ID | Problem | Difficulty |
|----|---------|-----------|
| 10 | 5.3 + 2.6 | Easy |
| 11 | 9.01 + 9.10 | Medium |
| 12 | 5.6 − 2.3 | Easy |
| 13 | 18 − 8.8 | Medium |
| 14 | 6.236 + 0.487 | Hard |

### Real World Mode
| ID | Title | Context |
|----|-------|---------|
| 20 | Cloth Shopping (2.7m + 3.5m) | measurement |
| 21 | Grocery Shopping (0.25kg + 0.3kg) | weight |
| 22 | Weight Change (35.75kg − 34.50kg) | weight |
| 23 | Milk Supply (3.79L + 4.2L) | measurement |

---

## Tool Call Examples

### Example 1: Default Learn Mode
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Adding and Subtracting Decimals",
    "data": {
        "toolName": "decimal_add_sub_tool",
        "parameters": {}
    },
    "instructions_for_student": "Let's learn how to add and subtract decimal numbers step by step!"
}
```

### Example 2: Specific Addition Problem
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Adding 75.345 + 86.691",
    "data": {
        "toolName": "decimal_add_sub_tool",
        "parameters": {
            "initialMode": "learn",
            "filterSteps": [3],
            "showModeSelector": false,
            "additionalProps": {
                "number1": 75.345,
                "number2": 86.691,
                "operation": "add",
                "highlightDecimalPoint": true
            }
        }
    },
    "instructions_for_student": "Watch how we add column by column, carrying over when needed!"
}
```

### Example 3: Subtraction with Borrowing
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Subtracting Decimals",
    "data": {
        "toolName": "decimal_add_sub_tool",
        "parameters": {
            "initialMode": "learn",
            "filterSteps": [5],
            "additionalProps": {
                "number1": 10.4,
                "number2": 4.5,
                "operation": "subtract"
            }
        }
    },
    "instructions_for_student": "When the top digit is smaller, we borrow from the next column."
}
```

### Example 4: Practice Mode Only
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Practice Decimal Addition & Subtraction",
    "data": {
        "toolName": "decimal_add_sub_tool",
        "parameters": {
            "initialMode": "practice",
            "enabledModes": ["practice"],
            "showModeSelector": false,
            "autoPlayDuration": 0
        }
    },
    "instructions_for_student": "Try solving these problems! Type your answer and click Check."
}
```

### Example 5: Real-World Cloth Problem
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Cloth Shopping Problem",
    "data": {
        "toolName": "decimal_add_sub_tool",
        "parameters": {
            "initialMode": "real_world",
            "filterSteps": [20],
            "showModeSelector": false,
            "additionalProps": {
                "realWorldContext": "measurement",
                "unit": "m"
            }
        }
    },
    "instructions_for_student": "Priya needs 2.7m for her skirt and Shylaja needs 3.5m. How much cloth in total?"
}
```

### Example 6: Weight Tracking
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Tinku's Weight Change",
    "data": {
        "toolName": "decimal_add_sub_tool",
        "parameters": {
            "initialMode": "real_world",
            "filterSteps": [22],
            "additionalProps": {
                "realWorldContext": "weight",
                "unit": "kg"
            }
        }
    },
    "instructions_for_student": "Tinku weighed 35.75 kg in January and 34.50 kg in February. Let's find the change!"
}
```

### Example 7: Custom Numbers (Agent-Driven)
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Custom Decimal Addition",
    "data": {
        "toolName": "decimal_add_sub_tool",
        "parameters": {
            "initialMode": "learn",
            "filterSteps": [1],
            "showModeSelector": false,
            "showNavigation": false,
            "autoPlayDuration": 0,
            "additionalProps": {
                "number1": 29.19,
                "number2": 9.91,
                "operation": "add"
            }
        }
    },
    "instructions_for_student": "Let's add 29.19 and 9.91 together!"
}
```

### Example 8: All Real-World Problems
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Decimals in Daily Life",
    "data": {
        "toolName": "decimal_add_sub_tool",
        "parameters": {
            "initialMode": "real_world",
            "enabledModes": ["real_world"],
            "showModeSelector": false
        }
    },
    "instructions_for_student": "See how decimals are used in real life — shopping, cooking, and more!"
}
```

### Example 9: Minimal Display for Embedding
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Quick Add",
    "data": {
        "toolName": "decimal_add_sub_tool",
        "parameters": {
            "showModeSelector": false,
            "showNavigation": false,
            "showPlayPause": false,
            "showStepIndicator": false,
            "autoPlayDuration": 0,
            "filterSteps": [1],
            "additionalProps": {
                "number1": 0.75,
                "number2": 0.03,
                "operation": "add"
            }
        }
    }
}
```

### Example 10: Money Context
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Adding Prices",
    "data": {
        "toolName": "decimal_add_sub_tool",
        "parameters": {
            "initialMode": "real_world",
            "filterSteps": [20],
            "additionalProps": {
                "realWorldContext": "money",
                "currency": "₹",
                "number1": 49.75,
                "number2": 32.50,
                "operation": "add"
            }
        }
    },
    "instructions_for_student": "How much do both items cost together?"
}
```

---

## Decision Tree for Agents

```
Student asks about decimals/addition/subtraction
    │
    ├─ "How to add decimals?" / "Explain decimal addition"
    │   └─ Use: initialMode: "learn", steps [1,2,3]
    │
    ├─ "How to subtract decimals?"
    │   └─ Use: initialMode: "learn", steps [4,5]
    │
    ├─ "Add X + Y" or specific numbers
    │   └─ Use: additionalProps: { number1: X, number2: Y, operation: "add" }
    │
    ├─ "Subtract X - Y"
    │   └─ Use: additionalProps: { number1: X, number2: Y, operation: "subtract" }
    │
    ├─ "Give me practice problems"
    │   └─ Use: initialMode: "practice"
    │
    ├─ "Real-world examples" / "Where are decimals used?"
    │   └─ Use: initialMode: "real_world"
    │
    ├─ "Cloth/measurement problem"
    │   └─ Use: filterSteps: [20], realWorldContext: "measurement"
    │
    ├─ "Shopping/money problem"
    │   └─ Use: realWorldContext: "money", currency: "₹"
    │
    └─ "Weight problem"
        └─ Use: filterSteps: [22], realWorldContext: "weight"
```

---

## Tips for Agents

1. **For specific computations**: Pass `number1`, `number2`, `operation` via additionalProps
2. **For focused teaching**: Use `filterSteps` to show only relevant steps
3. **For minimal UI**: Set `showModeSelector: false, showNavigation: false`
4. **For static display**: Set `autoPlayDuration: 0`
5. **For practice only**: Set `enabledModes: ["practice"]`
6. **For real-world context**: Always set both `realWorldContext` and `unit`
7. **Column animation speed**: Adjust `animationSpeed` (0.5 = slow, 2 = fast)

## Error Handling

- If `number1` / `number2` not provided: Falls back to step default data
- Invalid `initialMode`: Defaults to "learn"
- Empty `filterSteps`: Shows all steps for current mode
- Numbers with > 3 decimal places: Displayed correctly but may be wide