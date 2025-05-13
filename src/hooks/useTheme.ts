import { useState, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export type Theme = 'light' | 'dark' | 'system'

export interface ThemePreferences {
    theme: Theme
    primaryColor: string
    fontSize: 'small' | 'medium' | 'large'
    reducedMotion: boolean
}

export function useTheme() {
    const [preferences, setPreferences] = useLocalStorage<ThemePreferences>('theme-preferences', {
        theme: 'system',
        primaryColor: 'emerald',
        fontSize: 'medium',
        reducedMotion: false
    })

    const [isDark, setIsDark] = useState<boolean>(false)
    const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')

    // Detect system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleChange = (e: MediaQueryListEvent) => {
            setSystemTheme(e.matches ? 'dark' : 'light')
        }

        setSystemTheme(mediaQuery.matches ? 'dark' : 'light')
        mediaQuery.addEventListener('change', handleChange)

        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    // Update isDark based on theme preference
    useEffect(() => {
        const resolvedTheme = preferences.theme === 'system' ? systemTheme : preferences.theme
        setIsDark(resolvedTheme === 'dark')
    }, [preferences.theme, systemTheme])

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement

        if (isDark) {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }

        // Apply other theme preferences
        root.style.setProperty('--primary-color', preferences.primaryColor)
        root.style.setProperty('--font-size', preferences.fontSize)

        if (preferences.reducedMotion) {
            root.classList.add('reduce-motion')
        } else {
            root.classList.remove('reduce-motion')
        }
    }, [isDark, preferences])

    const updateTheme = (theme: Theme) => {
        setPreferences(prev => ({ ...prev, theme }))
    }

    const updatePrimaryColor = (color: string) => {
        setPreferences(prev => ({ ...prev, primaryColor: color }))
    }

    const updateFontSize = (size: 'small' | 'medium' | 'large') => {
        setPreferences(prev => ({ ...prev, fontSize: size }))
    }

    const toggleReducedMotion = () => {
        setPreferences(prev => ({ ...prev, reducedMotion: !prev.reducedMotion }))
    }

    const resetToDefault = () => {
        setPreferences({
            theme: 'system',
            primaryColor: 'emerald',
            fontSize: 'medium',
            reducedMotion: false
        })
    }

    // Get resolved theme (useful for components that need to know the actual theme)
    const resolvedTheme = preferences.theme === 'system' ? systemTheme : preferences.theme

    return {
        preferences,
        isDark,
        resolvedTheme,
        systemTheme,
        updateTheme,
        updatePrimaryColor,
        updateFontSize,
        toggleReducedMotion,
        resetToDefault
    }
}

// Hook for detecting system preferences
export function useSystemPreferences() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
    const [prefersHighContrast, setPrefersHighContrast] = useState(false)

    useEffect(() => {
        // Reduced motion
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        setPrefersReducedMotion(motionQuery.matches)

        const handleMotionChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches)
        }
        motionQuery.addEventListener('change', handleMotionChange)

        // High contrast
        const contrastQuery = window.matchMedia('(prefers-contrast: high)')
        setPrefersHighContrast(contrastQuery.matches)

        const handleContrastChange = (e: MediaQueryListEvent) => {
            setPrefersHighContrast(e.matches)
        }
        contrastQuery.addEventListener('change', handleContrastChange)

        return () => {
            motionQuery.removeEventListener('change', handleMotionChange)
            contrastQuery.removeEventListener('change', handleContrastChange)
        }
    }, [])

    return {
        prefersReducedMotion,
        prefersHighContrast
    }
}

// Hook for color theme management
export function useColorTheme() {
    const [colorTokens] = useState({
        light: {
            background: '#ffffff',
            foreground: '#000000',
            card: '#f8f9fa',
            cardForeground: '#000000',
            popover: '#ffffff',
            popoverForeground: '#000000',
            primary: '#10b981',
            primaryForeground: '#ffffff',
            secondary: '#f1f5f9',
            secondaryForeground: '#0f172a',
            muted: '#f1f5f9',
            mutedForeground: '#64748b',
            accent: '#f1f5f9',
            accentForeground: '#0f172a',
            destructive: '#ef4444',
            destructiveForeground: '#ffffff',
            border: '#e2e8f0',
            input: '#e2e8f0',
            ring: '#10b981'
        },
        dark: {
            background: '#0f172a',
            foreground: '#f8fafc',
            card: '#1e293b',
            cardForeground: '#f8fafc',
            popover: '#0f172a',
            popoverForeground: '#f8fafc',
            primary: '#10b981',
            primaryForeground: '#ffffff',
            secondary: '#1e293b',
            secondaryForeground: '#f8fafc',
            muted: '#1e293b',
            mutedForeground: '#94a3b8',
            accent: '#1e293b',
            accentForeground: '#f8fafc',
            destructive: '#dc2626',
            destructiveForeground: '#f8fafc',
            border: '#334155',
            input: '#334155',
            ring: '#10b981'
        }
    })

    const { isDark } = useTheme()
    const currentTokens = isDark ? colorTokens.dark : colorTokens.light

    const applyColorTokens = () => {
        const root = document.documentElement
        Object.entries(currentTokens).forEach(([key, value]) => {
            root.style.setProperty(`--${key}`, value)
        })
    }

    useEffect(() => {
        applyColorTokens()
    }, [isDark])

    return {
        colorTokens: currentTokens,
        applyColorTokens
    }
}