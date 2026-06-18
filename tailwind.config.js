/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '6rem',
      },
    },
    extend: {
      colors: {
        porcelain: {
          ji: {
            blue: '#2C3E50',
            bluelight: '#3D566E',
          },
          youlihong: '#A83232',
          celadon: '#8BA888',
          glaze: '#F5F1E8',
          inkbrown: '#3D2B1F',
          gold: '#C9A962',
          paper: '#FAF7F0',
          scroll: '#F0EAD8',
          crackle: '#D4C8A8',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', '"SimSun"', 'serif'],
        sans: ['"Noto Sans SC"', '"Source Han Sans SC"', '"PingFang SC"', 'sans-serif'],
        brush: ['"Ma Shan Zheng"', '"ZCOOL XiaoWei"', '"ZCOOL KuaiLe"', 'cursive'],
      },
      animation: {
        'scroll-unfold': 'scrollUnfold 2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'ink-stroke': 'inkStroke 1.5s ease-out forwards',
      },
      keyframes: {
        scrollUnfold: {
          '0%': { transform: 'scaleY(0.05)', opacity: '0' },
          '50%': { transform: 'scaleY(1)', opacity: '1' },
          '100%': { transform: 'scaleY(1)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(201, 169, 98, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(201, 169, 98, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        inkStroke: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      boxShadow: {
        'porcelain': '0 4px 20px rgba(44, 62, 80, 0.12), 0 1px 3px rgba(44, 62, 80, 0.08)',
        'porcelain-lg': '0 12px 40px rgba(44, 62, 80, 0.18), 0 4px 12px rgba(44, 62, 80, 0.1)',
        'seal': '2px 2px 8px rgba(168, 50, 50, 0.3)',
        'scroll': '0 8px 32px rgba(61, 43, 31, 0.15), inset 0 1px 0 rgba(255,255,255,0.5)',
      },
      backgroundImage: {
        'rice-paper': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
