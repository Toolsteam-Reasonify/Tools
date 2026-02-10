# Light Travel in a Straight Line - Interactive Educational Tool

## Overview

An interactive React/TypeScript component that demonstrates whether light travels in a straight line through two engaging experiments: the matchbox experiment and the pipe experiment. The tool features three modes: Learn (step-by-step visualization), Practice (quiz questions), and Real World (practical applications).

---

## Component Information

**Component Name:** `LightTravelTool`

**File:** `LightTravelTool.tsx`

**Framework:** React with TypeScript

**Styling:** Pure CSS-in-JS (no external dependencies)

**Icons:** Inline SVG components (no external icon libraries)

---

## Features

### 🎓 Learn Mode
- **Interactive Canvas Visualization**: Animated demonstrations of light behavior
- **7 Step Journey**: From introduction through both experiments
- **Auto-play Feature**: Automatic progression through steps
- **Manual Controls**: Play/pause, previous/next, and reset buttons
- **Progress Tracking**: Visual progress bar and step indicators

### 📝 Practice Mode
- **8 Quiz Questions**: Comprehensive understanding checks
- **Multiple Choice Format**: Clear answer options
- **Instant Feedback**: Immediate explanation after each answer
- **Score Tracking**: Real-time score display
- **Completion Summary**: Performance feedback with restart option

### 🌍 Real World Mode
- **12 Practical Applications**: Real-world examples of straight-line light properties
- **Categorized Content**: Organized by industry/domain
- **Visual Examples**: Icon representations and detailed explanations
- **Hover Effects**: Enhanced interactivity with smooth animations

---

## Props Interface

```typescript
interface LightTravelToolProps {
  props?: {
    // ─────────────────────────────────────────────────────────────────
    // DIMENSIONS
    // ─────────────────────────────────────────────────────────────────
    width?: number;                    // Default: 800
    height?: number;                   // Default: 600
    
    // ─────────────────────────────────────────────────────────────────
    // MODE CONFIGURATION
    // ─────────────────────────────────────────────────────────────────
    initialMode?: ModeType;            // "learn" | "practice" | "realWorld" (default: "learn")
    showModeSelector?: boolean;        // Show/hide mode tabs (default: true)
    enabledModes?: ModeType[];         // Which modes to enable (default: all)
    
    // ─────────────────────────────────────────────────────────────────
    // NAVIGATION CONFIGURATION
    // ─────────────────────────────────────────────────────────────────
    showNavigation?: boolean;          // Show/hide prev/next buttons (default: true)
    showPlayPause?: boolean;           // Show/hide play/pause button (default: true)
    showStepIndicator?: boolean;       // Show/hide step counter (default: true)
    
    // ─────────────────────────────────────────────────────────────────
    // STEP FILTERING
    // ─────────────────────────────────────────────────────────────────
    initialStep?: number;              // Starting step ID (default: 0)
    filterSteps?: number[];            // Only show these step IDs
    
    // ─────────────────────────────────────────────────────────────────
    // ANIMATION CONFIGURATION
    // ─────────────────────────────────────────────────────────────────
    animationSpeed?: number;           // Animation speed multiplier (default: 1)
    autoPlayDuration?: number;         // Auto-advance delay in ms (default: 12000)
    
    // ─────────────────────────────────────────────────────────────────
    // THEME
    // ─────────────────────────────────────────────────────────────────
    themeColor?: string;               // Primary color (default: "#3b82f6")
    darkMode?: boolean;                // Dark mode toggle (default: false)
    
    // ─────────────────────────────────────────────────────────────────
    // ADDITIONAL PROPS - DYNAMIC CONTENT
    // ─────────────────────────────────────────────────────────────────
    additionalProps?: {
      customSteps?: StepData[];
      customQuestions?: Question[];
      customApplications?: Application[];
      canvasWidth?: number;
      canvasHeight?: number;
      lightSpeed?: number;
      particleCount?: number;
      torchColor?: string;
      lightBeamColor?: string;
      matchboxColor?: string;
      pipeColor?: string;
    };
  };
  
  // ─────────────────────────────────────────────────────────────────
  // EXTERNAL CONTROLS
  // ─────────────────────────────────────────────────────────────────
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}
```

---

## Data Types

### StepData
```typescript
interface StepData {
  id: number;
  title: string;
  description: string;
  activity: "matchbox" | "pipe" | "conclusion";
}
```

### Question
```typescript
interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  visualType: "matchbox" | "pipe" | "concept";
}
```

### Application
```typescript
interface Application {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
  example: string;
}
```

---

## Usage Examples

### Example 1: Basic Usage
```jsx
import LightTravelTool from './LightTravelTool';

function App() {
  return <LightTravelTool />;
}
```

### Example 2: Start in Practice Mode
```jsx
<LightTravelTool 
  props={{
    initialMode: "practice"
  }}
/>
```

### Example 3: Only Learn Mode, No Controls
```jsx
<LightTravelTool 
  props={{
    showModeSelector: false,
    enabledModes: ["learn"],
    showNavigation: false,
    showPlayPause: false,
    showStepIndicator: false,
    autoPlayDuration: 0
  }}
/>
```

### Example 4: Custom Theme
```jsx
<LightTravelTool 
  props={{
    themeColor: "#7c3aed",
    darkMode: true
  }}
/>
```

### Example 5: Specific Steps Only
```jsx
<LightTravelTool 
  props={{
    filterSteps: [1, 3, 5, 7],  // Only show intro and key steps
    initialStep: 1
  }}
/>
```

### Example 6: Faster Animation
```jsx
<LightTravelTool 
  props={{
    animationSpeed: 2,
    autoPlayDuration: 6000
  }}
/>
```

### Example 7: Custom Canvas Size
```jsx
<LightTravelTool 
  props={{
    additionalProps: {
      canvasWidth: 1200,
      canvasHeight: 800
    }
  }}
/>
```

### Example 8: Custom Questions
```jsx
<LightTravelTool 
  props={{
    additionalProps: {
      customQuestions: [
        {
          id: 1,
          question: "Why can't we see around corners?",
          options: [
            "Light is too weak",
            "Light travels in straight lines",
            "Our eyes are not strong enough",
            "There is no light around corners"
          ],
          correctAnswer: 1,
          explanation: "Light travels in straight lines and cannot bend around obstacles.",
          visualType: "concept"
        }
      ]
    }
  }}
/>
```

### Example 9: Real World Mode Only
```jsx
<LightTravelTool 
  props={{
    initialMode: "realWorld",
    enabledModes: ["realWorld"],
    showModeSelector: false
  }}
/>
```

### Example 10: With External Controls
```jsx
function ParentComponent() {
  const [stepDetails, setStepDetails] = useState(null);
  const [stopAuto, setStopAuto] = useState(false);

  return (
    <>
      <div>Current Step: {stepDetails?.stepTitle}</div>
      <button onClick={() => setStopAuto(true)}>Stop Auto-play</button>
      
      <LightTravelTool 
        props={{
          initialMode: "learn"
        }}
        setStepDetails={setStepDetails}
        stopAutoNext={stopAuto}
        setStopAutoNext={setStopAuto}
      />
    </>
  );
}
```

---

## Agent Integration Guide

### Tool Call Format

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Does Light Travel in a Straight Line?",
  "data": {
    "toolName": "light_travel_tool",
    "parameters": {
      "initialMode": "learn",
      "showModeSelector": true,
      "themeColor": "#3b82f6"
    }
  },
  "instructions_for_student": "Let's explore how light travels through fun experiments!"
}
```

### Common Agent Scenarios

#### Scenario 1: Student asks "How does light travel?"
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Light Travel Exploration",
  "data": {
    "toolName": "light_travel_tool",
    "parameters": {
      "initialMode": "learn",
      "showModeSelector": true
    }
  },
  "instructions_for_student": "Watch these experiments to discover how light travels!"
}
```

#### Scenario 2: Student asks "Can I practice what I learned?"
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Light Travel Quiz",
  "data": {
    "toolName": "light_travel_tool",
    "parameters": {
      "initialMode": "practice",
      "enabledModes": ["practice"]
    }
  },
  "instructions_for_student": "Test your understanding with these questions!"
}
```

#### Scenario 3: Student asks "Where is this used in real life?"
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Real-World Applications of Light",
  "data": {
    "toolName": "light_travel_tool",
    "parameters": {
      "initialMode": "realWorld",
      "showModeSelector": true
    }
  },
  "instructions_for_student": "Discover how this principle is used every day!"
}
```

#### Scenario 4: Quick demo without controls
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Light Travel Demo",
  "data": {
    "toolName": "light_travel_tool",
    "parameters": {
      "showModeSelector": false,
      "showNavigation": false,
      "showPlayPause": false,
      "filterSteps": [3, 6],
      "autoPlayDuration": 8000
    }
  },
  "instructions_for_student": "Here's a quick demonstration!"
}
```

---

## Default Content

### Default Steps (7 total)
1. Introduction - Does Light Travel in a Straight Line?
2. Matchbox Experiment Setup
3. Aligned Matchboxes - Light Passes Through
4. Misaligned Matchboxes - Light is Blocked
5. Pipe Experiment Introduction
6. Straight Pipe - Candle Visible
7. Bent Pipe - Candle Not Visible

### Default Questions (8 total)
- Topics covered:
  - Matchbox experiment observations
  - Pipe experiment observations
  - Light properties and behavior
  - Practical understanding

### Default Applications (12 total)
- Categories:
  - Military & Navigation (Periscopes)
  - Construction & Engineering (Laser alignment)
  - Communication Technology (Fiber optics)
  - Lighting & Safety (Flashlights)
  - Imaging & Art (Cameras)
  - Sustainable Energy (Solar cookers)
  - Astronomy & Time (Sundials)
  - Transportation & Safety (Traffic signals)
  - Science & Research (Optical instruments)
  - Retail & Commerce (Barcode scanners)
  - Medical Technology (Endoscopes)
  - Entertainment & Arts (Stage lighting)

---

## Animation Features

### Canvas Animations
- **Smooth 60fps rendering** using requestAnimationFrame
- **Progressive drawing** of light beams
- **Easing functions** for natural motion
- **Particle effects** for light rays
- **Interactive elements** with hover states

### UI Animations
- **Fade transitions** between steps (700ms)
- **Slide animations** for content changes
- **Scale transforms** on hover (1.05x)
- **Progress bar animations** with smooth fills
- **Button press effects** (scale 0.95x)

### Timing
- Default animation speed: 1x (adjustable via props)
- Auto-play duration: 12 seconds per step
- Transition duration: 500ms between steps
- Hover effect duration: 300-500ms

---

## Customization Options

### Color Theming
- Primary theme color (default: `#3b82f6`)
- Gradient combinations with teal (`#14b8a6`)
- Dark mode support
- Hover state color variations

### Layout Flexibility
- Responsive grid layouts
- Flexible canvas sizing
- Adaptive card designs
- Mobile-friendly controls

### Content Customization
- Custom steps with own titles/descriptions
- Custom quiz questions
- Custom real-world applications
- Canvas visual customizations

---

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance Notes

- Canvas rendering optimized for 60fps
- Animations use CSS transforms (GPU accelerated)
- No external dependencies reduce bundle size
- Lazy rendering of inactive modes
- Efficient state management

---

## Educational Value

### Learning Outcomes
Students will understand:
- ✓ Light travels in straight lines
- ✓ Light cannot bend around obstacles
- ✓ Aligned paths allow light transmission
- ✓ Real-world applications of light properties

### Pedagogical Approach
- **Visual demonstrations** before theory
- **Interactive exploration** over passive learning
- **Immediate feedback** in practice mode
- **Real-world connections** for context
- **Self-paced learning** with manual controls

---

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- Clear visual feedback
- High contrast mode compatible
- Screen reader friendly text content
- ARIA labels for interactive elements

---

## Future Enhancement Ideas

- Add sound effects for interactions
- Include student drawing/annotation tools
- Multi-language support
- Save progress feature
- Export results/certificates
- Teacher dashboard integration
- More experiment variations
- AR/VR mode for immersive learning

---

## Support & Documentation

For issues or questions:
- Review the props interface above
- Check usage examples
- Verify browser compatibility
- Test with minimal configuration first

---

## Version History

**v1.0** - Initial release
- Three modes: Learn, Practice, Real World
- 7 animated steps
- 8 quiz questions
- 12 real-world applications
- Full prop configuration
- Dark mode support
- English language only

---

## License

This component is provided as-is for educational purposes.