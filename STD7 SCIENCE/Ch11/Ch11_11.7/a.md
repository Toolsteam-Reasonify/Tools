# Pinhole Camera Tool - Agent Instructions

## Overview

The Pinhole Camera Tool is an interactive educational component for teaching light properties, image formation, and optical principles. It demonstrates how light travels in straight lines and forms inverted images through a tiny hole. The tool supports dynamic content via `additionalProps` allowing agents to customize object types, colors, ray animations, and diagram labels.

---

## Quick Reference Table

| Student Request | Mode | Key Parameters |
|-----------------|------|----------------|
| "What is a pinhole camera?" | learn | `initialMode: "learn"` |
| "How does a pinhole camera work?" | learn | `initialMode: "learn"` |
| "Practice pinhole camera questions" | practice | `initialMode: "practice"` |
| "Show me real-world uses" | realWorld | `initialMode: "realWorld"` |
| "Use a different colored object" | learn | `additionalProps: { objectColor: "#FF6B6B" }` |
| "Show me with an arrow instead" | learn | `additionalProps: { objectType: "arrow" }` |
| "Hide the light rays" | learn | `additionalProps: { showRays: false }` |
| "Make the pinhole bigger" | learn | `additionalProps: { pinholeSize: 5 }` |

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

### Object Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `objectColor` | string | "#FFD700" | Color of the object (candle/arrow) |
| `objectType` | string | "candle" | Type: "candle", "arrow", "circle", or "square" |
| `showRays` | boolean | true | Show light rays in diagram |
| `rayColor` | string | "#FFD700" | Color of light rays |

### Pinhole Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `pinholeSize` | number | 3 | Size of pinhole in pixels |
| `pinholeColor` | string | "#000" | Color of the pinhole |

### Screen Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `screenColor` | string | "#E8E8E8" | Color of the screen |
| `showInvertedImage` | boolean | true | Show inverted image on screen |

### Animation Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `animationSpeed` | number | 1 | Speed multiplier for animations |
| `showRayAnimation` | boolean | true | Enable animated light rays |

### Custom Labels

```json
{
  "customLabels": {
    "object": "Light Source",
    "pinhole": "Tiny Hole",
    "screen": "Image Screen",
    "top": "TOP",
    "bottom": "BOTTOM"
  }
}
```

### Interactive Features

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `interactive` | boolean | false | Enable interactive features |
| `allowRayControl` | boolean | false | Allow user to control rays |

---

## Tool Call Examples

### Example 1: Basic Pinhole Camera (Learn Mode)

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Learn About Pinhole Cameras",
  "data": {
    "toolName": "pinhole_camera_tool",
    "parameters": {
      "initialMode": "learn",
      "showModeSelector": true,
      "additionalProps": {
        "objectColor": "#FFD700",
        "objectType": "candle",
        "showRays": true,
        "rayColor": "#FFD700"
      }
    }
  },
  "instructions_for_student": "Explore how a pinhole camera forms images!"
}
```

### Example 2: Custom Colored Object

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Pinhole Camera with Red Object",
  "data": {
    "toolName": "pinhole_camera_tool",
    "parameters": {
      "initialMode": "learn",
      "showModeSelector": false,
      "additionalProps": {
        "objectColor": "#FF6B6B",
        "objectType": "candle",
        "rayColor": "#FF6B6B",
        "showRays": true
      }
    }
  },
  "instructions_for_student": "Notice how the red light rays form an inverted image!"
}
```

### Example 3: Arrow Object Instead of Candle

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Pinhole Camera with Arrow",
  "data": {
    "toolName": "pinhole_camera_tool",
    "parameters": {
      "initialMode": "learn",
      "showModeSelector": false,
      "additionalProps": {
        "objectType": "arrow",
        "objectColor": "#3498DB",
        "rayColor": "#3498DB",
        "showRayAnimation": true
      }
    }
  },
  "instructions_for_student": "See how an arrow object also forms an inverted image!"
}
```

### Example 4: Practice Mode

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Test Your Knowledge",
  "data": {
    "toolName": "pinhole_camera_tool",
    "parameters": {
      "initialMode": "practice",
      "showModeSelector": true,
      "additionalProps": {
        "objectColor": "#FFD700",
        "showRays": true
      }
    }
  },
  "instructions_for_student": "Answer 10 questions about pinhole cameras!"
}
```

### Example 5: Real World Applications

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Real World Uses",
  "data": {
    "toolName": "pinhole_camera_tool",
    "parameters": {
      "initialMode": "realWorld",
      "showModeSelector": true,
      "additionalProps": {
        "objectColor": "#FFD700",
        "showRays": true
      }
    }
  },
  "instructions_for_student": "Discover how pinhole cameras are used in everyday life!"
}
```

### Example 6: Without Light Rays (Simplified View)

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Pinhole Camera - Simple View",
  "data": {
    "toolName": "pinhole_camera_tool",
    "parameters": {
      "initialMode": "learn",
      "showModeSelector": false,
      "showNavigation": false,
      "additionalProps": {
        "showRays": false,
        "showInvertedImage": true,
        "objectType": "candle",
        "objectColor": "#FFD700"
      }
    }
  },
  "instructions_for_student": "Focus on the object and its inverted image!"
}
```

### Example 7: Large Pinhole Demonstration

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Large Pinhole Effect",
  "data": {
    "toolName": "pinhole_camera_tool",
    "parameters": {
      "initialMode": "learn",
      "showModeSelector": false,
      "additionalProps": {
        "pinholeSize": 8,
        "pinholeColor": "#000",
        "objectColor": "#FFD700",
        "showRays": true,
        "rayColor": "#FFD700"
      }
    }
  },
  "instructions_for_student": "Notice how a larger pinhole affects image clarity!"
}
```

### Example 8: Custom Labels

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Labeled Pinhole Camera",
  "data": {
    "toolName": "pinhole_camera_tool",
    "parameters": {
      "initialMode": "learn",
      "showModeSelector": false,
      "additionalProps": {
        "objectColor": "#FFD700",
        "showRays": true,
        "customLabels": {
          "object": "Light Source",
          "pinhole": "Tiny Hole",
          "screen": "Image Screen",
          "top": "TOP",
          "bottom": "BOTTOM"
        }
      }
    }
  },
  "instructions_for_student": "Study each part of the pinhole camera!"
}
```

### Example 9: Animated Rays

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Animated Light Rays",
  "data": {
    "toolName": "pinhole_camera_tool",
    "parameters": {
      "initialMode": "learn",
      "showModeSelector": false,
      "additionalProps": {
        "showRayAnimation": true,
        "animationSpeed": 1.5,
        "rayColor": "#FFD700",
        "objectColor": "#FFA500",
        "showRays": true
      }
    }
  },
  "instructions_for_student": "Watch how light rays travel and cross at the pinhole!"
}
```

### Example 10: Minimal UI (Focused Learning)

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Pinhole Camera Focus",
  "data": {
    "toolName": "pinhole_camera_tool",
    "parameters": {
      "showModeSelector": false,
      "showNavigation": false,
      "showPlayPause": false,
      "showStepIndicator": false,
      "autoPlayDuration": 0,
      "initialMode": "learn",
      "additionalProps": {
        "objectColor": "#FFD700",
        "objectType": "candle",
        "showRays": true,
        "rayColor": "#FFD700"
      }
    }
  },
  "instructions_for_student": "Focus on understanding the pinhole camera principle!"
}
```

### Example 11: Different Object Types

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Circle Object in Pinhole Camera",
  "data": {
    "toolName": "pinhole_camera_tool",
    "parameters": {
      "initialMode": "learn",
      "showModeSelector": false,
      "additionalProps": {
        "objectType": "circle",
        "objectColor": "#9B59B6",
        "rayColor": "#9B59B6",
        "showRays": true
      }
    }
  },
  "instructions_for_student": "See how a circular object appears inverted!"
}
```

### Example 12: Dark Mode with Custom Colors

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Pinhole Camera - Dark Theme",
  "data": {
    "toolName": "pinhole_camera_tool",
    "parameters": {
      "initialMode": "learn",
      "darkMode": true,
      "themeColor": "#8B5CF6",
      "additionalProps": {
        "objectColor": "#FBBF24",
        "rayColor": "#FBBF24",
        "screenColor": "#374151",
        "showRays": true
      }
    }
  },
  "instructions_for_student": "Study the pinhole camera in dark mode!"
}
```

---

## Decision Tree for Agents

```
Student asks about light/optics/pinhole camera
    │
    ├─ "What is a pinhole camera?"
    │   └─ Use: initialMode: "learn", showModeSelector: true
    │
    ├─ "How does it work?"
    │   └─ Use: initialMode: "learn", showModeSelector: false
    │
    ├─ "Practice questions" or "Test me"
    │   └─ Use: initialMode: "practice"
    │
    ├─ "Real world examples" or "Where is it used?"
    │   └─ Use: initialMode: "realWorld"
    │
    ├─ "Use a [color] object"
    │   └─ Use: additionalProps: { objectColor: "[hex color]" }
    │
    ├─ "Show me with an arrow/circle/square"
    │   └─ Use: additionalProps: { objectType: "arrow|circle|square" }
    │
    ├─ "Hide the rays" or "Simplify the view"
    │   └─ Use: additionalProps: { showRays: false }
    │
    ├─ "Make it bigger/smaller"
    │   └─ Use: additionalProps: { pinholeSize: [number] }
    │
    ├─ "Animate the rays"
    │   └─ Use: additionalProps: { showRayAnimation: true, animationSpeed: 1.5 }
    │
    └─ "Focus mode" or "Minimal view"
        └─ Use: showModeSelector: false, showNavigation: false, showPlayPause: false
```

---

## Tips for Agents

1. **For basic learning**: Use `initialMode: "learn"` with default `additionalProps`
2. **For visual variety**: Change `objectColor` and `rayColor` to match student preferences
3. **For different objects**: Use `objectType: "arrow"`, `"circle"`, or `"square"` instead of `"candle"`
4. **For simplified view**: Set `showRays: false` to focus on object and image only
5. **For emphasis on pinhole**: Increase `pinholeSize` to make it more visible
6. **For minimal distractions**: Set all visibility controls to `false` for focused learning
7. **For practice**: Always use `initialMode: "practice"` for quiz mode
8. **For real-world context**: Use `initialMode: "realWorld"` to show applications
9. **For custom teaching**: Use `customLabels` to add specific terminology
10. **For dark theme**: Set `darkMode: true` and adjust colors accordingly

---

## Error Handling

- If `objectType` is invalid: Defaults to `"candle"`
- If `pinholeSize` is too large (>10): May cause visual issues, recommend 3-5
- If colors are invalid hex: Component will use default colors
- Invalid `initialMode`: Defaults to `"learn"`
- Empty `additionalProps`: Uses all default values
- If `showRays: false` and `showRayAnimation: true`: Animation won't show (expected behavior)

---

## Mode Descriptions

### Learn Mode
- **Purpose**: Step-by-step explanation of pinhole camera concepts
- **Sections**: 
  - What is a Pinhole Camera?
  - How Does it Work?
  - Key Observations
  - Comparison with Plane Mirror
- **Best for**: First-time learners, concept introduction

### Practice Mode
- **Purpose**: Interactive quiz to test understanding
- **Questions**: 10 multiple-choice questions
- **Topics**: Basic concepts, image formation, light behavior, comparisons
- **Best for**: Assessment, reinforcement, review

### Real World Mode
- **Purpose**: Show practical applications
- **Applications**: 6 real-world examples
- **Categories**: Astronomy, Photography, Biology, Architecture, Art, Education
- **Best for**: Contextual learning, motivation, deeper understanding

---

## Color Recommendations

### Object Colors
- **Gold/Yellow** (#FFD700): Default, represents candle flame
- **Red** (#FF6B6B): High contrast, attention-grabbing
- **Blue** (#3498DB): Calm, professional
- **Orange** (#FFA500): Warm, energetic
- **Purple** (#9B59B6): Creative, unique

### Ray Colors
- Match `rayColor` with `objectColor` for consistency
- Use bright colors (#FFD700, #FF6B6B) for visibility
- Use darker colors for subtle effects

### Screen Colors
- **Light Gray** (#E8E8E8): Default, good contrast
- **White** (#FFFFFF): Maximum contrast
- **Dark Gray** (#374151): For dark mode

---

## Animation Tips

- `animationSpeed: 1` = Normal speed
- `animationSpeed: 0.5` = Slow motion (good for teaching)
- `animationSpeed: 2` = Fast (good for review)
- `showRayAnimation: true` makes rays pulse/fade for attention
- Combine with `showRays: true` for full effect

---

## Accessibility Considerations

- Use high contrast colors for visibility
- Ensure `objectColor` and `rayColor` are different from background
- For colorblind users, use different `objectType` shapes
- Provide text descriptions when using custom labels
- Test with `darkMode: true` for low-light environments
