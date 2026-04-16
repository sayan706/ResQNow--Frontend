import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: "class",
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      "colors": {
          "on-tertiary-container": "#c69b5f",
          "on-tertiary-fixed": "#291800",
          "on-background": "#191c1d",
          "background": "#f8f9fa",
          "surface": "#f8f9fa",
          "secondary-fixed-dim": "#ffb4ac",
          "on-error": "#ffffff",
          "outline": "#74777f",
          "primary-container": "#1e3a5f",
          "on-surface-variant": "#43474e",
          "tertiary-fixed-dim": "#edbf7f",
          "surface-container-high": "#e7e8e9",
          "surface-container-highest": "#e1e3e4",
          "surface-dim": "#d9dadb",
          "secondary": "#b7131a",
          "on-secondary-fixed": "#410002",
          "surface-variant": "#e1e3e4",
          "on-primary-container": "#8aa4cf",
          "tertiary-container": "#503300",
          "surface-container": "#edeeef",
          "primary-fixed-dim": "#adc8f5",
          "secondary-container": "#db322f",
          "inverse-primary": "#adc8f5",
          "on-tertiary": "#ffffff",
          "surface-bright": "#f8f9fa",
          "on-error-container": "#93000a",
          "tertiary": "#341f00",
          "on-surface": "#191c1d",
          "surface-container-low": "#f3f4f5",
          "on-primary": "#ffffff",
          "on-primary-fixed-variant": "#2d486d",
          "on-primary-fixed": "#001c3b",
          "secondary-fixed": "#ffdad6",
          "primary-fixed": "#d5e3ff",
          "on-secondary-fixed-variant": "#93000d",
          "outline-variant": "#c4c6cf",
          "surface-container-lowest": "#ffffff",
          "primary": "#022448",
          "error": "#ba1a1a",
          "error-container": "#ffdad6",
          "tertiary-fixed": "#ffddb2",
          "on-secondary": "#ffffff",
          "inverse-on-surface": "#f0f1f2",
          "on-tertiary-fixed-variant": "#60410c",
          "surface-tint": "#455f87",
          "on-secondary-container": "#fffbff",
          "inverse-surface": "#2e3132",
          // Indian Flag Colors
          "india-saffron": "#FF9933",
          "india-white": "#FFFFFF",
          "india-green": "#138808",
          "india-blue": "#000080"
      },
      "borderRadius": {
          "DEFAULT": "0.25rem",
          "lg": "0.5rem",
          "xl": "0.75rem",
          "full": "9999px"
      },
      "fontFamily": {
          "headline": ["var(--font-manrope)"],
          "body": ["var(--font-inter)"],
          "label": ["var(--font-inter)"]
      }
    },
  },
  plugins: [],
}
export default config
