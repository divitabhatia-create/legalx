import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    extend: {
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        surface: {
          page: "hsl(var(--surface-page))",
          card: "hsl(var(--surface-card))",
          input: "hsl(var(--surface-input))",
          subtle: "hsl(var(--surface-subtle))",
        },
        ink: {
          body: "hsl(var(--text-body))",
          light: "hsl(var(--text-light))",
          muted: "hsl(var(--text-muted))",
          xmuted: "hsl(var(--text-extra-muted))",
        },
        line: {
          card: "hsl(var(--border-card))",
          dark: "hsl(var(--border-dark))",
        },
        brand: {
          red: "hsl(var(--brand-red))",
          "red-light": "hsl(var(--brand-red-light))",
          "red-dark": "hsl(var(--brand-red-dark))",
          blue: "hsl(var(--brand-blue))",
          "blue-light": "hsl(var(--brand-blue-light))",
          "blue-dark": "hsl(var(--brand-blue-dark))",
          green: "hsl(var(--brand-green))",
          "green-light": "hsl(var(--brand-green-light))",
          "green-dark": "hsl(var(--brand-green-dark))",
          amber: "hsl(var(--brand-amber))",
          "amber-light": "hsl(var(--brand-amber-light))",
          "amber-dark": "hsl(var(--brand-amber-dark))",
          purple: "hsl(var(--brand-purple))",
          "purple-light": "hsl(var(--brand-purple-light))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 3px)",
        sm: "calc(var(--radius) - 6px)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
