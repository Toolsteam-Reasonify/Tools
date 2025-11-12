export interface Student {
  id: number
  name: string
  progress: number
  completed: number
  accuracy: number
  status: 'on-track' | 'needs-help'
}

export interface Problem {
  id: number
  equation: string
  solution: string
  explanation: string
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

export interface Question {
  id: number
  question: string
  options: string[]
  correct: string
  explanation: string
}

export interface Game {
  id: number
  name: string
  description: string
  icon: any
  color: string
}

export interface ProgressData {
  topic: string
  completed: number
  total: number
}

export interface AssessmentResult {
  score: number
  total: number
  grade: string
  timeSpent: number
  answers: { [key: number]: string }
}
