import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        botanical: {
          forest: {
            DEFAULT: "#0E281D",
            deep: "#081812",
            mid: "#153A2A",
            surface: "#1B4734",
            light: "#255D44",
          },
          parchment: {
            DEFAULT: "#FBF9F4",
            card: "#F5F0E6",
            surface: "#EDE6D6",
            border: "#DFD5C0",
            muted: "#9C927F",
          },
          sage: {
            DEFAULT: "#5D7A68",
            light: "#E3ECE6",
            mid: "#8BA794",
            dark: "#3B5244",
          },
          charcoal: {
            DEFAULT: "#151D19",
            light: "#232D28",
            muted: "#5A6560",
          },
          amber: {
            DEFAULT: "#C8833E",
            deep: "#9E6024",
            light: "#F8EAD9",
            glow: "#E59E53",
          },
          copper: {
            DEFAULT: "#B45309",
            light: "#D97706",
          }
        }
      },
      fontFamily: {
        serif: ["Newsreader", "Georgia", "Cambria", "serif"],
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "monospace"],
      },
      boxShadow: {
        'botanical': '0 4px 20px -2px rgba(11, 32, 23, 0.08), 0 2px 6px -1px rgba(11, 32, 23, 0.04)',
        'botanical-lg': '0 10px 30px -4px rgba(11, 32, 23, 0.12), 0 4px 10px -2px rgba(11, 32, 23, 0.06)',
        'specimen': 'inset 0 1px 2px rgba(255, 255, 255, 0.6), 0 2px 8px rgba(14, 40, 29, 0.08)',
      }
    },
  },
  plugins: [],
};
export default config;
