# Heat Conduction Interactive Tool - Agent README

## Overview

The Heat Conduction Tool is an interactive educational component that teaches students about thermal energy transfer through direct contact. It features three distinct modes:

1. **Learn Mode** - Interactive experiment with animated pins falling as heat travels
2. **Practice Mode** - Quiz questions to test understanding
3. **Real World Mode** - Real-life applications of conductors and insulators

## Tool Name

```
heat_conduction_tool
```

## Quick Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `initialMode` | string | "learn" | Starting mode: "learn", "practice", "real_world" |
| `showModeSelector` | boolean | true | Show/hide mode tabs |
| `enabledModes` | array | ["learn", "practice", "real_world"] | Which modes to enable |
| `showNavigation` | boolean | true | Show/hide prev/next buttons |
| `showStepIndicator` | boolean | true | Show/hide heat intensity bar |
| `animationSpeed` | number | 1 | Speed multiplier (0.1-5) |
| `themeColor` | string | "#14B8A6" | Primary color (hex) |
| `darkMode` | boolean | false | Enable dark theme |

### AdditionalProps Quick Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `numberOfPins` | number | 4 | Number of pins on metal strip (2-8) |
| `customPins` | array | - | Custom pin configuration with labels, positions, colors |
| `maxHeatIntensity` | number | 100 | Maximum heat intensity value |
| `heatSpeed` | number | 100 | Heating speed in ms per unit |
| `customMaterials` | array | - | Custom materials for testing |
| `customQuestions` | array | - | Custom practice questions |
| `customApplications` | array | - | Custom real-world applications |
| `showLabels` | boolean | true | Show/hide diagram labels |
| `showHeatVisualization` | boolean | true | Show/hide heat glow effects |
| `enableDragDrop` | boolean | true | Enable/disable material dragging |

## Basic Usage Examples

### Example 1: Default Experience (All Modes)
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Heat Conduction Experiment",
    "data": {
        "toolName": "heat_conduction_tool",
        "parameters": {}
    },
    "instructions_for_student": "Explore how heat travels through different materials!"
}
```

### Example 2: Learn Mode Only
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Interactive Heat Experiment",
    "data": {
        "toolName": "heat_conduction_tool",
        "parameters": {
            "initialMode": "learn",
            "enabledModes": ["learn"],
            "showModeSelector": false
        }
    },
    "instructions_for_student": "Click 'Start Heating' to watch how heat travels through the metal strip!"
}
```

### Example 3: Practice Mode Only
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Heat Conduction Quiz",
    "data": {
        "toolName": "heat_conduction_tool",
        "parameters": {
            "initialMode": "practice",
            "enabledModes": ["practice"],
            "showModeSelector": false
        }
    },
    "instructions_for_student": "Test your knowledge about heat conduction!"
}
```

### Example 4: Real World Applications Only
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Conductors and Insulators in Daily Life",
    "data": {
        "toolName": "heat_conduction_tool",
        "parameters": {
            "initialMode": "real_world",
            "enabledModes": ["real_world"],
            "showModeSelector": false
        }
    },
    "instructions_for_student": "Discover how heat conduction is used in everyday objects!"
}
```

## Advanced Usage Examples

### Example 5: Custom Pin Configuration
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "5-Pin Heat Experiment",
    "data": {
        "toolName": "heat_conduction_tool",
        "parameters": {
            "additionalProps": {
                "customPins": [
                    { "label": "A", "xPosition": 380, "fallOrder": 1, "color": "#DC2626" },
                    { "label": "B", "xPosition": 310, "fallOrder": 2, "color": "#EA580C" },
                    { "label": "C", "xPosition": 240, "fallOrder": 3, "color": "#F59E0B" },
                    { "label": "D", "xPosition": 170, "fallOrder": 4, "color": "#10B981" },
                    { "label": "E", "xPosition": 100, "fallOrder": 5, "color": "#3B82F6" }
                ]
            }
        }
    },
    "instructions_for_student": "Watch how heat travels progressively through the metal strip, making pins fall in order!"
}
```

### Example 6: Fast Animation Demo
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Quick Heat Demo",
    "data": {
        "toolName": "heat_conduction_tool",
        "parameters": {
            "animationSpeed": 2.5,
            "additionalProps": {
                "heatSpeed": 50,
                "maxHeatIntensity": 100
            }
        }
    },
    "instructions_for_student": "Watch a faster demonstration of heat traveling through metal!"
}
```

### Example 7: Custom Materials Testing
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Test Precious Metals",
    "data": {
        "toolName": "heat_conduction_tool",
        "parameters": {
            "additionalProps": {
                "customMaterials": [
                    { "name": "Gold", "type": "conductor", "color": "#FFD700", "emoji": "🥇" },
                    { "name": "Silver", "type": "conductor", "color": "#C0C0C0", "emoji": "🥈" },
                    { "name": "Platinum", "type": "conductor", "color": "#E5E4E2", "emoji": "💎" },
                    { "name": "Rubber", "type": "insulator", "color": "#2C2C2C", "emoji": "⚫" },
                    { "name": "Ceramic", "type": "insulator", "color": "#DEB887", "emoji": "🏺" }
                ]
            }
        }
    },
    "instructions_for_student": "Drag different materials to test which conduct heat best!"
}
```

### Example 8: Custom Quiz Questions
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Heat Conduction Assessment",
    "data": {
        "toolName": "heat_conduction_tool",
        "parameters": {
            "initialMode": "practice",
            "additionalProps": {
                "customQuestions": [
                    {
                        "id": 1,
                        "type": "mcq",
                        "question": "Which material is the BEST conductor of heat?",
                        "options": ["Wood", "Silver", "Plastic", "Glass"],
                        "correctAnswer": "Silver",
                        "explanation": "Silver has the highest thermal conductivity of all common materials.",
                        "difficulty": "medium",
                        "points": 15
                    },
                    {
                        "id": 2,
                        "type": "true-false",
                        "question": "Insulators allow heat to pass through easily.",
                        "options": ["True", "False"],
                        "correctAnswer": "False",
                        "explanation": "Insulators BLOCK or slow down heat transfer, they don't allow it to pass easily.",
                        "difficulty": "easy",
                        "points": 10
                    },
                    {
                        "id": 3,
                        "type": "mcq",
                        "question": "Why do cooking pots have plastic or wooden handles?",
                        "options": [
                            "To make them colorful",
                            "To prevent heat transfer to your hand",
                            "Because metal is expensive",
                            "To make them lighter"
                        ],
                        "correctAnswer": "To prevent heat transfer to your hand",
                        "explanation": "Plastic and wood are insulators that block heat, keeping the handle cool while the pot gets hot.",
                        "difficulty": "medium",
                        "points": 15
                    }
                ]
            }
        }
    },
    "instructions_for_student": "Answer these questions to test your understanding of heat conduction!"
}
```

### Example 9: Dark Theme for Low Light
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Heat Conduction (Night Mode)",
    "data": {
        "toolName": "heat_conduction_tool",
        "parameters": {
            "darkMode": true,
            "themeColor": "#06B6D4"
        }
    },
    "instructions_for_student": "Study heat conduction with a comfortable dark theme!"
}
```

### Example 10: Minimal UI for Focused Demo
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Pure Heat Demo",
    "data": {
        "toolName": "heat_conduction_tool",
        "parameters": {
            "showModeSelector": false,
            "showNavigation": false,
            "showPlayPause": false,
            "showStepIndicator": true,
            "additionalProps": {
                "showLabels": true,
                "showHeatVisualization": true
            }
        }
    },
    "instructions_for_student": "Observe the clean demonstration of heat traveling through metal!"
}
```

### Example 11: Custom Real-World Applications
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Kitchen Heat Applications",
    "data": {
        "toolName": "heat_conduction_tool",
        "parameters": {
            "initialMode": "real_world",
            "additionalProps": {
                "customApplications": [
                    {
                        "id": 1,
                        "title": "Cooking Pans",
                        "category": "Kitchen",
                        "description": "Metal pans with insulated handles",
                        "howItWorks": "The metal pan body conducts heat from stove to food efficiently, while the insulated handle blocks heat transfer to your hand",
                        "conductor": "Aluminum or stainless steel pan body",
                        "insulator": "Silicone, wood, or plastic handle",
                        "scienceBehind": "Metals have free electrons that transfer thermal energy rapidly. Insulators trap air and have tightly bound electrons that resist heat flow",
                        "realExample": "A frying pan gets hot quickly (conductor) but the handle stays cool (insulator)",
                        "benefits": [
                            "Efficient cooking with less energy",
                            "Safe handling without burns",
                            "Even heat distribution"
                        ],
                        "difficulty": "everyday"
                    },
                    {
                        "id": 2,
                        "title": "Oven Mitts",
                        "category": "Kitchen",
                        "description": "Thick fabric gloves for handling hot items",
                        "howItWorks": "Multiple layers of fabric trap air pockets that block heat conduction from hot objects to your hands",
                        "conductor": "None (purely insulating)",
                        "insulator": "Cotton, silicone, or quilted fabric with air pockets",
                        "scienceBehind": "Air is an excellent insulator. Layered fabrics create many air pockets that prevent heat molecules from transferring energy to your skin",
                        "realExample": "You can safely hold a 400°F baking dish with oven mitts",
                        "benefits": [
                            "Protection from burns",
                            "Comfortable grip",
                            "Reusable and washable"
                        ],
                        "difficulty": "everyday"
                    }
                ]
            }
        }
    },
    "instructions_for_student": "Learn how conductors and insulators are used in kitchen tools!"
}
```

### Example 12: Complete Custom Configuration
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Advanced Heat Conduction Study",
    "data": {
        "toolName": "heat_conduction_tool",
        "parameters": {
            "width": 1000,
            "height": 700,
            "themeColor": "#8B5CF6",
            "animationSpeed": 1.5,
            "enabledModes": ["learn", "practice"],
            "additionalProps": {
                "customPins": [
                    { "label": "1", "xPosition": 370, "fallOrder": 1, "color": "#DC2626" },
                    { "label": "2", "xPosition": 280, "fallOrder": 2, "color": "#F59E0B" },
                    { "label": "3", "xPosition": 190, "fallOrder": 3, "color": "#10B981" }
                ],
                "customMaterials": [
                    { "name": "Copper", "type": "conductor", "color": "#B87333", "emoji": "🔶" },
                    { "name": "Aluminum", "type": "conductor", "color": "#A8A9AD", "emoji": "⚪" },
                    { "name": "Wood", "type": "insulator", "color": "#8B4513", "emoji": "🪵" },
                    { "name": "Foam", "type": "insulator", "color": "#F5F5DC", "emoji": "🧽" }
                ],
                "heatSpeed": 80,
                "showLabels": true,
                "showHeatVisualization": true
            }
        }
    },
    "instructions_for_student": "Explore this comprehensive heat conduction experiment with custom settings!"
}
```

## Decision Tree for Agents

```
Student question about heat/conduction
    │
    ├─ "What is conduction?" OR "How does heat travel?"
    │   └─ Use: initialMode: "learn", showModeSelector: true
    │   └─ All modes available for exploration
    │
    ├─ "Show me a heat experiment" OR "Demonstrate conduction"
    │   └─ Use: initialMode: "learn", enabledModes: ["learn"]
    │   └─ Focus on interactive experiment only
    │
    ├─ "Test me" OR "Quiz me" OR "Practice questions"
    │   └─ Use: initialMode: "practice", enabledModes: ["practice"]
    │   └─ Show only quiz mode
    │
    ├─ "Real world examples" OR "Where is this used?" OR "Applications"
    │   └─ Use: initialMode: "real_world", enabledModes: ["real_world"]
    │   └─ Show only real-world applications
    │
    ├─ "Faster" OR "Speed up" OR "Quick demo"
    │   └─ Use: animationSpeed: 2-3, additionalProps.heatSpeed: 50
    │   └─ Accelerate animations
    │
    ├─ "More pins" OR "Different setup"
    │   └─ Use: additionalProps.customPins with 5-8 pins
    │   └─ Customize pin configuration
    │
    ├─ "Test [specific materials]" (e.g., "test gold and silver")
    │   └─ Use: additionalProps.customMaterials with requested materials
    │   └─ Add specific materials for testing
    │
    ├─ "Make it simpler" OR "Less distractions"
    │   └─ Use: showModeSelector: false, showNavigation: false
    │   └─ Minimal UI for focused viewing
    │
    ├─ "Dark mode" OR "Night mode" OR "Dark theme"
    │   └─ Use: darkMode: true
    │   └─ Enable dark theme
    │
    └─ Custom quiz request with specific questions
        └─ Use: additionalProps.customQuestions with agent-generated questions
        └─ Create targeted assessment
```

## Topic Coverage

### Learn Mode Covers:
- ✅ Heat transfer through direct contact (conduction)
- ✅ Metal as a good conductor (metal strip experiment)
- ✅ Rate of heat transfer (pins falling in order)
- ✅ Distance from heat source matters (farther = slower)
- ✅ Conductors vs insulators (material testing)
- ✅ Visual feedback of heat flow
- ✅ Interactive experimentation

### Practice Mode Covers:
- ✅ Definition of conduction
- ✅ Properties of conductors
- ✅ Properties of insulators
- ✅ Common conducting materials
- ✅ Common insulating materials
- ✅ Applications in daily life
- ✅ Why materials behave differently

### Real World Mode Covers:
- ✅ Kitchen applications (cookware, utensils)
- ✅ Clothing (winter wear, oven mitts)
- ✅ Building/home (insulation, windows)
- ✅ Electronics (heat sinks)
- ✅ Industry (furnaces, manufacturing)
- ✅ Safety equipment
- ✅ Benefits of each application

## When to Use This Tool

### ✅ GOOD USE CASES:
- Student asks "What is heat conduction?"
- Student asks "How does heat travel through materials?"
- Student asks "Why do metal spoons get hot in soup?"
- Student asks "What's the difference between conductors and insulators?"
- Student asks "Show me examples of heat conduction"
- Student wants to test different materials
- Teacher wants interactive demonstration
- Student needs practice questions on conduction
- Student asks about real-world applications

### ❌ NOT APPROPRIATE FOR:
- Questions about convection (heat transfer through fluids)
- Questions about radiation (heat transfer through electromagnetic waves)
- Questions about specific heat capacity calculations
- Questions about thermodynamics equations
- Questions about temperature scales only (Celsius, Fahrenheit, Kelvin)
- Questions about phase changes (melting, boiling)
- Questions about chemical reactions that produce heat

## Tips for Agents

### 1. Mode Selection
- **For "what is" questions**: Use Learn mode (initialMode: "learn")
- **For "test me" requests**: Use Practice mode (initialMode: "practice")
- **For "real life" questions**: Use Real World mode (initialMode: "real_world")
- **For comprehensive learning**: Enable all modes

### 2. Customization
- **For younger students**: Use fewer pins (3-4), slower animation
- **For older students**: Use more pins (5-8), custom questions
- **For quick demos**: Increase animationSpeed, reduce heatSpeed
- **For focused learning**: Hide mode selector, show only one mode

### 3. Material Selection
- **For basic concepts**: Use default materials (steel, copper, wood, plastic)
- **For advanced study**: Add custom materials (gold, silver, ceramic, foam)
- **For specific contexts**: Match materials to real-world scenario (kitchen, electronics, construction)

### 4. Questions
- **For assessment**: Use custom questions targeting specific learning objectives
- **For review**: Use default questions covering core concepts
- **For differentiation**: Mix easy, medium, and hard questions

### 5. Visual Settings
- **For clarity**: Keep showLabels: true, showHeatVisualization: true
- **For minimal distraction**: Set showModeSelector: false, hide unnecessary UI
- **For accessibility**: Consider darkMode for students with light sensitivity

## Common Student Questions → Tool Configurations

| Student Question | Configuration |
|-----------------|---------------|
| "What is conduction?" | `initialMode: "learn"`, all default settings |
| "Show me an experiment" | `initialMode: "learn"`, `enabledModes: ["learn"]` |
| "Why do pins fall?" | Default learn mode with clear labels |
| "Test me on this" | `initialMode: "practice"` |
| "Where is this used in real life?" | `initialMode: "real_world"` |
| "Which materials conduct heat?" | Learn mode with material testing focus |
| "Make it faster" | `animationSpeed: 2-3`, `heatSpeed: 50` |
| "I want to test gold and silver" | Custom materials with gold and silver |
| "Give me harder questions" | Custom questions with `difficulty: "hard"` |
| "Show cooking examples" | Real World mode, filter or custom applications for kitchen |

## Error Handling

- **Invalid mode**: Defaults to "learn"
- **Invalid customPins**: Falls back to default 4 pins
- **Empty customMaterials**: Uses default 6 materials
- **Empty customQuestions**: Uses default 3 questions
- **Invalid colors**: Tool will use fallback colors
- **Out of range values**: Clamped to valid ranges (e.g., animationSpeed clamped to 0.1-5)

## Performance Notes

- **Optimal pin count**: 3-6 pins (more than 8 may be cluttered)
- **Optimal animation speed**: 0.5-2x (higher than 3x may be too fast to observe)
- **Material limit**: 6-10 materials (more may require scrolling)
- **Question limit**: 5-15 questions (more may cause fatigue)

## Accessibility

- ✅ Keyboard navigation supported
- ✅ High contrast colors available (darkMode)
- ✅ Clear visual feedback for all interactions
- ✅ Text alternatives for visual elements
- ✅ Adjustable animation speeds
- ✅ Screen reader compatible labels

## Related Concepts

This tool is part of the heat transfer education suite:
- **Conduction** ← This tool
- **Convection** (separate tool for fluid heat transfer)
- **Radiation** (separate tool for electromagnetic heat transfer)

## Version History

- v1.0 - Initial release with three modes, customizable pins, materials, and questions

## Support

For issues or questions about this tool, consult the JSON schema file or contact the development team.