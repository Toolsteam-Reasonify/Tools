import { CircuitToolData } from '@/interfaces/circuitTypes';

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
    exercises: [
      {
        exercise_id: 'ex_1',
        title: 'practice.exercise1.title',
        description: 'practice.exercise1.desc',
        difficulty: 'beginner',
        problem_data: {
          circuit_setup: [],
          question_type: 'build_circuit',
          correct_solution: {
            components: ['cell', 'wire', 'switch', 'lamp', 'wire'],
            circuit_complete: true,
          },
        },
        solution: {
          correct_answer: 'circuit_complete',
          solution_steps: [],
        },
        interaction_config: {
          input_methods: ['drag', 'click'],
          max_attempts: 3,
          hint_system: true,
          progressive_hints: [
            'practice.exercise1.hint1',
            'practice.exercise1.hint2',
            'practice.exercise1.hint3',
          ],
        },
        assessment: {
          accuracy_weight: 1.0,
          time_weight: 0.2,
          attempt_weight: 0.3,
        },
      },
      {
        exercise_id: 'ex_2',
        title: 'practice.exercise2.title',
        description: 'practice.exercise2.desc',
        difficulty: 'beginner',
        problem_data: {
          circuit_setup: [
            {
              id: 'cell3',
              type: 'cell',
              position: { x: 120, y: 150 },
              connections: ['wireA'],
            },
            {
              id: 'wireA',
              type: 'wire',
              position: { x: 220, y: 150 },
              connections: ['cell3', 'lamp2'],
            },
            {
              id: 'lamp2',
              type: 'lamp',
              position: { x: 320, y: 150 },
              connections: ['wireA', 'wireB'],
              state: 'off',
            },
            {
              id: 'wireB',
              type: 'wire',
              position: { x: 420, y: 150 },
              connections: ['lamp2', 'cell3'],
            },
          ],
          question_type: 'test_conductor',
          correct_solution: {
            conductor: 'metal',
            result: 'lamp_glows',
          },
        },
        solution: {
          correct_answer: 'metal',
        },
        interaction_config: {
          input_methods: ['text'],
          max_attempts: 3,
          hint_system: true,
          progressive_hints: [
            'practice.exercise2.hint1',
            'practice.exercise2.hint2',
          ],
        },
        assessment: {
          accuracy_weight: 1.0,
          time_weight: 0.2,
          attempt_weight: 0.3,
        },
      },
      {
        exercise_id: 'ex_3',
        title: 'practice.exercise3.title',
        description: 'practice.exercise3.desc',
        difficulty: 'intermediate',
        problem_data: {
          circuit_setup: [
            {
              id: 'cell4',
              type: 'cell',
              position: { x: 120, y: 140 },
              connections: ['wireC'],
            },
            {
              id: 'wireC',
              type: 'wire',
              position: { x: 220, y: 140 },
              connections: ['cell4', 'led1'],
            },
            {
              id: 'led1',
              type: 'led',
              position: { x: 320, y: 140 },
              connections: ['wireC', 'wireD'],
              polarity: 'incorrect',
              state: 'off',
            },
            {
              id: 'wireD',
              type: 'wire',
              position: { x: 420, y: 140 },
              connections: ['led1', 'cell4'],
            },
          ],
          question_type: 'identify_component',
          correct_solution: {
            polarity: 'correct',
          },
        },
        solution: {
          correct_answer: 'reverse_led',
        },
        interaction_config: {
          input_methods: ['text'],
          max_attempts: 2,
          hint_system: true,
          progressive_hints: [
            'practice.exercise3.hint1',
            'practice.exercise3.hint2',
          ],
        },
        assessment: {
          accuracy_weight: 1.0,
          time_weight: 0.3,
          attempt_weight: 0.3,
        },
      },
      {
        exercise_id: 'ex_4',
        title: 'practice.exercise4.title',
        description: 'practice.exercise4.desc',
        difficulty: 'intermediate',
        problem_data: {
          circuit_setup: [
            {
              id: 'battery1',
              type: 'battery',
              position: { x: 110, y: 160 },
              connections: ['wireE'],
            },
            {
              id: 'wireE',
              type: 'wire',
              position: { x: 230, y: 160 },
              connections: ['battery1', 'switch2'],
            },
            {
              id: 'switch2',
              type: 'switch',
              position: { x: 350, y: 160 },
              connections: ['wireE', 'wireF'],
              state: 'open',
            },
            {
              id: 'wireF',
              type: 'wire',
              position: { x: 470, y: 160 },
              connections: ['switch2', 'lamp3'],
            },
            {
              id: 'lamp3',
              type: 'lamp',
              position: { x: 590, y: 160 },
              connections: ['wireF', 'wireG'],
              state: 'off',
            },
            {
              id: 'wireG',
              type: 'wire',
              position: { x: 710, y: 160 },
              connections: ['lamp3', 'battery1'],
            },
          ],
          question_type: 'troubleshoot',
          correct_solution: {
            action: 'close_switch',
          },
        },
        solution: {
          correct_answer: 'close_switch',
        },
        interaction_config: {
          input_methods: ['text'],
          max_attempts: 3,
          hint_system: true,
          progressive_hints: [
            'practice.exercise4.hint1',
            'practice.exercise4.hint2',
          ],
        },
        assessment: {
          accuracy_weight: 1.0,
          time_weight: 0.3,
          attempt_weight: 0.2,
        },
      },
    ],
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

