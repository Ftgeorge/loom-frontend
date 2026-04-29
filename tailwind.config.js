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
                canvas: '#FDFDFD',
                ink: '#0F0F0F',
                primary: {
                    DEFAULT: '#0F3826',
                    dark: '#0A2419',
                    light: '#E8F5EE',
                },
                secondary: '#16A34A',
                violet: {
                    DEFAULT: '#7C3AED',
                    light: '#F3EEFF',
                    dark: '#5B21B6',
                },
                accent: {
                    DEFAULT: '#92400E',
                    light: '#FEF3C7',
                    dark: '#78350F',
                },
                background: '#F8F7F5',
                surface: '#FFFFFF',
                muted: '#9CA3AF',
                success: '#16A34A',
                error: '#DC2626',
                info: '#2563EB',
                warning: '#D97706',
            },
            fontFamily: {
                sans: ['Inter-Regular', 'System'],
                jakarta: ['PlusJakartaSans-Regular'],
                'jakarta-semibold': ['PlusJakartaSans-SemiBold'],
                'jakarta-bold': ['PlusJakartaSans-Bold'],
                'jakarta-xbold': ['PlusJakartaSans-ExtraBold'],
                inter: ['Inter-Regular'],
                'inter-medium': ['Inter-Medium'],
                'inter-semibold': ['Inter-SemiBold'],
                'inter-bold': ['Inter-Bold'],
            },
        },
    },
    plugins: [],
};

