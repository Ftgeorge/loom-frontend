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
                    DEFAULT: '#7C3AED', // Electric Violet
                },
                graphite: {
                    DEFAULT: '#121212', // Deep Graphite
                },
                background: '#FDFDFD', // Linen White
                surface: '#F1F5F9', // Ghost Gray
                muted: '#64748B', // Slate Mist
                success: '#0D9488', // Teal Glow
                error: '#D64545',
                info: '#3B82F6',
                warning: '#F59E0B',
            },
            fontFamily: {
                sans: ['MontserratAlternates', 'System'],
                serif: ['MontserratAlternates', 'System'],
                montserrat: ['MontserratAlternates'],
                'montserrat-medium': ['MontserratAlternates-Medium'],
                'montserrat-semibold': ['MontserratAlternates-SemiBold'],
                'montserrat-bold': ['MontserratAlternates-Bold'],
                'montserrat-italic': ['MontserratAlternates-Italic'],
                'montserrat-bolditalic': ['MontserratAlternates-BoldItalic'],
            },
        },
    },
    plugins: [],
};
