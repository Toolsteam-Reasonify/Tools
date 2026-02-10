# Circuit Diagrams Tool - Agent Guide

## 📋 Quick Reference

**Tool Name:** `circuit_diagrams_tool`  
**Purpose:** Interactive learning tool for electrical circuit diagrams and symbols  
**Curriculum:** NCERT Grade 7 Science Chapter 3 Section 3.3  
**Modes:** Learn (7 steps) | Practice (6 questions) | Real World (4 examples) | Hands-On (4 activities)

---

## 🎯 What This Tool Does

Teaches students to:
- ✅ Understand what circuit diagrams are and why we use them
- ✅ Learn standard symbols for electrical components
- ✅ Identify positive (+) and negative (–) terminals
- ✅ Draw accurate circuit diagrams
- ✅ Read and interpret circuit diagrams
- ✅ Distinguish between open and closed circuits

---

## 🔧 Circuit Symbols Covered

| Component | Symbol Description | Key Information |
|-----------|-------------------|-----------------|
| **Cell** | Two parallel lines | Long line = positive (+), Short line = negative (–) |
| **Battery** | Multiple pairs of lines | 2+ cells connected in series |
| **Lamp** | Circle with X | X represents the glowing filament |
| **LED** | Triangle with arrows | Arrows = light emission, works in one direction only |
| **Switch (ON)** | Connected line | Circuit complete, current flows |
| **Switch (OFF)** | Open line | Circuit broken, no current |

---

## 🎮 Mode Overview

### 📚 LEARN Mode (7 steps)
**When to use:** Foundational knowledge about circuit diagrams

**Steps:**
1. Introduction to circuit diagrams
2. Electric cell symbol and terminals
3. Battery symbol (multiple cells)
4. Electric lamp symbol
5. LED symbol with arrows
6. Switch symbols (ON/OFF)
7. Complete circuit diagram with all components connected

**Best for:** "What is a circuit diagram?", "Show me symbols", "How do I draw circuits?"

---

### ✏️ PRACTICE Mode (6 questions)
**When to use:** Testing understanding

**Features:**
- Terminal identification
- Symbol recognition
- Circuit behavior prediction
- Immediate feedback with explanations
- Score tracking

**Best for:** "Test me", "Practice questions", "Quiz on circuits"

---

### 🌍 REAL WORLD Mode (4 examples)
**When to use:** Practical context needed

**Examples:**
1. **Torchlight** - Battery, switch, LED
2. **Room Light** - Power supply, wall switch, bulb
3. **Doorbell** - Push button, buzzer
4. **Solar Light** - Light sensor, rechargeable battery, LED

**Best for:** "How does [device] work?", "Where is this used?"

---

### 🔬 HANDS-ON Mode (4 activities)
**When to use:** Practical activities desired

**Activities:**
1. Build a simple circuit (step-by-step)
2. Make your own switch (DIY)
3. Test for conductors (experiment)
4. Draw circuit diagrams (practice)

**Best for:** "Can I build this?", "Experiment ideas"

---

## 🤖 Agent Decision Tree

```
Student Query → Identify Pattern → Select Configuration

┌─ "What is a circuit diagram?"
│  └─→ initialMode: "learn", filterSteps: [1]
│
┌─ "What is the symbol for [component]?"
│  └─→ initialMode: "learn", filterSteps: [step_number]
│     • Cell = [2]
│     • Battery = [3]
│     • Lamp = [4]
│     • LED = [5]
│     • Switch = [6]
│
┌─ "Practice" / "Test me" / "Quiz"
│  └─→ initialMode: "practice"
│
┌─ "How does [device] work?"
│  └─→ initialMode: "real_world"
│
┌─ "Build" / "Make" / "Create"
│  └─→ initialMode: "hands_on"
│
┌─ "Cell vs battery"
│  └─→ initialMode: "learn", filterSteps: [2, 3]
│
┌─ "Complete circuit" / "Show full circuit"
│  └─→ initialMode: "learn", filterSteps: [7]
│
└─ General learning
   └─→ initialMode: "learn", showModeSelector: true
```
**Query:** "I want to learn about circuit diagrams"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Introduction to Circuit Diagrams",
  "data": {
    "toolName": "circuit_diagrams_tool",
    "parameters": {
      "initialMode": "learn",
      "showModeSelector": true,
      "autoPlayDuration": 10000
    }
  },
  "instructions_for_student": "Let's learn how to read and draw circuit diagrams using standard symbols used worldwide!"
}
```

---

### Example 2: Specific Symbol
**Query:** "What is the symbol for a battery?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Battery Symbol",
  "data": {
    "toolName": "circuit_diagrams_tool",
    "parameters": {
      "initialMode": "learn",
      "filterSteps": [3],
      "showModeSelector": false,
      "showNavigation": false,
      "autoPlayDuration": 0
    }
  },
  "instructions_for_student": "A battery is shown with multiple pairs of lines - long (positive) and short (negative). It's 2 or more cells connected!"
}
```

---

### Example 3: Practice Quiz
**Query:** "Give me practice questions"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Circuit Diagram Quiz",
  "data": {
    "toolName": "circuit_diagrams_tool",
    "parameters": {
      "initialMode": "practice",
      "showModeSelector": false,
      "showPlayPause": false
    }
  },
  "instructions_for_student": "Test your knowledge with 6 questions! You'll get immediate feedback and explanations."
}
```

---

### Example 4: Real-World Application
**Query:** "How does a torchlight work?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Torchlight Circuit",
  "data": {
    "toolName": "circuit_diagrams_tool",
    "parameters": {
      "initialMode": "real_world",
      "filterSteps": [1],
      "showModeSelector": false,
      "themeColor": "#f59e0b"
    }
  },
  "instructions_for_student": "Here's the circuit diagram for a torchlight! Battery → Switch → LED. When you press the switch, the circuit completes!"
}
```

---

### Example 5: Understanding Circuits
**Query:** "Why does the lamp only glow sometimes?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Complete vs Open Circuits",
  "data": {
    "toolName": "circuit_diagrams_tool",
    "parameters": {
      "initialMode": "learn",
      "filterSteps": [6, 7],
      "showModeSelector": false,
      "autoPlayDuration": 7000
    }
  },
  "instructions_for_student": "A lamp only glows when the circuit is COMPLETE! There must be a continuous path from positive to negative. If the switch is OFF, there's a gap!"
}
```

---

### Example 6: Build Activity
**Query:** "I want to build a circuit"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Build Your Own Circuit",
  "data": {
    "toolName": "circuit_diagrams_tool",
    "parameters": {
      "initialMode": "hands_on",
      "filterSteps": [1],
      "showModeSelector": true
    }
  },
  "instructions_for_student": "Follow these step-by-step instructions! You'll need: 1 cell (1.5V), 1 bulb with holder, 1 switch, 3 wires."
}
```

---

### Example 7: Component Comparison
**Query:** "What's the difference between cell and battery?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Cell vs Battery",
  "data": {
    "toolName": "circuit_diagrams_tool",
    "parameters": {
      "initialMode": "learn",
      "filterSteps": [2, 3],
      "showModeSelector": false,
      "autoPlayDuration": 6000
    }
  },
  "instructions_for_student": "A CELL has one pair of lines. A BATTERY has TWO OR MORE pairs because it's multiple cells connected together!"
}
```

---

### Example 8: LED Understanding
**Query:** "Why does LED have arrows?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Understanding LED Symbol",
  "data": {
    "toolName": "circuit_diagrams_tool",
    "parameters": {
      "initialMode": "learn",
      "filterSteps": [5],
      "showModeSelector": false,
      "showNavigation": false
    }
  },
  "instructions_for_student": "The arrows show LIGHT EMISSION! Unlike regular lamps, LEDs only work when connected correctly - positive to positive, negative to negative."
}
```

---

### Example 9: Complete Circuit Understanding
**Query:** "Show me a complete circuit"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Complete Circuit Diagram",
  "data": {
    "toolName": "circuit_diagrams_tool",
    "parameters": {
      "initialMode": "learn",
      "filterSteps": [7],
      "showModeSelector": false,
      "autoPlayDuration": 0
    }
  },
  "instructions_for_student": "This is a complete circuit with battery, switch, and light bulb all properly connected with wires!"
}
```

---

### Example 10: All Real-World
**Query:** "Show me real examples"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Circuits in Everyday Life",
  "data": {
    "toolName": "circuit_diagrams_tool",
    "parameters": {
      "initialMode": "real_world",
      "showModeSelector": false,
      "autoPlayDuration": 9000
    }
  },
  "instructions_for_student": "See how circuit diagrams help us understand devices we use every day - torches, lights, doorbells, solar lights!"
}
```

---

### Example 11: Symbol Reference
**Query:** "Quick reference for all symbols"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Circuit Symbol Guide",
  "data": {
    "toolName": "circuit_diagrams_tool",
    "parameters": {
      "initialMode": "learn",
      "filterSteps": [2, 3, 4, 5, 6, 7],
      "showNavigation": true,
      "showPlayPause": false,
      "autoPlayDuration": 0
    }
  },
  "instructions_for_student": "Quick reference for all circuit symbols! Use arrows to navigate through each one."
}
```

---

### Example 12: Dark Mode
**Query:** "Studying at night"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Circuit Diagrams (Night Mode)",
  "data": {
    "toolName": "circuit_diagrams_tool",
    "parameters": {
      "initialMode": "learn",
      "darkMode": true,
      "themeColor": "#06b6d4",
      "autoPlayDuration": 10000
    }
  },
  "instructions_for_student": "Learning in comfortable dark mode - easy on your eyes!"
}
```

---

## 🎨 Customization Options

### Theme Colors
```json
"themeColor": "#0ea5e9"  // Sky blue (default)
"themeColor": "#f59e0b"  // Amber
"themeColor": "#10b981"  // Green
"themeColor": "#8b5cf6"  // Purple
```

### Speed Control
```json
"animationSpeed": 0.5    // Half speed
"animationSpeed": 1      // Normal
"animationSpeed": 2      // Double speed
"autoPlayDuration": 8000 // 8 seconds
"autoPlayDuration": 0    // No auto-play
```

### UI Customization
```json
"showModeSelector": false   // Hide tabs
"showNavigation": false     // Hide buttons
"showPlayPause": false      // Hide play
"showStepIndicator": false  // Hide counter
```

---

## 🎓 Teaching Tips

### When Student Is Confused:
1. **Start Simple:** `filterSteps: [1]` for introduction only
2. **One at a Time:** Show one symbol at a time
3. **Real Examples:** Switch to `real_world` mode
4. **Practice:** Use `practice` mode to identify gaps

### For Different Learning Styles:
- **Visual:** Default learn mode with symbols
- **Kinesthetic:** `hands_on` mode with building
- **Practical:** `real_world` mode with devices
- **Test-Oriented:** `practice` mode for assessment

---

## ⚠️ Important Notes

### This Tool DOES:
✅ Teach circuit diagram symbols  
✅ Show how to read circuits  
✅ Explain complete vs open circuits  
✅ Connect to real devices  
✅ Provide building instructions

### This Tool DOES NOT:
❌ Simulate electrical calculations  
❌ Teach advanced electronics  
❌ Provide interactive circuit simulation  
❌ Cover parallel/series analysis

---

## 🔍 Common Queries → Configurations

| Student Question | Configuration |
|-----------------|---------------|
| "I don't understand circuits" | `initialMode: "learn", filterSteps: [1]` |
| "Show me all symbols" | `initialMode: "learn", filterSteps: [2,3,4,5,6]` |
| "Complete circuit" | `initialMode: "learn", filterSteps: [7]` |
| "Will lamp glow?" | `initialMode: "practice"` or step 7 |
| "Where used?" | `initialMode: "real_world"` |
| "Can I build?" | `initialMode: "hands_on"` |

---

## 📊 Learning Outcomes

After using this tool, students can:

1. ✅ **Identify** all standard circuit symbols
2. ✅ **Distinguish** positive and negative terminals
3. ✅ **Draw** accurate circuit diagrams
4. ✅ **Read** diagrams and predict behavior
5. ✅ **Explain** why circuits must be complete
6. ✅ **Connect** diagrams to real devices

---

## 🚀 Quick Start

Most common configurations:

```json
// Introduction
{ "toolName": "circuit_diagrams_tool", "parameters": { "initialMode": "learn" } }

// Practice
{ "toolName": "circuit_diagrams_tool", "parameters": { "initialMode": "practice" } }

// Specific Symbol
{ "toolName": "circuit_diagrams_tool", "parameters": { "initialMode": "learn", "filterSteps": [3] } }
```

---

## 💡 Pro Tips

1. **Show before asking:** Let students see symbols before drawing
2. **Connect to reality:** Show real_world after teaching symbols
3. **Practice reinforces:** Use practice mode after learning
4. **Build confidence:** Start with individual symbols, then complete circuits
5. **Emphasize completion:** Most confusion is about open vs closed circuits

---

## 🌟 Key Differentiators

- **Canvas-based:** Accurate symbol rendering
- **Multi-modal:** Learn, practice, real-world, hands-on
- **Visual:** Proper symbol proportions
- **Contextual:** Real devices like torches, doorbells
- **Practical:** Building instructions included

---

**Remember:** Circuit diagrams are a UNIVERSAL LANGUAGE! These symbols are used by engineers worldwide. Help students understand this opens up comprehension of all electrical devices.