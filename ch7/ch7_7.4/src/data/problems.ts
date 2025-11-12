import { Problem } from '../types'

export const practiceProblems: Problem[] = [
  {
    id: 1,
    equation: 'Find the simple interest on ₹8,000 at 12% per annum for 3 years.',
    solution: '₹2,880',
    explanation: 'P=₹8000, R=12% p.a., T=3 years. I = (P×R×T)/100 = (8000×12×3)/100 = 2,88,000/100 = ₹2,880.'
  },
  {
    id: 2,
    equation: 'Calculate the amount after 2 years on a principal of ₹5,000 at 8% p.a.',
    solution: '₹5,800',
    explanation: 'Step 1: I=(P×R×T)/100 = (5000×8×2)/100 = 80,000/100 = ₹800. Step 2: A=P+I = 5000+800 = ₹5,800.'
  },
  {
    id: 3,
    equation: 'What rate of interest will give ₹600 as interest on ₹4,000 in 3 years?',
    solution: '5% p.a.',
    explanation: 'I=(P×R×T)/100 ⇒ 600=(4000×R×3)/100 ⇒ 600×100=12000R ⇒ 60,000=12000R ⇒ R=5% p.a.'
  },
  {
    id: 4,
    equation: 'In how many years will ₹3,000 amount to ₹3,900 at 10% per annum simple interest?',
    solution: '3 years',
    explanation: 'Step 1: I=A−P = 3900−3000 = ₹900. Step 2: 900=(3000×10×T)/100 ⇒ 900=300T ⇒ T=900/300 = 3 years.'
  },
  {
    id: 5,
    equation: 'Find the principal if the interest paid after 4 years at 5% p.a. is ₹1,200.',
    solution: '₹6,000',
    explanation: 'I=(P×R×T)/100 ⇒ 1200=(P×5×4)/100 ⇒ 1200×100=20P ⇒ 1,20,000=20P ⇒ P=₹6,000.'
  },
  {
    id: 6,
    equation: 'Ramesh borrowed ₹12,000 at 9% p.a. After 2 years, he paid back ₹10,000. What amount should he pay after one more year to clear the debt?',
    solution: '₹4,534.40',
    explanation: 'Step 1: I₁=(12000×9×2)/100=₹2,160. Step 2: A₁=P+I₁=12000+2160=₹14,160. Step 3: Remaining=14160−10000=₹4,160. Step 4: I₂=(4160×9×1)/100=₹374.40. Step 5: Final=4160+374.40=₹4,534.40.'
  }
]

export const assessmentQuestions = [
  {
    id: 1,
    question: 'Find the simple interest on ₹8,000 at 12% per annum for 3 years.',
    options: ['₹2,400', '₹2,560', '₹2,880', '₹3,000'],
    correct: '₹2,880',
    explanation: 'I=(8000×12×3)/100 = ₹2,880'
  },
  {
    id: 2,
    question: 'Calculate the amount after 2 years on a principal of ₹5,000 at 8% p.a.',
    options: ['₹5,600', '₹5,700', '₹5,800', '₹5,900'],
    correct: '₹5,800',
    explanation: 'I=₹800; A=P+I=₹5800'
  },
  {
    id: 3,
    question: 'What rate of interest will give ₹600 as interest on ₹4,000 in 3 years?',
    options: ['4% p.a.', '5% p.a.', '6% p.a.', '7% p.a.'],
    correct: '5% p.a.',
    explanation: '600=(4000×R×3)/100 ⇒ R=5%'
  },
  {
    id: 4,
    question: 'In how many years will ₹3,000 amount to ₹3,900 at 10% per annum simple interest?',
    options: ['2 years', '3 years', '4 years', '5 years'],
    correct: '3 years',
    explanation: 'I=₹900; 900=(3000×10×T)/100 ⇒ T=3'
  },
  {
    id: 5,
    question: 'Find the principal if the interest paid after 4 years at 5% p.a. is ₹1,200.',
    options: ['₹5,000', '₹6,000', '₹6,500', '₹7,000'],
    correct: '₹6,000',
    explanation: '1200=(P×5×4)/100 ⇒ P=₹6000'
  },
  {
    id: 6,
    question: 'Ramesh borrowed ₹12,000 at 9% p.a. After 2 years, he paid back ₹10,000. What amount should he pay after one more year to clear the debt?',
    options: ['₹4,400.00', '₹4,500.00', '₹4,534.40', '₹4,600.00'],
    correct: '₹4,534.40',
    explanation: 'Remaining=₹4160; I=₹374.40; Final=₹4534.40'
  }
]
