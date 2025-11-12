import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Dna, DollarSign, Smartphone, Zap, TrendingUp, Database, Atom, Lightbulb, Scale, Cpu, Building2, Calculator, X } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface Application {
  lawId: number;
  appIndex: number;
  titleKey: string;
  descKey: string;
  icon: React.ReactNode;
  color: string;
  originalNumberKey: string;
  exponentialFormKey: string;
  resultKey: string;
  funFactKey: string;
  lawTitleKey: string;
}

// Detail view labels translations
const detailLabels = {
  en: {
    originalNumber: 'Original Number',
    exponentialForm: 'Exponential Form',
    breakdown: 'Breakdown',
    base: 'Base',
    exponent: 'Exponent',
    result: 'Result',
    whatThisMeans: 'What This Means',
    funFact: 'Fun Fact',
    animatedCalculation: 'Animated Calculation',
    whyUseExponents: 'Why Use Exponents?',
    reason1: 'Easier to read and write large numbers',
    reason2: 'Simpler to compare different values',
    reason3: 'Makes calculations more efficient',
    reason4: 'Universal in science and technology'
  },
  hi: {
    originalNumber: 'मूल संख्या',
    exponentialForm: 'घातीय रूप',
    breakdown: 'विभाजन',
    base: 'आधार',
    exponent: 'घातांक',
    result: 'परिणाम',
    whatThisMeans: 'इसका क्या मतलब है',
    funFact: 'मजेदार तथ्य',
    animatedCalculation: 'एनिमेटेड गणना',
    whyUseExponents: 'घातांक क्यों उपयोग करें?',
    reason1: 'बड़ी संख्याओं को पढ़ने और लिखने में आसान',
    reason2: 'विभिन्न मूल्यों की तुलना करना आसान',
    reason3: 'गणना को अधिक कुशल बनाता है',
    reason4: 'विज्ञान और प्रौद्योगिकी में सार्वभौमिक'
  },
  gu: {
    originalNumber: 'મૂળ સંખ્યા',
    exponentialForm: 'ઘાતીય સ્વરૂપ',
    breakdown: 'વિઘટન',
    base: 'આધાર',
    exponent: 'ઘાતાંક',
    result: 'પરિણામ',
    whatThisMeans: 'આનો અર્થ શું છે',
    funFact: 'રસપ્રદ તથ્ય',
    animatedCalculation: 'એનિમેટેડ ગણતરી',
    whyUseExponents: 'ઘાતાંક શા માટે ઉપયોગ કરો?',
    reason1: 'મોટી સંખ્યાઓ વાંચવા અને લખવા સરળ',
    reason2: 'વિવિધ મૂલ્યોની તુલના કરવી સરળ',
    reason3: 'ગણતરીઓને વધુ કાર્યક્ષમ બનાવે છે',
    reason4: 'વિજ્ઞાન અને ટેક્નોલોજીમાં સાર્વત્રિક'
  }
};

// English translations for all application details (fallback when translation doesn't exist)
const englishTranslations = {
  // Exponential forms (always English for mathematical formulas)
  law1App1ExponentialForm: 'm² × m³ = m²⁺³ = m⁵',
  law1App2ExponentialForm: 'Interest compounded n times: (1 + r/n)^(n×t)',
  law1App3ExponentialForm: '2ⁿ × 2ᵐ = 2ⁿ⁺ᵐ (when combining memory)',
  law2App1ExponentialForm: 'N·m² ÷ m² = N·m²⁻² = N',
  law2App2ExponentialForm: '2³⁰ bytes ÷ 2⁰ seconds = bytes/sec',
  law2App3ExponentialForm: '10⁶ ÷ 10³ = 10⁶⁻³ = 10³',
  law3App1ExponentialForm: '(2^m)^n = 2^(m×n)',
  law3App2ExponentialForm: 'O((n^m)^k) = O(n^(m×k))',
  law3App3ExponentialForm: '(gain^m)^n = gain^(m×n)',
  law4App1ExponentialForm: 'l³ × w³ × h³ = (lwh)³',
  law4App2ExponentialForm: 'GDP₁^r × GDP₂^r = (GDP₁ × GDP₂)^r',
  law4App3ExponentialForm: 'x² × y² = (xy)²',
  law5App1ExponentialForm: 'mass^r ÷ volume^r = (mass/volume)^r',
  law5App2ExponentialForm: 'GDP_A^r ÷ GDP_B^r = (GDP_A/GDP_B)^r',
  law5App3ExponentialForm: 'Resistance^T ÷ Conductivity^T = (R/C)^T',
  law6App1ExponentialForm: 'n^0 = 1 (base case)',
  law6App2ExponentialForm: 'variable^(m-m) = variable^0 = 1',
  law6App3ExponentialForm: 'initial_value^0 = 1',
  // Original Numbers
  law1App1OriginalNumber: 'm² × m³',
  law1App2OriginalNumber: 'P(1 + r/n)^(n×t)',
  law1App3OriginalNumber: '2ⁿ + 2ᵐ = 2ⁿ⁺ᵐ',
  law2App1OriginalNumber: 'N·m² / m²',
  law2App2OriginalNumber: '2³⁰ bytes / 2⁰ seconds',
  law2App3OriginalNumber: '10⁶ / 10³',
  law3App1OriginalNumber: '(2^m)^n',
  law3App2OriginalNumber: 'O((n^m)^k)',
  law3App3OriginalNumber: '(gain^m)^n',
  law4App1OriginalNumber: 'l³ × w³ × h³',
  law4App2OriginalNumber: 'GDP₁^r × GDP₂^r',
  law4App3OriginalNumber: 'x² × y²',
  law5App1OriginalNumber: 'mass^r / volume^r',
  law5App2OriginalNumber: 'GDP_A^r / GDP_B^r',
  law5App3OriginalNumber: 'Resistance^T / Conductivity^T',
  law6App1OriginalNumber: 'n^0',
  law6App2OriginalNumber: 'variable^(m-m)',
  law6App3OriginalNumber: 'initial_value^0',
  // Results
  law1App1Result: 'm⁵ (total surface growth)',
  law1App2Result: 'Total compounding periods: n×t',
  law1App3Result: 'Total addressable space increases exponentially!',
  law2App1Result: 'N (Force per unit area = Pressure)',
  law2App2Result: 'Data transfer rate: bytes per second',
  law2App3Result: '10³ (scaled down by 1000x)',
  law3App1Result: '2^(m×n) total cell divisions',
  law3App2Result: 'O(n^(m×k)) complexity',
  law3App3Result: 'gain^(m×n) total amplification',
  law4App1Result: '(lwh)³ cubic units',
  law4App2Result: '(GDP₁ × GDP₂)^r combined growth',
  law4App3Result: '(xy)² uniform scaling',
  law5App1Result: '(mass/volume)^r = density^r',
  law5App2Result: '(GDP_A/GDP_B)^r ratio',
  law5App3Result: '(R/C)^T simplified ratio',
  law6App1Result: '1 (identity value)',
  law6App2Result: '1 (steady state reached)',
  law6App3Result: '1 (baseline initialization)',
  // Fun Facts
  law1App1FunFact: 'Architects use this law to calculate surface area growth when dimensions scale proportionally!',
  law1App2FunFact: 'Compound interest demonstrates exponential growth, where exponents accumulate over time!',
  law1App3FunFact: 'Computer memory addresses use base-2 exponents; combining banks adds their address space!',
  law2App1FunFact: 'Pressure calculations in physics simplify by subtracting exponents when dividing like units!',
  law2App2FunFact: 'Network speeds are calculated using exponent subtraction when dividing data by time units!',
  law2App3FunFact: 'Architectural models use exponent subtraction to calculate scale reductions accurately!',
  law3App1FunFact: 'Cell division follows exponential patterns; nested divisions multiply exponents dramatically!',
  law3App2FunFact: 'Nested loop complexity grows exponentially; each nesting level multiplies the exponent!',
  law3App3FunFact: 'Sound engineers use power-of-power law to calculate total gain when applying amplification stages!',
  law4App1FunFact: 'Volume calculations simplify when all dimensions scale with the same exponent!',
  law4App2FunFact: 'Economic models use same-exponent multiplication to combine growth factors efficiently!',
  law4App3FunFact: 'Image processing uses this law for uniform scaling, maintaining aspect ratios!',
  law5App1FunFact: 'Density calculations remain consistent when both mass and volume scale proportionally!',
  law5App2FunFact: 'Economists compare country growth ratios efficiently using same-exponent division!',
  law5App3FunFact: 'Physics equations simplify dramatically when both terms have matching temperature exponents!',
  law6App1FunFact: 'Recursive algorithms use 0-exponent as the base case, always returning 1!',
  law6App2FunFact: 'When power differences reach zero, systems achieve steady state at unity scale!',
  law6App3FunFact: 'Mathematical models initialize at 1, representing the starting point for calculations!'
};

const ExponentsRealWorld = () => {
  const { t, language } = useLanguage();
  const [selectedLaw, setSelectedLaw] = useState<number>(1);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [animatedNumber, setAnimatedNumber] = useState<string>('0');
  
  const labels = detailLabels[language];
  
  // Helper function to get translation with English fallback
  const getTranslationWithFallback = useCallback((key: string): string => {
    const translated = t(key);
    // If translation returns the key itself, it means translation doesn't exist - use English fallback
    if (translated === key || !translated) {
      return englishTranslations[key as keyof typeof englishTranslations] || key;
    }
    return translated;
  }, [t]);
  
  // Helper function to get exponential form - always use English for mathematical formulas
  const getExponentialForm = useCallback((key: string): string => {
    return englishTranslations[key as keyof typeof englishTranslations] || t(key);
  }, [t]);

  const laws = [
    {
      id: 1,
      titleKey: 'law1RealWorldTitle',
      formulaKey: 'law1Formula',
      gradientColor: 'from-blue-500 to-cyan-500',
      applications: [
        {
          lawId: 1,
          appIndex: 1,
          titleKey: 'law1App1Title',
          descKey: 'law1App1Desc',
          icon: <Building2 className="w-8 h-8" />,
          color: 'from-blue-400 to-cyan-400',
          originalNumberKey: 'law1App1OriginalNumber',
          exponentialFormKey: 'law1App1ExponentialForm',
          resultKey: 'law1App1Result',
          funFactKey: 'law1App1FunFact',
          lawTitleKey: 'law1RealWorldTitle'
        },
        {
          lawId: 1,
          appIndex: 2,
          titleKey: 'law1App2Title',
          descKey: 'law1App2Desc',
          icon: <TrendingUp className="w-8 h-8" />,
          color: 'from-green-400 to-emerald-400',
          originalNumberKey: 'law1App2OriginalNumber',
          exponentialFormKey: 'law1App2ExponentialForm',
          resultKey: 'law1App2Result',
          funFactKey: 'law1App2FunFact',
          lawTitleKey: 'law1RealWorldTitle'
        },
        {
          lawId: 1,
          appIndex: 3,
          titleKey: 'law1App3Title',
          descKey: 'law1App3Desc',
          icon: <Database className="w-8 h-8" />,
          color: 'from-purple-400 to-pink-400',
          originalNumberKey: 'law1App3OriginalNumber',
          exponentialFormKey: 'law1App3ExponentialForm',
          resultKey: 'law1App3Result',
          funFactKey: 'law1App3FunFact',
          lawTitleKey: 'law1RealWorldTitle'
        }
      ]
    },
    {
      id: 2,
      titleKey: 'law2RealWorldTitle',
      formulaKey: 'law2Formula',
      gradientColor: 'from-purple-500 to-pink-500',
      applications: [
        {
          lawId: 2,
          appIndex: 1,
          titleKey: 'law2App1Title',
          descKey: 'law2App1Desc',
          icon: <Atom className="w-8 h-8" />,
          color: 'from-red-400 to-orange-400',
          originalNumberKey: 'law2App1OriginalNumber',
          exponentialFormKey: 'law2App1ExponentialForm',
          resultKey: 'law2App1Result',
          funFactKey: 'law2App1FunFact',
          lawTitleKey: 'law2RealWorldTitle'
        },
        {
          lawId: 2,
          appIndex: 2,
          titleKey: 'law2App2Title',
          descKey: 'law2App2Desc',
          icon: <Smartphone className="w-8 h-8" />,
          color: 'from-blue-400 to-indigo-400',
          originalNumberKey: 'law2App2OriginalNumber',
          exponentialFormKey: 'law2App2ExponentialForm',
          resultKey: 'law2App2Result',
          funFactKey: 'law2App2FunFact',
          lawTitleKey: 'law2RealWorldTitle'
        },
        {
          lawId: 2,
          appIndex: 3,
          titleKey: 'law2App3Title',
          descKey: 'law2App3Desc',
          icon: <Scale className="w-8 h-8" />,
          color: 'from-teal-400 to-cyan-400',
          originalNumberKey: 'law2App3OriginalNumber',
          exponentialFormKey: 'law2App3ExponentialForm',
          resultKey: 'law2App3Result',
          funFactKey: 'law2App3FunFact',
          lawTitleKey: 'law2RealWorldTitle'
        }
      ]
    },
    {
      id: 3,
      titleKey: 'law3RealWorldTitle',
      formulaKey: 'law3Formula',
      gradientColor: 'from-green-500 to-emerald-500',
      applications: [
        {
          lawId: 3,
          appIndex: 1,
          titleKey: 'law3App1Title',
          descKey: 'law3App1Desc',
          icon: <Dna className="w-8 h-8" />,
          color: 'from-purple-400 to-pink-400',
          originalNumberKey: 'law3App1OriginalNumber',
          exponentialFormKey: 'law3App1ExponentialForm',
          resultKey: 'law3App1Result',
          funFactKey: 'law3App1FunFact',
          lawTitleKey: 'law3RealWorldTitle'
        },
        {
          lawId: 3,
          appIndex: 2,
          titleKey: 'law3App2Title',
          descKey: 'law3App2Desc',
          icon: <Zap className="w-8 h-8" />,
          color: 'from-blue-400 to-cyan-400',
          originalNumberKey: 'law3App2OriginalNumber',
          exponentialFormKey: 'law3App2ExponentialForm',
          resultKey: 'law3App2Result',
          funFactKey: 'law3App2FunFact',
          lawTitleKey: 'law3RealWorldTitle'
        },
        {
          lawId: 3,
          appIndex: 3,
          titleKey: 'law3App3Title',
          descKey: 'law3App3Desc',
          icon: <Zap className="w-8 h-8" />,
          color: 'from-yellow-400 to-orange-400',
          originalNumberKey: 'law3App3OriginalNumber',
          exponentialFormKey: 'law3App3ExponentialForm',
          resultKey: 'law3App3Result',
          funFactKey: 'law3App3FunFact',
          lawTitleKey: 'law3RealWorldTitle'
        }
      ]
    },
    {
      id: 4,
      titleKey: 'law4RealWorldTitle',
      formulaKey: 'law4Formula',
      gradientColor: 'from-orange-500 to-red-500',
      applications: [
        {
          lawId: 4,
          appIndex: 1,
          titleKey: 'law4App1Title',
          descKey: 'law4App1Desc',
          icon: <Calculator className="w-8 h-8" />,
          color: 'from-green-400 to-teal-400',
          originalNumberKey: 'law4App1OriginalNumber',
          exponentialFormKey: 'law4App1ExponentialForm',
          resultKey: 'law4App1Result',
          funFactKey: 'law4App1FunFact',
          lawTitleKey: 'law4RealWorldTitle'
        },
        {
          lawId: 4,
          appIndex: 2,
          titleKey: 'law4App2Title',
          descKey: 'law4App2Desc',
          icon: <DollarSign className="w-8 h-8" />,
          color: 'from-yellow-400 to-amber-400',
          originalNumberKey: 'law4App2OriginalNumber',
          exponentialFormKey: 'law4App2ExponentialForm',
          resultKey: 'law4App2Result',
          funFactKey: 'law4App2FunFact',
          lawTitleKey: 'law4RealWorldTitle'
        },
        {
          lawId: 4,
          appIndex: 3,
          titleKey: 'law4App3Title',
          descKey: 'law4App3Desc',
          icon: <Smartphone className="w-8 h-8" />,
          color: 'from-purple-400 to-indigo-400',
          originalNumberKey: 'law4App3OriginalNumber',
          exponentialFormKey: 'law4App3ExponentialForm',
          resultKey: 'law4App3Result',
          funFactKey: 'law4App3FunFact',
          lawTitleKey: 'law4RealWorldTitle'
        }
      ]
    },
    {
      id: 5,
      titleKey: 'law5RealWorldTitle',
      formulaKey: 'law5Formula',
      gradientColor: 'from-indigo-500 to-violet-500',
      applications: [
        {
          lawId: 5,
          appIndex: 1,
          titleKey: 'law5App1Title',
          descKey: 'law5App1Desc',
          icon: <Scale className="w-8 h-8" />,
          color: 'from-cyan-400 to-blue-400',
          originalNumberKey: 'law5App1OriginalNumber',
          exponentialFormKey: 'law5App1ExponentialForm',
          resultKey: 'law5App1Result',
          funFactKey: 'law5App1FunFact',
          lawTitleKey: 'law5RealWorldTitle'
        },
        {
          lawId: 5,
          appIndex: 2,
          titleKey: 'law5App2Title',
          descKey: 'law5App2Desc',
          icon: <TrendingUp className="w-8 h-8" />,
          color: 'from-green-400 to-emerald-400',
          originalNumberKey: 'law5App2OriginalNumber',
          exponentialFormKey: 'law5App2ExponentialForm',
          resultKey: 'law5App2Result',
          funFactKey: 'law5App2FunFact',
          lawTitleKey: 'law5RealWorldTitle'
        },
        {
          lawId: 5,
          appIndex: 3,
          titleKey: 'law5App3Title',
          descKey: 'law5App3Desc',
          icon: <Atom className="w-8 h-8" />,
          color: 'from-red-400 to-pink-400',
          originalNumberKey: 'law5App3OriginalNumber',
          exponentialFormKey: 'law5App3ExponentialForm',
          resultKey: 'law5App3Result',
          funFactKey: 'law5App3FunFact',
          lawTitleKey: 'law5RealWorldTitle'
        }
      ]
    },
    {
      id: 6,
      titleKey: 'law6RealWorldTitle',
      formulaKey: 'law6Formula',
      gradientColor: 'from-teal-500 to-cyan-500',
      applications: [
        {
          lawId: 6,
          appIndex: 1,
          titleKey: 'law6App1Title',
          descKey: 'law6App1Desc',
          icon: <Cpu className="w-8 h-8" />,
          color: 'from-blue-400 to-indigo-400',
          originalNumberKey: 'law6App1OriginalNumber',
          exponentialFormKey: 'law6App1ExponentialForm',
          resultKey: 'law6App1Result',
          funFactKey: 'law6App1FunFact',
          lawTitleKey: 'law6RealWorldTitle'
        },
        {
          lawId: 6,
          appIndex: 2,
          titleKey: 'law6App2Title',
          descKey: 'law6App2Desc',
          icon: <Atom className="w-8 h-8" />,
          color: 'from-purple-400 to-pink-400',
          originalNumberKey: 'law6App2OriginalNumber',
          exponentialFormKey: 'law6App2ExponentialForm',
          resultKey: 'law6App2Result',
          funFactKey: 'law6App2FunFact',
          lawTitleKey: 'law6RealWorldTitle'
        },
        {
          lawId: 6,
          appIndex: 3,
          titleKey: 'law6App3Title',
          descKey: 'law6App3Desc',
          icon: <Calculator className="w-8 h-8" />,
          color: 'from-green-400 to-teal-400',
          originalNumberKey: 'law6App3OriginalNumber',
          exponentialFormKey: 'law6App3ExponentialForm',
          resultKey: 'law6App3Result',
          funFactKey: 'law6App3FunFact',
          lawTitleKey: 'law6RealWorldTitle'
        }
      ]
    }
  ];

  // Extract base and exponent from exponential form for breakdown
  const extractBaseAndExponent = (expForm: string): { base: string; exponent: string } => {
    // Try patterns like "m² × m³", "2ⁿ × 2ᵐ", "(2^m)^n", "m²⁺³", etc.
    
    // Pattern 1: Extract from expressions like "m² × m³ = m²⁺³ = m⁵" - get the final result
    const resultMatch = expForm.match(/(?:=\s*)?([a-zA-Z0-9]+)([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻×]+)/);
    if (resultMatch) {
      return { base: resultMatch[1], exponent: resultMatch[2].replace(/[×]/g, '') };
    }
    
    // Pattern 2: Extract from patterns like "(2^m)^n" or "2^(m×n)"
    const powerMatch = expForm.match(/(?:\(|^)(\d+|\w+)\^(?:\w+|\([^)]+\))/);
    if (powerMatch) {
      // For complex patterns, extract first base
      const simplePower = expForm.match(/(\d+|\w+)\^(\d+|\w+)/);
      if (simplePower) {
        return { base: simplePower[1], exponent: simplePower[2] };
      }
    }
    
    // Pattern 3: Try to find any base followed by superscript (m², 2³, etc.)
    const baseExpMatch = expForm.match(/([a-zA-Z0-9]+)([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻×]+)/);
    if (baseExpMatch) {
      return { base: baseExpMatch[1], exponent: baseExpMatch[2].replace(/[×]/g, '') };
    }
    
    // Pattern 4: Fallback for number patterns
    const numberMatch = expForm.match(/(\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻×]+)/);
    if (numberMatch) {
      return { base: numberMatch[1], exponent: numberMatch[2].replace(/[×]/g, '') };
    }
    
    // Final fallback
    return { base: 'a', exponent: 'n' };
  };

  // Calculate animated number - display the result text
  useEffect(() => {
    if (selectedApplication) {
      // Get the result text with English fallback
      const resultText = getTranslationWithFallback(selectedApplication.resultKey);
      setAnimatedNumber(resultText);
    } else {
      setAnimatedNumber('0');
    }
  }, [selectedApplication, getTranslationWithFallback]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-purple-500/10 rounded-full blur-2xl"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.4, 0.2],
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 2,
            }}
            style={{
              width: 200 + (i * 30),
              height: 200 + (i * 30),
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Globe className="w-12 h-12 text-blue-400" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200"
          >
            {t('realWorldHeroTitle')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-purple-200 max-w-3xl mx-auto"
          >
            {t('realWorldHeroDescription')}
          </motion.p>
        </motion.div>

        {/* Law Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
          <div className="flex gap-2 sm:gap-3 flex-wrap justify-center">
            {laws.map((law) => {
              const lawIcons = [
                <TrendingUp className="w-5 h-5" />,
                <Scale className="w-5 h-5" />,
                <Zap className="w-5 h-5" />,
                <Calculator className="w-5 h-5" />,
                <DollarSign className="w-5 h-5" />,
                <Lightbulb className="w-5 h-5" />
              ];
              return (
                <button
                  key={law.id}
                  onClick={() => {
                    setSelectedLaw(law.id);
                    setSelectedApplication(null);
                  }}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base ${
                    selectedLaw === law.id
                      ? `bg-gradient-to-r ${law.gradientColor} shadow-lg shadow-purple-500/50 text-white`
                      : 'bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white'
                  }`}
                >
                  <span className="flex-shrink-0">{lawIcons[law.id - 1]}</span>
                  <span className="break-words">{t(law.titleKey).split(':')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Law Section with Applications */}
        <AnimatePresence mode="wait">
          {laws.map((law) => (
            selectedLaw === law.id && (
              <motion.section
                key={law.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-8"
              >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${law.gradientColor} opacity-10 blur-3xl`} />
            
            {/* Law Header */}
            <div className="relative z-10 mb-8">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600/30 to-blue-600/30 px-6 py-3 rounded-full mb-4"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                  {law.id}
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                  {t(law.titleKey)}
                </h2>
              </motion.div>

              {/* Formula */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-black/30 rounded-xl p-6 mb-6 border border-white/10"
              >
                <motion.div
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-cyan-300 font-mono"
                >
                  {t(law.formulaKey)}
                </motion.div>
              </motion.div>
            </div>

            {/* Applications Grid for this Law */}
            <div className="relative z-10 grid md:grid-cols-3 gap-6">
              {law.applications.map((app, appIdx) => (
                <motion.div
                  key={appIdx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: appIdx * 0.15 + 0.4, duration: 0.5 }}
                  onClick={() => setSelectedApplication(app)}
                  className="cursor-pointer transform transition-all duration-300 hover:scale-105"
                >
                  <div className={`bg-gradient-to-br ${app.color} p-1 rounded-2xl shadow-2xl hover:shadow-3xl`}>
                    <div className="bg-slate-900/90 backdrop-blur-lg rounded-2xl p-6 h-full border border-white/10 min-h-[250px]">
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`p-3 bg-gradient-to-br ${app.color} rounded-xl flex-shrink-0`}>
                          {app.icon}
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold break-words flex-1 leading-tight">{t(app.titleKey)}</h3>
                      </div>
                      <p className="text-purple-200 mb-4 text-sm leading-relaxed break-words min-h-[80px]">{t(app.descKey)}</p>
                      <div className="bg-white/5 rounded-lg p-3 font-mono text-center border-2 border-yellow-400/50">
                        <div className="text-xl font-bold text-yellow-300 break-words">
                          {getExponentialForm(app.exponentialFormKey)}
                        </div>
                      </div>
                      {selectedApplication?.lawId === app.lawId && selectedApplication?.appIndex === app.appIndex && (
                        <div className="mt-3 text-center text-sm text-cyan-300 font-semibold animate-pulse">
                          Click to see details →
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
            )
          ))}
        </AnimatePresence>

        {/* Detailed View */}
        {selectedApplication && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <div className={`bg-gradient-to-br ${selectedApplication.color} p-1 rounded-3xl shadow-2xl`}>
                <div className="bg-slate-900/95 backdrop-blur-lg rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 border border-white/20">
                  <div className="flex items-start justify-between mb-8 gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className={`p-3 sm:p-4 md:p-5 bg-gradient-to-br ${selectedApplication.color} rounded-xl flex-shrink-0`}>
                        {selectedApplication.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs sm:text-sm text-purple-300 mb-1">{t(selectedApplication.lawTitleKey).split(':')[0]}</div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold break-words leading-tight">{t(selectedApplication.titleKey)}</h2>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedApplication(null)}
                      className="text-white/60 hover:text-white text-2xl font-bold transition-all flex-shrink-0"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                    {/* Left: Calculation */}
                    <div className="space-y-4 sm:space-y-6">
                      <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
                        <h3 className="text-lg sm:text-xl font-bold mb-4 text-cyan-300 break-words flex items-center gap-2">
                          <span>📝</span>
                          <span>{labels.originalNumber}</span>
                        </h3>
                        <div className="bg-gradient-to-r from-red-600/30 to-orange-600/30 rounded-xl p-3 sm:p-4 font-mono text-base sm:text-lg break-all">
                          {getTranslationWithFallback(selectedApplication.originalNumberKey)}
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
                        <h3 className="text-lg sm:text-xl font-bold mb-4 text-green-300 break-words flex items-center gap-2">
                          <span>✨</span>
                          <span>{labels.exponentialForm}</span>
                        </h3>
                        <div className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 rounded-xl p-3 sm:p-4 font-mono text-xl sm:text-2xl text-center font-bold break-words">
                          {getExponentialForm(selectedApplication.exponentialFormKey)}
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
                        <h3 className="text-lg sm:text-xl font-bold mb-4 text-purple-300 break-words flex items-center gap-2">
                          <span>🔢</span>
                          <span>{labels.breakdown}</span>
                        </h3>
                        <div className="space-y-2 sm:space-y-3">
                          {(() => {
                            const expForm = getExponentialForm(selectedApplication.exponentialFormKey);
                            const { base, exponent } = extractBaseAndExponent(expForm);
                            return (
                              <>
                                <div className="flex items-center justify-between bg-blue-600/20 rounded-lg p-2 sm:p-3">
                                  <span className="font-semibold text-sm sm:text-base break-words">{labels.base}:</span>
                                  <span className="text-xl sm:text-2xl font-bold text-blue-300 break-words">{base}</span>
                                </div>
                                <div className="flex items-center justify-between bg-purple-600/20 rounded-lg p-2 sm:p-3">
                                  <span className="font-semibold text-sm sm:text-base break-words">{labels.exponent}:</span>
                                  <span className="text-xl sm:text-2xl font-bold text-purple-300 break-words">{exponent}</span>
                                </div>
                                <div className="flex items-center justify-between bg-pink-600/20 rounded-lg p-2 sm:p-3">
                                  <span className="font-semibold text-sm sm:text-base break-words">{labels.result}:</span>
                                  <span className="text-lg sm:text-xl font-bold text-pink-300 break-words">{getTranslationWithFallback(selectedApplication.resultKey)}</span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Right: Visualization */}
                    <div className="space-y-4 sm:space-y-6">
                      <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
                        <h3 className="text-lg sm:text-xl font-bold mb-4 text-yellow-300 break-words flex items-center gap-2">
                          <span>🎯</span>
                          <span>{labels.whatThisMeans}</span>
                        </h3>
                        <p className="text-base sm:text-lg leading-relaxed text-purple-200 break-words">{t(selectedApplication.descKey)}</p>
                      </div>

                      <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-2xl p-4 sm:p-6 border border-yellow-400/30">
                        <h3 className="text-lg sm:text-xl font-bold mb-4 text-yellow-300 break-words flex items-center gap-2">
                          <span>💡</span>
                          <span>{labels.funFact}</span>
                        </h3>
                        <p className="text-base sm:text-lg leading-relaxed break-words">{getTranslationWithFallback(selectedApplication.funFactKey)}</p>
                      </div>

                      <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
                        <h3 className="text-lg sm:text-xl font-bold mb-4 text-cyan-300 break-words flex items-center gap-2">
                          <span>🧮</span>
                          <span>{labels.animatedCalculation}</span>
                        </h3>
                        <div className="bg-gradient-to-r from-cyan-600/30 to-blue-600/30 rounded-xl p-4 sm:p-6 text-center overflow-hidden">
                          <div className="text-sm text-cyan-200 mb-2 break-words">
                            {(() => {
                              const expForm = getExponentialForm(selectedApplication.exponentialFormKey);
                              const { base, exponent } = extractBaseAndExponent(expForm);
                              return (
                                <span>
                                  {base}<sup>{exponent}</sup> =
                                </span>
                              );
                            })()}
                          </div>
                          <div className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono text-yellow-300 animate-pulse break-all overflow-wrap-anywhere px-2 whitespace-normal">
                            {animatedNumber}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-2xl p-4 sm:p-6 border border-indigo-400/30">
                        <h3 className="text-lg sm:text-xl font-bold mb-4 text-indigo-300 break-words">📚 {labels.whyUseExponents}</h3>
                        <ul className="space-y-2 text-purple-200 break-words">
                          <li className="flex items-start gap-2">
                            <span className="text-green-400 flex-shrink-0">✓</span>
                            <span>{labels.reason1}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-400 flex-shrink-0">✓</span>
                            <span>{labels.reason2}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-400 flex-shrink-0">✓</span>
                            <span>{labels.reason3}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-400 flex-shrink-0">✓</span>
                            <span>{labels.reason4}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ExponentsRealWorld;
