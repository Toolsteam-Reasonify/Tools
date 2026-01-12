/**
 * MERGED COMPONENTS FILE
 * This file contains all components, contexts, types, data, and utilities merged into one file.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export type Language = 'en' | 'hi' | 'gu';
export type Mode = 'demonstration' | 'practice' | 'assessment' | 'mixed';
export type StepType = 'explanation' | 'visualization' | 'interaction' | 'assessment';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface CircuitComponent {
  id: string;
  type: 'cell' | 'battery' | 'lamp' | 'led' | 'switch' | 'wire' | 'conductor' | 'insulator';
  position: { x: number; y: number };
  connections: string[];
  state?: 'on' | 'off' | 'open' | 'closed';
  polarity?: 'correct' | 'incorrect' | 'neutral';
}

export interface DemonstrationStep {
  step_number: number;
  title: string;
  description: string;
  type: StepType;
  visual_state: {
    components: CircuitComponent[];
    circuit_complete: boolean;
    current_flowing: boolean;
  };
  interactions?: {
    type: 'click' | 'drag' | 'input' | 'select';
    target: string;
    expectedValue?: any;
    hint?: string;
  }[];
  completion_criteria?: {
    type: 'automatic' | 'user_confirm' | 'assessment';
    condition?: any;
  };
  learning_notes?: string;
  common_mistakes?: string[];
}

export interface PracticeExercise {
  exercise_id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  problem_data: {
    circuit_setup: CircuitComponent[];
    question_type: 'build_circuit' | 'identify_component' | 'test_conductor' | 'troubleshoot';
    correct_solution: any;
  };
  solution: {
    correct_answer: any;
    solution_steps?: any[];
    multiple_solutions?: boolean;
  };
  interaction_config: {
    input_methods: string[];
    max_attempts?: number;
    hint_system?: boolean;
    progressive_hints?: string[];
  };
  assessment: {
    accuracy_weight: number;
    time_weight?: number;
    attempt_weight?: number;
  };
}

export interface CircuitToolData {
  tool_type: string;
  session_id: string;
  mode: Mode;
  demonstration?: {
    steps: DemonstrationStep[];
    auto_progression: boolean;
    step_duration: number;
  };
  practice?: {
    exercises: PracticeExercise[];
    session_config: {
      max_exercises: number;
      difficulty_adaptation: boolean;
      immediate_feedback: boolean;
    };
  };
  student_context: {
    current_level: string;
    learning_preferences: string[];
    previous_performance?: {
      accuracy: number;
      avg_time: number;
      completed_exercises: number;
    };
  };
  metadata: {
    learning_objectives: string[];
    estimated_duration: number;
    prerequisite_skills: string[];
    difficulty_level: string;
  };
}

export interface CircuitUIConfig {
  theme: 'light' | 'dark' | 'modern' | 'playful';
  layout: 'standard' | 'compact' | 'immersive';
  auto_play: boolean;
  step_duration: number;
  show_controls: boolean;
  show_progress: boolean;
  hint_system: boolean;
  progressive_difficulty: boolean;
  immediate_feedback: boolean;
  celebration_animations: boolean;
  high_contrast: boolean;
  large_text: boolean;
  keyboard_navigation: boolean;
  screen_reader_support: boolean;
}

export interface CircuitToolProps {
  data: CircuitToolData;
  title: string;
  ui_config: CircuitUIConfig;
  onStepChange?: (stepIndex: number, stepData: DemonstrationStep) => void;
  onPracticeComplete?: (results: PracticeResults) => void;
  onAssessmentSubmit?: (assessment: AssessmentData) => void;
  onProgress?: (progress: ProgressData) => void;
  onInterrupt?: () => void;
  onResume?: () => void;
  onReset?: () => void;
  currentStep?: number;
  isInterrupted?: boolean;
}

export interface PracticeResults {
  exercise_id: string;
  student_answer: any;
  correct_answer: any;
  is_correct: boolean;
  attempts: number;
  time_taken: number;
  hints_used: number;
  confidence_level?: number;
  feedback: string;
}

export interface AssessmentData {
  overall_score: number;
  accuracy: number;
  speed_score: number;
  understanding_indicators: {
    concept: string;
    mastery_level: number;
  }[];
  recommendations: string[];
}

export interface ProgressData {
  current_step: number;
  total_steps: number;
  completion_percentage: number;
  time_spent: number;
  exercises_completed: number;
  current_difficulty: string;
  mastery_indicators: {
    skill: string;
    level: number;
  }[];
}

// ============================================================================
// TRANSLATIONS
// ============================================================================

export const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.learn': 'Learn',
    'nav.practice': 'Practice',
    'nav.assess': 'Assess',
    'nav.applications': 'Real World',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.submit': 'Submit',
    'common.reset': 'Reset',
    'common.continue': 'Continue',
    'common.gotIt': 'Got it!',
    'common.hint': 'Hint',
    'common.correct': 'Correct',
    'common.incorrect': 'Incorrect',
    'component.cell': 'Electric Cell',
    'component.battery': 'Battery',
    'component.lamp': 'Lamp',
    'component.led': 'LED',
    'component.switch': 'Switch',
    'component.wire': 'Wire',
    'component.on': 'ON',
    'component.off': 'OFF',
    'objective.1': 'Understand how electrical circuits work',
    'objective.2': 'Identify circuit components',
    'objective.3': 'Build complete circuits',
    'objective.4': 'Distinguish conductors and insulators',
    'practice.exercise': 'Exercise',
    'practice.attempt': 'Attempt',
    'practice.attempts': 'Attempts',
    'practice.time': 'Time',
    'practice.placeholder': 'Type your answer here...',
    'practice.mode': 'Practice Mode',
    'practice.selectTopic': 'Select a topic to practice',
    'practice.mixedPractice': 'Mixed Practice',
    'practice.allTopics': 'All Topics',
    'practice.questions': 'Questions',
    'practice.question': 'Question',
    'practice.of': 'of',
    'practice.score': 'Score',
    'practice.submit': 'Submit',
    'practice.correct': 'Correct!',
    'practice.incorrect': 'Incorrect',
    'practice.explanation': 'Explanation',
    'practice.correctAnswer': 'Correct Answer',
    'practice.excellent': 'Excellent!',
    'practice.good': 'Good Job!',
    'practice.keepPracticing': 'Keep Practicing!',
    'practice.result.excellent': 'Outstanding work! You have mastered this topic.',
    'practice.result.good': 'Well done! Keep practicing to improve further.',
    'practice.result.keepPracticing': 'Good effort! Review the concepts and try again.',
    'practice.tryAgain': 'Try Again',
    'practice.backToTopics': 'Back to Topics',
    'practice.easy': 'Easy',
    'practice.medium': 'Medium',
    'practice.hard': 'Hard',
    'practice.noComponents.title': 'Add or arrange components to see the circuit.',
    'practice.noComponents.desc': 'Use the hints and description to decide what to connect.',
    'practice.multipleChoice': 'Multiple Choice',
    'practice.trueFalse': 'True or False',
    'practice.fillBlank': 'Fill in the Blank',
    'practice.shortAnswer': 'Short Answer',
    'practice.submitAnswer': 'Submit Answer',
    'practice.previous': 'Previous',
    'practice.next': 'Next',
    'practice.question1': 'An electric cell has how many terminals?',
    'practice.question1.option1': 'One',
    'practice.question1.option2': 'Two',
    'practice.question1.option3': 'Three',
    'practice.question1.option4': 'Four',
    'practice.question1.explanation': 'All electric cells have two terminals: one positive (+ve) and one negative (−ve).',
    'practice.question2': 'Which terminal of an electric cell has a small protruding metal cap?',
    'practice.question2.option1': 'Positive terminal',
    'practice.question2.option2': 'Negative terminal',
    'practice.question2.option3': 'Both terminals',
    'practice.question2.option4': 'Neither terminal',
    'practice.question2.explanation': 'The metal cap is the positive terminal of the electric cell, while the metal disc is the negative terminal.',
    'practice.question3': 'A combination of two or more cells is called a battery.',
    'practice.question3.option1': 'True',
    'practice.question3.option2': 'False',
    'practice.question3.explanation': 'When two or more cells are connected (positive to negative), the combination is called a battery.',
    'practice.question4': 'In a battery, the positive terminal of one cell is connected to the _____ terminal of the next cell.',
    'practice.question4.answer': 'negative',
    'practice.question4.explanation': 'In a battery, cells are connected in series - the positive terminal of one cell connects to the negative terminal of the next cell.',
    'practice.question5': 'What is the thin glowing wire inside an incandescent lamp called?',
    'practice.question5.option1': 'Wire',
    'practice.question5.option2': 'Filament',
    'practice.question5.option3': 'Thread',
    'practice.question5.option4': 'Conductor',
    'practice.question5.explanation': 'The thin wire inside the glass bulb that glows is called the filament of the lamp.',
    'practice.question6': 'An incandescent lamp has two terminals that are fixed in a way that they touch each other.',
    'practice.question6.explanation': 'The two terminals of an incandescent lamp are fixed in a way that they do NOT touch each other.',
    'practice.question7': 'Which type of lamp does not have a filament?',
    'practice.question7.option1': 'Incandescent lamp',
    'practice.question7.option2': 'LED lamp',
    'practice.question7.option3': 'Both have filaments',
    'practice.question7.option4': 'Neither has filament',
    'practice.question7.explanation': 'Unlike incandescent lamps, LEDs (Light Emitting Diodes) do not have filaments.',
    'practice.question8': 'In an LED, which wire is longer?',
    'practice.question8.option1': 'Positive terminal wire',
    'practice.question8.option2': 'Negative terminal wire',
    'practice.question8.option3': 'Both are equal',
    'practice.question8.option4': 'It varies',
    'practice.question8.explanation': 'In an LED, the positive terminal is attached to a longer wire, while the negative terminal has the shorter wire.',
    'practice.question9': 'Electric current can pass through an LED in both directions.',
    'practice.question9.explanation': 'Electric current can pass through an LED in one direction only - from positive to negative.',
    'practice.question10': 'For an electric lamp to glow, one terminal of the lamp must be connected to one terminal of the cell and the other terminal of the lamp to the _____ terminal of the cell.',
    'practice.question10.answer': 'other',
    'practice.question10.explanation': 'For a lamp to glow, it must form a complete circuit connecting both terminals of the cell to both terminals of the lamp.',
    'practice.question11': 'What is a setup that provides a complete path for electric current called?',
    'practice.question11.option1': 'Electrical circuit',
    'practice.question11.option2': 'Electrical path',
    'practice.question11.option3': 'Current path',
    'practice.question11.option4': 'Wire connection',
    'practice.question11.explanation': 'An electrical circuit provides a complete path for electric current to flow through the lamp.',
    'practice.question12': 'The direction of electric current in an electrical circuit is from the negative to the positive terminal.',
    'practice.question12.explanation': 'The direction of electric current in an electrical circuit is taken to be from the positive to the negative terminal of the electric cell.',
    'practice.question13': 'What device either completes or breaks an electrical circuit?',
    'practice.question13.option1': 'Wire',
    'practice.question13.option2': 'Battery',
    'practice.question13.option3': 'Switch',
    'practice.question13.option4': 'Lamp',
    'practice.question13.explanation': 'A switch is a simple device that either completes or breaks a circuit, controlling the flow of electricity.',
    'practice.question14': 'When a switch is in the ON position, the circuit is _____.',
    'practice.question14.answer': 'closed',
    'practice.question14.explanation': 'When the switch is ON, the circuit is closed and current flows from the cell\'s positive to negative terminal.',
    'practice.question15': 'A broken filament will still allow the lamp to glow.',
    'practice.question15.explanation': 'A broken filament stops the flow of current, preventing the lamp from glowing. This is called a \'fused\' lamp.',
    'common.processing': 'Processing...',
    'common.yourAnswer': 'Your Answer:',
    'common.answerPlaceholder': 'Type your answer here...',
    'common.examples': 'Examples',
    'common.invalidMode': 'Invalid mode',
    'common.mistakesTitle': 'Common Mistakes to Avoid',
    'common.status.incomplete': 'Incomplete Circuit',
    'common.status.complete': 'Circuit Complete',
    'common.status.flowing': 'Current Flowing',
    'nav.logo': 'Circuits',
    'title.circuits': 'Electrical Circuits',
    'electricity.lessons': 'Lessons',
    'electricity.lesson.cell': 'Cell',
    'electricity.lesson.battery': 'Battery',
    'electricity.lesson.lamps': 'Lamps',
    'electricity.lesson.circuit': 'Circuit',
    'electricity.lesson.switch': 'Switch',
    'electricity.cell.title': 'Electric Cell',
    'electricity.cell.icon': '⚡',
    'electricity.cell.definition': 'An electric cell is a portable source of electrical energy. It has two terminals: positive (+) and negative (-).',
    'electricity.cell.keyPoints': 'Key Points',
    'electricity.cell.point1': 'Portable source of electricity',
    'electricity.cell.point2': 'Has 2 terminals: Positive (+) and Negative (-)',
    'electricity.cell.point3': 'Metal cap = Positive terminal',
    'electricity.cell.point4': 'Flat disc = Negative terminal',
    'electricity.cell.point5': 'Provides 1.5V of electrical energy',
    'electricity.cell.point6': 'Used in torches, remote controls, and clocks',
    'electricity.metalCap': 'Metal Cap',
    'electricity.flatDisc': 'Flat Disc',
    'electricity.battery.title': 'Battery',
    'electricity.battery.icon': '🔋',
    'electricity.battery.definition': 'A battery is a combination of two or more electric cells connected together in series.',
    'electricity.battery.keyPoints': 'Key Points',
    'electricity.battery.point1': 'Made of 2 or more cells connected together',
    'electricity.battery.point2': 'Cells connected positive to negative',
    'electricity.battery.point3': 'Provides more energy than a single cell',
    'electricity.battery.point4': 'Used in torches, toys, and portable devices',
    'electricity.battery.point5': 'More cells = More voltage',
    'electricity.battery.point6': 'Must be connected correctly to work',
    'electricity.battery.cell': 'Cell {number}',
    'electricity.battery.multipleCells': 'Multiple Cells = Battery',
    'electricity.battery.totalVoltage': 'Total Voltage = Sum of all cells',
    'electricity.battery.label': 'Battery',
    'electricity.lamps.title': 'Electric Lamps',
    'electricity.lamps.icon': '💡',
    'electricity.lamps.definition': 'Electric lamps produce light when electric current passes through them.',
    'electricity.lamps.keyPoints': 'Key Points',
    'electricity.lamps.point1': 'Incandescent lamps have a filament that glows',
    'electricity.lamps.point2': 'LED lamps are more efficient and last longer',
    'electricity.lamps.point3': 'Filament gets hot and produces light',
    'electricity.lamps.point4': 'LEDs produce light without getting very hot',
    'electricity.lamps.point5': 'Both need electricity to work',
    'electricity.lamps.point6': 'LEDs have positive and negative terminals',
    'electricity.lamp.filamentHeats': 'Filament heats up',
    'electricity.lamp.andGlows': 'and glows',
    'electricity.lamp.tungsten': 'Tungsten',
    'electricity.lamp.filament': 'Filament',
    'electricity.circuit.title': 'Electric Circuit',
    'electricity.circuit.icon': '🔌',
    'electricity.circuit.definition': 'An electric circuit is a complete path for electric current to flow from positive terminal through the device back to negative terminal.',
    'electricity.circuit.keyPoints': 'Key Points',
    'electricity.circuit.point1': 'Must be a complete closed path',
    'electricity.circuit.point2': 'Current flows from positive to negative',
    'electricity.circuit.point3': 'All components must be connected properly',
    'electricity.circuit.point4': 'No gaps or breaks in the circuit',
    'electricity.circuit.point5': 'Switch can open or close the circuit',
    'electricity.circuit.point6': 'Lamp glows only when circuit is complete',
    'electricity.circuit.bulb': 'Bulb',
    'electricity.circuit.currentFlow': 'Current Flow',
    'electricity.circuit.completeCircuit': 'Complete Circuit - Current Can Flow',
    'electricity.switch.title': 'Switch',
    'electricity.switch.icon': '🔘',
    'electricity.switch.definition': 'A switch is used to complete or break an electric circuit.',
    'electricity.switch.keyPoints': 'Key Points',
    'electricity.switch.point1': 'Controls the flow of electricity',
    'electricity.switch.point2': 'ON = Circuit closed, current flows',
    'electricity.switch.point3': 'OFF = Circuit open, no current',
    'electricity.switch.point4': 'Can be placed anywhere in the circuit',
    'electricity.switch.point5': 'Makes devices safe to use',
    'electricity.switch.point6': 'Prevents wastage of electricity',
    'electricity.switch.on': 'Switch ON',
    'electricity.switch.off': 'Switch OFF',
    'electricity.switch.bulbOn': 'Bulb ON',
    'electricity.switch.bulbOff': 'Bulb OFF',
    'electricity.switch.gap': 'Gap',
    'electricity.switch.whenOn': 'When switch is ON, circuit is complete and bulb glows',
    'electricity.switch.whenOff': 'When switch is OFF, circuit is broken and bulb does not glow',
    'electricity.definition': 'Definition',
    'demo.stepType.explanation': 'explanation',
    'demo.stepType.visualization': 'visualization',
    'demo.stepType.interaction': 'interaction',
    'demo.unknownType': 'Unknown step type',
    'demo.intro.title': 'Introduction to Electric Circuits',
    'demo.intro.desc': 'Learn how a torchlight works with electric cells and a lamp',
    'demo.intro.note': 'A complete circuit is needed for current to flow',
    'demo.cell.title': 'Electric Cell',
    'demo.cell.desc': 'An electric cell has two terminals: positive (+) and negative (-)',
    'demo.complete.title': 'Complete Circuit',
    'demo.complete.desc': 'Connect cell, wire, switch, and lamp to make a complete circuit',
    'demo.complete.hint': 'Click the switch to close the circuit',
    'realworld.cooking': 'Cooking',
    'realworld.lighting': 'Lighting',
    'realworld.transportation': 'Transportation',
    'realworld.heating': 'Heating & Cooling',
    'realworld.entertainment': 'Entertainment',
    'realworld.communication': 'Communication',
    'realworld.desc.cooking': 'Electricity powers various cooking appliances',
    'realworld.desc.lighting': 'Illuminating our homes and streets',
    'realworld.desc.transportation': 'Electric vehicles and public transport',
    'realworld.desc.heating': 'Climate control in buildings',
    'realworld.desc.entertainment': 'Powering our entertainment devices',
    'realworld.desc.communication': 'Connecting people worldwide',
    'realworld.example.cooking.stove': 'Electric stove',
    'realworld.example.cooking.microwave': 'Microwave oven',
    'realworld.example.cooking.kettle': 'Electric kettle',
    'realworld.example.cooking.toaster': 'Toaster',
    'realworld.example.lighting.bulbs': 'LED bulbs',
    'realworld.example.lighting.street': 'Street lights',
    'realworld.example.lighting.flashlight': 'Flashlights',
    'realworld.example.lighting.lamp': 'Lamps',
    'realworld.example.transportation.cars': 'Electric cars',
    'realworld.example.transportation.trains': 'Trains',
    'realworld.example.transportation.trams': 'Trams',
    'realworld.example.transportation.ebikes': 'E-bikes',
    'realworld.example.heating.ac': 'Air conditioners',
    'realworld.example.heating.heater': 'Heaters',
    'realworld.example.heating.blanket': 'Electric blankets',
    'realworld.example.heating.fan': 'Fans',
    'realworld.example.entertainment.tv': 'Television',
    'realworld.example.entertainment.computer': 'Computers',
    'realworld.example.entertainment.console': 'Gaming consoles',
    'realworld.example.entertainment.speakers': 'Speakers',
    'realworld.example.communication.phones': 'Mobile phones',
    'realworld.example.communication.router': 'Internet routers',
    'realworld.example.communication.radio': 'Radios',
    'realworld.example.communication.satellite': 'Satellites',
  },
  hi: {
    'nav.learn': 'सीखें',
    'nav.practice': 'अभ्यास',
    'nav.assess': 'मूल्यांकन',
    'nav.applications': 'वास्तविक दुनिया के अनुप्रयोग',
    'common.next': 'अगला',
    'common.previous': 'पिछला',
    'common.submit': 'जमा करें',
    'common.reset': 'रीसेट',
    'common.continue': 'जारी रखें',
    'common.gotIt': 'समझ गया!',
    'common.hint': 'संकेत',
    'common.correct': 'सही',
    'common.incorrect': 'गलत',
    'component.cell': 'विद्युत सेल',
    'component.battery': 'बैटरी',
    'component.lamp': 'लैंप',
    'component.led': 'LED',
    'component.switch': 'स्विच',
    'component.wire': 'तार',
    'component.on': 'चालू',
    'component.off': 'बंद',
    'objective.1': 'विद्युत परिपथ कैसे काम करते हैं समझें',
    'objective.2': 'परिपथ घटकों की पहचान करें',
    'objective.3': 'पूर्ण परिपथ बनाएं',
    'objective.4': 'चालक और अवरोधक में अंतर करें',
    'practice.mode': 'अभ्यास मोड',
    'practice.selectTopic': 'अभ्यास के लिए एक विषय चुनें',
    'practice.mixedPractice': 'मिश्रित अभ्यास',
    'practice.allTopics': 'सभी विषय',
    'practice.questions': 'प्रश्न',
    'practice.question': 'प्रश्न',
    'practice.of': 'का',
    'practice.score': 'स्कोर',
    'practice.submit': 'जमा करें',
    'practice.correct': 'सही!',
    'practice.incorrect': 'गलत',
    'practice.explanation': 'स्पष्टीकरण',
    'practice.correctAnswer': 'सही उत्तर',
    'practice.excellent': 'उत्कृष्ट!',
    'practice.good': 'अच्छा काम!',
    'practice.keepPracticing': 'अभ्यास जारी रखें!',
    'practice.result.excellent': 'शानदार काम! आपने इस विषय में महारत हासिल कर ली है।',
    'practice.result.good': 'बहुत बढ़िया! और सुधार के लिए अभ्यास जारी रखें।',
    'practice.result.keepPracticing': 'अच्छा प्रयास! अवधारणाओं की समीक्षा करें और फिर से कोशिश करें।',
    'practice.tryAgain': 'फिर से कोशिश करें',
    'practice.backToTopics': 'विषयों पर वापस जाएं',
    'practice.easy': 'आसान',
    'practice.medium': 'मध्यम',
    'practice.hard': 'कठिन',
    'practice.noComponents.title': 'सर्किट देखने के लिए घटक जोड़ें या व्यवस्थित करें।',
    'practice.noComponents.desc': 'यह तय करने के लिए कि क्या जोड़ना है, संकेत और विवरण का उपयोग करें।',
    'practice.multipleChoice': 'बहुविकल्पी',
    'practice.trueFalse': 'सही या गलत',
    'practice.fillBlank': 'रिक्त स्थान भरें',
    'practice.shortAnswer': 'लघु उत्तर',
    'practice.submitAnswer': 'उत्तर जमा करें',
    'practice.previous': 'पिछला',
    'practice.next': 'अगला',
    'practice.question1': 'एक विद्युत सेल के कितने टर्मिनल होते हैं?',
    'practice.question1.option1': 'एक',
    'practice.question1.option2': 'दो',
    'practice.question1.option3': 'तीन',
    'practice.question1.option4': 'चार',
    'practice.question1.explanation': 'सभी विद्युत सेल के दो टर्मिनल होते हैं: एक धनात्मक (+ve) और एक ऋणात्मक (−ve)।',
    'practice.question2': 'विद्युत सेल के किस टर्मिनल पर छोटी धातु की टोपी होती है?',
    'practice.question2.option1': 'धनात्मक टर्मिनल',
    'practice.question2.option2': 'ऋणात्मक टर्मिनल',
    'practice.question2.option3': 'दोनों टर्मिनल',
    'practice.question2.option4': 'कोई भी टर्मिनल नहीं',
    'practice.question2.explanation': 'धातु की टोपी विद्युत सेल का धनात्मक टर्मिनल है, जबकि धातु की डिस्क ऋणात्मक टर्मिनल है।',
    'practice.question3': 'दो या अधिक सेल के संयोजन को बैटरी कहा जाता है।',
    'practice.question3.option1': 'सही',
    'practice.question3.option2': 'गलत',
    'practice.question3.explanation': 'जब दो या अधिक सेल जुड़े होते हैं (धनात्मक से ऋणात्मक), तो उस संयोजन को बैटरी कहा जाता है।',
    'practice.question4': 'बैटरी में, एक सेल का धनात्मक टर्मिनल अगले सेल के _____ टर्मिनल से जुड़ा होता है।',
    'practice.question4.answer': 'ऋणात्मक',
    'practice.question4.explanation': 'बैटरी में, सेल श्रृंखला में जुड़े होते हैं - एक सेल का धनात्मक टर्मिनल अगले सेल के ऋणात्मक टर्मिनल से जुड़ता है।',
    'practice.question5': 'एक तापदीप्त लैंप के अंदर चमकने वाले पतले तार को क्या कहा जाता है?',
    'practice.question5.option1': 'तार',
    'practice.question5.option2': 'फिलामेंट',
    'practice.question5.option3': 'धागा',
    'practice.question5.option4': 'चालक',
    'practice.question5.explanation': 'कांच के बल्ब के अंदर चमकने वाला पतला तार लैंप का फिलामेंट कहलाता है।',
    'practice.question6': 'एक तापदीप्त लैंप के दो टर्मिनल इस तरह से तय होते हैं कि वे एक दूसरे को छूते हैं।',
    'practice.question6.explanation': 'तापदीप्त लैंप के दो टर्मिनल इस तरह से तय होते हैं कि वे एक दूसरे को नहीं छूते हैं।',
    'practice.question7': 'किस प्रकार के लैंप में फिलामेंट नहीं होता है?',
    'practice.question7.option1': 'तापदीप्त लैंप',
    'practice.question7.option2': 'LED लैंप',
    'practice.question7.option3': 'दोनों में फिलामेंट होता है',
    'practice.question7.option4': 'किसी में भी फिलामेंट नहीं होता',
    'practice.question7.explanation': 'तापदीप्त लैंप के विपरीत, LED (लाइट एमिटिंग डायोड) में फिलामेंट नहीं होता है।',
    'practice.question8': 'LED में, कौन सा तार लंबा होता है?',
    'practice.question8.option1': 'धनात्मक टर्मिनल तार',
    'practice.question8.option2': 'ऋणात्मक टर्मिनल तार',
    'practice.question8.option3': 'दोनों बराबर हैं',
    'practice.question8.option4': 'यह अलग-अलग होता है',
    'practice.question8.explanation': 'LED में, धनात्मक टर्मिनल लंबे तार से जुड़ा होता है, जबकि ऋणात्मक टर्मिनल में छोटा तार होता है।',
    'practice.question9': 'विद्युत धारा LED से दोनों दिशाओं में गुजर सकती है।',
    'practice.question9.explanation': 'विद्युत धारा LED से केवल एक दिशा में गुजर सकती है - धनात्मक से ऋणात्मक तक।',
    'practice.question10': 'एक विद्युत लैंप को चमकने के लिए, लैंप का एक टर्मिनल सेल के एक टर्मिनल से जुड़ा होना चाहिए और लैंप का दूसरा टर्मिनल सेल के _____ टर्मिनल से जुड़ा होना चाहिए।',
    'practice.question10.answer': 'दूसरे',
    'practice.question10.explanation': 'लैंप को चमकने के लिए, इसे सेल के दोनों टर्मिनल को लैंप के दोनों टर्मिनल से जोड़कर एक पूर्ण सर्किट बनाना चाहिए।',
    'practice.question11': 'विद्युत धारा के लिए पूर्ण पथ प्रदान करने वाली व्यवस्था को क्या कहा जाता है?',
    'practice.question11.option1': 'विद्युत परिपथ',
    'practice.question11.option2': 'विद्युत पथ',
    'practice.question11.option3': 'धारा पथ',
    'practice.question11.option4': 'तार कनेक्शन',
    'practice.question11.explanation': 'एक विद्युत परिपथ लैंप के माध्यम से विद्युत धारा के प्रवाह के लिए एक पूर्ण पथ प्रदान करता है।',
    'practice.question12': 'विद्युत परिपथ में विद्युत धारा की दिशा ऋणात्मक से धनात्मक टर्मिनल तक होती है।',
    'practice.question12.explanation': 'विद्युत परिपथ में विद्युत धारा की दिशा विद्युत सेल के धनात्मक से ऋणात्मक टर्मिनल तक ली जाती है।',
    'practice.question13': 'कौन सा उपकरण विद्युत परिपथ को पूर्ण या तोड़ता है?',
    'practice.question13.option1': 'तार',
    'practice.question13.option2': 'बैटरी',
    'practice.question13.option3': 'स्विच',
    'practice.question13.option4': 'लैंप',
    'practice.question13.explanation': 'स्विच एक सरल उपकरण है जो परिपथ को पूर्ण या तोड़ता है, बिजली के प्रवाह को नियंत्रित करता है।',
    'practice.question14': 'जब स्विच ON स्थिति में होता है, तो परिपथ _____ होता है।',
    'practice.question14.answer': 'बंद',
    'practice.question14.explanation': 'जब स्विच ON होता है, तो परिपथ बंद होता है और धारा सेल के धनात्मक से ऋणात्मक टर्मिनल तक प्रवाहित होती है।',
    'practice.question15': 'टूटा हुआ फिलामेंट लैंप को अभी भी चमकने की अनुमति देगा।',
    'practice.question15.explanation': 'टूटा हुआ फिलामेंट धारा के प्रवाह को रोकता है, जिससे लैंप चमक नहीं पाता। इसे \'फ्यूज्ड\' लैंप कहा जाता है।',
    'common.examples': 'उदाहरण',
    'common.status.incomplete': 'अधूरा सर्किट',
    'common.status.complete': 'सर्किट पूर्ण',
    'common.status.flowing': 'धारा प्रवाहित हो रही है',
    'nav.logo': 'सर्किट',
    'electricity.lessons': 'पाठ',
    'electricity.lesson.cell': 'सेल',
    'electricity.lesson.battery': 'बैटरी',
    'electricity.lesson.lamps': 'लैंप',
    'electricity.lesson.circuit': 'सर्किट',
    'electricity.lesson.switch': 'स्विच',
    'electricity.cell.title': 'विद्युत सेल',
    'electricity.cell.icon': '⚡',
    'electricity.cell.definition': 'विद्युत सेल विद्युत ऊर्जा का एक पोर्टेबल स्रोत है। इसके दो टर्मिनल हैं: धनात्मक (+) और ऋणात्मक (-)।',
    'electricity.cell.keyPoints': 'मुख्य बिंदु',
    'electricity.cell.point1': 'विद्युत का पोर्टेबल स्रोत',
    'electricity.cell.point2': '2 टर्मिनल हैं: धनात्मक (+) और ऋणात्मक (-)',
    'electricity.cell.point3': 'धातु की टोपी = धनात्मक टर्मिनल',
    'electricity.cell.point4': 'सपाट डिस्क = ऋणात्मक टर्मिनल',
    'electricity.cell.point5': '1.5V विद्युत ऊर्जा प्रदान करता है',
    'electricity.cell.point6': 'टॉर्च, रिमोट कंट्रोल और घड़ियों में उपयोग किया जाता है',
    'electricity.metalCap': 'धातु की टोपी',
    'electricity.flatDisc': 'सपाट डिस्क',
    'electricity.battery.title': 'बैटरी',
    'electricity.battery.icon': '🔋',
    'electricity.battery.definition': 'बैटरी दो या अधिक विद्युत सेल का एक संयोजन है जो श्रृंखला में जुड़े होते हैं।',
    'electricity.battery.keyPoints': 'मुख्य बिंदु',
    'electricity.battery.point1': '2 या अधिक सेल से बना',
    'electricity.battery.point2': 'सेल धनात्मक से ऋणात्मक जुड़े',
    'electricity.battery.point3': 'एक सेल से अधिक ऊर्जा प्रदान करता है',
    'electricity.battery.point4': 'टॉर्च, खिलौने और पोर्टेबल उपकरणों में उपयोग किया जाता है',
    'electricity.battery.point5': 'अधिक सेल = अधिक वोल्टेज',
    'electricity.battery.point6': 'काम करने के लिए सही तरीके से जुड़ा होना चाहिए',
    'electricity.battery.cell': 'सेल {number}',
    'electricity.battery.multipleCells': 'कई सेल = बैटरी',
    'electricity.battery.totalVoltage': 'कुल वोल्टेज = सभी सेल का योग',
    'electricity.battery.label': 'बैटरी',
    'electricity.lamps.title': 'विद्युत लैंप',
    'electricity.lamps.icon': '💡',
    'electricity.lamps.definition': 'विद्युत लैंप प्रकाश उत्पन्न करते हैं जब विद्युत धारा उनसे गुजरती है।',
    'electricity.lamps.keyPoints': 'मुख्य बिंदु',
    'electricity.lamps.point1': 'इनकैंडेसेंट लैंप में एक फिलामेंट होता है जो चमकता है',
    'electricity.lamps.point2': 'LED लैंप अधिक कुशल और लंबे समय तक चलते हैं',
    'electricity.lamps.point3': 'फिलामेंट गर्म होता है और प्रकाश उत्पन्न करता है',
    'electricity.lamps.point4': 'LED बहुत गर्म हुए बिना प्रकाश उत्पन्न करते हैं',
    'electricity.lamps.point5': 'दोनों को काम करने के लिए बिजली की आवश्यकता होती है',
    'electricity.lamps.point6': 'LED में धनात्मक और ऋणात्मक टर्मिनल होते हैं',
    'electricity.lamp.filamentHeats': 'फिलामेंट गर्म होता है',
    'electricity.lamp.andGlows': 'और चमकता है',
    'electricity.lamp.tungsten': 'टंगस्टन',
    'electricity.lamp.filament': 'फिलामेंट',
    'electricity.circuit.title': 'विद्युत परिपथ',
    'electricity.circuit.icon': '🔌',
    'electricity.circuit.definition': 'विद्युत परिपथ विद्युत धारा के प्रवाह के लिए एक पूर्ण पथ है जो धनात्मक टर्मिनल से उपकरण के माध्यम से ऋणात्मक टर्मिनल तक जाता है।',
    'electricity.circuit.keyPoints': 'मुख्य बिंदु',
    'electricity.circuit.point1': 'एक पूर्ण बंद पथ होना चाहिए',
    'electricity.circuit.point2': 'धारा धनात्मक से ऋणात्मक तक प्रवाहित होती है',
    'electricity.circuit.point3': 'सभी घटक सही तरीके से जुड़े होने चाहिए',
    'electricity.circuit.point4': 'सर्किट में कोई अंतराल या टूट नहीं होना चाहिए',
    'electricity.circuit.point5': 'स्विच सर्किट को खोल या बंद कर सकता है',
    'electricity.circuit.point6': 'लैंप केवल तभी चमकता है जब सर्किट पूर्ण हो',
    'electricity.circuit.bulb': 'बल्ब',
    'electricity.circuit.currentFlow': 'धारा प्रवाह',
    'electricity.circuit.completeCircuit': 'पूर्ण सर्किट - धारा प्रवाहित हो सकती है',
    'electricity.switch.title': 'स्विच',
    'electricity.switch.icon': '🔘',
    'electricity.switch.definition': 'स्विच का उपयोग विद्युत परिपथ को पूर्ण या तोड़ने के लिए किया जाता है।',
    'electricity.switch.keyPoints': 'मुख्य बिंदु',
    'electricity.switch.point1': 'बिजली के प्रवाह को नियंत्रित करता है',
    'electricity.switch.point2': 'ON = सर्किट बंद, धारा प्रवाहित होती है',
    'electricity.switch.point3': 'OFF = सर्किट खुला, कोई धारा नहीं',
    'electricity.switch.point4': 'सर्किट में कहीं भी रखा जा सकता है',
    'electricity.switch.point5': 'उपकरणों को सुरक्षित रूप से उपयोग करने योग्य बनाता है',
    'electricity.switch.point6': 'बिजली की बर्बादी को रोकता है',
    'electricity.switch.on': 'स्विच चालू',
    'electricity.switch.off': 'स्विच बंद',
    'electricity.switch.bulbOn': 'बल्ब चालू',
    'electricity.switch.bulbOff': 'बल्ब बंद',
    'electricity.switch.gap': 'अंतराल',
    'electricity.switch.whenOn': 'जब स्विच ON होता है, सर्किट पूर्ण होता है और बल्ब चमकता है',
    'electricity.switch.whenOff': 'जब स्विच OFF होता है, सर्किट टूट जाता है और बल्ब नहीं चमकता',
    'electricity.definition': 'परिभाषा',
    'demo.stepType.explanation': 'स्पष्टीकरण',
    'demo.stepType.visualization': 'दृश्य',
    'demo.stepType.interaction': 'अंतर्क्रिया',
    'demo.unknownType': 'अज्ञात चरण प्रकार',
    'demo.intro.title': 'विद्युत परिपथ का परिचय',
    'demo.intro.desc': 'जानें कि टॉर्चलाइट विद्युत सेल और लैंप के साथ कैसे काम करता है',
    'demo.intro.note': 'धारा प्रवाहित करने के लिए एक पूर्ण सर्किट की आवश्यकता है',
    'demo.cell.title': 'विद्युत सेल',
    'demo.cell.desc': 'विद्युत सेल के दो टर्मिनल हैं: धनात्मक (+) और ऋणात्मक (-)',
    'demo.complete.title': 'पूर्ण सर्किट',
    'demo.complete.desc': 'एक पूर्ण सर्किट बनाने के लिए सेल, तार, स्विच और लैंप को जोड़ें',
    'demo.complete.hint': 'सर्किट को बंद करने के लिए स्विच पर क्लिक करें',
    'realworld.cooking': 'खाना पकाना',
    'realworld.lighting': 'प्रकाश',
    'realworld.transportation': 'परिवहन',
    'realworld.heating': 'हीटिंग और कूलिंग',
    'realworld.entertainment': 'मनोरंजन',
    'realworld.communication': 'संचार',
    'realworld.desc.cooking': 'बिजली विभिन्न खाना पकाने के उपकरणों को शक्ति प्रदान करती है',
    'realworld.desc.lighting': 'हमारे घरों और सड़कों को रोशन करना',
    'realworld.desc.transportation': 'इलेक्ट्रिक वाहन और सार्वजनिक परिवहन',
    'realworld.desc.heating': 'इमारतों में जलवायु नियंत्रण',
    'realworld.desc.entertainment': 'हमारे मनोरंजन उपकरणों को शक्ति प्रदान करना',
    'realworld.desc.communication': 'दुनिया भर के लोगों को जोड़ना',
    'realworld.example.cooking.stove': 'इलेक्ट्रिक स्टोव',
    'realworld.example.cooking.microwave': 'माइक्रोवेव ओवन',
    'realworld.example.cooking.kettle': 'इलेक्ट्रिक केतली',
    'realworld.example.cooking.toaster': 'टोस्टर',
    'realworld.example.lighting.bulbs': 'LED बल्ब',
    'realworld.example.lighting.street': 'स्ट्रीट लाइट',
    'realworld.example.lighting.flashlight': 'टॉर्च',
    'realworld.example.lighting.lamp': 'लैंप',
    'realworld.example.transportation.cars': 'इलेक्ट्रिक कारें',
    'realworld.example.transportation.trains': 'ट्रेनें',
    'realworld.example.transportation.trams': 'ट्राम',
    'realworld.example.transportation.ebikes': 'ई-बाइक',
    'realworld.example.heating.ac': 'एयर कंडीशनर',
    'realworld.example.heating.heater': 'हीटर',
    'realworld.example.heating.blanket': 'इलेक्ट्रिक कंबल',
    'realworld.example.heating.fan': 'पंखे',
    'realworld.example.entertainment.tv': 'टेलीविजन',
    'realworld.example.entertainment.computer': 'कंप्यूटर',
    'realworld.example.entertainment.console': 'गेमिंग कंसोल',
    'realworld.example.entertainment.speakers': 'स्पीकर',
    'realworld.example.communication.phones': 'मोबाइल फोन',
    'realworld.example.communication.router': 'इंटरनेट राउटर',
    'realworld.example.communication.radio': 'रेडियो',
    'realworld.example.communication.satellite': 'उपग्रह',
  },
  gu: {
    'nav.learn': 'શીખો',
    'nav.practice': 'અભ્યાસ',
    'nav.assess': 'મૂલ્યાંકન',
    'nav.applications': 'વાસ્તવિક વિશ્વના ઉપયોગો',
    'common.next': 'આગળ',
    'common.previous': 'પાછળ',
    'common.submit': 'સબમિટ કરો',
    'common.reset': 'રીસેટ',
    'common.continue': 'ચાલુ રાખો',
    'common.gotIt': 'સમજાયું!',
    'common.hint': 'સંકેત',
    'common.correct': 'સાચું',
    'common.incorrect': 'ખોટું',
    'component.cell': 'ઇલેક્ટ્રિક સેલ',
    'component.battery': 'બેટરી',
    'component.lamp': 'લેમ્પ',
    'component.led': 'LED',
    'component.switch': 'સ્વીચ',
    'component.wire': 'તાર',
    'component.on': 'ચાલુ',
    'component.off': 'બંધ',
    'objective.1': 'વિદ્યુત સર્કિટ કેવી રીતે કામ કરે છે તે સમજો',
    'objective.2': 'સર્કિટ ઘટકોને ઓળખો',
    'objective.3': 'સંપૂર્ણ સર્કિટ બનાવો',
    'objective.4': 'વાહક અને અવાહક વચ્ચે તફાવત કરો',
    'practice.mode': 'અભ્યાસ મોડ',
    'practice.selectTopic': 'અભ્યાસ માટે એક વિષય પસંદ કરો',
    'practice.mixedPractice': 'મિશ્ર અભ્યાસ',
    'practice.allTopics': 'બધા વિષયો',
    'practice.questions': 'પ્રશ્નો',
    'practice.question': 'પ્રશ્ન',
    'practice.of': 'ના',
    'practice.score': 'સ્કોર',
    'practice.submit': 'સબમિટ કરો',
    'practice.correct': 'સાચું!',
    'practice.incorrect': 'ખોટું',
    'practice.explanation': 'સમજૂતી',
    'practice.correctAnswer': 'સાચો જવાબ',
    'practice.excellent': 'ઉત્કૃષ્ટ!',
    'practice.good': 'સારું કામ!',
    'practice.keepPracticing': 'અભ્યાસ ચાલુ રાખો!',
    'practice.result.excellent': 'ઉત્કૃષ્ટ કામ! તમે આ વિષયમાં નિપુણતા મેળવી છે.',
    'practice.result.good': 'સારું કામ! વધુ સુધારા માટે અભ્યાસ ચાલુ રાખો.',
    'practice.result.keepPracticing': 'સારો પ્રયાસ! ખ્યાલોની સમીક્ષા કરો અને ફરી પ્રયાસ કરો.',
    'practice.tryAgain': 'ફરી પ્રયાસ કરો',
    'practice.backToTopics': 'વિષયો પર પાછા જાઓ',
    'practice.easy': 'સરળ',
    'practice.medium': 'મધ્યમ',
    'practice.hard': 'કઠિન',
    'practice.noComponents.title': 'સર્કિટ જોવા માટે ઘટકો ઉમેરો અથવા વ્યવસ્થિત કરો.',
    'practice.noComponents.desc': 'શું જોડવું તે નક્કી કરવા માટે સંકેતો અને વર્ણનનો ઉપયોગ કરો.',
    'practice.multipleChoice': 'બહુવિકલ્પ',
    'practice.trueFalse': 'સાચું અથવા ખોટું',
    'practice.fillBlank': 'ખાલી જગ્યા ભરો',
    'practice.shortAnswer': 'ટૂંકો જવાબ',
    'practice.submitAnswer': 'જવાબ સબમિટ કરો',
    'practice.previous': 'પાછળ',
    'practice.next': 'આગળ',
    'practice.question1': 'ઇલેક્ટ્રિક સેલના કેટલા ટર્મિનલ હોય છે?',
    'practice.question1.option1': 'એક',
    'practice.question1.option2': 'બે',
    'practice.question1.option3': 'ત્રણ',
    'practice.question1.option4': 'ચાર',
    'practice.question1.explanation': 'બધા ઇલેક્ટ્રિક સેલના બે ટર્મિનલ હોય છે: એક પોઝિટિવ (+ve) અને એક નેગેટિવ (−ve)।',
    'practice.question2': 'ઇલેક્ટ્રિક સેલના કયા ટર્મિનલ પર નાની ધાતુની ટોપી હોય છે?',
    'practice.question2.option1': 'પોઝિટિવ ટર્મિનલ',
    'practice.question2.option2': 'નેગેટિવ ટર્મિનલ',
    'practice.question2.option3': 'બંને ટર્મિનલ',
    'practice.question2.option4': 'કોઈ પણ ટર્મિનલ નહીં',
    'practice.question2.explanation': 'ધાતુની ટોપી ઇલેક્ટ્રિક સેલનું પોઝિટિવ ટર્મિનલ છે, જ્યારે ધાતુની ડિસ્ક નેગેટિવ ટર્મિનલ છે।',
    'practice.question3': 'બે અથવા વધુ સેલના સંયોજનને બેટરી કહેવામાં આવે છે।',
    'practice.question3.option1': 'સાચું',
    'practice.question3.option2': 'ખોટું',
    'practice.question3.explanation': 'જ્યારે બે અથવા વધુ સેલ જોડાયેલા હોય છે (પોઝિટિવથી નેગેટિવ), તો તે સંયોજનને બેટરી કહેવામાં આવે છે।',
    'practice.question4': 'બેટરીમાં, એક સેલનું પોઝિટિવ ટર્મિનલ આગળના સેલના _____ ટર્મિનલ સાથે જોડાયેલું હોય છે।',
    'practice.question4.answer': 'નેગેટિવ',
    'practice.question4.explanation': 'બેટરીમાં, સેલ શ્રેણીમાં જોડાયેલા હોય છે - એક સેલનું પોઝિટિવ ટર્મિનલ આગળના સેલના નેગેટિવ ટર્મિનલ સાથે જોડાય છે।',
    'practice.question5': 'ઇન્કેન્ડેસન્ટ લેમ્પની અંદર ચમકતા પાતળા તારને શું કહેવામાં આવે છે?',
    'practice.question5.option1': 'તાર',
    'practice.question5.option2': 'ફિલામેન્ટ',
    'practice.question5.option3': 'ધાગો',
    'practice.question5.option4': 'વાહક',
    'practice.question5.explanation': 'કાચના બલ્બની અંદર ચમકતા પાતળા તારને લેમ્પનું ફિલામેન્ટ કહેવામાં આવે છે।',
    'practice.question6': 'ઇન્કેન્ડેસન્ટ લેમ્પના બે ટર્મિનલ એવી રીતે ફિક્સ કરવામાં આવે છે કે તેઓ એકબીજાને સ્પર્શ કરે છે।',
    'practice.question6.explanation': 'ઇન્કેન્ડેસન્ટ લેમ્પના બે ટર્મિનલ એવી રીતે ફિક્સ કરવામાં આવે છે કે તેઓ એકબીજાને સ્પર્શ કરતા નથી।',
    'practice.question7': 'કયા પ્રકારના લેમ્પમાં ફિલામેન્ટ નથી?',
    'practice.question7.option1': 'ઇન્કેન્ડેસન્ટ લેમ્પ',
    'practice.question7.option2': 'LED લેમ્પ',
    'practice.question7.option3': 'બંનેમાં ફિલામેન્ટ છે',
    'practice.question7.option4': 'કોઈમાં પણ ફિલામેન્ટ નથી',
    'practice.question7.explanation': 'ઇન્કેન્ડેસન્ટ લેમ્પથી વિપરીત, LED (લાઇટ એમિટિંગ ડાયોડ) માં ફિલામેન્ટ નથી હોતું।',
    'practice.question8': 'LED માં, કયો તાર લાંબો હોય છે?',
    'practice.question8.option1': 'પોઝિટિવ ટર્મિનલ તાર',
    'practice.question8.option2': 'નેગેટિવ ટર્મિનલ તાર',
    'practice.question8.option3': 'બંને સમાન છે',
    'practice.question8.option4': 'તે બદલાય છે',
    'practice.question8.explanation': 'LED માં, પોઝિટિવ ટર્મિનલ લાંબા તાર સાથે જોડાયેલું હોય છે, જ્યારે નેગેટિવ ટર્મિનલમાં ટૂંકો તાર હોય છે।',
    'practice.question9': 'વિદ્યુત પ્રવાહ LED દ્વારા બંને દિશામાં પસાર થઈ શકે છે।',
    'practice.question9.explanation': 'વિદ્યુત પ્રવાહ LED દ્વારા ફક્ત એક દિશામાં પસાર થઈ શકે છે - પોઝિટિવથી નેગેટિવ તરફ।',
    'practice.question10': 'ઇલેક્ટ્રિક લેમ્પને ચમકવા માટે, લેમ્પનું એક ટર્મિનલ સેલના એક ટર્મિનલ સાથે જોડાયેલું હોવું જોઈએ અને લેમ્પનું બીજું ટર્મિનલ સેલના _____ ટર્મિનલ સાથે જોડાયેલું હોવું જોઈએ।',
    'practice.question10.answer': 'બીજા',
    'practice.question10.explanation': 'લેમ્પને ચમકવા માટે, તેને સેલના બંને ટર્મિનલને લેમ્પના બંને ટર્મિનલ સાથે જોડીને સંપૂર્ણ સર્કિટ બનાવવું જોઈએ।',
    'practice.question11': 'વિદ્યુત પ્રવાહ માટે સંપૂર્ણ માર્ગ પ્રદાન કરતી સુયોજનાને શું કહેવામાં આવે છે?',
    'practice.question11.option1': 'વિદ્યુત સર્કિટ',
    'practice.question11.option2': 'વિદ્યુત માર્ગ',
    'practice.question11.option3': 'પ્રવાહ માર્ગ',
    'practice.question11.option4': 'તાર કનેક્શન',
    'practice.question11.explanation': 'વિદ્યુત સર્કિટ લેમ્પ દ્વારા વિદ્યુત પ્રવાહના પ્રવાહ માટે સંપૂર્ણ માર્ગ પ્રદાન કરે છે।',
    'practice.question12': 'વિદ્યુત સર્કિટમાં વિદ્યુત પ્રવાહની દિશા નેગેટિવથી પોઝિટિવ ટર્મિનલ તરફ હોય છે।',
    'practice.question12.explanation': 'વિદ્યુત સર્કિટમાં વિદ્યુત પ્રવાહની દિશા ઇલેક્ટ્રિક સેલના પોઝિટિવથી નેગેટિવ ટર્મિનલ તરફ લેવામાં આવે છે।',
    'practice.question13': 'કયું ઉપકરણ વિદ્યુત સર્કિટને પૂર્ણ અથવા તોડે છે?',
    'practice.question13.option1': 'તાર',
    'practice.question13.option2': 'બેટરી',
    'practice.question13.option3': 'સ્વીચ',
    'practice.question13.option4': 'લેમ્પ',
    'practice.question13.explanation': 'સ્વીચ એક સરળ ઉપકરણ છે જે સર્કિટને પૂર્ણ અથવા તોડે છે, વીજળીના પ્રવાહને નિયંત્રિત કરે છે।',
    'practice.question14': 'જ્યારે સ્વીચ ON સ્થિતિમાં હોય છે, ત્યારે સર્કિટ _____ હોય છે।',
    'practice.question14.answer': 'બંધ',
    'practice.question14.explanation': 'જ્યારે સ્વીચ ON હોય છે, ત્યારે સર્કિટ બંધ હોય છે અને પ્રવાહ સેલના પોઝિટિવથી નેગેટિવ ટર્મિનલ તરફ વહે છે।',
    'practice.question15': 'ટૂટેલું ફિલામેન્ટ લેમ્પને હજુ પણ ચમકવાની મંજૂરી આપશે।',
    'practice.question15.explanation': 'ટૂટેલું ફિલામેન્ટ પ્રવાહના પ્રવાહને અટકાવે છે, જે લેમ્પને ચમકતું અટકાવે છે. આને \'ફ્યુઝ્ડ\' લેમ્પ કહેવામાં આવે છે।',
    'common.examples': 'ઉદાહરણો',
    'common.status.incomplete': 'અધૂરું સર્કિટ',
    'common.status.complete': 'સર્કિટ પૂર્ણ',
    'common.status.flowing': 'પ્રવાહ વહે છે',
    'nav.logo': 'સર્કિટ',
    'electricity.lessons': 'પાઠ',
    'electricity.lesson.cell': 'સેલ',
    'electricity.lesson.battery': 'બેટરી',
    'electricity.lesson.lamps': 'લેમ્પ',
    'electricity.lesson.circuit': 'સર્કિટ',
    'electricity.lesson.switch': 'સ્વીચ',
    'electricity.cell.title': 'ઇલેક્ટ્રિક સેલ',
    'electricity.cell.icon': '⚡',
    'electricity.cell.definition': 'ઇલેક્ટ્રિક સેલ વિદ્યુત ઊર્જાનો પોર્ટેબલ સ્રોત છે. તેના બે ટર્મિનલ છે: પોઝિટિવ (+) અને નેગેટિવ (-).',
    'electricity.cell.keyPoints': 'મુખ્ય મુદ્દાઓ',
    'electricity.cell.point1': 'વિદ્યુતનો પોર્ટેબલ સ્રોત',
    'electricity.cell.point2': '2 ટર્મિનલ છે: પોઝિટિવ (+) અને નેગેટિવ (-)',
    'electricity.cell.point3': 'મેટલ કેપ = પોઝિટિવ ટર્મિનલ',
    'electricity.cell.point4': 'સપાટ ડિસ્ક = નેગેટિવ ટર્મિનલ',
    'electricity.cell.point5': '1.5V વિદ્યુત ઊર્જા પ્રદાન કરે છે',
    'electricity.cell.point6': 'ટોર્ચ, રિમોટ કંટ્રોલ અને ઘડિયાળમાં ઉપયોગ થાય છે',
    'electricity.metalCap': 'મેટલ કેપ',
    'electricity.flatDisc': 'સપાટ ડિસ્ક',
    'electricity.battery.title': 'બેટરી',
    'electricity.battery.icon': '🔋',
    'electricity.battery.definition': 'બેટરી એ બે અથવા વધુ ઇલેક્ટ્રિક સેલનું સંયોજન છે જે શ્રેણીમાં જોડાયેલા હોય છે.',
    'electricity.battery.keyPoints': 'મુખ્ય મુદ્દાઓ',
    'electricity.battery.point1': '2 અથવા વધુ સેલથી બનેલું',
    'electricity.battery.point2': 'સેલ પોઝિટિવથી નેગેટિવ જોડાયેલા',
    'electricity.battery.point3': 'એક સેલ કરતાં વધુ ઊર્જા પ્રદાન કરે છે',
    'electricity.battery.point4': 'ટોર્ચ, રમકડાં અને પોર્ટેબલ ઉપકરણોમાં ઉપયોગ થાય છે',
    'electricity.battery.point5': 'વધુ સેલ = વધુ વોલ્ટેજ',
    'electricity.battery.point6': 'કામ કરવા માટે યોગ્ય રીતે જોડાયેલું હોવું જોઈએ',
    'electricity.battery.cell': 'સેલ {number}',
    'electricity.battery.multipleCells': 'બહુવિધ સેલ = બેટરી',
    'electricity.battery.totalVoltage': 'કુલ વોલ્ટેજ = બધા સેલનો સરવાળો',
    'electricity.battery.label': 'બેટરી',
    'electricity.lamps.title': 'ઇલેક્ટ્રિક લેમ્પ',
    'electricity.lamps.icon': '💡',
    'electricity.lamps.definition': 'ઇલેક્ટ્રિક લેમ્પ પ્રકાશ ઉત્પન્ન કરે છે જ્યારે વિદ્યુત પ્રવાહ તેમના દ્વારા પસાર થાય છે.',
    'electricity.lamps.keyPoints': 'મુખ્ય મુદ્દાઓ',
    'electricity.lamps.point1': 'ઇન્કેન્ડેસન્ટ લેમ્પમાં ફિલામેન્ટ હોય છે જે ચમકે છે',
    'electricity.lamps.point2': 'LED લેમ્પ વધુ કાર્યક્ષમ અને લાંબા સમય સુધી ચાલે છે',
    'electricity.lamps.point3': 'ફિલામેન્ટ ગરમ થાય છે અને પ્રકાશ ઉત્પન્ન કરે છે',
    'electricity.lamps.point4': 'LED ખૂબ ગરમ થયા વિના પ્રકાશ ઉત્પન્ન કરે છે',
    'electricity.lamps.point5': 'બંનેને કામ કરવા માટે વીજળીની જરૂર છે',
    'electricity.lamps.point6': 'LED માં પોઝિટિવ અને નેગેટિવ ટર્મિનલ હોય છે',
    'electricity.lamp.filamentHeats': 'ફિલામેન્ટ ગરમ થાય છે',
    'electricity.lamp.andGlows': 'અને ચમકે છે',
    'electricity.lamp.tungsten': 'ટંગસ્ટન',
    'electricity.lamp.filament': 'ફિલામેન્ટ',
    'electricity.circuit.title': 'ઇલેક્ટ્રિક સર્કિટ',
    'electricity.circuit.icon': '🔌',
    'electricity.circuit.definition': 'ઇલેક્ટ્રિક સર્કિટ એ વિદ્યુત પ્રવાહ માટે સંપૂર્ણ માર્ગ છે જે પોઝિટિવ ટર્મિનલથી ઉપકરણ દ્વારા નેગેટિવ ટર્મિનલ સુધી જાય છે.',
    'electricity.circuit.keyPoints': 'મુખ્ય મુદ્દાઓ',
    'electricity.circuit.point1': 'સંપૂર્ણ બંધ માર્ગ હોવો જોઈએ',
    'electricity.circuit.point2': 'પ્રવાહ પોઝિટિવથી નેગેટિવ તરફ વહે છે',
    'electricity.circuit.point3': 'બધા ઘટકો યોગ્ય રીતે જોડાયેલા હોવા જોઈએ',
    'electricity.circuit.point4': 'સર્કિટમાં કોઈ અંતર અથવા તૂટક ન હોવું જોઈએ',
    'electricity.circuit.point5': 'સ્વીચ સર્કિટને ખોલી અથવા બંધ કરી શકે છે',
    'electricity.circuit.point6': 'લેમ્પ ફક્ત ત્યારે જ ચમકે છે જ્યારે સર્કિટ પૂર્ણ હોય',
    'electricity.circuit.bulb': 'બલ્બ',
    'electricity.circuit.currentFlow': 'પ્રવાહ',
    'electricity.circuit.completeCircuit': 'સંપૂર્ણ સર્કિટ - પ્રવાહ વહી શકે છે',
    'electricity.switch.title': 'સ્વીચ',
    'electricity.switch.icon': '🔘',
    'electricity.switch.definition': 'સ્વીચનો ઉપયોગ ઇલેક્ટ્રિક સર્કિટને પૂર્ણ અથવા તોડવા માટે થાય છે.',
    'electricity.switch.keyPoints': 'મુખ્ય મુદ્દાઓ',
    'electricity.switch.point1': 'વીજળીના પ્રવાહને નિયંત્રિત કરે છે',
    'electricity.switch.point2': 'ON = સર્કિટ બંધ, પ્રવાહ વહે છે',
    'electricity.switch.point3': 'OFF = સર્કિટ ખુલ્લું, કોઈ પ્રવાહ નથી',
    'electricity.switch.point4': 'સર્કિટમાં ક્યાંય પણ મૂકી શકાય છે',
    'electricity.switch.point5': 'ઉપકરણોને સુરક્ષિત રીતે ઉપયોગ કરવા યોગ્ય બનાવે છે',
    'electricity.switch.point6': 'વીજળીની બરબાદીને અટકાવે છે',
    'electricity.switch.on': 'સ્વીચ ચાલુ',
    'electricity.switch.off': 'સ્વીચ બંધ',
    'electricity.switch.bulbOn': 'બલ્બ ચાલુ',
    'electricity.switch.bulbOff': 'બલ્બ બંધ',
    'electricity.switch.gap': 'અંતર',
    'electricity.switch.whenOn': 'જ્યારે સ્વીચ ON હોય, સર્કિટ પૂર્ણ હોય અને બલ્બ ચમકે છે',
    'electricity.switch.whenOff': 'જ્યારે સ્વીચ OFF હોય, સર્કિટ તૂટી જાય છે અને બલ્બ ચમકતું નથી',
    'electricity.definition': 'વ્યાખ્યા',
    'demo.stepType.explanation': 'સમજૂતી',
    'demo.stepType.visualization': 'દ્રશ્ય',
    'demo.stepType.interaction': 'અન્યોન્યક્રિયા',
    'demo.unknownType': 'અજ્ઞાત પગલું પ્રકાર',
    'demo.intro.title': 'ઇલેક્ટ્રિક સર્કિટનો પરિચય',
    'demo.intro.desc': 'જાણો કે ટોર્ચલાઇટ ઇલેક્ટ્રિક સેલ અને લેમ્પ સાથે કેવી રીતે કામ કરે છે',
    'demo.intro.note': 'પ્રવાહ વહેવા માટે સંપૂર્ણ સર્કિટ જરૂરી છે',
    'demo.cell.title': 'ઇલેક્ટ્રિક સેલ',
    'demo.cell.desc': 'ઇલેક્ટ્રિક સેલના બે ટર્મિનલ છે: પોઝિટિવ (+) અને નેગેટિવ (-)',
    'demo.complete.title': 'સંપૂર્ણ સર્કિટ',
    'demo.complete.desc': 'સંપૂર્ણ સર્કિટ બનાવવા માટે સેલ, તાર, સ્વીચ અને લેમ્પને જોડો',
    'demo.complete.hint': 'સર્કિટને બંધ કરવા માટે સ્વીચ પર ક્લિક કરો',
    'realworld.cooking': 'રસોઈ',
    'realworld.lighting': 'પ્રકાશ',
    'realworld.transportation': 'પરિવહન',
    'realworld.heating': 'હીટિંગ અને કૂલિંગ',
    'realworld.entertainment': 'મનોરંજન',
    'realworld.communication': 'સંચાર',
    'realworld.desc.cooking': 'વીજળી વિવિધ રસોઈ ઉપકરણોને શક્તિ આપે છે',
    'realworld.desc.lighting': 'આપણા ઘરો અને શેરીઓને પ્રકાશિત કરવી',
    'realworld.desc.transportation': 'ઇલેક્ટ્રિક વાહનો અને જાહેર પરિવહન',
    'realworld.desc.heating': 'ઇમારતોમાં આબોહવા નિયંત્રણ',
    'realworld.desc.entertainment': 'આપણા મનોરંજન ઉપકરણોને શક્તિ આપવી',
    'realworld.desc.communication': 'વિશ્વભરના લોકોને જોડવા',
    'realworld.example.cooking.stove': 'ઇલેક્ટ્રિક સ્ટોવ',
    'realworld.example.cooking.microwave': 'માઇક્રોવેવ ઓવન',
    'realworld.example.cooking.kettle': 'ઇલેક્ટ્રિક કેટલી',
    'realworld.example.cooking.toaster': 'ટોસ્ટર',
    'realworld.example.lighting.bulbs': 'LED બલ્બ',
    'realworld.example.lighting.street': 'સ્ટ્રીટ લાઇટ',
    'realworld.example.lighting.flashlight': 'ટોર્ચ',
    'realworld.example.lighting.lamp': 'લેમ્પ',
    'realworld.example.transportation.cars': 'ઇલેક્ટ્રિક કાર',
    'realworld.example.transportation.trains': 'ટ્રેન',
    'realworld.example.transportation.trams': 'ટ્રામ',
    'realworld.example.transportation.ebikes': 'ઇ-બાઇક',
    'realworld.example.heating.ac': 'એર કન્ડિશનર',
    'realworld.example.heating.heater': 'હીટર',
    'realworld.example.heating.blanket': 'ઇલેક્ટ્રિક કંબળ',
    'realworld.example.heating.fan': 'પંખા',
    'realworld.example.entertainment.tv': 'ટેલિવિઝન',
    'realworld.example.entertainment.computer': 'કમ્પ્યુટર',
    'realworld.example.entertainment.console': 'ગેમિંગ કન્સોલ',
    'realworld.example.entertainment.speakers': 'સ્પીકર',
    'realworld.example.communication.phones': 'મોબાઇલ ફોન',
    'realworld.example.communication.router': 'ઇન્ટરનેટ રાઉટર',
    'realworld.example.communication.radio': 'રેડિયો',
    'realworld.example.communication.satellite': 'ઉપગ્રહ',
  },
};

// ============================================================================
// LANGUAGE CONTEXT
// ============================================================================

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (date: Date | number, options?: Intl.DateTimeFormatOptions) => string;
  formatCurrency: (value: number, currency?: string) => string;
  locale: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const languageToLocale: Record<Language, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  gu: 'gu-IN',
};

const missingKeys = new Set<string>();
const missingKeysLog: Record<string, string[]> = {};

const logMissingKey = (key: string, language: Language) => {
  if (!missingKeysLog[language]) {
    missingKeysLog[language] = [];
  }
  if (!missingKeysLog[language].includes(key)) {
    missingKeysLog[language].push(key);
    console.warn(`[i18n] Missing translation key: "${key}" for language: ${language}`);
  }
  missingKeys.add(key);
};

const getLanguageFromURL = (): Language | null => {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang');
  if (lang === 'hi' || lang === 'gu' || lang === 'en') {
    return lang as Language;
  }
  return null;
};

const getLanguageFromStorage = (): Language | null => {
  try {
    const stored = localStorage.getItem('app-language');
    if (stored === 'hi' || stored === 'gu' || stored === 'en') {
      return stored as Language;
    }
  } catch (e) {
    console.warn('Failed to read language from localStorage:', e);
  }
  return null;
};

const getInitialLanguage = (): Language => {
  return getLanguageFromURL() || getLanguageFromStorage() || 'en';
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('app-language', lang);
    } catch (e) {
      console.warn('Failed to save language to localStorage:', e);
    }

    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url.toString());

    document.documentElement.lang = lang;
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      try {
        const langFromURL = getLanguageFromURL();
        if (langFromURL && langFromURL !== language) {
          setLanguage(langFromURL);
        }
      } catch (error) {
        // Suppress browser extension errors
        if (error instanceof Error && error.message.includes('message port')) {
          return;
        }
        console.warn('Error handling popstate:', error);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      try {
        window.removeEventListener('popstate', handlePopState);
      } catch (error) {
        // Suppress browser extension errors
        if (error instanceof Error && error.message.includes('message port')) {
          return;
        }
      }
    };
  }, [language, setLanguage]);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language]?.[key];
    
    if (!translation) {
      translation = translations.en?.[key];
      if (!translation) {
        logMissingKey(key, language);
        return key;
      }
      if (language !== 'en') {
        console.warn(`[i18n] Using English fallback for key: "${key}" in language: ${language}`);
      }
    }

    if (params) {
      return translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return translation;
  }, [language]);

  const formatNumber = useCallback((value: number, options?: Intl.NumberFormatOptions): string => {
    const locale = languageToLocale[language];
    return new Intl.NumberFormat(locale, options).format(value);
  }, [language]);

  const formatDate = useCallback((date: Date | number, options?: Intl.DateTimeFormatOptions): string => {
    const locale = languageToLocale[language];
    const dateObj = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  }, [language]);

  const formatCurrency = useCallback((value: number, currency: string = 'INR'): string => {
    const locale = languageToLocale[language];
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  }, [language]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      (window as any).__i18nMissingKeys = missingKeysLog;
      (window as any).__getMissingKeys = () => {
        console.table(missingKeysLog);
        return missingKeysLog;
      };
    }
  }, []);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    formatNumber,
    formatDate,
    formatCurrency,
    locale: languageToLocale[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const getMissingTranslationKeys = (): Record<string, string[]> => {
  return { ...missingKeysLog };
};

// ============================================================================
// MODE CONTEXT
// ============================================================================

type ModeType = 'demonstration' | 'practice';

interface ModeContextType {
  currentMode: ModeType;
  setCurrentMode: (mode: ModeType) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentMode, setCurrentMode] = useState<ModeType>('demonstration');

  return (
    <ModeContext.Provider value={{ currentMode, setCurrentMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within ModeProvider');
  }
  return context;
};

// ============================================================================
// SAMPLE DATA
// ============================================================================

export const sampleCircuitData: CircuitToolData = {
  tool_type: 'circuit_visualization',
  session_id: 'session_001',
  mode: 'mixed',
  demonstration: {
    steps: [
      {
        step_number: 1,
        title: 'demo.intro.title',
        description: 'demo.intro.desc',
        type: 'explanation',
        visual_state: {
          components: [],
          circuit_complete: false,
          current_flowing: false,
        },
        learning_notes: 'demo.intro.note',
        completion_criteria: { type: 'user_confirm' },
      },
      {
        step_number: 2,
        title: 'demo.cell.title',
        description: 'demo.cell.desc',
        type: 'visualization',
        visual_state: {
          components: [
            {
              id: 'cell1',
              type: 'cell',
              position: { x: 100, y: 200 },
              connections: [],
              state: 'off',
            },
          ],
          circuit_complete: false,
          current_flowing: false,
        },
        completion_criteria: { type: 'automatic' },
      },
      {
        step_number: 3,
        title: 'demo.complete.title',
        description: 'demo.complete.desc',
        type: 'interaction',
        visual_state: {
          components: [
            {
              id: 'cell2',
              type: 'cell',
              position: { x: 150, y: 150 },
              connections: ['wire1'],
              state: 'off',
            },
            {
              id: 'wire1',
              type: 'wire',
              position: { x: 250, y: 150 },
              connections: ['cell2', 'switch1'],
            },
            {
              id: 'switch1',
              type: 'switch',
              position: { x: 350, y: 150 },
              connections: ['wire1', 'wire2'],
              state: 'open',
            },
            {
              id: 'wire2',
              type: 'wire',
              position: { x: 450, y: 150 },
              connections: ['switch1', 'lamp1'],
            },
            {
              id: 'lamp1',
              type: 'lamp',
              position: { x: 550, y: 150 },
              connections: ['wire2', 'wire3'],
              state: 'off',
            },
            {
              id: 'wire3',
              type: 'wire',
              position: { x: 650, y: 150 },
              connections: ['lamp1', 'cell2'],
            },
          ],
          circuit_complete: true,
          current_flowing: false,
        },
        interactions: [
          {
            type: 'click',
            target: 'switch1',
            hint: 'demo.complete.hint',
          },
        ],
        completion_criteria: { type: 'user_confirm' },
      },
    ],
    auto_progression: false,
    step_duration: 3000,
  },
  practice: {
    exercises: [],
    session_config: {
      max_exercises: 5,
      difficulty_adaptation: true,
      immediate_feedback: true,
    },
  },
  student_context: {
    current_level: 'beginner',
    learning_preferences: ['visual', 'interactive'],
  },
  metadata: {
    learning_objectives: [
      'objective.1',
      'objective.2',
      'objective.3',
      'objective.4',
    ],
    estimated_duration: 600,
    prerequisite_skills: [],
    difficulty_level: 'beginner',
  },
};

// ============================================================================
// CIRCUIT COMPONENTS
// ============================================================================

interface BatteryProps {
  x: number;
  y: number;
  onClick?: () => void;
  interactive?: boolean;
}

export const Battery: React.FC<BatteryProps> = ({ x, y, onClick, interactive }) => {
  const { t } = useLanguage();
  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
    >
      <rect x="-30" y="-30" width="30" height="60" fill="#4a5568" rx="4" />
      <rect x="0" y="-30" width="30" height="60" fill="#4a5568" rx="4" />
      <circle cx="15" cy="-30" r="6" fill="#fbbf24" />
      <text x="15" y="-25" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
        +
      </text>
      <circle cx="-15" cy="30" r="6" fill="#374151" />
      <text x="-15" y="35" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
        -
      </text>
      <text x="0" y="50" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="500">
        {t('component.battery')}
      </text>
    </g>
  );
};

interface ElectricCellProps {
  x: number;
  y: number;
  onClick?: () => void;
  interactive?: boolean;
}

export const ElectricCell: React.FC<ElectricCellProps> = ({ x, y, onClick, interactive }) => {
  const { t } = useLanguage();
  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
    >
      <rect x="-20" y="-30" width="40" height="60" fill="#4a5568" rx="4" />
      <circle cx="0" cy="-30" r="8" fill="#fbbf24" />
      <text x="0" y="-25" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
        +
      </text>
      <circle cx="0" cy="30" r="8" fill="#374151" />
      <text x="0" y="35" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
        -
      </text>
      <text x="0" y="50" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="500">
        {t('component.cell')}
      </text>
    </g>
  );
};

interface LampProps {
  x: number;
  y: number;
  glowing?: boolean;
  onClick?: () => void;
  interactive?: boolean;
}

export const Lamp: React.FC<LampProps> = ({ x, y, glowing, onClick, interactive }) => {
  const { t } = useLanguage();
  const fillColor = glowing ? '#fbbf24' : '#e5e7eb';
  const glowEffect = glowing ? 'lamp-glow' : '';

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
      className={glowEffect}
    >
      <circle cx="0" cy="0" r="25" fill={fillColor} stroke="#374151" strokeWidth="2" opacity={glowing ? 0.9 : 0.6} />
      <path
        d="M -10 -5 L 10 5 M 10 -5 L -10 5"
        stroke="#4a5568"
        strokeWidth="2"
        opacity={glowing ? 0.3 : 1}
      />
      <rect x="-8" y="20" width="16" height="8" fill="#6b7280" rx="2" />
      <circle cx="-12" cy="24" r="3" fill="#374151" />
      <circle cx="12" cy="24" r="3" fill="#374151" />
      <text x="0" y="45" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="500">
        {t('component.lamp')}
      </text>
      {glowing && (
        <circle cx="0" cy="0" r="35" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3">
          <animate attributeName="r" values="25;35;25" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  );
};

interface LEDProps {
  x: number;
  y: number;
  glowing?: boolean;
  polarity?: 'correct' | 'incorrect' | 'neutral';
  onClick?: () => void;
  interactive?: boolean;
}

export const LED: React.FC<LEDProps> = ({ x, y, glowing, polarity, onClick, interactive }) => {
  const { t } = useLanguage();
  const fillColor = glowing && polarity === 'correct' ? '#10b981' : '#e5e7eb';
  const borderColor = polarity === 'incorrect' ? '#ef4444' : '#374151';

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
    >
      <polygon
        points="0,-20 15,20 -15,20"
        fill={fillColor}
        stroke={borderColor}
        strokeWidth="2"
        opacity={glowing ? 0.9 : 0.6}
      />
      <line x1="0" y1="-20" x2="0" y2="-35" stroke="#374151" strokeWidth="3" />
      <text x="5" y="-30" fill="#374151" fontSize="10" fontWeight="500">+</text>
      <line x1="-8" y1="20" x2="-8" y2="30" stroke="#374151" strokeWidth="2" />
      <text x="-12" y="35" fill="#374151" fontSize="10" fontWeight="500">-</text>
      <path
        d="M -5 -10 L 5 0 M 5 -10 L -5 0"
        stroke="#4a5568"
        strokeWidth="1.5"
        opacity={glowing ? 0.5 : 1}
      />
      <text x="0" y="50" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="500">
        {t('component.led')}
      </text>
      {glowing && polarity === 'correct' && (
        <circle cx="0" cy="0" r="30" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.3">
          <animate attributeName="r" values="20;30;20" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  );
};

interface SwitchProps {
  x: number;
  y: number;
  state?: 'open' | 'closed' | 'on' | 'off';
  closed?: boolean;
  onClick?: () => void;
  interactive?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ x, y, state, closed, onClick, interactive }) => {
  const { t } = useLanguage();
  const isClosed = closed || state === 'closed' || state === 'on';

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
    >
      <rect x="-15" y="-5" width="30" height="10" fill="#6b7280" rx="2" />
      <circle cx="-10" cy="0" r="4" fill={isClosed ? '#10b981' : '#ef4444'} />
      <circle cx="10" cy="0" r="4" fill={isClosed ? '#10b981' : '#ef4444'} />
      <line
        x1="-10"
        y1="0"
        x2="10"
        y2={isClosed ? "0" : "-8"}
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <text x="-10" y="-15" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="500">
        {isClosed ? t('component.on') : t('component.off')}
      </text>
      <text x="0" y="25" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="500">
        {t('component.switch')}
      </text>
    </g>
  );
};

interface WireProps {
  x: number;
  y: number;
  onClick?: () => void;
  interactive?: boolean;
}

export const Wire: React.FC<WireProps> = ({ x, y, onClick, interactive }) => {
  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
    >
      <line
        x1="0"
        y1="0"
        x2="100"
        y2="0"
        stroke="#4a5568"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="0"
        y1="0"
        x2="100"
        y2="0"
        stroke="#9ca3af"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.3"
      />
    </g>
  );
};

// ============================================================================
// MAIN COMPONENTS
// ============================================================================

interface CircuitCanvasProps {
  components: CircuitComponent[];
  circuitComplete: boolean;
  currentFlowing: boolean;
  onComponentClick?: (componentId: string) => void;
  interactive?: boolean;
}

export const CircuitCanvas: React.FC<CircuitCanvasProps> = ({
  components,
  circuitComplete,
  currentFlowing,
  onComponentClick,
  interactive = false,
}) => {
  const { t } = useLanguage();
  const renderComponent = (component: CircuitComponent) => {
    const commonProps = {
      key: component.id,
      x: component.position.x,
      y: component.position.y,
      onClick: () => onComponentClick?.(component.id),
      interactive,
    };

    switch (component.type) {
      case 'cell':
        return <ElectricCell {...commonProps} />;
      case 'battery':
        return <Battery {...commonProps} />;
      case 'lamp':
        return (
          <Lamp
            {...commonProps}
            glowing={currentFlowing && circuitComplete}
          />
        );
      case 'led':
        return (
          <LED
            {...commonProps}
            glowing={currentFlowing && circuitComplete}
            polarity={component.polarity}
          />
        );
      case 'switch':
        return (
          <Switch
            {...commonProps}
            state={component.state}
            closed={component.state === 'closed'}
          />
        );
      case 'wire':
        return <Wire {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden">
      {components.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-500 px-4 pointer-events-none">
          <div className="text-4xl mb-3">🔌</div>
          <p className="font-semibold text-gray-700">{t('practice.noComponents.title')}</p>
          <p className="text-sm text-gray-500 mt-1">{t('practice.noComponents.desc')}</p>
        </div>
      )}
      <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
        {components
          .filter((c) => c.type === 'wire')
          .map((component) => renderComponent(component))}
        {components
          .filter((c) => c.type !== 'wire')
          .map((component) => renderComponent(component))}
      </svg>
      <div className="absolute top-4 right-4">
        <div
          className={`px-4 py-2 rounded-lg text-white font-semibold ${
            circuitComplete && currentFlowing
              ? 'bg-green-500'
              : circuitComplete
              ? 'bg-yellow-500'
              : 'bg-red-500'
          }`}
        >
          {circuitComplete && currentFlowing
            ? `⚡ ${t('common.status.flowing')}`
            : circuitComplete
            ? `🔌 ${t('common.status.complete')}`
            : `❌ ${t('common.status.incomplete')}`}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// LANGUAGE SELECTOR
// ============================================================================

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  ];

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="appearance-none bg-white border-2 border-teal-500 rounded-lg px-4 py-2 pr-8 w-48 text-teal-700 font-medium cursor-pointer hover:border-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <svg className="fill-current h-4 w-4 text-teal-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

// ============================================================================
// NAVBAR
// ============================================================================

export const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { currentMode, setCurrentMode } = useMode();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const isApplicationsPage = location.pathname === '/applications';

  const handleModeClick = (mode: 'demonstration' | 'practice') => {
    if (isHomePage) {
      setCurrentMode(mode);
    } else {
      navigate('/');
      setTimeout(() => setCurrentMode(mode), 0);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-teal-50 via-purple-50 to-teal-50 border-b border-teal-200/50 shadow-sm backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
              ⚡ {t('nav.logo')}
            </Link>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            {isHomePage ? (
              <button
                onClick={() => handleModeClick('demonstration')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentMode === 'demonstration'
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'text-teal-700 hover:bg-teal-100/50'
                }`}
              >
                📚 {t('nav.learn')}
              </button>
            ) : (
              <Link
                to="/"
                className="px-4 py-2 rounded-lg font-medium text-teal-700 hover:bg-teal-100/50 transition-all duration-200"
              >
                📚 {t('nav.learn')}
              </Link>
            )}
            {isHomePage ? (
              <button
                onClick={() => handleModeClick('practice')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentMode === 'practice'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-purple-700 hover:bg-purple-100/50'
                }`}
              >
                🎯 {t('nav.practice')}
              </button>
            ) : (
              <Link
                to="/"
                className="px-4 py-2 rounded-lg font-medium text-purple-700 hover:bg-purple-100/50 transition-all duration-200"
              >
                🎯 {t('nav.practice')}
              </Link>
            )}
            <Link
              to="/applications"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isApplicationsPage
                  ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100/50'
              }`}
            >
              🌍 {t('nav.applications')}
            </Link>
            <div className="ml-2 md:ml-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// ============================================================================
// DEMONSTRATION MODE
// ============================================================================

interface DemonstrationModeProps {
  steps: DemonstrationStep[];
  currentStep: number;
  isPlaying: boolean;
  ui_config: CircuitUIConfig;
  onStepComplete: () => void;
}

export const DemonstrationMode: React.FC<DemonstrationModeProps> = ({
  steps,
  currentStep,
  isPlaying,
  ui_config,
  onStepComplete,
}) => {
  const { t } = useLanguage();
  
  const currentStepData = steps[currentStep];
  const stepTypeLabel = currentStepData?.type
    ? t(`demo.stepType.${currentStepData.type}`) || currentStepData.type
    : '';

  useEffect(() => {
    if (isPlaying && currentStepData?.completion_criteria?.type === 'automatic') {
      const timer = setTimeout(() => {
        onStepComplete();
      }, ui_config.step_duration);
      
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, ui_config.step_duration, onStepComplete, currentStepData]);

  const handleInteraction = (_componentId: string) => {
    if (currentStepData?.completion_criteria?.type === 'user_confirm') {
      onStepComplete();
    }
  };

  const renderStepContent = () => {
    if (!currentStepData) return null;
    
    switch (currentStepData.type) {
      case 'explanation':
        return (
          <div className="explanation-step p-6 bg-gradient-to-br from-teal-50 to-purple-50 rounded-lg animate-fade-in">
            <h3 className="text-2xl font-semibold text-teal-800 mb-4">
              {t(currentStepData.title) || currentStepData.title}
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              {t(currentStepData.description) || currentStepData.description}
            </p>
            {currentStepData.learning_notes && (
              <div className="mt-4 p-4 bg-teal-100 rounded-lg border-l-4 border-teal-500">
                <p className="text-sm text-teal-800 font-medium">{t(currentStepData.learning_notes) || currentStepData.learning_notes}</p>
              </div>
            )}
            {currentStepData.completion_criteria?.type === 'user_confirm' && (
              <button
                onClick={() => handleInteraction('')}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-lg hover:from-teal-600 hover:to-purple-600 transition-all font-semibold"
              >
                {t('common.gotIt')} {t('common.continue')} →
              </button>
            )}
          </div>
        );
      case 'visualization':
        return (
          <div className="visualization-step animate-fade-in">
            <h3 className="text-2xl font-semibold text-purple-800 mb-4">
              {t(currentStepData.title) || currentStepData.title}
            </h3>
            <CircuitCanvas
              components={currentStepData.visual_state.components}
              circuitComplete={currentStepData.visual_state.circuit_complete}
              currentFlowing={currentStepData.visual_state.current_flowing}
              onComponentClick={handleInteraction}
              interactive={true}
            />
            <p className="text-gray-600 mt-4 text-lg">{t(currentStepData.description) || currentStepData.description}</p>
          </div>
        );
      case 'interaction':
        return (
          <div className="interaction-step p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg animate-fade-in">
            <h3 className="text-2xl font-semibold text-green-800 mb-3">
              {t(currentStepData.title) || currentStepData.title}
            </h3>
            <p className="text-green-700 mb-6 text-lg">{t(currentStepData.description) || currentStepData.description}</p>
            <CircuitCanvas
              components={currentStepData.visual_state.components}
              circuitComplete={currentStepData.visual_state.circuit_complete}
              currentFlowing={currentStepData.visual_state.current_flowing}
              onComponentClick={handleInteraction}
              interactive={true}
            />
            {currentStepData.interactions?.some(i => i.hint) && (
              <div className="hints mt-6 p-4 bg-yellow-100 rounded-lg border border-yellow-300">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 {t('common.hint')}:</h4>
                {currentStepData.interactions?.map((interaction, index) => 
                  interaction.hint && (
                    <p key={index} className="text-sm text-yellow-700 mt-1">
                      • {t(interaction.hint) || interaction.hint}
                    </p>
                  )
                )}
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="unknown-step p-6 bg-gray-100 rounded-lg">
            <p>{t('demo.unknownType')}: {currentStepData.type}</p>
          </div>
        );
    }
  };
  
  return (
    <div className="demonstration-mode">
      <div className="step-indicator mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 font-medium">
            {t('practice.exercise')} {currentStep + 1} {t('practice.of')} {steps.length}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentStepData?.type === 'explanation' ? 'bg-teal-100 text-teal-800' :
            currentStepData?.type === 'visualization' ? 'bg-purple-100 text-purple-800' :
            currentStepData?.type === 'interaction' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {stepTypeLabel}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-teal-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
      {renderStepContent()}
      {currentStepData?.common_mistakes && currentStepData.common_mistakes.length > 0 && (
        <div className="common-mistakes mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-2">⚠️ {t('common.mistakesTitle')}</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {currentStepData.common_mistakes.map((mistake, index) => (
              <li key={index}>• {t(mistake) || mistake}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// CIRCUIT VISUALIZATION
// ============================================================================

export const CircuitVisualization: React.FC<CircuitToolProps> = ({
  data,
  title,
  ui_config: _ui_config,
  onStepChange: _onStepChange,
  onPracticeComplete: _onPracticeComplete,
  onProgress,
  onReset: _onReset,
  currentStep = 0,
}) => {
  const { t } = useLanguage();
  const { currentMode: contextMode } = useMode();
  const [localMode] = useState<Mode>(
    data.mode === 'mixed' ? 'demonstration' : data.mode
  );

  const currentMode: 'demonstration' | 'practice' = data.mode === 'mixed'
    ? contextMode
    : (localMode === 'demonstration' || localMode === 'practice' ? localMode : 'demonstration');
  const [currentStepIndex, setCurrentStepIndex] = useState(currentStep);
  const [studentProgress, setStudentProgress] = useState<ProgressData>({
    current_step: currentStep,
    total_steps: data.demonstration?.steps.length || 0,
    completion_percentage: 0,
    time_spent: 0,
    exercises_completed: 0,
    current_difficulty: data.student_context.current_level,
    mastery_indicators: [],
  });

  useEffect(() => {
    if (data.mode === 'mixed' && contextMode !== currentMode) {
      if (contextMode === 'practice') {
        setCurrentStepIndex(0);
      }
    }
  }, [contextMode, data.mode, currentMode]);

  const calculateCompletionPercentage = useCallback(() => {
    const totalSteps = data.demonstration?.steps.length || 0;
    if (currentMode === 'demonstration') {
      return totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;
    }
    return 0;
  }, [currentMode, currentStepIndex, data.demonstration?.steps.length]);

  React.useEffect(() => {
    const totalSteps = data.demonstration?.steps.length || 0;
    const completionPercentage = calculateCompletionPercentage();
    const progress: ProgressData = {
      current_step: currentStepIndex,
      total_steps: totalSteps,
      completion_percentage: completionPercentage,
      time_spent: studentProgress.time_spent,
      exercises_completed: studentProgress.exercises_completed,
      current_difficulty: data.student_context.current_level,
      mastery_indicators: [],
    };
    setStudentProgress(progress);
    if (onProgress) onProgress(progress);
  }, [currentStepIndex, calculateCompletionPercentage]);

  if (currentMode === 'demonstration') {
    return <ElectricityLearningApp />;
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {currentMode !== 'practice' && (
          <>
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-teal-700 mb-2">{t(title) || title}</h1>
            </div>
            <div className="mb-6 p-4 bg-teal-50 rounded-lg border border-teal-200 animate-fade-in">
              <h3 className="font-semibold text-teal-800 mb-2">{t('objective.1')}</h3>
              <ul className="text-sm text-teal-700 space-y-1">
                {data.metadata.learning_objectives.map((objective, index) => (
                  <li key={index}>• {t(objective) || objective}</li>
                ))}
              </ul>
            </div>
          </>
        )}
        <div className="mb-6 bg-white rounded-lg shadow-lg p-6 animate-fade-in">
          {currentMode === 'practice' ? (
            <PracticeMode />
          ) : <ElectricityLearningApp />}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ELECTRICITY LEARNING APP
// ============================================================================
// ============================================================================
// ELECTRICITY LEARNING APP
// ============================================================================

type LessonType = 'cell' | 'battery' | 'lamps' | 'circuit' | 'switch';

interface Lesson {
  id: LessonType;
  titleKey: string;
  iconKey: string;
  definitionKey: string;
  keyPointsKey: string;
  keyPointKeys: string[];
}

export const ElectricityLearningApp: React.FC = () => {
  const { t } = useLanguage();
  const [activeLesson, setActiveLesson] = useState<LessonType>('cell');

  const lessons: Record<LessonType, Lesson> = {
    cell: {
      id: 'cell',
      titleKey: 'electricity.cell.title',
      iconKey: 'electricity.cell.icon',
      definitionKey: 'electricity.cell.definition',
      keyPointsKey: 'electricity.cell.keyPoints',
      keyPointKeys: [
        'electricity.cell.point1',
        'electricity.cell.point2',
        'electricity.cell.point3',
        'electricity.cell.point4',
        'electricity.cell.point5',
        'electricity.cell.point6'
      ]
    },
    battery: {
      id: 'battery',
      titleKey: 'electricity.battery.title',
      iconKey: 'electricity.battery.icon',
      definitionKey: 'electricity.battery.definition',
      keyPointsKey: 'electricity.battery.keyPoints',
      keyPointKeys: [
        'electricity.battery.point1',
        'electricity.battery.point2',
        'electricity.battery.point3',
        'electricity.battery.point4',
        'electricity.battery.point5',
        'electricity.battery.point6'
      ]
    },
    lamps: {
      id: 'lamps',
      titleKey: 'electricity.lamps.title',
      iconKey: 'electricity.lamps.icon',
      definitionKey: 'electricity.lamps.definition',
      keyPointsKey: 'electricity.lamps.keyPoints',
      keyPointKeys: [
        'electricity.lamps.point1',
        'electricity.lamps.point2',
        'electricity.lamps.point3',
        'electricity.lamps.point4',
        'electricity.lamps.point5',
        'electricity.lamps.point6'
      ]
    },
    circuit: {
      id: 'circuit',
      titleKey: 'electricity.circuit.title',
      iconKey: 'electricity.circuit.icon',
      definitionKey: 'electricity.circuit.definition',
      keyPointsKey: 'electricity.circuit.keyPoints',
      keyPointKeys: [
        'electricity.circuit.point1',
        'electricity.circuit.point2',
        'electricity.circuit.point3',
        'electricity.circuit.point4',
        'electricity.circuit.point5',
        'electricity.circuit.point6'
      ]
    },
    switch: {
      id: 'switch',
      titleKey: 'electricity.switch.title',
      iconKey: 'electricity.switch.icon',
      definitionKey: 'electricity.switch.definition',
      keyPointsKey: 'electricity.switch.keyPoints',
      keyPointKeys: [
        'electricity.switch.point1',
        'electricity.switch.point2',
        'electricity.switch.point3',
        'electricity.switch.point4',
        'electricity.switch.point5',
        'electricity.switch.point6'
      ]
    }
  };

  const currentLesson = lessons[activeLesson];

  const CellDiagram = () => (
    <svg width="300" height="240" viewBox="0 0 300 240">
      <defs>
        <linearGradient id="cellGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#e74c3c', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#c0392b', stopOpacity: 1 }} />
        </linearGradient>
        <marker id="arrowred" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#e74c3c" />
        </marker>
        <marker id="arrowgray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#34495e" />
        </marker>
      </defs>
      <rect x="110" y="70" width="80" height="100" fill="url(#cellGrad)" stroke="#000" strokeWidth="3" rx="8" />
      <rect x="130" y="50" width="40" height="20" fill="#95a5a6" stroke="#000" strokeWidth="2" rx="3" />
      <text x="150" y="40" fontSize="24" fontWeight="bold" fill="#e74c3c" textAnchor="middle">+</text>
      <rect x="135" y="170" width="30" height="8" fill="#34495e" stroke="#000" strokeWidth="2" />
      <text x="150" y="200" fontSize="24" fontWeight="bold" fill="#34495e" textAnchor="middle">−</text>
      <text x="150" y="125" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle">1.5V</text>
      <text x="100" y="65" fontSize="14" fill="#e74c3c" textAnchor="end" fontWeight="500">{t('electricity.metalCap')}</text>
      <line x1="105" y1="60" x2="128" y2="60" stroke="#e74c3c" strokeWidth="2" markerEnd="url(#arrowred)" />
      <text x="210" y="180" fontSize="14" fill="#34495e" textAnchor="start" fontWeight="500">{t('electricity.flatDisc')}</text>
      <line x1="205" y1="175" x2="165" y2="175" stroke="#34495e" strokeWidth="2" markerEnd="url(#arrowgray)" />
    </svg>
  );

  const BatteryDiagram = () => (
    <svg width="300" height="200" viewBox="0 0 300 200">
      <g transform="translate(40, 70)">
        <rect x="0" y="0" width="50" height="80" fill="#e74c3c" stroke="#000" strokeWidth="2" rx="5" />
        <text x="25" y="45" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">{t('electricity.battery.cell', { number: '1' })}</text>
        <text x="25" y="-10" fontSize="16" fontWeight="bold" fill="#e74c3c">+</text>
        <text x="25" y="100" fontSize="16" fontWeight="bold" fill="#34495e">−</text>
      </g>
      <line x1="90" y1="150" x2="110" y2="150" stroke="#ff9800" strokeWidth="4" />
      <g transform="translate(110, 70)">
        <rect x="0" y="0" width="50" height="80" fill="#e74c3c" stroke="#000" strokeWidth="2" rx="5" />
        <text x="25" y="45" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">{t('electricity.battery.cell', { number: '2' })}</text>
        <text x="25" y="-10" fontSize="16" fontWeight="bold" fill="#e74c3c">+</text>
        <text x="25" y="100" fontSize="16" fontWeight="bold" fill="#34495e">−</text>
      </g>
      <line x1="160" y1="150" x2="180" y2="150" stroke="#ff9800" strokeWidth="4" />
      <g transform="translate(180, 70)">
        <rect x="0" y="0" width="50" height="80" fill="#e74c3c" stroke="#000" strokeWidth="2" rx="5" />
        <text x="25" y="45" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">{t('electricity.battery.cell', { number: '3' })}</text>
        <text x="25" y="-10" fontSize="16" fontWeight="bold" fill="#e74c3c">+</text>
        <text x="25" y="100" fontSize="16" fontWeight="bold" fill="#34495e">−</text>
      </g>
      <text x="150" y="30" fontSize="16" fontWeight="bold" fill="#2c3e50" textAnchor="middle">{t('electricity.battery.multipleCells')}</text>
      <text x="150" y="185" fontSize="14" fill="#27ae60" textAnchor="middle">{t('electricity.battery.totalVoltage')}</text>
    </svg>
  );

  const LampDiagram = () => (
    <svg width="250" height="250" viewBox="0 0 250 250">
      <circle cx="125" cy="100" r="60" fill="rgba(255, 235, 59, 0.3)" stroke="#000" strokeWidth="3" />
      <path d="M 110,80 Q 125,70 140,80 Q 125,90 110,80" fill="none" stroke="#ff6f00" strokeWidth="3" />
      <path d="M 110,100 Q 125,90 140,100 Q 125,110 110,100" fill="none" stroke="#ff6f00" strokeWidth="3" />
      <path d="M 110,120 Q 125,110 140,120 Q 125,130 110,120" fill="none" stroke="#ff6f00" strokeWidth="3" />
      <rect x="110" y="160" width="30" height="40" fill="#95a5a6" stroke="#000" strokeWidth="2" />
      <circle cx="125" cy="200" r="8" fill="#7f8c8d" stroke="#000" strokeWidth="2" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 125 + Math.cos(rad) * 70;
        const y1 = 100 + Math.sin(rad) * 70;
        const x2 = 125 + Math.cos(rad) * 85;
        const y2 = 100 + Math.sin(rad) * 85;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#ffeb3b"
            strokeWidth="3"
          />
        );
      })}
      <text x="125" y="230" fontSize="12" fill="#2c3e50" textAnchor="middle" fontWeight="bold">{t('electricity.lamp.filamentHeats')}</text>
      <text x="125" y="245" fontSize="12" fill="#2c3e50" textAnchor="middle" fontWeight="bold">{t('electricity.lamp.andGlows')}</text>
      <text x="20" y="100" fontSize="11" fill="#ff6f00">{t('electricity.lamp.tungsten')}</text>
      <text x="20" y="115" fontSize="11" fill="#ff6f00">{t('electricity.lamp.filament')}</text>
      <line x1="50" y1="105" x2="95" y2="105" stroke="#ff6f00" strokeWidth="2" markerEnd="url(#arrow)" />
    </svg>
  );

  const CircuitDiagram = () => (
    <svg width="450" height="320" viewBox="0 0 450 320">
      <g transform="translate(80, 130)">
        <line x1="0" y1="20" x2="0" y2="40" stroke="#000" strokeWidth="5" />
        <line x1="30" y1="15" x2="30" y2="45" stroke="#000" strokeWidth="5" />
        <line x1="50" y1="20" x2="50" y2="40" stroke="#000" strokeWidth="5" />
        <line x1="80" y1="15" x2="80" y2="45" stroke="#000" strokeWidth="5" />
        <text x="40" y="-5" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#2c3e50">{t('electricity.battery.label')}</text>
        <text x="-15" y="35" fontSize="18" fontWeight="bold" fill="#e74c3c">−</text>
        <text x="95" y="35" fontSize="18" fontWeight="bold" fill="#e74c3c">+</text>
      </g>
      <line x1="160" y1="160" x2="160" y2="80" stroke="#ff9800" strokeWidth="5" />
      <circle cx="160" cy="160" r="5" fill="#000" />
      <circle cx="160" cy="80" r="5" fill="#000" />
      <line x1="160" y1="80" x2="280" y2="80" stroke="#ff9800" strokeWidth="5" />
      <circle cx="280" cy="80" r="5" fill="#000" />
      <g transform="translate(280, 80)">
        <circle cx="0" cy="0" r="35" stroke="#000" strokeWidth="4" fill="#ffeb3b" opacity="0.5" />
        <line x1="-18" y1="-18" x2="18" y2="18" stroke="#000" strokeWidth="3" />
        <line x1="-18" y1="18" x2="18" y2="-18" stroke="#000" strokeWidth="3" />
        <text x="0" y="55" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#2c3e50">{t('electricity.circuit.bulb')}</text>
      </g>
      <circle cx="280" cy="115" r="5" fill="#000" />
      <line x1="280" y1="115" x2="280" y2="240" stroke="#ff9800" strokeWidth="5" />
      <circle cx="280" cy="240" r="5" fill="#000" />
      <line x1="280" y1="240" x2="80" y2="240" stroke="#ff9800" strokeWidth="5" />
      <circle cx="80" cy="240" r="5" fill="#000" />
      <line x1="80" y1="240" x2="80" y2="160" stroke="#ff9800" strokeWidth="5" />
      <circle cx="80" cy="160" r="5" fill="#000" />
      <g>
        <polygon points="220,80 215,75 215,85" fill="#e74c3c" />
        <text x="200" y="70" fontSize="13" fill="#e74c3c" fontWeight="bold">{t('electricity.circuit.currentFlow')}</text>
        <polygon points="280,180 275,175 285,175" fill="#e74c3c" />
        <polygon points="180,240 185,235 185,245" fill="#e74c3c" />
        <polygon points="80,200 75,205 85,205" fill="#e74c3c" />
      </g>
      <rect x="20" y="280" width="410" height="30" fill="#d5f4e6" stroke="#27ae60" strokeWidth="2" rx="5" />
      <text x="225" y="300" fontSize="13" textAnchor="middle" fill="#27ae60" fontWeight="bold">{t('electricity.circuit.completeCircuit')}</text>
    </svg>
  );

  const SwitchDiagram = () => (
    <svg width="400" height="350" viewBox="0 0 400 350">
      <g>
        <text x="100" y="30" fontSize="16" fontWeight="bold" fill="#27ae60">{t('electricity.switch.on')}</text>
        <g transform="translate(30, 60)">
          <line x1="0" y1="10" x2="0" y2="30" stroke="#000" strokeWidth="3" />
          <line x1="15" y1="7" x2="15" y2="33" stroke="#000" strokeWidth="3" />
        </g>
        <line x1="45" y1="75" x2="80" y2="75" stroke="#ff9800" strokeWidth="3" />
        <circle cx="80" cy="75" r="4" fill="#000" />
        <line x1="80" y1="75" x2="140" y2="75" stroke="#000" strokeWidth="3" />
        <circle cx="140" cy="75" r="4" fill="#000" />
        <line x1="140" y1="75" x2="180" y2="75" stroke="#ff9800" strokeWidth="3" />
        <circle cx="180" cy="75" r="15" stroke="#000" strokeWidth="2" fill="#ffeb3b" opacity="0.6" />
        <line x1="172" y1="67" x2="188" y2="83" stroke="#000" strokeWidth="2" />
        <line x1="172" y1="83" x2="188" y2="67" stroke="#000" strokeWidth="2" />
        <text x="210" y="80" fontSize="12" fill="#27ae60" fontWeight="bold">{t('electricity.switch.bulbOn')}</text>
      </g>
      <g transform="translate(0, 150)">
        <text x="100" y="30" fontSize="16" fontWeight="bold" fill="#e74c3c">{t('electricity.switch.off')}</text>
        <g transform="translate(30, 60)">
          <line x1="0" y1="10" x2="0" y2="30" stroke="#000" strokeWidth="3" />
          <line x1="15" y1="7" x2="15" y2="33" stroke="#000" strokeWidth="3" />
        </g>
        <line x1="45" y1="75" x2="80" y2="75" stroke="#ff9800" strokeWidth="3" />
        <circle cx="80" cy="75" r="4" fill="#000" />
        <line x1="80" y1="75" x2="130" y2="55" stroke="#000" strokeWidth="3" />
        <circle cx="140" cy="75" r="4" fill="#000" />
        <text x="105" y="50" fontSize="12" fill="#e74c3c" fontWeight="bold">{t('electricity.switch.gap')}</text>
        <line x1="140" y1="75" x2="180" y2="75" stroke="#ff9800" strokeWidth="3" />
        <circle cx="180" cy="75" r="15" stroke="#000" strokeWidth="2" fill="none" />
        <line x1="172" y1="67" x2="188" y2="83" stroke="#000" strokeWidth="2" />
        <line x1="172" y1="83" x2="188" y2="67" stroke="#000" strokeWidth="2" />
        <text x="210" y="80" fontSize="12" fill="#e74c3c" fontWeight="bold">{t('electricity.switch.bulbOff')}</text>
      </g>
      <rect x="10" y="310" width="380" height="35" fill="#e8f4f8" stroke="#3498db" strokeWidth="2" rx="5" />
      <text x="200" y="327" fontSize="11" textAnchor="middle" fill="#2c3e50">{t('electricity.switch.whenOn')}</text>
      <text x="200" y="340" fontSize="11" textAnchor="middle" fill="#2c3e50">{t('electricity.switch.whenOff')}</text>
    </svg>
  );

  const renderDiagram = () => {
    switch (activeLesson) {
      case 'cell':
        return <CellDiagram />;
      case 'battery':
        return <BatteryDiagram />;
      case 'lamps':
        return <LampDiagram />;
      case 'circuit':
        return <CircuitDiagram />;
      case 'switch':
        return <SwitchDiagram />;
      default:
        return <CellDiagram />;
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#e8eaf6'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          <span style={{
            fontSize: '1.1em',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            {t('electricity.lessons')}:
          </span>
          {Object.values(lessons).map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => setActiveLesson(lesson.id)}
              style={{
                padding: '12px 24px',
                backgroundColor: activeLesson === lesson.id ? '#3498db' : '#ecf0f1',
                color: activeLesson === lesson.id ? 'white' : '#2c3e50',
                border: 'none',
                borderRadius: '25px',
                fontSize: '1em',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: activeLesson === lesson.id ? '0 4px 8px rgba(52, 152, 219, 0.3)' : 'none'
              }}
              onMouseOver={(e) => {
                if (activeLesson !== lesson.id) {
                  e.currentTarget.style.backgroundColor = '#d5dbdb';
                }
              }}
              onMouseOut={(e) => {
                if (activeLesson !== lesson.id) {
                  e.currentTarget.style.backgroundColor = '#ecf0f1';
                }
              }}
            >
              <span style={{ fontSize: '1.2em' }}>{t(lesson.iconKey)}</span>
              <span>{t(`electricity.lesson.${lesson.id}`)}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          margin: '0 0 30px 0',
          color: '#2c3e50',
          fontSize: '2.5em',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <span style={{ fontSize: '1.2em' }}>{t(currentLesson.iconKey)}</span>
          {t(currentLesson.titleKey)}
        </h1>
        <div style={{
          backgroundColor: '#fef9e7',
          padding: '30px',
          borderRadius: '12px',
          border: '3px solid #f9e79f',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '30px'
        }}>
          {renderDiagram()}
        </div>
        <div style={{
          backgroundColor: '#e8f8f5',
          padding: '25px',
          borderRadius: '12px',
          marginBottom: '30px',
          border: '3px solid #a3e4d7'
        }}>
          <h3 style={{
            margin: '0 0 15px 0',
            color: '#138d75',
            fontSize: '1.4em',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            📖 {t('electricity.definition')}
          </h3>
          <p style={{
            margin: 0,
            fontSize: '1.1em',
            lineHeight: '1.8',
            color: '#2c3e50'
          }}>
            {t(currentLesson.definitionKey)}
          </p>
        </div>
        <div style={{
          backgroundColor: '#ebf5fb',
          padding: '25px',
          borderRadius: '12px',
          marginBottom: '30px',
          border: '3px solid #aed6f1'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            color: '#2874a6',
            fontSize: '1.4em',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            💡 {t(currentLesson.keyPointsKey)}
          </h3>
          <ul style={{
            margin: 0,
            paddingLeft: '25px',
            listStyle: 'none'
          }}>
            {currentLesson.keyPointKeys.map((pointKey, index) => (
              <li key={index} style={{
                marginBottom: '12px',
                fontSize: '1.05em',
                lineHeight: '1.6',
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{
                  color: '#3498db',
                  fontWeight: 'bold',
                  fontSize: '1.2em',
                  minWidth: '20px'
                }}>
                  •
                </span>
                <span>{t(pointKey)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// REAL WORLD APPLICATIONS
// ============================================================================

interface Application {
  id: string;
  icon: string;
  title: string;
  description: string;
  examples: string[];
  color: string;
}

export const RealWorldApplications: React.FC = () => {
  const { t } = useLanguage();

  const applications: Application[] = [
    {
      id: 'cooking',
      icon: '🍳',
      title: t('realworld.cooking'),
      description: t('realworld.desc.cooking'),
      examples: [
        t('realworld.example.cooking.stove'),
        t('realworld.example.cooking.microwave'),
        t('realworld.example.cooking.kettle'),
        t('realworld.example.cooking.toaster'),
      ],
      color: 'from-orange-400 to-red-500',
    },
    {
      id: 'lighting',
      icon: '💡',
      title: t('realworld.lighting'),
      description: t('realworld.desc.lighting'),
      examples: [
        t('realworld.example.lighting.bulbs'),
        t('realworld.example.lighting.street'),
        t('realworld.example.lighting.flashlight'),
        t('realworld.example.lighting.lamp'),
      ],
      color: 'from-yellow-400 to-orange-500',
    },
    {
      id: 'transportation',
      icon: '🚗',
      title: t('realworld.transportation'),
      description: t('realworld.desc.transportation'),
      examples: [
        t('realworld.example.transportation.cars'),
        t('realworld.example.transportation.trains'),
        t('realworld.example.transportation.trams'),
        t('realworld.example.transportation.ebikes'),
      ],
      color: 'from-blue-400 to-cyan-500',
    },
    {
      id: 'heating',
      icon: '❄️',
      title: t('realworld.heating'),
      description: t('realworld.desc.heating'),
      examples: [
        t('realworld.example.heating.ac'),
        t('realworld.example.heating.heater'),
        t('realworld.example.heating.blanket'),
        t('realworld.example.heating.fan'),
      ],
      color: 'from-cyan-400 to-blue-500',
    },
    {
      id: 'entertainment',
      icon: '📺',
      title: t('realworld.entertainment'),
      description: t('realworld.desc.entertainment'),
      examples: [
        t('realworld.example.entertainment.tv'),
        t('realworld.example.entertainment.computer'),
        t('realworld.example.entertainment.console'),
        t('realworld.example.entertainment.speakers'),
      ],
      color: 'from-purple-400 to-pink-500',
    },
    {
      id: 'communication',
      icon: '📱',
      title: t('realworld.communication'),
      description: t('realworld.desc.communication'),
      examples: [
        t('realworld.example.communication.phones'),
        t('realworld.example.communication.router'),
        t('realworld.example.communication.radio'),
        t('realworld.example.communication.satellite'),
      ],
      color: 'from-teal-400 to-green-500',
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-teal-50 via-purple-50 to-teal-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {applications.map((app, index) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`bg-gradient-to-r ${app.color} p-6 text-center`}>
                <div className="text-6xl mb-2">{app.icon}</div>
                <h2 className="text-2xl font-bold text-white">{app.title}</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{app.description}</p>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800 mb-2">{t('common.examples')}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {app.examples.map((example, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PRACTICE MODE - CIRCUIT PRACTICE
// ============================================================================

interface Question {
  id: number;
  question: string;
  type: 'mcq' | 'true-false' | 'fill-blank' | 'match' | 'short-answer';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  image?: string;
}

export const PracticeMode: React.FC = () => {
  const { t } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(15).fill(false)
  );

  const questions: Question[] = [
    {
      id: 1,
      question: t('practice.question1'),
      type: 'mcq',
      options: [t('practice.question1.option1'), t('practice.question1.option2'), t('practice.question1.option3'), t('practice.question1.option4')],
      correctAnswer: t('practice.question1.option2'),
      explanation: t('practice.question1.explanation')
    },
    {
      id: 2,
      question: t('practice.question2'),
      type: 'mcq',
      options: [t('practice.question2.option1'), t('practice.question2.option2'), t('practice.question2.option3'), t('practice.question2.option4')],
      correctAnswer: t('practice.question2.option1'),
      explanation: t('practice.question2.explanation')
    },
    {
      id: 3,
      question: t('practice.question3'),
      type: 'true-false',
      options: [t('practice.question3.option1'), t('practice.question3.option2')],
      correctAnswer: t('practice.question3.option1'),
      explanation: t('practice.question3.explanation')
    },
    {
      id: 4,
      question: t('practice.question4'),
      type: 'fill-blank',
      correctAnswer: t('practice.question4.answer'),
      explanation: t('practice.question4.explanation')
    },
    {
      id: 5,
      question: t('practice.question5'),
      type: 'mcq',
      options: [t('practice.question5.option1'), t('practice.question5.option2'), t('practice.question5.option3'), t('practice.question5.option4')],
      correctAnswer: t('practice.question5.option2'),
      explanation: t('practice.question5.explanation')
    },
    {
      id: 6,
      question: t('practice.question6'),
      type: 'true-false',
      options: [t('practice.question3.option1'), t('practice.question3.option2')],
      correctAnswer: t('practice.question3.option2'),
      explanation: t('practice.question6.explanation')
    },
    {
      id: 7,
      question: t('practice.question7'),
      type: 'mcq',
      options: [t('practice.question7.option1'), t('practice.question7.option2'), t('practice.question7.option3'), t('practice.question7.option4')],
      correctAnswer: t('practice.question7.option2'),
      explanation: t('practice.question7.explanation')
    },
    {
      id: 8,
      question: t('practice.question8'),
      type: 'mcq',
      options: [t('practice.question8.option1'), t('practice.question8.option2'), t('practice.question8.option3'), t('practice.question8.option4')],
      correctAnswer: t('practice.question8.option1'),
      explanation: t('practice.question8.explanation')
    },
    {
      id: 9,
      question: t('practice.question9'),
      type: 'true-false',
      options: [t('practice.question3.option1'), t('practice.question3.option2')],
      correctAnswer: t('practice.question3.option2'),
      explanation: t('practice.question9.explanation')
    },
    {
      id: 10,
      question: t('practice.question10'),
      type: 'fill-blank',
      correctAnswer: t('practice.question10.answer'),
      explanation: t('practice.question10.explanation')
    },
    {
      id: 11,
      question: t('practice.question11'),
      type: 'mcq',
      options: [t('practice.question11.option1'), t('practice.question11.option2'), t('practice.question11.option3'), t('practice.question11.option4')],
      correctAnswer: t('practice.question11.option1'),
      explanation: t('practice.question11.explanation')
    },
    {
      id: 12,
      question: t('practice.question12'),
      type: 'true-false',
      options: [t('practice.question3.option1'), t('practice.question3.option2')],
      correctAnswer: t('practice.question3.option2'),
      explanation: t('practice.question12.explanation')
    },
    {
      id: 13,
      question: t('practice.question13'),
      type: 'mcq',
      options: [t('practice.question13.option1'), t('practice.question13.option2'), t('practice.question13.option3'), t('practice.question13.option4')],
      correctAnswer: t('practice.question13.option3'),
      explanation: t('practice.question13.explanation')
    },
    {
      id: 14,
      question: t('practice.question14'),
      type: 'fill-blank',
      correctAnswer: t('practice.question14.answer'),
      explanation: t('practice.question14.explanation')
    },
    {
      id: 15,
      question: t('practice.question15'),
      type: 'true-false',
      options: [t('practice.question3.option1'), t('practice.question3.option2')],
      correctAnswer: t('practice.question3.option2'),
      explanation: t('practice.question15.explanation')
    }
  ];

  const currentQ = questions[currentQuestion];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer.toLowerCase().trim() === 
                      (typeof currentQ.correctAnswer === 'string' 
                        ? currentQ.correctAnswer.toLowerCase().trim() 
                        : currentQ.correctAnswer[0].toLowerCase().trim());
    
    if (isCorrect && !answeredQuestions[currentQuestion]) {
      setScore(score + 1);
    }

    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestion] = true;
    setAnsweredQuestions(newAnswered);
    
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowResult(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer('');
      setShowResult(false);
    }
  };

  const isCorrect = selectedAnswer.toLowerCase().trim() === 
                    (typeof currentQ.correctAnswer === 'string' 
                      ? currentQ.correctAnswer.toLowerCase().trim() 
                      : currentQ.correctAnswer[0].toLowerCase().trim());

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Question Type Badge */}
          <div className="mb-4">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              currentQ.type === 'mcq' ? 'bg-blue-100 text-blue-700' :
              currentQ.type === 'true-false' ? 'bg-green-100 text-green-700' :
              currentQ.type === 'fill-blank' ? 'bg-yellow-100 text-yellow-700' :
              'bg-purple-100 text-purple-700'
            }`}>
              {currentQ.type === 'mcq' ? t('practice.multipleChoice') :
               currentQ.type === 'true-false' ? t('practice.trueFalse') :
               currentQ.type === 'fill-blank' ? t('practice.fillBlank') :
               t('practice.shortAnswer')}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {currentQ.question}
          </h2>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {currentQ.type === 'mcq' || currentQ.type === 'true-false' ? (
              currentQ.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    selectedAnswer === option
                      ? showResult
                        ? isCorrect
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-purple-500 bg-purple-50'
                      : showResult && option === currentQ.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedAnswer === option
                        ? showResult
                          ? isCorrect
                            ? 'border-green-500 bg-green-500'
                            : 'border-red-500 bg-red-500'
                          : 'border-purple-500 bg-purple-500'
                        : showResult && option === currentQ.correctAnswer
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {((selectedAnswer === option && showResult) || 
                        (showResult && option === currentQ.correctAnswer)) && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          {isCorrect || option === currentQ.correctAnswer ? (
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          ) : (
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                          )}
                        </svg>
                      )}
                    </div>
                    <span className="font-medium text-gray-800">{option}</span>
                  </div>
                </button>
              ))
            ) : (
              <input
                type="text"
                value={selectedAnswer}
                onChange={(e) => handleAnswerSelect(e.target.value)}
                disabled={showResult}
                placeholder={t('common.answerPlaceholder')}
                className={`w-full p-4 text-lg border-2 rounded-xl ${
                  showResult
                    ? isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-gray-300 focus:border-purple-500 focus:outline-none'
                } ${showResult ? 'cursor-not-allowed' : ''}`}
              />
            )}
          </div>

          {/* Submit Button */}
          {!showResult && (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                selectedAnswer
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t('practice.submitAnswer')}
            </button>
          )}

          {/* Result & Explanation */}
          {showResult && (
            <div className={`p-6 rounded-xl ${
              isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
            }`}>
              <div className="flex items-center mb-4">
                {isCorrect ? (
                  <div className="flex items-center text-green-700">
                    <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-2xl font-bold">{t('practice.correct')}</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-700">
                    <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-2xl font-bold">{t('practice.incorrect')}</span>
                  </div>
                )}
              </div>

              {!isCorrect && (
                <div className="mb-3 p-3 bg-white rounded-lg">
                  <span className="font-semibold text-gray-700">{t('practice.correctAnswer')}: </span>
                  <span className="text-green-700 font-bold">{currentQ.correctAnswer}</span>
                </div>
              )}

              <div className="p-4 bg-white rounded-lg">
                <p className="font-semibold text-gray-700 mb-2">{t('practice.explanation')}:</p>
                <p className="text-gray-800">{currentQ.explanation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              currentQuestion === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-white text-purple-600 border-2 border-purple-500 hover:bg-purple-50'
            }`}
          >
            ← {t('practice.previous')}
          </button>

          <button
            onClick={handleNext}
            disabled={currentQuestion === questions.length - 1}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              currentQuestion === questions.length - 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
            }`}
          >
            {t('practice.next')} →
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EXPORT SUMMARY
// ============================================================================
// 
// This file contains merged components from:
// - Circuit components (Battery, ElectricCell, Lamp, LED, Switch, Wire)
// - Main components (CircuitCanvas, CircuitVisualization, DemonstrationMode, 
//   ElectricityLearningApp, LanguageSelector, Navbar, PracticeMode, RealWorldApplications)
// - Contexts (LanguageContext, ModeContext)
// - Types and interfaces (all circuit-related types)
// - Translations (simplified version)
// - Sample data
//
// All components are exported and can be imported from this single file.
// For example:
//   import { Battery, CircuitCanvas, useLanguage, LanguageProvider } from './components/SimpleElectricCircuit';
//

