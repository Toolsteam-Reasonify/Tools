// Topic 7.3: Prices Related to an Item or Buying and Selling
// Profit and Loss Calculations Tool

export type ProfitLossOperation = 'profit_calculation' | 'loss_calculation' | 'profit_percentage' | 'loss_percentage';

export interface StepItem {
  id: string;
  title: string;
  description: string;
  formula?: string;
  calculation?: string;
  result?: string;
  explanation?: string;
}

export interface StepResult {
  steps: StepItem[];
  finalAnswer: string;
  type: 'profit' | 'loss' | 'no_profit_no_loss';
}

export interface ProfitLossParams {
  costPrice?: number;
  sellingPrice?: number;
  profit?: number;
  loss?: number;
  profitPercentage?: number;
  lossPercentage?: number;
}

// Main function to get step-by-step explanation for profit/loss calculations
export function getSteps(operation: ProfitLossOperation, params: ProfitLossParams, language: 'en' | 'hi' | 'gu' = 'en'): StepResult {
  const { costPrice, sellingPrice, profit, loss, profitPercentage, lossPercentage } = params;

  switch (operation) {
    case 'profit_calculation':
      return getProfitCalculationSteps(costPrice!, sellingPrice!, language);
    case 'loss_calculation':
      return getLossCalculationSteps(costPrice!, sellingPrice!, language);
    case 'profit_percentage':
      return getProfitPercentageSteps(costPrice!, profit!, language);
    case 'loss_percentage':
      return getLossPercentageSteps(costPrice!, loss!, language);
    default:
      throw new Error('Invalid operation');
  }
}

function getProfitCalculationSteps(costPrice: number, sellingPrice: number, language: 'en' | 'hi' | 'gu'): StepResult {
  const profit = sellingPrice - costPrice;
  const isProfit = profit > 0;
  const isLoss = profit < 0;
  const isNoChange = profit === 0;

  const translations = {
    en: {
      step1: 'Identify Given Values',
      step1Desc: `Cost Price (CP) = ₹${costPrice}, Selling Price (SP) = ₹${sellingPrice}`,
      step2: 'Apply Profit Formula',
      step2Desc: 'Profit = Selling Price - Cost Price',
      step2Formula: `Profit = ₹${sellingPrice} - ₹${costPrice}`,
      step3: 'Calculate Profit',
      step3Desc: `Profit = ₹${profit}`,
      step4: 'Determine Result',
      step4Desc: isProfit ? `Since SP > CP, there is a profit of ₹${profit}` : 
                isLoss ? `Since CP > SP, there is a loss of ₹${Math.abs(profit)}` :
                'Since SP = CP, there is no profit no loss'
    },
    hi: {
      step1: 'दिए गए मानों की पहचान करें',
      step1Desc: `क्रय मूल्य (CP) = ₹${costPrice}, विक्रय मूल्य (SP) = ₹${sellingPrice}`,
      step2: 'लाभ सूत्र लगाएं',
      step2Desc: 'लाभ = विक्रय मूल्य - क्रय मूल्य',
      step2Formula: `लाभ = ₹${sellingPrice} - ₹${costPrice}`,
      step3: 'लाभ की गणना करें',
      step3Desc: `लाभ = ₹${profit}`,
      step4: 'परिणाम निर्धारित करें',
      step4Desc: isProfit ? `चूंकि SP > CP, ₹${profit} का लाभ है` : 
                isLoss ? `चूंकि CP > SP, ₹${Math.abs(profit)} की हानि है` :
                'चूंकि SP = CP, न तो लाभ न हानि है'
    },
    gu: {
      step1: 'આપેલા મૂલ્યોની ઓળખ કરો',
      step1Desc: `ક્રય મૂલ્ય (CP) = ₹${costPrice}, વિક્રય મૂલ્ય (SP) = ₹${sellingPrice}`,
      step2: 'નફો સૂત્ર લાગુ કરો',
      step2Desc: 'નફો = વિક્રય મૂલ્ય - ક્રય મૂલ્ય',
      step2Formula: `નફો = ₹${sellingPrice} - ₹${costPrice}`,
      step3: 'નફોની ગણતરી કરો',
      step3Desc: `નફો = ₹${profit}`,
      step4: 'પરિણામ નક્કી કરો',
      step4Desc: isProfit ? `કારણ કે SP > CP, ₹${profit} નો નફો છે` : 
                isLoss ? `કારણ કે CP > SP, ₹${Math.abs(profit)} નું નુકસાન છે` :
                'કારણ કે SP = CP, ન તો નફો ન નુકસાન છે'
    }
  };

  const t = translations[language];

  const steps: StepItem[] = [
    {
      id: 'step1',
      title: t.step1,
      description: t.step1Desc
    },
    {
      id: 'step2',
      title: t.step2,
      description: t.step2Desc,
      formula: t.step2Formula
    },
    {
      id: 'step3',
      title: t.step3,
      description: t.step3Desc
    },
    {
      id: 'step4',
      title: t.step4,
      description: t.step4Desc
    }
  ];

  return {
    steps,
    finalAnswer: isProfit ? `₹${profit}` : isLoss ? `₹${Math.abs(profit)}` : '₹0',
    type: isProfit ? 'profit' : isLoss ? 'loss' : 'no_profit_no_loss'
  };
}

function getLossCalculationSteps(costPrice: number, sellingPrice: number, language: 'en' | 'hi' | 'gu'): StepResult {
  const loss = costPrice - sellingPrice;
  const isLoss = loss > 0;
  const isProfit = loss < 0;
  const isNoChange = loss === 0;

  const translations = {
    en: {
      step1: 'Identify Given Values',
      step1Desc: `Cost Price (CP) = ₹${costPrice}, Selling Price (SP) = ₹${sellingPrice}`,
      step2: 'Apply Loss Formula',
      step2Desc: 'Loss = Cost Price - Selling Price',
      step2Formula: `Loss = ₹${costPrice} - ₹${sellingPrice}`,
      step3: 'Calculate Loss',
      step3Desc: `Loss = ₹${loss}`,
      step4: 'Determine Result',
      step4Desc: isLoss ? `Since CP > SP, there is a loss of ₹${loss}` : 
                isProfit ? `Since SP > CP, there is a profit of ₹${Math.abs(loss)}` :
                'Since SP = CP, there is no profit no loss'
    },
    hi: {
      step1: 'दिए गए मानों की पहचान करें',
      step1Desc: `क्रय मूल्य (CP) = ₹${costPrice}, विक्रय मूल्य (SP) = ₹${sellingPrice}`,
      step2: 'हानि सूत्र लगाएं',
      step2Desc: 'हानि = क्रय मूल्य - विक्रय मूल्य',
      step2Formula: `हानि = ₹${costPrice} - ₹${sellingPrice}`,
      step3: 'हानि की गणना करें',
      step3Desc: `हानि = ₹${loss}`,
      step4: 'परिणाम निर्धारित करें',
      step4Desc: isLoss ? `चूंकि CP > SP, ₹${loss} की हानि है` : 
                isProfit ? `चूंकि SP > CP, ₹${Math.abs(loss)} का लाभ है` :
                'चूंकि SP = CP, न तो लाभ न हानि है'
    },
    gu: {
      step1: 'આપેલા મૂલ્યોની ઓળખ કરો',
      step1Desc: `ક્રય મૂલ્ય (CP) = ₹${costPrice}, વિક્રય મૂલ્ય (SP) = ₹${sellingPrice}`,
      step2: 'નુકસાન સૂત્ર લાગુ કરો',
      step2Desc: 'નુકસાન = ક્રય મૂલ્ય - વિક્રય મૂલ્ય',
      step2Formula: `નુકસાન = ₹${costPrice} - ₹${sellingPrice}`,
      step3: 'નુકસાનની ગણતરી કરો',
      step3Desc: `નુકસાન = ₹${loss}`,
      step4: 'પરિણામ નક્કી કરો',
      step4Desc: isLoss ? `કારણ કે CP > SP, ₹${loss} નું નુકસાન છે` : 
                isProfit ? `કારણ કે SP > CP, ₹${Math.abs(loss)} નો નફો છે` :
                'કારણ કે SP = CP, ન તો નફો ન નુકસાન છે'
    }
  };

  const t = translations[language];

  const steps: StepItem[] = [
    {
      id: 'step1',
      title: t.step1,
      description: t.step1Desc
    },
    {
      id: 'step2',
      title: t.step2,
      description: t.step2Desc,
      formula: t.step2Formula
    },
    {
      id: 'step3',
      title: t.step3,
      description: t.step3Desc
    },
    {
      id: 'step4',
      title: t.step4,
      description: t.step4Desc
    }
  ];

  return {
    steps,
    finalAnswer: isLoss ? `₹${loss}` : isProfit ? `₹${Math.abs(loss)}` : '₹0',
    type: isLoss ? 'loss' : isProfit ? 'profit' : 'no_profit_no_loss'
  };
}

function getProfitPercentageSteps(costPrice: number, profit: number, language: 'en' | 'hi' | 'gu'): StepResult {
  const profitPercentage = (profit / costPrice) * 100;

  const translations = {
    en: {
      step1: 'Identify Given Values',
      step1Desc: `Cost Price (CP) = ₹${costPrice}, Profit = ₹${profit}`,
      step2: 'Apply Profit Percentage Formula',
      step2Desc: 'Profit % = (Profit / Cost Price) × 100',
      step2Formula: `Profit % = (₹${profit} / ₹${costPrice}) × 100`,
      step3: 'Calculate Profit Percentage',
      step3Desc: `Profit % = ${(profit / costPrice).toFixed(3)} × 100`,
      step4: 'Final Answer',
      step4Desc: `Profit % = ${profitPercentage.toFixed(2)}%`
    },
    hi: {
      step1: 'दिए गए मानों की पहचान करें',
      step1Desc: `क्रय मूल्य (CP) = ₹${costPrice}, लाभ = ₹${profit}`,
      step2: 'लाभ प्रतिशत सूत्र लगाएं',
      step2Desc: 'लाभ % = (लाभ / क्रय मूल्य) × 100',
      step2Formula: `लाभ % = (₹${profit} / ₹${costPrice}) × 100`,
      step3: 'लाभ प्रतिशत की गणना करें',
      step3Desc: `लाभ % = ${(profit / costPrice).toFixed(3)} × 100`,
      step4: 'अंतिम उत्तर',
      step4Desc: `लाभ % = ${profitPercentage.toFixed(2)}%`
    },
    gu: {
      step1: 'આપેલા મૂલ્યોની ઓળખ કરો',
      step1Desc: `ક્રય મૂલ્ય (CP) = ₹${costPrice}, નફો = ₹${profit}`,
      step2: 'નફો ટકાવારી સૂત્ર લાગુ કરો',
      step2Desc: 'નફો % = (નફો / ક્રય મૂલ્ય) × 100',
      step2Formula: `નફો % = (₹${profit} / ₹${costPrice}) × 100`,
      step3: 'નફો ટકાવારીની ગણતરી કરો',
      step3Desc: `નફો % = ${(profit / costPrice).toFixed(3)} × 100`,
      step4: 'અંતિમ જવાબ',
      step4Desc: `નફો % = ${profitPercentage.toFixed(2)}%`
    }
  };

  const t = translations[language];

  const steps: StepItem[] = [
    {
      id: 'step1',
      title: t.step1,
      description: t.step1Desc
    },
    {
      id: 'step2',
      title: t.step2,
      description: t.step2Desc,
      formula: t.step2Formula
    },
    {
      id: 'step3',
      title: t.step3,
      description: t.step3Desc
    },
    {
      id: 'step4',
      title: t.step4,
      description: t.step4Desc
    }
  ];

  return {
    steps,
    finalAnswer: `${profitPercentage.toFixed(2)}%`,
    type: 'profit'
  };
}

function getLossPercentageSteps(costPrice: number, loss: number, language: 'en' | 'hi' | 'gu'): StepResult {
  const lossPercentage = (loss / costPrice) * 100;

  const translations = {
    en: {
      step1: 'Identify Given Values',
      step1Desc: `Cost Price (CP) = ₹${costPrice}, Loss = ₹${loss}`,
      step2: 'Apply Loss Percentage Formula',
      step2Desc: 'Loss % = (Loss / Cost Price) × 100',
      step2Formula: `Loss % = (₹${loss} / ₹${costPrice}) × 100`,
      step3: 'Calculate Loss Percentage',
      step3Desc: `Loss % = ${(loss / costPrice).toFixed(3)} × 100`,
      step4: 'Final Answer',
      step4Desc: `Loss % = ${lossPercentage.toFixed(2)}%`
    },
    hi: {
      step1: 'दिए गए मानों की पहचान करें',
      step1Desc: `क्रय मूल्य (CP) = ₹${costPrice}, हानि = ₹${loss}`,
      step2: 'हानि प्रतिशत सूत्र लगाएं',
      step2Desc: 'हानि % = (हानि / क्रय मूल्य) × 100',
      step2Formula: `हानि % = (₹${loss} / ₹${costPrice}) × 100`,
      step3: 'हानि प्रतिशत की गणना करें',
      step3Desc: `हानि % = ${(loss / costPrice).toFixed(3)} × 100`,
      step4: 'अंतिम उत्तर',
      step4Desc: `हानि % = ${lossPercentage.toFixed(2)}%`
    },
    gu: {
      step1: 'આપેલા મૂલ્યોની ઓળખ કરો',
      step1Desc: `ક્રય મૂલ્ય (CP) = ₹${costPrice}, નુકસાન = ₹${loss}`,
      step2: 'નુકસાન ટકાવારી સૂત્ર લાગુ કરો',
      step2Desc: 'નુકસાન % = (નુકસાન / ક્રય મૂલ્ય) × 100',
      step2Formula: `નુકસાન % = (₹${loss} / ₹${costPrice}) × 100`,
      step3: 'નુકસાન ટકાવારીની ગણતરી કરો',
      step3Desc: `નુકસાન % = ${(loss / costPrice).toFixed(3)} × 100`,
      step4: 'અંતિમ જવાબ',
      step4Desc: `નુકસાન % = ${lossPercentage.toFixed(2)}%`
    }
  };

  const t = translations[language];

  const steps: StepItem[] = [
    {
      id: 'step1',
      title: t.step1,
      description: t.step1Desc
    },
    {
      id: 'step2',
      title: t.step2,
      description: t.step2Desc,
      formula: t.step2Formula
    },
    {
      id: 'step3',
      title: t.step3,
      description: t.step3Desc
    },
    {
      id: 'step4',
      title: t.step4,
      description: t.step4Desc
    }
  ];

  return {
    steps,
    finalAnswer: `${lossPercentage.toFixed(2)}%`,
    type: 'loss'
  };
}

// Helper function to parse equation and extract parameters
export function parseEquationToParams(equation: string): ProfitLossParams {
  // This is a simplified parser - in a real implementation, you'd want more robust parsing
  const params: ProfitLossParams = {};
  
  // Extract numbers from equation
  const numbers = equation.match(/\d+/g);
  if (numbers) {
    const values = numbers.map(Number);
    
    // Simple heuristic based on common patterns
    if (equation.includes('CP') && equation.includes('SP')) {
      params.costPrice = values[0];
      params.sellingPrice = values[1];
    } else if (equation.includes('profit')) {
      params.costPrice = values[0];
      params.profit = values[1];
    } else if (equation.includes('loss')) {
      params.costPrice = values[0];
      params.loss = values[1];
    }
  }
  
  return params;
}
