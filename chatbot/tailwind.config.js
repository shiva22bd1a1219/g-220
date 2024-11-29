/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1D4ED8", // Blue
          light: "#3B82F6", // Lighter blue
          dark: "#1E40AF", // Darker blue
        },
        secondary: {
          DEFAULT: "#10B981", // Green
          light: "#34D399", // Lighter green
          dark: "#059669", // Darker green
        },
        neutral: {
          DEFAULT: "#6B7280", // Gray
          light: "#D1D5DB", // Light gray
          dark: "#374151", // Dark gray
        },
      },
    },
  },
  plugins: [],
};

