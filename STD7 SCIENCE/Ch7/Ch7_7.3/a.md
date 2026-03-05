# Radiation Tool — Agent Instructions

## Overview

The **Radiation Tool** is an interactive educational component for Grade 7 students, aligned with **NCERT Chapter 7.3 (Heat Transfer in Nature)**. It teaches the concept of radiation — the process of heat transfer that does not require any material medium.

The tool includes 4 modes with animated visuals, quizzes, real-world examples, and hands-on slider experiments.

---

## Quick Reference Table

| Parameter | Type | Default | Description |
|---|---|---|---|
| `initialMode` | string | `"learn"` | Starting mode: learn, practice, real_world, hands_on |
| `showModeSelector` | boolean | `true` | Show/hide mode tabs |
| `enabledModes` | string[] | all 4 | Which modes to enable |
| `showNavigation` | boolean | `true` | Show prev/next buttons |
| `showPlayPause` | boolean | `true` | Show auto-play (learn mode) |
| `showStepIndicator` | boolean | `true` | Show step counter |
| `filterSteps` | number[] | all | Only show specific step IDs |
| `autoPlayDuration` | number | `8000` | Auto-advance delay (ms) |
| `darkMode` | boolean | `false` | Dark mode toggle |

---

## additionalProps Reference

| Prop | Type | Default | Description |
|---|---|---|---|
| `showSunDemo` | boolean | `true` | Show Sun-Earth radiation animation |
| `showFireDemo` | boolean | `true` | Show fireplace radiation animation |
| `showClothingDemo` | boolean | `true` | Show light vs dark clothing demo |
| `heatSourceType` | string | `"all"` | Focus: "sun", "fire", "heater", or "all" |
| `showWaveAnimation` | boolean | `true` | Animate heat waves |
| `radiationIntensity` | number (1-10) | `5` | Intensity of wave animation |
| `showMediumComparison` | boolean | `true` | Show conduction vs convection vs radiation |
| `customScenarios` | object[] | `[]` | Custom real-world scenarios |

---

## Modes & Steps

### Learn Mode (Step IDs: 1–6)
1. **What is Radiation?** — Intro with animated sun visual
2. **Heat from the Sun** — Sun-Earth animation with heat waves through vacuum
3. **Warmth from a Fire** — Fireplace scene with Pema and Palden
4. **All Objects Radiate Heat** — Hot utensil radiating heat outward
5. **No Medium Needed!** — Conduction vs Convection vs Radiation comparison cards
6. **Light vs Dark Colours** — Clothing absorption/reflection visual

### Practice Mode (Step IDs: 10–13)
- 4 MCQ questions with instant feedback and explanations

### Real World Mode (Step IDs: 20–22)
- **Campfire** — Distance and radiation
- **Solar Water Heater** — Dark panels absorbing radiation
- **Thermos Flask** — Mirror walls reflecting radiation

### Hands On Mode (Step IDs: 30–31)
- **Colour & Heat** — Slider to change surface darkness, see absorption vs reflection
- **Distance & Heat** — Drag person closer/further from fire, see heat felt change

---

## Tool Call Examples

### Example 1: Full Tool (default)
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Radiation - Heat Transfer",
    "data": {
        "toolName": "radiation_tool",
        "parameters": {}
    },
    "instructions_for_student": "Explore how heat travels without any medium!"
}
```

### Example 2: Start with Practice Mode
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Radiation Quiz",
    "data": {
        "toolName": "radiation_tool",
        "parameters": {
            "initialMode": "practice",
            "showModeSelector": true
        }
    },
    "instructions_for_student": "Test your knowledge about radiation!"
}
```

### Example 3: Only Learn Mode (Guided Lesson)
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Learn About Radiation",
    "data": {
        "toolName": "radiation_tool",
        "parameters": {
            "initialMode": "learn",
            "enabledModes": ["learn"],
            "showModeSelector": false,
            "autoPlayDuration": 10000
        }
    },
    "instructions_for_student": "Watch the animated lesson about radiation step by step."
}
```

### Example 4: Focus on Sun's Radiation
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Sun's Radiation",
    "data": {
        "toolName": "radiation_tool",
        "parameters": {
            "initialMode": "learn",
            "filterSteps": [1, 2, 5],
            "additionalProps": {
                "heatSourceType": "sun",
                "showWaveAnimation": true,
                "radiationIntensity": 8
            }
        }
    },
    "instructions_for_student": "See how the Sun's heat reaches Earth through the vacuum of space!"
}
```

### Example 5: Clothing & Colour Science Only
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Why Light Clothes in Summer?",
    "data": {
        "toolName": "radiation_tool",
        "parameters": {
            "initialMode": "learn",
            "filterSteps": [6],
            "showNavigation": false,
            "showPlayPause": false,
            "additionalProps": {
                "showClothingDemo": true
            }
        }
    },
    "instructions_for_student": "Light colours reflect heat and dark colours absorb it!"
}
```

### Example 6: Hands-On Experiments Only
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Radiation Experiments",
    "data": {
        "toolName": "radiation_tool",
        "parameters": {
            "initialMode": "hands_on",
            "enabledModes": ["hands_on"],
            "showModeSelector": false
        }
    },
    "instructions_for_student": "Drag the sliders to explore how colour and distance affect heat radiation!"
}
```

### Example 7: Real-World Examples
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Radiation in Daily Life",
    "data": {
        "toolName": "radiation_tool",
        "parameters": {
            "initialMode": "real_world",
            "enabledModes": ["real_world"],
            "showModeSelector": false
        }
    },
    "instructions_for_student": "See how radiation works in campfires, solar heaters, and thermos flasks!"
}
```

### Example 8: Dark Mode
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Radiation Tool",
    "data": {
        "toolName": "radiation_tool",
        "parameters": {
            "darkMode": true
        }
    },
    "instructions_for_student": "Explore radiation in dark mode!"
}
```

### Example 9: Comparison Only (Conduction vs Convection vs Radiation)
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Three Types of Heat Transfer",
    "data": {
        "toolName": "radiation_tool",
        "parameters": {
            "initialMode": "learn",
            "filterSteps": [5],
            "showNavigation": false,
            "showPlayPause": false,
            "additionalProps": {
                "showMediumComparison": true
            }
        }
    },
    "instructions_for_student": "Compare conduction, convection, and radiation side by side!"
}
```

### Example 10: Minimal UI (Auto-play presentation)
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Radiation Slideshow",
    "data": {
        "toolName": "radiation_tool",
        "parameters": {
            "showModeSelector": false,
            "showNavigation": false,
            "showPlayPause": false,
            "showStepIndicator": false,
            "enabledModes": ["learn"],
            "autoPlayDuration": 6000
        }
    },
    "instructions_for_student": "Sit back and watch the radiation lesson!"
}
```

---

## Decision Tree for Agents

```
Student asks about heat/radiation
    │
    ├─ "What is radiation?"
    │   └─ Use: initialMode: "learn", filterSteps: [1]
    │
    ├─ "How does Sun's heat reach Earth?"
    │   └─ Use: initialMode: "learn", filterSteps: [1, 2, 5]
    │
    ├─ "Why do we wear white clothes in summer?"
    │   └─ Use: initialMode: "learn", filterSteps: [6]
    │
    ├─ "What's the difference between conduction, convection, radiation?"
    │   └─ Use: initialMode: "learn", filterSteps: [5]
    │
    ├─ "Give me a quiz on radiation"
    │   └─ Use: initialMode: "practice"
    │
    ├─ "Show real-life examples of radiation"
    │   └─ Use: initialMode: "real_world"
    │
    ├─ "Let me experiment with radiation"
    │   └─ Use: initialMode: "hands_on"
    │
    └─ General radiation topic
        └─ Use: default (all modes enabled)
```

---

## Design System

The tool uses the **Singularity Design System**:
- **Primary**: #4A4DC9 (Indigo)
- **Secondary**: #FF7212 (Orange)
- **Gradient**: #533086 → #FC9145
- **Light accents**: #C1C1EA, #FFF3E4
- **Font**: Poppins (sans-serif fallback)
- **Border radius**: 12–24px
- **Animations**: CSS keyframes with smooth easing, 60fps

---

## Error Handling

- If `filterSteps` contains IDs not in the default steps: those steps are skipped
- If `initialMode` is not in `enabledModes`: defaults to first enabled mode
- Empty `additionalProps`: uses all default visuals
- Invalid mode string: defaults to "learn"

---

## Tips for Agents

1. **For quick demos**: Use `filterSteps` to show only 1-2 specific steps
2. **For assessments**: Use `initialMode: "practice"` with `enabledModes: ["practice"]`
3. **For self-paced learning**: Enable auto-play with appropriate `autoPlayDuration`
4. **For interactive exploration**: Use `initialMode: "hands_on"` 
5. **For minimal distractions**: Set `showModeSelector: false` and `showNavigation: false`
6. **For specific topics**: Use `filterSteps` array with relevant step IDs