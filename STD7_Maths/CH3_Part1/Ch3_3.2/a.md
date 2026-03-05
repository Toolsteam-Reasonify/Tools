# A Tenth Part - Interactive Learning Tool

This skill creates an interactive educational tool for teaching Topic 3.2 "A Tenth Part" from the Ganita Prakash Grade 7 Mathematics curriculum, following the Singularity Design System.

## Overview

An engaging, multi-mode learning experience that helps students understand:
- The concept of one-tenth (1/10) as a fractional unit
- How 10 one-tenths equal 1 whole unit
- Converting between mixed numbers and tenths (e.g., 3 4/10 = 34/10)
- Proper reading conventions for decimal fractions
- Real-world applications of tenth measurements

## Features

### Three Learning Modes

1. **Learn Mode** (📚)
   - 5 interactive steps with visual demonstrations
   - Pencil and ruler visualization
   - Tenths blocks representation
   - Conversion diagrams
   - Number line with tenth markings
   - Step-by-step equation breakdowns

2. **Practice Mode** (🧠)
   - 5 multiple-choice questions
   - Immediate feedback with explanations
   - Score tracking
   - Correct/incorrect visual indicators
   - Completion summary with performance feedback

3. **Real World Mode** (🌍)
   - 4 practical scenarios showing tenths in action
   - Measuring fabric
   - Pouring juice
   - Running track measurements
   - Digital scale readings
   - Real-life tips and applications

### Visual Components

- **Pencil with Ruler**: Shows 3 4/10 units measurement
- **Tenths Blocks**: 10 blocks demonstrating 10 × 1/10 = 1
- **Conversion Diagram**: Visual flow showing 34 × 1/10 → 34/10 → 3 + 4/10
- **Number Line**: Interactive line with whole numbers and tenth divisions
- **Equation Breakdown**: Step-by-step mathematical decomposition

### Design System Compliance

Follows Singularity Design System specifications:
- **Colors**: Primary (#4A4DC9), Primary Dark (#533086), Secondary (#FF7212), Secondary Light (#FC9145)
- **Typography**: Poppins font family with weights 400, 500, 600, 700
- **Spacing**: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px system
- **Border Radius**: 8px, 10px, 12px, 16px, 24px, 50% (round)
- **Buttons**: Three variants (contained, outlined, text) with proper states
- **Shadows**: Consistent elevation system

## Usage

### Basic Implementation
```typescript
import TenthPartTool from './TenthPartTool';

<TenthPartTool />
```

### With Custom Configuration
```typescript
<TenthPartTool
  props={{
    initialMode: "learn",
    showModeSelector: true,
    enabledModes: ["learn", "practice", "real_world"],
    showNavigation: true,
    showPlayPause: true,
    showStepIndicator: true,
    initialStep: 0,
    animationSpeed: 1,
    autoPlayDuration: 8000,
    themeColor: "#533086",
    darkMode: false,
    additionalProps: {
      pencilLength: 3.4,
      totalBlocks: 10,
      highlightedBlocks: 10,
      numberLineValue: 3.4,
    }
  }}
  setStepDetails={(details) => console.log(details)}
  stopAutoNext={false}
  setStopAutoNext={(stop) => console.log(stop)}
/>
```

### Configuration Options

#### Main Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialMode` | `"learn" \| "practice" \| "real_world"` | `"learn"` | Starting mode |
| `showModeSelector` | `boolean` | `true` | Show mode toggle buttons |
| `enabledModes` | `ModeType[]` | `["learn", "practice", "real_world"]` | Available modes |
| `showNavigation` | `boolean` | `true` | Show Previous/Next buttons |
| `showPlayPause` | `boolean` | `true` | Show Play/Pause button |
| `showStepIndicator` | `boolean` | `true` | Show progress bar |
| `initialStep` | `number` | `0` | Starting step (0-indexed) |
| `animationSpeed` | `number` | `1` | Speed multiplier for animations |
| `autoPlayDuration` | `number` | `8000` | Milliseconds per auto-play step |
| `themeColor` | `string` | `"#533086"` | Primary theme color |
| `darkMode` | `boolean` | `false` | Enable dark mode |

#### Additional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pencilLength` | `number` | `3.4` | Length of pencil in visualization (units) |
| `totalBlocks` | `number` | `10` | Total blocks in tenths visualization |
| `highlightedBlocks` | `number` | `10` | Highlighted blocks (should be 10) |
| `numberLineValue` | `number` | `3.4` | Marked value on number line |
| `customQuestions` | `PracticeQuestion[]` | Default questions | Custom practice questions |
| `customScenarios` | `RealWorldScenario[]` | Default scenarios | Custom real-world scenarios |

#### Callback Props

| Prop | Type | Description |
|------|------|-------------|
| `setStepDetails` | `(details: StepDetails) => void` | Called when step changes |
| `stopAutoNext` | `boolean` | External control for auto-play |
| `setStopAutoNext` | `(stop: boolean) => void` | Callback to control auto-play |

### Custom Questions Format
```typescript
const customQuestions: PracticeQuestion[] = [
  {
    id: 1,
    question: "Your question here?",
    options: [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    correct: "Option B",
    explanation: "Detailed explanation of why this is correct."
  }
];
```

### Custom Scenarios Format
```typescript
const customScenarios: RealWorldScenario[] = [
  {
    id: 1,
    title: "Scenario Title",
    scenario: "Description of the real-world situation...",
    visual: "📏",
    question: "Think about this question?",
    answer: "The answer and explanation...",
    realLifeTip: "Practical tip for students!"
  }
];
```

## Educational Objectives

### Learn Mode Objectives

1. **Step 1 - Understanding a Tenth Part**
   - Visualize fractional measurements
   - Understand mixed number notation (3 4/10)
   - See real-world measurement tools

2. **Step 2 - Ten One-Tenths Make One Unit**
   - Grasp the fundamental relationship: 10 × 1/10 = 1
   - Visual representation with blocks
   - Counting and grouping practice

3. **Step 3 - Converting 34 One-Tenths**
   - Convert mixed numbers to improper fractions
   - Understand equivalence: 3 4/10 = 34/10
   - See the decomposition process

4. **Step 4 - Reading Decimal Numbers**
   - Learn proper reading conventions
   - Distinguish between 4 1/10, 4/10, 41/10, 41 1/10
   - Avoid common reading errors

5. **Step 5 - The Math Behind Tenths**
   - Understand place value relationships
   - See complete equation breakdowns
   - Connect concepts to whole number operations

### Practice Mode Objectives

- Assess understanding of tenth concepts
- Reinforce conversion skills
- Practice reading notation
- Build confidence through immediate feedback
- Track learning progress

### Real World Mode Objectives

- Connect abstract math to practical situations
- See professional applications (tailoring, cooking, sports, shipping)
- Understand importance of precision
- Build relevance and motivation
- Transfer learning to everyday contexts

## Responsive Design

The tool automatically adapts to:
- **Mobile** (< 640px): Stacked layouts, larger touch targets, simplified navigation
- **Tablet** (640px - 1024px): Optimized spacing, two-column where appropriate
- **Desktop** (> 1024px): Full multi-column layouts, enhanced visualizations

## Animation System

All animations follow ease-out curves for natural feel:
- `fadeIn`: Smooth opacity transitions
- `slideUp/Down/Left/Right`: Directional entrances
- `scaleIn`: Growing from center
- `popIn`: Bouncy entrance with overshoot
- `bounce`: Rhythmic vertical motion
- `pulse`: Subtle breathing effect
- `shimmer`: Highlight sweep
- `drawLine`: Progressive line drawing
- `fillProgress`: Horizontal bar fill

## Accessibility Features

- High contrast color combinations
- Large touch targets (minimum 44px height)
- Clear visual feedback for all interactions
- Keyboard navigation support
- Screen reader friendly structure
- Focus indicators on interactive elements
- Error messages with explanations

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Optimized touch interactions

## Performance

- Lazy loading of visual components
- Efficient re-renders with React keys
- CSS animations for smooth 60fps performance
- Optimized SVG rendering
- Minimal bundle size impact

## Pedagogical Approach

### Constructivist Learning
- Start with concrete (ruler, blocks)
- Move to representational (diagrams, number lines)
- End with abstract (equations, conversions)

### Scaffolded Instruction
- Gradual complexity increase
- Build on prior knowledge
- Multiple representations of same concept
- Immediate corrective feedback

### Active Engagement
- Interactive visualizations
- Practice with consequences
- Real-world connections
- Self-paced learning

## Troubleshooting

### Issue: Animations not playing
**Solution**: Check `showAnimations` prop is not set to `false`, ensure browser supports CSS animations

### Issue: Progress not saving
**Solution**: Component is stateless by design; implement external state management if persistence needed

### Issue: Custom questions not displaying
**Solution**: Verify `customQuestions` array format matches `PracticeQuestion[]` interface exactly

### Issue: Dark mode colors incorrect
**Solution**: Ensure `darkMode` prop is set correctly; some colors auto-adjust, others use design tokens

## Future Enhancements

Potential additions:
- Audio narration for steps
- Printable worksheets generator
- Performance analytics dashboard
- Multilingual support
- Teacher dashboard for class tracking
- Adaptive difficulty based on performance
- Gamification elements (badges, achievements)
- Export progress as PDF report

## License

Part of Ganita Prakash educational materials. Check with Anthropic/curriculum developers for usage rights.

## Support

For issues or questions:
- Check component props are correctly typed
- Review console for TypeScript errors
- Ensure all required dependencies installed
- Verify React version compatibility (16.8+)