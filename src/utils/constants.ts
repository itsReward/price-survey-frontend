// Application constants

// Application metadata
export const APP_CONFIG = {
    name: 'Price Survey',
    version: '1.0.0',
    description: 'Track and compare prices across multiple stores',
    author: 'Price Survey Team',
    email: 'support@pricesurvey.com',
    website: 'https://pricesurvey.com',
}

// API configuration
export const API_CONFIG = {
    baseURL: (import.meta.env?.VITE_API_URL as string) || 'http://localhost:8080/api',
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
}

// Authentication constants
export const AUTH_CONFIG = {
    tokenKey: 'token',
    refreshTokenKey: 'refreshToken',
    userKey: 'user',
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
}

// Local storage keys
export const STORAGE_KEYS = {
    theme: 'theme-preferences',
    language: 'app-language',
    userPreferences: 'user-preferences',
    recentSearches: 'recent-searches',
    viewPreferences: 'view-preferences',
    formData: 'form-data',
    dashboardLayout: 'dashboard-layout',
}

// UI constants
export const UI_CONFIG = {
    pageSize: 20,
    maxPageSize: 100,
    debounceDelay: 300,
    animationDuration: 200,
    toastDuration: 5000,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf', '.xlsx', '.csv'],
}

// Date and time constants
export const DATE_CONFIG = {
    defaultFormat: 'MM/DD/YYYY',
    timeFormat: 'HH:mm',
    dateTimeFormat: 'MM/DD/YYYY HH:mm',
    defaultTimezone: 'America/New_York',
    dateFormats: [
        { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
        { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
        { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
        { label: 'MM-DD-YYYY', value: 'MM-DD-YYYY' },
    ],
}

// Currency configuration
export const CURRENCY_CONFIG = {
    default: 'USD',
    symbol: '$',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    supported: [
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'GBP', symbol: '£', name: 'British Pound' },
        { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
        { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
        { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    ],
}

// Chart configuration
export const CHART_CONFIG = {
    colors: [
        '#10b981', // Primary green
        '#3b82f6', // Blue
        '#8b5cf6', // Purple
        '#f59e0b', // Orange
        '#ef4444', // Red
        '#06b6d4', // Cyan
        '#84cc16', // Lime
        '#f97316', // Orange
    ],
    defaultOptions: {
        responsive: true,
        maintainAspectRatio: false,
        animationDuration: 750,
    },
}

// Product categories
export const PRODUCT_CATEGORIES = [
    'Beverages',
    'Dairy & Eggs',
    'Meat & Seafood',
    'Bakery',
    'Snacks',
    'Frozen Foods',
    'Canned Goods',
    'Personal Care',
    'Household Items',
    'Baby & Kids',
    'Health & Medicine',
    'Electronics',
    'Clothing',
    'Books & Media',
    'Sports & Outdoors',
    'Other',
]

// User roles and permissions
export const ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER',
} as const

export const PERMISSIONS = {
    // User permissions
    READ_USERS: 'read:users',
    CREATE_USERS: 'create:users',
    UPDATE_USERS: 'update:users',
    DELETE_USERS: 'delete:users',

    // Store permissions
    READ_STORES: 'read:stores',
    CREATE_STORES: 'create:stores',
    UPDATE_STORES: 'update:stores',
    DELETE_STORES: 'delete:stores',

    // Product permissions
    READ_PRODUCTS: 'read:products',
    CREATE_PRODUCTS: 'create:products',
    UPDATE_PRODUCTS: 'update:products',
    DELETE_PRODUCTS: 'delete:products',

    // Price entry permissions
    READ_PRICE_ENTRIES: 'read:price-entries',
    CREATE_PRICE_ENTRIES: 'create:price-entries',
    UPDATE_PRICE_ENTRIES: 'update:price-entries',
    DELETE_PRICE_ENTRIES: 'delete:price-entries',

    // Dashboard permissions
    VIEW_DASHBOARD: 'view:dashboard',
    VIEW_ANALYTICS: 'view:analytics',

    // Admin permissions
    ADMIN_PANEL: 'admin:panel',
    SYSTEM_SETTINGS: 'admin:settings',
} as const

// Status constants
export const STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    DRAFT: 'draft',
    PUBLISHED: 'published',
} as const

// HTTP status codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
} as const

// Error messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied. You do not have permission.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    UNKNOWN_ERROR: 'An unexpected error occurred.',
}

// Success messages
export const SUCCESS_MESSAGES = {
    CREATED: 'Successfully created',
    UPDATED: 'Successfully updated',
    DELETED: 'Successfully deleted',
    SAVED: 'Successfully saved',
    UPLOADED: 'Successfully uploaded',
    SENT: 'Successfully sent',
    IMPORTED: 'Successfully imported',
    EXPORTED: 'Successfully exported',
}

// Validation rules
export const VALIDATION_RULES = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    phone: /^\+?[\d\s\-\(\)]{10,}$/,
    url: /^https?:\/\/.+$/,
    price: /^\d+(\.\d{1,2})?$/,
    quantity: /^\d+$/,
    coordinates: /^-?\d+\.?\d*$/,
}

// Regular expressions
export const REGEX = {
    ...VALIDATION_RULES,
    username: /^[a-zA-Z0-9_]{3,20}$/,
    slug: /^[a-z0-9-]+$/,
    hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    isbn: /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/,
    creditCard: /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/,
}

// Time intervals
export const TIME_INTERVALS = {
    SECOND: 1000,
    MINUTE: 60 * 1000,
    HOUR: 60 * 60 * 1000,
    DAY: 24 * 60 * 60 * 1000,
    WEEK: 7 * 24 * 60 * 60 * 1000,
    MONTH: 30 * 24 * 60 * 60 * 1000,
    YEAR: 365 * 24 * 60 * 60 * 1000,
}

// Browser support
export const BROWSER_SUPPORT = {
    minVersions: {
        chrome: 90,
        firefox: 88,
        safari: 14,
        edge: 90,
    },
    features: {
        webp: 'image/webp',
        localStorage: 'localStorage' in window,
        webWorkers: 'Worker' in window,
        geolocation: 'geolocation' in navigator,
    },
}

// Export type for use in TypeScript
export type AppRole = typeof ROLES[keyof typeof ROLES]
export type AppPermission = typeof PERMISSIONS[keyof typeof PERMISSIONS]
export type AppStatus = typeof STATUS[keyof typeof STATUS]
export type HttpStatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS]