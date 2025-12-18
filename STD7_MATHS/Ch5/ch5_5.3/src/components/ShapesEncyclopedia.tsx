import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Shape {
  name: string;
  definition: string;
  properties: string[];
  category: '2D' | '3D';
  translations: {
    en: { name: string; definition: string; properties: string[] };
    hi: { name: string; definition: string; properties: string[] };
    gu: { name: string; definition: string; properties: string[] };
  };
}

interface ShapesEncyclopediaProps {
  language: 'en' | 'hi' | 'gu';
}

const shapes: Shape[] = [
  {
    name: 'Circle',
    definition: 'A round plane figure whose boundary consists of points equidistant from a fixed center point.',
    properties: ['Radius (r)', 'Diameter (d = 2r)', 'Circumference (C = 2πr)', 'Area (A = πr²)'],
    category: '2D',
    translations: {
      en: {
        name: 'Circle',
        definition: 'A round plane figure whose boundary consists of points equidistant from a fixed center point.',
        properties: ['Radius (r)', 'Diameter (d = 2r)', 'Circumference (C = 2πr)', 'Area (A = πr²)']
      },
      hi: {
        name: 'वृत्त',
        definition: 'एक गोल समतल आकृति जिसकी सीमा एक निश्चित केंद्र बिंदु से समान दूरी पर स्थित बिंदुओं से बनी होती है।',
        properties: ['त्रिज्या (r)', 'व्यास (d = 2r)', 'परिधि (C = 2πr)', 'क्षेत्रफल (A = πr²)']
      },
      gu: {
        name: 'વર્તુળ',
        definition: 'એક ગોળ સમતલ આકૃતિ જેની સીમા એક નિશ્ચિત કેન્દ્ર બિંદુથી સમાન અંતરે સ્થિત બિંદુઓથી બનેલી છે।',
        properties: ['ત્રિજ્યા (r)', 'વ્યાસ (d = 2r)', 'પરિધિ (C = 2πr)', 'ક્ષેત્રફળ (A = πr²)']
      }
    }
  },
  {
    name: 'Rectangle',
    definition: 'A quadrilateral with four right angles and opposite sides that are equal and parallel.',
    properties: ['Length (l)', 'Width (w)', 'Perimeter (P = 2(l + w))', 'Area (A = l × w)'],
    category: '2D',
    translations: {
      en: {
        name: 'Rectangle',
        definition: 'A quadrilateral with four right angles and opposite sides that are equal and parallel.',
        properties: ['Length (l)', 'Width (w)', 'Perimeter (P = 2(l + w))', 'Area (A = l × w)']
      },
      hi: {
        name: 'आयत',
        definition: 'एक चतुर्भुज जिसके चार समकोण होते हैं और विपरीत भुजाएं बराबर और समानांतर होती हैं।',
        properties: ['लंबाई (l)', 'चौड़ाई (w)', 'परिमाप (P = 2(l + w))', 'क्षेत्रफल (A = l × w)']
      },
      gu: {
        name: 'લંબચોરસ',
        definition: 'એક ચતુષ્કોણ જેના ચાર કાટકોણ હોય છે અને વિરુદ્ધ બાજુઓ સમાન અને સમાંતર હોય છે।',
        properties: ['લંબાઈ (l)', 'પહોળાઈ (w)', 'પરિમાપ (P = 2(l + w))', 'ક્ષેત્રફળ (A = l × w)']
      }
    }
  },
  {
    name: 'Square',
    definition: 'A regular quadrilateral with four equal sides and four right angles.',
    properties: ['Side (s)', 'Perimeter (P = 4s)', 'Area (A = s²)', 'Diagonal (d = s√2)'],
    category: '2D',
    translations: {
      en: {
        name: 'Square',
        definition: 'A regular quadrilateral with four equal sides and four right angles.',
        properties: ['Side (s)', 'Perimeter (P = 4s)', 'Area (A = s²)', 'Diagonal (d = s√2)']
      },
      hi: {
        name: 'वर्ग',
        definition: 'एक नियमित चतुर्भुज जिसकी चार बराबर भुजाएं और चार समकोण होते हैं।',
        properties: ['भुजा (s)', 'परिमाप (P = 4s)', 'क्षेत्रफल (A = s²)', 'विकर्ण (d = s√2)']
      },
      gu: {
        name: 'ચોરસ',
        definition: 'એક નિયમિત ચતુષ્કોણ જેના ચાર સમાન બાજુઓ અને ચાર કાટકોણ હોય છે।',
        properties: ['બાજુ (s)', 'પરિમાપ (P = 4s)', 'ક્ષેત્રફળ (A = s²)', 'વિકર્ણ (d = s√2)']
      }
    }
  },
  {
    name: 'Triangle',
    definition: 'A polygon with three edges and three vertices, forming three angles that sum to 180°.',
    properties: ['Base (b)', 'Height (h)', 'Perimeter (P = a + b + c)', 'Area (A = ½bh)'],
    category: '2D',
    translations: {
      en: {
        name: 'Triangle',
        definition: 'A polygon with three edges and three vertices, forming three angles that sum to 180°.',
        properties: ['Base (b)', 'Height (h)', 'Perimeter (P = a + b + c)', 'Area (A = ½bh)']
      },
      hi: {
        name: 'त्रिभुज',
        definition: 'एक बहुभुज जिसमें तीन किनारे और तीन शीर्ष होते हैं, जो तीन कोण बनाते हैं जिनका योग 180° होता है।',
        properties: ['आधार (b)', 'ऊंचाई (h)', 'परिमाप (P = a + b + c)', 'क्षेत्रफल (A = ½bh)']
      },
      gu: {
        name: 'ત્રિકોણ',
        definition: 'એક બહુકોણ જેમાં ત્રણ કિનારા અને ત્રણ શિરોબિંદુઓ હોય છે, જે ત્રણ કોણ બનાવે છે જેનો સરવાળો 180° હોય છે।',
        properties: ['પાયો (b)', 'ઊંચાઈ (h)', 'પરિમાપ (P = a + b + c)', 'ક્ષેત્રફળ (A = ½bh)']
      }
    }
  },
  {
    name: 'Quadrilateral',
    definition: 'A polygon with four sides, four vertices, and four angles that sum to 360°.',
    properties: ['Four sides', 'Four vertices', 'Sum of angles = 360°', 'Examples: square, rectangle, trapezoid'],
    category: '2D',
    translations: {
      en: {
        name: 'Quadrilateral',
        definition: 'A polygon with four sides, four vertices, and four angles that sum to 360°.',
        properties: ['Four sides', 'Four vertices', 'Sum of angles = 360°', 'Examples: square, rectangle, trapezoid']
      },
      hi: {
        name: 'चतुर्भुज',
        definition: 'एक बहुभुज जिसमें चार भुजाएं, चार शीर्ष और चार कोण होते हैं जिनका योग 360° होता है।',
        properties: ['चार भुजाएं', 'चार शीर्ष', 'कोणों का योग = 360°', 'उदाहरण: वर्ग, आयत, समलंब']
      },
      gu: {
        name: 'ચતુષ્કોણ',
        definition: 'એક બહુકોણ જેમાં ચાર બાજુઓ, ચાર શિરોબિંદુઓ અને ચાર કોણ હોય છે જેનો સરવાળો 360° હોય છે।',
        properties: ['ચાર બાજુઓ', 'ચાર શિરોબિંદુઓ', 'કોણોનો સરવાળો = 360°', 'ઉદાહરણો: ચોરસ, લંબચોરસ, સમલંબ']
      }
    }
  },
  {
    name: 'Cuboid',
    definition: 'A three-dimensional rectangular box with six rectangular faces at right angles to each other.',
    properties: ['Length (l)', 'Width (w)', 'Height (h)', 'Volume (V = l × w × h)', 'Surface Area (SA = 2(lw + lh + wh))'],
    category: '3D',
    translations: {
      en: {
        name: 'Cuboid',
        definition: 'A three-dimensional rectangular box with six rectangular faces at right angles to each other.',
        properties: ['Length (l)', 'Width (w)', 'Height (h)', 'Volume (V = l × w × h)', 'Surface Area (SA = 2(lw + lh + wh))']
      },
      hi: {
        name: 'घनाभ',
        definition: 'एक त्रि-आयामी आयताकार बॉक्स जिसमें छह आयताकार फलक एक-दूसरे के समकोण पर होते हैं।',
        properties: ['लंबाई (l)', 'चौड़ाई (w)', 'ऊंचाई (h)', 'आयतन (V = l × w × h)', 'पृष्ठीय क्षेत्रफल (SA = 2(lw + lh + wh))']
      },
      gu: {
        name: 'ઘનાભ',
        definition: 'એક ત્રિ-પરિમાણીય લંબચોરસ બોક્સ જેમાં છ લંબચોરસ ફલક એક-બીજાના કાટકોણ પર હોય છે।',
        properties: ['લંબાઈ (l)', 'પહોળાઈ (w)', 'ઊંચાઈ (h)', 'આયતન (V = l × w × h)', 'પૃષ્ઠીય ક્ષેત્રફળ (SA = 2(lw + lh + wh))']
      }
    }
  },
  {
    name: 'Cylinder',
    definition: 'A three-dimensional solid with two parallel circular bases connected by a curved surface.',
    properties: ['Radius (r)', 'Height (h)', 'Volume (V = πr²h)', 'Surface Area (SA = 2πr² + 2πrh)'],
    category: '3D',
    translations: {
      en: {
        name: 'Cylinder',
        definition: 'A three-dimensional solid with two parallel circular bases connected by a curved surface.',
        properties: ['Radius (r)', 'Height (h)', 'Volume (V = πr²h)', 'Surface Area (SA = 2πr² + 2πrh)']
      },
      hi: {
        name: 'बेलन',
        definition: 'एक त्रि-आयामी ठोस जिसमें दो समानांतर वृत्ताकार आधार एक घुमावदार सतह से जुड़े होते हैं।',
        properties: ['त्रिज्या (r)', 'ऊंचाई (h)', 'आयतन (V = πr²h)', 'पृष्ठीय क्षेत्रफल (SA = 2πr² + 2πrh)']
      },
      gu: {
        name: 'સિલિન્ડર',
        definition: 'એક ત્રિ-પરિમાણીય ઘન જેમાં બે સમાંતર વર્તુળાકાર પાયા વક્ર સપાટી દ્વારા જોડાયેલા હોય છે।',
        properties: ['ત્રિજ્યા (r)', 'ઊંચાઈ (h)', 'આયતન (V = πr²h)', 'પૃષ્ઠીય ક્ષેત્રફળ (SA = 2πr² + 2πrh)']
      }
    }
  },
  {
    name: 'Cube',
    definition: 'A cube net consists of 6 squares arranged in a cross pattern. When folded along the edges, it forms a 3D cube with 6 equal square faces.',
    properties: ['6 squares in cross pattern', '11 different net arrangements possible', 'Each square represents one face', 'Folds to form perfect cube'],
    category: '2D',
    translations: {
      en: {
        name: 'Cube Net',
        definition: 'A cube net consists of 6 squares arranged in a cross pattern. When folded along the edges, it forms a 3D cube with 6 equal square faces.',
        properties: ['6 squares in cross pattern', '11 different net arrangements possible', 'Each square represents one face', 'Folds to form perfect cube']
      },
      hi: {
        name: 'घन नेट',
        definition: 'घन नेट में क्रॉस पैटर्न में व्यवस्थित 6 वर्ग होते हैं। किनारों पर मुड़ने पर यह 6 बराबर वर्गाकार फलकों वाला 3D घन बनाता है।',
        properties: ['क्रॉस पैटर्न में 6 वर्ग', '11 अलग-अलग नेट व्यवस्थाएं संभव', 'प्रत्येक वर्ग एक फलक का प्रतिनिधित्व करता है', 'पूर्ण घन बनाने के लिए मुड़ता है']
      },
      gu: {
        name: 'ઘન નેટ',
        definition: 'ઘન નેટમાં ક્રોસ પેટર્નમાં ગોઠવાયેલા 6 ચોરસ હોય છે। કિનારાઓ પર મુડવાથી તે 6 સમાન ચોરસ ફલકોવાળો 3D ઘન બનાવે છે।',
        properties: ['ક્રોસ પેટર્નમાં 6 ચોરસ', '11 અલગ-અલગ નેટ વ્યવસ્થાઓ શક્ય', 'દરેક ચોરસ એક ફલકનું પ્રતિનિધિત્વ કરે છે', 'સંપૂર્ણ ઘન બનાવવા માટે મુડે છે']
      }
    }
  },
  {
    name: 'Sphere',
    definition: 'A perfectly round three-dimensional object where every point on its surface is equidistant from its center.',
    properties: ['Radius (r)', 'Volume (V = 4/3πr³)', 'Surface Area (SA = 4πr²)', 'Diameter (d = 2r)'],
    category: '3D',
    translations: {
      en: {
        name: 'Sphere',
        definition: 'A perfectly round three-dimensional object where every point on its surface is equidistant from its center.',
        properties: ['Radius (r)', 'Volume (V = 4/3πr³)', 'Surface Area (SA = 4πr²)', 'Diameter (d = 2r)']
      },
      hi: {
        name: 'गोला',
        definition: 'एक पूर्णतः गोल त्रि-आयामी वस्तु जहां इसकी सतह पर प्रत्येक बिंदु इसके केंद्र से समान दूरी पर होता है।',
        properties: ['त्रिज्या (r)', 'आयतन (V = 4/3πr³)', 'पृष्ठीय क्षेत्रफल (SA = 4πr²)', 'व्यास (d = 2r)']
      },
      gu: {
        name: 'ગોળક',
        definition: 'એક સંપૂર્ણ ગોળ ત્રિ-પરિમાણીય વસ્તુ જ્યાં તેની સપાટી પરનો દરેક બિંદુ તેના કેન્દ્રથી સમાન અંતરે હોય છે।',
        properties: ['ત્રિજ્યા (r)', 'આયતન (V = 4/3πr³)', 'પૃષ્ઠીય ક્ષેત્રફળ (SA = 4πr²)', 'વ્યાસ (d = 2r)']
      }
    }
  },
  {
    name: 'Pyramid',
    definition: 'A three-dimensional polyhedron with a polygonal base and triangular faces that meet at a single apex point.',
    properties: ['Base area (B)', 'Height (h)', 'Volume (V = 1/3Bh)', 'Slant height (l)'],
    category: '3D',
    translations: {
      en: {
        name: 'Pyramid',
        definition: 'A three-dimensional polyhedron with a polygonal base and triangular faces that meet at a single apex point.',
        properties: ['Base area (B)', 'Height (h)', 'Volume (V = 1/3Bh)', 'Slant height (l)']
      },
      hi: {
        name: 'पिरामिड',
        definition: 'एक त्रि-आयामी बहुफलक जिसमें एक बहुभुजीय आधार और त्रिभुजाकार फलक होते हैं जो एक शीर्ष बिंदु पर मिलते हैं।',
        properties: ['आधार क्षेत्रफल (B)', 'ऊंचाई (h)', 'आयतन (V = 1/3Bh)', 'तिरछी ऊंचाई (l)']
      },
      gu: {
        name: 'પિરામિડ',
        definition: 'એક ત્રિ-પરિમાણીય બહુફલક જેમાં એક બહુકોણીય પાયો અને ત્રિકોણાકાર ફલક હોય છે જે એક શિરોબિંદુ પર મળે છે।',
        properties: ['પાયો ક્ષેત્રફળ (B)', 'ઊંચાઈ (h)', 'આયતન (V = 1/3Bh)', 'ત્રાંસી ઊંચાઈ (l)']
      }
    }
  },
  {
    name: 'Cone',
    definition: 'A cone net consists of a circular base and a triangular sector. The triangular sector forms the curved surface when folded into a cone shape.',
    properties: ['Circular base', 'Triangular sector', 'Sector angle determines cone height', 'Folds to form cone with apex'],
    category: '2D',
    translations: {
      en: {
        name: 'Cone Net',
        definition: 'A cone net consists of a circular base and a triangular sector. The triangular sector forms the curved surface when folded into a cone shape.',
        properties: ['Circular base', 'Triangular sector', 'Sector angle determines cone height', 'Folds to form cone with apex']
      },
      hi: {
        name: 'शंकु नेट',
        definition: 'शंकु नेट में एक वृत्ताकार आधार और एक त्रिभुजाकार क्षेत्र होता है। त्रिभुजाकार क्षेत्र शंकु आकृति में मुड़ने पर घुमावदार सतह बनाता है।',
        properties: ['वृत्ताकार आधार', 'त्रिभुजाकार क्षेत्र', 'क्षेत्र कोण शंकु की ऊंचाई निर्धारित करता है', 'शीर्ष के साथ शंकु बनाने के लिए मुड़ता है']
      },
      gu: {
        name: 'શંકુ નેટ',
        definition: 'શંકુ નેટમાં એક વર્તુળાકાર પાયો અને એક ત્રિકોણાકાર ક્ષેત્ર હોય છે। ત્રિકોણાકાર ક્ષેત્ર શંકુ આકૃતિમાં મુડવાથી વક્ર સપાટી બનાવે છે।',
        properties: ['વર્તુળાકાર પાયો', 'ત્રિકોણાકાર ક્ષેત્ર', 'ક્ષેત્ર કોણ શંકુની ઊંચાઈ નક્કી કરે છે', 'શિરોબિંદુ સાથે શંકુ બનાવવા માટે મુડે છે']
      }
    }
  }
];

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideIn {
    from { opacity: 0; transform: scale(0.8) rotate(-5deg); }
    to { opacity: 1; transform: scale(1) rotate(0deg); }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  .animate-slide-in {
    animation: slideIn 0.6s ease-out forwards;
  }
`;

const ShapeSVG: React.FC<{ shapeName: string }> = ({ shapeName }) => {
  const renderShape = () => {
    switch (shapeName) {
      case 'Circle':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="70" fill="#14b8a6" stroke="#0d9488" strokeWidth="3" />
            <line x1="100" y1="100" x2="170" y2="100" stroke="#0d9488" strokeWidth="2" strokeDasharray="5,5" />
            <circle cx="100" cy="100" r="3" fill="#0d9488" />
            <text x="135" y="95" fill="#0d9488" fontSize="14" fontWeight="bold">r</text>
          </svg>
        );
      
      case 'Rectangle':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <rect x="40" y="60" width="120" height="80" fill="#14b8a6" stroke="#0d9488" strokeWidth="3" />
            <text x="95" y="105" fill="#fff" fontSize="14" fontWeight="bold">l</text>
            <text x="25" y="105" fill="#0d9488" fontSize="14" fontWeight="bold">w</text>
          </svg>
        );
      
      case 'Square':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <rect x="50" y="50" width="100" height="100" fill="#14b8a6" stroke="#0d9488" strokeWidth="3" />
            <text x="95" y="105" fill="#fff" fontSize="14" fontWeight="bold">s</text>
          </svg>
        );
      
      case 'Triangle':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <polygon points="100,40 40,160 160,160" fill="#14b8a6" stroke="#0d9488" strokeWidth="3" />
            <line x1="100" y1="40" x2="100" y2="160" stroke="#0d9488" strokeWidth="2" strokeDasharray="5,5" />
            <text x="105" y="105" fill="#0d9488" fontSize="14" fontWeight="bold">h</text>
            <text x="95" y="175" fill="#0d9488" fontSize="14" fontWeight="bold">b</text>
          </svg>
        );
      
      case 'Quadrilateral':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <polygon points="50,80 140,60 160,140 40,150" fill="#14b8a6" stroke="#0d9488" strokeWidth="3" />
            <circle cx="50" cy="80" r="3" fill="#0d9488" />
            <circle cx="140" cy="60" r="3" fill="#0d9488" />
            <circle cx="160" cy="140" r="3" fill="#0d9488" />
            <circle cx="40" cy="150" r="3" fill="#0d9488" />
          </svg>
        );
      
      case 'Cuboid':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path d="M50,80 L150,80 L150,140 L50,140 Z" fill="#a855f7" stroke="#7c3aed" strokeWidth="2" />
            <path d="M50,80 L70,60 L170,60 L150,80 Z" fill="#c084fc" stroke="#7c3aed" strokeWidth="2" />
            <path d="M150,80 L170,60 L170,120 L150,140 Z" fill="#9333ea" stroke="#7c3aed" strokeWidth="2" />
            <text x="95" y="115" fill="#fff" fontSize="12" fontWeight="bold">l</text>
            <text x="155" y="105" fill="#fff" fontSize="12" fontWeight="bold">h</text>
            <text x="105" y="75" fill="#7c3aed" fontSize="12" fontWeight="bold">w</text>
          </svg>
        );
      
      case 'Cylinder':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <ellipse cx="100" cy="60" rx="50" ry="15" fill="#a855f7" stroke="#7c3aed" strokeWidth="2" />
            <rect x="50" y="60" width="100" height="80" fill="#a855f7" stroke="none" />
            <line x1="50" y1="60" x2="50" y2="140" stroke="#7c3aed" strokeWidth="2" />
            <line x1="150" y1="60" x2="150" y2="140" stroke="#7c3aed" strokeWidth="2" />
            <ellipse cx="100" cy="140" rx="50" ry="15" fill="#9333ea" stroke="#7c3aed" strokeWidth="2" />
            <line x1="150" y1="100" x2="165" y2="100" stroke="#7c3aed" strokeWidth="2" strokeDasharray="3,3" />
            <text x="168" y="105" fill="#7c3aed" fontSize="12" fontWeight="bold">r</text>
            <text x="155" y="105" fill="#fff" fontSize="12" fontWeight="bold">h</text>
          </svg>
        );
      
      case 'Cube':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path d="M60,90 L140,90 L140,170 L60,170 Z" fill="#a855f7" stroke="#7c3aed" strokeWidth="2" />
            <path d="M60,90 L80,70 L160,70 L140,90 Z" fill="#c084fc" stroke="#7c3aed" strokeWidth="2" />
            <path d="M140,90 L160,70 L160,150 L140,170 Z" fill="#9333ea" stroke="#7c3aed" strokeWidth="2" />
            <text x="95" y="135" fill="#fff" fontSize="12" fontWeight="bold">s</text>
          </svg>
        );
      
      case 'Sphere':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <radialGradient id="sphereGradient">
                <stop offset="30%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#7c3aed" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="70" fill="url(#sphereGradient)" stroke="#7c3aed" strokeWidth="2" />
            <ellipse cx="100" cy="100" rx="70" ry="20" fill="none" stroke="#6d28d9" strokeWidth="1.5" opacity="0.6" />
            <ellipse cx="100" cy="100" rx="20" ry="70" fill="none" stroke="#6d28d9" strokeWidth="1.5" opacity="0.6" />
            <line x1="100" y1="100" x2="170" y2="100" stroke="#4c1d95" strokeWidth="2" strokeDasharray="5,5" />
            <text x="135" y="95" fill="#4c1d95" fontSize="12" fontWeight="bold">r</text>
          </svg>
        );
      
      case 'Pyramid':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <polygon points="100,40 40,160 160,160" fill="#a855f7" stroke="#7c3aed" strokeWidth="2" />
            <polygon points="100,40 160,160 180,150 110,45" fill="#c084fc" stroke="#7c3aed" strokeWidth="2" />
            <line x1="40" y1="160" x2="180" y2="150" stroke="#7c3aed" strokeWidth="2" />
            <line x1="100" y1="40" x2="100" y2="160" stroke="#7c3aed" strokeWidth="2" strokeDasharray="5,5" />
            <text x="105" y="105" fill="#7c3aed" fontSize="12" fontWeight="bold">h</text>
          </svg>
        );
      
      case 'Cone':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <ellipse cx="100" cy="160" rx="60" ry="20" fill="#a855f7" stroke="#7c3aed" strokeWidth="2" />
            <path d="M40,160 L100,40 L160,160" fill="#9333ea" stroke="#7c3aed" strokeWidth="2" />
            <line x1="100" y1="40" x2="100" y2="160" stroke="#7c3aed" strokeWidth="2" strokeDasharray="5,5" />
            <text x="105" y="105" fill="#fff" fontSize="12" fontWeight="bold">h</text>
            <line x1="100" y1="160" x2="160" y2="160" stroke="#7c3aed" strokeWidth="2" strokeDasharray="3,3" />
            <text x="125" y="175" fill="#7c3aed" fontSize="12" fontWeight="bold">r</text>
          </svg>
        );
      
      default:
        return null;
    }
  };

  return <div className="w-64 h-64 flex items-center justify-center">{renderShape()}</div>;
};

const ShapesEncyclopedia: React.FC<ShapesEncyclopediaProps> = ({ language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState<'all' | '2D' | '3D'>('all');
  const [showShape, setShowShape] = useState(false);
  const [showDefinition, setShowDefinition] = useState(false);
  const [showProperties, setShowProperties] = useState(false);

  const filteredShapes = shapes.filter(shape => 
    filter === 'all' || shape.category === filter
  );

  const currentShape = filteredShapes[currentIndex];
  const t = currentShape.translations[language];

  const handlePrev = () => {
    setShowShape(false);
    setShowDefinition(false);
    setShowProperties(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredShapes.length) % filteredShapes.length);
    }, 300);
  };

  const handleNext = () => {
    setShowShape(false);
    setShowDefinition(false);
    setShowProperties(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredShapes.length);
    }, 300);
  };

  React.useEffect(() => {
    setShowShape(false);
    setShowDefinition(false);
    setShowProperties(false);
    
    const shapeTimer = setTimeout(() => setShowShape(true), 100);
    const definitionTimer = setTimeout(() => setShowDefinition(true), 800);
    const propertiesTimer = setTimeout(() => setShowProperties(true), 1400);
    
    return () => {
      clearTimeout(shapeTimer);
      clearTimeout(definitionTimer);
      clearTimeout(propertiesTimer);
    };
  }, [currentIndex, language]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setShowShape(false);
      setShowDefinition(false);
      setShowProperties(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % filteredShapes.length);
      }, 300);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [filteredShapes.length]);

  const getFilterText = (filterType: 'all' | '2D' | '3D') => {
    const translations = {
      en: { all: 'All Nets', '2D': 'Net Patterns', '3D': '3D Shapes' },
      hi: { all: 'सभी नेट्स', '2D': 'नेट पैटर्न', '3D': '3D आकृतियां' },
      gu: { all: 'બધા નેટ્સ', '2D': 'નેટ પેટર્ન', '3D': '3D આકૃતિઓ' }
    };
    return translations[language][filterType];
  };

  const getCategoryText = (category: '2D' | '3D') => {
    const translations = {
      en: { '2D': 'Net Pattern', '3D': '3D Shape' },
      hi: { '2D': 'नेट पैटर्न', '3D': '3D आकृति' },
      gu: { '2D': 'નેટ પેટર્ન', '3D': '3D આકૃતિ' }
    };
    return translations[language][category];
  };

  const getLabels = () => {
    const translations = {
      en: { definition: 'Net Definition', properties: 'Folding Properties', showing: 'Showing' },
      hi: { definition: 'नेट की परिभाषा', properties: 'मुड़ने के गुण', showing: 'दिखा रहे हैं' },
      gu: { definition: 'નેટની વ્યાખ્યા', properties: 'મુડવાના ગુણધર્મો', showing: 'દર્શાવી રહ્યા છીએ' }
    };
    return translations[language];
  };

  const labels = getLabels();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-purple-100 p-8">
      <style>{styles}</style>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gradient-teal-purple mb-2">
          {language === 'en' ? 'Nets' : 
           language === 'hi' ? 'नेट्स' : 
           'નેટ્સ'}
        </h1>
        <p className="text-center text-gray-700 mb-8">
          {language === 'en' ? 'Understanding how 2D nets fold into 3D shapes' :
           language === 'hi' ? 'समझना कि 2D नेट्स कैसे 3D आकृतियों में मुड़ते हैं' :
           'સમજવું કે 2D નેટ્સ કેવી રીતે 3D આકૃતિઓમાં મુડે છે'}
        </p>

        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <button
            onClick={() => { setFilter('all'); setCurrentIndex(0); }}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-teal-500 text-white shadow-lg'
                : 'bg-white text-teal-600 hover:bg-teal-50'
            }`}
          >
            {getFilterText('all')}
          </button>
          <button
            onClick={() => { setFilter('2D'); setCurrentIndex(0); }}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === '2D'
                ? 'bg-teal-500 text-white shadow-lg'
                : 'bg-white text-teal-600 hover:bg-teal-50'
            }`}
          >
            {getFilterText('2D')}
          </button>
          <button
            onClick={() => { setFilter('3D'); setCurrentIndex(0); }}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === '3D'
                ? 'bg-teal-500 text-white shadow-lg'
                : 'bg-white text-teal-600 hover:bg-teal-50'
            }`}
          >
            {getFilterText('3D')}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-teal-100 hover:bg-teal-200 transition-colors"
              aria-label="Previous shape"
            >
              <ChevronLeft className="w-6 h-6 text-teal-700" />
            </button>

            <div className="text-center">
              <h2 className={`text-3xl font-bold text-gradient-teal-purple mb-1 transition-all duration-500 ${showShape ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                {t.name}
              </h2>
              <span className="inline-block px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">
                {getCategoryText(currentShape.category)}
              </span>
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-teal-100 hover:bg-teal-200 transition-colors"
              aria-label="Next shape"
            >
              <ChevronRight className="w-6 h-6 text-teal-700" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className={`flex-1 flex justify-center transition-all duration-700 ${showShape ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-12'}`}>
              <ShapeSVG shapeName={currentShape.name} />
            </div>

            <div className="flex-1 space-y-6">
              <div className={`transition-all duration-500 ${showDefinition ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                <h3 className="text-lg font-semibold text-gradient-teal-purple mb-2">{labels.definition}</h3>
                <p className="text-gray-700 leading-relaxed">{t.definition}</p>
              </div>

              <div className={`transition-all duration-500 ${showProperties ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                <h3 className="text-lg font-semibold text-gradient-teal-purple mb-3">{labels.properties}</h3>
                <ul className="space-y-2">
                  {t.properties.map((prop, idx) => (
                    <li 
                      key={idx} 
                      className="flex items-start transition-all duration-500"
                      style={{ 
                        opacity: showProperties ? 1 : 0,
                        transform: showProperties ? 'translateX(0)' : 'translateX(20px)',
                        transitionDelay: `${idx * 0.1 + 0.2}s`
                      }}
                    >
                      <span className="inline-block w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3"></span>
                      <span className="text-gray-700">{prop}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {filteredShapes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'bg-teal-500 w-8'
                    : 'bg-teal-200 hover:bg-teal-300'
                }`}
                aria-label={`Go to shape ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-700">
          {labels.showing} {currentIndex + 1} {language === 'en' ? 'of' : language === 'hi' ? 'में से' : 'માંથી'} {filteredShapes.length} {language === 'en' ? 'shapes' : language === 'hi' ? 'आकृतियां' : 'આકૃતિઓ'}
        </div>
      </div>
    </div>
  );
};

export default ShapesEncyclopedia;
