import React, { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
    isDark: boolean
    toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

interface ThemeProviderProps {
    children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const stored = localStorage.getItem('theme')
        return stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)
    })

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [isDark])

    const toggleDarkMode = () => {
        setIsDark(!isDark)
    }

    return (
        <ThemeContext.Provider value={{ isDark, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    )
}