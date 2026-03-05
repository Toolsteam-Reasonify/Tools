# Plane Mirror Tool - JSON Schema & Agent README

## Tool Overview

**Tool Name**: `plane_mirror_tool`  
**Topic**: Images Formed in a Plane Mirror  
**Modes**: Learn, Practice, Real World, Hands-On  
**Educational Level**: NCERT Grade 7-8 Science

---

## JSON Schema

```json
{
  "frontend_action": "show_interactive_tool",
  "title": string,
  "data": {
    "toolName": "plane_mirror_tool",
    "parameters": {
      "width": number,                    // Default: 800
      "height": number,                   // Default: 600
      
      "data": {
        "topic": string,
        "description": string
      },
      
      "steps": StepDataInterface[],       // Custom steps (optional)
      
      "initialMode": "learn" | "practice" | "real_world" | "hands_on",
      "showModeSelector": boolean,         // Default: true
      "enabledModes": ModeType[],          // Default: all modes
      
      "showNavigation": boolean,           // Default: true
      "showPlayPause": boolean,            // Default: true
      "showStepIndicator": boolean,        // Default: true
      
      "initialStep": number,               // Starting step ID
      "filterSteps": number[],             // Only show these steps
      
      "animationSpeed": number,            // Default: 1 (multiplier)
      "autoPlayDuration": number,          // Default: 8000ms
      
      "themeColor": string,                // Default: "#3b82f6"
      "darkMode": boolean,                 // Default: false
      
      "additionalProps": {
        "objectDistance": number,          // Default: 30 (pixels from mirror)
        "objectHeight": number,            // Default: 40 (pixels)
        "showRays": boolean,               // Default: true
        "showImageFormation": boolean,     // Default: true
        "showMeasurements": boolean,       // Default: true
        "mirrorPosition": "center" | "left" | "right",
        "objectType": "arrow" | "person" | "candle" | "tree" | "custom",
        "customObject": {
          "shape": string,
          "color": string,
          "label": string
        },
        "highlightProperties": [
          "laterally_inverted",
          "same_size", 
          "same_distance",
          "virtual",
          "erect"
        ],
        "animationStyle": "slow" | "normal" | "fast"
      }
    }
  },
  "instructions_for_student": string
}
```

---

## additionalProps Interface Details

```typescript
interface PlaneMirrorAdditionalProps {
  // Object positioning
  objectDistance?: number;              // Distance from mirror in pixels (default: 30)
  objectHeight?: number;                // Height of object in pixels (default: 40)
  mirrorPosition?: 'center' | 'left' | 'right';  // Mirror placement
  
  // Object appearance
  objectType?: 'arrow' | 'person' | 'candle' | 'tree' | 'custom';
  customObject?: {
    shape: string;                      // SVG path or shape type
    color: string;                      // Hex color code
    label?: string;                     // Optional label
  };
  
  // Visual controls
  showRays?: boolean;                   // Show light rays (default: true)
  showImageFormation?: boolean;         // Animate image formation (default: true)
  showMeasurements?: boolean;           // Show distance measurements (default: true)
  
  // Educational highlights
  highlightProperties?: (
    'laterally_inverted' | 
    'same_size' | 
    'same_distance' | 
    'virtual' | 
    'erect'
  )[];
  
  // Animation settings
  animationStyle?: 'slow' | 'normal' | 'fast';  // Animation speed preset
}
```

---

## Quick Reference Table

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `objectDistance` | number | 30 | Distance of object from mirror (px) |
| `objectHeight` | number | 40 | Height of object (px) |
| `showRays` | boolean | true | Display light rays |
| `showImageFormation` | boolean | true | Animate image formation process |
| `showMeasurements` | boolean | true | Show distance/height measurements |
| `mirrorPosition` | string | "center" | Mirror placement: center/left/right |
| `objectType` | string | "arrow" | Object shape: arrow/person/candle/tree |
| `highlightProperties` | array | [] | Properties to emphasize |
| `animationStyle` | string | "normal" | Animation speed: slow/normal/fast |

---

## Mode-Specific Content

### Learn Mode (Default Steps 1-4)
- **Step 1**: What is a Plane Mirror?
- **Step 2**: Image Formation with light rays
- **Step 3**: Properties of mirror images
- **Step 4**: Lateral inversion concept

### Practice Mode (Steps 5-7)
- **Step 5**: Position quiz - Where is the image?
- **Step 6**: Size quiz - Image size comparison
- **Step 7**: Lateral inversion challenge

### Real World Mode (Steps 8-10)
- **Step 8**: Ambulance writing example
- **Step 9**: Barber's mirror setup
- **Step 10**: Periscope application

### Hands-On Mode (Steps 11-12)
- **Step 11**: Interactive drag-and-drop mirror lab
- **Step 12**: Ray tracing activity

---

## Tool Call Examples

### Example 1: Basic Introduction
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Introduction to Plane Mirrors",
  "data": {
    "toolName": "plane_mirror_tool",
    "parameters": {
      "initialMode": "learn",
      "additionalProps": {
        "objectType": "person",
        "showRays": true,
        "showImageFormation": true
      }
    }
  },
  "instructions_for_student": "Watch how your reflection forms in a mirror!"
}
```

### Example 2: Focus on Properties
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Properties of Mirror Images",
  "data": {
    "toolName": "plane_mirror_tool",
    "parameters": {
      "initialMode": "learn",
      "filterSteps": [3],
      "additionalProps": {
        "objectType": "arrow",
        "showMeasurements": true,
        "highlightProperties": ["same_size", "same_distance", "laterally_inverted"]
      }
    }
  },
  "instructions_for_student": "Notice these important properties of plane mirror images!"
}
```

### Example 3: Lateral Inversion Demo
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Understanding Lateral Inversion",
  "data": {
    "toolName": "plane_mirror_tool",
    "parameters": {
      "initialMode": "learn",
      "filterSteps": [4],
      "additionalProps": {
        "objectType": "person",
        "highlightProperties": ["laterally_inverted"],
        "animationStyle": "slow"
      }
    }
  },
  "instructions_for_student": "See how left and right get reversed in a mirror!"
}
```

### Example 4: Practice Quiz
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Test Your Knowledge",
  "data": {
    "toolName": "plane_mirror_tool",
    "parameters": {
      "initialMode": "practice",
      "showModeSelector": false,
      "additionalProps": {
        "objectType": "arrow",
        "objectDistance": 50,
        "showMeasurements": true
      }
    }
  },
  "instructions_for_student": "Answer questions about mirror images!"
}
```

### Example 5: Ambulance Example
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Why is AMBULANCE Written Backwards?",
  "data": {
    "toolName": "plane_mirror_tool",
    "parameters": {
      "initialMode": "real_world",
      "filterSteps": [8],
      "showModeSelector": false,
      "additionalProps": {
        "animationStyle": "normal"
      }
    }
  },
  "instructions_for_student": "Discover why emergency vehicles have reversed writing!"
}
```

### Example 6: Interactive Lab
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Mirror Lab - Drag the Object",
  "data": {
    "toolName": "plane_mirror_tool",
    "parameters": {
      "initialMode": "hands_on",
      "filterSteps": [11],
      "additionalProps": {
        "objectType": "candle",
        "showRays": true,
        "showMeasurements": true,
        "mirrorPosition": "center"
      }
    }
  },
  "instructions_for_student": "Move the object and watch the image move with it!"
}
```

### Example 7: Candle Reflection Demo
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Candle in a Mirror",
  "data": {
    "toolName": "plane_mirror_tool",
    "parameters": {
      "initialMode": "learn",
      "filterSteps": [2],
      "additionalProps": {
        "objectType": "candle",
        "objectDistance": 40,
        "objectHeight": 60,
        "showRays": true,
        "showImageFormation": true,
        "animationStyle": "slow"
      }
    }
  },
  "instructions_for_student": "Watch how the candle's image forms behind the mirror!"
}
```

### Example 8: Periscope Application
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "How Periscopes Work",
  "data": {
    "toolName": "plane_mirror_tool",
    "parameters": {
      "initialMode": "real_world",
      "filterSteps": [10],
      "showModeSelector": false,
      "additionalProps": {
        "showRays": true,
        "animationStyle": "normal"
      }
    }
  },
  "instructions_for_student": "See how submarines use two mirrors to see above water!"
}
```

### Example 9: Ray Tracing Activity
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Draw Light Rays",
  "data": {
    "toolName": "plane_mirror_tool",
    "parameters": {
      "initialMode": "hands_on",
      "filterSteps": [12],
      "additionalProps": {
        "objectType": "arrow",
        "showRays": false,
        "showImageFormation": false
      }
    }
  },
  "instructions_for_student": "Draw the path of light rays from object to mirror to your eyes!"
}
```

### Example 10: Distance Comparison
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Object and Image Distances",
  "data": {
    "toolName": "plane_mirror_tool",
    "parameters": {
      "initialMode": "learn",
      "filterSteps": [2, 3],
      "additionalProps": {
        "objectType": "arrow",
        "objectDistance": 60,
        "showMeasurements": true,
        "highlightProperties": ["same_distance"],
        "showRays": true
      }
    }
  },
  "instructions_for_student": "Notice how the image is the same distance behind the mirror!"
}
```

### Example 11: Minimal UI - Auto Demo
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Mirror Reflection",
  "data": {
    "toolName": "plane_mirror_tool",
    "parameters": {
      "showModeSelector": false,
      "showNavigation": false,
      "showPlayPause": false,
      "showStepIndicator": false,
      "initialMode": "learn",
      "filterSteps": [2],
      "autoPlayDuration": 0,
      "additionalProps": {
        "objectType": "person",
        "showRays": true,
        "showImageFormation": true
      }
    }
  },
  "instructions_for_student": "Here's how your reflection appears in a mirror!"
}
```

### Example 12: Dark Mode with Custom Colors
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Mirror Physics (Dark Mode)",
  "data": {
    "toolName": "plane_mirror_tool",
    "parameters": {
      "darkMode": true,
      "themeColor": "#10b981",
      "initialMode": "learn",
      "additionalProps": {
        "objectType": "arrow",
        "showRays": true,
        "showMeasurements": true
      }
    }
  },
  "instructions_for_student": "Explore mirror properties in dark mode!"
}
```

---

## Decision Tree for Agents

```
Student asks about mirrors/reflection
    │
    ├─ "What is a plane mirror?" or "How do mirrors work?"
    │   └─ Use: initialMode: "learn", filterSteps: [1, 2]
    │
    ├─ "Why is my image reversed?" or "What is lateral inversion?"
    │   └─ Use: initialMode: "learn", filterSteps: [4]
    │       additionalProps: { highlightProperties: ["laterally_inverted"] }
    │
    ├─ "Where is the image formed?" or "Image position question"
    │   └─ Use: initialMode: "learn", filterSteps: [2, 3]
    │       additionalProps: { showMeasurements: true }
    │
    ├─ "What are properties of mirror images?"
    │   └─ Use: initialMode: "learn", filterSteps: [3]
    │       additionalProps: { 
    │         highlightProperties: ["same_size", "same_distance", "virtual", "erect"]
    │       }
    │
    ├─ "Practice problems" or "Quiz me"
    │   └─ Use: initialMode: "practice"
    │
    ├─ "Real life examples" or "Where are mirrors used?"
    │   └─ Use: initialMode: "real_world"
    │
    ├─ "Why is AMBULANCE written backwards?"
    │   └─ Use: initialMode: "real_world", filterSteps: [8]
    │
    ├─ "How does a periscope work?"
    │   └─ Use: initialMode: "real_world", filterSteps: [10]
    │
    ├─ "Let me try it" or "Interactive demo"
    │   └─ Use: initialMode: "hands_on", filterSteps: [11]
    │
    ├─ "Show me with a [candle/person/etc]"
    │   └─ Use: additionalProps: { objectType: "[specified type]" }
    │
    └─ "Draw light rays" or "Ray diagram"
        └─ Use: initialMode: "hands_on", filterSteps: [12]
            or additionalProps: { showRays: true, showImageFormation: true }
```

---

## Tips for Agents

1. **For basic introduction**: Use `initialMode: "learn"` with steps 1-2
2. **For specific concepts**: Use `filterSteps` to show only relevant steps
3. **For practice**: Use `initialMode: "practice"` - includes auto-grading
4. **For real-world context**: Use `initialMode: "real_world"` to show applications
5. **For interactivity**: Use `initialMode: "hands_on"` for drag-and-drop
6. **For minimal distractions**: Set all show* props to false
7. **For static display**: Set `autoPlayDuration: 0` and hide navigation
8. **For property emphasis**: Use `highlightProperties` array
9. **For different objects**: Change `objectType` to arrow/person/candle
10. **For measurements**: Always set `showMeasurements: true` when discussing distance
11. **For ray tracing**: Enable `showRays: true` and `showImageFormation: true`
12. **For slow explanations**: Use `animationStyle: "slow"`

---

## Common Student Questions & Responses

| Student Question | Recommended Configuration |
|-----------------|---------------------------|
| "What is a mirror?" | `initialMode: "learn"`, `filterSteps: [1]` |
| "How is the image formed?" | `initialMode: "learn"`, `filterSteps: [2]`, `showRays: true` |
| "What are mirror image properties?" | `initialMode: "learn"`, `filterSteps: [3]` |
| "Why is my image flipped?" | `initialMode: "learn"`, `filterSteps: [4]` |
| "Test me on mirrors" | `initialMode: "practice"` |
| "Real world examples?" | `initialMode: "real_world"` |
| "Let me try it myself" | `initialMode: "hands_on"` |
| "Show with a candle" | `objectType: "candle"` |
| "Where is the image located?" | `showMeasurements: true`, `filterSteps: [2, 3]` |
| "Why AMBULANCE backwards?" | `initialMode: "real_world"`, `filterSteps: [8]` |

---

## Educational Concepts Covered

### Physics Concepts
- ✅ Reflection of light
- ✅ Virtual vs real images
- ✅ Image formation by plane mirrors
- ✅ Laws of reflection
- ✅ Lateral inversion
- ✅ Object-image distance relationship

### Properties Demonstrated
1. **Image size = Object size** (No magnification)
2. **Image distance = Object distance** (Symmetrical)
3. **Laterally inverted** (Left-right reversal)
4. **Virtual image** (Behind mirror)
5. **Erect image** (Upright, not inverted)

### Real-World Applications
- Ambulance/emergency vehicle lettering
- Rear-view mirrors in vehicles
- Dressing mirrors
- Periscopes in submarines
- Barber shop mirrors
- Security mirrors

---

## Animation Features

### Automatic Animations
- **Fade-in transitions** between steps
- **Progressive ray drawing** showing light path
- **Image formation** animation from object
- **Measurement lines** appearing with labels
- **Bounce effects** for interactive hints
- **Shimmer effect** on progress bar

### Interactive Animations
- **Drag-and-drop** object movement (Hands-On mode)
- **Hover effects** on all buttons
- **Click feedback** with scale transforms
- **Quiz feedback** with color-coded responses
- **Auto-play** with configurable timing

---

## Error Handling

- If `objectType` is invalid: Falls back to "arrow"
- If `filterSteps` contains invalid IDs: Shows available steps only
- If `initialMode` is invalid: Defaults to "learn"
- If `objectDistance` is 0 or negative: Uses default value
- Empty `additionalProps`: Uses all default values
- Invalid `mirrorPosition`: Defaults to "center"

---

## Performance Notes

- Canvas rendering optimized for 60fps
- Animations use requestAnimationFrame
- Easing functions for smooth motion
- Lazy rendering (only when visible)
- Efficient state management
- Memory cleanup on unmount

---

## Accessibility Features

- Clear visual feedback for all interactions
- High contrast text and elements
- Large clickable areas for buttons
- Keyboard navigation support (via tab)
- Screen-reader friendly labels
- Color-blind friendly color schemes

---

## Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS/Android)
- ⚠️ IE11 not supported (Canvas/ES6 features)

---

## File Structure

```
plane_mirror_tool/
├── PlaneMirrorTool.tsx          # Main component
├── README.md                     # This documentation
└── examples/                     # Usage examples
    ├── basic_intro.json
    ├── practice_mode.json
    ├── real_world.json
    └── interactive_lab.json
```

---

## Version History

- **v1.0** (Current)
  - Initial release
  - 4 modes (Learn, Practice, Real World, Hands-On)
  - 12 default steps
  - Interactive drag-and-drop
  - Practice quiz with auto-grading
  - Real-world applications
  - Multiple object types
  - Configurable animations

---

## Future Enhancements (Planned)

- [ ] Multiple mirror configurations (parallel, angled)
- [ ] Curved mirror support
- [ ] Sound effects for interactions
- [ ] Video recording of ray paths
- [ ] Export ray diagrams as images
- [ ] Multiplayer collaborative mode
- [ ] Custom object upload
- [ ] AR mode for real-world overlay

---

## Support & Feedback

For issues, questions, or feature requests:
- Contact: Reasonify EdTech
- Email: support@reasonify.tech
- Documentation: docs.reasonify.tech/plane-mirror-tool

---

## License

Proprietary - Reasonify Technology  
All rights reserved © 2026