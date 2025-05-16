import { useEffect, useState } from 'react'

export interface UseApiOptions {
    refetchInterval?: number
    enabled?: boolean
    onSuccess?: (data: any) => void
    onError?: (error: any) => void
}

export interface UseApiState<T> {
    data: T | null
    loading: boolean
    error: Error | null
    refetch: () => Promise<void>
}

export function useApi<T>(
    apiCall: () => Promise<T>,
    options: UseApiOptions = {}
): UseApiState<T> {
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: true,
        error: null,
        refetch: async () => {}
    })

    const {
        refetchInterval,
        enabled = true,
        onSuccess,
        onError
    } = options

    const fetchData = async () => {
        if (!enabled) return

        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const data = await apiCall()
            setState(prev => ({ ...prev, data, loading: false }))
            onSuccess?.(data)
        } catch (error) {
            const err = error instanceof Error ? error : new Error('An error occurred')
            setState(prev => ({ ...prev, error: err, loading: false }))
            onError?.(err)
        }
    }

    useEffect(() => {
        if (enabled) {
            fetchData()
        }
    }, [enabled])

    // @ts-ignore
    useEffect(() => {
        if (refetchInterval && enabled) {
            const interval = setInterval(fetchData, refetchInterval)
            return () => clearInterval(interval)
        }
    }, [refetchInterval, enabled])

    const refetch = async () => {
        await fetchData()
    }

    return {
        ...state,
        refetch
    }
}

// Optimistic update hook
export function useOptimisticUpdate<T>(
    data: T,
    updateFn: (data: T) => Promise<T>
) {
    const [optimisticData, setOptimisticData] = useState(data)
    const [isUpdating, setIsUpdating] = useState(false)

    const updateOptimistically = async (optimisticUpdate: Partial<T>) => {
        setOptimisticData(current => ({ ...current, ...optimisticUpdate }))
        setIsUpdating(true)

        try {
            const result = await updateFn({ ...data, ...optimisticUpdate })
            setOptimisticData(result)
        } catch (error) {
            // Revert on error
            setOptimisticData(data)
            throw error
        } finally {
            setIsUpdating(false)
        }
    }

    useEffect(() => {
        setOptimisticData(data)
    }, [data])

    return {
        data: optimisticData,
        isUpdating,
        updateOptimistically
    }
}

// Debounced API call hook
export function useDebouncedApi<T>(
    apiCall: (query: string) => Promise<T>,
    delay: number = 300
) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (!query.trim()) {
            setResults(null)
            return
        }

        const timeoutId = setTimeout(async () => {
            setLoading(true)
            setError(null)

            try {
                const data = await apiCall(query)
                setResults(data)
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Search failed'))
            } finally {
                setLoading(false)
            }
        }, delay)

        return () => clearTimeout(timeoutId)
    }, [query, delay, apiCall])

    return {
        query,
        setQuery,
        results,
        loading,
        error
    }
}