import { useState, useEffect } from 'react'

// Generic localStorage hook
export function useLocalStorage<T>(key: string, initialValue: T) {
    // Get value from localStorage or use initial value
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error)
            return initialValue
        }
    })

    // Update localStorage when state changes
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToStore)
            window.localStorage.setItem(key, JSON.stringify(valueToStore))

            // Dispatch custom event to sync across components
            window.dispatchEvent(new CustomEvent(`localStorage-${key}`, {
                detail: valueToStore
            }))
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error)
        }
    }

    // Remove item from localStorage
    const removeValue = () => {
        try {
            setStoredValue(initialValue)
            window.localStorage.removeItem(key)
            window.dispatchEvent(new CustomEvent(`localStorage-${key}`, {
                detail: initialValue
            }))
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error)
        }
    }

    // Listen for changes in localStorage
    useEffect(() => {
        const handleStorageChange = (e: CustomEvent) => {
            if (e.type === `localStorage-${key}`) {
                setStoredValue(e.detail)
            }
        }

        window.addEventListener(`localStorage-${key}`, handleStorageChange as EventListener)

        return () => {
            window.removeEventListener(`localStorage-${key}`, handleStorageChange as EventListener)
        }
    }, [key])

    return [storedValue, setValue, removeValue] as const
}

// Hook specifically for user preferences
export function useUserPreferences() {
    const [preferences, setPreferences] = useLocalStorage('userPreferences', {
        theme: 'light',
        language: 'en',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        timezone: 'America/New_York'
    })

    const updatePreference = (key: string, value: any) => {
        setPreferences((prev: any) => ({
            ...prev,
            [key]: value
        }))
    }

    return {
        preferences,
        updatePreference,
        setPreferences
    }
}

// Hook for storing form data
export function useFormStorage(formId: string) {
    const [formData, setFormData] = useLocalStorage(`form-${formId}`, {})

    const updateField = (fieldName: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [fieldName]: value
        }))
    }

    const clearForm = () => {
        setFormData({})
    }

    return {
        formData,
        updateField,
        clearForm,
        setFormData
    }
}

// Hook for storing recent searches
export function useRecentSearches(maxItems: number = 10) {
    const [searches, setSearches] = useLocalStorage<string[]>('recentSearches', [])

    const addSearch = (searchTerm: string) => {
        if (!searchTerm.trim()) return

        setSearches(prev => {
            const filtered = prev.filter(item => item !== searchTerm)
            const updated = [searchTerm, ...filtered].slice(0, maxItems)
            return updated
        })
    }

    const removeSearch = (searchTerm: string) => {
        setSearches(prev => prev.filter(item => item !== searchTerm))
    }

    const clearSearches = () => {
        setSearches([])
    }

    return {
        searches,
        addSearch,
        removeSearch,
        clearSearches
    }
}

// Hook for tab visibility and localStorage sync
export function useLocalStorageSync<T>(key: string, initialValue: T) {
    const [value, setValue, removeValue] = useLocalStorage(key, initialValue)

    // Sync when tab becomes visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                try {
                    const item = window.localStorage.getItem(key)
                    if (item) {
                        setValue(JSON.parse(item))
                    }
                } catch (error) {
                    console.error(`Error syncing localStorage key "${key}":`, error)
                }
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }, [key, setValue])

    return [value, setValue, removeValue] as const
}