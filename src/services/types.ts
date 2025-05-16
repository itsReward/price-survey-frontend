// Common API types used across the application
export interface ApiResponse<T> {
    data: T
    message?: string
    success: boolean
    timestamp: string
}

export interface PaginatedResponse<T> {
    data: T[]
    totalItems: number
    totalPages: number
    currentPage: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

export interface ErrorResponse {
    error: string
    message: string
    statusCode: number
    timestamp: string
    path?: string
}

// Authentication types
export interface LoginCredentials {
    email: string
    password: string
}

export interface TokenResponse {
    accessToken: string
    refreshToken: string
    tokenType: string
    expiresIn: number
}

export interface UserRole {
    id: number
    name: string
    permissions: string[]
}

// Filter and sorting types
export interface BaseFilters {
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    search?: string
}

export interface DateRangeFilter {
    startDate?: string
    endDate?: string
}

// File upload types
export interface FileUploadResponse {
    id: string
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
    uploadedAt: string
}

export interface UploadProgress {
    percentage: number
    bytesUploaded: number
    totalBytes: number
}

// Validation error types
export interface ValidationError {
    field: string
    message: string
    value?: any
}

export interface ValidationErrorResponse extends ErrorResponse {
    errors: ValidationError[]
}

// Chart data types for dashboard
export interface ChartDataPoint {
    label: string
    value: number
    date?: string
    category?: string
}

export interface TimeSeriesData {
    date: string
    value: number
    category?: string
}

// Notification types
export interface NotificationData {
    id: number
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    isRead: boolean
    createdAt: string
    userId: number
}

// Settings types
export interface SystemSettings {
    maintenanceMode: boolean
    allowRegistration: boolean
    emailVerificationRequired: boolean
    defaultCurrency: string
    defaultLanguage: string
    maxFileUploadSize: number
    allowedFileTypes: string[]
}

export interface UserSettings {
    theme: 'light' | 'dark' | 'system'
    language: string
    currency: string
    timezone: string
    emailNotifications: boolean
    pushNotifications: boolean
}

// Audit log types
export interface AuditLog {
    id: number
    userId: number
    userName: string
    action: string
    resourceType: string
    resourceId: number
    details: string
    ipAddress: string
    userAgent: string
    timestamp: string
}

// Import/Export types
export interface ImportOptions {
    fileType: 'csv' | 'xlsx' | 'json'
    skipDuplicates: boolean
    updateExisting: boolean
    mappings?: Record<string, string>
}

export interface ExportOptions {
    format: 'csv' | 'xlsx' | 'json' | 'pdf'
    includeHeaders: boolean
    dateRange?: DateRangeFilter
    filters?: Record<string, any>
}

// Search types
export interface SearchRequest {
    query: string
    type?: 'products' | 'stores' | 'users' | 'all'
    filters?: Record<string, any>
    fuzzy?: boolean
    limit?: number
}

export interface SearchResult<T> {
    items: T[]
    totalCount: number
    executionTime: number
    facets?: SearchFacet[]
}

export interface SearchFacet {
    field: string
    values: Array<{
        value: string
        count: number
    }>
}

// Webhook types
export interface WebhookEvent {
    id: string
    type: string
    data: any
    timestamp: string
    signature: string
}

export interface WebhookEndpoint {
    id: number
    url: string
    events: string[]
    secretKey: string
    isActive: boolean
    createdAt: string
    lastUsed?: string
}

// Generic types for common patterns
export interface SelectOption {
    value: string | number
    label: string
    disabled?: boolean
}

export interface TreeNode<T = any> {
    id: string | number
    label: string
    data?: T
    children?: TreeNode<T>[]
    parent?: TreeNode<T>
    expanded?: boolean
    selected?: boolean
}

export interface TableColumn<T = any> {
    key: string
    title: string
    dataIndex: string
    sortable?: boolean
    filterable?: boolean
    render?: (value: any, record: T) => React.ReactNode
    width?: number | string
}

// Error handling helpers
export const isApiError = (error: any): error is ErrorResponse => {
    return error && typeof error === 'object' && 'error' in error && 'statusCode' in error
}

export const isValidationError = (error: any): error is ValidationErrorResponse => {
    return isApiError(error) && 'errors' in error
}

// Type guards
export const isPaginatedResponse = <T>(response: any): response is PaginatedResponse<T> => {
    return response && typeof response === 'object' && 'totalItems' in response
}

// Generic API response wrapper
export type ApiEndpointResponse<T> = Promise<ApiResponse<T>>
export type PaginatedApiResponse<T> = Promise<PaginatedResponse<T>>

// Re-export commonly used types from their respective files
export type { User, AssignedStore } from '../types/auth'
export type { Store } from '../types/store'
export type { Product } from '../types/product'
export type { PriceEntry } from '../types/priceEntry'
export type { DashboardData } from '../types/dashboard'