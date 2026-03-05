# Electric Circuit Learning Tool - Agent Guide

## Quick Reference

**Tool Name:** `electric_circuit_tool`

**Purpose:** Interactive educational tool for teaching Grade 7 students about electric circuits, circuit symbols, and basic electrical concepts through visual learning, practice questions, and real-world applications.

**Modes Available:**
- `learn` - Learn circuit symbols and components
- `practice` - Practice identifying correct circuits with immediate feedback
- `real_world` - Explore real-world applications of electric circuits
- `hands_on` - Safe DIY circuit building experiments

---

## When to Use This Tool

Use the Electric Circuit Tool when students ask about:

✅ **Circuit Symbols & Components:**
- "What are circuit symbols?"
- "How do I draw a circuit diagram?"
- "What's the symbol for a battery?"
- "Show me electric circuit components"

✅ **Understanding Circuits:**
- "How does a torch/flashlight work?"
- "What is a complete circuit?"
- "Why does my light need a switch?"
- "How does electricity flow?"

✅ **Practice & Assessment:**
- "Give me circuit diagram questions"
- "Test my knowledge of circuits"
- "Which circuit is correct?"
- "Help me practice circuit diagrams"

✅ **Real-World Applications:**
- "Where are circuits used in real life?"
- "How do home lights work?"
- "What uses electric circuits?"

✅ **Hands-On Learning:**
- "How can I build a circuit?"
- "Can I make my own torch?"
- "Safe circuit experiments for kids"

---

## Parameters Overview

### Core Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `initialMode` | `'learn' \| 'practice' \| 'real_world' \| 'hands_on'` | `'learn'` | Starting mode |
| `showModeSelector` | `boolean` | `true` | Show/hide mode tabs |
| `enabledModes` | `ModeType[]` | All modes | Which modes to enable |
| `themeColor` | `string` | `'#14b8a6'` | Primary color (teal) |
| `darkMode` | `boolean` | `false` | Enable dark mode |
| `width` | `number` | `800` | Component width |
| `height` | `number` | `600` | Component height |

### Navigation & UI Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `showNavigation` | `boolean` | `true` | Show prev/next buttons |
| `showPlayPause` | `boolean` | `true` | Show play/pause button |
| `showStepIndicator` | `boolean` | `true` | Show step counter |
| `autoPlayDuration` | `number` | `8000` | Auto-advance delay (ms), 0 to disable |

### Additional Props (Tool-Specific)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `customLabels` | `object` | `{positive: '+', negative: '-'}` | Custom labels for polarity |
| `showCircuitExample` | `boolean` | `true` | Show complete circuit example |
| `questions` | `PracticeQuestion[]` | Built-in questions | Custom practice questions |
| `showHints` | `boolean` | `true` | Enable hints in practice mode |
| `maxAttempts` | `number` | `3` | Maximum attempts per question |

---

## Tool Call Examples

### Example 1: Basic Introduction to Circuit Symbols
**Student Query:** "What are circuit symbols?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Electric Circuit Symbols",
  "data": {
    "toolName": "electric_circuit_tool",
    "parameters": {
      "initialMode": "learn",
      "showModeSelector": true
    }
  },
  "instructions_for_student": "Let's learn about the standard symbols used to draw electric circuits! Click on each component to learn more about it."
}
```

---

### Example 2: Focus on Battery Symbol
**Student Query:** "Show me the battery symbol"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Battery Symbol",
  "data": {
    "toolName": "electric_circuit_tool",
    "parameters": {
      "initialMode": "learn",
      "showModeSelector": false,
      "additionalProps": {
        "highlightComponent": "battery",
        "customLabels": {
          "positive": "Positive (+)",
          "negative": "Negative (-)"
        }
      }
    }
  },
  "instructions_for_student": "Here's the battery symbol! The longer line is positive (+) and the shorter line is negative (-)."
}
```

---

### Example 3: Practice Mode - Circuit Diagrams
**Student Query:** "Give me practice questions on circuits"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Practice: Circuit Diagrams",
  "data": {
    "toolName": "electric_circuit_tool",
    "parameters": {
      "initialMode": "practice",
      "showModeSelector": false,
      "additionalProps": {
        "showHints": true,
        "maxAttempts": 3
      }
    }
  },
  "instructions_for_student": "Test your knowledge! Select the correct circuit diagram for each question. You can use hints if you need help."
}
```

---

### Example 4: Real-World Applications
**Student Query:** "Where do we use electric circuits in real life?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Electric Circuits in Daily Life",
  "data": {
    "toolName": "electric_circuit_tool",
    "parameters": {
      "initialMode": "real_world",
      "showModeSelector": true,
      "enabledModes": ["real_world", "learn"]
    }
  },
  "instructions_for_student": "Electric circuits are everywhere! Explore how they power the devices and systems you use every day."
}
```

---

### Example 5: Hands-On Circuit Building
**Student Query:** "How can I build my own circuit at home?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Build Your Own Circuit",
  "data": {
    "toolName": "electric_circuit_tool",
    "parameters": {
      "initialMode": "hands_on",
      "showModeSelector": false,
      "themeColor": "#3b82f6"
    }
  },
  "instructions_for_student": "Follow these safe, step-by-step instructions to build simple circuits at home! Remember to ask an adult for help."
}
```

---

### Example 6: Torch Circuit Focus
**Student Query:** "How does a torch work?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "How a Torch Circuit Works",
  "data": {
    "toolName": "electric_circuit_tool",
    "parameters": {
      "initialMode": "learn",
      "showModeSelector": true,
      "enabledModes": ["learn", "real_world", "hands_on"],
      "additionalProps": {
        "showCircuitExample": true
      }
    }
  },
  "instructions_for_student": "A torch is a perfect example of a simple circuit! See how the battery, switch, and bulb work together to make light."
}
```

---

### Example 7: Assessment Mode
**Student Query:** "Test me on circuit diagrams"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Circuit Diagram Assessment",
  "data": {
    "toolName": "electric_circuit_tool",
    "parameters": {
      "initialMode": "practice",
      "showModeSelector": false,
      "showNavigation": false,
      "additionalProps": {
        "showHints": false,
        "maxAttempts": 1
      }
    }
  },
  "instructions_for_student": "Complete this assessment to test your understanding of circuit diagrams. Choose carefully - you only get one attempt per question!"
}
```

---

### Example 8: LED Circuit Focus
**Student Query:** "What's an LED and how do I use it in a circuit?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "LED in Circuits",
  "data": {
    "toolName": "electric_circuit_tool",
    "parameters": {
      "initialMode": "learn",
      "showModeSelector": true,
      "enabledModes": ["learn", "practice", "hands_on"],
      "additionalProps": {
        "highlightComponent": "led"
      }
    }
  },
  "instructions_for_student": "LEDs are special lights that only work when connected correctly! Learn about LED polarity and how to use them safely."
}
```

---

### Example 9: Switch Understanding
**Student Query:** "Why do we need switches in circuits?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Understanding Switches",
  "data": {
    "toolName": "electric_circuit_tool",
    "parameters": {
      "initialMode": "learn",
      "enabledModes": ["learn", "practice"],
      "additionalProps": {
        "highlightComponent": "switch-on",
        "showCircuitExample": true
      }
    }
  },
  "instructions_for_student": "Switches control the flow of electricity in a circuit. When ON, the circuit is complete. When OFF, the circuit is broken and devices won't work."
}
```

---

### Example 10: Complete Learning Journey
**Student Query:** "Teach me everything about electric circuits"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Complete Electric Circuits Course",
  "data": {
    "toolName": "electric_circuit_tool",
    "parameters": {
      "initialMode": "learn",
      "showModeSelector": true,
      "enabledModes": ["learn", "practice", "real_world", "hands_on"],
      "autoPlayDuration": 0
    }
  },
  "instructions_for_student": "Start with 'Learn' to understand circuit symbols, then move to 'Practice' to test yourself, explore 'Real World' applications, and finally try 'Hands-On' experiments!"
}
```

---

### Example 11: Dark Mode for Low-Light
**Student Query:** "Circuit symbols lesson but in dark mode"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Circuit Symbols (Dark Mode)",
  "data": {
    "toolName": "electric_circuit_tool",
    "parameters": {
      "initialMode": "learn",
      "darkMode": true,
      "themeColor": "#14b8a6"
    }
  },
  "instructions_for_student": "Learning circuit symbols in comfortable dark mode - easier on your eyes!"
}
```

---

### Example 12: Minimal UI for Presentations
**Student Query:** "Show circuit symbols for my presentation"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Circuit Symbols Reference",
  "data": {
    "toolName": "electric_circuit_tool",
    "parameters": {
      "initialMode": "learn",
      "showModeSelector": false,
      "showNavigation": false,
      "showPlayPause": false,
      "showStepIndicator": false,
      "autoPlayDuration": 0
    }
  },
  "instructions_for_student": "Clean reference sheet of all circuit symbols - perfect for presentations!"
}
```

---

## Decision Tree for Agents

```
Student asks about electric circuits
│
├─ "What is/are [component]?" → initialMode: "learn"
│  └─ Add highlightComponent for specific component
│
├─ "How does [device] work?" → initialMode: "learn" + "real_world"
│  └─ Enable both modes to show theory and application
│
├─ "Give me practice/quiz" → initialMode: "practice"
│  └─ Set showHints based on difficulty desired
│
├─ "Test me" or "Assessment" → initialMode: "practice"
│  └─ Set showHints: false, maxAttempts: 1
│
├─ "Build/make my own" → initialMode: "hands_on"
│  └─ Always include safety reminder
│
├─ "Where are circuits used?" → initialMode: "real_world"
│  └─ Can combine with "learn" mode
│
└─ "Teach me everything" → All modes enabled
   └─ Set showModeSelector: true
```

---

## Mode-Specific Features

### Learn Mode (`learn`)
**Purpose:** Understand circuit symbols and components

**Features:**
- Interactive component cards
- Detailed descriptions
- Symbol visualization
- Complete circuit example
- Click to select components
- Polarity indicators

**Best For:**
- Introduction to circuits
- Symbol reference
- Understanding components
- Visual learning

---

### Practice Mode (`practice`)
**Purpose:** Test knowledge with immediate feedback

**Features:**
- Multiple choice circuit diagrams
- Immediate visual feedback
- Detailed explanations
- Optional hints
- Progress tracking
- Question navigation

**Best For:**
- Knowledge testing
- Skill reinforcement
- Assessment
- Identifying errors

---

### Real World Mode (`real_world`)
**Purpose:** Connect theory to practical applications

**Features:**
- 6 real-world applications
- Colorful visual cards
- Hover animations
- Relatable examples

**Applications Shown:**
- Torch/Flashlight
- Home Lighting
- Mobile Phones
- Cars & Vehicles
- Electronic Toys
- Safety Devices

**Best For:**
- Motivation
- Context building
- Career awareness
- Practical understanding

---

### Hands-On Mode (`hands_on`)
**Purpose:** Guide safe DIY circuit building

**Features:**
- Step-by-step instructions
- Safety warnings
- Materials list
- Two complete experiments
- Adult supervision reminder

**Experiments Included:**
1. Simple Torch Circuit
2. LED Circuit with Resistor

**Best For:**
- Project-based learning
- Home experiments
- Practical skills
- Maker education

---

## Additional Props Examples

### Custom Circuit Questions

```json
{
  "additionalProps": {
    "questions": [
      {
        "id": "custom1",
        "question": "Which circuit shows a battery connected correctly to a lamp?",
        "type": "diagram",
        "circuits": [
          {
            "id": "c1a",
            "svg": "<svg>...</svg>",
            "isCorrect": true
          },
          {
            "id": "c1b",
            "svg": "<svg>...</svg>",
            "isCorrect": false
          }
        ],
        "correctAnswer": "c1a",
        "explanation": "The positive terminal must connect to one side of the lamp, and negative to the other.",
        "hint": "Look for complete circuit path"
      }
    ]
  }
}
```

### Custom Labels (Multiple Languages Support)

```json
{
  "additionalProps": {
    "customLabels": {
      "positive": "धनात्मक (+)",
      "negative": "ऋणात्मक (-)"
    }
  }
}
```

### Highlighting Specific Components

```json
{
  "additionalProps": {
    "highlightComponent": "battery",
    "showCircuitExample": true
  }
}
```

---

## Common Student Questions & Responses

### Q: "I don't understand circuit symbols"
```json
{
  "initialMode": "learn",
  "showModeSelector": true,
  "enabledModes": ["learn", "practice"]
}
```
Start with learn mode, then offer practice mode for reinforcement.

---

### Q: "Help me with my circuit homework"
```json
{
  "initialMode": "learn",
  "showModeSelector": true,
  "additionalProps": {
    "showCircuitExample": true
  }
}
```
Show all symbols and a complete example circuit.

---

### Q: "Can I try building a real circuit?"
```json
{
  "initialMode": "hands_on",
  "showModeSelector": true,
  "enabledModes": ["hands_on", "learn"]
}
```
Provide hands-on experiments with reference to theory.

---

### Q: "Quiz me on circuits"
```json
{
  "initialMode": "practice",
  "showModeSelector": false,
  "additionalProps": {
    "showHints": true
  }
}
```
Practice mode with hints enabled for supportive learning.

---

## Safety Considerations

When using `hands_on` mode, always:

1. **Emphasize Safety:**
   - Only use batteries (never mains electricity)
   - Adult supervision required
   - Use proper insulated wires
   - Don't short-circuit batteries

2. **Age-Appropriate:**
   - Grade 7 students (11-13 years)
   - Simple, safe experiments
   - Clear step-by-step instructions

3. **Educational Value:**
   - Reinforce learned concepts
   - Hands-on experience
   - Problem-solving skills

---

## Performance Tips

### For Smooth Experience:
- Use `autoPlayDuration: 0` for static displays
- Disable unused modes with `enabledModes`
- Set `showModeSelector: false` for focused learning
- Use `darkMode: true` for low-light environments

### For Assessments:
- Set `showHints: false`
- Set `maxAttempts: 1`
- Disable navigation during tests
- Use `practice` mode exclusively

### For Presentations:
- Hide all controls
- Use `learn` or `real_world` mode
- Large, clear visuals
- Minimal distractions

---

## Accessibility Features

✓ Keyboard navigation support
✓ ARIA labels on SVG components
✓ High contrast mode via `darkMode`
✓ Clear visual feedback
✓ Text descriptions for all symbols
✓ Responsive design

---

## Troubleshooting

**Issue:** Student confused by too many options
**Solution:** Set `showModeSelector: false` and enable only one mode

**Issue:** Practice too difficult
**Solution:** Enable `showHints: true` and increase `maxAttempts`

**Issue:** Need quick reference
**Solution:** Use `learn` mode with all controls hidden

**Issue:** Want step-by-step progression
**Solution:** Use `autoPlayDuration` with appropriate delay

---

## Integration with Curriculum

**NCERT Grade 7 Science - Chapter: Electric Current and Its Effects**

Covers:
- ✅ Electric cell and battery symbols
- ✅ Connecting wires and circuit paths
- ✅ Switch symbols and function
- ✅ Bulb and LED symbols
- ✅ Complete vs incomplete circuits
- ✅ Conductor understanding
- ✅ Practical applications
- ✅ Safety awareness

---

## Technical Notes

**Component:** React/TypeScript
**Styling:** Pure CSS-in-JS (no external CSS)
**Icons:** Custom SVG components
**Animations:** CSS transitions and keyframes
**State Management:** React hooks (useState, useEffect, useMemo)
**Accessibility:** ARIA labels, semantic HTML
**Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge)

---

## Summary

The Electric Circuit Tool provides a comprehensive, multi-modal learning experience for electric circuits:

- **Learn:** Visual introduction to circuit symbols
- **Practice:** Interactive questions with feedback
- **Real World:** Practical applications showcase
- **Hands-On:** Safe DIY experiments guide

Use appropriate modes and parameters based on student needs, learning objectives, and context. Always prioritize safety when guiding hands-on activities.