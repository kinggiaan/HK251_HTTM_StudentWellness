/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Trust & Calm (Mental Health SaaS)
        primary: {
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#0C1E33'
        },
        
        // Success - Positive Mental Health
        success: {
          DEFAULT: '#27AE60',
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#27AE60',
          600: '#229954',
          700: '#15803D'
        },
        
        // Warning - Attention Needed
        warning: {
          DEFAULT: '#F2994A',
          50: '#FFF7ED',
          100: '#FFEDD5',
          500: '#F2994A',
          600: '#E67E22',
          700: '#C2410C'
        },
        
        // Danger - Critical Issues
        danger: {
          DEFAULT: '#EB5757',
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EB5757',
          600: '#E74C3C',
          700: '#DC2626'
        },
        
        // Text colors with proper contrast (WCAG AA compliant)
        text: {
          primary: '#0F172A',      // slate-900 - 13.6:1 contrast ratio
          secondary: '#475569',     // slate-600 - 5.2:1 contrast ratio
          tertiary: '#64748B',      // slate-500 - 3.9:1 contrast ratio
          disabled: '#94A3B8'       // slate-400 - Use only for disabled states
        },
        
        // Background colors
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8FAFC',
          tertiary: '#F1F5F9',
          dark: '#0F172A'
        },
        
        // Border colors
        border: {
          DEFAULT: '#E2E8F0',
          light: '#F1F5F9',
          medium: '#CBD5E1',
          dark: '#94A3B8'
        }
      },
      
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace']
      },
      
      fontSize: {
        // Consistent type scale with line heights
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
        '5xl': ['3rem', { lineHeight: '1' }],           // 48px
        '6xl': ['3.75rem', { lineHeight: '1' }]         // 60px
      },
      
      spacing: {
        // Additional spacing values
        '18': '4.5rem',   // 72px
        '88': '22rem',    // 352px
        '112': '28rem',   // 448px
        '128': '32rem'    // 512px
      },
      
      borderRadius: {
        'DEFAULT': '0.5rem',    // 8px
        'md': '0.625rem',       // 10px
        'lg': '0.75rem',        // 12px
        'xl': '1rem',           // 16px
        '2xl': '1.5rem',        // 24px
        '3xl': '2rem'           // 32px
      },
      
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
      },
      
      transitionDuration: {
        'DEFAULT': '200ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms'
      },
      
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in': 'slideIn 0.3s ease-out'
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        }
      },
      
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100'
      }
    }
  },
  plugins: []
}
