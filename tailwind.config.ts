import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#F4F1EA",
          elev: "#FBF9F4",
          card: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#16140F",
          soft: "#3D3A33",
          mute: "#8A857B",
          faint: "#C2BDB1",
        },
        line: {
          DEFAULT: "#DDD7C8",
          soft: "#E8E3D5",
        },
      },
      fontFamily: {
        serif: ["Instrument Serif", "Georgia", "serif"],
        sans: ["Geist", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
      },
      maxWidth: {
        content: "1180px",
      },
      borderRadius: {
        sm: "8px",
        md: "14px",
        lg: "24px",
        pill: "999px",
      },
    },
  },
  plugins: [],
};

export default config;
