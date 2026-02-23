/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  //this content format tells the tailwind to looks all the file that present in 
  //src folder

  // Theme customization - where we define our colors, fonts, etc.
  theme: {
    extend: {
      // Custom colors for YouGram
      colors: {
        // Primary brand color (blue) - used for buttons, links
        primary: "#3b82f6",

        // Secondary color (green) - used for success, online status
        secondary: "#10b981",

        // Dark background (YouTube style)
        dark: "#0f0f0f",

        // Discord purple - for community features
        discord: "#5865F2",

        // Status colors
        success: "#22c55e",
        error: "#ef4444",
        warning: "#f59e0b",

        // Chat bubble colors
        "chat-sent": "#3b82f6",      // Your messages
        "chat-received": "#2d2d2d",  // Their messages
      },

      // Custom animations
      animation: {
        // Slow pulse(red dot notification when you have unread message) for notifications
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',

        // Bounce(the 3 dots animation when someone is typing) for typing indicator
        'bounce-slow': 'bounce 2s infinite',

        // Slide(new message appears smoothly) in for messages
        'slide-in': 'slideIn 0.3s ease-out',

        // Fade in for modals
        'fade-in': 'fadeIn 0.2s ease-in',
      },

      // Keyframes for custom animations
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },

      // Custom spacing for consistent layout
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // Custom border radius
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },

  // Plugins (we'll add more as needed)
  plugins: [],
}