const { url } = require('inspector');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily:{
        'play':['Play', 'sans-serif']
      },
      backgroundImage:{
        'mainBg1': "url('/public/Assets/bgImg.svg')",
      },
      animation:{
        "slowerFlicker" : 'pulse  2s infinite',
        "slowerPing": 'ping 2s infinite',
        "wiggleSlow" : 'wiggle 0.8s infinite',
        "wiggleBounce" : 'bounce2 1.1s infinite',
        "wiggleBounce2" : 'bounce2 1.9s',
        "wiggleBounce3" : 'bounce2 1.9s',
        "shakeshake" : 'shake 1.9s',
      },
      keyframes:{
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        wiggle2: {
          '0%, 100%': { transform: 'rotate(10deg)' },
          '50%': { transform: 'rotate(-10deg)' },
        },
        bounce2:{
          "0%, 100% ":{
            transform: 'translateY(-12%) ease-in translateX(6%) rotate(-15deg)',
            AnimationTimeline: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          "50%":{
            transform: 'translateY(0) rotate(15deg) translateX(-6%)',
            AnimationTimeline: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        shake:{
          "25%, 75% ":{
            transform: 'translateY(-9%) translateX(6%) ease-in rotate(10deg)',
            AnimationTimeline: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          "0% , 100%":{transform:'translateY(9%)' , AnimationTimeline: 'cubic-bezier(0.8, 0, 1, 1)',},
          "50%":{
            transform: 'translateY(0) rotate(-10deg)',
            AnimationTimeline: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        }
      }
    },
  },
  plugins: [],
}
