// API Endpoints Configuration
export const API_ENDPOINTS = {
    // Authentication endpoints
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        ME: '/auth/me',
        VERIFY_EMAIL: '/auth/verify-email',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
    },

    // User management endpoints
    USERS: {
        LIST: '/users',
        CREATE: '/users',
        GET: (id: number) => `/users/${id}`,
        UPDATE: (id: number) => `/users/${id}`,
        DELETE: (id: number) => `/users/${id}`,
        PROFILE: '/users/profile',
        CHANGE_PASSWORD: '/users/change-password',
        UPLOAD_AVATAR: '/users/upload-avatar',
    },

    // Store management endpoints
    STORES: {
        LIST: '/stores',
        CREATE: '/stores',
        GET: (id: number) => `/stores/${id}`,
        UPDATE: (id: number) => `/stores/${id}`,
        DELETE: (id: number) => `/stores/${id}`,
        BY_CITY: (city: string) => `/stores/city/${city}`,
        BY_REGION: (region: string) => `/stores/region/${region}`,
        MAP: '/stores/map',
        NEARBY: '/stores/nearby',
    },

    // Product management endpoints
    PRODUCTS: {
        LIST: '/products',
        CREATE: '/products',
        GET: (id: number) => `/products/${id}`,
        UPDATE: (id: number) => `/products/${id}`,
        DELETE: (id: number) => `/products/${id}`,
        BY_CATEGORY: (category: string) => `/products/category/${category}`,
        BY_BRAND: (brand: string) => `/products/brand/${brand}`,
        CATEGORIES: '/products/categories',
        VOLUMES: '/products/volumes',
        SEARCH: '/products/search',
    },

    // Price entry endpoints
    PRICE_ENTRIES: {
        LIST: '/price-entries',
        CREATE: '/price-entries',
        GET: (id: number) => `/price-entries/${id}`,
        UPDATE: (id: number) => `/price-entries/${id}`,
        DELETE: (id: number) => `/price-entries/${id}`,
        BY_STORE: (storeId: number) => `/price-entries/store/${storeId}`,
        BY_PRODUCT: (productId: number) => `/price-entries/product/${productId}`,
        BY_USER: (userId: number) => `/price-entries/user/${userId}`,
        MY_ENTRIES: '/price-entries/my-entries',
        BULK_CREATE: '/price-entries/bulk',
        EXPORT: '/price-entries/export',
    },

    // Dashboard endpoints
    DASHBOARD: {
        SUMMARY: '/dashboard',
        STATS: '/dashboard/stats',
        RECENT_ENTRIES: '/dashboard/recent-entries',
        PRICE_TRENDS: '/dashboard/price-trends',
        STORE_COMPARISON: '/dashboard/store-comparison',
        PRODUCT_ANALYSIS: '/dashboard/product-analysis',
        USER_ACTIVITY: '/dashboard/user-activity',
    },

    // Reports endpoints
    REPORTS: {
        PRICE_TRENDS: '/reports/price-trends',
        STORE_COMPARISON: '/reports/store-comparison',
        PRODUCT_ANALYSIS: '/reports/product-analysis',
        USER_ACTIVITY: '/reports/user-activity',
        EXPORT: '/reports/export',
        CUSTOM: '/reports/custom',
    },

    // File management endpoints
    FILES: {
        UPLOAD: '/files/upload',
        DOWNLOAD: (id: string) => `/files/download/${id}`,
        DELETE: (id: string) => `/files/${id}`,
        LIST: '/files',
    },

    // Notification endpoints
    NOTIFICATIONS: {
        LIST: '/notifications',
        MARK_READ: (id: number) => `/notifications/${id}/read`,
        MARK_ALL_READ: '/notifications/read-all',
        DELETE: (id: number) => `/notifications/${id}`,
        SETTINGS: '/notifications/settings',
    },

    // Admin endpoints
    ADMIN: {
        USERS: '/admin/users',
        STORES: '/admin/stores',
        PRODUCTS: '/admin/products',
        SYSTEM_STATS: '/admin/system-stats',
        AUDIT_LOGS: '/admin/audit-logs',
        SETTINGS: '/admin/settings',
        BACKUP: '/admin/backup',
        RESTORE: '/admin/restore',
    },

    // Search endpoints
    SEARCH: {
        GLOBAL: '/search',
        PRODUCTS: '/search/products',
        STORES: '/search/stores',
        USERS: '/search/users',
        SUGGESTIONS: '/search/suggestions',
    },

    // Integration endpoints (if any third-party integrations)
    INTEGRATIONS: {
        IMPORT_PRICES: '/integrations/import-prices',
        EXPORT_DATA: '/integrations/export-data',
        SYNC_STORES: '/integrations/sync-stores',
        WEBHOOK: '/integrations/webhook',
    },
}

// Helper function to build URL with query parameters
export const buildUrl = (endpoint: string, params?: Record<string, any>): string => {
    if (!params || Object.keys(params).length === 0) {
        return endpoint
    }

    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            searchParams.append(key, String(value))
        }
    })

    const queryString = searchParams.toString()
    return queryString ? `${endpoint}?${queryString}` : endpoint
}

// Helper function to get paginated endpoint
export const getPaginatedEndpoint = (
    endpoint: string,
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, any>
): string => {
    const params = {
        page,
        limit,
        ...filters,
    }
    return buildUrl(endpoint, params)
}

// Helper function to get sorted endpoint
export const getSortedEndpoint = (
    endpoint: string,
    sortBy: string,
    sortOrder: 'asc' | 'desc' = 'asc',
    filters?: Record<string, any>
): string => {
    const params = {
        sortBy,
        sortOrder,
        ...filters,
    }
    return buildUrl(endpoint, params)
}

// Default export for convenience
export default API_ENDPOINTS