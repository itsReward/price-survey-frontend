// Formatting utility functions

// Date and time formatters
export const formatDate = (
    date: string | Date,
    format: string = 'MM/DD/YYYY'
): string => {
    const d = typeof date === 'string' ? new Date(date) : date

    if (isNaN(d.getTime())) {
        return 'Invalid Date'
    }

    const pad = (num: number): string => num.toString().padStart(2, '0')

    const replacements: Record<string, string> = {
        'YYYY': d.getFullYear().toString(),
        'YY': d.getFullYear().toString().slice(-2),
        'MM': pad(d.getMonth() + 1),
        'M': (d.getMonth() + 1).toString(),
        'DD': pad(d.getDate()),
        'D': d.getDate().toString(),
        'HH': pad(d.getHours()),
        'H': d.getHours().toString(),
        'mm': pad(d.getMinutes()),
        'm': d.getMinutes().toString(),
        'ss': pad(d.getSeconds()),
        's': d.getSeconds().toString(),
        'A': d.getHours() >= 12 ? 'PM' : 'AM',
        'a': d.getHours() >= 12 ? 'pm' : 'am',
    }

    let formatted = format
    Object.entries(replacements).forEach(([key, value]) => {
        formatted = formatted.replace(new RegExp(key, 'g'), value)
    })

    return formatted
}

// Relative time formatter (e.g., "2 hours ago")
export const formatRelativeTime = (date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diff = now.getTime() - d.getTime()

    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
    ]

    for (const interval of intervals) {
        const count = Math.floor(diff / (interval.seconds * 1000))
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`
        }
    }

    return 'just now'
}

// Currency formatter
export const formatCurrency = (
    amount: number,
    currency: string = 'USD',
    options: Intl.NumberFormatOptions = {}
): string => {
    const defaultOptions: Intl.NumberFormatOptions = {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }

    const formatter = new Intl.NumberFormat('en-US', {
        ...defaultOptions,
        ...options,
    })

    return formatter.format(amount)
}

// Number formatter
export const formatNumber = (
    number: number,
    options: Intl.NumberFormatOptions = {}
): string => {
    const defaultOptions: Intl.NumberFormatOptions = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }

    const formatter = new Intl.NumberFormat('en-US', {
        ...defaultOptions,
        ...options,
    })

    return formatter.format(number)
}

// Percentage formatter
export const formatPercentage = (
    value: number,
    options: Intl.NumberFormatOptions = {}
): string => {
    const defaultOptions: Intl.NumberFormatOptions = {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
    }

    const formatter = new Intl.NumberFormat('en-US', {
        ...defaultOptions,
        ...options,
    })

    return formatter.format(value / 100)
}

// File size formatter
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Duration formatter (milliseconds to readable format)
export const formatDuration = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ${hours % 24}h`
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
}

// Phone number formatter
export const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '')

    if (cleaned.length === 10) {
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`
        }
    }

    if (cleaned.length === 11 && cleaned[0] === '1') {
        const match = cleaned.match(/^1(\d{3})(\d{3})(\d{4})$/)
        if (match) {
            return `+1 (${match[1]}) ${match[2]}-${match[3]}`
        }
    }

    return phone
}

// Capitalize first letter
export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Title case converter
export const toTitleCase = (str: string): string => {
    return str.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
}

// Kebab case converter
export const toKebabCase = (str: string): string => {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\s+/g, '-')
        .toLowerCase()
}

// Camel case converter
export const toCamelCase = (str: string): string => {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, '')
}

// Snake case converter
export const toSnakeCase = (str: string): string => {
    return str
        .replace(/\W+/g, ' ')
        .split(/ |\B(?=[A-Z])/)
        .map(word => word.toLowerCase())
        .join('_')
}

// Truncate text with ellipsis
export const truncateText = (
    text: string,
    maxLength: number,
    suffix: string = '...'
): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - suffix.length) + suffix
}

// Extract initials from name
export const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2)
}

// Format email (hide part of the email for privacy)
export const formatEmailForDisplay = (email: string): string => {
    const [name, domain] = email.split('@')
    if (name.length <= 3) return email
    return `${name.substring(0, 2)}***@${domain}`
}

// Format price change with percentage and color
export const formatPriceChange = (
    current: number,
    previous: number
): {
    formatted: string
    percentage: string
    color: 'green' | 'red' | 'gray'
    direction: 'up' | 'down' | 'flat'
} => {
    if (previous === 0) {
        return {
            formatted: formatCurrency(current),
            percentage: 'N/A',
            color: 'gray',
            direction: 'flat'
        }
    }

    const change = current - previous
    const percentage = (change / previous) * 100
    const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'flat'
    const color = change > 0 ? 'green' : change < 0 ? 'red' : 'gray'

    return {
        formatted: `${change >= 0 ? '+' : ''}${formatCurrency(change)}`,
        percentage: `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`,
        color,
        direction
    }
}

// Format validation errors for display
export const formatValidationErrors = (errors: Record<string, string[]>): string[] => {
    return Object.entries(errors).flatMap(([field, messages]) =>
        messages.map(message => `${capitalize(field)}: ${message}`)
    )
}

// Format coordinates for display
export const formatCoordinates = (lat: number, lng: number): string => {
    const formatCoord = (coord: number, isLat: boolean): string => {
        const direction = isLat
            ? (coord >= 0 ? 'N' : 'S')
            : (coord >= 0 ? 'E' : 'W')
        return `${Math.abs(coord).toFixed(6)}°${direction}`
    }

    return `${formatCoord(lat, true)}, ${formatCoord(lng, false)}`
}

// Format search query for URL
export const formatSearchQuery = (query: string): string => {
    return encodeURIComponent(query.trim().toLowerCase())
}

// Format tags for display
export const formatTags = (tags: string[]): string => {
    return tags.map(tag => `#${tag}`).join(' ')
}

// Object for easy importing of all formatters
export const formatters = {
    date: formatDate,
    relativeTime: formatRelativeTime,
    currency: formatCurrency,
    number: formatNumber,
    percentage: formatPercentage,
    fileSize: formatFileSize,
    duration: formatDuration,
    phoneNumber: formatPhoneNumber,
    capitalize,
    titleCase: toTitleCase,
    kebabCase: toKebabCase,
    camelCase: toCamelCase,
    snakeCase: toSnakeCase,
    truncate: truncateText,
    initials: getInitials,
    emailForDisplay: formatEmailForDisplay,
    priceChange: formatPriceChange,
    validationErrors: formatValidationErrors,
    coordinates: formatCoordinates,
    searchQuery: formatSearchQuery,
    tags: formatTags,
}