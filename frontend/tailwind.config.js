export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'rgb(var(--bg) / <alpha-value>)',
          2: 'rgb(var(--bg-2) / <alpha-value>)',
          3: 'rgb(var(--bg-3) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          2: 'rgb(var(--card-2) / <alpha-value>)',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        fg: {
          DEFAULT: 'rgb(var(--fg) / <alpha-value>)',
          muted: 'rgb(var(--fg-muted) / <alpha-value>)',
        },
        neon: {
          blue: 'rgb(var(--neon-blue) / <alpha-value>)',
          purple: 'rgb(var(--neon-purple) / <alpha-value>)',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgb(var(--border) / 0.6), 0 8px 32px rgb(0 0 0 / 0.35), 0 0 48px rgb(var(--neon-blue) / 0.08)',
        neon: '0 0 0 1px rgb(var(--border) / 0.7), 0 0 0 1px rgb(var(--neon-blue) / 0.12) inset, 0 24px 80px rgb(var(--neon-purple) / 0.10)',
      },
      backgroundImage: {
        'radial-glow':
          'radial-gradient(1200px 600px at 20% 0%, rgb(var(--neon-blue) / 0.12), transparent 60%), radial-gradient(900px 520px at 80% 10%, rgb(var(--neon-purple) / 0.10), transparent 55%)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-40%)' },
          '100%': { transform: 'translateX(140%)' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite',
      },
    },
  },
  plugins: [],
}
