# Decimal Measurement Tool - Agent README v2.0

## Quick Reference

**Tool Name:** `decimal_measurement_tool`  
**Purpose:** Teaching decimal measurements, fractions, and precision  
**Modes:** Learn (5 steps) | Practice (5 questions) | Real World (4 scenarios)  
**Grade Level:** 6-8  
**Version:** 2.0.0 (Enhanced with Professional Animations)

---

## 📋 Props Quick Reference Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialMode` | `'learn' \| 'practice' \| 'real_world'` | `'learn'` | Starting mode |
| `showModeSelector` | `boolean` | `true` | Show/hide mode tabs |
| `enabledModes` | `array` | `['learn', 'practice', 'real_world']` | Available modes |
| `showNavigation` | `boolean` | `true` | Show prev/next buttons |
| `showPlayPause` | `boolean` | `true` | Show play/pause button |
| `showStepIndicator` | `boolean` | `true` | Show progress bar |
| `initialStep` | `number` | `0` | Starting step (0-based) |
| `filterSteps` | `number[]` | `null` | Show only these steps |
| `animationSpeed` | `number` | `1` | NOT USED in v2.0 (fixed) |
| `autoPlayDuration` | `number` | `8000` | Auto-advance delay (ms) |
| `themeColor` | `string` | `'#533086'` | Primary color |
| `darkMode` | `boolean` | `false` | Dark mode toggle |
| `additionalProps` | `object` | `{}` | Tool-specific config |

---

## 🎯 additionalProps - Tool-Specific Configuration

```typescript
additionalProps: {
  // Ruler configuration (Learn Step 3)
  markedValue?: number;                // Default: 2.7, displays as "2.7/5 cm"
  
  // Number line (Learn Step 4)
  numberLineValue?: number;            // Default: 2.7, displays as "2.7/5"
  
  // Custom content
  customQuestions?: PracticeQuestion[];
  customScenarios?: RealWorldScenario[];
}
```

**Important Notes:**
- Labels format: Ruler shows `"2.7/5 cm"`, Number line shows `"2.7/5"`
- Fraction blocks have been removed from Step 3
- Orange pointer on number line is now static (no pulse animation)
- Ruler arrow points UP from the exact position on ruler

---

## 🚀 Common Use Cases & Examples

### 1. **Default Tool (Full Experience)**
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Learn About Decimal Measurements",
  "data": {
    "toolName": "decimal_measurement_tool",
    "parameters": {}
  },
  "instructions_for_student": "Let's explore how to measure with decimals!"
}
```

---

### 2. **Show Specific Measurement on Ruler**
**When:** Student asks "What is 3.5 cm?" or "Show me 4.2 cm on a ruler"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Measuring 3.5 cm",
  "data": {
    "toolName": "decimal_measurement_tool",
    "parameters": {
      "initialMode": "learn",
      "initialStep": 2,
      "showModeSelector": false,
      "additionalProps": {
        "markedValue": 3.5
      }
    }
  },
  "instructions_for_student": "See how 3.5 cm looks on a ruler! The arrow points up from the marking and shows '3.5/5 cm'."
}
```

---

### 3. **Number Line Visualization**
**When:** Student asks "Where is 4.3 on a number line?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Finding 4.3 on the Number Line",
  "data": {
    "toolName": "decimal_measurement_tool",
    "parameters": {
      "initialMode": "learn",
      "initialStep": 3,
      "showModeSelector": false,
      "additionalProps": {
        "numberLineValue": 4.3
      }
    }
  },
  "instructions_for_student": "Look where 4.3 is positioned! The orange circle shows '4.3/5'."
}
```

---

### 4. **Practice Questions Only**
**When:** Student says "Test me" or "Give me practice problems"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Decimal Measurement Quiz",
  "data": {
    "toolName": "decimal_measurement_tool",
    "parameters": {
      "initialMode": "practice",
      "enabledModes": ["practice"],
      "showModeSelector": false
    }
  },
  "instructions_for_student": "Answer 5 questions to test your knowledge!"
}
```

---

### 5. **Real-World Applications**
**When:** Student asks "Why do we need decimals?" or "Give me examples"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Decimals in Real Life",
  "data": {
    "toolName": "decimal_measurement_tool",
    "parameters": {
      "initialMode": "real_world"
    }
  },
  "instructions_for_student": "Explore 4 real-world scenarios where precision matters!"
}
```

---

### 6. **Specific Real-World Scenario**
**When:** Student asks about medicine, cooking, sports, or carpentry

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Medicine Dosage Example",
  "data": {
    "toolName": "decimal_measurement_tool",
    "parameters": {
      "initialMode": "real_world",
      "initialStep": 1,
      "filterSteps": [1],
      "showModeSelector": false,
      "showNavigation": false
    }
  },
  "instructions_for_student": "Learn why precise measurements matter in medicine!"
}
```

**Real World Scenarios by Index:**
- `0` = 🪚 Carpentry Workshop
- `1` = 💊 Medicine Dosage
- `2` = 🏃 Running a Race
- `3` = 🎂 Baking a Cake

---

### 7. **Auto-Play Demo**
**When:** Teacher wants to demonstrate all concepts automatically

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Decimal Concepts Demo",
  "data": {
    "toolName": "decimal_measurement_tool",
    "parameters": {
      "initialMode": "learn",
      "autoPlayDuration": 5000,
      "showPlayPause": true
    }
  },
  "instructions_for_student": "Watch as we explore each concept!"
}
```

---

### 8. **Dark Mode for Accessibility**
**When:** Student mentions vision difficulty or prefers dark theme

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Decimals (Dark Mode)",
  "data": {
    "toolName": "decimal_measurement_tool",
    "parameters": {
      "darkMode": true,
      "themeColor": "#9333ea"
    }
  },
  "instructions_for_student": "Easier on your eyes!"
}
```

---

### 9. **Minimal Embedded View**
**When:** Embedding in other content or showing single concept

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "",
  "data": {
    "toolName": "decimal_measurement_tool",
    "parameters": {
      "initialMode": "learn",
      "initialStep": 2,
      "showModeSelector": false,
      "showNavigation": false,
      "showPlayPause": false,
      "showStepIndicator": false,
      "additionalProps": {
        "markedValue": 2.7
      }
    }
  },
  "instructions_for_student": ""
}
```

---

## 🧠 Decision Tree for Agents

```
Student Question/Request
│
├─ "What is a decimal?" / "Teach me decimals"
│   └─ Use: Default configuration (all modes enabled)
│
├─ "Show me X.X cm" / "What is X.X?"
│   └─ Use: Learn mode, step 2 (ruler), additionalProps.markedValue
│   └─ Note: Label will show as "X.X/5 cm"
│
├─ "Where is X.X on a number line?"
│   └─ Use: Learn mode, step 3 (number line), additionalProps.numberLineValue
│   └─ Note: Label will show as "X.X/5"
│
├─ "How do I read a ruler?"
│   └─ Use: Learn mode, initialStep: 2
│
├─ "Why are decimals important?" / "Real examples"
│   └─ Use: Real World mode
│
├─ "Test me" / "Quiz me" / "Practice problems"
│   └─ Use: Practice mode
│
├─ "Medicine example" / "Cooking example" / "Sports" / "Carpentry"
│   └─ Use: Real World mode with specific filterSteps
│   └─ Medicine=1, Baking=3, Sports=2, Carpentry=0
│
├─ "Quick demo" / "Show me everything fast"
│   └─ Use: autoPlayDuration: 5000
│
├─ "Dark mode" / "My eyes hurt" / "Too bright"
│   └─ Use: darkMode: true
│
└─ "Just show the concept" (embedding context)
    └─ Use: Hide all UI (showModeSelector, showNavigation, showStepIndicator: false)
```

---

## 📊 Mode & Step Breakdown

### Learn Mode (5 Steps)

**Step 1: Sonu's Discovery** (visual: screws & toolbox)
- **Animations:** Toolbox bounces infinitely, screws drop sequentially with bounce, comparison arrow fades in
- **Content:** Introduction to measurement precision
- **Duration:** ~2s total animation sequence

**Step 2: Why Small Differences Matter** (visual: magnifying glass)
- **Animations:** Glass rotates gently, shine floats, ruler inside breathes, text fades up
- **Content:** Importance of accuracy
- **Duration:** ~1.5s total animation sequence

**Step 3: Measuring with a Ruler** (visual: interactive ruler)
- **Animations:** Ruler slides from left, markings pop sequentially, arrow slides UP from marking, arrow bounces infinitely
- **Content:** How to read tenths
- **Label Format:** `"2.7/5 cm"` (or custom value)
- **Arrow:** Points upward from the exact position on ruler
- **Note:** Fraction blocks removed in v2.0
- **Duration:** ~2s total animation sequence

**Step 4: Reading Measurements** (visual: number line)
- **Animations:** Line draws (SVG stroke), points pop sequentially, pointer scales in, glow effect
- **Content:** Placing decimals on number line
- **Label Format:** `"2.7/5"` (or custom value)
- **Note:** Orange pointer is now STATIC (no pulse animation)
- **Duration:** ~2.5s total animation sequence

**Step 5: Why We Need Smaller Units** (visual: precision target)
- **Animations:** Rings expand sequentially, crosshairs fade in, checkmarks pop in corners
- **Content:** Real-world importance
- **Duration:** ~2s total animation sequence

---

### Practice Mode (5 Questions)

**Features:**
- Multiple choice format (4 options each)
- Instant visual feedback (green = correct, orange = incorrect)
- Detailed explanations for each answer
- Score tracking throughout
- Final summary with performance message
- Smooth transitions between questions

**Question Topics:**
1. Understanding decimal notation (2 7/10 cm)
2. Ruler divisions (10 equal parts)
3. Story comprehension (Sonu's screw problem)
4. Reading measurements (3 2/10 cm)
5. When to use smaller units

**Performance Messages:**
- **5/5:** "Perfect score! You're a measurement master!"
- **4-5/5:** "Great job! You understand the concepts well!"
- **0-3/5:** "Good effort! Review the Learn mode for better understanding."

---

### Real World Mode (4 Scenarios)

**Scenario Structure:**
Each scenario includes:
1. **Large emoji** (64-100px, scales in)
2. **Title** (slides down)
3. **"The Scenario"** section (orange border, slides from left)
4. **"Think About It"** question (slides from right)
5. **"The Answer"** explanation (purple border, slides from left)
6. **"💡 Real-Life Tip"** (gradient background, slides up)

**Scenarios:**

1. **🪚 Carpentry Workshop**
   - Topic: 45.7 cm wood cutting precision
   - Key Point: 0.7 cm difference = 3mm misalignment

2. **💊 Medicine Dosage**
   - Topic: 2.5 ml medication accuracy
   - Key Point: Wrong dosage can be harmful or ineffective

3. **🏃 Running a Race**
   - Topic: Olympic timing (9.87s vs 9.92s)
   - Key Point: 0.05 seconds = gold vs silver medal

4. **🎂 Baking a Cake**
   - Topic: 2.5 cups flour measurement
   - Key Point: 0.5 cup difference = failed recipe

---

## 🎨 Animation System

### Global Keyframes (12 total)
```css
fadeIn, slideUp, slideDown, slideLeft, slideRight,
scaleIn, popIn, bounce, pulse, rotate, shimmer,
drawLine, fillProgress
```

### Animation Timing Strategy
- **Sequential delays:** 0.1s - 0.8s between elements
- **Natural flow:** Elements appear in reading order
- **Attention drawing:** Important elements have bounce/pulse
- **Performance:** 60fps, GPU-accelerated transforms

### Step-by-Step Animation Sequences

**Screws & Toolbox:**
```
0.0s: Container fades in
0.0s: Toolbox slides up, starts bouncing (infinite)
0.5s: Left screw drops with bounce
0.8s: Right screw drops with bounce
1.5s: Comparison arrow scales in with animated dashes (infinite)
```

**Magnifying Glass:**
```
0.0s: Container fades in, glass scales in
0.0s: Glass starts gentle rotation (infinite back-and-forth)
0.5s: Ruler inside fades in
0.7-1.2s: Ruler numbers pop in sequentially
1.2s: Text slides up
Continuous: Shine effect pulses
```

**Interactive Ruler:**
```
0.0s: Container fades in
0.0s: Ruler slides from left
0.5-1.0s: Major markings pop in sequentially
1.2s: Arrow slides UP from exact marking position
2.0s: Arrow starts bouncing (infinite)
```

**Number Line:**
```
0.0s: Container fades in
0.0-1.5s: Main line draws (SVG stroke animation)
0.5-1.4s: Number points pop in sequentially
1.8s: Orange pointer scales in
Static: No more pulse animation (fixed in v2.0)
```

**Precision Target:**
```
0.0s: Container fades in
0.0-0.45s: Rings expand sequentially (4 rings)
0.8s: Center circle pops in
1.0s: Crosshairs fade in
1.2s: "Precision" slides down, "Accuracy" slides up
1.6-1.9s: Corner checkmarks pop in sequentially
```

---

## 🎯 What's New in v2.0

### Major Changes
✅ **Complete animation overhaul** - Professional keyframe-based system  
✅ **Ruler arrow fixed** - Now points UPWARD from marking (not downward)  
✅ **Label format changed** - Now shows "X.X/5 cm" and "X.X/5"  
✅ **Fraction blocks removed** - Cleaner ruler visualization  
✅ **Orange circle fixed** - Static display (no pulse animation)  
✅ **Practice mode added** - Complete with questions and scoring  
✅ **Real World mode added** - 4 scenarios with animations  
✅ **Animation key system** - Forces re-mount for fresh animations  
✅ **Sequential timing** - Staggered entrance for natural flow  
✅ **Visual enhancements** - Shadows, glows, filters  

### Technical Improvements
✅ Global animation styles injected once  
✅ Component re-mounting with `key` prop  
✅ Inline style animations for direct control  
✅ SVG animations with `<animate>` tags  
✅ Hover effects with transform  
✅ Touch-friendly interactions  
✅ Dark mode support throughout  
✅ Responsive sizing maintained  

---

## 📱 Device Support

- ✅ **Mobile** (< 640px): Touch-optimized, stacked layouts
- ✅ **Tablet** (640px - 1023px): Balanced spacing
- ✅ **Desktop** (≥ 1024px): Full visual experience
- ✅ **All orientations** supported
- ✅ **60fps animations** on modern devices
- ✅ **Accessibility** compliant (WCAG 2.1)

---

## 🎯 Learning Objectives Supported

1. ✅ Understand decimal notation (2.7 = 2 7/10)
2. ✅ Read ruler measurements to nearest tenth
3. ✅ Locate decimals on number line
4. ✅ Recognize importance of precision
5. ✅ Apply concepts to real-world situations
6. ✅ Practice with immediate feedback
7. ✅ Connect abstract to concrete examples

---

## 🆘 Troubleshooting

### Animations not playing?
- Ensure browser supports CSS animations
- Check if component is re-mounting (key prop)
- Verify JavaScript is enabled

### Arrow pointing wrong direction?
- This was fixed in v2.0 - arrow now points UP from ruler marking
- Update to latest version if using old code

### Label format incorrect?
- v2.0 uses "X.X/5 cm" format (not "X X/10 cm")
- Custom values work with `additionalProps.markedValue`

### Orange circle moving?
- Fixed in v2.0 - circle is now static
- No more pulse animation

### Fraction blocks showing?
- Removed in v2.0 for cleaner visualization
- Only ruler appears in Step 3

---

## 💡 Pro Tips for Agents

1. **Always set `initialMode`** based on student's question type
2. **Use `showModeSelector: false`** when focusing on one concept
3. **Set `additionalProps.markedValue`** when student mentions specific number
4. **Enable `darkMode`** if student mentions vision/accessibility
5. **Use `filterSteps`** to show only relevant content
6. **Set `autoPlayDuration: 5000`** for quick demos
7. **Use `showNavigation: false`** for static displays
8. **Remember label format:** "2.7/5 cm" on ruler, "2.7/5" on number line
9. **Animations are fixed** - don't use `animationSpeed` parameter
10. **For Practice mode** - all 5 questions always show in order

---

## 🔗 Related Topics

- Fractions and decimals conversion
- Measurement units (metric system)
- Precision vs accuracy
- Place value
- Rounding decimals
- Significant figures
- Scientific notation

---

## 📚 Content Structure

### Default Questions (Practice Mode)
1. Decimal notation meaning
2. Ruler division count
3. Story comprehension
4. Reading measurement format
5. When to use smaller units

### Default Scenarios (Real World Mode)
1. Carpentry precision
2. Medical dosing accuracy
3. Sports timing precision
4. Baking measurement importance

All content is customizable via `additionalProps.customQuestions` and `additionalProps.customScenarios`.

---

## ✨ Quick Start Examples

**Teaching basic concept:**
```json
{ "toolName": "decimal_measurement_tool", "parameters": {} }
```

**Testing knowledge:**
```json
{ "toolName": "decimal_measurement_tool", "parameters": { "initialMode": "practice" } }
```

**Showing specific value:**
```json
{ 
  "toolName": "decimal_measurement_tool", 
  "parameters": { 
    "initialMode": "learn", 
    "initialStep": 2,
    "additionalProps": { "markedValue": 3.5 }
  }
}
```

**Real-world application:**
```json
{ "toolName": "decimal_measurement_tool", "parameters": { "initialMode": "real_world" } }
```

---

**Version:** 2.0.0 (Enhanced)  
**Last Updated:** February 12, 2026  
**Compatibility:** React 18+, TypeScript 4.5+  
**Browser Support:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+