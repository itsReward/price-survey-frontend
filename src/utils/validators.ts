// Email validation
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
}

// Password validation
export const validatePassword = (password: string): boolean => {
    // At least 8 characters, 1 lowercase, 1 uppercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
    return passwordRegex.test(password)
}

// Phone number validation
export const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
    return phoneRegex.test(phone.trim())
}

// URL validation
export const validateURL = (url: string): boolean => {
    const urlRegex = /^https?:\/\/.+$/
    return urlRegex.test(url.trim())
}

// Price validation
export const validatePrice = (price: string | number): {
    isValid: boolean
    error?: string
} => {
    const priceNum = typeof price === 'string' ? parseFloat(price) : price

    if (isNaN(priceNum)) {
        return { isValid: false, error: 'Price must be a valid number' }
    }

    if (priceNum < 0) {
        return { isValid: false, error: 'Price cannot be negative' }
    }

    if (priceNum > 999999.99) {
        return { isValid: false, error: 'Price cannot exceed $999,999.99' }
    }

    return { isValid: true }
}

// Quantity validation
export const validateQuantity = (quantity: string | number): {
    isValid: boolean
    error?: string
} => {
    const quantityNum = typeof quantity === 'string' ? parseInt(quantity) : quantity

    if (isNaN(quantityNum)) {
        return { isValid: false, error: 'Quantity must be a valid number' }
    }

    if (quantityNum < 1) {
        return { isValid: false, error: 'Quantity must be at least 1' }
    }

    if (quantityNum > 99999) {
        return { isValid: false, error: 'Quantity cannot exceed 99,999' }
    }

    if (!Number.isInteger(quantityNum)) {
        return { isValid: false, error: 'Quantity must be a whole number' }
    }

    return { isValid: true }
}

// Required field validation
export const validateRequired = (value: any, fieldName: string = 'This field'): {
    isValid: boolean
    error?: string
} => {
    if (value === null || value === undefined) {
        return { isValid: false, error: `${fieldName} is required` }
    }

    if (typeof value === 'string' && value.trim() === '') {
        return { isValid: false, error: `${fieldName} is required` }
    }

    if (Array.isArray(value) && value.length === 0) {
        return { isValid: false, error: `${fieldName} is required` }
    }

    return { isValid: true }
}

// String length validation
export const validateLength = (
    value: string,
    min: number,
    max?: number,
    fieldName: string = 'This field'
): {
    isValid: boolean
    error?: string
} => {
    if (value.length < min) {
        return {
            isValid: false,
            error: `${fieldName} must be at least ${min} characters`
        }
    }

    if (max && value.length > max) {
        return {
            isValid: false,
            error: `${fieldName} cannot exceed ${max} characters`
        }
    }

    return { isValid: true }
}

// Number range validation
export const validateRange = (
    value: number,
    min: number,
    max: number,
    fieldName: string = 'This field'
): {
    isValid: boolean
    error?: string
} => {
    if (value < min) {
        return {
            isValid: false,
            error: `${fieldName} must be at least ${min}`
        }
    }

    if (value > max) {
        return {
            isValid: false,
            error: `${fieldName} cannot exceed ${max}`
        }
    }

    return { isValid: true }
}

// Date validation
export const validateDate = (date: string | Date): {
    isValid: boolean
    error?: string
} => {
    const dateObj = typeof date === 'string' ? new Date(date) : date

    if (isNaN(dateObj.getTime())) {
        return { isValid: false, error: 'Invalid date format' }
    }

    // Check if date is not in the future (for creation dates)
    if (dateObj > new Date()) {
        return { isValid: false, error: 'Date cannot be in the future' }
    }

    return { isValid: true }
}

// Coordinates validation (latitude/longitude)
export const validateCoordinates = (lat: number, lng: number): {
    isValid: boolean
    errors: string[]
} => {
    const errors: string[] = []

    if (isNaN(lat) || lat < -90 || lat > 90) {
        errors.push('Latitude must be between -90 and 90')
    }

    if (isNaN(lng) || lng < -180 || lng > 180) {
        errors.push('Longitude must be between -180 and 180')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

// File validation
export const validateFile = (
    file: File,
    maxSize: number = 10 * 1024 * 1024, // 10MB default
    allowedTypes: string[] = ['.jpg', '.jpeg', '.png', '.pdf']
): {
    isValid: boolean
    error?: string
} => {
    if (file.size > maxSize) {
        return {
            isValid: false,
            error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
        }
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!allowedTypes.includes(fileExtension)) {
        return {
            isValid: false,
            error: `Only ${allowedTypes.join(', ')} files are allowed`
        }
    }

    return { isValid: true }
}

// Alphanumeric validation
export const validateAlphanumeric = (value: string, fieldName: string = 'This field'): {
    isValid: boolean
    error?: string
} => {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/

    if (!alphanumericRegex.test(value)) {
        return {
            isValid: false,
            error: `${fieldName} can only contain letters and numbers`
        }
    }

    return { isValid: true }
}

// Credit card validation (basic Luhn algorithm)
export const validateCreditCard = (cardNumber: string): {
    isValid: boolean
    error?: string
} => {
    // Remove spaces and hyphens
    const cleanNumber = cardNumber.replace(/[\s-]/g, '')

    // Check if all characters are digits
    if (!/^\d+$/.test(cleanNumber)) {
        return { isValid: false, error: 'Card number must contain only digits' }
    }

    // Check length (most cards are 13-19 digits)
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
        return { isValid: false, error: 'Invalid card number length' }
    }

    // Luhn algorithm
    let sum = 0
    let isEven = false

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cleanNumber.charAt(i))

        if (isEven) {
            digit *= 2
            if (digit > 9) {
                digit -= 9
            }
        }

        sum += digit
        isEven = !isEven
    }

    // @ts-ignore
    return {
        isValid: sum % 10 === 0,
        error: sum % 10 !== 0 ? 'Invalid card number' : undefined
    }
}

// Form validation helper
export const validateForm = (
    data: Record<string, any>,
    rules: Record<string, ValidationRule[]>
): {
    isValid: boolean
    errors: Record<string, string[]>
} => {
    const errors: Record<string, string[]> = {}

    Object.entries(rules).forEach(([field, fieldRules]) => {
        const value = data[field]
        const fieldErrors: string[] = []

        fieldRules.forEach(rule => {
            const result = rule.validator(value)
            if (!result.isValid && result.error) {
                fieldErrors.push(result.error)
            }
        })

        if (fieldErrors.length > 0) {
            errors[field] = fieldErrors
        }
    })

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}

// Custom validation rule type
export interface ValidationRule {
    validator: (value: any) => { isValid: boolean; error?: string }
    message?: string
}

// Common validation rules
// @ts-ignore
// @ts-ignore
export const commonValidationRules = {
    required: (fieldName: string = 'This field'): ValidationRule => ({
        validator: (value) => validateRequired(value, fieldName),
    }),

    email: (): ValidationRule => ({
        validator: (value) => ({
            isValid: validateEmail(value),
            error: validateEmail(value) ? undefined : 'Please enter a valid email address'
        }),
    }),

    minLength: (min: number, fieldName: string = 'This field'): ValidationRule => ({
        validator: (value) => validateLength(value, min, undefined, fieldName),
    }),

    maxLength: (max: number, fieldName: string = 'This field'): ValidationRule => ({
        validator: (value) => validateLength(value, 0, max, fieldName),
    }),

    price: (): ValidationRule => ({
        validator: validatePrice,
    }),

    quantity: (): ValidationRule => ({
        validator: validateQuantity,
    }),

    phoneNumber: (): ValidationRule => ({
        validator: (value) => ({
            isValid: validatePhoneNumber(value),
            error: validatePhoneNumber(value) ? undefined : 'Please enter a valid phone number'
        }),
    }),

    url: (): ValidationRule => ({
        validator: (value) => ({
            isValid: validateURL(value),
            error: validateURL(value) ? undefined : 'Please enter a valid URL'
        }),
    }),
}

// Validation utilities object for easy importing
export const validators = {
    email: validateEmail,
    password: validatePassword,
    phoneNumber: validatePhoneNumber,
    url: validateURL,
    price: validatePrice,
    quantity: validateQuantity,
    required: validateRequired,
    length: validateLength,
    range: validateRange,
    date: validateDate,
    coordinates: validateCoordinates,
    file: validateFile,
    alphanumeric: validateAlphanumeric,
    creditCard: validateCreditCard,
    form: validateForm,
    rules: commonValidationRules,
}