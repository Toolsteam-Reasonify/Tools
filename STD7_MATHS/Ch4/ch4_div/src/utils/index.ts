export const generateRandomEquation = (type: 'addition' | 'subtraction' | 'multiplication' | 'division') => {
  const operations = {
    addition: () => {
      const a = Math.floor(Math.random() * 10) + 1
      const b = Math.floor(Math.random() * 10) + 1
      return { equation: `x + ${a} = ${a + b}`, solution: b.toString() }
    },
    subtraction: () => {
      const a = Math.floor(Math.random() * 10) + 1
      const b = Math.floor(Math.random() * 10) + 1
      return { equation: `x - ${a} = ${b}`, solution: (a + b).toString() }
    },
    multiplication: () => {
      const a = Math.floor(Math.random() * 5) + 2
      const b = Math.floor(Math.random() * 10) + 1
      return { equation: `${a}x = ${a * b}`, solution: b.toString() }
    },
    division: () => {
      const a = Math.floor(Math.random() * 5) + 2
      const b = Math.floor(Math.random() * 10) + 1
      return { equation: `x ÷ ${a} = ${b}`, solution: (a * b).toString() }
    }
  }
  
  return operations[type]()
}

export const calculateGrade = (score: number, total: number) => {
  const percentage = (score / total) * 100
  if (percentage >= 90) return { grade: 'A+', color: 'text-green-400' }
  if (percentage >= 80) return { grade: 'A', color: 'text-green-400' }
  if (percentage >= 70) return { grade: 'B+', color: 'text-blue-400' }
  if (percentage >= 60) return { grade: 'B', color: 'text-blue-400' }
  if (percentage >= 50) return { grade: 'C', color: 'text-yellow-400' }
  return { grade: 'D', color: 'text-red-400' }
}

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const validateAnswer = (userAnswer: string, correctAnswer: string) => {
  return userAnswer.trim() === correctAnswer.trim()
}

export const getProgressColor = (progress: number) => {
  if (progress >= 90) return 'text-green-400'
  if (progress >= 80) return 'text-blue-400'
  if (progress >= 70) return 'text-yellow-400'
  return 'text-red-400'
}
