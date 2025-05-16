import axios, { AxiosInstance, AxiosResponse } from 'axios'
import toast from 'react-hot-toast'



// Proper environment variable access for Vite
const getEnvVar = (key: string): string | undefined => {
    if (typeof import.meta.env !== 'undefined') {
        return import.meta.env[key] as string | undefined
    }
    return undefined
}

// Use the helper to get environment variables
const apiBaseUrl = getEnvVar('VITE_API_URL') || 'https://price-survey-app.onrender.com'

export { apiBaseUrl }

// Create axios instance with default config
const api: AxiosInstance = axios.create({
    baseURL: apiBaseUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)


// For error handling, type the error properly:
api.interceptors.response.use(
    (response) => response,
    (error: any) => {
        if (error?.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token')
            window.location.href = '/login'
            toast.error('Session expired. Please login again.')
        } else if (error?.response?.status === 403) {
            toast.error('Access denied. You do not have permission.')
        } else if (error?.response?.status >= 500) {
            toast.error('Server error. Please try again later.')
        } else if (error.message === 'Network Error') {
            toast.error('Network error. Please check your connection.')
        }

        return Promise.reject(error)
    }
)

class ApiService {
    async get<T>(url: string, config = {}): Promise<T> {
        try {
            const response: AxiosResponse<T> = await api.get(url, config)
            return response.data
        } catch (error) {
            console.error(`GET ${url} failed:`, error)
            throw error
        }
    }

    async post<T>(url: string, data = {}, config = {}): Promise<T> {
        try {
            console.log('API Service - POST request to:', url)
            console.log('API Service - POST data:', data)
            console.log('API Service - POST data stringified:', JSON.stringify(data))

            const response: AxiosResponse<T> = await api.post(url, data, config)
            console.log('API Service - POST response:', response)
            return response.data
        } catch (error: any) {
            console.error(`POST ${url} failed:`, error)
            // Log the request that was actually sent
            if (error?.request) {
                console.error('Request that was sent:', error.request._data)
            }
            throw error
        }
    }

    async put<T>(url: string, data = {}, config = {}): Promise<T> {
        try {
            const response: AxiosResponse<T> = await api.put(url, data, config)
            return response.data
        } catch (error) {
            console.error(`PUT ${url} failed:`, error)
            throw error
        }
    }

    async patch<T>(url: string, data = {}, config = {}): Promise<T> {
        try {
            const response: AxiosResponse<T> = await api.patch(url, data, config)
            return response.data
        } catch (error) {
            console.error(`PATCH ${url} failed:`, error)
            throw error
        }
    }

    async delete<T>(url: string, config = {}): Promise<T> {
        try {
            const response: AxiosResponse<T> = await api.delete(url, config)
            return response.data
        } catch (error) {
            console.error(`DELETE ${url} failed:`, error)
            throw error
        }
    }

    // File upload method
    async uploadFile<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response: AxiosResponse<T> = await api.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        onProgress(progress)
                    }
                },
            })
            return response.data
        } catch (error) {
            console.error(`File upload to ${url} failed:`, error)
            throw error
        }
    }

    // Download file method
    async downloadFile(url: string, filename: string): Promise<void> {
        try {
            const response = await api.get(url, {
                responseType: 'blob',
            })

            const blob = new Blob([response.data], { type: response.headers['content-type'] })
            const downloadUrl = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(downloadUrl)
        } catch (error) {
            console.error(`File download from ${url} failed:`, error)
            throw error
        }
    }

    // Get request with params
    async getWithParams<T>(url: string, params: Record<string, any>): Promise<T> {
        try {
            const response: AxiosResponse<T> = await api.get(url, { params })
            return response.data
        } catch (error) {
            console.error(`GET ${url} with params failed:`, error)
            throw error
        }
    }

    // Set auth token
    setAuthToken(token: string) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        localStorage.setItem('token', token)
    }

    // Clear auth token
    clearAuthToken() {
        delete api.defaults.headers.common['Authorization']
        localStorage.removeItem('token')
    }

    // Get current auth token
    getAuthToken(): string | null {
        return localStorage.getItem('token')
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        const token = this.getAuthToken()
        if (!token) return false

        try {
            // Check if token is expired
            const payload = JSON.parse(atob(token.split('.')[1]!))
            return payload.exp * 1000 > Date.now()
        } catch {
            return false
        }
    }
}

export const apiService = new ApiService()
export default api