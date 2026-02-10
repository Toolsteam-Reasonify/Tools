# Sources of Light - Learn Mode Interactive Tool

An interactive educational component for teaching Grade 7 students about sources of light, luminous and non-luminous objects, with smooth animations and engaging visuals.

## Overview

This tool teaches students about:
- Natural sources of light (Sun, stars, lightning, fireflies)
- Artificial sources of light (fire, electric lights, LED lamps)
- Luminous vs non-luminous objects
- The Moon as a reflector of sunlight

## Features

### 🎨 Visual Features
- **Animated Sun**: Rotating sun with glowing rays
- **Twinkling Stars**: Realistic star twinkling effects
- **Firefly Animations**: Glowing fireflies with pulsing light
- **Lightning Effects**: Dynamic lightning bolt animations
- **Moon Phases**: Moon showing reflection of sunlight
- **LED Lamp**: Modern light source visualization
- **Smooth Transitions**: Page transitions with fade and slide effects

### 🎯 Educational Modes
1. **Learn Mode**: Step-by-step content with animations
2. **Practice Mode**: Interactive quiz questions
3. **Explore Mode**: Free exploration of light sources

### ⚡ Animation Highlights
- Staggered entry animations for content
- Hover effects on interactive elements
- Smooth step transitions (fade + slide)
- Realistic light glow effects using CSS filters
- Pulsing animations for luminous objects
- Auto-play functionality with progress indicators

## Props Interface

```typescript
interface SourcesOfLightLearnModeProps {
    props?: {
        // Dimensions
        width?: number;                    // Default: 900
        height?: number;                   // Default: 700
        
        // Mode Configuration
        initialMode?: 'learn' | 'practice' | 'explore';
        showModeSelector?: boolean;        // Default: true
        enabledModes?: ('learn' | 'practice' | 'explore')[];
        
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
        themeColor?: string;               // Default: "#f59e0b" (amber)
        darkMode?: boolean;                // Default: false
        
        // Additional Props
        additionalProps?: {
            highlightSources?: ('sun' | 'stars' | 'firefly' | 'lightning' | 'fire' | 'led' | 'moon')[];
            showDefinitions?: boolean;
            emphasizeLuminous?: boolean;
            customExamples?: {
                name: string;
                type: 'luminous' | 'non-luminous';
                description: string;
            }[];
        };
    };
    
    // External Controls
    setStepDetails?: (stepDetails: StepDetails) => void;
    stopAutoNext?: boolean;
    setStopAutoNext?: (stopAutoNext: boolean) => void;
}
```

## Usage Examples

### Basic Learn Mode
```typescript
<SourcesOfLightLearnMode 
    props={{
        width: 900,
        height: 700,
        initialMode: 'learn'
    }}
/>
```

### Highlight Specific Sources
```typescript
<SourcesOfLightLearnMode 
    props={{
        initialMode: 'learn',
        additionalProps: {
            highlightSources: ['sun', 'moon'],
            showDefinitions: true
        }
    }}
/>
```

### Practice Mode Only
```typescript
<SourcesOfLightLearnMode 
    props={{
        initialMode: 'practice',
        enabledModes: ['practice'],
        showModeSelector: false
    }}
/>
```

### Custom Examples
```typescript
<SourcesOfLightLearnMode 
    props={{
        additionalProps: {
            customExamples: [
                {
                    name: "Flashlight",
                    type: "luminous",
                    description: "Battery-powered artificial light"
                },
                {
                    name: "Mirror",
                    type: "non-luminous", 
                    description: "Reflects light but doesn't emit it"
                }
            ]
        }
    }}
/>
```

### Auto-Play Presentation
```typescript
<SourcesOfLightLearnMode 
    props={{
        initialMode: 'learn',
        showNavigation: false,
        showModeSelector: false,
        autoPlayDuration: 5000
    }}
/>
```

## Learn Mode Steps

1. **Introduction**: What is light and why do we need it?
2. **Natural Light Sources**: Sun, stars, lightning, fireflies
3. **The Sun**: Main source of natural light on Earth
4. **Artificial Light**: Fire, oil lamps, candles
5. **Modern Lighting**: Electric lights and LED technology
6. **Luminous Objects**: Objects that emit their own light
7. **Non-Luminous Objects**: Objects that don't emit light
8. **The Moon**: A non-luminous object that reflects sunlight
9. **LED Technology**: Energy-efficient modern lighting
10. **Summary**: Review of key concepts

## Practice Mode

Interactive questions covering:
- Identifying luminous vs non-luminous objects
- Classifying natural vs artificial light sources
- Understanding the Moon's reflection
- LED lamp benefits
- Real-world applications

## Agent Integration

### JSON Schema for Tool Call
```json
{
    "frontend_action": "show_interactive_tool",
    "title": "Sources of Light",
    "data": {
        "toolName": "sources_of_light_learn_mode",
        "parameters": {
            "initialMode": "learn",
            "showModeSelector": true,
            "additionalProps": {
                "highlightSources": ["sun", "moon"],
                "showDefinitions": true
            }
        }
    },
    "instructions_for_student": "Learn about different sources of light and understand luminous and non-luminous objects!"
}
```

### Agent Decision Tree
```
Student asks about light
    │
    ├─ "What is light?" or "Sources of light"
    │   └─ Use: initialMode: "learn", step 1
    │
    ├─ "What is the Sun?" or "Natural light"
    │   └─ Use: filterSteps: [2, 3], highlightSources: ["sun", "stars"]
    │
    ├─ "Luminous objects" or "What emits light?"
    │   └─ Use: filterSteps: [6], emphasizeLuminous: true
    │
    ├─ "Does the Moon make light?" or "Moon light"
    │   └─ Use: filterSteps: [8], highlightSources: ["moon"]
    │
    ├─ "LED lamps" or "Modern lighting"
    │   └─ Use: filterSteps: [9], highlightSources: ["led"]
    │
    └─ "Test my knowledge" or "Quiz"
        └─ Use: initialMode: "practice"
```

## Animation Details

### Sun Animation
- Continuous rotation (20s)
- Glowing rays with blur filter
- Pulsing light effect

### Stars Animation
- Random twinkling with opacity changes
- Staggered animation delays
- Scale transform on twinkle

### Firefly Animation
- Gaussian blur glow effect
- Pulsing opacity (2s cycle)
- Random positioning
- Color: warm yellow-green (#ffd700)

### Lightning Animation
- Quick flash effect (0.2s)
- Zigzag path using SVG
- Random intervals (3-5s)
- White glow with box-shadow

### Moon Animation
- Slow orbit indication
- Crescent shape showing reflection
- Subtle glow effect
- Reflected light beam from sun

### Content Transitions
- Fade in/out: 400ms
- Slide up: 30px transform
- Stagger delay: 100ms per element
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

## Technical Details

- **Framework**: React 18+ with TypeScript
- **Styling**: Pure CSS-in-JS (inline styles)
- **Icons**: Custom SVG icons (no external dependencies)
- **Animations**: CSS transitions, transforms, and keyframes
- **Canvas**: Not used (pure DOM/SVG)
- **File Size**: Single file component (~800 lines)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- 60 FPS animations
- Optimized re-renders with React.memo
- GPU-accelerated transforms
- Efficient animation cleanup

## Accessibility

- Keyboard navigation support
- ARIA labels on interactive elements
- Focus indicators
- Screen reader friendly content

## Educational Alignment

- **Grade Level**: Grade 7 Science
- **Chapter**: 11 - Light: Shadows and Reflections
- **Section**: 11.1 - Sources of Light
- **Curriculum**: Indian NCERT Science Textbook

## License

MIT License - Free for educational use
