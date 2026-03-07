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
                    DEFAULT: '#064E3B', // Obsidian Forest
                    dark: '#022C22',
                    light: '#ECFDF5',
                },
                secondary: {
                    DEFAULT: '#059669', // Loom Green
                },
                accent: {
                    DEFAULT: '#92400E', // Burnt Bronze
                    light: '#FEF3C7',
                    dark: '#78350F',
                },
                background: '#FBFBF9', // Stone Linen
                surface: '#FFFFFF',
                muted: '#57534E', // Stone 600
                success: '#059669',
                error: '#991B1B',
                info: '#0369A1',
                warning: '#D97706',
                ink: '#1C1917', // Stone 900
            },
            fontFamily: {
                sans: ['MontserratAlternates-Regular', 'System'],
                montserrat: ['MontserratAlternates-Regular'],
                'montserrat-medium': ['MontserratAlternates-Medium'],
                'montserrat-semibold': ['MontserratAlternates-SemiBold'],
                'montserrat-bold': ['MontserratAlternates-Bold'],
            },
        },
    },
    plugins: [],
};
