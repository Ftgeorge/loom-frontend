/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
    ],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                sage: {
                    50: '#f0f5f0',
                    100: '#d4e6d4',
                    200: '#A8C5A0',   // softSage
                    400: '#7FA97A',   // softSageDark
                    600: '#3B5C3A',
                    800: '#2C3E2B',   // deepOlive
                },
                olive: {
                    DEFAULT: '#2C3E2B',
                    light: '#3B5C3A',
                },
                accent: {
                    DEFAULT: '#D4A574',
                    dark: '#B8864E',
                },
                operis: {
                    bg: '#F5F3EF',
                    card: '#FFFFFF',
                    border: '#E8E5E0',
                },
            },
            fontFamily: {
                sans: ['System'],
            },
        },
    },
    plugins: [],
};
