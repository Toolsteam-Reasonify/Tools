# Torchlight Circuit Tool - Agent Instructions

## Overview

The Torchlight Circuit Tool is an interactive educational component for teaching students about torchlights, electric circuits, and their components (cells, batteries, switches, wires, and lamps). It supports dynamic content via `additionalProps` allowing agents to customize torch state, highlight components, show circuit diagrams, and configure visual appearance.

The tool includes three main modes:
- **Demonstration (Learn)**: Interactive torch with step-by-step explanations
- **Practice**: Quiz questions to test understanding
- **Real World**: Examples of circuits in daily life

---

## Quick Reference Table

| Student Request | Mode | Key Parameters |
|-----------------|------|----------------|
| "Teach me about torchlights" | demonstration | `initialMode: "demonstration"` |
| "Show me torch parts" | demonstration | `initialMode: "demonstration"` (shows parts step) |
| "Let me practice" | practice | `initialMode: "practice"` |
| "Show real world examples" | real_world | `initialMode: "real_world"` |
| "Turn the torch on" | demonstration | `additionalProps: { torchState: "on" }` |
| "Highlight the lamp" | demonstration | `additionalProps: { highlightComponents: ["lamp"] }` |
| "Show me the circuit" | demonstration | `additionalProps: { showCircuit: true }` |
| "Custom colored torch" | demonstration | `additionalProps: { customColors: {...} }` |

---

## Visibility Control Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `showModeSelector` | `true` | Hide mode tabs for focused experience |
| `showNavigation` | `true` | Hide prev/next for auto-play or static display |
| `showPlayPause` | `true` | Hide play/pause button |
| `showStepIndicator` | `true` | Hide step counter |

---

## additionalProps Reference

### Torch State Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `torchState` | `"on" \| "off"` | `"off"` | Initial state of the torch |
| `interactive` | `boolean` | `true` | Allow user to click torch to toggle |

### Component Highlighting

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `highlightComponents` | `string[]` | `[]` | Component IDs to highlight: `["lamp", "switch", "cells", "wires"]` |

### Circuit Visualization

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `showCircuit` | `boolean` | `false` | Show circuit diagram |
| `circuitComponents` | `CircuitComponent[]` | `[]` | Custom circuit components array |

**CircuitComponent Structure:**
```typescript
{
  id: string;
  type: "cell" | "battery" | "lamp" | "led" | "switch" | "wire" | "conductor" | "insulator";
  position: { x: number; y: number };
  connections: string[];  // IDs of connected components
  state?: "on" | "off" | "open" | "closed";
  polarity?: "correct" | "incorrect" | "neutral";
}
```

### Custom Colors

| Property | Type | Description |
|----------|------|-------------|
| `customColors` | `object` | Custom colors for torch components |

**CustomColors Structure:**
```typescript
{
  torchHead?: string;    // Hex color for torch head
  torchBody?: string;    // Hex color for torch body
  switchColor?: string;  // Hex color for switch
}
```

### Animation

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `animationSpeed` | `number` | `1` | Animation speed multiplier (1 = normal, 2 = 2x faster) |

---

## Tool Call Examples

### Example 1: Basic Torchlight Learning
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Learn About Torchlights",
  "data": {
    "toolName": "torchlight_circuit_tool",
    "parameters": {
      "initialMode": "demonstration",
      "showModeSelector": true,
      "additionalProps": {
        "torchState": "off",
        "interactive": true
      }
    }
  },
  "instructions_for_student": "Click on the torch to turn it on and off! Explore how it works."
}
```

### Example 2: Torch Turned On
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Torchlight - ON State",
  "data": {
    "toolName": "torchlight_circuit_tool",
    "parameters": {
      "initialMode": "demonstration",
      "showModeSelector": false,
      "additionalProps": {
        "torchState": "on",
        "highlightComponents": ["lamp", "switch"],
        "interactive": true
      }
    }
  },
  "instructions_for_student": "The torch is ON! Notice how the lamp glows and the switch is in the ON position."
}
```

### Example 3: Highlight Specific Components
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Torchlight Components",
  "data": {
    "toolName": "torchlight_circuit_tool",
    "parameters": {
      "initialMode": "demonstration",
      "additionalProps": {
        "highlightComponents": ["lamp", "cells", "wires"],
        "showCircuit": true
      }
    }
  },
  "instructions_for_student": "Focus on the highlighted components: lamp, cells, and wires!"
}
```

### Example 4: Custom Colored Torch
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Custom Torchlight",
  "data": {
    "toolName": "torchlight_circuit_tool",
    "parameters": {
      "initialMode": "demonstration",
      "additionalProps": {
        "torchState": "on",
        "customColors": {
          "torchHead": "#facc15",
          "torchBody": "#dc2626",
          "switchColor": "#10b981"
        }
      }
    }
  },
  "instructions_for_student": "This torch has custom colors! Notice the yellow head, red body, and green switch."
}
```

### Example 5: Circuit Diagram
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Torchlight Circuit Diagram",
  "data": {
    "toolName": "torchlight_circuit_tool",
    "parameters": {
      "initialMode": "demonstration",
      "additionalProps": {
        "showCircuit": true,
        "circuitComponents": [
          {
            "id": "cell1",
            "type": "cell",
            "position": { "x": 100, "y": 200 },
            "connections": ["wire1"],
            "state": "on"
          },
          {
            "id": "switch1",
            "type": "switch",
            "position": { "x": 200, "y": 200 },
            "connections": ["wire1", "wire2"],
            "state": "closed"
          },
          {
            "id": "lamp1",
            "type": "lamp",
            "position": { "x": 300, "y": 200 },
            "connections": ["wire2"],
            "state": "on"
          }
        ]
      }
    }
  },
  "instructions_for_student": "This shows the complete circuit diagram with all components connected!"
}
```

### Example 6: Practice Mode
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Practice: Torchlight Quiz",
  "data": {
    "toolName": "torchlight_circuit_tool",
    "parameters": {
      "initialMode": "practice",
      "showModeSelector": false,
      "showNavigation": true
    }
  },
  "instructions_for_student": "Answer the questions to test your understanding of torchlights!"
}
```

### Example 7: Real World Applications
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Real World Circuit Applications",
  "data": {
    "toolName": "torchlight_circuit_tool",
    "parameters": {
      "initialMode": "real_world",
      "showModeSelector": false
    }
  },
  "instructions_for_student": "Explore how circuits are used in everyday life!"
}
```

### Example 8: Minimal UI (Focused Learning)
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Torchlight Demo",
  "data": {
    "toolName": "torchlight_circuit_tool",
    "parameters": {
      "showModeSelector": false,
      "showNavigation": false,
      "showPlayPause": false,
      "showStepIndicator": false,
      "additionalProps": {
        "torchState": "on",
        "interactive": true
      }
    }
  },
  "instructions_for_student": "Click the torch to see it in action!"
}
```

### Example 9: Fast Animation
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Quick Torchlight Demo",
  "data": {
    "toolName": "torchlight_circuit_tool",
    "parameters": {
      "animationSpeed": 2,
      "autoPlayDuration": 4000,
      "additionalProps": {
        "animationSpeed": 2,
        "torchState": "on"
      }
    }
  },
  "instructions_for_student": "Watch the fast animation of the torchlight!"
}
```

### Example 10: Step-by-Step with Highlighting
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Torchlight Components Step-by-Step",
  "data": {
    "toolName": "torchlight_circuit_tool",
    "parameters": {
      "initialMode": "demonstration",
      "showNavigation": true,
      "additionalProps": {
        "highlightComponents": ["lamp"],
        "showCircuit": true
      }
    }
  },
  "instructions_for_student": "Use the navigation buttons to go through each component step by step!"
}
```

---

## Decision Tree for Agents

```
Student asks about torchlights/circuits
    │
    ├─ "What is a torchlight?" or "Teach me about torchlights"
    │   └─ Use: initialMode: "demonstration", showModeSelector: true
    │
    ├─ "Show me torch parts" or "What's inside a torch?"
    │   └─ Use: initialMode: "demonstration", navigate to parts step
    │
    ├─ "Turn the torch on" or "Show me the torch glowing"
    │   └─ Use: additionalProps: { torchState: "on", highlightComponents: ["lamp"] }
    │
    ├─ "Highlight the [component]" (lamp/switch/cells/wires)
    │   └─ Use: additionalProps: { highlightComponents: ["component_name"] }
    │
    ├─ "Show me the circuit diagram"
    │   └─ Use: additionalProps: { showCircuit: true, circuitComponents: [...] }
    │
    ├─ "Practice questions" or "Test my knowledge"
    │   └─ Use: initialMode: "practice"
    │
    ├─ "Real world examples" or "Where are circuits used?"
    │   └─ Use: initialMode: "real_world"
    │
    ├─ "Custom colors" or "Different colored torch"
    │   └─ Use: additionalProps: { customColors: { torchHead: "#color", ... } }
    │
    └─ "Faster animation" or "Slow down"
        └─ Use: animationSpeed: 2 (faster) or 0.5 (slower)
```

---

## Tips for Agents

1. **For basic learning**: Use `initialMode: "demonstration"` with default props
2. **For focused experience**: Set `showModeSelector: false` to hide mode tabs
3. **For static display**: Set `showNavigation: false, autoPlayDuration: 0`
4. **For highlighting**: Use `highlightComponents` array with component names: `["lamp", "switch", "cells", "wires"]`
5. **For circuit diagrams**: Provide `circuitComponents` array with proper connections
6. **For practice**: Always use `initialMode: "practice"` for quiz mode
7. **For real-world context**: Use `initialMode: "real_world"` to show applications
8. **For custom appearance**: Use `customColors` object to change torch colors
9. **For animation control**: Adjust `animationSpeed` (1 = normal, 2 = 2x faster, 0.5 = 2x slower)
10. **For interactive torch**: Keep `interactive: true` (default) to allow clicking

---

## Component Details

### TorchlightLearning Component
- **Purpose**: Interactive learning with torch demonstration
- **Features**: 
  - Clickable torch (on/off)
  - Component visualization (lamp, switch, cells, wires)
  - Step-by-step explanations
  - Animated transitions

### TorchlightPractice Component
- **Purpose**: Quiz questions to test understanding
- **Features**:
  - Multiple choice questions
  - Progress tracking
  - Score calculation
  - Answer review with feedback

### RealWorldApplications Component
- **Purpose**: Show real-world circuit applications
- **Features**:
  - Application cards (cooking, lighting, transportation, etc.)
  - Examples with descriptions
  - Visual representations
  - Usage categories

---

## Error Handling

- If `torchState` is invalid: Defaults to `"off"`
- If `highlightComponents` contains invalid names: Those won't highlight
- If `circuitComponents` have invalid connections: Circuit won't display properly
- If `customColors` has invalid hex: Uses default colors
- Invalid `initialMode`: Defaults to `"demonstration"`
- Empty `additionalProps`: Uses all default values

---

## Parameter Details

### Dimensions
- `width`: Component width (default: 800px)
- `height`: Component height (default: 600px)

### Mode Configuration
- `initialMode`: Starting mode - `"demonstration"`, `"practice"`, `"real_world"`, or `"hands_on"`
- `showModeSelector`: Show/hide mode tabs (default: true)
- `enabledModes`: Array of modes to enable (default: all modes)

### Navigation
- `showNavigation`: Show/hide prev/next buttons (default: true)
- `showPlayPause`: Show/hide play/pause button (default: true)
- `showStepIndicator`: Show/hide step counter (default: true)

### Animation
- `animationSpeed`: Speed multiplier (default: 1)
- `autoPlayDuration`: Auto-advance delay in ms (default: 8000, 0 = disabled)

### Theme
- `themeColor`: Primary color hex (default: "#3b82f6")
- `darkMode`: Enable dark mode (default: false)

---

## Best Practices

1. **Always provide clear instructions**: Use `instructions_for_student` field
2. **Use appropriate mode**: Match the student's request to the correct mode
3. **Leverage additionalProps**: Customize the tool for specific learning objectives
4. **Hide unnecessary UI**: Use visibility parameters for focused experiences
5. **Provide context**: Use real-world mode to show practical applications
6. **Test understanding**: Use practice mode after learning sessions
7. **Animate appropriately**: Use animationSpeed to match student's pace preference

---

## Integration Notes

The tool exports the following components:
- `TorchlightLearning`: Main learning component
- `TorchlightPractice`: Practice quiz component
- `RealWorldApplications`: Real-world examples component
- `CircuitVisualization`: Router component (switches between modes)
- `Navbar`: Navigation bar
- `LanguageSelector`: Language selection

All components accept `props?: CircuitToolProps['props']` for configuration.
