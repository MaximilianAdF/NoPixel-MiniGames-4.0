import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin';

// Add a radial gradient plugin, so we don't have to use verbose inline css
// https://stackoverflow.com/a/77121542
const radialGradientPlugin = plugin(
  function ({ matchUtilities, theme }) {
    matchUtilities(
      {
        // map to bg-radient-[*]
        'bg-radient': value => ({
          'background-image': `radial-gradient(${value},var(--tw-gradient-stops))`,
        }),
      },
      { values: theme('radialGradients') }
    )
  },
  {
    theme: {
      radialGradients: _presets(),
    },
  }
)

/**
 * utility class presets
 */
function _presets() {
  const shapes = ['circle', 'ellipse'];
  const pos = {
    c: 'center',
    t: 'top',
    b: 'bottom',
    l: 'left',
    r: 'right',
    tl: 'top left',
    tr: 'top right',
    bl: 'bottom left',
    br: 'bottom right',
  };
  let result = {};
  for (const shape of shapes)
    for (const [posName, posValue] of Object.entries(pos))
      {
        // @ts-ignore
        result[`${shape}-${posName}`] = `${shape} at ${posValue}`;
      }

  return result;
}

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        win: "winBounce 0.6s ease-in-out forwards",
      },
      keyframes: {
        winBounce: {
          "0%, 100%": { scale: "1" },
          "50%": { scale: "1.2" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // Generated from https://uicolors.app
        'spring-green': {
          '50': '#eefff5',
          '100': '#d7ffe9',
          '200': '#b2ffd5',
          '300': '#54ffa4',
          '400': '#33f58f',
          '500': '#09de6e',
          '600': '#01b857',
          '700': '#059048',
          '800': '#0a713c',
          '900': '#0a5d34',
          '950': '#00341b',
        },
        'aquamarine': {
          '50': '#eefff5',
          '100': '#d7ffeb',
          '200': '#b2ffd8',
          '300': '#7fffbf',
          '400': '#33f595',
          '500': '#09de74',
          '600': '#01b85d',
          '700': '#05904c',
          '800': '#0a713f',
          '900': '#0a5d36',
          '950': '#00341c',
        },
        'mirage': {
          '50': '#f2f6fc',
          '100': '#e0ebf9',
          '200': '#c9dcf4',
          '300': '#a4c5ec',
          '400': '#78a7e2',
          '500': '#5888d9',
          '600': '#446ecc',
          '700': '#3a5bbb',
          '800': '#354b98',
          '900': '#2f4179',
          '950': '#151b30',
        },
        'vivid-violet': {
          '50': '#fbf6fd',
          '100': '#f6ecfb',
          '200': '#edd8f6',
          '300': '#e1b8ef',
          '400': '#d08ee4',
          '500': '#b962d3',
          '600': '#933eab',
          '700': '#833497',
          '800': '#6d2c7c',
          '900': '#5c2966',
          '950': '#391042',
        },
        'turquoise': {
          '50': '#effef9',
          '100': '#cafdef',
          '200': '#95fae0',
          '300': '#58f0cf',
          '400': '#30ddbd',
          '500': '#0dbfa1',
          '600': '#079a84',
          '700': '#0a7b6b',
          '800': '#0e6157',
          '900': '#105148',
          '950': '#02312d',
        },
      },
    },
  },
  plugins: [radialGradientPlugin],
};
export default config;
