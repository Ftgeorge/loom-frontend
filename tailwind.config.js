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
                primary: {
                    DEFAULT: '#2D4A22', // Forest Pine
                    light: '#C2D5BA', // Soft lighter version
                },
                accent: {
                    DEFAULT: '#D4AF37', // Golden Sand
                    dark: '#B8962E', // Slightly darker gold
                },
                background: '#F7F3E9', // Parchment
                surface: '#FFFFFF', // White
                success: '#22C55E',
                error: '#D64545',
                info: '#3B82F6',
                warning: '#F59E0B',
            },
            fontFamily: {
                sans: ['System'],
            },
        },
    },
    plugins: [],
};
