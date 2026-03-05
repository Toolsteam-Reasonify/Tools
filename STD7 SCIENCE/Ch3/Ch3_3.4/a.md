# Conductors & Insulators Circuit Tool - Agent Guide

## Overview

The **Conductors & Insulators Circuit Tool** is an interactive educational component that allows students to test different materials to determine if they conduct electricity. Students drag materials into a circuit gap and observe whether a bulb lights up, learning the difference between conductors and insulators through hands-on experimentation.

---

## Quick Reference

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `width` | number | 800 | Tool width in pixels |
| `height` | number | 600 | Tool height in pixels |
| `initialMode` | string | "learn" | Starting mode: "learn", "practice", "real_world", "hands_on" |
| `showModeSelector` | boolean | true | Show/hide mode tabs |
| `showNavigation` | boolean | true | Show/hide prev/next buttons |
| `themeColor` | string | "#3b82f6" | Primary theme color (hex) |
| `darkMode` | boolean | false | Enable dark mode |
| `additionalProps.materials` | array | DEFAULT_MATERIALS | Custom materials to test |
| `additionalProps.testMaterial` | string | null | Auto-place material ID in gap |
| `additionalProps.showCurrentFlow` | boolean | true | Animate current flow |
| `additionalProps.interactive` | boolean | true | Allow user interaction |
| `additionalProps.allowDrag` | boolean | true | Allow dragging materials |

---

## Default Materials

The tool includes 8 default materials:

**Conductors:**
- Iron rod (metal)
- Copper rod (excellent conductor)
- Pencil graphite (carbon-based conductor)

**Insulators:**
- Wood (natural insulator)
- Plastic (synthetic insulator)
- Pencil body (wood)
- Rubber (electrical insulator)
- Glass (transparent insulator)

---

## Tool Call Examples

### Example 1: Basic Circuit Tester (Default)

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Conductors & Insulators Circuit",
  "data": {
    "toolName": "conductors_insulators_circuit_tool",
    "parameters": {}
  },
  "instructions_for_student": "Drag materials into the circuit gap to test if they conduct electricity!"
}
```

**Use case:** General introduction to conductors and insulators

---

### Example 2: Test Specific Material (Copper)

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Testing Copper Wire",
  "data": {
    "toolName": "conductors_insulators_circuit_tool",
    "parameters": {
      "additionalProps": {
        "testMaterial": "copper",
        "showCurrentFlow": true
      }
    }
  },
  "instructions_for_student": "Look! The copper wire completes the circuit and the bulb lights up because copper is a conductor."
}
```

**Use case:** Demonstrate that a specific material conducts electricity

---

### Example 3: Test Insulator (Plastic)

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Why Doesn't the Bulb Light?",
  "data": {
    "toolName": "conductors_insulators_circuit_tool",
    "parameters": {
      "additionalProps": {
        "testMaterial": "plastic",
        "showCurrentFlow": false
      }
    }
  },
  "instructions_for_student": "The plastic blocks electricity, so the circuit is incomplete and the bulb stays off."
}
```

**Use case:** Show that insulators don't complete circuits

---

### Example 4: Custom Materials (Advanced)

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Test Household Materials",
  "data": {
    "toolName": "conductors_insulators_circuit_tool",
    "parameters": {
      "additionalProps": {
        "materials": [
          {
            "id": "aluminum_foil",
            "label": "Aluminum foil",
            "type": "conductor",
            "color": "#C0C0C0",
            "description": "a lightweight metal used in cooking that conducts electricity"
          },
          {
            "id": "paper",
            "label": "Paper",
            "type": "insulator",
            "color": "#F5DEB3",
            "description": "made from wood pulp, does not conduct electricity when dry"
          },
          {
            "id": "steel_spoon",
            "label": "Steel spoon",
            "type": "conductor",
            "color": "#708090",
            "description": "made of steel alloy, conducts electricity well"
          },
          {
            "id": "ceramic",
            "label": "Ceramic tile",
            "type": "insulator",
            "color": "#D2691E",
            "description": "a hard material that blocks electricity"
          }
        ],
        "showCurrentFlow": true
      }
    }
  },
  "instructions_for_student": "Test these common household materials to see which conduct electricity!"
}
```

**Use case:** Test materials students might find at home

---

### Example 5: Silent Demo (No Controls)

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Circuit Demonstration",
  "data": {
    "toolName": "conductors_insulators_circuit_tool",
    "parameters": {
      "showModeSelector": false,
      "showNavigation": false,
      "additionalProps": {
        "testMaterial": "iron",
        "showCurrentFlow": true,
        "interactive": false
      }
    }
  },
  "instructions_for_student": "Watch how the iron rod completes the circuit and allows electricity to flow!"
}
```

**Use case:** Teacher-led demonstration without student interaction

---

### Example 6: Practice Mode

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Practice: Identify Conductors",
  "data": {
    "toolName": "conductors_insulators_circuit_tool",
    "parameters": {
      "initialMode": "practice",
      "showModeSelector": true,
      "additionalProps": {
        "showCurrentFlow": true
      }
    }
  },
  "instructions_for_student": "Test each material and predict whether it will conduct electricity before placing it in the circuit!"
}
```

**Use case:** Student practice with prediction prompts

---

### Example 7: Focus on Metals

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Why Are Metals Good Conductors?",
  "data": {
    "toolName": "conductors_insulators_circuit_tool",
    "parameters": {
      "additionalProps": {
        "materials": [
          {
            "id": "copper",
            "label": "Copper wire",
            "type": "conductor",
            "color": "#C98A5A",
            "description": "has free electrons that move easily"
          },
          {
            "id": "iron",
            "label": "Iron nail",
            "type": "conductor",
            "color": "#333333",
            "description": "a common metal that conducts electricity"
          },
          {
            "id": "aluminum",
            "label": "Aluminum",
            "type": "conductor",
            "color": "#C0C0C0",
            "description": "lightweight metal, good conductor"
          },
          {
            "id": "gold",
            "label": "Gold",
            "type": "conductor",
            "color": "#FFD700",
            "description": "excellent conductor, used in electronics"
          }
        ],
        "showCurrentFlow": true
      }
    }
  },
  "instructions_for_student": "All metals conduct electricity! Test different metals to see how they all make the bulb light up."
}
```

**Use case:** Teach that all metals are conductors

---

### Example 8: Safety Education

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Why Are Wires Covered in Plastic?",
  "data": {
    "toolName": "conductors_insulators_circuit_tool",
    "parameters": {
      "additionalProps": {
        "materials": [
          {
            "id": "bare_copper",
            "label": "Bare copper",
            "type": "conductor",
            "color": "#C98A5A",
            "description": "conducts electricity - dangerous to touch!"
          },
          {
            "id": "insulated_wire",
            "label": "Plastic coating",
            "type": "insulator",
            "color": "#FF0000",
            "description": "protects us from electric shock"
          }
        ],
        "customMarkers": [
          {
            "position": { "x": 250, "y": 80 },
            "label": "⚠️ Safety First!",
            "color": "#ef4444"
          }
        ]
      }
    }
  },
  "instructions_for_student": "Copper conducts electricity, but plastic doesn't. That's why wires have plastic coating to keep us safe!"
}
```

**Use case:** Electrical safety education

---

### Example 9: Real World Applications

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Conductors in Everyday Life",
  "data": {
    "toolName": "conductors_insulators_circuit_tool",
    "parameters": {
      "initialMode": "real_world",
      "additionalProps": {
        "materials": [
          {
            "id": "phone_wire",
            "label": "Phone charger wire",
            "type": "conductor",
            "color": "#4169E1",
            "description": "uses copper to carry electricity to charge your phone"
          },
          {
            "id": "plug_casing",
            "label": "Plug casing",
            "type": "insulator",
            "color": "#000000",
            "description": "plastic protects us from the conducting metal inside"
          }
        ]
      }
    }
  },
  "instructions_for_student": "Phone chargers use both conductors (to carry electricity) and insulators (to keep us safe)!"
}
```

**Use case:** Connect to real-world applications

---

### Example 10: Dark Mode Theme

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Circuit Tester - Night Mode",
  "data": {
    "toolName": "conductors_insulators_circuit_tool",
    "parameters": {
      "darkMode": true,
      "themeColor": "#8b5cf6",
      "additionalProps": {
        "showCurrentFlow": true
      }
    }
  },
  "instructions_for_student": "Test materials to see which ones complete the circuit!"
}
```

**Use case:** Better visibility in low-light environments

---

## Decision Tree for Agents

```
Student asks about electricity/conductivity
    │
    ├─ "What is a conductor?"
    │   └─ Use: Default materials, initialMode: "learn"
    │
    ├─ "Show me how a circuit works"
    │   └─ Use: testMaterial: "copper", showCurrentFlow: true
    │
    ├─ "Why doesn't [material] conduct?"
    │   └─ Use: testMaterial: [material_id], showCurrentFlow: false
    │
    ├─ "Test if [material] conducts"
    │   └─ Use: additionalProps.materials with custom material
    │
    ├─ "Compare conductors and insulators"
    │   └─ Use: Default materials, interactive: true
    │
    ├─ "Why are wires covered in plastic?"
    │   └─ Use: Custom materials showing bare wire vs insulated
    │
    ├─ "Practice identifying materials"
    │   └─ Use: initialMode: "practice"
    │
    ├─ "Show me without interaction"
    │   └─ Use: interactive: false, showModeSelector: false
    │
    └─ "Real world examples"
        └─ Use: initialMode: "real_world", custom materials
```

---

## Common Patterns

### 1. Demonstrate a Conductor

```json
{
  "additionalProps": {
    "testMaterial": "copper",  // or "iron", "graphite"
    "showCurrentFlow": true
  }
}
```

### 2. Demonstrate an Insulator

```json
{
  "additionalProps": {
    "testMaterial": "plastic",  // or "wood", "rubber", "glass"
    "showCurrentFlow": false
  }
}
```

### 3. Compare Two Materials

```json
{
  "additionalProps": {
    "materials": [
      {
        "id": "material1",
        "label": "Conductor name",
        "type": "conductor",
        "color": "#RRGGBB",
        "description": "why it conducts"
      },
      {
        "id": "material2",
        "label": "Insulator name",
        "type": "insulator",
        "color": "#RRGGBB",
        "description": "why it doesn't conduct"
      }
    ]
  }
}
```

### 4. Static Demo (Teacher Mode)

```json
{
  "showModeSelector": false,
  "showNavigation": false,
  "additionalProps": {
    "testMaterial": "copper",
    "interactive": false,
    "showCurrentFlow": true
  }
}
```

### 5. Full Interaction (Student Mode)

```json
{
  "showModeSelector": true,
  "showNavigation": true,
  "additionalProps": {
    "interactive": true,
    "allowDrag": true,
    "showCurrentFlow": true
  }
}
```

---

## Material Properties Reference

### Creating Custom Materials

Each material requires these properties:

```typescript
{
  "id": "unique_identifier",        // lowercase, no spaces
  "label": "Display Name",          // shown to student
  "type": "conductor" | "insulator", // determines bulb behavior
  "color": "#RRGGBB",               // hex color for visual
  "description": "educational text"  // why it conducts/doesn't
}
```

### Common Material Colors

| Material | Hex Color | RGB |
|----------|-----------|-----|
| Copper | #C98A5A | 201, 138, 90 |
| Iron/Steel | #333333 | 51, 51, 51 |
| Aluminum | #C0C0C0 | 192, 192, 192 |
| Gold | #FFD700 | 255, 215, 0 |
| Silver | #C0C0C0 | 192, 192, 192 |
| Wood | #8B5A2B | 139, 90, 43 |
| Plastic (blue) | #1E90FF | 30, 144, 255 |
| Rubber (pink) | #FF69B4 | 255, 105, 180 |
| Glass | #87CEEB | 135, 206, 235 |
| Paper | #F5DEB3 | 245, 222, 179 |

---

## Tips for Agents

1. **For simple demonstrations**: Use `testMaterial` to auto-place material in circuit
2. **For exploration**: Use default materials with `interactive: true`
3. **For focused learning**: Create custom `materials` array with 2-4 items
4. **For safety lessons**: Combine conductor + insulator with `customMarkers`
5. **For minimal UI**: Set `showModeSelector: false`, `showNavigation: false`
6. **For assessment**: Use `initialMode: "practice"`
7. **For night viewing**: Use `darkMode: true`
8. **For emphasis**: Customize `themeColor` to match topic

---

## Error Handling

| Issue | Solution |
|-------|----------|
| Invalid material ID in `testMaterial` | Material won't appear, circuit stays empty |
| Missing required material properties | Material won't render |
| Invalid color format | Defaults to gray |
| Invalid `type` value | Defaults to "insulator" |
| Empty `materials` array | Uses default materials |
| Invalid `initialMode` | Defaults to "learn" |

---

## Educational Notes

### Learning Sequence

1. **Introduction**: Show what conductors/insulators are (default materials)
2. **Demonstration**: Use `testMaterial` to show specific examples
3. **Prediction**: Use practice mode with prediction UI
4. **Exploration**: Full interactive mode with all materials
5. **Application**: Real-world examples with custom materials

### Key Concepts Covered

- ⚡ **Conductors**: Materials that allow electricity to flow (metals)
- 🚫 **Insulators**: Materials that block electricity (non-metals)
- 🔋 **Complete Circuit**: Closed path for current to flow
- 💡 **Current Flow**: Movement of electrons through conductors
- ⚠️ **Safety**: Why insulators protect us from electric shock

---

## Performance Considerations

- Animations are CSS-based for 60fps performance
- SVG rendering is optimized for smooth interactions
- Drag detection uses efficient event listeners
- State updates are batched for better performance
- Component is fully self-contained (no external dependencies)

---

## Accessibility Features

- Semantic HTML structure
- Keyboard navigation support
- High contrast mode available
- Clear visual feedback
- Descriptive labels and ARIA attributes
- Screen reader compatible

---

## Version History

**v1.0.0** - Initial release
- Basic circuit visualization
- Drag-and-drop interaction
- 8 default materials
- Custom material support
- Prediction UI
- Current flow animation
- Test results tracking
- Dark mode support

---

## Support & Feedback

For issues, improvements, or questions about this tool, please provide:
- Specific use case or student question
- Desired behavior
- Current behavior (if different)
- Tool call JSON (if applicable)

---

## License

Educational use only. Part of the Reasonify EdTech interactive tools suite.