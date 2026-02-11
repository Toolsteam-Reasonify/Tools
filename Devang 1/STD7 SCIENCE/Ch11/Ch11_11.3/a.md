# Light through Transparent, Translucent, and Opaque Materials - Interactive Tool (NCERT Topic 11.3)

## Tool Overview

**Tool Name:** `light_materials_tool`

**Purpose:** Interactive educational tool demonstrating how light passes through different materials (transparent, translucent, and opaque) from NCERT Grade 7 Science Chapter 11.3

**Curriculum Alignment:** NCERT Grade 7 Science - Chapter 11: Light - Shadows and Reflections, Topic 11.3

**Learning Objectives:**
- Understand how light interacts with different materials
- Classify materials as transparent, translucent, or opaque
- Observe light passing fully, partially, or not at all through materials
- Predict and test material behavior with light
- Learn about real-world applications

---

## Quick Reference Table

| Mode | Description | Best Use Case |
|------|-------------|---------------|
| **Learn** | Animated demonstrations of light through different materials | First-time learners, concept introduction |
| **Practice** | Interactive classification and prediction challenges | Reinforcement, assessment |
| **Real World** | Applications of different materials in daily life | Connecting to practical uses |
| **Hands-On** | Virtual lab to test any material with torch and screen | Active learning, experimentation |

---

## Complete Props Interface

```typescript
interface LightMaterialsToolProps {
    props?: {
        // Dimensions
        width?: number;                    // Default: 900
        height?: number;                   // Default: 700
        
        // Mode Configuration
        initialMode?: 'learn' | 'practice' | 'real_world' | 'hands_on';
        showModeSelector?: boolean;        // Default: true
        enabledModes?: ModeType[];
        
        // Navigation
        showNavigation?: boolean;          // Default: true
        showPlayPause?: boolean;           // Default: true
        showStepIndicator?: boolean;       // Default: true
        
        // Step Control
        initialStep?: number;
        filterSteps?: number[];
        
        // Animation
        animationSpeed?: number;           // Default: 1
        autoPlayDuration?: number;         // Default: 8000ms
        
        // Theme
        themeColor?: string;               // Default: "#0891b2" (cyan)
        darkMode?: boolean;                // Default: false
        
        // Additional Props - Tool Specific
        additionalProps?: {
            materials?: string[];              // Specific materials to demo
            showTable?: boolean;               // Show prediction table
            highlightBeam?: boolean;           // Emphasize light beam
            showParticles?: boolean;           // Particle animation
            enableInteraction?: boolean;       // Drag materials
            showClassification?: boolean;      // Show material categories
            beamColor?: string;                // Light beam color
            showPercentage?: boolean;          // Show % light passing
        };
    };
}
```

---

## Additional Props Details

### `materials`
- **Type:** `string[]`
- **Default:** `['glass', 'paper', 'cardboard', 'tracing_paper', 'cloth', 'plastic_bottle', 'metal_sheet']`
- **Description:** Which materials to demonstrate
- **Available Materials:**
  - Transparent: glass, clear_plastic, water_bottle
  - Translucent: tracing_paper, frosted_glass, thin_cloth, wax_paper
  - Opaque: cardboard, metal_sheet, wood, thick_cloth, book

### `showTable`
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Display NCERT Table 11.1 for predictions vs observations
- **Note:** Matches exact format from textbook

### `highlightBeam`
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Visual emphasis on light beam path
- **Effect:** Glow effects, particle trails, intensity indicators

### `showParticles`
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Animated light particles showing transmission
- **Effect:** Particles pass through, scatter, or bounce back

### `enableInteraction`
- **Type:** `boolean`
- **Default:** Auto-set based on mode
- **Description:** Allow dragging materials into light path
- **Auto-enabled:** In 'hands_on' and 'practice' modes

### `showClassification`
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Display material categories with icons
- **Categories:** Transparent (✓✓), Translucent (✓~), Opaque (✗)

### `beamColor`
- **Type:** `string` (hex color)
- **Default:** `'#fbbf24'` (warm yellow)
- **Description:** Color of torch light beam
- **Recommended Values:**
  - `'#fbbf24'` - Yellow (torch light)
  - `'#ffffff'` - White (bright light)
  - `'#22c55e'` - Green (laser)

### `showPercentage`
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Display numerical % of light transmission
- **Use Case:** Quantitative learning, advanced students

---

## Step-by-Step Breakdown

### Learn Mode Steps

#### Introduction (Step 1)
- Title: "What Happens When Light Hits Materials?"
- Content: Introduction to three material categories
- Animation: Torch, screen, and empty space setup
- Duration: 8s

#### Transparent Materials (Steps 2-4)

**Step 2: Glass (Transparent)**
- Title: "Glass - Light Passes Almost Completely"
- Content: Clear glass pane in light path
- Animation:
  - Light beam travels straight through glass
  - Bright spot on screen (90-100% intensity)
  - Minimal scattering
- NCERT Reference: "Light passes almost completely through transparent materials"
- Duration: 10s

**Step 3: Clear Plastic Bottle (Transparent)**
- Title: "Plastic Bottle - See-Through Material"
- Content: Clear plastic bottle demonstration
- Animation: Similar to glass, slight refraction visible
- Duration: 8s

**Step 4: Water in Beaker (Transparent)**
- Title: "Water - Another Transparent Material"
- Content: Beaker filled with water
- Animation: Light beam with slight refraction, full transmission
- Duration: 8s

#### Translucent Materials (Steps 5-7)

**Step 5: Tracing Paper (Translucent)**
- Title: "Tracing Paper - Light Passes Partially"
- Content: Thin translucent paper
- Animation:
  - Light beam partially passes through
  - Scattered particles visible
  - Dimmer spot on screen (30-60% intensity)
- NCERT Reference: "Light passes partially through translucent materials"
- Duration: 10s

**Step 6: Frosted Glass (Translucent)**
- Title: "Frosted Glass - Diffused Light"
- Content: Textured glass surface
- Animation: Heavy scattering, soft glow on screen
- Duration: 8s

**Step 7: Thin Cloth (Translucent)**
- Title: "Thin Fabric - Partial Transmission"
- Content: Light fabric material
- Animation: Some light visible through weave pattern
- Duration: 8s

#### Opaque Materials (Steps 8-10)

**Step 8: Cardboard (Opaque)**
- Title: "Cardboard - Light Blocked Completely"
- Content: Thick cardboard sheet
- Animation:
  - Light beam stops at cardboard surface
  - No spot on screen (0% transmission)
  - Shadow formation visible
- NCERT Reference: "Light does not pass through opaque materials"
- Duration: 10s

**Step 9: Metal Sheet (Opaque)**
- Title: "Metal - Complete Blockage"
- Content: Shiny metal plate
- Animation: Light reflects off surface, no transmission
- Duration: 8s

**Step 10: Thick Book (Opaque)**
- Title: "Book - Solid Barrier to Light"
- Content: Closed book in light path
- Animation: Complete blockage, dark screen
- Duration: 8s

#### Activity 11.3 Recreation (Step 11)
- Title: "NCERT Activity 11.3: Testing Materials"
- Content: Replicate exact textbook activity with prediction table
- Animation: Sequential testing of materials from Table 11.1
- Interactive: Students can make predictions first
- Duration: 15s

### Practice Mode Steps (Steps 12-15)

**Step 12: Classification Challenge**
- Type: Drag-and-drop
- Task: Sort 9 materials into 3 categories
- Materials: Mix of transparent, translucent, opaque
- Feedback: Visual + text confirmation

**Step 13: Prediction Challenge**
- Type: Multiple choice
- Task: "Will light pass through this material?"
- Shows: Mystery material
- Options: Fully / Partially / Not at all
- Explanation: After answer

**Step 14: Light Intensity Matching**
- Type: Matching game
- Task: Match material to light transmission level
- Levels: 100%, 50%, 0%
- Materials: 6 different items

**Step 15: Real Object Classification**
- Type: Photo recognition
- Task: Classify real-world objects from images
- Objects: Window glass, curtain, wall, etc.

### Real World Mode (Steps 16-19)

**Step 16: Windows and Skylights**
- Title: "Why Windows Use Transparent Glass"
- Content: Architectural applications
- Explanation: Allow light while blocking wind/rain
- Examples: Home windows, car windshields, greenhouses

**Step 17: Privacy Screens**
- Title: "Translucent Materials for Privacy"
- Content: Bathroom windows, office partitions
- Explanation: Light passes but can't see details clearly
- Examples: Frosted glass, curtains, lampshades

**Step 18: Walls and Roofs**
- Title: "Opaque Materials for Protection"
- Content: Building construction
- Explanation: Block light, heat, and provide privacy/security
- Examples: Brick walls, concrete, metal roofing

**Step 19: Mixed Material Applications**
- Title: "Combining Material Properties"
- Content: Smart designs using multiple material types
- Examples: Stained glass, tinted windows, layered fabrics

### Hands-On Mode (Step 20)

**Step 20: Virtual Materials Lab**
- Features:
  - Material library (20+ options)
  - Drag any material into light path
  - Real-time transmission visualization
  - Adjust torch intensity
  - Change beam color
  - Measure transmission percentage
  - Create custom material stacks
  - Record observations table

---

## JSON Tool Call Examples

### Example 1: Complete Learning Experience
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "11.3 Light through Materials",
    "data": {
        "toolName": "light_materials_tool",
        "parameters": {
            "initialMode": "learn",
            "showModeSelector": true,
            "additionalProps": {
                "showTable": true,
                "highlightBeam": true,
                "showParticles": true,
                "showClassification": true
            }
        }
    },
    "instructions_for_student": "Learn how light behaves with different materials!"
}
```

### Example 2: Transparent Materials Only
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Transparent Materials Demo",
    "data": {
        "toolName": "light_materials_tool",
        "parameters": {
            "initialMode": "learn",
            "filterSteps": [2, 3, 4],
            "additionalProps": {
                "materials": ["glass", "clear_plastic", "water"],
                "highlightBeam": true,
                "showPercentage": true
            }
        }
    },
    "instructions_for_student": "See how light passes completely through transparent materials!"
}
```

### Example 3: NCERT Activity 11.3 Exact Replication
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Activity 11.3: Let us experiment",
    "data": {
        "toolName": "light_materials_tool",
        "parameters": {
            "initialMode": "learn",
            "filterSteps": [11],
            "additionalProps": {
                "showTable": true,
                "materials": ["cardboard", "paper", "glass", "tracing_paper", "thick_cloth"],
                "enableInteraction": true
            }
        }
    },
    "instructions_for_student": "Follow Activity 11.3 from your textbook!"
}
```

### Example 4: Practice Classification
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Classify Materials Challenge",
    "data": {
        "toolName": "light_materials_tool",
        "parameters": {
            "initialMode": "practice",
            "filterSteps": [12],
            "additionalProps": {
                "enableInteraction": true,
                "showClassification": true
            }
        }
    },
    "instructions_for_student": "Drag each material to the correct category!"
}
```

### Example 5: Hands-On Laboratory
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Materials Testing Lab",
    "data": {
        "toolName": "light_materials_tool",
        "parameters": {
            "initialMode": "hands_on",
            "showNavigation": false,
            "additionalProps": {
                "enableInteraction": true,
                "showPercentage": true,
                "showTable": true,
                "showParticles": true
            }
        }
    },
    "instructions_for_student": "Test different materials and record your observations!"
}
```

### Example 6: Comparison Mode
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Compare All Three Types",
    "data": {
        "toolName": "light_materials_tool",
        "parameters": {
            "initialMode": "learn",
            "filterSteps": [2, 5, 8],
            "autoPlayDuration": 5000,
            "additionalProps": {
                "highlightBeam": true,
                "showPercentage": true,
                "showClassification": true
            }
        }
    },
    "instructions_for_student": "See the difference between transparent, translucent, and opaque!"
}
```

### Example 7: Real World Applications
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Materials in Daily Life",
    "data": {
        "toolName": "light_materials_tool",
        "parameters": {
            "initialMode": "real_world",
            "showModeSelector": true
        }
    },
    "instructions_for_student": "Discover how we use different materials every day!"
}
```

### Example 8: Quick Demo (Minimal UI)
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Light Transmission Demo",
    "data": {
        "toolName": "light_materials_tool",
        "parameters": {
            "showModeSelector": false,
            "showNavigation": false,
            "showPlayPause": false,
            "initialStep": 2,
            "filterSteps": [2, 5, 8],
            "autoPlayDuration": 4000,
            "additionalProps": {
                "highlightBeam": true
            }
        }
    }
}
```

### Example 9: Assessment Mode
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Materials Knowledge Check",
    "data": {
        "toolName": "light_materials_tool",
        "parameters": {
            "initialMode": "practice",
            "showModeSelector": false,
            "additionalProps": {
                "showClassification": false,
                "enableInteraction": true
            }
        }
    },
    "instructions_for_student": "Test what you've learned about material properties!"
}
```

### Example 10: Quantitative Learning
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Measuring Light Transmission",
    "data": {
        "toolName": "light_materials_tool",
        "parameters": {
            "initialMode": "hands_on",
            "additionalProps": {
                "showPercentage": true,
                "showParticles": true,
                "highlightBeam": true,
                "enableInteraction": true
            }
        }
    },
    "instructions_for_student": "Measure exactly how much light passes through each material!"
}
```

---

## Decision Tree for Agents

```
Student asks about materials and light
    │
    ├─ "How does light pass through materials?" or "Explain transparent/translucent/opaque"
    │   └─ Use: initialMode: "learn", showClassification: true
    │
    ├─ "Show transparent materials" or "What passes light?"
    │   └─ Use: filterSteps: [2,3,4], materials: transparent only
    │
    ├─ "Show translucent materials" or "Partial light passing"
    │   └─ Use: filterSteps: [5,6,7], materials: translucent only
    │
    ├─ "Show opaque materials" or "What blocks light?"
    │   └─ Use: filterSteps: [8,9,10], materials: opaque only
    │
    ├─ "Activity 11.3" or "NCERT experiment"
    │   └─ Use: filterSteps: [11], showTable: true
    │
    ├─ "Let me test materials" or "Can I try?"
    │   └─ Use: initialMode: "hands_on", enableInteraction: true
    │
    ├─ "Quiz me" or "Test my knowledge"
    │   └─ Use: initialMode: "practice"
    │
    ├─ "Real life examples" or "Where do we use these?"
    │   └─ Use: initialMode: "real_world"
    │
    ├─ "Compare all three types"
    │   └─ Use: filterSteps: [2,5,8], showPercentage: true
    │
    └─ "Just the main idea" (quick demo)
        └─ Use: filterSteps: [2,5,8], minimal UI, fast autoplay
```

---

## Key Animation Features

### Torch and Screen Setup
1. **Torch rendering** - Realistic flashlight with beam cone
2. **Screen placement** - White surface showing light spots
3. **Distance indicators** - Optional measurements
4. **Environment** - Dark room background

### Material Animations

#### Transparent (Glass, Clear Plastic, Water)
- Light beam passes straight through with minimal scattering
- Bright spot on screen (90-100% intensity)
- Slight refraction effects at material boundaries
- Particles flow smoothly through material
- Glow effect on both entry and exit surfaces

#### Translucent (Tracing Paper, Frosted Glass, Thin Cloth)
- Light beam scatters within material
- Particles bounce and deflect
- Dimmer spot on screen (30-60% intensity)
- Diffused glow around material edges
- Some particles absorbed, some transmitted

#### Opaque (Cardboard, Metal, Book)
- Light beam stops at surface
- All particles bounce back or absorbed
- No spot on screen (0% transmission)
- Shadow formation behind material
- Surface reflection effects (especially for metal)

### Interactive Elements
- Drag-and-drop materials into light path
- Smooth sliding animations with physics
- Real-time transmission calculations
- Particle count adjusts based on transmission
- Color intensity changes on screen

### UI Animations
- Material cards slide in with stagger effect
- Classification badges pulse when correct
- Table cells fill with check marks/X marks
- Progress bars for light intensity
- Confetti animation on quiz success

---

## Tips for Agents

1. **For textbook alignment**: Use `filterSteps: [11]` to match NCERT Activity 11.3 exactly
2. **For visual learners**: Enable `showParticles: true` and `highlightBeam: true`
3. **For concept building**: Start with transparent, then translucent, then opaque (steps 2→5→8)
4. **For assessment**: Use Practice mode with `showClassification: false` initially
5. **For quantitative**: Enable `showPercentage: true` for numerical understanding
6. **For quick demos**: Use 3-step comparison (transparent, translucent, opaque)
7. **For hands-on**: Enable all interaction features and provide material variety
8. **For real-world connection**: Real World mode after Learn mode

---

## Common Materials Available

### Transparent (Light passes almost completely)
- Clear glass window pane
- Clear plastic bottle
- Water in beaker
- Clean air
- Cellophane wrapper
- Clear acrylic sheet

### Translucent (Light passes partially)
- Tracing paper
- Frosted glass
- Thin white cloth
- Wax paper
- Tissue paper
- Lampshade material
- Butter paper

### Opaque (Light does not pass)
- Cardboard
- Metal sheet (aluminum, steel)
- Thick book
- Wooden plank
- Brick
- Thick cloth
- Concrete block
- Stone

---

## Multilingual Support

Supports English, Hindi, and Gujarati:
- Mode labels and titles
- Material names
- Step descriptions
- Instructions
- Practice questions
- Feedback messages
- Table headings

**Example Translations:**

| English | Hindi | Gujarati |
|---------|-------|----------|
| "Light passes completely" | "प्रकाश पूरी तरह से गुजरता है" | "પ્રકાશ સંપૂર્ણપણે પસાર થાય છે" |
| "Transparent" | "पारदर्शी" | "પારદર્શક" |
| "Translucent" | "पारभासी" | "અર્ધપારદર્શક" |
| "Opaque" | "अपारदर्शी" | "અપારદર્શક" |

---

## Accessibility Features

- **Keyboard navigation**: Arrow keys, spacebar, Enter, Tab
- **Screen reader support**: ARIA labels on all elements
- **High contrast mode**: Compatible with system settings
- **Adjustable speed**: Animation speed multiplier
- **Alternative text**: Descriptions for visual elements
- **Focus indicators**: Clear keyboard focus
- **Color blind friendly**: Patterns + colors for material types

---

## Performance Specifications

- **Target FPS**: 60fps smooth animations
- **Canvas optimization**: RequestAnimationFrame loops
- **Particle system**: Efficient pooling (max 500 particles)
- **Mobile responsive**: Touch-friendly, scales to screen
- **Browser support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## Educational Metadata

**Curriculum**: NCERT Grade 7 Science  
**Chapter**: 11 - Light: Shadows and Reflections  
**Topic**: 11.3 - Light through Transparent, Translucent, and Opaque Materials

**Learning Outcomes:**
1. Classify materials based on light transmission
2. Predict how light behaves with different materials
3. Conduct systematic experiments with observation tables
4. Apply material properties to real-world contexts

**Prerequisites:**
- Basic understanding of light
- Observation and recording skills
- Understanding of "see-through" concept from Grade 6

**Assessment Alignment:**
- Classification skills
- Prediction and testing
- Data recording (Table 11.1)
- Application of concepts

---

## Common Query Patterns

| Student Query | Recommended Configuration |
|---------------|---------------------------|
| "Teach me about materials" | `initialMode: "learn"`, all materials |
| "What is transparent?" | `filterSteps: [2,3,4]` |
| "What is translucent?" | `filterSteps: [5,6,7]` |
| "What is opaque?" | `filterSteps: [8,9,10]` |
| "Activity 11.3" | `filterSteps: [11]`, `showTable: true` |
| "Let me test" | `initialMode: "hands_on"` |
| "Quiz me" | `initialMode: "practice"` |
| "Real examples" | `initialMode: "real_world"` |
| "Compare all" | `filterSteps: [2,5,8]` |

---

## Error Handling

- Invalid `materials` → defaults to standard 7-material set
- Invalid `beamColor` → defaults to `'#fbbf24'`
- Empty `filterSteps` → shows all steps
- Invalid `initialMode` → defaults to `'learn'`

---

## Version History

- **v1.0** - Initial release with NCERT Activity 11.3
- **v1.1** - Added particle animation system
- **v1.2** - Enhanced material library (20+ materials)
- **v1.3** - Added quantitative measurements
- **v1.4** - Practice mode with varied challenges
- **v1.5** - Real-world applications module

---

For support or feature requests, contact Reasonify EdTech development team.