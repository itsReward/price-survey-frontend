// Color utility functions for the application

// Type definitions
export interface RGB {
    r: number
    g: number
    b: number
}

export interface HSL {
    h: number
    s: number
    l: number
}

export interface ColorPalette {
    [key: number]: string
}

// Semantic color constants
export const SEMANTIC_COLORS = {
    primary: '#10b981',
    secondary: '#6b7280',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
}

// Convert hex to RGB
export const hexToRgb = (hex: string): RGB | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null
}

// Convert RGB to hex
export const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

// Add opacity to a color
export const withOpacity = (color: string, opacity: number): string => {
    const rgb = hexToRgb(color)
    if (!rgb) return color
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
}

// Lighten a color
export const lighten = (color: string, amount: number): string => {
    const rgb = hexToRgb(color)
    if (!rgb) return color

    const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * amount))
    const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * amount))
    const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * amount))

    return rgbToHex(r, g, b)
}

// Darken a color
export const darken = (color: string, amount: number): string => {
    const rgb = hexToRgb(color)
    if (!rgb) return color

    const r = Math.max(0, Math.floor(rgb.r * (1 - amount)))
    const g = Math.max(0, Math.floor(rgb.g * (1 - amount)))
    const b = Math.max(0, Math.floor(rgb.b * (1 - amount)))

    return rgbToHex(r, g, b)
}

// Get complementary color
export const getComplementaryColor = (color: string): string => {
    const rgb = hexToRgb(color)
    if (!rgb) return color

    const r = 255 - rgb.r
    const g = 255 - rgb.g
    const b = 255 - rgb.b

    return rgbToHex(r, g, b)
}

// Get luminance of a color (for accessibility calculations)
export const getLuminance = (color: string): number => {
    const rgb = hexToRgb(color)
    if (!rgb) return 0

    const getRGB = (value: number) => {
        const v = value / 255
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    }

    return 0.2126 * getRGB(rgb.r) + 0.7152 * getRGB(rgb.g) + 0.0722 * getRGB(rgb.b)
}

// Get contrast ratio between two colors
export const getContrastRatio = (color1: string, color2: string): number => {
    const lum1 = getLuminance(color1)
    const lum2 = getLuminance(color2)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)
    return (brightest + 0.05) / (darkest + 0.05)
}

// Determine if text should be white or black based on background color
export const getTextColor = (backgroundColor: string): string => {
    const luminance = getLuminance(backgroundColor)
    return luminance > 0.5 ? '#000000' : '#ffffff'
}

// Generate color palette from a base color
export const generatePalette = (baseColor: string): ColorPalette => {
    return {
        50: lighten(baseColor, 0.95),
        100: lighten(baseColor, 0.9),
        200: lighten(baseColor, 0.7),
        300: lighten(baseColor, 0.5),
        400: lighten(baseColor, 0.3),
        500: baseColor,
        600: darken(baseColor, 0.15),
        700: darken(baseColor, 0.3),
        800: darken(baseColor, 0.5),
        900: darken(baseColor, 0.7),
    }
}

// Color category helpers for UI components
export const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
        case 'success':
        case 'complete':
        case 'active':
        case 'approved':
            return SEMANTIC_COLORS.success
        case 'warning':
        case 'pending':
        case 'review':
        case 'partial':
            return SEMANTIC_COLORS.warning
        case 'error':
        case 'failed':
        case 'rejected':
        case 'inactive':
            return SEMANTIC_COLORS.error
        case 'info':
        case 'draft':
        case 'processing':
        default:
            return SEMANTIC_COLORS.info
    }
}

// Generate gradient from two colors
export const createGradient = (
    color1: string,
    color2: string,
    direction: string = 'to right'
): string => {
    return `linear-gradient(${direction}, ${color1}, ${color2})`
}

// Random color generator
export const generateRandomColor = (): string => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

// Generate color from string (useful for avatars, tags, etc.)
export const stringToColor = (str: string): string => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    let color = '#'
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff
        color += ('00' + value.toString(16)).substr(-2)
    }
    return color
}

// Color accessibility helpers
export const isColorAccessible = (
    foreground: string,
    background: string,
    level: 'AA' | 'AAA' = 'AA'
): boolean => {
    const ratio = getContrastRatio(foreground, background)
    return level === 'AA' ? ratio >= 4.5 : ratio >= 7
}

// Mix two colors
export const mixColors = (color1: string, color2: string, ratio: number = 0.5): string => {
    const rgb1 = hexToRgb(color1)
    const rgb2 = hexToRgb(color2)

    if (!rgb1 || !rgb2) return color1

    const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio)
    const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio)
    const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio)

    return rgbToHex(r, g, b)
}

// Export color utilities as a single object for easier importing
export const colorUtils = {
    hexToRgb,
    rgbToHex,
    withOpacity,
    lighten,
    darken,
    getComplementaryColor,
    getLuminance,
    getContrastRatio,
    getTextColor,
    generatePalette,
    getStatusColor,
    createGradient,
    generateRandomColor,
    stringToColor,
    isColorAccessible,
    mixColors,
}