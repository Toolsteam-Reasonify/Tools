# Units of Measurement Tool - Agent Instructions

## Overview

Interactive educational tool for NCERT Ganita Prakash Grade 7, Chapter 3 ("A Peek Beyond the Point"), Section 3.5 — **Units of Measurement**. Teaches unit conversions using decimal notation: mm↔cm, cm↔m, g↔kg, rupees↔paise, with animated visuals, practice quizzes, and real-world examples.

---

## Quick Reference Table

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `initialMode` | `'learn' \| 'practice' \| 'real_world'` | `'learn'` | Starting mode |
| `showModeSelector` | `boolean` | `true` | Show/hide mode tabs |
| `enabledModes` | `ModeType[]` | All 3 | Which modes are available |
| `filterSteps` | `number[]` | `null` | Only show specific step IDs |
| `autoPlayDuration` | `number` | `10000` | Auto-advance delay (0 to disable) |
| `themeColor` | `string` | `'#2563eb'` | Primary colour |
| `additionalProps.conversionType` | `string` | — | `'mm_cm'`, `'cm_m'`, `'g_kg'`, `'rupee_paise'` |
| `additionalProps.fromValue` | `number` | — | Value to convert |
| `additionalProps.customConversions` | `array` | — | Custom conversion pairs |
| `additionalProps.showRealWorldContext` | `string` | — | `'tiny_things'`, `'sea_creatures'`, `'disasters'`, `'rice_weights'` |

---

## Step IDs Reference

### Learn Mode
| ID | Title |
|----|-------|
| 1 | Why Do We Need Unit Conversions? |
| 2 | Millimetres ↔ Centimetres |
| 3 | Centimetres ↔ Metres |
| 4 | Grams ↔ Kilograms |
| 5 | Rupees ↔ Paise |

### Practice Mode
| ID | Title |
|----|-------|
| 10 | Convert mm to cm |
| 11 | Convert cm to m |
| 12 | Convert g to kg |
| 13 | Mixed Conversions |

### Real World Mode
| ID | Title |
|----|-------|
| 20 | How Small Is a Hair? |
| 21 | Tiny Ocean Creatures |
| 22 | Decimal Disasters! |
| 23 | Rice Weights Visualised |

---

## additionalProps Reference

```typescript
interface UnitConversionAdditionalProps {
    conversionType?: 'mm_cm' | 'cm_m' | 'g_kg' | 'rupee_paise' | 'mg_g' | 'mm_m';
    fromValue?: number;
    toValue?: number;
    fromUnit?: string;
    toUnit?: string;
    showScale?: boolean;
    highlightConversion?: boolean;
    customConversions?: {
        from: number;
        fromUnit: string;
        to: number;
        toUnit: string;
        label?: string;
    }[];
    showRealWorldContext?: string;
    animateConversion?: boolean;
}
```

---

## Tool Call Examples (with additionalProps)

### Example 1: Full Tool (Default)
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Units of Measurement",
    "data": {
        "toolName": "units_of_measurement_tool",
        "parameters": {}
    },
    "instructions_for_student": "Explore how mm, cm, m, g, and kg relate using decimals!"
}
```

### Example 2: Start in Practice Mode
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Practice Unit Conversions",
    "data": {
        "toolName": "units_of_measurement_tool",
        "parameters": {
            "initialMode": "practice",
            "showModeSelector": true,
            "autoPlayDuration": 0
        }
    },
    "instructions_for_student": "Test your conversion skills!"
}
```

### Example 3: Only mm ↔ cm Lesson
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Millimetres to Centimetres",
    "data": {
        "toolName": "units_of_measurement_tool",
        "parameters": {
            "initialMode": "learn",
            "filterSteps": [1, 2],
            "showModeSelector": false,
            "additionalProps": {
                "conversionType": "mm_cm"
            }
        }
    },
    "instructions_for_student": "1 mm = 0.1 cm. Let's see how!"
}
```

### Example 4: Only g ↔ kg Practice
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Grams to Kilograms Practice",
    "data": {
        "toolName": "units_of_measurement_tool",
        "parameters": {
            "initialMode": "practice",
            "filterSteps": [12],
            "showModeSelector": false,
            "autoPlayDuration": 0
        }
    },
    "instructions_for_student": "Remember: 1 g = 0.001 kg. Divide by 1000!"
}
```

### Example 5: Real-World Tiny Things
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "How Small Are Things?",
    "data": {
        "toolName": "units_of_measurement_tool",
        "parameters": {
            "initialMode": "real_world",
            "filterSteps": [20],
            "showModeSelector": false,
            "additionalProps": {
                "showRealWorldContext": "tiny_things"
            }
        }
    },
    "instructions_for_student": "A human hair is only 0.1 mm thick!"
}
```

### Example 6: Decimal Disasters Only
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "When Decimals Go Wrong!",
    "data": {
        "toolName": "units_of_measurement_tool",
        "parameters": {
            "initialMode": "real_world",
            "filterSteps": [22],
            "showModeSelector": false
        }
    },
    "instructions_for_student": "Decimal mistakes can cause real disasters! Precision matters."
}
```

### Example 7: Rupee-Paise Conversion
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Rupees and Paise",
    "data": {
        "toolName": "units_of_measurement_tool",
        "parameters": {
            "initialMode": "learn",
            "filterSteps": [1, 5],
            "additionalProps": {
                "conversionType": "rupee_paise"
            }
        }
    },
    "instructions_for_student": "100 paise = 1 rupee. So 1 paisa = ₹0.01!"
}
```

### Example 8: Custom Theme Colour
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Units Explorer",
    "data": {
        "toolName": "units_of_measurement_tool",
        "parameters": {
            "themeColor": "#7c3aed",
            "initialMode": "learn"
        }
    },
    "instructions_for_student": "Let's explore unit conversions with a purple theme!"
}
```

### Example 9: Complete cm ↔ m Lesson + Practice
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Centimetres and Metres",
    "data": {
        "toolName": "units_of_measurement_tool",
        "parameters": {
            "filterSteps": [1, 3, 11],
            "enabledModes": ["learn", "practice"],
            "initialMode": "learn",
            "additionalProps": {
                "conversionType": "cm_m"
            }
        }
    },
    "instructions_for_student": "1 cm = 0.01 m. Learn the concept, then practice!"
}
```

### Example 10: All Real-World Examples
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Measurements in the Real World",
    "data": {
        "toolName": "units_of_measurement_tool",
        "parameters": {
            "initialMode": "real_world",
            "enabledModes": ["real_world"],
            "showModeSelector": false
        }
    },
    "instructions_for_student": "See how unit conversions appear in nature, history, and daily life!"
}
```

---

## Decision Tree for Agents

```
Student asks about units/measurement/conversions
    │
    ├─ "What is mm, cm, m, g, kg?"
    │   └─ Use: initialMode: "learn", all steps
    │
    ├─ "Convert X mm to cm" or "How many cm is Y mm?"
    │   └─ Use: filterSteps: [1, 2], additionalProps: { conversionType: "mm_cm" }
    │
    ├─ "Convert X cm to m"
    │   └─ Use: filterSteps: [1, 3], additionalProps: { conversionType: "cm_m" }
    │
    ├─ "Convert X g to kg"
    │   └─ Use: filterSteps: [1, 4], additionalProps: { conversionType: "g_kg" }
    │
    ├─ "Paise and rupees"
    │   └─ Use: filterSteps: [1, 5], additionalProps: { conversionType: "rupee_paise" }
    │
    ├─ "Practice conversions"
    │   └─ Use: initialMode: "practice"
    │
    ├─ "Real world examples" or "Why do units matter?"
    │   └─ Use: initialMode: "real_world"
    │
    ├─ "Decimal disasters" or "Mistakes with units"
    │   └─ Use: filterSteps: [22], initialMode: "real_world"
    │
    └─ "How small is a hair/ant/fish?"
        └─ Use: filterSteps: [20, 21], initialMode: "real_world"
```

---

## Tips for Agents

1. **For single conversion type**: Use `filterSteps` to show only the relevant learn step + intro
2. **For practice only**: Set `initialMode: "practice"` and `autoPlayDuration: 0`
3. **For minimal UI**: Set `showModeSelector: false` and `showNavigation: false`
4. **For engagement**: Start with `real_world` mode to hook interest, then switch to `learn`
5. **For assessment**: Use `practice` mode with `enabledModes: ["practice"]` only
6. **For static display**: Set `autoPlayDuration: 0`
7. **For specific conversion type**: Combine `filterSteps` with `additionalProps.conversionType`

---

## Error Handling

- If `filterSteps` contains invalid IDs: Those steps are silently skipped
- If `initialMode` is not in `enabledModes`: Defaults to first enabled mode
- If `additionalProps` is empty: Uses built-in default content
- If `conversionType` is invalid: Conversion visual won't render (text still shows)