/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Teal color palette
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1', 
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Primary teal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Purple accent palette
        accent: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7', // Primary purple
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Educational UI colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(0 0 0 / 0.05), 0 1px 3px 0 rgb(0 0 0 / 0.08)',
        glow: '0 0 20px rgb(20 184 166 / 0.15)',
        'glow-purple': '0 0 20px rgb(168 85 247 / 0.15)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'language-switch': 'languageSwitch 0.4s ease-in-out',
        'learning-glow': 'learningGlow 2s ease-in-out infinite',
        'text-reveal': 'textReveal 0.8s ease-out',
        'number-pop': 'numberPop 0.5s ease-out',
        'property-appear': 'propertyAppear 0.6s ease-out',
        'indicator-glow': 'indicatorGlow 2s ease-in-out infinite',
        'loading-dots': 'loadingDots 1.5s ease-in-out infinite',
        'math-highlight': 'mathHighlight 1.5s ease-in-out',
        'math-shimmer': 'mathShimmer 2s ease-in-out infinite',
        'typewriter': 'typewriter 2s steps(20) forwards',
        'gradient-shift': 'gradientShift 3s ease-in-out infinite',
        'multiply-pulse': 'multiplyPulse 1.5s ease-in-out infinite',
        'grid-appear': 'gridAppear 0.8s ease-out',
        'result-celebrate': 'resultCelebrate 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        languageSwitch: {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(0.9) rotate(2deg)', opacity: '0.7' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        learningGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgb(20 184 166 / 0.2)', 
            transform: 'scale(1)' 
          },
          '50%': { 
            boxShadow: '0 0 30px rgb(168 85 247 / 0.3)', 
            transform: 'scale(1.02)' 
          },
        },
        textReveal: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(20px) scale(0.95)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)' 
          },
        },
        numberPop: {
          '0%': { 
            transform: 'scale(0.8)', 
            opacity: '0' 
          },
          '50%': { 
            transform: 'scale(1.1)' 
          },
          '100%': { 
            transform: 'scale(1)', 
            opacity: '1' 
          },
        },
        propertyAppear: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(10px) rotate(-5deg) scale(0.9)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) rotate(0deg) scale(1)' 
          },
        },
        indicatorGlow: {
          '0%, 100%': { 
            opacity: '0.6',
            transform: 'scale(1)',
            boxShadow: '0 0 8px rgb(20 184 166 / 0.3)'
          },
          '50%': { 
            opacity: '1',
            transform: 'scale(1.1)',
            boxShadow: '0 0 12px rgb(168 85 247 / 0.4)'
          },
        },
        loadingDots: {
          '0%, 80%, 100%': { 
            opacity: '0.3',
            transform: 'scale(0.8)'
          },
          '40%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
        },
        mathHighlight: {
          '0%': { 
            transform: 'scale(1)',
            boxShadow: '0 8px 16px -4px rgb(20 184 166 / 0.2)'
          },
          '50%': { 
            transform: 'scale(1.03)',
            boxShadow: '0 20px 40px -8px rgb(20 184 166 / 0.4), 0 8px 16px -4px rgb(168 85 247 / 0.3)'
          },
          '100%': { 
            transform: 'scale(1)',
            boxShadow: '0 8px 16px -4px rgb(20 184 166 / 0.2)'
          },
        },
        mathShimmer: {
          '0%': { 
            backgroundPosition: '-200% 0'
          },
          '100%': { 
            backgroundPosition: '200% 0'
          },
        },
        typewriter: {
          '0%': { 
            width: '0',
            borderRight: '2px solid rgb(20 184 166)'
          },
          '50%': { 
            borderRight: '2px solid rgb(20 184 166)'
          },
          '100%': { 
            width: '100%',
            borderRight: 'transparent'
          },
        },
        gradientShift: {
          '0%, 100%': { 
            backgroundPosition: '0% 50%'
          },
          '50%': { 
            backgroundPosition: '100% 50%'
          },
        },
        multiplyPulse: {
          '0%, 100%': { 
            transform: 'scale(1)',
            opacity: '0.8'
          },
          '50%': { 
            transform: 'scale(1.05)',
            opacity: '1'
          },
        },
        gridAppear: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.9) rotateY(10deg)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1) rotateY(0deg)'
          },
        },
        resultCelebrate: {
          '0%': { 
            transform: 'scale(1) rotate(0deg)',
            opacity: '1'
          },
          '25%': { 
            transform: 'scale(1.1) rotate(2deg)'
          },
          '50%': { 
            transform: 'scale(1.15) rotate(-2deg)'
          },
          '75%': { 
            transform: 'scale(1.05) rotate(1deg)'
          },
          '100%': { 
            transform: 'scale(1) rotate(0deg)',
            opacity: '1'
          },
        },
      },
    },
  },
  plugins: [],
};