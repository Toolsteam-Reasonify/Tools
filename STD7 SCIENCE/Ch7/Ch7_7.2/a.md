# AGENT README: Convection Learning Tool

## Quick Reference

**Tool Name:** `convection_learning_tool`  
**Purpose:** Interactive educational tool for teaching convection in heat transfer  
**Modes:** Learn, Practice, Real World Applications  
**Grade Level:** 7-8 (NCERT Science)

---

## Tool Overview

The Convection Learning Tool is a multi-mode interactive component that teaches students about heat transfer through convection. It features:

- **Learn Mode**: Animated demonstrations of convection concepts
- **Practice Mode**: Interactive questions (MCQ, True/False, Matching, Sequencing)
- **Real World Mode**: Real-life applications of convection

---

## Props Quick Reference Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | number | 800 | Canvas width in pixels |
| `height` | number | 600 | Canvas height in pixels |
| `initialMode` | string | "learn" | Starting mode: "learn", "practice", "real_world" |
| `showModeSelector` | boolean | true | Show/hide mode tabs |
| `enabledModes` | array | ["learn", "practice", "real_world"] | Which modes to enable |
| `showNavigation` | boolean | true | Show prev/next buttons |
| `showPlayPause` | boolean | true | Show play/pause button |
| `showStepIndicator` | boolean | true | Show "Step X of Y" |
| `filterSteps` | array | undefined | Array of step IDs to show |
| `autoPlayDuration` | number | 8000 | Auto-advance delay (ms), 0 = disabled |
| `animationSpeed` | number | 1 | Animation speed multiplier |
| `themeColor` | string | "#0891b2" | Primary color (hex) |
| `darkMode` | boolean | false | Enable dark theme |

---

## Additional Props (Tool-Specific)

### Learn Mode Customization

| Prop | Type | Description |
|------|------|-------------|
| `additionalProps.customSteps` | array | Replace default learning steps |
| `additionalProps.focusedConcept` | string | Filter by concept: "hot_air_rises", "cold_air_sinks", "sea_breeze", "land_breeze", "convection_currents" |
| `additionalProps.particleCount` | number | Number of particles (10-100), default: 30 |
| `additionalProps.animationIntensity` | string | "low", "medium", "high" |
| `additionalProps.showLabels` | boolean | Show/hide text labels on animations |

### Practice Mode Customization

| Prop | Type | Description |
|------|------|-------------|
| `additionalProps.customQuestions` | array | Replace default questions |
| `additionalProps.difficultyLevel` | string | Filter by: "easy", "medium", "hard" |
| `additionalProps.questionTypes` | array | Filter by types: ["mcq", "true-false", "match", "sequence"] |

### Real World Mode Customization

| Prop | Type | Description |
|------|------|-------------|
| `additionalProps.customApplications` | array | Replace default applications |
| `additionalProps.filterCategories` | array | Filter by: ["Nature", "Home", "Kitchen", "Appliances", "Technology"] |

---

## Available Learning Steps (Default)

| ID | Title | Concept | Animation |
|----|-------|---------|-----------|
| 1 | What is Convection? | Introduction | convection_intro |
| 2 | Paper Cup Experiment | Hot air rises | paper_cups |
| 3 | Why Does Hot Air Rise? | Density differences | hot_air_rising |
| 4 | Convection in Liquids | Water heating | water_heating |
| 5 | Sea Breeze (Day) | Coastal winds | sea_breeze |
| 6 | Land Breeze (Night) | Coastal winds | land_breeze |

---

## Tool Call Examples

### Example 1: Default - All Modes Enabled

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Convection Learning Tool",
  "data": {
    "toolName": "convection_learning_tool",
    "parameters": {}
  },
  "instructions_for_student": "Learn about convection through animations, practice questions, and real-world examples!"
}
```

---

### Example 2: Learn Mode Only - Complete Introduction

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Understanding Convection",
  "data": {
    "toolName": "convection_learning_tool",
    "parameters": {
      "initialMode": "learn",
      "enabledModes": ["learn"],
      "showModeSelector": false
    }
  },
  "instructions_for_student": "Watch how heat moves through fluids. Pay attention to how hot air and cold air behave differently!"
}
```

---

### Example 3: Focus on Sea Breeze Concept

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Sea Breeze and Land Breeze",
  "data": {
    "toolName": "convection_learning_tool",
    "parameters": {
      "initialMode": "learn",
      "filterSteps": [1, 5, 6],
      "additionalProps": {
        "focusedConcept": "sea_breeze",
        "showLabels": true,
        "animationIntensity": "high"
      }
    }
  },
  "instructions_for_student": "Learn why coastal areas experience cooling breezes during the day and different winds at night!"
}
```

---

### Example 4: Practice Mode - Easy Questions Only

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Convection Practice Quiz",
  "data": {
    "toolName": "convection_learning_tool",
    "parameters": {
      "initialMode": "practice",
      "enabledModes": ["practice"],
      "showModeSelector": false,
      "additionalProps": {
        "difficultyLevel": "easy"
      }
    }
  },
  "instructions_for_student": "Test your understanding with these practice questions. Take your time and think carefully!"
}
```

---

### Example 5: Practice Mode - MCQ and True/False Only

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Quick Convection Quiz",
  "data": {
    "toolName": "convection_learning_tool",
    "parameters": {
      "initialMode": "practice",
      "enabledModes": ["practice"],
      "additionalProps": {
        "questionTypes": ["mcq", "true-false"]
      }
    }
  },
  "instructions_for_student": "Answer these multiple choice and true/false questions about convection!"
}
```

---

### Example 6: Real World Applications - Kitchen Focus

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Convection in Your Kitchen",
  "data": {
    "toolName": "convection_learning_tool",
    "parameters": {
      "initialMode": "real_world",
      "enabledModes": ["real_world"],
      "showModeSelector": false,
      "additionalProps": {
        "filterCategories": ["Kitchen", "Home", "Appliances"]
      }
    }
  },
  "instructions_for_student": "See how convection works in everyday kitchen appliances and cooking!"
}
```

---

### Example 7: Real World Applications - Nature Only

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Convection in Nature",
  "data": {
    "toolName": "convection_learning_tool",
    "parameters": {
      "initialMode": "real_world",
      "additionalProps": {
        "filterCategories": ["Nature"]
      }
    }
  },
  "instructions_for_student": "Discover how convection creates weather patterns, winds, and natural phenomena!"
}
```

---

### Example 8: Minimal UI - Demo Mode

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Convection Demo",
  "data": {
    "toolName": "convection_learning_tool",
    "parameters": {
      "showModeSelector": false,
      "showNavigation": false,
      "showPlayPause": false,
      "showStepIndicator": false,
      "autoPlayDuration": 6000,
      "initialMode": "learn",
      "filterSteps": [3, 4],
      "additionalProps": {
        "animationIntensity": "high",
        "particleCount": 50,
        "showLabels": true
      }
    }
  },
  "instructions_for_student": "Watch this quick demonstration of convection!"
}
```

---

### Example 9: Dark Mode with Custom Theme

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Convection Learning",
  "data": {
    "toolName": "convection_learning_tool",
    "parameters": {
      "darkMode": true,
      "themeColor": "#8b5cf6"
    }
  },
  "instructions_for_student": "Explore convection concepts in dark mode - easier on your eyes!"
}
```

---

### Example 10: Fast-Paced Learning

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Quick Convection Review",
  "data": {
    "toolName": "convection_learning_tool",
    "parameters": {
      "animationSpeed": 2,
      "autoPlayDuration": 4000,
      "additionalProps": {
        "animationIntensity": "high"
      }
    }
  },
  "instructions_for_student": "Quick review of convection concepts - everything moves twice as fast!"
}
```

---

### Example 11: Static Display - No Auto-play

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Convection Concepts",
  "data": {
    "toolName": "convection_learning_tool",
    "parameters": {
      "autoPlayDuration": 0,
      "showPlayPause": false,
      "initialMode": "learn"
    }
  },
  "instructions_for_student": "Navigate through the convection concepts at your own pace using the navigation buttons."
}
```

---

### Example 12: Hard Practice Questions Only

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Advanced Convection Quiz",
  "data": {
    "toolName": "convection_learning_tool",
    "parameters": {
      "initialMode": "practice",
      "enabledModes": ["practice"],
      "additionalProps": {
        "difficultyLevel": "hard"
      }
    }
  },
  "instructions_for_student": "Challenge yourself with advanced questions about convection!"
}
```

---

### Example 13: Custom Title and Branding

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Chapter 4: Heat Transfer",
  "data": {
    "toolName": "convection_learning_tool",
    "parameters": {
      "data": {
        "title": "Class 7 Science - Convection",
        "subtitle": "NCERT Chapter 4: Heat Transfer"
      },
      "themeColor": "#059669"
    }
  },
  "instructions_for_student": "Learn about convection as part of your Chapter 4 studies!"
}
```

---

### Example 14: Specific Step Sequence

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Air Movement Basics",
  "data": {
    "toolName": "convection_learning_tool",
    "parameters": {
      "filterSteps": [2, 3],
      "initialMode": "learn",
      "showModeSelector": false,
      "autoPlayDuration": 10000
    }
  },
  "instructions_for_student": "Learn why hot air rises and cold air sinks through these experiments!"
}
```

---

### Example 15: Technology Applications Only

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Convection in Technology",
  "data": {
    "toolName": "convection_learning_tool",
    "parameters": {
      "initialMode": "real_world",
      "enabledModes": ["real_world"],
      "additionalProps": {
        "filterCategories": ["Technology", "Appliances"]
      }
    }
  },
  "instructions_for_student": "Explore how engineers use convection in modern technology and appliances!"
}
```

---

## Decision Tree for Agents

```
Student asks about convection/heat transfer
    │
    ├─ "What is convection?" or "Explain convection"
    │   └─ Use: initialMode: "learn", filterSteps: [1, 2, 3]
    │
    ├─ "Why does hot air rise?" or "Hot vs cold air"
    │   └─ Use: initialMode: "learn", focusedConcept: "hot_air_rises", filterSteps: [2, 3]
    │
    ├─ "What is sea breeze?" or "Land breeze explanation"
    │   └─ Use: initialMode: "learn", focusedConcept: "sea_breeze", filterSteps: [5, 6]
    │
    ├─ "How does water heat up?" or "Convection in liquids"
    │   └─ Use: initialMode: "learn", filterSteps: [4]
    │
    ├─ "Show me examples" or "Real world convection"
    │   └─ Use: initialMode: "real_world", enabledModes: ["real_world"]
    │
    ├─ "Kitchen examples" or "Cooking and convection"
    │   └─ Use: initialMode: "real_world", additionalProps: { filterCategories: ["Kitchen", "Home"] }
    │
    ├─ "Practice questions" or "Test my knowledge"
    │   └─ Use: initialMode: "practice", enabledModes: ["practice"]
    │
    ├─ "Easy questions" or "Beginner practice"
    │   └─ Use: initialMode: "practice", additionalProps: { difficultyLevel: "easy" }
    │
    ├─ "Hard questions" or "Challenge me"
    │   └─ Use: initialMode: "practice", additionalProps: { difficultyLevel: "hard" }
    │
    ├─ "Multiple choice only" or "MCQ questions"
    │   └─ Use: initialMode: "practice", additionalProps: { questionTypes: ["mcq", "true-false"] }
    │
    ├─ "Quick demo" or "Fast overview"
    │   └─ Use: showModeSelector: false, autoPlayDuration: 4000, animationSpeed: 2
    │
    ├─ "Show everything" or "Complete lesson"
    │   └─ Use: Default settings (all modes enabled)
    │
    └─ "Natural phenomena" or "Weather and convection"
        └─ Use: initialMode: "real_world", additionalProps: { filterCategories: ["Nature"] }
```

---

## Agent Tips

### 1. **For General Learning**
- Use default settings to show all modes
- Let students explore at their own pace

### 2. **For Focused Concepts**
- Use `filterSteps` to show specific step IDs
- Use `focusedConcept` for concept-based filtering
- Set `showModeSelector: false` for single-mode focus

### 3. **For Practice**
- Filter by `difficultyLevel` to match student ability
- Use `questionTypes` to focus on specific formats
- Disable other modes with `enabledModes: ["practice"]`

### 4. **For Real World Examples**
- Use `filterCategories` to match student interests
- Combine multiple categories for broader scope
- Good for connecting science to daily life

### 5. **For Demonstrations**
- Set `autoPlayDuration` low (4000-6000ms) for quick demos
- Hide navigation with `showNavigation: false`
- Use `animationIntensity: "high"` for visual impact

### 6. **For Assessments**
- Use practice mode with specific difficulty
- Consider hiding mode selector for focused testing
- Track scores through the UI feedback

### 7. **For Visual Learners**
- Increase `particleCount` (up to 100)
- Use `animationIntensity: "high"`
- Ensure `showLabels: true` for clarity

### 8. **For Accessibility**
- Enable `darkMode` for low-light viewing
- Use high-contrast `themeColor`
- Keep `showLabels: true` for clear understanding

---

## Common Student Questions → Tool Calls

| Student Question | Recommended Parameters |
|------------------|------------------------|
| "What is convection?" | `initialMode: "learn"`, `filterSteps: [1, 2, 3]` |
| "Show me sea breeze" | `focusedConcept: "sea_breeze"` |
| "Give me practice questions" | `initialMode: "practice"` |
| "Show kitchen examples" | `initialMode: "real_world"`, `filterCategories: ["Kitchen"]` |
| "Why hot air goes up?" | `focusedConcept: "hot_air_rises"` |
| "Easy quiz please" | `initialMode: "practice"`, `difficultyLevel: "easy"` |
| "Weather and winds" | `filterSteps: [5, 6]` or `filterCategories: ["Nature"]` |
| "How does AC work?" | `initialMode: "real_world"`, `filterCategories: ["Home", "Appliances"]` |

---

## Error Handling

### Common Issues

1. **Empty screens**: 
   - Check if `filterSteps` includes valid IDs (1-6)
   - Verify `filterCategories` match existing categories

2. **No questions showing**:
   - `difficultyLevel` filter might be too restrictive
   - `questionTypes` might exclude all questions

3. **Auto-play not working**:
   - Check `autoPlayDuration` is not 0
   - Verify `stopAutoNext` is not true

4. **Animations not smooth**:
   - Reduce `particleCount` for better performance
   - Lower `animationIntensity` to "low"

---

## Performance Optimization

For slower devices:
```json
{
  "additionalProps": {
    "particleCount": 20,
    "animationIntensity": "low"
  }
}
```

For high-end devices:
```json
{
  "additionalProps": {
    "particleCount": 80,
    "animationIntensity": "high"
  },
  "animationSpeed": 1.5
}
```

---

## Best Practices

1. **Start with Learn Mode**: Let students understand concepts before practicing
2. **Use Focused Concepts**: For quick lessons, use `focusedConcept` to narrow scope
3. **Match Difficulty**: Use `difficultyLevel` to match student's current ability
4. **Show Real World**: Always connect theory to applications using real_world mode
5. **Progressive Learning**: Start with easy, move to medium, then hard questions
6. **Visual Emphasis**: Use high `animationIntensity` for visual learners
7. **Customization**: Use `themeColor` and `darkMode` for better engagement

---

## Integration Examples

### Example: Complete Lesson Flow

```javascript
// Step 1: Introduction (Learn Mode)
{
  "toolName": "convection_learning_tool",
  "parameters": {
    "initialMode": "learn",
    "filterSteps": [1, 2, 3],
    "autoPlayDuration": 8000
  }
}

// Step 2: Practice (Easy Questions)
{
  "toolName": "convection_learning_tool",
  "parameters": {
    "initialMode": "practice",
    "additionalProps": {
      "difficultyLevel": "easy"
    }
  }
}

// Step 3: Real World Applications
{
  "toolName": "convection_learning_tool",
  "parameters": {
    "initialMode": "real_world"
  }
}

// Step 4: Assessment (Hard Questions)
{
  "toolName": "convection_learning_tool",
  "parameters": {
    "initialMode": "practice",
    "additionalProps": {
      "difficultyLevel": "hard"
    }
  }
}
```

---

## Frequently Asked Questions

**Q: Can I show only one specific animation?**  
A: Yes! Use `filterSteps: [X]` where X is the step ID (1-6).

**Q: How do I disable auto-play?**  
A: Set `autoPlayDuration: 0`

**Q: Can I customize the colors?**  
A: Yes! Use `themeColor` (hex format) and `darkMode: true/false`

**Q: How to make it faster for quick demos?**  
A: Use `animationSpeed: 2` and `autoPlayDuration: 4000`

**Q: Can students take notes?**  
A: The tool is view-only, but students can pause and use external note-taking

**Q: Is there a scoring system?**  
A: Yes! Practice mode tracks scores automatically

**Q: Can I mix question types?**  
A: Yes! Use `questionTypes: ["mcq", "match"]` to show multiple types

**Q: How to focus on one concept only?**  
A: Use `focusedConcept` or `filterSteps` with relevant step IDs

---

## Support and Feedback

For issues or suggestions regarding this tool, please provide:
- Student's question/request
- Tool call parameters used
- Expected vs actual behavior
- Student's grade level

---

**Last Updated**: January 2026  
**Version**: 1.0  
**Compatible with**: React 18+, TypeScript 4.5+