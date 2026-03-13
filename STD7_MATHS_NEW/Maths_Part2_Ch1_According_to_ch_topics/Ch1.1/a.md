// ═══════════════════════════════════════════════════════════════════════════
// AGENT README START
// File: geometric_twins_tool_agent_readme.md
// ═══════════════════════════════════════════════════════════════════════════

# Geometric Twins Tool — Agent Instructions

## Overview

Interactive educational tool for **Topic 1.1 — Geometric Twins** from Ganita Prakash (Grade 7). Teaches congruence of figures using V-shaped signboard symbols with arm lengths and included angles. Includes Learn mode (6 steps with SVG diagrams, interactive angle slider, definitions) and Practice mode (5 MCQs with auto-check feedback).

## Quick Reference Table

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `initialMode` | `"learn" \| "practice"` | `"learn"` | Starting mode |
| `showModeSelector` | `boolean` | `true` | Show/hide mode tabs |
| `showNavigation` | `boolean` | `true` | Show/hide prev/next buttons |
| `showPlayPause` | `boolean` | `true` | Show/hide play/pause button |
| `showStepIndicator` | `boolean` | `true` | Show/hide step counter |
| `initialStep` | `number` | `1` | Step ID to start on |
| `filterSteps` | `number[]` | `null` | Only show specific step IDs |
| `animationSpeed` | `number` | `1` | Animation speed multiplier |
| `autoPlayDuration` | `number` | `0` | Auto-advance delay in ms |
| `themeColor` | `string` | `"#4A4DC9"` | Primary theme color |

## additionalProps Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `armLengthAB` | `number` | `4` | Length of arm AB (cm) |
| `armLengthBC` | `number` | `8` | Length of arm BC (cm) |
| `angleDeg` | `number` | `80` | Included angle ∠ABC (degrees) |
| `showMultipleAngles` | `boolean` | `false` | Show multiple angle variations |
| `showCongruenceComparison` | `boolean` | `false` | Show side-by-side congruent figures |
| `highlightAngle` | `boolean` | `false` | Highlight the included angle |
| `customLabels` | `object` | `{A:"A",B:"B",C:"C"}` | Custom vertex labels |
| `diagramColor` | `string` | `"#533086"` | Main diagram line color |
| `accentColor` | `string` | `"#FF7212"` | Angle arc/highlight color |

## Tool Call Examples (with additionalProps)

### Example 1: Default Learn Mode
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Geometric Twins — Congruence",
    "data": {
        "toolName": "geometric_twins_tool",
        "parameters": {
            "initialMode": "learn"
        }
    }
}
```

### Example 2: Jump to Practice Mode
```json
{
    "frontend_action": "show_interactive_tool",
    "data": {
        "toolName": "geometric_twins_tool",
        "parameters": {
            "initialMode": "practice",
            "showModeSelector": true
        }
    }
}
```

### Example 3: Custom Angle with Highlight
```json
{
    "frontend_action": "show_interactive_tool",
    "data": {
        "toolName": "geometric_twins_tool",
        "parameters": {
            "initialMode": "learn",
            "initialStep": 3,
            "additionalProps": {
                "angleDeg": 60,
                "highlightAngle": true,
                "armLengthAB": 5,
                "armLengthBC": 5
            }
        }
    }
}
```

### Example 4: Only Show the Interactive Angle Step
```json
{
    "frontend_action": "show_interactive_tool",
    "data": {
        "toolName": "geometric_twins_tool",
        "parameters": {
            "filterSteps": [3],
            "showModeSelector": false,
            "showStepIndicator": false,
            "additionalProps": { "angleDeg": 90 }
        }
    }
}
```

### Example 5: Minimal — No Controls
```json
{
    "frontend_action": "show_interactive_tool",
    "data": {
        "toolName": "geometric_twins_tool",
        "parameters": {
            "initialMode": "learn",
            "showModeSelector": false,
            "showNavigation": false,
            "showPlayPause": false,
            "showStepIndicator": false,
            "filterSteps": [1]
        }
    }
}
```

### Example 6: Auto-Play Through Learn Steps
```json
{
    "frontend_action": "show_interactive_tool",
    "data": {
        "toolName": "geometric_twins_tool",
        "parameters": {
            "initialMode": "learn",
            "autoPlayDuration": 6000,
            "animationSpeed": 1.5
        }
    }
}
```

### Example 7: Custom Vertex Labels
```json
{
    "frontend_action": "show_interactive_tool",
    "data": {
        "toolName": "geometric_twins_tool",
        "parameters": {
            "additionalProps": {
                "customLabels": { "A": "P", "B": "Q", "C": "R" },
                "angleDeg": 45
            }
        }
    }
}
```

### Example 8: Only Practice — Single Question
```json
{
    "frontend_action": "show_interactive_tool",
    "data": {
        "toolName": "geometric_twins_tool",
        "parameters": {
            "initialMode": "practice",
            "filterSteps": [10],
            "showModeSelector": false,
            "showNavigation": false
        }
    }
}
```

### Example 9: Equilateral Triangle Setup
```json
{
    "frontend_action": "show_interactive_tool",
    "data": {
        "toolName": "geometric_twins_tool",
        "parameters": {
            "initialStep": 3,
            "additionalProps": {
                "armLengthAB": 6,
                "armLengthBC": 6,
                "angleDeg": 60,
                "highlightAngle": true,
                "accentColor": "#2DB87D"
            }
        }
    }
}
```

### Example 10: Dark Theme (Future)
```json
{
    "frontend_action": "show_interactive_tool",
    "data": {
        "toolName": "geometric_twins_tool",
        "parameters": {
            "darkMode": true,
            "themeColor": "#818cf8"
        }
    }
}
```

## Decision Tree for Agents

```
Student asks about congruence / geometric twins
    │
    ├─ "What is congruence?"
    │   └─ Use: initialMode: "learn", initialStep: 4
    │
    ├─ "Show me the signboard symbol"
    │   └─ Use: initialMode: "learn", initialStep: 1
    │
    ├─ "Why do we need the angle?"
    │   └─ Use: initialMode: "learn", initialStep: 3
    │
    ├─ "Can I change the angle?"
    │   └─ Use: filterSteps: [3], additionalProps: { angleDeg: 90 }
    │
    ├─ "Test my understanding"
    │   └─ Use: initialMode: "practice"
    │
    ├─ "Show me a specific question"
    │   └─ Use: initialMode: "practice", filterSteps: [10]
    │
    ├─ "Summary only"
    │   └─ Use: filterSteps: [6], showNavigation: false
    │
    └─ "Show everything automatically"
        └─ Use: autoPlayDuration: 6000
```

## Parameter Details

### Step IDs

**Learn Mode:**
- `1` — The Problem: Recreating a Figure (intro diagram)
- `2` — Are Arm Lengths Enough? (multiple angles diagram)
- `3` — The Included Angle (interactive slider)
- `4` — What is Congruence? (flip/rotate diagram)
- `5` — Confirming Congruence (side-by-side comparison)
- `6` — Key Takeaway (summary)

**Practice Mode:**
- `10` — Q1: Definition of congruence
- `11` — Q2: Arm lengths vs included angle
- `12` — Q3: Allowed transformations
- `13` — Q4: Required measurements
- `14` — Q5: Applying congruence conditions

### Error Handling

- Invalid `initialMode` → defaults to `"learn"`
- Invalid `initialStep` → starts at first step of selected mode
- Empty `filterSteps` → shows all steps
- Invalid `angleDeg` outside 1-179 → clamped by slider
- Missing `additionalProps` → all defaults apply

// ═══════════════════════════════════════════════════════════════════════════
// AGENT README END
// ═══════════════════════════════════════════════════════════════════════════