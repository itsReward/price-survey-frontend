const { r, g, b } = rgb

const getRGB = (value: number) => {
    const v = value / 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

return 0.2126 * getRGB(r) + 0.7152 * getRGB(g) + 0.0722 * getRGB(b)
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
export const generatePalette = (baseColor: string): Record<number, string> => {
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