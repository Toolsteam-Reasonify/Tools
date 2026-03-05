# Decimal Number Line Tool — Agent Instructions

## Overview

Interactive tool for teaching **locating and comparing decimal numbers** on a number line, based on **NCERT Ganita Prakash Grade 7, Chapter 3 (Section 3.6)** — *A Peek Beyond the Point*.

Covers tenths, hundredths, thousandths; zooming into number line segments; comparing decimals digit-by-digit; the "trailing zeros" rule; and real-world contexts (rulers, medicine, money).

---

## Quick Reference Table

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `initialMode` | `"learn" \| "practice" \| "real_world"` | `"learn"` | Starting mode |
| `showModeSelector` | boolean | `true` | Show/hide mode tabs |
| `showNavigation` | boolean | `true` | Show/hide prev/next |
| `filterSteps` | number[] | `null` | Only show these step IDs |
| `autoPlayDuration` | number | `8000` | Auto-advance ms (0=off) |
| `themeColor` | string | `"#3b82f6"` | Primary color |
| `additionalProps.minValue` | number | `0` | Line minimum |
| `additionalProps.maxValue` | number | `10` | Line maximum |
| `additionalProps.step` | number | `1` | Tick interval |
| `additionalProps.decimalPrecision` | number | `1` | Decimal places shown |
| `additionalProps.highlightNumbers` | number[] | `[]` | Highlight these values |
| `additionalProps.activeNumber` | number | `null` | Active/selected value |
| `additionalProps.compareNumbers` | number[] | `[]` | Two values to compare |
| `additionalProps.customMarkers` | object[] | `[]` | Custom labeled flags |

---

## additionalProps Reference

```typescript
interface DecimalNLAdditionalProps {
    minValue?: number;          // Minimum on number line
    maxValue?: number;          // Maximum on number line
    step?: number;              // Interval between ticks
    decimalPrecision?: number;  // 1=tenths, 2=hundredths, 3=thousandths
    numbers?: number[];         // Custom number array (overrides range)
    highlightNumbers?: number[];// Highlighted with accent color
    activeNumber?: number;      // Filled circle marker
    compareNumbers?: number[];  // Two numbers shown with comparison arc
    showZoom?: boolean;         // Zoom magnifier effect
    zoomRange?: { from: number; to: number };
    customMarkers?: { position: number; label: string; color: string }[];
    lineColor?: string;         // Main line color
    showLabels?: boolean;       // Number labels
    showTicks?: boolean;        // Tick marks
    showSubTicks?: boolean;     // Sub-ticks between main ticks
}
```

---

## Tool Call Examples

### Example 1: Default — Learn Mode
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Locating Decimals",
    "data": {
        "toolName": "decimal_number_line_tool",
        "parameters": {
            "initialMode": "learn"
        }
    },
    "instructions_for_student": "Let's learn how to find decimal numbers on a number line!"
}
```

### Example 2: Show Tenths between 1 and 2
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Tenths Between 1 and 2",
    "data": {
        "toolName": "decimal_number_line_tool",
        "parameters": {
            "initialMode": "learn",
            "filterSteps": [2],
            "additionalProps": {
                "minValue": 1,
                "maxValue": 2,
                "step": 0.1,
                "decimalPrecision": 1,
                "highlightNumbers": [1.4],
                "activeNumber": 1.4
            }
        }
    },
    "instructions_for_student": "1.4 is located 4 small parts after 1!"
}
```

### Example 3: Zoom into Hundredths
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Hundredths — Zooming In",
    "data": {
        "toolName": "decimal_number_line_tool",
        "parameters": {
            "initialMode": "learn",
            "filterSteps": [3],
            "additionalProps": {
                "minValue": 1.0,
                "maxValue": 1.1,
                "step": 0.01,
                "decimalPrecision": 2,
                "highlightNumbers": [1.04],
                "activeNumber": 1.04
            }
        }
    },
    "instructions_for_student": "Between 1.0 and 1.1 there are 10 hundredths!"
}
```

### Example 4: Compare Two Decimals
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Which is Greater?",
    "data": {
        "toolName": "decimal_number_line_tool",
        "parameters": {
            "initialMode": "learn",
            "filterSteps": [4],
            "additionalProps": {
                "minValue": 6.4,
                "maxValue": 6.5,
                "step": 0.01,
                "decimalPrecision": 3,
                "compareNumbers": [6.456, 6.465]
            }
        }
    },
    "instructions_for_student": "Compare digit by digit: 6.465 > 6.456 because 6 hundredths > 5 hundredths."
}
```

### Example 5: Practice — Locate a Decimal
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Find the Decimal",
    "data": {
        "toolName": "decimal_number_line_tool",
        "parameters": {
            "initialMode": "practice",
            "filterSteps": [10]
        }
    },
    "instructions_for_student": "Tap where 1.7 should be on the number line!"
}
```

### Example 6: Practice — Order Decimals
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Sort These Decimals",
    "data": {
        "toolName": "decimal_number_line_tool",
        "parameters": {
            "initialMode": "practice",
            "filterSteps": [13]
        }
    },
    "instructions_for_student": "Remember: 2.005 < 2.05 < 2.5 = 2.50. Trailing zeros don't change the value!"
}
```

### Example 7: Practice — Closest to Target
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Closest to 1",
    "data": {
        "toolName": "decimal_number_line_tool",
        "parameters": {
            "initialMode": "practice",
            "filterSteps": [14]
        }
    },
    "instructions_for_student": "Think about distance from 1. 1.01 is only 0.01 away!"
}
```

### Example 8: Real World — Ruler
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Ruler & Decimals",
    "data": {
        "toolName": "decimal_number_line_tool",
        "parameters": {
            "initialMode": "real_world",
            "filterSteps": [20],
            "additionalProps": {
                "minValue": 0,
                "maxValue": 5,
                "step": 0.1,
                "decimalPrecision": 1,
                "highlightNumbers": [3.4],
                "customMarkers": [
                    { "position": 3.4, "label": "Pencil", "color": "#f59e0b" }
                ]
            }
        }
    },
    "instructions_for_student": "A ruler's mm marks are tenths of a centimetre!"
}
```

### Example 9: Real World — Medicine Dosage
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Decimal Point in Medicine",
    "data": {
        "toolName": "decimal_number_line_tool",
        "parameters": {
            "initialMode": "real_world",
            "filterSteps": [21]
        }
    },
    "instructions_for_student": "0.05 mg ≠ 0.5 mg! The decimal point position matters in healthcare."
}
```

### Example 10: Custom Decimal Range with Markers
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Custom Decimal Exploration",
    "data": {
        "toolName": "decimal_number_line_tool",
        "parameters": {
            "showModeSelector": false,
            "showNavigation": false,
            "autoPlayDuration": 0,
            "additionalProps": {
                "minValue": 0,
                "maxValue": 1,
                "step": 0.1,
                "decimalPrecision": 1,
                "highlightNumbers": [0.5],
                "customMarkers": [
                    { "position": 0.5, "label": "Half", "color": "#10b981" },
                    { "position": 0.25, "label": "Quarter", "color": "#f59e0b" }
                ]
            }
        }
    },
    "instructions_for_student": "0.5 is the same as 1/2, and 0.25 is the same as 1/4!"
}
```

---

## Decision Tree for Agents

```
Student asks about decimals on number line
    │
    ├─ "What is 1.4 on a number line?"
    │   └─ Use: learn mode, filterSteps: [1], additionalProps with highlight
    │
    ├─ "How do hundredths work?"
    │   └─ Use: learn mode, filterSteps: [3], zoom into a tenth
    │
    ├─ "Which is bigger: X or Y?"
    │   └─ Use: learn mode, filterSteps: [4], compareNumbers: [X, Y]
    │
    ├─ "Is 0.2 the same as 0.20?"
    │   └─ Use: learn mode, filterSteps: [5], zero demo
    │
    ├─ "Practice decimal problems"
    │   └─ Use: initialMode: "practice"
    │
    ├─ "Where do we use decimals?"
    │   └─ Use: initialMode: "real_world"
    │
    └─ "Show me decimals between A and B"
        └─ Use: additionalProps: { minValue: A, maxValue: B, step: (B-A)/10 }
```

---

## Step IDs Reference

| ID | Mode | Title |
|----|------|-------|
| 1 | learn | Decimals on a Number Line |
| 2 | learn | Zooming In — Tenths |
| 3 | learn | Zooming In Further — Hundredths |
| 4 | learn | Comparing Decimals |
| 5 | learn | The Zero Trick |
| 10 | practice | Locate the Decimal! |
| 11 | practice | Which is Bigger? |
| 12 | practice | Locate the Hundredth! |
| 13 | practice | Order These Decimals |
| 14 | practice | Closest to 1? |
| 20 | real_world | Measuring with a Ruler |
| 21 | real_world | Medicine Dosage Matters! |
| 22 | real_world | Price Tags & Money |

---

## Tips for Agents

1. **For single concept focus**: Use `filterSteps` to show only relevant step(s)
2. **For minimal UI**: Set `showModeSelector: false`, `showNavigation: false`
3. **For static display**: Set `autoPlayDuration: 0`
4. **For comparisons**: Use `compareNumbers` with two decimal values
5. **For custom ranges**: Always set both `minValue`, `maxValue`, and appropriate `step`
6. **For precision**: Set `decimalPrecision` to match the concept (1 for tenths, 2 for hundredths)
7. **For highlighting**: Use `highlightNumbers` array + optionally `activeNumber` for emphasis

---

## Error Handling

- If `highlightNumbers` values are outside range: They won't render
- If `compareNumbers` has values outside range: Comparison arc won't show
- Invalid `initialMode`: Defaults to `"learn"`
- Empty `additionalProps`: Uses default 0–10 number line
- If `step` is 0 or negative: Falls back to 1