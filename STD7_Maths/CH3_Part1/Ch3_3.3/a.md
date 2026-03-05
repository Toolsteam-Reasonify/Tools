# Hundredths Decimal Tool — Agent Instructions

## Overview

Interactive educational tool for **NCERT Ganita Prakash Grade 7, Chapter 3.3 — A Hundredth Part**. Teaches students about hundredths in the decimal place value system through animated 10×10 grids, zoom visualizations, place value tables, and real-world examples.

**Curriculum**: NCERT / NCF 2023, Grade 7 Mathematics  
**Chapter**: 3 — A Peek Beyond the Point  
**Topic**: 3.3 A Hundredth Part (extends to 3.4 Decimal Place Value and 3.5 Units of Measurement)

---

## Quick Reference Table

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `initialMode` | `'learn' \| 'practice' \| 'real_world'` | `'learn'` | Starting mode |
| `showModeSelector` | `boolean` | `true` | Show/hide mode tabs |
| `enabledModes` | `ModeType[]` | `['learn', 'practice', 'real_world']` | Active modes |
| `showNavigation` | `boolean` | `true` | Show prev/next buttons |
| `filterSteps` | `number[]` | `null` | Only show specific step IDs |
| `autoPlayDuration` | `number` | `10000` | Auto-advance delay (ms), 0 to disable |
| `themeColor` | `string` | `'#2563eb'` | Primary color |
| `additionalProps.highlightCount` | `number` | `45` | Cells highlighted in 100-grid |
| `additionalProps.tenths` | `number` | `4` | Tenths digit |
| `additionalProps.hundredths` | `number` | `5` | Hundredths digit |
| `additionalProps.showConversion` | `boolean` | `false` | Show unit conversion |

---

## Modes

### Learn Mode (Steps 1-5)
Covers: Why we need hundredths → Splitting tenths into hundredths → Reading hundredths notation → The 10-100-1000 connection → Addition with hundredths (with carry-over).

### Practice Mode (Steps 10-14)
Questions: Count hundredths on grid → Convert tenths to hundredths → Add with hundredths → Compare hundredths → Subtract with hundredths. Multiple-choice with animated feedback.

### Real World Mode (Steps 20-23)
Examples: Money (₹ and paise) → Length (cm and m) → Weight (g and kg) → Decimal disasters (real incidents).

---

## additionalProps Reference

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `wholeUnits` | `number` | `0` | Whole units to display |
| `tenths` | `number` | `4` | Tenths digit (0-9) |
| `hundredths` | `number` | `5` | Hundredths digit (0-9) |
| `showGrid` | `boolean` | `true` | Show the 10×10 grid |
| `highlightCount` | `number` | `45` | Number of cells to shade |
| `zoomLevel` | `'unit' \| 'tenth' \| 'hundredth'` | `'hundredth'` | Zoom level |
| `showConversion` | `boolean` | `false` | Show conversion examples |
| `conversionValue` | `string` | - | Value to convert |
| `conversionTarget` | `'tenths' \| 'hundredths' \| 'decimal'` | - | Target format |

---

## Tool Call Examples

### Example 1: Default — Full Learning Experience
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Hundredths in the Decimal System",
  "data": {
    "toolName": "hundredths_decimal_tool",
    "parameters": {}
  },
  "instructions_for_student": "Let's explore hundredths! Start with the Learn mode."
}
```

### Example 2: Start in Practice Mode
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Practice: Hundredths",
  "data": {
    "toolName": "hundredths_decimal_tool",
    "parameters": {
      "initialMode": "practice",
      "showModeSelector": true
    }
  },
  "instructions_for_student": "Time to test your understanding of hundredths!"
}
```

### Example 3: Show Specific Hundredths (e.g., 73 hundredths)
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Visualizing 73 Hundredths",
  "data": {
    "toolName": "hundredths_decimal_tool",
    "parameters": {
      "initialMode": "learn",
      "filterSteps": [3],
      "showModeSelector": false,
      "additionalProps": {
        "highlightCount": 73,
        "tenths": 7,
        "hundredths": 3
      }
    }
  },
  "instructions_for_student": "This grid shows 73 hundredths — that's 7 tenths and 3 hundredths!"
}
```

### Example 4: Money — Real World Only
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Rupees and Paise",
  "data": {
    "toolName": "hundredths_decimal_tool",
    "parameters": {
      "initialMode": "real_world",
      "filterSteps": [20],
      "showModeSelector": false,
      "autoPlayDuration": 0,
      "additionalProps": {
        "showConversion": true,
        "conversionValue": "75 paise",
        "conversionTarget": "decimal"
      }
    }
  },
  "instructions_for_student": "100 paise = 1 rupee, so each paisa is 1 hundredth of a rupee!"
}
```

### Example 5: Only Learn Mode Steps
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Understanding Hundredths",
  "data": {
    "toolName": "hundredths_decimal_tool",
    "parameters": {
      "enabledModes": ["learn"],
      "showModeSelector": false,
      "autoPlayDuration": 12000
    }
  },
  "instructions_for_student": "Watch and learn about hundredths step by step!"
}
```

### Example 6: Zoom into Tenths → Hundredths
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Zooming into Hundredths",
  "data": {
    "toolName": "hundredths_decimal_tool",
    "parameters": {
      "initialMode": "learn",
      "filterSteps": [2],
      "showModeSelector": false,
      "autoPlayDuration": 0,
      "additionalProps": {
        "zoomLevel": "hundredth"
      }
    }
  },
  "instructions_for_student": "Watch how a tenth splits into 10 hundredths!"
}
```

### Example 7: Decimal Disasters — Real World
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Decimal Disasters!",
  "data": {
    "toolName": "hundredths_decimal_tool",
    "parameters": {
      "initialMode": "real_world",
      "filterSteps": [23],
      "showModeSelector": false,
      "autoPlayDuration": 0
    }
  },
  "instructions_for_student": "See what happens when people make decimal mistakes in real life!"
}
```

### Example 8: Addition with Hundredths
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Adding with Hundredths",
  "data": {
    "toolName": "hundredths_decimal_tool",
    "parameters": {
      "initialMode": "learn",
      "filterSteps": [5],
      "showModeSelector": false,
      "autoPlayDuration": 0
    }
  },
  "instructions_for_student": "Learn how to add numbers that have hundredths, with carry-over!"
}
```

### Example 9: Weight Conversion — Real World
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Grams and Kilograms",
  "data": {
    "toolName": "hundredths_decimal_tool",
    "parameters": {
      "initialMode": "real_world",
      "filterSteps": [22],
      "showModeSelector": false,
      "autoPlayDuration": 0,
      "additionalProps": {
        "showConversion": true,
        "conversionValue": "254 g",
        "conversionTarget": "decimal"
      }
    }
  },
  "instructions_for_student": "254 grams = 0.254 kg. The hundredths digit tells us the tens of grams!"
}
```

### Example 10: Dark Mode
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Hundredths Explorer (Dark)",
  "data": {
    "toolName": "hundredths_decimal_tool",
    "parameters": {
      "darkMode": true,
      "themeColor": "#6366f1"
    }
  },
  "instructions_for_student": "Explore hundredths in dark mode!"
}
```

---

## Decision Tree for Agents

```
Student asks about decimals/hundredths
    │
    ├─ "What are hundredths?"
    │   └─ Use: initialMode: "learn", steps 1-4
    │
    ├─ "Show me X hundredths" (e.g., 45 hundredths)
    │   └─ Use: filterSteps: [3], additionalProps: { highlightCount: X, tenths: floor(X/10), hundredths: X%10 }
    │
    ├─ "How do tenths and hundredths relate?"
    │   └─ Use: filterSteps: [2, 4], initialMode: "learn"
    │
    ├─ "How to add/subtract decimals with hundredths?"
    │   └─ Use: filterSteps: [5], initialMode: "learn"
    │
    ├─ "Practice hundredths problems"
    │   └─ Use: initialMode: "practice"
    │
    ├─ "How many paise in a rupee?" / "Convert cm to m"
    │   └─ Use: initialMode: "real_world", filterSteps: [20] or [21]
    │
    ├─ "What happens with decimal mistakes?"
    │   └─ Use: initialMode: "real_world", filterSteps: [23]
    │
    └─ "Compare X/10 vs X/100"
        └─ Use: initialMode: "practice", filterSteps: [13]
```

---

## Tips for Agents

1. **For specific visualization**: Use `additionalProps.highlightCount` to shade exact number of hundredths
2. **For concept intro**: Start with Learn mode steps 1-2 (why hundredths, zoom visualization)
3. **For unit conversions**: Use Real World mode — money (step 20), length (step 21), weight (step 22)
4. **For practice**: Practice mode has 5 varied question types — count, convert, add, compare, subtract
5. **For static display**: Set `autoPlayDuration: 0` and `showNavigation: false`
6. **For minimal UI**: Set `showModeSelector: false` + `filterSteps` for focused content
7. **Color coding**: Blue = tenths, Purple = hundredths, Green = units (consistent throughout)

---

## Error Handling

- Invalid `highlightCount` (>100): Caps at 100
- Invalid `initialMode`: Defaults to "learn"
- Empty `additionalProps`: Uses default 45 hundredths visualization
- `filterSteps` with non-existent IDs: Shows empty, falls back to first available step