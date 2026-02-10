# Radiation Learning Interactive Component - Agent Prompt

## Overview
You are tasked with creating a comprehensive, multilingual educational tool for teaching radiation concepts to Grade 7 students in India. This tool should be interactive, engaging, and support English, Hindi, and Gujarati languages.

## Component Structure

### Base Files
1. **RadiationLearning.tsx** - Main TypeScript component (English only)
2. **radiation_translations.json** - Complete translations for Hindi and Gujarati
3. **AGENT_PROMPT.md** - This instruction file

### Core Requirements

#### 1. Language Support
- **Primary Language**: English (embedded in TypeScript)
- **Translation Languages**: Hindi (hi), Gujarati (gu)
- All UI text, questions, explanations, and content must be translatable
- Support for language-specific fonts:
  - Hindi: "Noto Sans Devanagari"
  - Gujarati: "Noto Sans Gujarati"
  - English: "Poppins"

#### 2. Learning Modes

##### A. Learn Mode (Interactive Demonstrations)
- **Purpose**: Teach radiation concepts through step-by-step visual demonstrations
- **Features**:
  - Animated explanations with canvas rendering
  - 7+ steps covering radiation fundamentals
  - Auto-play with pause/resume controls
  - Progress indicators
  - Visual animations showing:
    - Heat radiation waves
    - Temperature differences
    - Particle-free heat transfer
    - Sun-Earth radiation
    - Color absorption/reflection
    - Comparison with conduction/convection

- **Step Types**:
  1. Introduction to radiation
  2. Fireplace heat demonstration
  3. Sun's heat reaching Earth
  4. Object cooling through radiation
  5. Light vs dark color absorption
  6. Comparison of heat transfer methods
  7. Heating water animation

##### B. Practice Mode (Interactive Quiz)
- **Purpose**: Test understanding through various question types
- **Question Types**:
  - Multiple Choice (MCQ)
  - True/False
  - Fill in the Blank
  - Matching pairs
  - Sequence ordering
  - Classification

- **Features**:
  - 12+ questions covering all radiation concepts
  - Difficulty levels: Easy, Medium, Hard
  - Point-based scoring system
  - Immediate feedback with explanations
  - Progress tracking
  - Grade calculation (A/B/C)
  - Ability to retry questions
  - Final summary with key reminders

##### C. Real World Applications
- **Purpose**: Connect concepts to practical Indian examples
- **Features**:
  - 10+ real-world applications
  - Categories: Nature, Home, Everyday, Technology, Clothing
  - Expandable cards with detailed information
  - Filter by category
  - Difficulty indicators
  - Each application includes:
    - Description
    - How it works
    - Science behind it
    - Real Indian example
    - Benefits and importance

#### 3. Technical Implementation

##### Component Architecture
```typescript
// Main Components
- LanguageProvider: Context for language management
- Navbar: Navigation between modes
- RadiationLearnMode: Learn mode component
- RadiationPracticeMode: Practice quiz component
- RadiationRealWorld: Applications component
- LanguageSelector: Language switcher
```

##### State Management
- Current mode (learn/practice/applications)
- Selected language (en/hi/gu)
- Current step/question index
- User answers and scoring
- Animation states
- UI preferences

##### Animations
- Canvas-based animations for visual demonstrations
- Smooth transitions between steps
- Particle systems for radiation waves
- Temperature visualizations
- Interactive elements

#### 4. Content Requirements

##### Learn Mode Content
Cover these concepts:
1. **Radiation Definition**: Heat transfer without medium
2. **Vacuum Travel**: Unlike conduction/convection
3. **Sun's Energy**: 150 million km journey
4. **Color Effects**: Light colors reflect, dark colors absorb
5. **Universal Process**: All objects radiate
6. **Comparison**: How radiation differs from other methods

##### Practice Mode Content
Question topics:
- Radiation definition and properties
- Medium requirements (none needed)
- Sun-Earth heat transfer
- Color and heat relationship
- Object cooling processes
- Everyday applications
- Comparison with conduction/convection
- Real-world scenarios

##### Real World Content
Applications covering:
- Feeling warmth from fire
- Sun's energy reaching Earth
- White vs dark clothing choices
- Drying clothes in sunlight
- Solar cookers
- Greenhouse effect
- Thermal imaging
- Heat radiation from utensils
- Night vision technology
- Earth's energy balance

#### 5. UI/UX Requirements

##### Design Principles
- **Responsive**: Mobile, tablet, desktop support
- **Accessible**: Screen reader compatible, keyboard navigation
- **Colorful**: Engaging gradients and color schemes
- **Clear**: Easy-to-read fonts and layouts
- **Interactive**: Clickable, draggable, animated elements

##### Color Scheme
- Primary: Orange-Red gradient (#FF6347, #FF4500)
- Secondary: Purple-Pink accent (#9333EA, #EC4899)
- Success: Green (#10B981)
- Error: Red (#EF4444)
- Neutral: Gray scale (#F3F4F6 to #1F2937)

##### Typography
- Headers: Bold, large (24-32px)
- Body: Regular, readable (14-16px)
- Questions: Medium-bold (16-20px)
- Captions: Small (12-14px)

##### Interactive Elements
- Buttons: Rounded, gradient backgrounds
- Cards: Elevated shadows, hover effects
- Inputs: Clear borders, focus states
- Animations: Smooth, purposeful

#### 6. Translation Structure

##### JSON Format
```json
{
  "language": {
    "en": "English",
    "hi": "हिंदी",
    "gu": "ગુજરાતી",
    "selectorLabel": "Choose language"
  },
  "nav": {
    "logo": "Heat Transfer",
    "tabs": {
      "learn": "Learn",
      "practice": "Practice",
      "applications": "Real World"
    }
  },
  "radiation": {
    "learn": {
      "title": "...",
      "steps": [...]
    },
    "practice": {
      "questions": [...]
    },
    "realWorld": {
      "applications": [...]
    }
  }
}
```

##### Translation Keys Structure
- `language.*` - Language selector labels
- `nav.*` - Navigation menu items
- `radiation.learn.*` - Learn mode content
- `radiation.practice.*` - Practice mode content
- `radiation.realWorld.*` - Applications content
- `common.*` - Shared UI elements

#### 7. Data Flow

##### Initialization
1. Detect user's preferred language
2. Load appropriate translations
3. Initialize default mode (learn)
4. Setup state management

##### User Interactions
1. **Language Change**: Update all text instantly
2. **Mode Switch**: Transition to selected mode
3. **Step Navigation**: Update content and visuals
4. **Question Answer**: Validate and provide feedback
5. **Practice Complete**: Calculate and display results

#### 8. Performance Requirements

- **Load Time**: < 2 seconds initial load
- **Animation FPS**: 60fps for smooth animations
- **Language Switch**: Instant (< 100ms)
- **Mode Transition**: Smooth (< 300ms)
- **Response Time**: < 50ms for user interactions

#### 9. Accessibility

- **WCAG 2.1 AA** compliance
- Keyboard navigation support
- Screen reader compatible
- High contrast mode
- Scalable text (up to 200%)
- Clear focus indicators
- Alt text for visuals

#### 10. Educational Effectiveness

##### Learning Objectives
Students should be able to:
1. Define radiation and explain how it differs from conduction/convection
2. Understand that radiation requires no medium
3. Explain how Sun's heat reaches Earth
4. Apply knowledge to real-world scenarios
5. Identify conductors and insulators in context
6. Solve basic radiation-related problems

##### Assessment Criteria
- **Knowledge**: Factual recall (30%)
- **Understanding**: Concept explanation (40%)
- **Application**: Problem solving (30%)

##### Feedback Mechanisms
- Immediate correct/incorrect indication
- Detailed explanations for all questions
- Progress visualization
- Encouraging messages
- Constructive error handling

## Implementation Guidelines

### Phase 1: Core Structure
1. Setup TypeScript component with React
2. Implement language context and provider
3. Create basic navigation structure
4. Setup translation loading system

### Phase 2: Learn Mode
1. Create step-by-step demonstration system
2. Implement canvas animations
3. Add interactive controls (play/pause/next/prev)
4. Create visual representations of concepts

### Phase 3: Practice Mode
1. Build question rendering system
2. Implement answer validation
3. Create scoring mechanism
4. Add feedback system
5. Design results summary

### Phase 4: Real World Applications
1. Create application card system
2. Implement category filtering
3. Add expandable details
4. Design responsive layout

### Phase 5: Polish
1. Add animations and transitions
2. Optimize performance
3. Test accessibility
4. Refine translations
5. Add loading states

## Quality Checklist

### Functionality
- [ ] All modes work correctly
- [ ] Language switching is seamless
- [ ] Questions are properly validated
- [ ] Scoring is accurate
- [ ] Animations are smooth
- [ ] Navigation is intuitive

### Content
- [ ] All radiation concepts covered
- [ ] Explanations are clear and accurate
- [ ] Examples are relevant to Indian students
- [ ] Questions test understanding effectively
- [ ] Real-world applications are practical

### Technical
- [ ] Code is type-safe (TypeScript)
- [ ] Components are reusable
- [ ] State management is efficient
- [ ] Performance is optimized
- [ ] Responsive design works on all screens

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen readers supported
- [ ] Color contrast meets standards
- [ ] Focus indicators are visible
- [ ] Text is scalable

### Translations
- [ ] All text is translatable
- [ ] Hindi translations are accurate
- [ ] Gujarati translations are accurate
- [ ] Fonts display correctly
- [ ] Text lengths don't break layout

## Success Criteria

A successful implementation will:
1. **Engage** students through interactive visuals and animations
2. **Educate** effectively about radiation concepts
3. **Assess** understanding through varied question types
4. **Connect** concepts to real Indian examples
5. **Support** multiple languages seamlessly
6. **Perform** smoothly on various devices
7. **Comply** with accessibility standards

## Notes for Future Enhancement

- Add audio narration support
- Include video demonstrations
- Add gamification elements (badges, achievements)
- Create printable worksheets
- Add teacher dashboard for tracking
- Include AR/VR demonstrations
- Add collaborative learning features
- Expand to other heat transfer topics

---

**Version**: 1.0  
**Target Audience**: Grade 7 Students (India)  
**Subject**: Science - Heat Transfer (Radiation)  
**Languages**: English, Hindi, Gujarati  
**Last Updated**: 2026-01-27