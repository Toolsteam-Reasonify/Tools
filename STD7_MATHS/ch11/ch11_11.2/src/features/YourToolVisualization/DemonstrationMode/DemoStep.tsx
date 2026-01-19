import { useEffect, useState } from 'react';

type Props = {
  title: string;
  description: string;
  example?: string;
  isActive?: boolean;
  stepNumber?: number;
};

export default function DemoStep({ title, description, example, isActive = true, stepNumber }: Props) {
  const [showContent, setShowContent] = useState(false);
  const [animateText, setAnimateText] = useState(false);
  const [highlightExample, setHighlightExample] = useState(false);
  const [currentDescWord, setCurrentDescWord] = useState(0);

  useEffect(() => {
    if (isActive) {
      // Stagger animations for better educational flow
      const timer1 = setTimeout(() => setShowContent(true), 300);
      const timer2 = setTimeout(() => setAnimateText(true), 700);
      const timer3 = setTimeout(() => setHighlightExample(true), 6500);
      
      
      // Word-by-word animation for description
      const descWordTimer = setTimeout(() => setCurrentDescWord(1), 1200);
      const descWordTimer2 = setTimeout(() => setCurrentDescWord(2), 1400);
      const descWordTimer3 = setTimeout(() => setCurrentDescWord(3), 1600);
      const descWordTimer4 = setTimeout(() => setCurrentDescWord(4), 1800);
      const descWordTimer5 = setTimeout(() => setCurrentDescWord(5), 2000);
      const descWordTimer6 = setTimeout(() => setCurrentDescWord(6), 2200);
      const descWordTimer7 = setTimeout(() => setCurrentDescWord(7), 2400);
      const descWordTimer8 = setTimeout(() => setCurrentDescWord(8), 2600);
      const descWordTimer9 = setTimeout(() => setCurrentDescWord(9), 2800);
      const descWordTimer10 = setTimeout(() => setCurrentDescWord(10), 3000);
      const descWordTimer11 = setTimeout(() => setCurrentDescWord(11), 3200);
      const descWordTimer12 = setTimeout(() => setCurrentDescWord(12), 3400);
      const descWordTimer13 = setTimeout(() => setCurrentDescWord(13), 3600);
      const descWordTimer14 = setTimeout(() => setCurrentDescWord(14), 3800);
      const descWordTimer15 = setTimeout(() => setCurrentDescWord(15), 4000);
      const descWordTimer16 = setTimeout(() => setCurrentDescWord(16), 4200);
      const descWordTimer17 = setTimeout(() => setCurrentDescWord(17), 4400);
      const descWordTimer18 = setTimeout(() => setCurrentDescWord(18), 4600);
      const descWordTimer19 = setTimeout(() => setCurrentDescWord(19), 4800);
      const descWordTimer20 = setTimeout(() => setCurrentDescWord(20), 5000);
      const descWordTimer21 = setTimeout(() => setCurrentDescWord(21), 5200);
      const descWordTimer22 = setTimeout(() => setCurrentDescWord(22), 5400);
      const descWordTimer23 = setTimeout(() => setCurrentDescWord(23), 5600);
      const descWordTimer24 = setTimeout(() => setCurrentDescWord(24), 5800);
      const descWordTimer25 = setTimeout(() => setCurrentDescWord(25), 6000);
      const descWordTimer26 = setTimeout(() => setCurrentDescWord(26), 6200);
      const descWordTimer27 = setTimeout(() => setCurrentDescWord(27), 6400);
      const descWordTimer28 = setTimeout(() => setCurrentDescWord(28), 6600);
      const descWordTimer29 = setTimeout(() => setCurrentDescWord(29), 6800);
      const descWordTimer30 = setTimeout(() => setCurrentDescWord(30), 7000);
      const descWordTimer31 = setTimeout(() => setCurrentDescWord(31), 7200);
      const descWordTimer32 = setTimeout(() => setCurrentDescWord(32), 7400);
      const descWordTimer33 = setTimeout(() => setCurrentDescWord(33), 7600);
      const descWordTimer34 = setTimeout(() => setCurrentDescWord(34), 7800);
      const descWordTimer35 = setTimeout(() => setCurrentDescWord(35), 8000);
      const descWordTimer36 = setTimeout(() => setCurrentDescWord(36), 8200);
      const descWordTimer37 = setTimeout(() => setCurrentDescWord(37), 8400);
      const descWordTimer38 = setTimeout(() => setCurrentDescWord(38), 8600);
      const descWordTimer39 = setTimeout(() => setCurrentDescWord(39), 8800);
      const descWordTimer40 = setTimeout(() => setCurrentDescWord(40), 9000);
      const descWordTimer41 = setTimeout(() => setCurrentDescWord(41), 9200);
      const descWordTimer42 = setTimeout(() => setCurrentDescWord(42), 9400);
      const descWordTimer43 = setTimeout(() => setCurrentDescWord(43), 9600);
      const descWordTimer44 = setTimeout(() => setCurrentDescWord(44), 9800);
      const descWordTimer45 = setTimeout(() => setCurrentDescWord(45), 10000);
      const descWordTimer46 = setTimeout(() => setCurrentDescWord(46), 10200);
      const descWordTimer47 = setTimeout(() => setCurrentDescWord(47), 10400);
      const descWordTimer48 = setTimeout(() => setCurrentDescWord(48), 10600);
      const descWordTimer49 = setTimeout(() => setCurrentDescWord(49), 10800);
      const descWordTimer50 = setTimeout(() => setCurrentDescWord(50), 11000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(descWordTimer);
        clearTimeout(descWordTimer2);
        clearTimeout(descWordTimer3);
        clearTimeout(descWordTimer4);
        clearTimeout(descWordTimer5);
        clearTimeout(descWordTimer6);
        clearTimeout(descWordTimer7);
        clearTimeout(descWordTimer8);
        clearTimeout(descWordTimer9);
        clearTimeout(descWordTimer10);
        clearTimeout(descWordTimer11);
        clearTimeout(descWordTimer12);
        clearTimeout(descWordTimer13);
        clearTimeout(descWordTimer14);
        clearTimeout(descWordTimer15);
        clearTimeout(descWordTimer16);
        clearTimeout(descWordTimer17);
        clearTimeout(descWordTimer18);
        clearTimeout(descWordTimer19);
        clearTimeout(descWordTimer20);
        clearTimeout(descWordTimer21);
        clearTimeout(descWordTimer22);
        clearTimeout(descWordTimer23);
        clearTimeout(descWordTimer24);
        clearTimeout(descWordTimer25);
        clearTimeout(descWordTimer26);
        clearTimeout(descWordTimer27);
        clearTimeout(descWordTimer28);
        clearTimeout(descWordTimer29);
        clearTimeout(descWordTimer30);
        clearTimeout(descWordTimer31);
        clearTimeout(descWordTimer32);
        clearTimeout(descWordTimer33);
        clearTimeout(descWordTimer34);
        clearTimeout(descWordTimer35);
        clearTimeout(descWordTimer36);
        clearTimeout(descWordTimer37);
        clearTimeout(descWordTimer38);
        clearTimeout(descWordTimer39);
        clearTimeout(descWordTimer40);
        clearTimeout(descWordTimer41);
        clearTimeout(descWordTimer42);
        clearTimeout(descWordTimer43);
        clearTimeout(descWordTimer44);
        clearTimeout(descWordTimer45);
        clearTimeout(descWordTimer46);
        clearTimeout(descWordTimer47);
        clearTimeout(descWordTimer48);
        clearTimeout(descWordTimer49);
        clearTimeout(descWordTimer50);
      };
    } else {
      setShowContent(false);
      setAnimateText(false);
      setHighlightExample(false);
      setCurrentDescWord(0);
    }
  }, [isActive]);

  return (
    <div className={`relative overflow-hidden rounded-xl transition-all duration-700 ease-out transform ${
      isActive 
        ? 'shadow-2xl scale-105 bg-gradient-to-br from-teal-50 via-purple-50 to-indigo-50 border-2 border-teal-300' 
        : 'shadow-lg bg-white border border-gray-200 hover:shadow-xl'
    }`}>
      {/* Animated Background Pattern */}
      {isActive && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-teal-400 to-purple-400 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-purple-400 to-teal-400 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      )}
      
      {/* Main Content Container */}
      <div className="relative p-6 z-10">
        {/* Step Header with Number Badge */}
        <div className={`flex items-center mb-4 transition-all duration-800 ${
          showContent ? 'transform translate-x-0 opacity-100' : 'transform -translate-x-6 opacity-0'
        }`}>
          {stepNumber && (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 transition-all duration-600 ${
              isActive 
                ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white scale-110 shadow-lg animate-bounce-gentle' 
                : 'bg-gray-300 text-gray-600'
            }`}>
              {stepNumber}
            </div>
          )}
          
          <div className={`font-semibold text-lg transition-all duration-700 ${
            isActive 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-purple-700' 
              : 'text-gray-700'
          }`}>
            {title}
          </div>
        </div>
        
        {/* Animated Content Box */}
        <div className={`relative transition-all duration-900 ease-out ${
          animateText ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
        }`}>
          {/* Content Background with Learning Enhancement */}
          <div className={`p-4 rounded-lg transition-all duration-600 ${
            isActive 
              ? 'bg-white/90 backdrop-blur-sm border border-teal-200/60 shadow-inner' 
              : 'bg-gray-50/30'
          }`}>
            <p className={`mt-1 whitespace-pre-line leading-relaxed transition-all duration-700 ${
              isActive ? 'text-gray-800' : 'text-slate-600'
            }`}>
              {isActive ? (
                <div className="flex flex-wrap">
                  {description.split(' ').map((word, index) => (
                    <span
                      key={index}
                      className={`transition-all duration-300 ${
                        currentDescWord >= index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}
                    >
                      {word}
                      {index < description.split(' ').length - 1 && <span className="inline-block w-1"></span>}
                    </span>
                  ))}
                </div>
              ) : (
                description
              )}
            </p>
          </div>
        </div>

        {/* Enhanced Example Section */}
        {example && (
          <div className={`mt-4 transition-all duration-1000 ease-out ${
            highlightExample ? 'opacity-100 transform translate-y-0 scale-100' : 'opacity-0 transform translate-y-3 scale-95'
          }`}>
            <div className={`p-4 rounded-lg font-mono text-lg relative overflow-hidden transition-all duration-600 ${
              isActive 
                ? 'bg-gradient-to-r from-teal-50 to-purple-50 border-2 border-teal-200 shadow-lg transform scale-105' 
                : 'bg-gray-50 border border-gray-100'
            }`}>
              {/* Enhanced Mathematical Expression */}
              <div className={`transition-all duration-700 relative text-center ${
                isActive ? 'text-gray-800 font-bold' : 'text-gray-600'
              }`}>
                <div className={`inline-block px-8 py-5 rounded-2xl relative overflow-hidden transition-all duration-700 ${
                  isActive 
                    ? 'bg-white border-2 border-teal-300 shadow-xl shadow-teal-200/50 animate-math-highlight' 
                    : 'bg-white/80 border border-gray-200 shadow-sm'
                }`}>
                  {/* Clean Gradient Border Effect */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-200 via-purple-200/50 to-teal-200 p-0.5">
                      <div className="w-full h-full bg-white rounded-2xl" />
                    </div>
                  )}
                  
                  {/* Mathematical Content with Dynamic Effects */}
                  <div className="relative z-10">
                    <div className={`text-2xl font-mono font-bold tracking-wider transition-all duration-500 inline-block ${
                      isActive ? 'animate-gradient-shift' : ''
                    }`} style={isActive ? {
                      background: 'linear-gradient(-45deg, #0d9488, #6366f1, #8b5cf6, #0d9488)',
                      backgroundSize: '400% 400%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    } : {}}>
                      {isActive ? (
                        <span className="inline-block overflow-hidden whitespace-nowrap animate-typewriter" style={{ maxWidth: '100%' }}>
                          {example}
                        </span>
                      ) : (
                        <span className="text-gray-600">{example}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Subtle Glow Effect */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-100/30 via-white/10 to-purple-100/30 rounded-2xl animate-pulse opacity-50" />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
