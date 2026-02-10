# Eclipses Learning Tool - Agent Instructions

## Overview

The Eclipses Learning Tool is an interactive educational component for teaching about solar and lunar eclipses. It features animated visualizations of celestial alignments, practice quizzes, and real-world eclipse events. The tool supports dynamic content via `additionalProps` allowing agents to customize eclipse types, animation speeds, and visual appearance.

---

## Quick Reference Table

| Student Request | Mode | Key Parameters |
|-----------------|------|----------------|
| "Teach me about eclipses" | learn | `initialMode: "learn"` |
| "What is a solar eclipse?" | learn | `additionalProps: { eclipseType: "solar" }` |
| "What is a lunar eclipse?" | learn | `additionalProps: { eclipseType: "lunar" }` |
| "Show me both types" | learn | `additionalProps: { eclipseType: "both" }` |
| "Practice questions about eclipses" | practice | `initialMode: "practice"` |
| "When is the next eclipse?" | applications | `initialMode: "applications"` |
| "Show me eclipse events in India" | applications | `initialMode: "applications"` |
| "Make animation faster" | learn | `additionalProps: { animationSpeed: 2 }` |
| "Show me the Blood Moon" | learn | `additionalProps: { eclipseType: "lunar" }` |

---

## Visibility Control Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `showModeSelector` | `true` | Hide mode tabs for focused experience |
| `enabledModes` | `["learn", "practice", "applications"]` | Restrict which modes are available |

**Note:** This tool uses mode-based navigation rather than step-based navigation, so `showNavigation`, `showPlayPause`, and `showStepIndicator` are not applicable.

---

## additionalProps Reference

### Eclipse Type Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `eclipseType` | `"solar" \| "lunar" \| "both"` | `"both"` | Which eclipse type to focus on |
| `animationSpeed` | `number` | `1` | Animation speed multiplier (1 = normal, 2 = 2x faster, 0.5 = 2x slower) |
| `showLabels` | `boolean` | `true` | Show Sun/Earth/Moon labels on visualization |
| `highlightPhase` | `number \| null` | `null` | Specific animation phase to highlight (0-360°) |

### Custom Colors

| Property | Type | Description |
|----------|------|-------------|
| `customColors` | `object` | Custom colors for celestial bodies |
| `customColors.sun` | `string` | Sun color (default: "#ff9500") |
| `customColors.earth` | `string` | Earth color (default: "#4a9eff") |
| `customColors.moon` | `string` | Moon color (default: "#b8b8b8") |
| `customColors.shadow` | `string` | Shadow color (default: "rgba(0,0,0,0.5)") |

---

## Tool Call Examples

### Example 1: Basic Eclipse Learning
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Learn About Eclipses",
    "data": {
        "toolName": "eclipses_learning_tool",
        "parameters": {
            "initialMode": "learn",
            "showModeSelector": true,
            "additionalProps": {
                "eclipseType": "both"
            }
        }
    },
    "instructions_for_student": "Explore solar and lunar eclipses! Click the buttons to switch between eclipse types."
}
```

### Example 2: Focus on Solar Eclipse
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Solar Eclipse Explained",
    "data": {
        "toolName": "eclipses_learning_tool",
        "parameters": {
            "initialMode": "learn",
            "showModeSelector": false,
            "additionalProps": {
                "eclipseType": "solar",
                "animationSpeed": 1,
                "showLabels": true,
                "customColors": {
                    "sun": "#ffcc00",
                    "moon": "#808080"
                }
            }
        }
    },
    "instructions_for_student": "Watch how the Moon blocks the Sun during a solar eclipse!"
}
```

### Example 3: Focus on Lunar Eclipse (Blood Moon)
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Lunar Eclipse - The Blood Moon",
    "data": {
        "toolName": "eclipses_learning_tool",
        "parameters": {
            "initialMode": "learn",
            "showModeSelector": false,
            "additionalProps": {
                "eclipseType": "lunar",
                "animationSpeed": 0.8,
                "showLabels": true,
                "customColors": {
                    "moon": "#a04040",
                    "shadow": "rgba(160, 64, 64, 0.6)"
                }
            }
        }
    },
    "instructions_for_student": "See how Earth's shadow creates the red Blood Moon effect!"
}
```

### Example 4: Practice Mode
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Test Your Eclipse Knowledge",
    "data": {
        "toolName": "eclipses_learning_tool",
        "parameters": {
            "initialMode": "practice",
            "showModeSelector": false,
            "additionalProps": {
                "eclipseType": "both"
            }
        }
    },
    "instructions_for_student": "Answer 20 questions about eclipses to test your understanding!"
}
```

### Example 5: Real-World Applications
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Upcoming Eclipse Events",
    "data": {
        "toolName": "eclipses_learning_tool",
        "parameters": {
            "initialMode": "applications",
            "showModeSelector": false,
            "additionalProps": {
                "eclipseType": "both"
            }
        }
    },
    "instructions_for_student": "Explore upcoming eclipse events and learn about Indian observatories!"
}
```

### Example 6: Fast Animation for Quick Demo
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Eclipse Animation (Fast)",
    "data": {
        "toolName": "eclipses_learning_tool",
        "parameters": {
            "initialMode": "learn",
            "showModeSelector": false,
            "additionalProps": {
                "eclipseType": "both",
                "animationSpeed": 2,
                "showLabels": true
            }
        }
    },
    "instructions_for_student": "Watch the fast animation showing how eclipses occur!"
}
```

### Example 7: Slow Detailed Animation
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Detailed Eclipse Animation",
    "data": {
        "toolName": "eclipses_learning_tool",
        "parameters": {
            "initialMode": "learn",
            "showModeSelector": false,
            "additionalProps": {
                "eclipseType": "solar",
                "animationSpeed": 0.5,
                "showLabels": true
            }
        }
    },
    "instructions_for_student": "Watch the slow, detailed animation to understand the alignment!"
}
```

### Example 8: Custom Color Scheme
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Eclipse with Custom Colors",
    "data": {
        "toolName": "eclipses_learning_tool",
        "parameters": {
            "initialMode": "learn",
            "showModeSelector": false,
            "additionalProps": {
                "eclipseType": "solar",
                "customColors": {
                    "sun": "#ff6b00",
                    "earth": "#2d8a4e",
                    "moon": "#c0c0c0",
                    "shadow": "rgba(0, 0, 0, 0.7)"
                }
            }
        }
    },
    "instructions_for_student": "See the eclipse with a custom color scheme!"
}
```

### Example 9: Minimal UI - Solar Eclipse Only
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Solar Eclipse",
    "data": {
        "toolName": "eclipses_learning_tool",
        "parameters": {
            "initialMode": "learn",
            "showModeSelector": false,
            "enabledModes": ["learn"],
            "additionalProps": {
                "eclipseType": "solar",
                "showLabels": false,
                "animationSpeed": 1
            }
        }
    },
    "instructions_for_student": "Focus on the solar eclipse visualization!"
}
```

### Example 10: Full Experience with All Modes
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Complete Eclipse Learning Experience",
    "data": {
        "toolName": "eclipses_learning_tool",
        "parameters": {
            "initialMode": "learn",
            "showModeSelector": true,
            "enabledModes": ["learn", "practice", "applications"],
            "additionalProps": {
                "eclipseType": "both",
                "animationSpeed": 1,
                "showLabels": true
            }
        }
    },
    "instructions_for_student": "Explore all three modes: Learn, Practice, and Real World applications!"
}
```

---

## Decision Tree for Agents

```
Student asks about eclipses
    │
    ├─ "What is an eclipse?" or "Teach me about eclipses"
    │   └─ Use: initialMode: "learn", eclipseType: "both"
    │
    ├─ "What is a solar eclipse?" or "Sun eclipse"
    │   └─ Use: initialMode: "learn", eclipseType: "solar"
    │
    ├─ "What is a lunar eclipse?" or "Moon eclipse" or "Blood Moon"
    │   └─ Use: initialMode: "learn", eclipseType: "lunar"
    │
    ├─ "Practice questions" or "Test me" or "Quiz"
    │   └─ Use: initialMode: "practice"
    │
    ├─ "Real-world examples" or "How are eclipses used?" or "Eclipse applications"
    │   └─ Use: initialMode: "applications"
    │
    ├─ "Show me eclipse examples" or "Practical uses of eclipses"
    │   └─ Use: initialMode: "applications"
    │
    ├─ "Make it faster" or "Speed up"
    │   └─ Use: additionalProps: { animationSpeed: 2 }
    │
    ├─ "Make it slower" or "Show details"
    │   └─ Use: additionalProps: { animationSpeed: 0.5 }
    │
    └─ "Show me both types"
        └─ Use: additionalProps: { eclipseType: "both" }
```

---

## Mode Descriptions

### Learn Mode
- **Purpose**: Educational content with animated visualizations
- **Content**: 
  - Solar eclipse explanation with apparent size concept
  - Lunar eclipse explanation with Blood Moon phenomenon
  - Safety warnings for solar eclipse viewing
  - Historical context (Indian astronomy, Kodaikanal Observatory)
  - Key facts (diameters, distances, durations)
- **Features**: 
  - Animated canvas showing celestial alignments
  - Toggle between solar and lunar eclipse views
  - Interactive information boxes
  - Visual type cards (Total vs Partial)

### Practice Mode
- **Purpose**: Interactive quiz to test knowledge
- **Content**: 20 questions covering:
  - Causes of eclipses
  - Apparent size concept
  - Safety for viewing
  - Blood Moon phenomenon
  - Shadow types (umbra, penumbra)
  - Indian observatories
  - Eclipse visibility
  - Corona visibility
  - Eclipse duration differences
  - Moon-Sun size ratio (1:400)
  - Eclipse phases and timing
  - Historical predictions (Surya Siddhanta)
  - Distance measurements
  - Moon phases and eclipse occurrence
- **Features**:
  - Multiple choice and true/false questions
  - Difficulty levels (easy, medium, hard)
  - Immediate feedback with explanations
  - Score tracking
  - Progress bar
  - Celebration animations
  - All questions relate to Learn mode content

### Applications Mode (Real World)
- **Purpose**: Real-world examples and applications of eclipse knowledge
- **Content**: 8 real-world examples:
  1. **Eclipse Tourism and Travel** - How people travel to witness eclipses
  2. **Eclipse Photography and Science** - Scientific research during eclipses
  3. **Historical Eclipse Predictions** - Ancient methods for predicting eclipses
  4. **Eclipse Safety and Public Health** - Public health campaigns and eye safety
  5. **Eclipse Impact on Wildlife** - How animals react to eclipses
  6. **Eclipse in Navigation and Timekeeping** - Historical navigation uses
  7. **Solar Eclipse and Renewable Energy** - Impact on solar power generation
  8. **Lunar Eclipse and Cultural Celebrations** - Cultural significance worldwide
- **Features**:
  - One example displayed at a time
  - Previous/Next navigation buttons
  - Example counter (Example X of 8)
  - Detailed descriptions and real-world connections
  - Smooth transitions between examples
  - Animated Earth-Moon system in header

---

## Tips for Agents

1. **For focused learning**: Set `showModeSelector: false` and specify `eclipseType`
2. **For comparison**: Use `eclipseType: "both"` to allow toggling
3. **For quick demos**: Increase `animationSpeed` to 2
4. **For detailed study**: Decrease `animationSpeed` to 0.5
5. **For practice**: Always use `initialMode: "practice"`
6. **For events**: Use `initialMode: "applications"` for calendar view
7. **For India focus**: Applications mode automatically shows India-specific content
8. **For minimal UI**: Hide mode selector and use single eclipse type

---

## Educational Context

- **Grade Level**: Grade 7
- **Subject**: Science
- **Chapter**: Chapter 12.3 - Earth, Moon, and the Sun
- **Textbook**: NCERT Curiosity Textbook of Science
- **Key Concepts**:
  - Solar eclipses (Moon blocks Sun)
  - Lunar eclipses (Earth blocks Moon)
  - Apparent size and distance relationships
  - Safety in eclipse viewing
  - Historical astronomy (Indian contributions)
  - Real-world eclipse events

---

## Error Handling

- Invalid `eclipseType`: Defaults to "both"
- Invalid `animationSpeed`: Defaults to 1 (normal speed)
- Invalid `initialMode`: Defaults to "learn"
- Empty `additionalProps`: Uses all defaults (both eclipse types, normal speed)
- Invalid `enabledModes`: Falls back to all three modes

---

## Content Highlights

### Key Facts Covered
- Sun Diameter: 1.4 million km
- Earth Diameter: 12,742 km
- Moon Diameter: 3,474 km
- Sun-Earth Distance: 150 million km
- Moon-Earth Distance: 384,400 km
- Total Eclipse Duration: Up to 7.5 minutes

### Safety Information
- ⚠️ **Solar Eclipse**: Never look directly - use ISO-certified glasses
- ✅ **Lunar Eclipse**: Safe to view with naked eye

### Historical Context
- Ancient Indian astronomers predicted eclipses centuries ago
- Kodaikanal Solar Observatory (1899) - 125+ years of solar study
- Surya Siddhanta - ancient eclipse calculation methods

### Upcoming Events (2025-2026)
- March 14, 2025: Total Lunar Eclipse
- March 29, 2025: Partial Solar Eclipse
- September 7, 2025: Total Lunar Eclipse
- September 21, 2025: Partial Solar Eclipse
- August 12, 2026: Total Solar Eclipse
- November 14, 2031: Total Solar Eclipse (India)

---

## Additional Notes

- The tool uses a dark space theme by default for better visualization
- All animations are smooth and use requestAnimationFrame for 60fps
- Canvas-based visualizations show real-time celestial movements
- Practice mode includes 20 questions with varying difficulty covering all Learn mode topics
- Real-world mode includes expandable event cards with details
- All content is based on NCERT Grade 7 Science curriculum
